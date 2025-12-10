import { useQuery } from '@tanstack/react-query';
import { githubService } from '../services/github';
import { useAppContext } from '../AppContext';
import type { PullRequestWithRepo } from '../types/github';

export function usePullRequests() {
  const { refreshIntervalMins, authorFilters, sortBy, sortDirection, sinceDate, sinceEnabled } = useAppContext();
  const { data, isLoading, error, dataUpdatedAt, refetch } = useQuery<PullRequestWithRepo[], Error>({
    queryKey: ['pullRequests', authorFilters, sortBy, sortDirection, sinceDate, sinceEnabled],
    queryFn: () => githubService.fetchAllPullRequests(authorFilters, sortBy, sortDirection, sinceDate, sinceEnabled),
    refetchInterval: (refreshIntervalMins ?? 5) * 60 * 1000,
  });

  return {
    pullRequests: data ?? [],
    loading: isLoading,
    error: error?.message ?? null,
    lastUpdated: dataUpdatedAt ? new Date(dataUpdatedAt) : null,
    refetch
  };
}
