import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';

function encodeSegment(s: string): string {
  return encodeURIComponent(s);
}

function buildFileUrl(webRelativeUrl: string, filePath: string): string {
  const base = webRelativeUrl.replace(/\/$/, '');
  return `${base}/Documents/${filePath}`;
}

function buildFolderUrl(webRelativeUrl: string, filePath: string): string {
  const parts = filePath.split('/');
  const folderParts = parts.slice(0, parts.length - 1);
  const base = webRelativeUrl.replace(/\/$/, '');
  return `${base}/Documents/${folderParts.join('/')}`;
}

function buildFileName(filePath: string): string {
  const parts = filePath.split('/');
  return parts[parts.length - 1];
}

export async function readJson<T>(
  spHttpClient: SPHttpClient,
  webUrl: string,
  webRelativeUrl: string,
  path: string
): Promise<T> {
  const serverRelativePath = buildFileUrl(webRelativeUrl, path);
  const encodedPath = encodeSegment(serverRelativePath);
  const apiUrl = `${webUrl}/_api/web/getfilebyserverrelativeurl('${encodedPath}')/$value`;

  const response: SPHttpClientResponse = await spHttpClient.get(
    apiUrl,
    SPHttpClient.configurations.v1
  );

  if (!response.ok) {
    const err = new Error(`Lecture fichier échouée (${response.status}): ${path}`);
    (err as Error & { status: number }).status = response.status;
    throw err;
  }

  const text = await response.text();
  return JSON.parse(text) as T;
}

export async function writeJson<T>(
  spHttpClient: SPHttpClient,
  webUrl: string,
  webRelativeUrl: string,
  path: string,
  data: T
): Promise<void> {
  const folderRelativePath = buildFolderUrl(webRelativeUrl, path);
  const encodedFolder = encodeSegment(folderRelativePath);
  const fileName = buildFileName(path);
  const body = JSON.stringify(data, null, 2);

  const apiUrl = `${webUrl}/_api/web/getfolderbyserverrelativeurl('${encodedFolder}')/files/add(overwrite=true,url='${encodeSegment(fileName)}')`;

  const response: SPHttpClientResponse = await spHttpClient.post(
    apiUrl,
    SPHttpClient.configurations.v1,
    {
      headers: { 'Content-Type': 'application/json' },
      body,
    }
  );

  if (!response.ok) {
    throw new Error(`Écriture fichier échouée (${response.status}): ${path}`);
  }
}

export function isNotFoundError(err: unknown): boolean {
  if (typeof err === 'object' && err !== null) {
    const e = err as Record<string, unknown>;
    if (e['status'] === 404) return true;
    if (e['statusCode'] === 404) return true;
    const msg = typeof e['message'] === 'string' ? e['message'] : '';
    if (msg.includes('404') || msg.toLowerCase().includes('not found')) return true;
  }
  return false;
}
