export interface ApplicationItem {
  id: string;
  title: string;
  description: string;
  category: string;
  profile: 'Tous' | 'Chef agence' | 'Comptoir' | 'Dépôt' | 'Admin';
  path: string;
  icon?: string;
  priority: number;
  status: 'actif' | 'brouillon' | 'archive';
  tags: string[];
  owner?: string;
  lastReview?: string;
}
