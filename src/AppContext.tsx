import React from 'react';
import type { AuthorFilter } from './types/github';

export type SortType = 'created' | 'updated' | 'comments';
export type SortDirection = 'asc' | 'desc';

export interface AppContextProps {
  refreshIntervalMins: number;
  setRefreshIntervalMins?: (mins: number) => void;
  authorFilters: AuthorFilter[];
  setAuthorFilters?: (filters: AuthorFilter[]) => void;
  sortBy: SortType;
  setSortBy?: (sort: SortType) => void;
  sortDirection: SortDirection;
  setSortDirection?: (direction: SortDirection) => void;
  sinceEnabled: boolean;
  setSinceEnabled?: (enabled: boolean) => void;
  sinceDate: string;
  setSinceDate?: (date: string) => void;
}

export const AppContext = React.createContext<AppContextProps>({ 
  refreshIntervalMins: 5,
  authorFilters: [],
  sortBy: 'created',
  sortDirection: 'desc',
  sinceEnabled: false,
  sinceDate: ''
});
export const useAppContext = () => React.useContext(AppContext);
