import { useQuery } from '@tanstack/react-query';
import { githubService } from '../services/github';
import { REFRESH_INTERVAL_MS } from '../config/constants';
import type { PullRequestWithRepo } from '../types/github';

export function usePullRequests() {
  const { data, isLoading, error, dataUpdatedAt, refetch } = useQuery<PullRequestWithRepo[], Error>({
    queryKey: ['pullRequests'],
    queryFn: () => githubService.fetchAllPullRequests(),
    refetchInterval: REFRESH_INTERVAL_MS,
  });

  return {
    pullRequests: data ?? [],
    loading: isLoading,
    error: error?.message ?? null,
    lastUpdated: dataUpdatedAt ? new Date(dataUpdatedAt) : null,
    refetch
  };
}
