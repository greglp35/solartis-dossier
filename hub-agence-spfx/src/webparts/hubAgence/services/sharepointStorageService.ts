import { MSGraphClientV3 } from '@microsoft/sp-http';

/**
 * Reads a JSON file from a SharePoint document library via the Graph API.
 * Returns parsed JSON of type T.
 * Throws if the file exists but cannot be parsed.
 * Throws if there is an unexpected error.
 */
export async function readJson<T>(
  client: MSGraphClientV3,
  siteId: string,
  path: string
): Promise<T> {
  const apiPath = `/sites/${siteId}/drive/root:/${path}:/content`;
  const response: Response = await client.api(apiPath).responseType('blob').get();

  const text = await response.text();
  return JSON.parse(text) as T;
}

/**
 * Writes a JSON-serialisable object as a file in a SharePoint document library.
 * Creates or replaces the file at the given path.
 */
export async function writeJson<T>(
  client: MSGraphClientV3,
  siteId: string,
  path: string,
  data: T
): Promise<void> {
  const apiPath = `/sites/${siteId}/drive/root:/${path}:/content`;
  const body = JSON.stringify(data, null, 2);
  await client
    .api(apiPath)
    .header('Content-Type', 'application/json')
    .put(body);
}

/**
 * Returns true if the file exists in the SharePoint library, false if it returns 404.
 * Re-throws on any other error.
 */
export async function fileExists(
  client: MSGraphClientV3,
  siteId: string,
  path: string
): Promise<boolean> {
  try {
    const apiPath = `/sites/${siteId}/drive/root:/${path}`;
    await client.api(apiPath).get();
    return true;
  } catch (err: unknown) {
    if (isNotFoundError(err)) {
      return false;
    }
    throw err;
  }
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
