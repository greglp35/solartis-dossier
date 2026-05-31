# Modèle de données SharePoint — Hub Agence V4

## 1. Arborescence cible

```text
Documents partagés/
└── Cockpit_Agence/
    ├── 00_CONFIG/
    │   ├── hub_config.json
    │   ├── applications.json
    │   ├── profils.json
    │   ├── categories.json
    │   └── droits_roles.json
    ├── 01_REFERENTIELS/
    │   ├── fournisseurs.json
    │   ├── familles_produits.json
    │   ├── statuts.json
    │   └── priorites.json
    ├── 02_TRAVAIL/
    │   ├── actions.json
    │   ├── stock.json
    │   ├── clients.json
    │   ├── devis.json
    │   ├── commandes.json
    │   ├── livraisons.json
    │   ├── securite.json
    │   ├── journal.json
    │   └── favoris_{userId}.json
    └── 05_ARCHIVES/
        └── sauvegardes/
```

## 2. Principes de gouvernance

| Principe | Règle |
|---|---|
| Source commune | Les JSON SharePoint sont la source commune de la V4. |
| Droits réels | Les droits sont gérés par SharePoint, pas par l'interface. |
| Historique | Les actions importantes sont journalisées. |
| Données sensibles | Aucun secret, token, mot de passe ou identifiant ERP. |
| Validation humaine | Les actions critiques restent validées par le chef d'agence. |

## 3. Fichiers de configuration

### hub_config.json

Contient les paramètres généraux du hub.

### applications.json

Liste les outils affichés dans le hub.

### profils.json

Liste les profils d'usage métier.

### categories.json

Liste les catégories d'outils.

### droits_roles.json

Documente les droits attendus par rôle. Ce fichier ne remplace pas les droits SharePoint.

## 4. Fichiers de travail

### actions.json

Actions opérationnelles à suivre.

### stock.json

Références, alertes stock, mini/maxi, ruptures et surstocks.

### clients.json

Clients, statuts, signaux commerciaux et suivis.

### devis.json

Devis, relances, priorités, responsables.

### commandes.json

Commandes clients ou fournisseurs à suivre.

### livraisons.json

Livraisons prévues, anomalies, retards, statuts.

### securite.json

Contrôles sécurité, EPI, anomalies, actions correctives.

### journal.json

Journal d'audit commun.

## 5. Règles de nommage

- Fichiers JSON en minuscules.
- Pas d'espaces dans les noms de fichiers.
- Dossiers numérotés pour garder l'ordre logique.
- Favoris par utilisateur : `favoris_{userId}.json`.
- Archives datées : `YYYY-MM-DD_HH-mm_nomfichier.json`.

## 6. Données minimales par enregistrement

Chaque objet métier doit idéalement contenir :

```json
{
  "id": "string",
  "createdAt": "ISO date",
  "updatedAt": "ISO date",
  "createdBy": "user id or display name",
  "status": "string",
  "priority": "faible | moyenne | forte | bloquante",
  "source": "string",
  "confidence": "faible | moyen | fort"
}
```

## 7. Points de vigilance

- Ne pas stocker de données personnelles inutiles.
- Ne pas stocker de mots de passe.
- Ne pas stocker de requêtes SQL.
- Ne pas stocker d'identifiants AS400.
- Ne pas considérer le JSON comme une base transactionnelle lourde.
