import { SPHttpClient } from '@microsoft/sp-http';
import { readJson, writeJson, isNotFoundError } from './sharepointStorageService';

function getFavoritesPath(userId: string): string {
  const safe = userId.replace(/[^a-zA-Z0-9._-]/g, '_');
  return `Cockpit_Agence/02_TRAVAIL/favoris_${safe}.json`;
}

export async function loadFavorites(
  spHttpClient: SPHttpClient,
  webUrl: string,
  webRelativeUrl: string,
  userId: string
): Promise<string[]> {
  try {
    const data = await readJson<unknown>(spHttpClient, webUrl, webRelativeUrl, getFavoritesPath(userId));
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
  spHttpClient: SPHttpClient,
  webUrl: string,
  webRelativeUrl: string,
  userId: string,
  favorites: string[]
): Promise<void> {
  await writeJson(spHttpClient, webUrl, webRelativeUrl, getFavoritesPath(userId), favorites);
}
