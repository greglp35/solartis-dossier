import * as React from 'react';
import { formatDate } from '../utils/date';

export interface ISettingsPanelProps {
  user: { id: string; displayName: string; userPrincipalName?: string } | null;
  siteUrl: string;
  library: string;
  lastSaved: string | null;
  graphStatus: 'connected' | 'error';
  recentErrors: string[];
  onClose: () => void;
}

export default class SettingsPanel extends React.Component<ISettingsPanelProps> {
  private handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>): void => {
    if (e.key === 'Escape') {
      this.props.onClose();
    }
  };

  public render(): React.ReactElement {
    const { user, siteUrl, library, lastSaved, graphStatus, recentErrors, onClose } = this.props;

    const overlayStyle: React.CSSProperties = {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.6)',
      zIndex: 1000,
      display: 'flex',
      justifyContent: 'flex-end',
    };

    const panelStyle: React.CSSProperties = {
      backgroundColor: '#1C1C1E',
      width: '360px',
      maxWidth: '100vw',
      height: '100%',
      overflowY: 'auto',
      padding: '24px',
      boxShadow: '-4px 0 24px rgba(0,0,0,0.5)',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
      color: '#F5F5F5',
      fontFamily: 'inherit',
    };

    const headerStyle: React.CSSProperties = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottom: '1px solid #3A3A3C',
      paddingBottom: '16px',
    };

    const titleStyle: React.CSSProperties = {
      fontSize: '18px',
      fontWeight: 600,
      color: '#FFD700',
      margin: 0,
    };

    const closeStyle: React.CSSProperties = {
      background: 'none',
      border: 'none',
      color: '#F5F5F5',
      fontSize: '20px',
      cursor: 'pointer',
      padding: '4px',
      lineHeight: 1,
      opacity: 0.7,
    };

    const sectionStyle: React.CSSProperties = {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
    };

    const sectionTitleStyle: React.CSSProperties = {
      fontSize: '12px',
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '0.08em',
      color: '#8E8E93',
      margin: 0,
    };

    const rowStyle: React.CSSProperties = {
      display: 'flex',
      flexDirection: 'column',
      gap: '2px',
    };

    const labelStyle: React.CSSProperties = {
      fontSize: '11px',
      color: '#8E8E93',
    };

    const valueStyle: React.CSSProperties = {
      fontSize: '13px',
      color: '#F5F5F5',
      wordBreak: 'break-all',
    };

    const statusDotStyle = (ok: boolean): React.CSSProperties => ({
      display: 'inline-block',
      width: '8px',
      height: '8px',
      borderRadius: '50%',
      backgroundColor: ok ? '#30D158' : '#FF453A',
      marginRight: '6px',
    });

    const errorItemStyle: React.CSSProperties = {
      fontSize: '12px',
      color: '#FF453A',
      backgroundColor: '#2C1B1B',
      padding: '6px 10px',
      borderRadius: '4px',
      wordBreak: 'break-word',
    };

    return (
      <div
        style={overlayStyle}
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
        onKeyDown={this.handleKeyDown}
        role="dialog"
        aria-modal="true"
        aria-label="Paramètres Hub Agence"
      >
        <div style={panelStyle}>
          <div style={headerStyle}>
            <h2 style={titleStyle}>⚙ Paramètres</h2>
            <button style={closeStyle} onClick={onClose} aria-label="Fermer les paramètres">
              ✕
            </button>
          </div>

          {/* User section */}
          <div style={sectionStyle}>
            <p style={sectionTitleStyle}>Utilisateur</p>
            <div style={rowStyle}>
              <span style={labelStyle}>Nom</span>
              <span style={valueStyle}>{user ? user.displayName : '—'}</span>
            </div>
            {user && user.userPrincipalName && (
              <div style={rowStyle}>
                <span style={labelStyle}>UPN</span>
                <span style={valueStyle}>{user.userPrincipalName}</span>
              </div>
            )}
            {user && (
              <div style={rowStyle}>
                <span style={labelStyle}>ID</span>
                <span style={valueStyle}>{user.id}</span>
              </div>
            )}
          </div>

          {/* SharePoint section */}
          <div style={sectionStyle}>
            <p style={sectionTitleStyle}>SharePoint</p>
            <div style={rowStyle}>
              <span style={labelStyle}>Site</span>
              <span style={valueStyle}>{siteUrl || '—'}</span>
            </div>
            <div style={rowStyle}>
              <span style={labelStyle}>Bibliothèque</span>
              <span style={valueStyle}>{library}</span>
            </div>
            <div style={rowStyle}>
              <span style={labelStyle}>Dossier de configuration</span>
              <span style={valueStyle}>Cockpit_Agence/00_CONFIG/</span>
            </div>
            <div style={rowStyle}>
              <span style={labelStyle}>Dossier de travail</span>
              <span style={valueStyle}>Cockpit_Agence/02_TRAVAIL/</span>
            </div>
          </div>

          {/* Graph API status */}
          <div style={sectionStyle}>
            <p style={sectionTitleStyle}>API Microsoft Graph</p>
            <div style={rowStyle}>
              <span style={labelStyle}>Statut</span>
              <span style={valueStyle}>
                <span style={statusDotStyle(graphStatus === 'connected')} />
                {graphStatus === 'connected' ? 'Connecté' : 'Erreur de connexion'}
              </span>
            </div>
            {lastSaved && (
              <div style={rowStyle}>
                <span style={labelStyle}>Dernière synchronisation</span>
                <span style={valueStyle}>{formatDate(lastSaved)}</span>
              </div>
            )}
          </div>

          {/* Recent errors */}
          {recentErrors.length > 0 && (
            <div style={sectionStyle}>
              <p style={sectionTitleStyle}>Erreurs récentes ({recentErrors.length})</p>
              {recentErrors.map((err, i) => (
                <div key={i} style={errorItemStyle}>
                  {err}
                </div>
              ))}
            </div>
          )}

          {/* Version */}
          <div style={sectionStyle}>
            <p style={sectionTitleStyle}>Version</p>
            <div style={rowStyle}>
              <span style={labelStyle}>Hub Agence SPFx</span>
              <span style={valueStyle}>1.0.0</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
