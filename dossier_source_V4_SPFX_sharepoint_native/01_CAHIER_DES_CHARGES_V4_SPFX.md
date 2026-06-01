# Cahier des charges V4 — Hub Agence SharePoint native SPFx

## 1. Contexte compris

Le projet consiste à transformer un hub HTML autonome en une application SharePoint native. L'utilisateur souhaite gérer un environnement d'agence de négoce de matériaux avec plusieurs outils métier : cockpit agence, stock, fournisseurs, sécurité, documents, clients, devis, commandes, livraisons, actions, journal et paramètres.

La demande validée est claire :

- pas de Power Automate ;
- pas de webhook ;
- pas de simple fichier HTML isolé comme socle définitif ;
- sauvegarde directe dans SharePoint ;
- utilisation des droits Microsoft 365 / SharePoint ;
- architecture professionnelle et maintenable.

## 2. Objectif métier

Créer une webpart SharePoint Framework nommée **Hub Agence**, intégrée dans une page SharePoint moderne, permettant :

1. d'ouvrir les outils métier de l'agence ;
2. de centraliser les accès ;
3. de filtrer par profil et catégorie ;
4. de gérer les favoris par utilisateur ;
5. de lire et écrire des fichiers JSON dans SharePoint ;
6. de journaliser les actions importantes ;
7. de maintenir une base exploitable par le chef d'agence et l'équipe.

## 3. Périmètre fonctionnel V4

### Inclus

- Hub d'accès aux outils métier.
- Recherche rapide.
- Filtres par profil : Tous, Chef agence, Comptoir, Dépôt, Admin, Fournisseurs, Favoris.
- Cartes d'outils configurables via `applications.json`.
- Favoris sauvegardés par utilisateur.
- Lecture / écriture JSON dans SharePoint via Microsoft Graph.
- Journal d'audit.
- Panneau de statut technique.
- États : chargement, sauvegarde en cours, sauvegarde réussie, erreur.
- Gestion des erreurs lisible par un utilisateur non technique.

### Exclu en V4

- Connexion directe AS400 / TFI.
- Écriture dans l'ERP.
- Power Automate.
- Webhook public.
- Stockage de mots de passe, secrets ou tokens dans le code.
- Gestion RH ou sécurité juridique avancée hors données fournies.

## 4. Contraintes non négociables

| Contrainte | Règle |
|---|---|
| Sécurité | Aucun mot de passe, secret client, token, requête SQL ou identifiant ERP dans le code. |
| SharePoint | Les droits réels sont portés par SharePoint / Microsoft 365. |
| Données | Les données métier sont stockées dans des fichiers JSON SharePoint. |
| Sauvegarde | La sauvegarde directe se fait via Microsoft Graph. |
| UX | Interface simple, rapide, lisible, responsive, adaptée terrain. |
| Maintenance | Code typé, structuré, modulaire, documenté. |
| Gouvernance | Journal d'audit pour actions importantes. |

## 5. Utilisateurs cibles

| Profil | Usage principal |
|---|---|
| Chef agence | Pilotage, priorités, stock, sécurité, clients, actions. |
| Comptoir | Quantitatifs, devis, documents, fournisseurs, demandes de prix. |
| Dépôt | Stock, livraisons, sécurité, commandes à préparer. |
| Admin | Paramétrage, applications, référentiels, suivi technique. |
| Tous | Accès aux outils communs. |

## 6. Fonctionnalités détaillées

### 6.1 Hub d'applications

Le hub affiche les applications déclarées dans :

```text
/Cockpit_Agence/00_CONFIG/applications.json
```

Chaque application comprend :

- identifiant ;
- titre ;
- description ;
- catégorie ;
- profil principal ;
- chemin ou URL ;
- priorité ;
- statut ;
- icône courte ;
- tags.

### 6.2 Recherche et filtres

La recherche doit interroger :

- titre ;
- description ;
- catégorie ;
- profil ;
- tags ;
- chemin.

Les onglets spéciaux doivent être traités séparément :

```text
Tous = toutes les applications actives
Favoris = uniquement les favoris de l'utilisateur
Fournisseurs = uniquement catégorie Fournisseurs
Chef agence / Comptoir / Dépôt / Admin = profil ciblé + profil Tous
```

### 6.3 Favoris

Les favoris doivent être sauvegardés par utilisateur dans :

```text
/Cockpit_Agence/02_TRAVAIL/favoris_{userId}.json
```

Le `userId` doit provenir du contexte SharePoint / Graph, jamais d'une saisie manuelle.

### 6.4 Journal d'audit

Chaque action importante doit être journalisée :

- ajout favori ;
- retrait favori ;
- ouverture outil ;
- erreur lecture JSON ;
- erreur sauvegarde JSON ;
- mise à jour configuration ;
- changement de statut.

Fichier cible :

```text
/Cockpit_Agence/02_TRAVAIL/journal.json
```

### 6.5 Panneau technique

Le panneau paramètres doit afficher :

- utilisateur connecté ;
- site SharePoint courant ;
- bibliothèque cible ;
- dossier cible ;
- dernière sauvegarde ;
- état Graph ;
- erreurs récentes.

## 7. Critères de réussite

La V4 est considérée réussie si :

1. la webpart s'affiche dans une page SharePoint moderne ;
2. les applications se chargent depuis `applications.json` ;
3. la recherche fonctionne ;
4. les filtres ne créent pas de doublons ;
5. les favoris sont sauvegardés par utilisateur ;
6. les fichiers JSON sont réellement écrits dans SharePoint ;
7. les erreurs sont compréhensibles ;
8. aucun secret n'est dans le code ;
9. le projet est maintenable par un développeur SPFx.

## 8. Verdict

La V4 doit être traitée comme une application SharePoint professionnelle, pas comme un fichier HTML amélioré. Le bon socle technique est SPFx + TypeScript + React + Microsoft Graph.
