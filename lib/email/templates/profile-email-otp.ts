import { BRAND } from '@/lib/brand';
import { LOGO_BASE64 } from './logo';
import type { Translate } from '@/lib/i18n/translate';

/**
 * Transactional template for confirming the address on a client profile.
 * Same table-and-inline-styles construction as the beneficiary code, for the
 * same reason: mail clients do not support much beyond that. Every sentence
 * comes through the translator, so the message arrives in the language the
 * client is reading the application in.
 */

const INK = '#1e1e2a';
const MUTED = '#535461';
const FAINT = '#70707d';
const LINE = '#e4e4ec';
const CANVAS = '#f4f5f9';
const ACCENT = '#5266eb';
const NOTE_BG = '#f0f9fa';
const NOTE_INK = '#00697b';

const escapeHtml = (value: string) =>
  value.replace(/[&<>'"]/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;',
  }[c] ?? c));

export interface ProfileOtpContent {
  code: string;
  /** The name the client asked to be called. */
  preferredName: string;
  validForMinutes: number;
}

export function profileOtpSubject(t: Translate, code: string) {
  return t('{code} — confirm your email address · {brand}', { code, brand: BRAND.name });
}

export function profileOtpText(
  t: Translate,
  { code, preferredName, validForMinutes }: ProfileOtpContent,
) {
  return [
    t('{brand} — confirming your email address', { brand: BRAND.name }),
    '',
    t('Hello {name},', { name: preferredName }),
    '',
    t('Your confirmation code: {code}', { code }),
    '',
    t('Enter it to confirm this address and finish your profile.'),
    t('This code is valid for {minutes} minutes and can be used only once.', {
      minutes: validForMinutes,
    }),
    '',
    t(
      'This is the address where we send the codes that authorise adding a beneficiary: it must be yours and stay reachable.',
    ),
    '',
    t('If you did not request this, ignore this message and tell your administrator.'),
    '',
    t('Never share this code. {brand} will never ask you for it.', { brand: BRAND.name }),
    '',
    '—',
    BRAND.legalName,
    t('Demonstration environment — no real movement of funds.'),
  ].join('\n');
}

export function profileOtpHtml(t: Translate, locale: string, content: ProfileOtpContent) {
  const { code, preferredName, validForMinutes } = content;
  const name = escapeHtml(preferredName);
  const safeCode = escapeHtml(code);

  return `<!doctype html>
<html lang="${locale}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light">
<title>${escapeHtml(profileOtpSubject(t, code))}</title>
</head>
<body style="margin:0;padding:0;background:${CANVAS};">
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
               style="max-width:520px;background:#ffffff;border-radius:12px;border:1px solid ${LINE};
                      font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">

          <tr>
            <td style="padding:28px 32px 0;">
              <img src="${LOGO_BASE64}" alt="${escapeHtml(BRAND.name)}" height="32" style="display:block;height:32px;width:auto;" />
            </td>
          </tr>

          <tr>
            <td style="padding:26px 32px 0;">
              <h1 style="margin:0 0 10px;font-size:20px;line-height:1.35;font-weight:600;color:${INK};">
                ${escapeHtml(t('Confirm your email address'))}
              </h1>
              <p style="margin:0;font-size:15px;line-height:1.6;color:${MUTED};">
                ${escapeHtml(t('Hello {name}, enter this code to confirm this address and finish your profile.', { name }))}
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:22px 32px 0;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
                     style="background:${CANVAS};border:1px solid ${LINE};border-radius:10px;">
                <tr>
                  <td align="center" style="padding:22px 16px;">
                    <div style="font-family:'SFMono-Regular',Consolas,'Liberation Mono',Menlo,monospace;
                                font-size:34px;line-height:1;letter-spacing:9px;font-weight:700;color:${INK};">${safeCode}</div>
                    <div style="margin-top:11px;font-size:13px;color:${FAINT};">
                      ${escapeHtml(t('Valid for {minutes} minutes · single use', { minutes: validForMinutes }))}
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:20px 32px 0;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
                     style="background:${NOTE_BG};border-radius:10px;">
                <tr>
                  <td style="padding:14px 16px;font-size:14px;line-height:1.55;color:${NOTE_INK};">
                    <strong>${escapeHtml(t('Why this confirmation?'))}</strong><br>
                    ${escapeHtml(t(
                      'This is the address where we send the codes that authorise adding a beneficiary: it must be yours and stay reachable.',
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
                  'Not you? Ignore this message and tell your administrator. Never share this code: {brand} will never ask you for it.',
                  { brand: BRAND.name },
                ))}
              </p>
            </td>
          </tr>

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
