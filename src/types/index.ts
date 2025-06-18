export interface ContactList {
  id: string;
  name: string;
  description?: string;
  color: ListColor;
  icon?: string;
  isFavorite: boolean;
  contactCount: number;
  createdAt: string; // ISO date string from API
  updatedAt: string; // ISO date string from API
  tags?: string[];
}

export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  company?: string;
  jobTitle?: string;
  email?: string;
  phone?: string;
  linkedin?: string;
  notes?: string;
  tags?: string[];
  createdAt: string; // ISO date string from API
  updatedAt: string; // ISO date string from API
  listIds: string[];
}

export type ListColor = 
  | 'blue' 
  | 'green' 
  | 'purple' 
  | 'orange' 
  | 'pink' 
  | 'indigo' 
  | 'red' 
  | 'teal';

export interface DashboardStats {
  totalLists: number;
  totalContacts: number;
  favoriteLists: number;
  recentlyAdded: number;
}

export interface QuickAction {
  id: string;
  label: string;
  icon: string;
  action: () => void;
  color: string;
} 