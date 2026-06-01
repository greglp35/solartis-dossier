import { ApplicationItem } from '../models/ApplicationItem';

const VALID_PROFILES = ['Tous', 'Chef agence', 'Comptoir', 'Dépôt', 'Admin'] as const;
const VALID_STATUSES = ['actif', 'brouillon', 'archive'] as const;

/**
 * Type guard: returns true if the given unknown value is a valid ApplicationItem.
 */
export function validateApplicationItem(item: unknown): item is ApplicationItem {
  if (typeof item !== 'object' || item === null) {
    return false;
  }

  const obj = item as Record<string, unknown>;

  if (typeof obj['id'] !== 'string' || obj['id'].trim() === '') return false;
  if (typeof obj['title'] !== 'string' || obj['title'].trim() === '') return false;
  if (typeof obj['description'] !== 'string') return false;
  if (typeof obj['category'] !== 'string' || obj['category'].trim() === '') return false;
  if (typeof obj['path'] !== 'string' || obj['path'].trim() === '') return false;
  if (typeof obj['priority'] !== 'number') return false;

  if (!VALID_PROFILES.includes(obj['profile'] as (typeof VALID_PROFILES)[number])) return false;
  if (!VALID_STATUSES.includes(obj['status'] as (typeof VALID_STATUSES)[number])) return false;

  if (!Array.isArray(obj['tags'])) return false;
  for (const tag of obj['tags'] as unknown[]) {
    if (typeof tag !== 'string') return false;
  }

  // Optional fields
  if (obj['icon'] !== undefined && typeof obj['icon'] !== 'string') return false;
  if (obj['owner'] !== undefined && typeof obj['owner'] !== 'string') return false;
  if (obj['lastReview'] !== undefined && typeof obj['lastReview'] !== 'string') return false;

  return true;
}
