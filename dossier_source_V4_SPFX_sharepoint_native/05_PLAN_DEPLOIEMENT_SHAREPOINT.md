# Plan de déploiement SharePoint — V4 SPFx

## 1. Pré-requis

- Accès à un site SharePoint moderne.
- Droit de créer ou modifier une page SharePoint.
- Accès à une bibliothèque documentaire.
- Accès à l'App Catalog SharePoint ou à un administrateur pouvant déployer la solution.
- Node.js et environnement SPFx côté développement.

## 2. Étapes techniques

### Étape 1 — Créer l'arborescence SharePoint

Créer dans Documents partagés :

```text
Cockpit_Agence/00_CONFIG
Cockpit_Agence/01_REFERENTIELS
Cockpit_Agence/02_TRAVAIL
Cockpit_Agence/05_ARCHIVES/sauvegardes
```

### Étape 2 — Déposer les fichiers JSON initiaux

Déposer :

```text
00_CONFIG/hub_config.json
00_CONFIG/applications.json
00_CONFIG/profils.json
00_CONFIG/categories.json
00_CONFIG/droits_roles.json
02_TRAVAIL/actions.json
02_TRAVAIL/stock.json
02_TRAVAIL/clients.json
02_TRAVAIL/devis.json
02_TRAVAIL/commandes.json
02_TRAVAIL/livraisons.json
02_TRAVAIL/securite.json
02_TRAVAIL/journal.json
```

### Étape 3 — Générer le projet SPFx

Commande indicative :

```bash
yo @microsoft/sharepoint
```

Choix recommandés :

```text
Solution name: hub-agence-spfx
Framework: React
Language: TypeScript
Component type: WebPart
WebPart name: HubAgence
```

### Étape 4 — Intégrer les services Graph

Ajouter les services :

```text
graphService.ts
sharepointStorageService.ts
appRegistryService.ts
favoriteService.ts
auditLogService.ts
```

### Étape 5 — Déclarer les permissions Graph

Dans `package-solution.json`, prévoir les webApiPermissionRequests nécessaires.

### Étape 6 — Build et package

Commandes indicatives :

```bash
gulp build
gulp bundle --ship
gulp package-solution --ship
```

### Étape 7 — Déployer dans App Catalog

Déposer le package `.sppkg` dans l'App Catalog SharePoint.

### Étape 8 — Ajouter la webpart dans une page SharePoint

Créer ou modifier une page moderne, puis ajouter la webpart **Hub Agence**.

## 3. Tests après déploiement

1. La webpart s'affiche.
2. Les cartes se chargent depuis `applications.json`.
3. La recherche fonctionne.
4. Les filtres fonctionnent.
5. Les favoris sont sauvegardés.
6. Le journal est mis à jour.
7. Un utilisateur sans droit d'écriture obtient une erreur claire.

## 4. Critère de passage en production

La V4 ne doit pas être diffusée tant que :

- l'écriture JSON n'est pas confirmée ;
- les permissions sont validées ;
- la gestion d'erreur est testée ;
- la page SharePoint est accessible uniquement aux bons utilisateurs ;
- le journal d'audit fonctionne.
