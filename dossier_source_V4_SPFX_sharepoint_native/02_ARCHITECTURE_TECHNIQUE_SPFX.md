# Architecture technique V4 — SPFx, React, TypeScript, Graph

## 1. Architecture cible

```text
Page SharePoint moderne
→ WebPart SPFx Hub Agence
→ React / TypeScript
→ MSGraphClientV3
→ Bibliothèque SharePoint
→ Fichiers JSON métier
```

## 2. Structure projet recommandée

```text
hub-agence-spfx/
├── src/
│   └── webparts/
│       └── hubAgence/
│           ├── HubAgenceWebPart.ts
│           ├── components/
│           │   ├── HubAgence.tsx
│           │   ├── ToolCard.tsx
│           │   ├── FilterBar.tsx
│           │   ├── SearchBox.tsx
│           │   ├── SettingsPanel.tsx
│           │   ├── StatusBar.tsx
│           │   └── ErrorBanner.tsx
│           ├── services/
│           │   ├── graphService.ts
│           │   ├── sharepointStorageService.ts
│           │   ├── appRegistryService.ts
│           │   ├── favoriteService.ts
│           │   └── auditLogService.ts
│           ├── models/
│           │   ├── ApplicationItem.ts
│           │   ├── HubConfig.ts
│           │   ├── UserRole.ts
│           │   ├── SaveStatus.ts
│           │   └── AuditEvent.ts
│           ├── utils/
│           │   ├── normalize.ts
│           │   ├── dedupe.ts
│           │   ├── validateApplicationItem.ts
│           │   └── date.ts
│           └── styles/
│               └── HubAgence.module.scss
├── config/
├── sharepoint/
│   └── solution/
├── package.json
└── README.md
```

## 3. Services attendus

### graphService.ts

Responsabilité : fournir un client Microsoft Graph.

Fonctions attendues :

```ts
getGraphClient(): Promise<MSGraphClientV3>
getCurrentUser(): Promise<GraphUser>
```

### sharepointStorageService.ts

Responsabilité : lire / écrire les fichiers JSON dans SharePoint.

Fonctions attendues :

```ts
readJson<T>(path: string): Promise<T>
writeJson<T>(path: string, data: T): Promise<void>
fileExists(path: string): Promise<boolean>
ensureFolder(path: string): Promise<void>
```

### appRegistryService.ts

Responsabilité : charger et valider la liste des applications.

Fonctions attendues :

```ts
loadApplications(): Promise<ApplicationItem[]>
validateApplications(items: unknown[]): ApplicationItem[]
filterApplications(items: ApplicationItem[], filter: HubFilter): ApplicationItem[]
```

### favoriteService.ts

Responsabilité : gérer les favoris par utilisateur.

Fonctions attendues :

```ts
loadFavorites(userId: string): Promise<string[]>
saveFavorites(userId: string, favorites: string[]): Promise<void>
toggleFavorite(appId: string): Promise<string[]>
```

### auditLogService.ts

Responsabilité : journaliser les événements importants.

Fonctions attendues :

```ts
logEvent(event: AuditEvent): Promise<void>
logError(error: Error, context: string): Promise<void>
```

## 4. Modèles TypeScript

### ApplicationItem

```ts
export interface ApplicationItem {
  id: string;
  title: string;
  description: string;
  category: string;
  profile: 'Tous' | 'Chef agence' | 'Comptoir' | 'Dépôt' | 'Admin';
  path: string;
  icon?: string;
  priority: number;
  status: 'actif' | 'brouillon' | 'archive';
  tags: string[];
  owner?: string;
  lastReview?: string;
}
```

### HubConfig

```ts
export interface HubConfig {
  appName: string;
  version: string;
  baseFolder: string;
  configFolder: string;
  workFolder: string;
  archiveFolder: string;
  applicationsFile: string;
  auditFile: string;
}
```

### AuditEvent

```ts
export interface AuditEvent {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: string;
  target: string;
  status: 'success' | 'warning' | 'error';
  details?: string;
}
```

## 5. Règles anti-doublons

Deux applications sont considérées comme doublons si :

1. elles ont le même `id` ;
2. ou elles ont le même `path` ;
3. ou elles ont le même `title` dans la même `category`.

Le système doit :

- conserver la première occurrence valide ;
- journaliser les doublons supprimés ;
- afficher une alerte admin si `applications.json` contient des doublons.

## 6. Règles de filtrage

```ts
if (filter === 'Tous') return activeApps;
if (filter === 'Favoris') return activeApps.filter(app => favorites.includes(app.id));
if (filter === 'Fournisseurs') return activeApps.filter(app => app.category === 'Fournisseurs');
return activeApps.filter(app => app.profile === filter || app.profile === 'Tous');
```

## 7. États techniques obligatoires

- `idle` : aucun chargement.
- `loading` : chargement en cours.
- `saving` : sauvegarde en cours.
- `saved` : sauvegarde réussie.
- `error` : erreur.
- `offlineFallback` : lecture locale temporaire si Graph indisponible, uniquement si prévu.

## 8. Limites assumées

La V4 ne doit pas tenter de contourner SharePoint. Si l'utilisateur n'a pas les droits sur la bibliothèque, l'écriture doit échouer proprement avec un message clair.
