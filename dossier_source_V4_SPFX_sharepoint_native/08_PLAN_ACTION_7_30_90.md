# Plan d'action 7 / 30 / 90 jours — V4 SharePoint native

## 7 jours — Cadrage et socle

Objectif : verrouiller la base avant développement.

Actions :

1. Valider l'arborescence SharePoint `Cockpit_Agence`.
2. Créer les fichiers JSON initiaux.
3. Valider les profils et catégories.
4. Valider les permissions Graph avec l'administrateur Microsoft 365.
5. Lancer le projet SPFx vierge.
6. Intégrer le chargement de `applications.json`.
7. Afficher la grille de cartes.
8. Corriger dès le départ la logique Favoris / Fournisseurs / Profils.

Livrable attendu : webpart qui affiche les cartes depuis SharePoint.

## 30 jours — Version fonctionnelle

Objectif : obtenir une V4 utilisable en environnement test.

Actions :

1. Ajouter recherche et filtres.
2. Ajouter favoris par utilisateur.
3. Ajouter écriture JSON via Graph.
4. Ajouter journal d'audit.
5. Ajouter panneau de statut technique.
6. Tester droits lecture seule / contributeur / admin.
7. Corriger les erreurs UX.
8. Documenter le déploiement.

Livrable attendu : V4 testable avec sauvegarde SharePoint réelle.

## 90 jours — Version robuste agence

Objectif : stabiliser pour usage métier réel.

Actions :

1. Réduire les permissions Graph si possible.
2. Ajouter archivage automatique des JSON critiques.
3. Ajouter tableau de diagnostic des fichiers.
4. Ajouter suivi des erreurs récentes.
5. Ajouter validation de schéma JSON.
6. Ajouter traçabilité des modifications de configuration.
7. Former les utilisateurs clés.
8. Définir règles de maintenance.

Livrable attendu : hub SharePoint opérationnel, maintenable et gouverné.
