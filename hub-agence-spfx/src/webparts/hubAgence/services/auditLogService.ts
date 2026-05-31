import { MSGraphClientV3 } from '@microsoft/sp-http';
import { AuditEvent } from '../models/AuditEvent';
import { readJson, writeJson } from './sharepointStorageService';
import { toISOString } from '../utils/date';

const AUDIT_PATH = 'Cockpit_Agence/02_TRAVAIL/journal.json';
const MAX_EVENTS = 500;

/**
 * Appends an audit event to journal.json.
 * Trims to the most recent MAX_EVENTS entries.
 */
export async function logEvent(
  client: MSGraphClientV3,
  siteId: string,
  event: AuditEvent
): Promise<void> {
  let events: AuditEvent[] = [];

  try {
    const existing = await readJson<unknown>(client, siteId, AUDIT_PATH);
    if (Array.isArray(existing)) {
      events = existing as AuditEvent[];
    }
  } catch {
    // File may not exist yet — start fresh
    events = [];
  }

  events.push(event);

  // Keep only the most recent MAX_EVENTS entries
  if (events.length > MAX_EVENTS) {
    events = events.slice(events.length - MAX_EVENTS);
  }

  await writeJson(client, siteId, AUDIT_PATH, events);
}

/**
 * Logs an error event derived from a JavaScript Error object.
 */
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

  await logEvent(client, siteId, event);
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
