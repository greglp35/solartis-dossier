# Tutoriel de déploiement — Hub Agence V4 SPFx

## Prérequis

Avant de commencer, vérifier que vous avez :

- Accès **administrateur** au tenant Microsoft 365
- Accès à l'**App Catalog SharePoint** du tenant
- **Node.js 18** installé sur votre machine (`node --version` → `v18.x.x`)
- **npm** installé (`npm --version`)
- Le dépôt cloné en local (`git clone ...`)

---

## Étape 1 — Cloner et builder le projet

### 1.1 Cloner la branche

```bash
git clone https://github.com/greglp35/solartis-dossier.git
cd solartis-dossier
git checkout claude/zealous-dijkstra-HewLK
```

### 1.2 Installer les dépendances

```bash
cd hub-agence-spfx
npm install
```

> ⚠️ Des avertissements `EBADENGINE` peuvent apparaître si Node n'est pas exactement v18. Utiliser `nvm use 18` si disponible.

### 1.3 Compiler et packager

```bash
# Compiler pour la production
gulp bundle --ship

# Créer le package SharePoint
gulp package-solution --ship
```

Le fichier livrable se trouve dans :

```
hub-agence-spfx/sharepoint/solution/hub-agence.sppkg
```

---

## Étape 2 — Déployer dans l'App Catalog SharePoint

### 2.1 Ouvrir l'App Catalog

1. Aller sur `https://VOTRE-TENANT.sharepoint.com/sites/appcatalog`
   *(ou : Centre d'administration SharePoint → Sites → App Catalog)*
2. Cliquer sur **Applications pour SharePoint**

### 2.2 Uploader le .sppkg

1. Cliquer **Télécharger** (ou glisser-déposer)
2. Sélectionner `hub-agence.sppkg`
3. Dans la boîte de dialogue qui s'ouvre :
   - Cocher **Rendre cette solution disponible pour tous les sites**
   - Cliquer **Déployer**

### 2.3 Approuver les permissions Microsoft Graph

> ⚠️ Cette étape est **critique**. Sans approbation, la webpart ne peut pas lire/écrire dans SharePoint.

1. Aller sur `https://VOTRE-TENANT-admin.sharepoint.com`
2. Dans le menu gauche : **Paramètres avancés → Accès aux API**
3. Vous verrez 3 demandes en attente :

| Ressource | Permission | Action |
|---|---|---|
| Microsoft Graph | User.Read | ✅ Approuver |
| Microsoft Graph | Files.ReadWrite.All | ✅ Approuver |
| Microsoft Graph | Sites.ReadWrite.All | ✅ Approuver |

4. Cliquer **Approuver** pour chacune

---

## Étape 3 — Créer l'arborescence SharePoint

### 3.1 Ouvrir la bibliothèque Documents

1. Aller sur votre site SharePoint cible (ex : `https://VOTRE-TENANT.sharepoint.com/sites/agence`)
2. Cliquer sur **Documents** dans le menu gauche

### 3.2 Créer les dossiers

Créer les dossiers suivants **dans l'ordre** (clic droit → Nouveau → Dossier) :

```
Documents/
└── Cockpit_Agence/
    ├── 00_CONFIG/
    ├── 01_REFERENTIELS/
    ├── 02_TRAVAIL/
    └── 05_ARCHIVES/
        └── sauvegardes/
```

> 💡 Le nom `Cockpit_Agence` est sensible à la casse. L'écrire exactement ainsi.

---

## Étape 4 — Déposer les fichiers JSON

Les fichiers se trouvent dans le dossier `sharepoint_deploy/` du dépôt.

### 4.1 Dossier 00_CONFIG (obligatoire)

Uploader dans `Documents/Cockpit_Agence/00_CONFIG/` :

| Fichier | Description |
|---|---|
| `hub_config.json` | Paramètres généraux du hub |
| `applications.json` | **Liste des outils du hub** ← à adapter |
| `profils.json` | Profils utilisateurs |
| `categories.json` | Catégories d'outils |
| `droits_roles.json` | Documentation des droits |

### 4.2 Dossier 01_REFERENTIELS

Uploader dans `Documents/Cockpit_Agence/01_REFERENTIELS/` :

| Fichier | Description |
|---|---|
| `fournisseurs.json` | Référentiel fournisseurs |

### 4.3 Dossier 02_TRAVAIL

Uploader dans `Documents/Cockpit_Agence/02_TRAVAIL/` :

| Fichier | Description |
|---|---|
| `actions.json` | Actions agence |
| `stock.json` | Suivi stock |
| `clients.json` | Fiches clients |
| `devis.json` | Devis et relances |
| `commandes.json` | Suivi commandes |
| `livraisons.json` | Suivi livraisons |
| `securite.json` | Contrôles sécurité |
| `journal.json` | Journal d'audit (tableau vide) |

---

## Étape 5 — Adapter applications.json

Ouvrir `sharepoint_deploy/Cockpit_Agence/00_CONFIG/applications.json` et remplacer chaque `path` par l'URL réelle de votre site.

### Avant (exemple fourni)
```json
"path": "/sites/agence/SitePages/Cockpit-Agence.aspx"
```

### Après (votre site réel)
```json
"path": "/sites/NOM-DE-VOTRE-SITE/SitePages/Cockpit-Agence.aspx"
```

Trouver le nom de votre site : regarder l'URL dans la barre d'adresse de votre navigateur sur SharePoint.

---

## Étape 6 — Ajouter la webpart sur une page

1. Aller sur votre site SharePoint
2. Cliquer **Pages du site** dans le menu gauche
3. Créer une nouvelle page (ou modifier une existante) : **+ Nouvelle page**
4. Cliquer le bouton **+** dans la zone de contenu
5. Taper `Hub Agence` dans la recherche
6. Cliquer sur la webpart **Hub Agence**
7. Cliquer **Publier** en haut à droite

---

## Étape 7 — Vérification

Après publication, vérifier point par point :

| Test | Résultat attendu |
|---|---|
| La page s'affiche sans message d'erreur rouge | ✅ |
| Les outils du hub sont visibles (11 cartes) | ✅ |
| La recherche filtre les cartes en temps réel | ✅ |
| Les onglets (Chef agence, Comptoir…) filtrent correctement | ✅ |
| Clic sur une carte → ouvre la bonne page | ✅ |
| Étoile favorite → reste jaune après rechargement | ✅ |
| Icône ⚙ → panneau paramètres affiche l'utilisateur et "Graph : connecté" | ✅ |

---

## Problèmes fréquents

### La webpart affiche "Erreur lors de l'initialisation"

**Cause probable :** Les permissions Graph ne sont pas approuvées.

**Solution :** Reprendre l'étape 2.3 et vérifier que les 3 permissions sont bien approuvées (statut = **Approuvé**, pas *En attente*).

### Les outils ne s'affichent pas

**Cause probable :** `applications.json` est introuvable ou mal placé.

**Solution :** Vérifier que le fichier est bien dans `Documents/Cockpit_Agence/00_CONFIG/applications.json` (chemin exact, sensible à la casse).

### Les favoris ne se sauvegardent pas

**Cause probable :** L'utilisateur n'a pas les droits d'écriture sur `02_TRAVAIL/`.

**Solution :** Vérifier que les contributeurs ont le niveau **Collaboration** sur le dossier `Cockpit_Agence/` dans SharePoint.

### "Vous n'avez pas les droits nécessaires pour lire la configuration"

**Cause probable :** L'utilisateur n'a pas accès au site SharePoint ou à la bibliothèque Documents.

**Solution :** Inviter l'utilisateur sur le site SharePoint avec au minimum le rôle **Lecteur**.

---

## Droits SharePoint recommandés

| Profil | Niveau sur Cockpit_Agence/ |
|---|---|
| Chef agence | Collaboration (lecture + écriture) |
| Comptoir | Collaboration |
| Dépôt | Collaboration |
| Admin | Contrôle total |
| Visiteur | Lecture seule |

---

## Mise à jour de la webpart

Pour mettre à jour la webpart après modification du code :

```bash
cd hub-agence-spfx
gulp bundle --ship
gulp package-solution --ship
```

Re-uploader `hub-agence.sppkg` dans l'App Catalog → cliquer **Remplacer**.

La mise à jour est propagée automatiquement sur tous les sites sans action supplémentaire.
