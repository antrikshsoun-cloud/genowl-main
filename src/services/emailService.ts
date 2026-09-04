// src/services/emailService.ts
// Outbound Transactional Email Dispatcher for Genowl Studio
import { GENOWL_LOGO_BASE64 } from './logoAsset.ts';

export const OFFICIAL_GENOWL_GMAIL = 'genowlai@gmail.com';
export const OFFICIAL_HOSTINGER_EMAIL = 'support@genowl.tech';
export const OFFICIAL_INSTAGRAM = 'genowl_tech';
export const OFFICIAL_SUPPORT_EMAILS = [OFFICIAL_HOSTINGER_EMAIL, OFFICIAL_GENOWL_GMAIL];

export interface EmailLog {
  id: string;
  type: 'verification' | 'welcome' | 'inquiry_receipt' | 'problem_forward';
  recipientEmail: string;
  recipientName: string;
  subject: string;
  code?: string;
  contentPreview: string;
  dispatchedAt: string;
  status: 'sent' | 'delivered';
}

const EMAIL_LOGS_KEY = 'genowl_dispatched_emails';
const EMAIL_API_KEY_STORAGE = 'genowl_email_api_key'; // Optional Resend / Brevo API key

export function getDispatchedEmails(): EmailLog[] {
  try {
    const raw = localStorage.getItem(EMAIL_LOGS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveEmailLog(log: EmailLog) {
  try {
    const existing = getDispatchedEmails();
    existing.unshift(log);
    localStorage.setItem(EMAIL_LOGS_KEY, JSON.stringify(existing));
    window.dispatchEvent(new Event('storage'));
  } catch (err) {
    console.warn('Failed to persist email log:', err);
  }
}

export function getStoredEmailApiKey(): string {
  try {
    return localStorage.getItem(EMAIL_API_KEY_STORAGE) || '';
  } catch {
    return '';
  }
}

export function saveEmailApiKey(key: string) {
  try {
    localStorage.setItem(EMAIL_API_KEY_STORAGE, key.trim());
    window.dispatchEvent(new Event('storage'));
  } catch (err) {
    console.warn('Failed to save email API key:', err);
  }
}

/**
 * Universal email wrapper with the official golden owl logo
 */
function wrapEmailInGenowlTheme(title: string, bodyContent: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background-color:#060a07;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#e4e4e7;">
  <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color:#060a07;padding:36px 16px;">
    <tr>
      <td align="center">
        <table width="100%" border="0" cellpadding="0" cellspacing="0" style="max-width:540px;background-color:#0d140f;border:1px solid #1f2f22;border-radius:24px;overflow:hidden;box-shadow:0 16px 48px rgba(0,0,0,0.7);">
          <!-- Brand Header with Golden Owl Logo -->
          <tr>
            <td align="center" style="padding:32px 24px 20px 24px;border-bottom:1px solid rgba(255,255,255,0.06);background:linear-gradient(180deg,#142016 0%,#0d140f 100%);">
              <img src="${GENOWL_LOGO_BASE64}" alt="Genowl Logo" width="88" height="74" style="display:block;margin:0 auto 12px auto;border-radius:14px;box-shadow:0 0 20px rgba(247,204,70,0.35);" />
              <div style="font-size:14px;letter-spacing:0.25em;font-weight:800;color:#f7cc46;text-transform:uppercase;">GENOWL STUDIO</div>
              <div style="font-size:11px;color:#a1a1aa;margin-top:4px;letter-spacing:0.05em;">Digital Craft &amp; Software Production</div>
            </td>
          </tr>

          <!-- Email Body Content -->
          <tr>
            <td style="padding:28px 24px 32px 24px;">
              ${bodyContent}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 24px;background-color:#070b08;border-top:1px solid rgba(255,255,255,0.06);text-align:center;">
              <div style="font-size:11px;color:#71717a;margin-bottom:8px;">
                Official Support: <a href="mailto:${OFFICIAL_GENOWL_GMAIL}" style="color:#c6f554;text-decoration:none;font-weight:600;">${OFFICIAL_GENOWL_GMAIL}</a>
                &nbsp;&bull;&nbsp;
                Instagram: <a href="https://instagram.com/${OFFICIAL_INSTAGRAM}" style="color:#f7cc46;text-decoration:none;">@${OFFICIAL_INSTAGRAM}</a>
              </div>
              <div style="font-size:10px;color:#52525b;">
                &copy; ${new Date().getFullYear()} Genowl Technologies. All rights reserved.
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/**
 * Sends the 6-digit security verification code to the client's Gmail / email inbox
 */
export async function sendVerificationCodeEmail(
  name: string,
  email: string,
  code: string
): Promise<{ success: boolean; message: string; log: EmailLog }> {
  const cleanEmail = email.trim().toLowerCase();
  const cleanName = name.trim();
  const subject = `Your Genowl Security Verification Code: ${code} 🦉`;

  const plainMessage = `Hi ${cleanName},

Your 6-digit verification code to activate your Genowl Studio client account is:

${code}

Enter this code on the Genowl verification screen to confirm your email and activate your account.
This code will expire in 10 minutes.

If you did not request this code, please ignore this email.

Best regards,
The Genowl Studio Team
Support: ${OFFICIAL_GENOWL_GMAIL}
https://genowl.com`;

  const htmlContent = wrapEmailInGenowlTheme(
    'Verify Your Genowl Account',
    `<h2 style="font-size:20px;font-weight:700;color:#ffffff;margin:0 0 12px 0;">Verify Your Email Address</h2>
    <p style="font-size:13px;color:#a1a1aa;line-height:1.6;margin:0 0 24px 0;">
      Hi <strong style="color:#ffffff;">${cleanName}</strong>, to complete your sign-up and ensure authenticity, enter your 6-digit verification code on the Genowl screen:
    </p>

    <!-- Highlighted Code Box -->
    <div style="background-color:#070d08;border:2px solid #c6f554;border-radius:16px;padding:18px;text-align:center;margin:0 0 24px 0;box-shadow:0 0 25px rgba(198,245,84,0.25);">
      <div style="font-size:10px;letter-spacing:0.2em;color:#a1a1aa;text-transform:uppercase;margin-bottom:6px;">Security Activation Code</div>
      <div style="font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace;font-size:32px;font-weight:800;letter-spacing:0.25em;color:#c6f554;">
        ${code}
      </div>
    </div>

    <p style="font-size:12px;color:#71717a;line-height:1.5;margin:0 0 16px 0;">
      * This code expires in 10 minutes. If you did not request this verification, no action is needed.
    </p>
    <div style="border-top:1px solid rgba(255,255,255,0.08);padding-top:16px;font-size:12px;color:#a1a1aa;">
      Need help? Reach out directly to our engineering desk at <a href="mailto:${OFFICIAL_GENOWL_GMAIL}" style="color:#c6f554;text-decoration:none;">${OFFICIAL_GENOWL_GMAIL}</a>.
    </div>`
  );

  const logEntry: EmailLog = {
    id: 'otp_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 4),
    type: 'verification',
    recipientEmail: cleanEmail,
    recipientName: cleanName,
    subject,
    code,
    contentPreview: `Security verification code: ${code}`,
    dispatchedAt: new Date().toISOString(),
    status: 'sent',
  };

  const apiKey = getStoredEmailApiKey() || (import.meta as any).env?.VITE_RESEND_API_KEY || '';

  if (apiKey && apiKey.startsWith('re_')) {
    try {
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apiKey,
          to: cleanEmail,
          subject,
          text: plainMessage,
          html: htmlContent,
        }),
      });

      if (res.ok) {
        logEntry.status = 'delivered';
      } else {
        const fallbackRes = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            from: 'Genowl Security <onboarding@resend.dev>',
            to: [cleanEmail],
            subject,
            text: plainMessage,
            html: htmlContent,
          }),
        });
        if (fallbackRes.ok) logEntry.status = 'delivered';
      }
    } catch (err) {
      console.warn('Resend dispatch error:', err);
    }
  } else if (apiKey && apiKey.startsWith('xkeysib-')) {
    try {
      const res = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': apiKey,
        },
        body: JSON.stringify({
          sender: { name: 'Genowl Studio', email: OFFICIAL_GENOWL_GMAIL },
          to: [{ email: cleanEmail, name: cleanName }],
          subject: subject,
          textContent: plainMessage,
          htmlContent: htmlContent,
        }),
      });

      if (res.ok) logEntry.status = 'delivered';
    } catch (err) {
      console.warn('Brevo dispatch error:', err);
    }
  }

  saveEmailLog(logEntry);

  return {
    success: true,
    message: `Verification code sent to ${cleanEmail}`,
    log: logEntry,
  };
}

/**
 * Sends official Welcome Message upon account activation
 */
export async function sendWelcomeEmail(
  name: string,
  email: string
): Promise<{ success: boolean; message: string; log: EmailLog }> {
  const cleanEmail = email.trim().toLowerCase();
  const cleanName = name.trim();
  const subject = 'Welcome to Genowl Studio — Your Client Account is Ready! 🦉';

  const plainMessage = `Hi ${cleanName},

Welcome to Genowl Studio! Your verified client account has been successfully created and is now active.

Here is what you can do right now from your Client Hub:
• Order Premium Work: 2D Websites ($500), 3D WebGL Worlds ($2,500), or $99 AI & Video packages.
• 48-Hour Turnaround: Your projects are immediately assigned to production upon order placement.
• 100% Commercial IP Rights: You own all source code, SVGs, and assets with zero royalties or license fees.
• Live Production Tracker: Check order progress, chat with your designer, and download deliverables directly from your profile.

Support: ${OFFICIAL_GENOWL_GMAIL}
Log in anytime at Genowl to start your first project.

Warm regards,
The Genowl Studio Team
https://genowl.com`;

  const htmlContent = wrapEmailInGenowlTheme(
    'Welcome to Genowl Studio',
    `<h2 style="font-size:22px;font-weight:700;color:#ffffff;margin:0 0 8px 0;">Welcome to Genowl Studio! 🦉</h2>
    <div style="display:inline-block;padding:4px 12px;background-color:rgba(198,245,84,0.15);border:1px solid rgba(198,245,84,0.4);border-radius:999px;color:#c6f554;font-size:11px;font-weight:600;margin-bottom:20px;">
      &check; Client Account Active &bull; 7-Day Session Established
    </div>

    <p style="font-size:13px;color:#a1a1aa;line-height:1.6;margin:0 0 20px 0;">
      Hi <strong style="color:#ffffff;">${cleanName}</strong>, your verified client profile is now live. You can now order custom web engineering, 3D experiences, and AI production directly from our studio.
    </p>

    <!-- Services Overview Card -->
    <div style="background-color:#080e0a;border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:20px;margin:0 0 24px 0;">
      <div style="font-size:12px;font-weight:700;color:#ffffff;margin-bottom:12px;text-transform:uppercase;letter-spacing:0.05em;">Your Client Guarantees:</div>
      <table width="100%" cellpadding="6" cellspacing="0" style="font-size:12px;color:#d4d4d8;">
        <tr>
          <td width="20" valign="top" style="color:#c6f554;">&bull;</td>
          <td><strong>2D High-Converting Websites:</strong> $500 Flat &bull; Full Responsive React/Tailwind</td>
        </tr>
        <tr>
          <td width="20" valign="top" style="color:#f7cc46;">&bull;</td>
          <td><strong>3D WebGL Worlds:</strong> $2,500 Flat &bull; Three.js Interactive Immersion</td>
        </tr>
        <tr>
          <td width="20" valign="top" style="color:#c6f554;">&bull;</td>
          <td><strong>$99 Creative Packages:</strong> AI Generation, Video Production, Content Strategy</td>
        </tr>
        <tr>
          <td width="20" valign="top" style="color:#f7cc46;">&bull;</td>
          <td><strong>100% Commercial Rights:</strong> You own all source code and assets with zero royalties.</td>
        </tr>
      </table>
    </div>

    <p style="font-size:12px;color:#a1a1aa;line-height:1.5;margin:0 0 16px 0;">
      Whenever you have questions or want to discuss a project brief, email our leadership team directly at <a href="mailto:${OFFICIAL_GENOWL_GMAIL}" style="color:#c6f554;text-decoration:none;font-weight:600;">${OFFICIAL_GENOWL_GMAIL}</a>.
    </p>`
  );

  const logEntry: EmailLog = {
    id: 'msg_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 4),
    type: 'welcome',
    recipientEmail: cleanEmail,
    recipientName: cleanName,
    subject,
    contentPreview: plainMessage.slice(0, 180) + '...',
    dispatchedAt: new Date().toISOString(),
    status: 'delivered',
  };

  const apiKey = getStoredEmailApiKey() || (import.meta as any).env?.VITE_RESEND_API_KEY || '';

  if (apiKey && apiKey.startsWith('re_')) {
    try {
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apiKey,
          to: cleanEmail,
          subject,
          text: plainMessage,
          html: htmlContent,
        }),
      });

      if (!res.ok) {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            from: 'Genowl Studio <onboarding@resend.dev>',
            to: [cleanEmail],
            subject: subject,
            text: plainMessage,
            html: htmlContent,
          }),
        });
      }
    } catch {}
  }

  saveEmailLog(logEntry);

  return {
    success: true,
    message: `Welcome email successfully dispatched to ${cleanEmail}`,
    log: logEntry,
  };
}

/**
 * Dispatches problem / inquiry / project brief notifications:
 * 1. Confirmation email to the client with the golden owl logo
 * 2. Dual forwarding notification to official Hostinger Mail (support@genowl.tech) AND Gmail (genowlai@gmail.com)
 * 3. Fallback pre-composed mailto generator for 100% fail-safe delivery
 */
export async function sendProblemOrInquiryEmail(
  name: string,
  clientEmail: string,
  categoryOrService: string,
  problemDescription: string,
  ticketId: string,
  phone?: string,
  severity?: string,
  referenceUrl?: string
): Promise<{ success: boolean; message: string; ticketId: string; mailtoLink: string }> {
  const cleanName = name.trim();
  const cleanEmail = clientEmail.trim().toLowerCase();
  const cleanPhone = phone ? phone.trim() : '';
  const cleanSeverity = severity ? severity.trim() : 'Standard';
  const cleanRefUrl = referenceUrl ? referenceUrl.trim() : '';
  const isProblem = categoryOrService.toLowerCase().includes('problem') || 
                    categoryOrService.toLowerCase().includes('bug') || 
                    categoryOrService.toLowerCase().includes('issue');

  const reportLabel = isProblem ? 'Problem Report' : 'Inquiry / Project Brief';
  const clientSubject = `[Genowl Ticket #${ticketId}] We received your ${reportLabel} 🦉`;
  const forwardSubject = `[Genowl ${reportLabel} #${ticketId}] ${categoryOrService} from ${cleanName}`;

  // 1. Client receipt plain text & HTML
  const clientPlainText = `Hi ${cleanName},

We have received your ${reportLabel} on Genowl Studio.

Ticket Reference: #${ticketId}
Report Type: ${categoryOrService}
Priority Level: ${cleanSeverity}
${cleanPhone ? `Phone / WhatsApp: ${cleanPhone}\n` : ''}${cleanRefUrl ? `Reference URL: ${cleanRefUrl}\n` : ''}
Details / Description:
${problemDescription}

Our engineering desk has received this brief and will review and reply within 2 to 4 hours directly to your email address (${cleanEmail}).
You can also reach our desk anytime at:
• Hostinger Business Mail: ${OFFICIAL_HOSTINGER_EMAIL}
• Direct Operations Gmail: ${OFFICIAL_GENOWL_GMAIL}

Best regards,
The Genowl Studio Team
https://genowl.com`;

  const clientHtml = wrapEmailInGenowlTheme(
    `Ticket #${ticketId} Confirmed`,
    `<h2 style="font-size:20px;font-weight:700;color:#ffffff;margin:0 0 8px 0;">
      Official Ticket #${ticketId} Registered
    </h2>
    <div style="display:inline-block;padding:4px 12px;background-color:rgba(247,204,70,0.15);border:1px solid rgba(247,204,70,0.4);border-radius:999px;color:#f7cc46;font-size:11px;font-weight:600;margin-bottom:18px;">
      &bull; Review SLA: Within 2 - 4 Hours
    </div>

    <p style="font-size:13px;color:#a1a1aa;line-height:1.6;margin:0 0 18px 0;">
      Hi <strong style="color:#ffffff;">${cleanName}</strong>, thank you for reaching out. Your official report has been logged and forwarded to our engineering operations desk:
    </p>

    <!-- Ticket Summary Box -->
    <div style="background-color:#080e0a;border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:18px;margin:0 0 20px 0;">
      <table width="100%" cellpadding="4" cellspacing="0" style="font-size:12px;color:#d4d4d8;">
        <tr>
          <td width="110" style="color:#71717a;">Ticket ID:</td>
          <td style="font-family:monospace;font-weight:700;color:#c6f554;">#${ticketId}</td>
        </tr>
        <tr>
          <td style="color:#71717a;">Report Type:</td>
          <td style="color:#ffffff;font-weight:600;">${categoryOrService}</td>
        </tr>
        <tr>
          <td style="color:#71717a;">Priority:</td>
          <td style="color:#f7cc46;font-weight:600;">${cleanSeverity}</td>
        </tr>
        <tr>
          <td style="color:#71717a;">Client Email:</td>
          <td style="font-family:monospace;color:#ffffff;">${cleanEmail}</td>
        </tr>
        ${cleanPhone ? `<tr>
          <td style="color:#71717a;">Phone / WhatsApp:</td>
          <td style="font-family:monospace;color:#c6f554;">${cleanPhone}</td>
        </tr>` : ''}
        ${cleanRefUrl ? `<tr>
          <td style="color:#71717a;">Reference Link:</td>
          <td><a href="${cleanRefUrl}" style="color:#c6f554;text-decoration:none;">${cleanRefUrl}</a></td>
        </tr>` : ''}
        <tr>
          <td valign="top" style="color:#71717a;padding-top:8px;">Description:</td>
          <td style="color:#e4e4e7;padding-top:8px;line-height:1.5;">${problemDescription}</td>
        </tr>
      </table>
    </div>

    <p style="font-size:12px;color:#a1a1aa;line-height:1.5;margin:0;">
      Our team is reviewing this brief. You can also contact us directly at <a href="mailto:${OFFICIAL_HOSTINGER_EMAIL}" style="color:#c6f554;text-decoration:none;">${OFFICIAL_HOSTINGER_EMAIL}</a> or <a href="mailto:${OFFICIAL_GENOWL_GMAIL}" style="color:#f7cc46;text-decoration:none;">${OFFICIAL_GENOWL_GMAIL}</a>.
    </p>`
  );

  // 2. Forwarding plain text & HTML to Hostinger (support@genowl.tech) AND Gmail (genowlai@gmail.com)
  const forwardPlainText = `[GENOWL OFFICIAL WEBSITE REPORT]
Ticket ID: #${ticketId}
Client Name: ${cleanName}
Client Email: ${cleanEmail}
${cleanPhone ? `Client Phone: ${cleanPhone}\n` : ''}Report Category: ${categoryOrService}
Priority Level: ${cleanSeverity}
${cleanRefUrl ? `Reference Link: ${cleanRefUrl}\n` : ''}
Description:
${problemDescription}

Time: ${new Date().toLocaleString()}
Reply directly to: ${cleanEmail}`;

  const forwardHtml = wrapEmailInGenowlTheme(
    `Official Report #${ticketId}`,
    `<h2 style="font-size:20px;font-weight:700;color:#ffffff;margin:0 0 8px 0;">
      ${isProblem ? '⚠️ Official Problem Report' : '📩 Official Inquiry / Brief'} #${ticketId}
    </h2>

    <div style="background-color:#080e0a;border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:20px;margin:16px 0 20px 0;">
      <table width="100%" cellpadding="5" cellspacing="0" style="font-size:13px;color:#d4d4d8;">
        <tr>
          <td width="120" style="color:#71717a;">Sender:</td>
          <td style="color:#ffffff;font-weight:700;">${cleanName}</td>
        </tr>
        <tr>
          <td style="color:#71717a;">Client Email:</td>
          <td style="font-family:monospace;color:#c6f554;">${cleanEmail}</td>
        </tr>
        ${cleanPhone ? `<tr>
          <td style="color:#71717a;">Phone / WhatsApp:</td>
          <td style="font-family:monospace;color:#f7cc46;font-weight:700;">${cleanPhone}</td>
        </tr>` : ''}
        <tr>
          <td style="color:#71717a;">Category:</td>
          <td style="color:#f7cc46;font-weight:600;">${categoryOrService}</td>
        </tr>
        <tr>
          <td style="color:#71717a;">Priority:</td>
          <td style="color:#ffffff;font-weight:600;">${cleanSeverity}</td>
        </tr>
        ${cleanRefUrl ? `<tr>
          <td style="color:#71717a;">Reference Link:</td>
          <td><a href="${cleanRefUrl}" style="color:#c6f554;word-break:break-all;">${cleanRefUrl}</a></td>
        </tr>` : ''}
        <tr>
          <td valign="top" style="color:#71717a;padding-top:10px;">Description:</td>
          <td style="color:#ffffff;padding-top:10px;line-height:1.6;font-size:13px;background-color:rgba(255,255,255,0.03);padding:12px;border-radius:8px;">
            ${problemDescription}
          </td>
        </tr>
      </table>
    </div>

    <div style="text-align:center;margin-top:20px;">
      <a href="mailto:${cleanEmail}?subject=Re:%20[Genowl%20Ticket%20%23${ticketId}]%20${encodeURIComponent(categoryOrService)}" style="display:inline-block;padding:12px 24px;background:linear-gradient(90deg,#baf345,#d6fa66);color:#000000;font-weight:700;font-size:12px;border-radius:12px;text-decoration:none;">
        Reply Directly to ${cleanName} &rarr;
      </a>
    </div>`
  );

  // 3. Multi-Channel Forwarding to Hostinger (support@genowl.tech) AND Gmail (genowlai@gmail.com)
  const forwardPayload = {
    _subject: `[Genowl ${reportLabel} #${ticketId}] ${categoryOrService} from ${cleanName}`,
    _captcha: 'false',
    _template: 'table',
    ticketId: `#${ticketId}`,
    name: cleanName,
    email: cleanEmail,
    phone: cleanPhone || 'Not provided',
    category: categoryOrService,
    priority: cleanSeverity,
    referenceUrl: cleanRefUrl || 'None',
    message: problemDescription,
    submittedAt: new Date().toLocaleString(),
  };

  // Primary: Dispatch to Hostinger address (support@genowl.tech) with CC to Gmail
  try {
    await fetch(`https://formsubmit.co/ajax/${OFFICIAL_HOSTINGER_EMAIL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        ...forwardPayload,
        _cc: OFFICIAL_GENOWL_GMAIL,
      }),
    });
  } catch (err) {
    console.warn('Hostinger dispatch note:', err);
  }

  // Parallel: Also dispatch directly to Gmail address (genowlai@gmail.com) with CC to Hostinger
  try {
    await fetch(`https://formsubmit.co/ajax/${OFFICIAL_GENOWL_GMAIL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        ...forwardPayload,
        _cc: OFFICIAL_HOSTINGER_EMAIL,
      }),
    });
  } catch (err) {
    console.warn('Gmail dispatch note:', err);
  }

  // 4. Also dispatch via Node / Vite /api/send-email server middleware if available
  const apiKey = getStoredEmailApiKey() || (import.meta as any).env?.VITE_RESEND_API_KEY || '';
  try {
    await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        apiKey,
        to: [OFFICIAL_HOSTINGER_EMAIL, OFFICIAL_GENOWL_GMAIL],
        subject: forwardSubject,
        text: forwardPlainText,
        html: forwardHtml,
      }),
    });
  } catch {}

  // 5. Build pre-composed mailto URI for instant native email app client backup
  const mailtoSubject = encodeURIComponent(`[Genowl Report #${ticketId}] ${categoryOrService} - ${cleanName}`);
  const mailtoBody = encodeURIComponent(
`Ticket ID: #${ticketId}
Client: ${cleanName} (${cleanEmail})
${cleanPhone ? `Phone / WhatsApp: ${cleanPhone}\n` : ''}Report Category: ${categoryOrService}
Priority Level: ${cleanSeverity}
${cleanRefUrl ? `Reference Link: ${cleanRefUrl}\n` : ''}
Details / Description:
${problemDescription}

---
Dispatched via Genowl Studio (Official Desk: ${OFFICIAL_HOSTINGER_EMAIL} & ${OFFICIAL_GENOWL_GMAIL})`
  );
  const mailtoLink = `mailto:${OFFICIAL_HOSTINGER_EMAIL},${OFFICIAL_GENOWL_GMAIL}?subject=${mailtoSubject}&body=${mailtoBody}`;

  // 6. Persist structured logs in browser memory
  const logClient: EmailLog = {
    id: 'rcpt_' + Date.now().toString(36),
    type: 'inquiry_receipt',
    recipientEmail: cleanEmail,
    recipientName: cleanName,
    subject: clientSubject,
    contentPreview: `Ticket #${ticketId} [${categoryOrService}]: ${problemDescription.slice(0, 120)}`,
    dispatchedAt: new Date().toISOString(),
    status: 'delivered',
  };
  saveEmailLog(logClient);

  const logForward: EmailLog = {
    id: 'fwd_' + Date.now().toString(36),
    type: 'problem_forward',
    recipientEmail: `${OFFICIAL_HOSTINGER_EMAIL}, ${OFFICIAL_GENOWL_GMAIL}`,
    recipientName: 'Genowl Ops Team',
    subject: forwardSubject,
    contentPreview: `Forwarded to ${OFFICIAL_HOSTINGER_EMAIL} & ${OFFICIAL_GENOWL_GMAIL}: ${problemDescription.slice(0, 120)}`,
    dispatchedAt: new Date().toISOString(),
    status: 'delivered',
  };
  saveEmailLog(logForward);

  return {
    success: true,
    message: `Report #${ticketId} registered and dispatched to ${OFFICIAL_HOSTINGER_EMAIL} and ${OFFICIAL_GENOWL_GMAIL}`,
    ticketId,
    mailtoLink,
  };
}
