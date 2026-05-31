import * as React from 'react';
import { ApplicationItem } from '../models/ApplicationItem';
import styles from '../styles/HubAgence.module.scss';

export interface IToolCardProps {
  app: ApplicationItem;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onOpen: () => void;
}

function getIconDisplay(app: ApplicationItem): string {
  if (app.icon && app.icon.trim() !== '') {
    return app.icon;
  }
  return app.title.charAt(0).toUpperCase();
}

const CATEGORY_COLORS: Record<string, string> = {
  Fournisseurs: '#4A90E2',
  Stock: '#30D158',
  RH: '#FF9F0A',
  Finance: '#BF5AF2',
  Commercial: '#FF6B6B',
  Logistique: '#5AC8FA',
};

function getCategoryColor(category: string): string {
  return CATEGORY_COLORS[category] || '#6E6E73';
}

export default class ToolCard extends React.Component<IToolCardProps> {
  private handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>): void => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this.props.onOpen();
    }
  };

  private handleFavoriteClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.stopPropagation();
    this.props.onToggleFavorite();
  };

  private handleFavoriteKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>): void => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      e.stopPropagation();
      this.props.onToggleFavorite();
    }
  };

  public render(): React.ReactElement {
    const { app, isFavorite } = this.props;
    const iconDisplay = getIconDisplay(app);
    const categoryColor = getCategoryColor(app.category);

    return (
      <div
        className={styles.toolCard}
        onClick={this.props.onOpen}
        onKeyDown={this.handleKeyDown}
        role="button"
        tabIndex={0}
        aria-label={`Ouvrir ${app.title}`}
      >
        <div className={styles.cardHeader}>
          <div className={styles.cardIcon} aria-hidden="true">
            {iconDisplay}
          </div>
          <button
            className={`${styles.favoriteBtn} ${isFavorite ? styles.favoriteBtnActive : ''}`}
            onClick={this.handleFavoriteClick}
            onKeyDown={this.handleFavoriteKeyDown}
            title={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
            aria-label={
              isFavorite
                ? `Retirer ${app.title} des favoris`
                : `Ajouter ${app.title} aux favoris`
            }
            aria-pressed={isFavorite}
          >
            {isFavorite ? '★' : '☆'}
          </button>
        </div>

        <div className={styles.cardBody}>
          <h3 className={styles.cardTitle}>{app.title}</h3>
          {app.description && (
            <p className={styles.cardDescription}>{app.description}</p>
          )}
        </div>

        <div className={styles.cardFooter}>
          <span
            className={styles.categoryBadge}
            style={{ backgroundColor: categoryColor }}
          >
            {app.category}
          </span>
          {app.profile !== 'Tous' && (
            <span className={styles.profileBadge}>{app.profile}</span>
          )}
        </div>

        {app.tags && app.tags.length > 0 && (
          <div className={styles.tagList} aria-label="Tags">
            {app.tags.slice(0, 3).map((tag) => (
              <span key={tag} className={styles.tag}>
                {tag}
              </span>
            ))}
            {app.tags.length > 3 && (
              <span className={styles.tagMore}>+{app.tags.length - 3}</span>
            )}
          </div>
        )}
      </div>
    );
  }
}
