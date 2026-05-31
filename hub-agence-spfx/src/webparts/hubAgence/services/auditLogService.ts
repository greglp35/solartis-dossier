import { MSGraphClientV3 } from '@microsoft/sp-http';
import { AuditEvent } from '../models/AuditEvent';
import { readJson, writeJson, isNotFoundError } from './sharepointStorageService';
import { toISOString } from '../utils/date';

const AUDIT_PATH = 'Cockpit_Agence/02_TRAVAIL/journal.json';
const MAX_EVENTS = 500;

// Serialize writes to avoid race conditions
let writeQueue: Promise<void> = Promise.resolve();

function isValidAuditEvent(e: unknown): e is AuditEvent {
  if (typeof e !== 'object' || e === null) return false;
  const ev = e as Record<string, unknown>;
  return (
    typeof ev['id'] === 'string' &&
    typeof ev['timestamp'] === 'string' &&
    typeof ev['userId'] === 'string' &&
    typeof ev['userName'] === 'string' &&
    typeof ev['action'] === 'string' &&
    typeof ev['target'] === 'string' &&
    (ev['status'] === 'success' || ev['status'] === 'warning' || ev['status'] === 'error')
  );
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function logEvent(
  client: MSGraphClientV3,
  siteId: string,
  event: AuditEvent
): Promise<void> {
  writeQueue = writeQueue.then(() => appendEvent(client, siteId, event)).catch(() => undefined);
  return writeQueue;
}

async function appendEvent(
  client: MSGraphClientV3,
  siteId: string,
  event: AuditEvent
): Promise<void> {
  let events: AuditEvent[] = [];

  try {
    const existing = await readJson<unknown>(client, siteId, AUDIT_PATH);
    if (Array.isArray(existing)) {
      events = (existing as unknown[]).filter(isValidAuditEvent);
    }
  } catch (err: unknown) {
    if (isNotFoundError(err)) {
      events = [];
    } else {
      throw err;
    }
  }

  events.push(event);

  if (events.length > MAX_EVENTS) {
    events = events.slice(events.length - MAX_EVENTS);
  }

  await writeJson(client, siteId, AUDIT_PATH, events);
}

export async function logError(
  client: MSGraphClientV3,
  siteId: string,
  error: Error,
  context: string,
  userId: string,
  userName: string
): Promise<void> {
  const event: AuditEvent = {
    id: generateId(),
    timestamp: toISOString(),
    userId,
    userName,
    action: 'ERROR',
    target: context,
    status: 'error',
    details: `${error.name}: ${error.message}`,
  };

  return logEvent(client, siteId, event);
}
