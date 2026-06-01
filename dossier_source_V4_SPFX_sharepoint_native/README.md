# Dossier source V4 — Hub Agence SharePoint native SPFx

## Objectif

Ce dossier sert de base de référence pour transformer le hub HTML autonome en application SharePoint native via SharePoint Framework, Microsoft Graph et fichiers JSON stockés dans SharePoint.

La V4 vise une solution professionnelle :

- intégrée directement dans une page SharePoint ;
- sans Power Automate ;
- sans webhook ;
- sans import/export manuel comme méthode principale ;
- avec sauvegarde directe dans SharePoint ;
- avec droits portés par Microsoft 365 / SharePoint ;
- avec données métier centralisées en JSON.

## Contenu du dossier

```text
01_CAHIER_DES_CHARGES_V4_SPFX.md
02_ARCHITECTURE_TECHNIQUE_SPFX.md
03_MODELE_DONNEES_SHAREPOINT.md
04_PERMISSIONS_GRAPH_ET_SECURITE.md
05_PLAN_DEPLOIEMENT_SHAREPOINT.md
06_PROMPT_CLAUDE_CODE_CODEX.md
07_CHECKLIST_RECETTE_SHAREPOINT.md
08_PLAN_ACTION_7_30_90.md
config/
  applications.json
  droits_roles.json
  hub_config.json
  profils.json
  categories.json
data/modeles/
  actions.json
  stock.json
  clients.json
  devis.json
  commandes.json
  livraisons.json
  securite.json
  journal.json
sharepoint_arborescence/
  ARBORESCENCE_COCKPIT_AGENCE.md
```

## Verdict

Ce dossier est une base de cadrage et de génération. Il ne remplace pas encore un projet SPFx compilable. Il doit être transmis à Claude Code, Codex ou à un développeur SPFx pour créer le projet technique complet.
