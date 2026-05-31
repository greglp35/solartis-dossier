import * as React from 'react';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { MSGraphClientV3 } from '@microsoft/sp-http';

import { ApplicationItem } from '../models/ApplicationItem';
import { UserRole } from '../models/UserRole';
import { SaveStatus } from '../models/SaveStatus';
import { AuditEvent } from '../models/AuditEvent';

import { getGraphClient, getCurrentUser } from '../services/graphService';
import { loadApplications, filterApplications } from '../services/appRegistryService';
import { loadFavorites, saveFavorites } from '../services/favoriteService';
import { logEvent, logError } from '../services/auditLogService';

import { toISOString } from '../utils/date';

import ToolCard from './ToolCard';
import FilterBar from './FilterBar';
import SearchBox from './SearchBox';
import SettingsPanel from './SettingsPanel';
import StatusBar from './StatusBar';
import ErrorBanner from './ErrorBanner';

import styles from '../styles/HubAgence.module.scss';

export interface IHubAgenceProps {
  context: WebPartContext;
  siteUrl: string;
  siteId: string;
}

interface IHubAgenceState {
  applications: ApplicationItem[];
  favorites: string[];
  currentFilter: UserRole;
  searchQuery: string;
  saveStatus: SaveStatus;
  error: string | null;
  settingsOpen: boolean;
  currentUser: { id: string; displayName: string; userPrincipalName: string } | null;
  graphClient: MSGraphClientV3 | null;
  lastSaved: string | null;
  graphStatus: 'connected' | 'error';
  recentErrors: string[];
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export default class HubAgence extends React.Component<IHubAgenceProps, IHubAgenceState> {
  constructor(props: IHubAgenceProps) {
    super(props);
    this.state = {
      applications: [],
      favorites: [],
      currentFilter: 'Tous',
      searchQuery: '',
      saveStatus: 'idle',
      error: null,
      settingsOpen: false,
      currentUser: null,
      graphClient: null,
      lastSaved: null,
      graphStatus: 'connected',
      recentErrors: [],
    };
  }

  public async componentDidMount(): Promise<void> {
    this.setState({ saveStatus: 'loading' });
    try {
      const client = await getGraphClient(this.props.context);
      const user = await getCurrentUser(client);

      this.setState({ graphClient: client, currentUser: user, graphStatus: 'connected' });

      const [apps, favs] = await Promise.all([
        loadApplications(client, this.props.siteId),
        loadFavorites(client, this.props.siteId, user.id),
      ]);

      this.setState({ applications: apps, favorites: favs, saveStatus: 'idle' });

      // Log app open event (fire and forget)
      const openEvent: AuditEvent = {
        id: generateId(),
        timestamp: toISOString(),
        userId: user.id,
        userName: user.displayName,
        action: 'OPEN',
        target: 'HubAgence',
        status: 'success',
        details: `${apps.length} application(s) chargée(s)`,
      };
      logEvent(client, this.props.siteId, openEvent).catch(() => {
        // Non-critical, ignore
      });
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : String(err);
      this.setState({
        saveStatus: 'error',
        error: `Erreur lors de l'initialisation : ${errMsg}`,
        graphStatus: 'error',
        recentErrors: [errMsg],
      });
    }
  }

  private handleFilterChange = (filter: UserRole): void => {
    this.setState({ currentFilter: filter, searchQuery: '' });
  };

  private handleSearchChange = (query: string): void => {
    this.setState({ searchQuery: query });
  };

  private handleToggleFavorite = async (appId: string): Promise<void> => {
    const { favorites, graphClient, currentUser } = this.state;
    if (!graphClient || !currentUser) return;

    const isCurrentlyFavorite = favorites.includes(appId);
    const newFavorites = isCurrentlyFavorite
      ? favorites.filter((id) => id !== appId)
      : [...favorites, appId];

    this.setState({ favorites: newFavorites, saveStatus: 'saving' });

    try {
      await saveFavorites(graphClient, this.props.siteId, currentUser.id, newFavorites);
      const now = toISOString();
      this.setState({ saveStatus: 'saved', lastSaved: now });

      const favEvent: AuditEvent = {
        id: generateId(),
        timestamp: now,
        userId: currentUser.id,
        userName: currentUser.displayName,
        action: isCurrentlyFavorite ? 'REMOVE_FAVORITE' : 'ADD_FAVORITE',
        target: appId,
        status: 'success',
      };
      logEvent(graphClient, this.props.siteId, favEvent).catch(() => undefined);
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : String(err);
      // Rollback optimistic update
      this.setState((prev) => ({
        favorites,
        saveStatus: 'error',
        error: `Erreur lors de la sauvegarde des favoris : ${errMsg}`,
        recentErrors: [errMsg, ...prev.recentErrors].slice(0, 10),
      }));

      if (graphClient && currentUser) {
        logError(graphClient, this.props.siteId, err instanceof Error ? err : new Error(errMsg), 'saveFavorites', currentUser.id, currentUser.displayName).catch(() => undefined);
      }
    }
  };

  private handleOpenApp = (app: ApplicationItem): void => {
    const { graphClient, currentUser } = this.state;

    if (app.path) {
      window.open(app.path, '_blank', 'noopener,noreferrer');
    }

    if (graphClient && currentUser) {
      const openEvent: AuditEvent = {
        id: generateId(),
        timestamp: toISOString(),
        userId: currentUser.id,
        userName: currentUser.displayName,
        action: 'OPEN_APP',
        target: app.id,
        status: 'success',
        details: app.title,
      };
      logEvent(graphClient, this.props.siteId, openEvent).catch(() => undefined);
    }
  };

  private handleDismissError = (): void => {
    this.setState({ error: null, saveStatus: 'idle' });
  };

  private handleToggleSettings = (): void => {
    this.setState((prev) => ({ settingsOpen: !prev.settingsOpen }));
  };

  public render(): React.ReactElement {
    const {
      applications,
      favorites,
      currentFilter,
      searchQuery,
      saveStatus,
      error,
      settingsOpen,
      currentUser,
      lastSaved,
      graphStatus,
      recentErrors,
    } = this.state;

    const filtered = filterApplications(applications, currentFilter, favorites, searchQuery);
    const favoritesCount = favorites.length;

    return (
      <div className={styles.hubContainer}>
        {error && (
          <ErrorBanner message={error} onDismiss={this.handleDismissError} />
        )}

        <div className={styles.headerBar}>
          <div className={styles.titleArea}>
            <span className={styles.hubTitle}>Hub Agence</span>
            {currentUser && (
              <span className={styles.userName}>{currentUser.displayName}</span>
            )}
          </div>
          <div className={styles.headerActions}>
            <StatusBar status={saveStatus} lastSaved={lastSaved} />
            <button
              className={styles.settingsButton}
              onClick={this.handleToggleSettings}
              title="Paramètres"
              aria-label="Ouvrir les paramètres"
            >
              ⚙
            </button>
          </div>
        </div>

        <div className={styles.controlBar}>
          <SearchBox value={searchQuery} onChange={this.handleSearchChange} />
          <FilterBar
            currentFilter={currentFilter}
            onChange={this.handleFilterChange}
            favoritesCount={favoritesCount}
          />
        </div>

        <div className={styles.resultsInfo}>
          <span className={styles.resultsCount}>
            {filtered.length} application{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>

        {saveStatus === 'loading' ? (
          <div className={styles.loadingState}>
            <span className={styles.spinner} role="status" aria-label="Chargement en cours" />
            <span>Chargement des applications…</span>
          </div>
        ) : saveStatus === 'error' && applications.length === 0 ? null : filtered.length === 0 ? (
          <div className={styles.emptyState}>
            <span className={styles.emptyIcon}>🔍</span>
            <p>Aucune application trouvée.</p>
            {searchQuery && (
              <button className={styles.clearSearch} onClick={() => this.handleSearchChange('')}>
                Effacer la recherche
              </button>
            )}
          </div>
        ) : (
          <div className={styles.appGrid}>
            {filtered.map((app) => (
              <ToolCard
                key={app.id}
                app={app}
                isFavorite={favorites.includes(app.id)}
                onToggleFavorite={() => this.handleToggleFavorite(app.id)}
                onOpen={() => this.handleOpenApp(app)}
              />
            ))}
          </div>
        )}

        {settingsOpen && (
          <SettingsPanel
            user={currentUser}
            siteUrl={this.props.siteUrl}
            library="Documents"
            lastSaved={lastSaved}
            graphStatus={graphStatus}
            recentErrors={recentErrors}
            onClose={this.handleToggleSettings}
          />
        )}
      </div>
    );
  }
}
