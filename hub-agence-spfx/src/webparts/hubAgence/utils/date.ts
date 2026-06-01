/**
 * Returns the current date/time as an ISO 8601 string.
 */
export function toISOString(): string {
  return new Date().toISOString();
}

/**
 * Formats an ISO date string to "DD/MM/YYYY HH:mm".
 */
export function formatDate(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) {
    return iso;
  }

  const pad = (n: number): string => String(n).padStart(2, '0');

  const day = pad(d.getDate());
  const month = pad(d.getMonth() + 1);
  const year = d.getFullYear();
  const hours = pad(d.getHours());
  const minutes = pad(d.getMinutes());

  return `${day}/${month}/${year} ${hours}:${minutes}`;
}
