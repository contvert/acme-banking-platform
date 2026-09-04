# Acme Banking

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

## Vérifications

```bash
npm run typecheck
npm run build
npm run test:ui
npm run test:sessions
npm run smoke
npm run audit:mobile
npm run audit:theme
npm run check
```

La suite couvre notamment l’authentification, l’isolation des rôles, les sessions
simultanées, le profil client, les cartes, les virements, les coordonnées bancaires,
les menus responsive, les thèmes et l’administration.

## Structure

```text
app/                  Routes et API App Router
components/           Composants d’interface
lib/auth/             Sessions, rôles et profils
lib/config/           Configuration persistante et périmètre client
lib/mock/             Données d’exemple non sensibles
scraper/              Tests fonctionnels et audits
styles/               Styles globaux et variables visuelles
```
