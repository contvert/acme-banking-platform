/**
 * The email that hands a lottery winner the access to the space opened for
 * their prize payout.
 *
 * This message is sent on behalf of the lottery ("Programme international IA
 * 2026"), not the banking platform: from the winner's point of view it is the
 * lottery that delivers their access, and the visual identity, copy and sender
 * all belong to the lottery. The banking portal is only where they sign in.
 *
 * It is dispatched hours after the access is created, outside any signed-in
 * session, so it carries self-contained French copy rather than going through
 * the app's i18n catalogue. Tables and inline styles only — mail clients
 * support little else.
 */

// Lottery visual identity (mirrors emails/tailwind.config.ts in the LT project).
const NAVY = '#002550';
const BLUE = '#003876';
const GOLD = '#FFD100';
const INK = '#172033';
const MUTED = '#5F6B7A';
const CANVAS = '#F3F6FA';
const LINE = '#DCE3EC';
const PANEL = '#F8FAFD';

/** The brand this message is sent under. */
export const LOTTERY_BRAND = {
  kicker: 'Programme international IA 2026',
  name: 'Programme IA 2026',
  legalName: 'Programme International IA 2026',
} as const;

const escapeHtml = (value: string) =>
  value.replace(/[&<>'"]/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;',
  }[c] ?? c));

export interface CredentialsContent {
  displayName: string;
  /** Sign-in identifier (the client's email address). */
  username: string;
  password: string;
  /** Absolute URL of the client sign-in page. */
  loginUrl: string;
}

export function credentialsSubject() {
  return `Vos accès pour le versement de votre gain · ${LOTTERY_BRAND.name}`;
}

export function credentialsText({ displayName, username, password, loginUrl }: CredentialsContent) {
  return [
    `${LOTTERY_BRAND.kicker}`,
    'Accès à votre espace de versement',
    '',
    `Bonjour ${displayName},`,
    '',
    'Votre dossier gagnant a été validé. Nous avons ouvert votre espace sécurisé pour',
    'le versement de votre gain. Voici vos identifiants de première connexion :',
    '',
    `Adresse de connexion : ${loginUrl}`,
    `Identifiant : ${username}`,
    `Mot de passe : ${password}`,
    '',
    'Pour votre sécurité, modifiez ce mot de passe dès votre première connexion.',
    `Ne communiquez jamais ces identifiants. ${LOTTERY_BRAND.name} ne vous les demandera jamais.`,
    '',
    '—',
    LOTTERY_BRAND.legalName,
    'Message transactionnel envoyé automatiquement à la suite de votre dossier.',
  ].join('\n');
}

export function credentialsHtml(content: CredentialsContent) {
  const { displayName, username, password, loginUrl } = content;

  return `<!doctype html>
<html lang="fr" dir="ltr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light">
<title>${escapeHtml(credentialsSubject())}</title>
</head>
<body style="margin:0;padding:0;background:${CANVAS};">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">
    ${escapeHtml('Votre dossier gagnant est validé — vos identifiants pour le versement de votre gain.')}
  </div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
         style="background:${CANVAS};padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
               style="max-width:600px;background:#ffffff;border-radius:12px;overflow:hidden;
                      font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">

          <tr>
            <td align="center" style="background:${NAVY};padding:28px 32px 30px;">
              <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:${GOLD};">
                ${escapeHtml(LOTTERY_BRAND.kicker)}
              </div>
              <div style="margin-top:14px;font-size:26px;line-height:1.3;font-weight:700;color:#ffffff;">
                Accès à votre espace de versement
              </div>
            </td>
          </tr>

          <tr><td style="height:4px;background:${GOLD};font-size:0;line-height:0;">&nbsp;</td></tr>

          <tr>
            <td style="padding:30px 32px 0;">
              <p style="margin:0;font-size:17px;font-weight:700;line-height:1.6;color:${INK};">
                Bonjour ${escapeHtml(displayName)},
              </p>
              <p style="margin:16px 0 0;font-size:15px;line-height:1.6;color:${MUTED};">
                Votre dossier gagnant a été validé. Nous avons ouvert votre espace sécurisé pour
                le versement de votre gain. Voici vos identifiants de première connexion.
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:22px 32px 0;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
                     style="background:${PANEL};border:1px solid ${LINE};border-radius:10px;">
                <tr>
                  <td style="padding:18px 20px;">
                    <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:${BLUE};">Identifiant</div>
                    <div style="margin-top:5px;font-size:16px;font-weight:600;color:${INK};word-break:break-all;">${escapeHtml(username)}</div>
                    <div style="margin-top:16px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:${BLUE};">Mot de passe</div>
                    <div style="margin-top:5px;font-family:'SFMono-Regular',Consolas,'Liberation Mono',Menlo,monospace;
                                font-size:20px;letter-spacing:2px;font-weight:700;color:${INK};">${escapeHtml(password)}</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:22px 32px 0;">
              <a href="${escapeHtml(loginUrl)}"
                 style="display:inline-block;background:${NAVY};color:#ffffff;text-decoration:none;
                        font-size:15px;font-weight:700;padding:13px 24px;border-radius:8px;">
                Accéder à mon espace
              </a>
            </td>
          </tr>

          <tr>
            <td style="padding:22px 32px 0;">
              <p style="margin:0;font-size:14px;line-height:1.6;color:${MUTED};">
                Pour votre sécurité, modifiez ce mot de passe dès votre première connexion.
                Ne communiquez jamais ces identifiants — ${escapeHtml(LOTTERY_BRAND.name)} ne vous les demandera jamais.
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:24px 32px 30px;">
              <hr style="border:0;border-top:1px solid ${LINE};margin:0;">
            </td>
          </tr>

          <tr>
            <td align="center" style="background:${NAVY};padding:22px 32px;">
              <div style="font-size:11px;line-height:1.6;color:#C8D3E3;">
                Message transactionnel envoyé automatiquement à la suite de votre dossier.
              </div>
              <div style="margin-top:8px;font-size:11px;font-weight:700;color:${GOLD};">
                Confidentialité • Connexion sécurisée
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
