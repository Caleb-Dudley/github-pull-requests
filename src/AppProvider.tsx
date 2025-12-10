import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppContext, type AppContextProps } from './AppContext';
import { useLocalStorage } from './hooks/useLocalStorage';
import { EXCLUDED_AUTHORS } from './config/constants';
import type { AuthorFilter } from './types/github';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Initialize default filters from constants
const getDefaultAuthorFilters = (): AuthorFilter[] => {
  return EXCLUDED_AUTHORS.map(username => ({ username, mode: 'exclude' }));
};

// Get default date (30 days ago)
const getDefaultSinceDate = (): string => {
  const date = new Date();
  date.setDate(date.getDate() - 30);
  return date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [refreshIntervalMins, setRefreshIntervalMins] = useLocalStorage<number>('refreshIntervalMins', 5);

  // Check localStorage first, then fall back to constants
  const [authorFilters, setAuthorFilters] = useLocalStorage<AuthorFilter[]>(
    'authorFilters',
    getDefaultAuthorFilters()
  );

  const [sortBy, setSortBy] = useLocalStorage<'created' | 'updated' | 'comments'>('sortBy', 'created');
  const [sortDirection, setSortDirection] = useLocalStorage<'asc' | 'desc'>('sortDirection', 'desc');
  const [sinceEnabled, setSinceEnabled] = useLocalStorage<boolean>('sinceEnabled', false);
  const [sinceDate, setSinceDate] = useLocalStorage<string>('sinceDate', getDefaultSinceDate());

  const contextValue: AppContextProps = {
    refreshIntervalMins,
    setRefreshIntervalMins,
    authorFilters,
    setAuthorFilters,
    sortBy,
    setSortBy,
    sortDirection,
    setSortDirection,
    sinceEnabled,
    setSinceEnabled,
    sinceDate,
    setSinceDate,
  };

  return (
    <QueryClientProvider client={queryClient}>
      <AppContext.Provider value={contextValue}>
        {children}
      </AppContext.Provider>
    </QueryClientProvider>
  );
};
