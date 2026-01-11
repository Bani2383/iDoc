import { Resend } from 'npm:resend@2.0.0';
import { getCorsHeaders } from '../_shared/cors.ts';

const resend = new Resend(Deno.env.get('RESEND_API_KEY'));
const corsHeaders = getCorsHeaders();

interface EmailRequest {
  to: string[];
  subject: string;
  html: string;
  from?: string;
  replyTo?: string;
}

interface EmailResponse {
  success: boolean;
  id?: string;
  error?: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { to, subject, html, from, replyTo } = await req.json() as EmailRequest;

    // Validation
    if (!to || to.length === 0) {
      return new Response(
        JSON.stringify({ success: false, error: 'Recipient email(s) required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!subject || subject.trim() === '') {
      return new Response(
        JSON.stringify({ success: false, error: 'Email subject required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!html || html.trim() === '') {
      return new Response(
        JSON.stringify({ success: false, error: 'Email content required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check API key
    if (!Deno.env.get('RESEND_API_KEY')) {
      return new Response(
        JSON.stringify({ success: false, error: 'Resend API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Send email via Resend
    const { data, error } = await resend.emails.send({
      from: from || 'iDoc Alerts <alerts@id0c.com>',
      to,
      subject,
      html,
      ...(replyTo && { replyTo })
    });

    if (error) {
      console.error('Resend error:', error);
      return new Response(
        JSON.stringify({ success: false, error: error.message }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const response: EmailResponse = {
      success: true,
      id: data?.id
    };

    return new Response(
      JSON.stringify(response),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Send email error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
