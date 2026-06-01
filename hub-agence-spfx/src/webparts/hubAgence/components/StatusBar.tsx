import * as React from 'react';
import { SaveStatus } from '../models/SaveStatus';
import { formatDate } from '../utils/date';

export interface StatusBarProps {
  status: SaveStatus;
  lastSaved: string | null;
}

export const StatusBar: React.FC<StatusBarProps> = ({ status, lastSaved }) => {
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '4px 16px',
    backgroundColor: '#2C2C2E',
    borderBottom: '1px solid #3A3A3C',
    fontSize: '12px',
    color: '#F5F5F5',
    minHeight: '28px',
  };

  const dotStyle = (color: string): React.CSSProperties => ({
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: color,
    flexShrink: 0,
  });

  if (status === 'loading') {
    return (
      <div style={containerStyle}>
        <span style={dotStyle('#FFD700')} />
        <span>Chargement en cours…</span>
      </div>
    );
  }

  if (status === 'saving') {
    return (
      <div style={containerStyle}>
        <span style={dotStyle('#FFD700')} />
        <span>Enregistrement…</span>
      </div>
    );
  }

  if (status === 'saved') {
    return (
      <div style={containerStyle}>
        <span style={dotStyle('#30D158')} />
        <span>
          Enregistré
          {lastSaved ? ` — ${formatDate(lastSaved)}` : ''}
        </span>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div style={containerStyle}>
        <span style={dotStyle('#FF453A')} />
        <span>Erreur lors de l'enregistrement</span>
      </div>
    );
  }

  // idle
  return (
    <div style={containerStyle}>
      <span style={dotStyle('#3A3A3C')} />
      <span>
        Hub Agence
        {lastSaved ? ` — Dernière sync : ${formatDate(lastSaved)}` : ''}
      </span>
    </div>
  );
};

export default StatusBar;
