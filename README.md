# Mercury Banking

Application bancaire Next.js avec deux portails isolés : administration et espace client.

## Démarrage

```bash
npm install
npm run dev
```

L’application écoute sur le port `3210` :

- Administration : `http://admin.localhost:3210/login`
- Client : `http://client.localhost:3210/login`
- Entrée partagée : `http://localhost:3210`

Au premier lancement, un accès administrateur local est créé avec `admin` / `admin`.
Changez ce mot de passe dès que l’environnement est partagé.

## Parcours client

Lors de sa première connexion, le client complète son profil avant d’accéder au dashboard :

- Preferred name
- Legal name
- Date of birth
- Phone number
- Residential address
- Mailing address

Une fois le profil validé, les connexions suivantes mènent directement au dashboard.
Le profil reste modifiable depuis le menu du compte. Le dashboard affiche le nom
préféré complet. Les clients ne voient que les comptes qui leur sont attribués et
ne peuvent pas accéder aux routes d’administration.

Avant un transfert externe, le client ajoute le RIB du bénéficiaire. L’IBAN et le
BIC sont validés côté serveur, puis le bénéficiaire est enregistré uniquement dans
l’espace de ce client et devient sélectionnable dans le parcours de transfert.

## Sessions séparées

Les cookies de session sont liés à l’hôte. Un administrateur et un client peuvent
donc rester connectés simultanément dans deux onglets du même navigateur, à condition
d’utiliser les deux adresses dédiées.

Les cookies sont signés, `httpOnly`, `sameSite=lax` et valides pendant huit heures.
Les routes sensibles revérifient la signature et le rôle côté serveur.

## Fonctionnalités

- Dashboard, comptes, cartes et transactions
- Virements, ajout de fonds et bénéficiaires
- Paiements, facturation et trésorerie
- Paramètres, profils et gestion des accès
- Configuration administrateur des comptes, cartes, transactions et sections
- Thèmes clair, sombre et système
- Navigation responsive sur mobile et ordinateur

## Données locales

La configuration modifiable est stockée dans `data/app-config.json`. Les utilisateurs
sont stockés dans `data/users.json` et les mots de passe sont protégés avec scrypt et
un sel individuel.

Ces fichiers, ainsi que `data/.session-secret`, sont exclus de Git. Ils sont créés
automatiquement à partir des valeurs initiales lorsque nécessaire.

Pour réinitialiser ou recréer un administrateur :

```bash
npm run admin:reset [username] [password]
```

## Provisioning client depuis un tunnel externe

Un tunnel externe (le parcours gagnant « LT ») peut faire créer un accès client
lorsqu'un dossier est enregistré. À la page de succès, LT appelle l'API de
provisioning ; l'accès est créé immédiatement dans l'administration (email =
identifiant, mot de passe généré), mais l'email d'identifiants n'est **pas**
envoyé sur le champ : il est mis en file et expédié quelques heures plus tard,
laissant à un administrateur le temps de revoir le nouvel accès.

- `POST /api/provisioning/client` — crée l'accès et met l'email en file.
  Authentification par en-tête `Authorization: Bearer <PROVISIONING_SHARED_SECRET>`.
  Corps JSON : `{ "email", "firstName", "lastName" }`. Idempotent par email.
- `POST /api/provisioning/dispatch` — envoie tous les emails d'identifiants dont
  le délai est écoulé. Même secret bearer.

Variables d'environnement (voir `.env.example`) :

```bash
PROVISIONING_SHARED_SECRET=...        # ≥ 16 caractères, partagé avec LT
PROVISIONING_DELAY_HOURS=3            # délai avant l'envoi des identifiants
PROVISIONING_LOGIN_URL=http://client.localhost:3210/login
```

Le mot de passe généré est conservé en clair dans
`data/client-provisioning-queue.json` (git-ignoré) uniquement jusqu'à l'envoi,
puis effacé ; le compte lui-même ne stocke que le hash scrypt.

L'envoi différé doit être déclenché périodiquement (le serveur doit tourner) :

```bash
npm run provisioning:dispatch        # à planifier via cron / Planificateur de tâches
```

Sur Windows, créer une tâche planifiée récurrente (par ex. toutes les 15 min)
qui exécute `node scripts/dispatch-provisioning.mjs` avec `PROVISIONING_SHARED_SECRET`
dans l'environnement.

## Vérifications

```bash
npm run typecheck
npm run build
npm run check
```

## Structure

```text
app/                  Routes et API App Router
components/           Composants d’interface
lib/auth/             Sessions, rôles et profils
lib/config/           Configuration persistante et périmètre client
lib/mock/             Données d’exemple non sensibles
scripts/              Utilitaires (i18n, reset admin, dispatch provisioning)
styles/               Styles globaux et variables visuelles
```
