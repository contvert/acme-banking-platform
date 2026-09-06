import { BRAND } from '@/lib/brand';
import { LOGO_BASE64 } from './logo';
import type { Translate } from '@/lib/i18n/translate';

/**
 * Transactional template for the beneficiary verification code.
 *
 * Built with tables and inline styles because that is what mail clients
 * actually support — Outlook ignores most modern CSS, and Gmail strips
 * <style> blocks in some contexts. Colours are literal rather than design
 * tokens for the same reason: an email has no access to the app's stylesheet.
 *
 * Every sentence comes through the translator, so the code arrives in the
 * language the client is reading the application in.
 */

const INK = '#1e1e2a';
const MUTED = '#535461';
const FAINT = '#70707d';
const LINE = '#e4e4ec';
const CANVAS = '#f4f5f9';
const ACCENT = '#5266eb';
const WARN_BG = '#fdf3ef';
const WARN_INK = '#a44200';

const escapeHtml = (value: string) =>
  value.replace(/[&<>'"]/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;',
  }[c] ?? c));

export interface RecipientOtpContent {
  code: string;
  recipientName: string;
  ibanLast4: string;
  expiresAt: string;
  /** Minutes of validity, for the copy. */
  validForMinutes: number;
}

export function recipientOtpSubject(t: Translate, code: string) {
  // Leading the subject with the code lets a client read it from a
  // notification without opening the message.
  return t('{code} — beneficiary verification code · {brand}', { code, brand: BRAND.name });
}

export function recipientOtpText(
  t: Translate,
  { code, recipientName, ibanLast4, validForMinutes }: RecipientOtpContent,
) {
  return [
    t('{brand} — beneficiary verification', { brand: BRAND.name }),
    '',
    t('Your verification code: {code}', { code }),
    '',
    t('It confirms the bank details of {name} (IBAN ending {last4}).', {
      name: recipientName,
      last4: ibanLast4,
    }),
    t('This code is valid for {minutes} minutes and can be used only once.', {
      minutes: validForMinutes,
    }),
    '',
    t(
      'If you did not request this, do not enter this code and contact your administrator immediately: someone may be trying to add a beneficiary on your account.',
    ),
    '',
    t('Never share this code. {brand} will never ask you for it.', { brand: BRAND.name }),
    '',
    '—',
    BRAND.legalName,
    t('Demonstration environment — no real movement of funds.'),
  ].join('\n');
}

export function recipientOtpHtml(t: Translate, locale: string, content: RecipientOtpContent) {
  const { code, recipientName, ibanLast4, validForMinutes } = content;
  const name = escapeHtml(recipientName);
  const last4 = escapeHtml(ibanLast4);
  const safeCode = escapeHtml(code);

  return `<!doctype html>
<html lang="${locale}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light">
<title>${escapeHtml(recipientOtpSubject(t, code))}</title>
</head>
<body style="margin:0;padding:0;background:${CANVAS};">
  <!-- Preheader: the preview line, hidden in the body itself. -->
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">
    ${escapeHtml(t('Code {code} — valid for {minutes} minutes, single use.', {
      code, minutes: validForMinutes,
    }))}
  </div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
         style="background:${CANVAS};padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
               style="max-width:520px;background:#ffffff;border-radius:12px;
                      border:1px solid ${LINE};font-family:-apple-system,BlinkMacSystemFont,
                      'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">

          <!-- Brand -->
          <tr>
            <td style="padding:28px 32px 0;">
              <img src="${LOGO_BASE64}" alt="${escapeHtml(BRAND.name)}" height="32" style="display:block;height:32px;width:auto;" />
            </td>
          </tr>

          <!-- Purpose -->
          <tr>
            <td style="padding:26px 32px 0;">
              <h1 style="margin:0 0 10px;font-size:20px;line-height:1.35;font-weight:600;color:${INK};">
                ${escapeHtml(t('Verify this beneficiary'))}
              </h1>
              <p style="margin:0;font-size:15px;line-height:1.6;color:${MUTED};">
                ${t('Enter this code to confirm the bank details of {name}, IBAN ending {last4}.', {
                  name: `<strong style="color:${INK};">${name}</strong>`,
                  last4: `<strong style="color:${INK};">${last4}</strong>`,
                })}
              </p>
            </td>
          </tr>

          <!-- The code -->
          <tr>
            <td style="padding:22px 32px 0;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
                     style="background:${CANVAS};border:1px solid ${LINE};border-radius:10px;">
                <tr>
                  <td align="center" style="padding:22px 16px;">
                    <div style="font-family:'SFMono-Regular',Consolas,'Liberation Mono',Menlo,monospace;
                                font-size:34px;line-height:1;letter-spacing:9px;
                                font-weight:700;color:${INK};">${safeCode}</div>
                    <div style="margin-top:11px;font-size:13px;color:${FAINT};">
                      ${escapeHtml(t('Valid for {minutes} minutes · single use', { minutes: validForMinutes }))}
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- If this was not you -->
          <tr>
            <td style="padding:20px 32px 0;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
                     style="background:${WARN_BG};border-radius:10px;">
                <tr>
                  <td style="padding:14px 16px;font-size:14px;line-height:1.55;color:${WARN_INK};">
                    <strong>${escapeHtml(t('You did not request this?'))}</strong><br>
                    ${escapeHtml(t(
                      'Do not enter this code and tell your administrator: someone may be trying to add a beneficiary on your account.',
                    ))}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:20px 32px 0;">
              <p style="margin:0;font-size:14px;line-height:1.6;color:${MUTED};">
                ${escapeHtml(t(
                  'Never share this code, even with someone claiming to be from the {brand} team. We will never ask you for it.',
                  { brand: BRAND.name },
                ))}
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 32px 28px;">
              <hr style="border:0;border-top:1px solid ${LINE};margin:0 0 16px;">
              <p style="margin:0 0 6px;font-size:13px;line-height:1.55;color:${FAINT};">
                ${escapeHtml(BRAND.legalName)}
              </p>
              <p style="margin:0;font-size:12px;line-height:1.55;color:${FAINT};">
                ${escapeHtml(t('Automatic message about an action on your account — please do not reply.'))}
                ${escapeHtml(t('Demonstration environment: no real movement of funds.'))}
              </p>
            </td>
          </tr>
        </table>

        <div style="max-width:520px;margin:14px auto 0;font-size:12px;color:${FAINT};
                    font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
          <span style="color:${ACCENT};">&#9679;</span> ${escapeHtml(t('{brand} Security', { brand: BRAND.name }))}
        </div>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
