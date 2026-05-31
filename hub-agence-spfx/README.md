# Hub Agence – SPFx 1.18

Composant WebPart SharePoint Framework permettant aux agents d'agence d'accéder à toutes leurs applications métier depuis un portail centralisé, avec gestion des favoris, filtrage par profil et journalisation des accès.

---

## Table des matières

1. [Prérequis](#1-prérequis)
2. [Installation et build](#2-installation-et-build)
3. [Déploiement](#3-déploiement)
4. [Configuration SharePoint](#4-configuration-sharepoint)
5. [Permissions Microsoft Graph requises](#5-permissions-microsoft-graph-requises)
6. [Structure du fichier applications.json](#6-structure-du-fichier-applicationsjson)
7. [Checklist de mise en service](#7-checklist-de-mise-en-service)

---

## 1. Prérequis

| Composant | Version requise |
|-----------|----------------|
| Node.js | 16.x ou 18.x (LTS) |
| npm | >= 8.x |
| SharePoint Framework | 1.18.2 |
| Tenant Microsoft 365 | E3 / E5 ou Business Premium |
| PnP PowerShell | >= 2.3 (pour le déploiement) |
| Droits tenant | Administrateur SharePoint + Administrateur d'application |

Vérifiez votre version de Node :

```bash
node -v   # doit afficher v16.x.x ou v18.x.x
npm -v    # doit afficher 8.x.x ou supérieur
```

---

## 2. Installation et build

### Installer les dépendances

```bash
cd hub-agence-spfx
npm install
```

### Build de développement

```bash
gulp bundle
```

### Build de production (recommandé pour le déploiement)

```bash
gulp bundle --ship
gulp package-solution --ship
```

Le package `.sppkg` est généré dans :

```
solution/hub-agence.sppkg
```

### Serveur de développement local (workbench)

```bash
gulp serve
```

Ouvrez ensuite le workbench SharePoint :
`https://<votre-tenant>.sharepoint.com/_layouts/15/workbench.aspx`

---

## 3. Déploiement

### 3.1 Déploiement manuel via l'App Catalog

1. Connectez-vous à votre **App Catalog tenant** :
   `https://<votre-tenant>.sharepoint.com/sites/appcatalog`

2. Naviguez dans **Applications pour SharePoint**.

3. Cliquez sur **Charger** et sélectionnez `solution/hub-agence.sppkg`.

4. Cochez **Rendre cette solution disponible pour tous les sites** si vous souhaitez un déploiement global, puis cliquez sur **Déployer**.

5. Une notification d'**approbation des permissions API** apparaît. Rendez-vous dans le **Centre d'administration SharePoint** > **API Management** pour approuver les permissions Microsoft Graph.

### 3.2 Déploiement via PnP PowerShell (automatisé)

```powershell
.\sharepoint\assets\deploy-applicationcustomizer.ps1 `
    -TenantUrl "https://votre-tenant.sharepoint.com" `
    -SiteUrl   "https://votre-tenant.sharepoint.com/sites/hub-agence"
```

Ce script :
- Upload et publie le `.sppkg` dans l'App Catalog tenant
- Approuve automatiquement les permissions Graph en attente
- Installe le composant sur le site cible
- Crée l'arborescence SharePoint nécessaire
- Dépose un fichier `applications.json` d'exemple

---

## 4. Configuration SharePoint

### 4.1 Arborescence à créer

Le WebPart s'appuie sur la structure de dossiers suivante dans la bibliothèque **Documents** du site :

```
Documents/
└── Cockpit_Agence/
    ├── 00_CONFIG/
    │   └── applications.json       ← catalogue des applications
    ├── 01_ARCHIVE/
    └── 02_TRAVAIL/
        ├── journal.json            ← journal d'audit (auto-créé)
        └── favoris_{userId}.json   ← favoris par utilisateur (auto-créé)
```

### 4.2 Récupérer le siteId

Le `siteId` est passé automatiquement par le WebPart via `context.pageContext.site.id`. Aucune configuration manuelle n'est requise.

### 4.3 Ajouter le WebPart à une page

1. Éditez une page SharePoint moderne.
2. Ajoutez un **WebPart** via le bouton `+`.
3. Recherchez **Hub Agence**.
4. Publiez la page.

---

## 5. Permissions Microsoft Graph requises

Ces permissions sont déclarées dans `config/package-solution.json` et doivent être approuvées par un administrateur tenant :

| Permission | Utilisation |
|-----------|-------------|
| `User.Read` | Récupération du profil utilisateur courant (`/me`) |
| `Files.ReadWrite.All` | Lecture/écriture des fichiers JSON dans SharePoint (applications, favoris, journal) |
| `Sites.ReadWrite.All` | Accès au drive SharePoint via l'API Graph (`/sites/{id}/drive/root:/...`) |

### Approuver les permissions

1. Allez dans le **Centre d'administration SharePoint**.
2. Naviguez dans **Avancé** > **Accès aux API**.
3. Approuvez chaque permission en attente pour **Hub Agence**.

---

## 6. Structure du fichier applications.json

Ce fichier définit toutes les applications disponibles dans le hub. Il est lu depuis :
`Documents/Cockpit_Agence/00_CONFIG/applications.json`

### Exemple complet

```json
[
  {
    "id": "app-001",
    "title": "Gestion des commandes",
    "description": "Suivi et gestion des commandes fournisseurs en temps réel",
    "category": "Fournisseurs",
    "profile": "Chef agence",
    "path": "https://votre-tenant.sharepoint.com/sites/hub/commandes",
    "icon": "📦",
    "priority": 1,
    "status": "actif",
    "tags": ["commandes", "fournisseurs", "achat"],
    "owner": "chef.agence@domaine.fr",
    "lastReview": "2024-01-15T10:00:00Z"
  },
  {
    "id": "app-002",
    "title": "Tableau de bord stock",
    "description": "Vue en temps réel du niveau de stock dépôt",
    "category": "Stock",
    "profile": "Dépôt",
    "path": "https://votre-tenant.sharepoint.com/sites/hub/stock",
    "icon": "📊",
    "priority": 2,
    "status": "actif",
    "tags": ["stock", "inventaire", "dépôt"]
  },
  {
    "id": "app-003",
    "title": "Portail RH",
    "description": "Demandes de congés, notes de frais, fiches de paie",
    "category": "RH",
    "profile": "Tous",
    "path": "https://votre-tenant.sharepoint.com/sites/rh",
    "icon": "👤",
    "priority": 3,
    "status": "actif",
    "tags": ["rh", "congés", "paie"]
  },
  {
    "id": "app-004",
    "title": "Outil de devis (bêta)",
    "description": "Nouvelle version du générateur de devis",
    "category": "Commercial",
    "profile": "Comptoir",
    "path": "https://votre-tenant.sharepoint.com/sites/hub/devis-beta",
    "icon": "📝",
    "priority": 10,
    "status": "brouillon",
    "tags": ["devis", "commercial"]
  }
]
```

### Description des champs

| Champ | Type | Obligatoire | Description |
|-------|------|-------------|-------------|
| `id` | string | Oui | Identifiant unique (stable, ne pas modifier) |
| `title` | string | Oui | Nom affiché dans le hub |
| `description` | string | Oui | Description courte (2 lignes max affichées) |
| `category` | string | Oui | Catégorie (ex : Fournisseurs, Stock, RH, Finance…) |
| `profile` | enum | Oui | `Tous`, `Chef agence`, `Comptoir`, `Dépôt`, `Admin` |
| `path` | string | Oui | URL cible (ouverte dans un nouvel onglet) |
| `icon` | string | Non | Emoji ou texte court (sinon : première lettre du titre) |
| `priority` | number | Oui | Ordre d'affichage (1 = premier) |
| `status` | enum | Oui | `actif` (visible), `brouillon` (masqué), `archive` (masqué) |
| `tags` | string[] | Oui | Mots-clés pour la recherche (tableau vide accepté) |
| `owner` | string | Non | Responsable applicatif (email) |
| `lastReview` | string | Non | Date de dernière revue (ISO 8601) |

### Règles de filtrage

| Onglet | Applications affichées |
|--------|----------------------|
| Tous | Toutes les apps `actif` |
| Chef agence | Apps `actif` avec `profile = "Chef agence"` ou `profile = "Tous"` |
| Comptoir | Apps `actif` avec `profile = "Comptoir"` ou `profile = "Tous"` |
| Dépôt | Apps `actif` avec `profile = "Dépôt"` ou `profile = "Tous"` |
| Admin | Apps `actif` avec `profile = "Admin"` ou `profile = "Tous"` |
| Fournisseurs | Apps `actif` avec `category = "Fournisseurs"` |
| Favoris | Apps `actif` dont l'ID est dans la liste des favoris de l'utilisateur |

---

## 7. Checklist de mise en service

### Avant le déploiement

- [ ] Node.js 16 ou 18 installé
- [ ] `npm install` exécuté sans erreur
- [ ] `gulp bundle --ship && gulp package-solution --ship` réussi
- [ ] Fichier `solution/hub-agence.sppkg` généré

### Déploiement tenant

- [ ] Package uploadé dans l'App Catalog tenant
- [ ] Package marqué comme déployé globalement (ou sur le site cible)
- [ ] Permissions Graph approuvées dans le Centre d'administration SharePoint :
  - [ ] `User.Read`
  - [ ] `Files.ReadWrite.All`
  - [ ] `Sites.ReadWrite.All`

### Configuration SharePoint

- [ ] Arborescence `Cockpit_Agence/` créée dans la bibliothèque Documents
- [ ] Dossier `00_CONFIG/` créé
- [ ] Dossier `02_TRAVAIL/` créé
- [ ] Fichier `applications.json` déposé dans `00_CONFIG/` (minimum 1 app `actif`)
- [ ] Permissions sur les dossiers vérifiées (lecture pour tous les utilisateurs, écriture pour les admins)

### Tests fonctionnels

- [ ] Le WebPart s'affiche sans erreur sur la page SharePoint
- [ ] Les applications se chargent correctement
- [ ] Le filtrage par profil fonctionne
- [ ] La recherche plein texte fonctionne
- [ ] L'ajout/retrait de favoris fonctionne et persiste après rechargement
- [ ] Le clic sur une application ouvre le lien dans un nouvel onglet
- [ ] Le panneau Paramètres affiche les informations utilisateur et Graph
- [ ] Le journal `journal.json` est créé dans `02_TRAVAIL/` après utilisation

### Support

En cas de problème, vérifiez :
1. La console du navigateur (F12) pour les erreurs JavaScript
2. Le panneau **Paramètres** du WebPart (icône ⚙) pour le statut Graph API
3. Le fichier `journal.json` pour l'historique des erreurs
4. Les permissions Graph dans le Centre d'administration SharePoint
