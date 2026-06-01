import { SPHttpClient } from '@microsoft/sp-http';
import { ApplicationItem } from '../models/ApplicationItem';
import { UserRole } from '../models/UserRole';
import { readJson } from './sharepointStorageService';
import { validateApplicationItem } from '../utils/validateApplicationItem';
import { normalizeString } from '../utils/normalize';
import { dedupeApplications } from '../utils/dedupe';

const APPLICATIONS_PATH = 'Agences/BREAL/apps/Cockpit_Agence/00_CONFIG/applications.json';

export async function loadApplications(
  spHttpClient: SPHttpClient,
  webUrl: string,
  webRelativeUrl: string
): Promise<ApplicationItem[]> {
  const raw = await readJson<unknown>(spHttpClient, webUrl, webRelativeUrl, APPLICATIONS_PATH);
  const items = Array.isArray(raw) ? raw : [];
  const validated = validateApplications(items);
  const { unique } = dedupeApplications(validated);
  return unique;
}

export function validateApplications(items: unknown[]): ApplicationItem[] {
  return items.filter((item): item is ApplicationItem => validateApplicationItem(item));
}

export function filterApplications(
  items: ApplicationItem[],
  filter: UserRole,
  favorites: string[],
  searchQuery: string
): ApplicationItem[] {
  let filtered: ApplicationItem[];

  switch (filter) {
    case 'Tous':
      filtered = items.filter((app) => app.status === 'actif');
      break;
    case 'Favoris':
      filtered = items.filter((app) => app.status === 'actif' && favorites.includes(app.id));
      break;
    case 'Fournisseurs':
      filtered = items.filter((app) => app.status === 'actif' && app.category === 'Fournisseurs');
      break;
    default:
      filtered = items.filter(
        (app) => app.status === 'actif' && (app.profile === filter || app.profile === 'Tous')
      );
      break;
  }

  if (searchQuery.trim() !== '') {
    const q = normalizeString(searchQuery);
    filtered = filtered.filter((app) =>
      normalizeString(app.title).includes(q) ||
      normalizeString(app.description).includes(q) ||
      normalizeString(app.category).includes(q) ||
      normalizeString(app.profile).includes(q) ||
      normalizeString(app.path).includes(q) ||
      app.tags.some((tag) => normalizeString(tag).includes(q))
    );
  }

  filtered.sort((a, b) => {
    if (a.priority !== b.priority) return a.priority - b.priority;
    return a.title.localeCompare(b.title, 'fr');
  });

  return filtered;
}
