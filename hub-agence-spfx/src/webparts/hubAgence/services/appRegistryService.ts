import { MSGraphClientV3 } from '@microsoft/sp-http';
import { ApplicationItem } from '../models/ApplicationItem';
import { UserRole } from '../models/UserRole';
import { readJson } from './sharepointStorageService';
import { validateApplicationItem } from '../utils/validateApplicationItem';
import { normalizeString } from '../utils/normalize';
import { dedupeApplications } from '../utils/dedupe';

const APPLICATIONS_PATH = 'Cockpit_Agence/00_CONFIG/applications.json';

/**
 * Loads applications from SharePoint.
 * Returns deduplicated, validated active + draft + archive items.
 */
export async function loadApplications(
  client: MSGraphClientV3,
  siteId: string
): Promise<ApplicationItem[]> {
  const raw = await readJson<unknown>(client, siteId, APPLICATIONS_PATH);

  const items = Array.isArray(raw) ? raw : [];
  const validated = validateApplications(items);
  const { unique } = dedupeApplications(validated);

  return unique;
}

/**
 * Validates an array of unknown items and returns only those that pass validation.
 */
export function validateApplications(items: unknown[]): ApplicationItem[] {
  return items.filter((item): item is ApplicationItem => validateApplicationItem(item));
}

/**
 * Filters applications based on the selected role, favorites list and search query.
 */
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
      filtered = items.filter(
        (app) => app.status === 'actif' && favorites.includes(app.id)
      );
      break;

    case 'Fournisseurs':
      filtered = items.filter(
        (app) => app.status === 'actif' && app.category === 'Fournisseurs'
      );
      break;

    default:
      filtered = items.filter(
        (app) =>
          app.status === 'actif' &&
          (app.profile === filter || app.profile === 'Tous')
      );
      break;
  }

  if (searchQuery.trim() !== '') {
    const q = normalizeString(searchQuery);
    filtered = filtered.filter((app) => {
      return (
        normalizeString(app.title).includes(q) ||
        normalizeString(app.description).includes(q) ||
        normalizeString(app.category).includes(q) ||
        normalizeString(app.profile).includes(q) ||
        normalizeString(app.path).includes(q) ||
        app.tags.some((tag) => normalizeString(tag).includes(q))
      );
    });
  }

  // Sort by priority ascending, then alphabetically
  filtered.sort((a, b) => {
    if (a.priority !== b.priority) return a.priority - b.priority;
    return a.title.localeCompare(b.title, 'fr');
  });

  return filtered;
}
