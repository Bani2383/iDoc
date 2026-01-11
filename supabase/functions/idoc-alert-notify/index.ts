import { createClient } from 'npm:@supabase/supabase-js@2.57.4';
import { getCorsHeaders } from '../_shared/cors.ts';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = getCorsHeaders();

interface AlertNotification {
  alert_id: string;
  template_id?: string;
  severity: string;
  alert_type: string;
  message: string;
  details?: any;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    const notification: AlertNotification = await req.json();

    if (!notification.alert_id) {
      return new Response(
        JSON.stringify({ error: 'alert_id is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get alert settings
    const { data: settings } = await supabase
      .from('alert_settings')
      .select('*')
      .single();

    if (!settings) {
      return new Response(
        JSON.stringify({ error: 'Alert settings not configured' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if we should notify for this severity
    const severityLevels = { LOW: 1, MEDIUM: 2, HIGH: 3, CRITICAL: 4 };
    const alertLevel = severityLevels[notification.severity as keyof typeof severityLevels] || 1;
    const minLevel = severityLevels[settings.min_severity_level as keyof typeof severityLevels] || 1;

    if (alertLevel < minLevel) {
      return new Response(
        JSON.stringify({ message: 'Alert below minimum severity threshold', skipped: true }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const results = {
      email_sent: false,
      slack_sent: false,
      errors: [] as string[]
    };

    // Format message
    const severityEmoji = {
      LOW: '🔵',
      MEDIUM: '🟡',
      HIGH: '🟠',
      CRITICAL: '🔴'
    };

    const emoji = severityEmoji[notification.severity as keyof typeof severityEmoji] || '⚠️';
    const templateInfo = notification.template_id
      ? `\n📄 Template: ${notification.template_id}`
      : '';

    const formattedMessage = `${emoji} **${notification.severity}** - ${notification.alert_type}\n\n${notification.message}${templateInfo}`;

    // Send Email
    if (settings.email_enabled && settings.email_recipients?.length > 0) {
      try {
        // In production, use a proper email service (SendGrid, Mailgun, etc.)
        // For now, we'll use a mock implementation
        const emailPayload = {
          to: settings.email_recipients,
          subject: `[iDoc Alert] ${notification.severity} - ${notification.alert_type}`,
          body: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #f8f9fa; padding: 20px; border-left: 4px solid #dc3545; margin-bottom: 20px; }
    .severity { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
    .alert-type { font-size: 18px; color: #666; margin-bottom: 10px; }
    .message { background: white; padding: 15px; border: 1px solid #ddd; margin-bottom: 20px; }
    .details { background: #f8f9fa; padding: 15px; font-family: monospace; font-size: 12px; overflow-x: auto; }
    .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="severity">${emoji} ${notification.severity} Alert</div>
      <div class="alert-type">${notification.alert_type}</div>
      ${notification.template_id ? `<div>Template ID: ${notification.template_id}</div>` : ''}
    </div>

    <div class="message">
      ${notification.message}
    </div>

    ${notification.details ? `
      <div class="details">
        <strong>Details:</strong><br>
        ${JSON.stringify(notification.details, null, 2)}
      </div>
    ` : ''}

    <div class="footer">
      <p>This is an automated alert from iDoc Template Management System</p>
      <p>Alert ID: ${notification.alert_id}</p>
    </div>
  </div>
</body>
</html>
          `,
          timestamp: new Date().toISOString()
        };

        // Log the email (in production, actually send it)
        console.log('Email would be sent:', emailPayload);
        results.email_sent = true;

        // Update alert record
        await supabase
          .from('template_alerts')
          .update({ sent_email: true })
          .eq('id', notification.alert_id);

      } catch (error) {
        console.error('Email sending failed:', error);
        results.errors.push(`Email: ${error.message}`);
      }
    }

    // Send Slack notification
    if (settings.slack_enabled && settings.slack_webhook_url) {
      try {
        const slackPayload = {
          blocks: [
            {
              type: 'header',
              text: {
                type: 'plain_text',
                text: `${emoji} ${notification.severity} Alert`,
                emoji: true
              }
            },
            {
              type: 'section',
              fields: [
                {
                  type: 'mrkdwn',
                  text: `*Type:*\n${notification.alert_type}`
                },
                {
                  type: 'mrkdwn',
                  text: `*Severity:*\n${notification.severity}`
                }
              ]
            },
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: `*Message:*\n${notification.message}`
              }
            }
          ]
        };

        if (notification.template_id) {
          slackPayload.blocks.push({
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `*Template ID:* \`${notification.template_id}\``
            }
          });
        }

        if (notification.details) {
          slackPayload.blocks.push({
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `*Details:*\n\`\`\`${JSON.stringify(notification.details, null, 2)}\`\`\``
            }
          });
        }

        // Send to Slack
        const slackResponse = await fetch(settings.slack_webhook_url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(slackPayload)
        });

        if (slackResponse.ok) {
          results.slack_sent = true;

          // Update alert record
          await supabase
            .from('template_alerts')
            .update({ sent_slack: true })
            .eq('id', notification.alert_id);
        } else {
          const errorText = await slackResponse.text();
          throw new Error(`Slack API error: ${errorText}`);
        }

      } catch (error) {
        console.error('Slack sending failed:', error);
        results.errors.push(`Slack: ${error.message}`);
      }
    }

    return new Response(
      JSON.stringify({
        alert_id: notification.alert_id,
        ...results,
        success: results.errors.length === 0
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Notification error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
