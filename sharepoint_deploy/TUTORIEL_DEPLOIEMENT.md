# Tutoriel de déploiement — Hub Agence V4 SPFx

> **Aucune permission Microsoft Graph requise.** La webpart utilise l'API REST SharePoint native et la session de l'utilisateur connecté.

---

## Prérequis

| Prérequis | Détail |
|---|---|
| Accès **administrateur SharePoint** | Pour déposer le .sppkg dans l'App Catalog |
| **Node.js 18** sur votre machine | `node --version` doit afficher `v18.x.x` |
| **npm** | Fourni avec Node.js |
| Dépôt cloné en local | `git clone https://github.com/greglp35/solartis-dossier.git` |

---

## Étape 1 — Builder le projet

### 1.1 Ouvrir un terminal et se positionner dans le projet

```bash
git clone https://github.com/greglp35/solartis-dossier.git
cd solartis-dossier
git checkout claude/zealous-dijkstra-HewLK
cd hub-agence-spfx
```

### 1.2 Installer les dépendances

```bash
npm install
```

> Si vous avez Node.js 20 ou 22 installé, utilisez `nvm use 18` avant (ou installez nvm).

### 1.3 Compiler et créer le package

```bash
gulp bundle --ship
gulp package-solution --ship
```

Le fichier à déployer est créé ici :

```
hub-agence-spfx/sharepoint/solution/hub-agence.sppkg
```

---

## Étape 2 — Déployer dans l'App Catalog SharePoint

### 2.1 Ouvrir l'App Catalog

Dans votre navigateur, aller à :

```
https://VOTRE-TENANT.sharepoint.com/sites/appcatalog
```

*(Si vous ne connaissez pas l'URL : Centre d'administration SharePoint → Sites actifs → chercher "appcatalog")*

Cliquer sur **Applications pour SharePoint** dans le menu gauche.

### 2.2 Uploader le fichier .sppkg

1. Cliquer **Télécharger** en haut à gauche (ou glisser-déposer le fichier)
2. Sélectionner `hub-agence.sppkg`
3. Dans la boîte de dialogue :
   - Cocher ✅ **Rendre cette solution disponible pour tous les sites de l'organisation**
   - Cliquer **Déployer**

> **Aucune demande de permission Graph n'apparaîtra.** C'est normal — la webpart n'en a pas besoin.

---

## Étape 3 — Créer l'arborescence SharePoint

### 3.1 Ouvrir votre site SharePoint

Aller sur votre site agence, par exemple :

```
https://VOTRE-TENANT.sharepoint.com/sites/agence
```

Cliquer sur **Documents** dans le menu de gauche.

### 3.2 Créer les dossiers

Créer les dossiers **dans cet ordre exact** en faisant `+ Nouveau → Dossier` à chaque niveau :

```
Documents/
└── Cockpit_Agence/            ← créer en premier
    ├── 00_CONFIG/             ← entrer dans Cockpit_Agence, créer ce dossier
    ├── 01_REFERENTIELS/
    ├── 02_TRAVAIL/
    └── 05_ARCHIVES/
        └── sauvegardes/       ← entrer dans 05_ARCHIVES, créer ce sous-dossier
```

> ⚠️ Respecter exactement la casse : `Cockpit_Agence`, `00_CONFIG`, `02_TRAVAIL`, etc.

---

## Étape 4 — Déposer les fichiers JSON

Tous les fichiers se trouvent dans le dossier `sharepoint_deploy/` du dépôt cloné.

Pour chaque dossier ci-dessous, naviguer dans SharePoint jusqu'au bon dossier, puis **glisser-déposer** les fichiers.

### Dossier 00_CONFIG — obligatoire au démarrage

Uploader dans `Documents/Cockpit_Agence/00_CONFIG/` :

| Fichier | Rôle |
|---|---|
| `hub_config.json` | Paramètres généraux du hub |
| `applications.json` | **Liste des outils affichés** ← à adapter (voir étape 5) |
| `profils.json` | Définition des profils utilisateurs |
| `categories.json` | Liste des catégories |
| `droits_roles.json` | Documentation des droits (informatif) |

### Dossier 01_REFERENTIELS

Uploader dans `Documents/Cockpit_Agence/01_REFERENTIELS/` :

| Fichier | Rôle |
|---|---|
| `fournisseurs.json` | Référentiel fournisseurs |

### Dossier 02_TRAVAIL

Uploader dans `Documents/Cockpit_Agence/02_TRAVAIL/` :

| Fichier | Rôle |
|---|---|
| `actions.json` | Actions agence à suivre |
| `stock.json` | Suivi des niveaux de stock |
| `clients.json` | Fiches clients |
| `devis.json` | Devis et relances |
| `commandes.json` | Suivi des commandes |
| `livraisons.json` | Suivi des livraisons |
| `securite.json` | Contrôles sécurité |
| `journal.json` | Journal d'audit (contient `[]` au départ) |

---

## Étape 5 — Adapter applications.json à votre site

Ouvrir le fichier `sharepoint_deploy/Cockpit_Agence/00_CONFIG/applications.json` dans un éditeur de texte (Notepad, VS Code…).

Chaque outil a un champ `path`. Remplacer `/sites/agence/` par le nom réel de votre site.

**Comment trouver le nom de votre site :**
Regarder l'URL de votre site SharePoint dans le navigateur :
```
https://votre-tenant.sharepoint.com/sites/NOM-DU-SITE/...
                                          ↑
                                    c'est ce nom
```

**Exemple de modification :**
```json
// Avant (exemple fourni)
"path": "/sites/agence/SitePages/Cockpit-Agence.aspx"

// Après (votre site réel, si votre site s'appelle "agence-nord")
"path": "/sites/agence-nord/SitePages/Cockpit-Agence.aspx"
```

Faire le remplacement sur toutes les lignes `path` du fichier, puis re-uploader le fichier dans SharePoint (remplacer l'existant).

---

## Étape 6 — Installer la webpart sur votre site

### 6.1 Ajouter l'application au site

1. Aller sur votre site SharePoint
2. Cliquer l'icône ⚙ en haut à droite → **Ajouter une application**
3. Chercher **hub-agence** dans la liste
4. Cliquer **Ajouter**

### 6.2 Ajouter la webpart sur une page

1. Aller sur votre site SharePoint
2. Dans le menu gauche, cliquer **Pages du site**
3. Cliquer **+ Nouvelle page** (ou ouvrir une page existante en mode édition)
4. Sur la page, cliquer le **+** pour ajouter un composant
5. Taper `Hub Agence` dans la barre de recherche
6. Cliquer sur la webpart **Hub Agence**
7. Cliquer **Publier** en haut à droite

---

## Étape 7 — Vérification

Après avoir publié la page, effectuer ces contrôles :

| # | Test | Résultat attendu |
|---|---|---|
| 1 | La page s'affiche sans bandeau rouge d'erreur | ✅ |
| 2 | Les 11 outils du hub apparaissent sous forme de cartes | ✅ |
| 3 | La barre de recherche filtre les cartes en temps réel | ✅ |
| 4 | Les onglets (Tous, Chef agence, Comptoir…) filtrent sans doublon | ✅ |
| 5 | Un clic sur une carte ouvre la bonne page SharePoint | ✅ |
| 6 | Cliquer l'étoile ★ d'une carte la rend jaune | ✅ |
| 7 | Après rechargement de la page, les favoris sont toujours là | ✅ |
| 8 | Cliquer ⚙ → le panneau affiche votre nom et le statut SharePoint | ✅ |

---

## Résolution des problèmes

### "Erreur lors de l'initialisation"

**Cause :** `applications.json` introuvable ou chemin incorrect.

**Solution :**
1. Vérifier que le fichier existe bien dans `Documents/Cockpit_Agence/00_CONFIG/applications.json`
2. Vérifier la casse des noms de dossiers (`Cockpit_Agence` et non `cockpit_agence`)
3. Vérifier que vous êtes bien sur le bon site SharePoint

### Les cartes n'apparaissent pas (page blanche sans erreur)

**Cause :** Le fichier `applications.json` est vide ou invalide.

**Solution :** Ouvrir le fichier dans un éditeur, vérifier qu'il commence par `[` et se termine par `]`, et que le JSON est valide (utiliser [jsonlint.com](https://jsonlint.com)).

### Les favoris ne se sauvegardent pas

**Cause :** L'utilisateur n'a pas les droits d'écriture sur le dossier `02_TRAVAIL/`.

**Solution :**
1. Dans SharePoint, naviguer jusqu'à `Documents/Cockpit_Agence/02_TRAVAIL/`
2. Cliquer les `…` → **Gérer l'accès**
3. Vérifier que les utilisateurs ont au moins le niveau **Collaboration**

### "Lecture fichier échouée (403)"

**Cause :** L'utilisateur n'a pas accès à la bibliothèque Documents.

**Solution :** Inviter l'utilisateur sur le site SharePoint (rôle **Visiteur** minimum pour la lecture, **Membre** pour l'écriture des favoris).

### "Lecture fichier échouée (404)"

**Cause :** Un fichier JSON est manquant dans SharePoint.

**Solution :** Vérifier que tous les fichiers de l'étape 4 ont bien été uploadés au bon endroit.

---

## Droits SharePoint recommandés

| Profil | Niveau sur le site | Niveau sur Cockpit_Agence/ |
|---|---|---|
| Chef agence | Membre | Collaboration (lecture + écriture) |
| Comptoir | Membre | Collaboration |
| Dépôt | Membre | Collaboration |
| Admin | Propriétaire | Contrôle total |
| Visiteur | Visiteur | Lecture seule |

---

## Mise à jour de la webpart

Après modification du code source :

```bash
cd hub-agence-spfx
gulp bundle --ship
gulp package-solution --ship
```

Re-uploader `hub-agence.sppkg` dans l'App Catalog, cliquer **Remplacer**.

La mise à jour est automatiquement propagée sur tous les sites sans autre action.
