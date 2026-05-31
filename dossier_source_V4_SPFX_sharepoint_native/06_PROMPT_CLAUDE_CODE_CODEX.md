# Prompt Claude Code / Codex — Génération projet V4 SPFx

Tu es un développeur senior SharePoint Framework, TypeScript, React, Microsoft Graph et applications métier internes.

## Objectif

Créer une application SharePoint Framework nommée **Hub Agence** pour une agence de négoce de matériaux. L'application doit remplacer un ancien hub HTML autonome et devenir une webpart SharePoint native.

## Contexte métier

L'utilisateur est chef d'agence dans le négoce de matériaux. Il veut un hub interne pour accéder à ses outils métier : cockpit agence, stock, quantitatifs chantier, fournisseurs, documents, sécurité, clients, devis, commandes, livraisons, actions, journal et paramètres.

## Contraintes non négociables

- Pas de Power Automate.
- Pas de webhook.
- Pas d'import/export manuel comme méthode principale.
- Pas de mot de passe, token ou secret client dans le code.
- Sauvegarde automatique directe dans SharePoint.
- Droits gérés par Microsoft 365 / SharePoint.
- Données stockées en JSON dans une bibliothèque SharePoint.
- Interface simple, responsive, lisible et adaptée à un usage terrain.
- Charte visuelle : jaune, noir, gris anthracite, style Tout Faire Matériaux.
- Code TypeScript propre, maintenable, typé.
- Utiliser MSGraphClientV3 pour Microsoft Graph.
- Prévoir gestion d'erreurs, états vides, chargement, sauvegarde en cours, sauvegarde réussie, sauvegarde échouée.
- Prévoir une journalisation des actions importantes.

## Fonctionnalités attendues

1. Afficher une grille de cartes d'outils.
2. Filtrer par profil : Tous, Chef agence, Comptoir, Dépôt, Admin, Fournisseurs, Favoris.
3. Recherche rapide.
4. Favoris par utilisateur.
5. Lecture du fichier SharePoint : `/Cockpit_Agence/00_CONFIG/applications.json`.
6. Sauvegarde des favoris dans : `/Cockpit_Agence/02_TRAVAIL/favoris_{userId}.json`.
7. Lecture et écriture des fichiers JSON métier : actions.json, stock.json, clients.json, devis.json, commandes.json, livraisons.json, securite.json, journal.json.
8. Panneau paramètres affichant : site SharePoint courant, bibliothèque cible, état de connexion Graph, dernière sauvegarde, erreurs récentes.
9. Journal d'audit dans : `/Cockpit_Agence/02_TRAVAIL/journal.json`.

## Structure technique attendue

- Projet SPFx React TypeScript.
- Composants :
  - HubAgence.tsx
  - ToolCard.tsx
  - FilterBar.tsx
  - SearchBox.tsx
  - SettingsPanel.tsx
  - StatusBar.tsx
  - ErrorBanner.tsx
- Services :
  - graphService.ts
  - sharepointStorageService.ts
  - appRegistryService.ts
  - favoriteService.ts
  - auditLogService.ts
- Models :
  - ApplicationItem.ts
  - HubConfig.ts
  - UserRole.ts
  - SaveStatus.ts
  - AuditEvent.ts

## Règles métier

- L'onglet Favoris ne doit afficher que les favoris.
- L'onglet Fournisseurs ne doit afficher que la catégorie Fournisseurs.
- Les profils Chef agence, Comptoir, Dépôt, Admin affichent les applications du profil + celles en profil Tous.
- Les applications archivées ne doivent pas apparaître par défaut.
- Les doublons doivent être détectés par id, path, ou couple title + category.
- Une erreur Graph doit être visible et compréhensible.

## Livrables attendus

1. Code complet du projet SPFx.
2. README de déploiement.
3. Exemple de `applications.json`.
4. Exemple de `droits_roles.json`.
5. Instructions pour déployer dans SharePoint App Catalog.
6. Liste des permissions Graph à déclarer.
7. Checklist de test.

## Critères de réussite

- La webpart s'affiche dans une page SharePoint moderne.
- Les cartes d'outils s'affichent depuis `applications.json`.
- La recherche fonctionne.
- Les favoris fonctionnent.
- La sauvegarde écrit réellement dans SharePoint via Microsoft Graph.
- Les erreurs sont visibles pour l'utilisateur.
- Aucun secret n'est présent dans le code.
