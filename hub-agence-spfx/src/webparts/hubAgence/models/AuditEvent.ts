export interface AuditEvent {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: string;
  target: string;
  status: 'success' | 'warning' | 'error';
  details?: string;
}
