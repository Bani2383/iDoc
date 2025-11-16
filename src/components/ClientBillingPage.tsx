import { useState, useEffect } from 'react';
import { CreditCard, Download, Clock, CheckCircle, FileText, DollarSign } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { supabase } from '../lib/supabase';

interface Invoice {
  id: string;
  document_id: string;
  amount: number;
  status: string;
  created_at: string;
  document_type?: string;
}

export function ClientBillingPage() {
  const { theme } = useTheme();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    paid: 0
  });

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const { data, error } = await supabase
        .from('generated_documents')
        .select('id, document_type, price, status, created_at')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const invoiceData: Invoice[] = (data || []).map(doc => ({
        id: doc.id,
        document_id: doc.id,
        amount: doc.price,
        status: doc.status,
        created_at: doc.created_at,
        document_type: doc.document_type
      }));

      setInvoices(invoiceData);

      const total = invoiceData.reduce((sum, inv) => sum + inv.amount, 0);
      const paid = invoiceData
        .filter(inv => inv.status === 'paid' || inv.status === 'generated')
        .reduce((sum, inv) => sum + inv.amount, 0);
      const pending = invoiceData
        .filter(inv => inv.status === 'pending_payment')
        .reduce((sum, inv) => sum + inv.amount, 0);

      setStats({ total, paid, pending });
    } catch (error) {
      console.error('Error fetching invoices:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = theme === 'minimal' ? {
      draft: { icon: Clock, text: 'Brouillon', color: 'bg-gray-200 text-gray-900' },
      pending_payment: { icon: Clock, text: 'En attente', color: 'bg-gray-300 text-gray-900' },
      paid: { icon: CheckCircle, text: 'Payé', color: 'bg-gray-900 text-white' },
      generated: { icon: CheckCircle, text: 'Payé', color: 'bg-gray-900 text-white' },
    } : {
      draft: { icon: Clock, text: 'Brouillon', color: 'bg-gray-100 text-gray-700' },
      pending_payment: { icon: Clock, text: 'En attente', color: 'bg-yellow-100 text-yellow-700' },
      paid: { icon: CheckCircle, text: 'Payé', color: 'bg-green-100 text-green-700' },
      generated: { icon: CheckCircle, text: 'Payé', color: 'bg-green-100 text-green-700' },
    };

    const badge = badges[status as keyof typeof badges] || badges.draft;
    const Icon = badge.icon;

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${badge.color}`}>
        <Icon className="w-4 h-4 mr-1" />
        {badge.text}
      </span>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Facturation et Paiements</h1>
        <p className="text-gray-600">Gérez vos factures et moyens de paiement</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm font-medium">Total dépensé</span>
            <DollarSign className={`w-5 h-5 ${theme === 'minimal' ? 'text-gray-900' : 'text-blue-600'}`} />
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.total.toFixed(2)} $</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm font-medium">Payé</span>
            <CheckCircle className={`w-5 h-5 ${theme === 'minimal' ? 'text-gray-900' : 'text-green-600'}`} />
          </div>
          <p className={`text-3xl font-bold ${theme === 'minimal' ? 'text-gray-900' : 'text-green-600'}`}>{stats.paid.toFixed(2)} $</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm font-medium">En attente</span>
            <Clock className={`w-5 h-5 ${theme === 'minimal' ? 'text-gray-900' : 'text-yellow-600'}`} />
          </div>
          <p className={`text-3xl font-bold ${theme === 'minimal' ? 'text-gray-900' : 'text-yellow-600'}`}>{stats.pending.toFixed(2)} $</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm mb-8">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <CreditCard className={`w-5 h-5 mr-2 ${theme === 'minimal' ? 'text-gray-900' : 'text-blue-600'}`} />
            Moyens de paiement
          </h2>
        </div>
        <div className="p-6">
          <div className="text-center py-8">
            <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">Aucun moyen de paiement enregistré</p>
            <button
              onClick={() => alert('La gestion des cartes de crédit sera disponible prochainement. Cette fonctionnalité permettra d\'ajouter et de gérer vos moyens de paiement de manière sécurisée.')}
              className={`text-white px-6 py-2 rounded-lg font-semibold transition-colors ${theme === 'minimal' ? 'bg-black hover:bg-gray-800' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              Ajouter une carte
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <FileText className={`w-5 h-5 mr-2 ${theme === 'minimal' ? 'text-gray-900' : 'text-blue-600'}`} />
            Historique des transactions
          </h2>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <div className={`inline-block w-8 h-8 border-4 border-t-transparent rounded-full animate-spin ${theme === 'minimal' ? 'border-gray-900' : 'border-blue-600'}`}></div>
            <p className="mt-4 text-gray-600">Chargement...</p>
          </div>
        ) : invoices.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Aucune transaction pour le moment</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Document
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Montant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {invoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(invoice.created_at).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {invoice.document_type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      {invoice.amount.toFixed(2)} $
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {getStatusBadge(invoice.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {(invoice.status === 'paid' || invoice.status === 'generated') ? (
                        <button className={`font-semibold flex items-center space-x-1 ${theme === 'minimal' ? 'text-black hover:text-gray-700' : 'text-blue-600 hover:text-blue-800'}`}>
                          <Download className="w-4 h-4" />
                          <span>Facture</span>
                        </button>
                      ) : invoice.status === 'pending_payment' ? (
                        <button className={`font-semibold ${theme === 'minimal' ? 'text-black hover:text-gray-700' : 'text-yellow-600 hover:text-yellow-800'}`}>
                          Payer
                        </button>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
