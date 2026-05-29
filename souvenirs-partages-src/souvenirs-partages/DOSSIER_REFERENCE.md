# Dossier de référence — SouvenirsPartagés

## 1. Objectif du projet

Créer une page HTML originale pour présenter une solution de collecte de photos et vidéos d’événements privés via QR code.

Le projet ne doit pas copier WedShoots. Il doit reprendre uniquement le principe générique : permettre à un organisateur de créer un album privé, de générer un QR code, d’inviter ses proches et de récupérer les photos après l’événement.

Nom du prototype : **SouvenirsPartagés**

## 2. Proposition de valeur

**SouvenirsPartagés permet de créer un album privé pour collecter facilement les photos et vidéos des invités grâce à un simple QR code.**

Promesse courte :

> Tous les souvenirs de votre événement, réunis dans un album privé.

Promesse orientée conversion :

> Créez votre album, partagez un QR code, recevez les photos de vos invités sans installer d’application.

Différenciation principale :

> Aucune application obligatoire. Vos invités participent directement depuis leur navigateur mobile.

## 3. Cible utilisateur

### Organisateurs

- Mariés.
- Parents organisant un baptême ou anniversaire.
- Familles.
- Wedding planners.
- Entreprises organisant des événements internes.

### Invités

- Personnes présentes à l’événement.
- Utilisateurs mobile.
- Besoin d’un parcours très simple : scanner, ajouter, valider.

## 4. Fonctionnalités MVP

| Fonctionnalité | Objectif | Recréation propre |
|---|---|---|
| Création d’album | Créer un espace privé | Formulaire HTML relié plus tard à une base |
| Code album | Identifier l’événement | Génération locale fictive en JS |
| QR code | Simplifier l’accès | QR fictif en CSS, remplaçable par une API |
| Galerie | Montrer les souvenirs | Cartes CSS dynamiques |
| Filtres | Trier les contenus | JS vanilla |
| Copie lien | Faciliter le partage | Clipboard API |
| FAQ | Lever les objections | Accordéon JS |
| Mode sombre | Moderniser l’UX | Classe CSS sur body |

## 5. Structure recommandée

### Landing page

1. Header.
2. Hero.
3. Comment ça marche.
4. Bénéfices.
5. Démo création album.
6. QR code.
7. Galerie fictive.
8. Sécurité/confidentialité.
9. Tarifs.
10. FAQ.
11. Footer.

### Démo produit

Champs du formulaire :

- Nom de l’événement.
- Type d’événement.
- Date.
- Prénom organisateur.
- Commentaires activés.
- Galerie privée.

Résultat :

- Titre de l’album.
- Code album.
- Lien fictif.
- QR code fictif.
- Boutons de partage.

## 6. Données fictives

```js
const demoEvents = [
  {
    name: "Mariage de Léa & Thomas",
    code: "SP-84K2",
    type: "Mariage",
    photos: 128,
    guests: 46
  },
  {
    name: "Anniversaire de Camille",
    code: "SP-39B7",
    type: "Anniversaire",
    photos: 74,
    guests: 22
  }
];

const demoGallery = [
  { title: "Cérémonie", category: "recent", favorite: true },
  { title: "Cocktail", category: "recent", favorite: false },
  { title: "Première danse", category: "favorite", favorite: true },
  { title: "Famille", category: "favorite", favorite: true },
  { title: "Amis", category: "recent", favorite: false },
  { title: "Soirée", category: "recent", favorite: false },
  { title: "Discours", category: "favorite", favorite: true },
  { title: "Décoration", category: "recent", favorite: false }
];
```

## 7. Règles UX

Priorité mobile :

- CTA visible rapidement.
- Textes courts.
- Formulaire simple.
- Gros boutons.
- QR code très visible.
- Galerie fluide.

Réduction de friction :

- Ne pas demander trop d’informations.
- Pas de compte invité.
- Pas d’application obligatoire.
- Consentement simple avant upload réel.

## 8. Règles légales

À éviter absolument :

- Nom WedShoots.
- Logos de concurrents.
- Captures d’écran de concurrents.
- Textes originaux d’un concurrent.
- Couleurs ou identité visuelle trop proches.
- Code propriétaire.
- Données propriétaires.
- Toute mention laissant croire à une affiliation.

Formulation à intégrer :

> SouvenirsPartagés est une solution indépendante de collecte privée de photos et vidéos d’événements.

## 9. Backlog d’évolution

| Priorité | Fonctionnalité | Impact |
|---|---|---|
| P1 | Upload sans compte | Adoption invitée |
| P1 | QR code imprimable | Partage événement |
| P1 | Export ZIP | Valeur organisateur |
| P1 | Suppression photo | Sécurité |
| P1 | Consentement invité | Conformité |
| P2 | Support vidéo | Valeur perçue |
| P2 | Commentaires | Engagement |
| P2 | Galerie live | Animation |
| P2 | Modération IA | Qualité |
| P3 | Album imprimé | Monétisation |
| P3 | Espace pro | B2B |

## 10. Stack future recommandée

Pour passer du prototype au produit :

- Front-end : Next.js ou React.
- Base : Supabase.
- Stockage : Cloudflare R2, S3 ou Supabase Storage.
- Paiement : Stripe.
- E-mail : Brevo ou Resend.
- Automatisation MVP : Make.
- QR code : génération serveur ou librairie JS.
- Authentification : Supabase Auth.
- Traitement image : Cloudinary.

## 11. Version no-code possible

MVP rapide :

- Glide pour l’interface.
- Google Sheets pour la base.
- Google Drive pour les fichiers.
- Make pour QR code, e-mails et export.
- Stripe Payment Links pour le paiement.

## 12. Critères de réussite

Le prototype est réussi si l’utilisateur comprend en moins de 5 secondes :

1. À quoi sert le produit.
2. Comment les invités participent.
3. Pourquoi le QR code simplifie tout.
4. Que l’album est privé.
5. Que l’organisateur peut récupérer les fichiers.
