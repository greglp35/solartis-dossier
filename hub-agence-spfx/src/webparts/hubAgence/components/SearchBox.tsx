import * as React from 'react';

export interface SearchBoxProps {
  value: string;
  onChange: (v: string) => void;
}

export const SearchBox: React.FC<SearchBoxProps> = ({ value, onChange }) => {
  const [focused, setFocused] = React.useState(false);

  const wrapperStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#2C2C2E',
    border: `1.5px solid ${focused ? '#FFD700' : '#3A3A3C'}`,
    borderRadius: '8px',
    padding: '0 12px',
    gap: '8px',
    transition: 'border-color 0.2s ease',
    maxWidth: '400px',
  };

  const iconStyle: React.CSSProperties = {
    fontSize: '16px',
    opacity: 0.6,
    flexShrink: 0,
    color: '#F5F5F5',
  };

  const inputStyle: React.CSSProperties = {
    background: 'none',
    border: 'none',
    outline: 'none',
    color: '#F5F5F5',
    fontSize: '14px',
    padding: '10px 0',
    flex: 1,
    width: '100%',
  };

  const clearStyle: React.CSSProperties = {
    background: 'none',
    border: 'none',
    color: '#888',
    cursor: 'pointer',
    fontSize: '14px',
    padding: '0',
    flexShrink: 0,
    display: value ? 'block' : 'none',
  };

  return (
    <div style={wrapperStyle}>
      <span style={iconStyle}>🔍</span>
      <input
        type="text"
        placeholder="Rechercher une application…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={inputStyle}
        aria-label="Rechercher"
      />
      {value && (
        <button
          style={clearStyle}
          onClick={() => onChange('')}
          aria-label="Effacer la recherche"
          title="Effacer"
        >
          ✕
        </button>
      )}
    </div>
  );
};

export default SearchBox;
