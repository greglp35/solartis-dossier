import { ApplicationItem } from '../models/ApplicationItem';

export interface DedupeResult {
  unique: ApplicationItem[];
  duplicates: ApplicationItem[];
}

/**
 * Deduplicate ApplicationItem list.
 * An item is considered a duplicate if it shares the same id,
 * the same path, or the same title+category combination as a previously seen item.
 */
export function dedupeApplications(items: ApplicationItem[]): DedupeResult {
  const seenIds = new Set<string>();
  const seenPaths = new Set<string>();
  const seenTitleCategory = new Set<string>();

  const unique: ApplicationItem[] = [];
  const duplicates: ApplicationItem[] = [];

  for (const item of items) {
    const titleCategoryKey = `${item.title.toLowerCase()}|${item.category.toLowerCase()}`;

    if (
      seenIds.has(item.id) ||
      seenPaths.has(item.path) ||
      seenTitleCategory.has(titleCategoryKey)
    ) {
      duplicates.push(item);
    } else {
      seenIds.add(item.id);
      seenPaths.add(item.path);
      seenTitleCategory.add(titleCategoryKey);
      unique.push(item);
    }
  }

  return { unique, duplicates };
}
