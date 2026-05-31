import { MSGraphClientV3 } from '@microsoft/sp-http';
import { readJson, writeJson } from './sharepointStorageService';

function getFavoritesPath(userId: string): string {
  return `Cockpit_Agence/02_TRAVAIL/favoris_${userId}.json`;
}

/**
 * Loads the favorite application IDs for a specific user.
 * Returns an empty array if the file does not exist yet.
 */
export async function loadFavorites(
  client: MSGraphClientV3,
  siteId: string,
  userId: string
): Promise<string[]> {
  try {
    const data = await readJson<unknown>(client, siteId, getFavoritesPath(userId));
    if (Array.isArray(data)) {
      return data.filter((item): item is string => typeof item === 'string');
    }
    return [];
  } catch (err: unknown) {
    if (isNotFoundError(err)) {
      return [];
    }
    throw err;
  }
}

/**
 * Saves the favorite application IDs for a specific user.
 */
export async function saveFavorites(
  client: MSGraphClientV3,
  siteId: string,
  userId: string,
  favorites: string[]
): Promise<void> {
  await writeJson(client, siteId, getFavoritesPath(userId), favorites);
}

function isNotFoundError(err: unknown): boolean {
  if (typeof err === 'object' && err !== null) {
    const e = err as Record<string, unknown>;
    if (e['statusCode'] === 404) return true;
    if (e['status'] === 404) return true;
    const body = e['body'];
    if (typeof body === 'string') {
      try {
        const parsed = JSON.parse(body) as Record<string, unknown>;
        const error = parsed['error'] as Record<string, unknown> | undefined;
        if (error && error['code'] === 'itemNotFound') return true;
      } catch {
        // not JSON
      }
    }
  }
  return false;
}
