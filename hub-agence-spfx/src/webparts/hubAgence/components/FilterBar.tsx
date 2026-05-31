import * as React from 'react';
import { UserRole } from '../models/UserRole';

export interface IFilterBarProps {
  currentFilter: UserRole;
  onChange: (filter: UserRole) => void;
  favoritesCount: number;
}

const ALL_FILTERS: UserRole[] = [
  'Tous',
  'Chef agence',
  'Comptoir',
  'Dépôt',
  'Admin',
  'Fournisseurs',
  'Favoris',
];

export default class FilterBar extends React.Component<IFilterBarProps> {
  public render(): React.ReactElement {
    const { currentFilter, onChange, favoritesCount } = this.props;

    const containerStyle: React.CSSProperties = {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '8px',
      padding: '8px 0',
    };

    return (
      <nav style={containerStyle} aria-label="Filtres par profil" role="tablist">
        {ALL_FILTERS.map((filter) => {
          const isActive = currentFilter === filter;
          const label =
            filter === 'Favoris' && favoritesCount > 0
              ? `Favoris (${favoritesCount})`
              : filter;

          const tabStyle: React.CSSProperties = {
            padding: '8px 16px',
            borderRadius: '20px',
            border: '1.5px solid',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: isActive ? 600 : 400,
            transition: 'background-color 0.15s ease, color 0.15s ease, border-color 0.15s ease',
            backgroundColor: isActive ? '#FFD700' : '#2C2C2E',
            color: isActive ? '#1C1C1E' : '#C7C7CC',
            borderColor: isActive ? '#FFD700' : '#3A3A3C',
            outline: 'none',
            userSelect: 'none',
          };

          return (
            <button
              key={filter}
              style={tabStyle}
              onClick={() => onChange(filter)}
              role="tab"
              aria-selected={isActive}
              aria-label={`Filtrer : ${label}`}
            >
              {label}
            </button>
          );
        })}
      </nav>
    );
  }
}
