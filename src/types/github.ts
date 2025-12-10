/**
 * TypeScript types for GitHub Pull Request data
 */

export interface GitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
}

export interface GitHubLabel {
  id: number;
  name: string;
  color: string;
}

export interface GitHubRepository {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  owner: GitHubUser;
}

export interface GitHubPullRequest {
  id: number;
  number: number;
  title: string;
  html_url: string;
  state: string;
  draft: boolean;
  created_at: string;
  updated_at: string;
  user: GitHubUser;
  labels: GitHubLabel[];
  comments: number;
  repository_url: string;
  pull_request?: {
    url: string;
    html_url: string;
    diff_url: string;
    patch_url: string;
  };
}

export interface SearchResponse {
  total_count: number;
  incomplete_results: boolean;
  items: GitHubPullRequest[];
}

export interface PullRequestWithRepo extends GitHubPullRequest {
  repository: GitHubRepository;
}

/**
 * Author filter configuration
 */
export interface AuthorFilter {
  username: string;
  mode: 'include' | 'exclude';
}
