# Permissions Microsoft Graph et sécurité — V4 SPFx

## 1. Objectif

Permettre à la webpart SPFx de lire et écrire des fichiers JSON dans une bibliothèque SharePoint via Microsoft Graph, sans Power Automate et sans secret dans le code.

## 2. Permissions de démarrage

Pour un prototype encadré :

```text
User.Read
Files.ReadWrite.All
Sites.ReadWrite.All
```

## 3. Analyse critique

`Sites.ReadWrite.All` est large. Cette permission permet potentiellement d'écrire sur beaucoup de sites accessibles selon le contexte tenant. Elle peut être refusée par l'administrateur Microsoft 365.

Pour une version plus propre, viser une restriction au site ou à la bibliothèque concernée si l'environnement Microsoft 365 le permet.

## 4. Règles de sécurité non négociables

| Sujet | Règle |
|---|---|
| Secret client | Interdit dans le code navigateur. |
| Token | Ne jamais écrire un token dans un fichier JSON ou localStorage métier. |
| AS400 / ERP | Aucun identifiant ou requête sensible dans SharePoint ou le code. |
| Droits | Les droits réels sont ceux de SharePoint. |
| Erreur permissions | Afficher un message clair, ne jamais contourner. |
| Journal | Journaliser les erreurs sans exposer de données sensibles. |

## 5. Messages d'erreur utiles

### Pas de droit de lecture

```text
Vous n'avez pas les droits nécessaires pour lire la configuration du Hub Agence. Contactez l'administrateur SharePoint ou le responsable agence.
```

### Pas de droit d'écriture

```text
La sauvegarde SharePoint a échoué : votre compte ne dispose probablement pas des droits d'écriture sur le dossier Cockpit_Agence.
```

### Fichier introuvable

```text
Le fichier de configuration applications.json est introuvable. Vérifiez l'arborescence SharePoint : Cockpit_Agence/00_CONFIG/applications.json.
```

## 6. Validation avant déploiement

Avant mise en production :

- faire valider les permissions par l'administrateur Microsoft 365 ;
- limiter le périmètre SharePoint ;
- vérifier que seuls les utilisateurs autorisés voient la page ;
- vérifier que seuls les profils autorisés modifient les fichiers ;
- tester avec un utilisateur lecteur seule ;
- tester avec un utilisateur contributeur ;
- tester avec un administrateur.

## 7. Position de vérité

Un filtre de profil dans l'interface n'est pas une sécurité. La sécurité réelle dépend uniquement des droits SharePoint / Microsoft 365.
