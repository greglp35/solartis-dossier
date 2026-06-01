import * as React from 'react';

export interface ErrorBannerProps {
  message: string;
  onDismiss: () => void;
}

export const ErrorBanner: React.FC<ErrorBannerProps> = ({ message, onDismiss }) => {
  const bannerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 16px',
    backgroundColor: '#3D1C1A',
    borderLeft: '4px solid #FF453A',
    color: '#F5F5F5',
    fontSize: '14px',
    gap: '12px',
  };

  const iconStyle: React.CSSProperties = {
    fontSize: '18px',
    flexShrink: 0,
  };

  const messageStyle: React.CSSProperties = {
    flex: 1,
    lineHeight: '1.4',
  };

  const dismissStyle: React.CSSProperties = {
    background: 'none',
    border: 'none',
    color: '#F5F5F5',
    cursor: 'pointer',
    fontSize: '18px',
    padding: '0 4px',
    flexShrink: 0,
    opacity: 0.7,
  };

  return (
    <div style={bannerStyle} role="alert">
      <span style={iconStyle}>⚠️</span>
      <span style={messageStyle}>{message}</span>
      <button
        style={dismissStyle}
        onClick={onDismiss}
        aria-label="Fermer"
        title="Fermer"
      >
        ✕
      </button>
    </div>
  );
};

export default ErrorBanner;
