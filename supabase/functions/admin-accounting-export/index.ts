import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'npm:@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    // Vérifier que l'utilisateur est admin
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || profile.role !== 'admin') {
      throw new Error('Admin access required');
    }

    // Logger l'action admin
    await supabase.rpc('log_admin_action', {
      p_admin_id: user.id,
      p_action_type: 'export_accounting',
      p_details: { format: 'csv' },
    });

    // Extraire les paramètres de date
    const url = new URL(req.url);
    const fromDate = url.searchParams.get('from');
    const toDate = url.searchParams.get('to');

    // Requête pour obtenir toutes les transactions
    let query = supabase
      .from('accounting_log')
      .select(`
        *,
        user_profiles!accounting_log_created_by_fkey(email, full_name)
      `)
      .order('created_at', { ascending: false });

    if (fromDate) {
      query = query.gte('created_at', fromDate);
    }
    if (toDate) {
      query = query.lte('created_at', toDate);
    }

    const { data: transactions, error } = await query;

    if (error) {
      throw error;
    }

    // Obtenir les détails des purchases associées
    const purchaseIds = transactions
      .filter(t => t.reference_type === 'purchase')
      .map(t => t.reference_id);

    const { data: purchases } = await supabase
      .from('purchases')
      .select('id, user_id, user_profiles!purchases_user_id_fkey(email)')
      .in('id', purchaseIds);

    const purchaseMap = new Map();
    purchases?.forEach(p => {
      purchaseMap.set(p.id, p);
    });

    // Générer le CSV
    const csvHeaders = [
      'Date',
      'Type Transaction',
      'Montant HT',
      'Taxes',
      'Montant TTC',
      'Pays',
      'Province/État',
      'Devise',
      'Email Client',
      'Référence',
      'Statut',
      'Notes',
    ];

    const csvRows = transactions.map(t => {
      const purchase = purchaseMap.get(t.reference_id);
      const amountHT = parseFloat(t.amount || 0) - parseFloat(t.tax_amount || 0);
      const amountTTC = parseFloat(t.amount || 0);
      const taxes = parseFloat(t.tax_amount || 0);

      return [
        new Date(t.created_at).toISOString().split('T')[0],
        t.type,
        amountHT.toFixed(2),
        taxes.toFixed(2),
        amountTTC.toFixed(2),
        t.country || '',
        t.province_or_state || '',
        t.currency,
        purchase?.user_profiles?.email || '',
        t.reference_id || '',
        t.type,
        (t.notes || '').replace(/,/g, ';').replace(/\n/g, ' '),
      ];
    });

    // Construire le CSV
    const csv = [
      csvHeaders.join(','),
      ...csvRows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    return new Response(csv, {
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="accounting-export-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    });
  } catch (error) {
    console.error('Export error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
