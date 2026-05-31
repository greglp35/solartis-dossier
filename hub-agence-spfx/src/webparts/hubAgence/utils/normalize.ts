/**
 * Normalize a string: lowercase, trim, remove accents/diacritics.
 */
export function normalizeString(s: string): string {
  return s
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');
}
