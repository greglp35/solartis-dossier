# Checklist de recette — Hub Agence V4 SharePoint native

## 1. Installation

| Test | Attendu | Statut |
|---|---|---|
| Package SPFx déployé dans App Catalog | Solution disponible | À tester |
| Webpart ajoutée à une page moderne | Hub visible | À tester |
| Page accessible par l'équipe cible | Accès OK | À tester |
| Utilisateur non autorisé bloqué par SharePoint | Accès refusé | À tester |

## 2. Chargement configuration

| Test | Attendu | Statut |
|---|---|---|
| Chargement `applications.json` | Cartes affichées | À tester |
| Fichier absent | Message erreur clair | À tester |
| JSON invalide | Message erreur clair | À tester |
| Doublons dans JSON | Doublons ignorés + alerte | À tester |

## 3. Recherche et filtres

| Test | Attendu | Statut |
|---|---|---|
| Recherche par titre | Résultat correct | À tester |
| Recherche par catégorie | Résultat correct | À tester |
| Onglet Tous | Applications actives | À tester |
| Onglet Favoris | Uniquement favoris | À tester |
| Onglet Fournisseurs | Uniquement fournisseurs | À tester |
| Onglet Chef agence | Profil Chef agence + Tous | À tester |
| Onglet Comptoir | Profil Comptoir + Tous | À tester |
| Onglet Dépôt | Profil Dépôt + Tous | À tester |

## 4. Favoris

| Test | Attendu | Statut |
|---|---|---|
| Ajouter favori | Favori visible | À tester |
| Retirer favori | Favori retiré | À tester |
| Recharger page | Favori conservé | À tester |
| Autre utilisateur | Favoris séparés | À tester |
| Fichier favoris absent | Création automatique | À tester |

## 5. Sauvegarde SharePoint

| Test | Attendu | Statut |
|---|---|---|
| Écriture fichier JSON | Fichier mis à jour | À tester |
| Droit lecture seule | Erreur claire | À tester |
| Erreur réseau | Erreur claire + pas de perte immédiate | À tester |
| Dossier introuvable | Erreur claire | À tester |
| Journal mis à jour | Ligne audit créée | À tester |

## 6. UX / UI

| Test | Attendu | Statut |
|---|---|---|
| Desktop | Affichage propre | À tester |
| Tablette | Affichage propre | À tester |
| Mobile | Cartes lisibles | À tester |
| Clavier | Navigation possible | À tester |
| Contraste | Lisible | À tester |
| États vides | Message utile | À tester |

## 7. Sécurité

| Test | Attendu | Statut |
|---|---|---|
| Aucun secret dans le code | Conforme | À tester |
| Aucun token stocké dans JSON métier | Conforme | À tester |
| Aucun identifiant ERP | Conforme | À tester |
| Droits réels SharePoint testés | Conforme | À tester |
| Permissions Graph validées admin | Conforme | À tester |

## 8. Verdict recette

La solution est validable uniquement si :

- la lecture SharePoint fonctionne ;
- l'écriture SharePoint fonctionne ;
- les erreurs sont compréhensibles ;
- les droits sont testés ;
- les favoris sont bien séparés par utilisateur ;
- aucun secret n'est présent dans le code.
