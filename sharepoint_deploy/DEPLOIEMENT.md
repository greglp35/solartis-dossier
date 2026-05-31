# Déploiement SharePoint — Hub Agence V4

## 1. Déployer la webpart (.sppkg)

1. Ouvrir le **App Catalog SharePoint** de votre tenant
2. Uploader `hub-agence-spfx/sharepoint/solution/hub-agence.sppkg`
3. Cocher **Rendre disponible pour tous les sites**
4. Approuver les permissions Graph dans le **Centre d'administration Microsoft 365** :
   - Accueil → SharePoint → Paramètres avancés → Accès aux API
   - Approuver : `User.Read`, `Files.ReadWrite.All`, `Sites.ReadWrite.All`

## 2. Créer l'arborescence SharePoint

Dans la bibliothèque **Documents** de votre site SharePoint, créer :

```
Documents/
└── Cockpit_Agence/
    ├── 00_CONFIG/
    ├── 01_REFERENTIELS/
    ├── 02_TRAVAIL/
    └── 05_ARCHIVES/
        └── sauvegardes/
```

## 3. Déposer les fichiers JSON

Uploader les fichiers du dossier `sharepoint_deploy/Cockpit_Agence/` en respectant la structure :

### 00_CONFIG/ (obligatoires au démarrage)
| Fichier | Rôle |
|---|---|
| `hub_config.json` | Paramètres généraux du hub |
| `applications.json` | **Liste des outils affichés dans le hub** |
| `profils.json` | Définition des profils |
| `categories.json` | Catégories d'outils |
| `droits_roles.json` | Documentation des droits |

### 02_TRAVAIL/ (initialisés vides)
| Fichier | Rôle |
|---|---|
| `actions.json` | Actions agence |
| `stock.json` | Suivi stock |
| `clients.json` | Fiches clients |
| `devis.json` | Devis et relances |
| `commandes.json` | Suivi commandes |
| `livraisons.json` | Suivi livraisons |
| `securite.json` | Contrôles sécurité |
| `journal.json` | Journal d'audit (tableau vide `[]`) |

### 01_REFERENTIELS/
| Fichier | Rôle |
|---|---|
| `fournisseurs.json` | Référentiel fournisseurs |

## 4. Ajouter la webpart sur une page

1. Ouvrir ou créer une **page SharePoint moderne**
2. Cliquer **Modifier** → **+** → rechercher **Hub Agence**
3. Ajouter la webpart et publier la page

## 5. Adapter applications.json

Le fichier `00_CONFIG/applications.json` est le seul à personnaliser obligatoirement.

Remplacer les `path` par les URLs réelles de votre site :
```json
"path": "/sites/VOTRE-SITE/SitePages/Cockpit-Agence.aspx"
```

## 6. Vérification

- [ ] La webpart s'affiche sans erreur rouge
- [ ] Les 11 applications du hub sont visibles
- [ ] La recherche fonctionne
- [ ] Un clic sur une carte ouvre la page cible
- [ ] Les favoris se sauvegardent (étoile jaune persistante)
- [ ] Le panneau Paramètres (⚙) affiche l'utilisateur connecté et "Graph : connecté"
