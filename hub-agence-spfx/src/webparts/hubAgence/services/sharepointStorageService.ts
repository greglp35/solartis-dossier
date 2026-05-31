import { MSGraphClientV3 } from '@microsoft/sp-http';
import { ResponseType } from '@microsoft/microsoft-graph-client';

export function encodeSPPath(path: string): string {
  return path.split('/').map(encodeURIComponent).join('/');
}

export async function readJson<T>(
  client: MSGraphClientV3,
  siteId: string,
  path: string
): Promise<T> {
  const apiPath = `/sites/${siteId}/drive/root:/${encodeSPPath(path)}:/content`;
  const text: string = await client.api(apiPath).responseType(ResponseType.TEXT).get();
  return JSON.parse(text) as T;
}

export async function writeJson<T>(
  client: MSGraphClientV3,
  siteId: string,
  path: string,
  data: T
): Promise<void> {
  const apiPath = `/sites/${siteId}/drive/root:/${encodeSPPath(path)}:/content`;
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  await client.api(apiPath).header('Content-Type', 'application/json').put(blob);
}

export async function fileExists(
  client: MSGraphClientV3,
  siteId: string,
  path: string
): Promise<boolean> {
  try {
    const apiPath = `/sites/${siteId}/drive/root:/${encodeSPPath(path)}`;
    await client.api(apiPath).get();
    return true;
  } catch (err: unknown) {
    if (isNotFoundError(err)) return false;
    throw err;
  }
}

export function isNotFoundError(err: unknown): boolean {
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
