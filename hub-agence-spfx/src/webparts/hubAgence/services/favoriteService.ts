import { MSGraphClientV3 } from '@microsoft/sp-http';
import { readJson, writeJson, isNotFoundError } from './sharepointStorageService';

function getFavoritesPath(userId: string): string {
  return `Cockpit_Agence/02_TRAVAIL/favoris_${userId}.json`;
}

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
    if (isNotFoundError(err)) return [];
    throw err;
  }
}

export async function saveFavorites(
  client: MSGraphClientV3,
  siteId: string,
  userId: string,
  favorites: string[]
): Promise<void> {
  await writeJson(client, siteId, getFavoritesPath(userId), favorites);
}
