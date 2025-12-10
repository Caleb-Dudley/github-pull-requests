import { EXCLUDED_AUTHORS, GITHUB_API_BASE_URL, PER_PAGE } from '../config/constants';
import type { SearchResponse, GitHubRepository, PullRequestWithRepo, AuthorFilter } from '../types/github';

/**
 * Service for interacting with the GitHub API
 */
class GitHubService {
  private readonly token: string;
  private readonly username: string;

  constructor() {
    this.token = import.meta.env.VITE_GITHUB_TOKEN || '';
    this.username = import.meta.env.VITE_GITHUB_USERNAME || '';

    if (!this.token || this.token === 'GITHUB_PAT_WITH_REPO_SCOPE') {
      console.warn('GitHub token not configured. Please set VITE_GITHUB_TOKEN in your .env file.');
    }

    if (!this.username || this.username === 'your_github_username_here') {
      console.warn('GitHub username not configured. Please set VITE_GITHUB_USERNAME in your .env file.');
    }
  }

  /**
   * Build the search query with all filters
   */
  private buildSearchQuery(authorFilters?: AuthorFilter[], sinceDate?: string, sinceEnabled?: boolean): string {
    // Use provided filters or fall back to default excluded authors
    const filters = authorFilters || EXCLUDED_AUTHORS.map(username => ({ username, mode: 'exclude' as const }));
    
    const excludedAuthors = filters
      .filter(f => f.mode === 'exclude')
      .map(f => `-author:${f.username}`)
      .join(' ');
    
    const includedAuthors = filters
      .filter(f => f.mode === 'include')
      .map(f => `author:${f.username}`)
      .join(' ');
    
    const authorQuery = [excludedAuthors, includedAuthors].filter(Boolean).join(' ');
    
    // Add since date if enabled and valid
    const sinceQuery = (sinceEnabled && sinceDate) ? `created:>=${sinceDate}` : '';
    
    return `is:open is:pr review-requested:${this.username} archived:false ${authorQuery} ${sinceQuery}`.trim();
  }

  /**
   * Make a GET request to the GitHub API
   */
  private async fetchFromGitHub<T>(url: string): Promise<T> {
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/vnd.github+json',
        'Authorization': `Bearer ${this.token}`,
        'X-GitHub-Api-Version': '2022-11-28'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`GitHub API error: ${response.status} - ${errorText}`);
    }

    return response.json();
  }

  /**
   * Fetch a single page of pull requests
   */
  private async fetchPage(
    page: number, 
    authorFilters?: AuthorFilter[], 
    sort: 'created' | 'updated' | 'comments' = 'created',
    direction: 'asc' | 'desc' = 'desc',
    sinceDate?: string,
    sinceEnabled?: boolean
  ): Promise<SearchResponse> {
    const query = encodeURIComponent(this.buildSearchQuery(authorFilters, sinceDate, sinceEnabled));
    const url = `${GITHUB_API_BASE_URL}/search/issues?q=${query}&sort=${sort}&order=${direction}&per_page=${PER_PAGE}&page=${page}`;
    return this.fetchFromGitHub<SearchResponse>(url);
  }

  /**
   * Parse repository details from repository URL
   */
  private parseRepositoryFromUrl(repoUrl: string, prUser: GitHubRepository['owner']): GitHubRepository {
    // Repository URL format: https://api.github.com/repos/{owner}/{repo}
    const urlParts = repoUrl.split('/');
    const repoName = urlParts[urlParts.length - 1];
    const ownerLogin = urlParts[urlParts.length - 2];
    
    return {
      id: 0, // Not available from URL, but not used in UI
      name: repoName,
      full_name: `${ownerLogin}/${repoName}`,
      html_url: `https://github.com/${ownerLogin}/${repoName}`,
      owner: {
        ...prUser,
        login: ownerLogin
      }
    };
  }

  /**
   * Fetch all pull requests with pagination
   */
  async fetchAllPullRequests(
    authorFilters?: AuthorFilter[],
    sort: 'created' | 'updated' | 'comments' = 'created',
    direction: 'asc' | 'desc' = 'desc',
    sinceDate?: string,
    sinceEnabled?: boolean
  ): Promise<PullRequestWithRepo[]> {
    const allPRs: PullRequestWithRepo[] = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const data = await this.fetchPage(page, authorFilters, sort, direction, sinceDate, sinceEnabled);
      
      if (data.items.length === 0) {
        hasMore = false;
        break;
      }

      // Parse repository details from repository_url
      const prsWithRepos = data.items.map((pr) => ({
        ...pr,
        repository: this.parseRepositoryFromUrl(pr.repository_url, pr.user)
      }));

      allPRs.push(...prsWithRepos);

      // Check if we should continue paginating
      // GitHub Search API returns max 1000 results (10 pages of 100)
      if (data.items.length < PER_PAGE || allPRs.length >= data.total_count) {
        hasMore = false;
      } else {
        page++;
      }
    }

    return allPRs;
  }

  /**
   * Get the current configuration
   */
  getConfig(authorFilters?: AuthorFilter[]) {
    const filters = authorFilters || EXCLUDED_AUTHORS.map(username => ({ username, mode: 'exclude' as const }));
    return {
      username: this.username,
      excludedAuthors: filters.filter(f => f.mode === 'exclude').map(f => f.username),
      includedAuthors: filters.filter(f => f.mode === 'include').map(f => f.username),
      authorFilters: filters,
      hasToken: !!this.token && this.token !== 'GITHUB_PAT_WITH_REPO_SCOPE'
    };
  }
}

export const githubService = new GitHubService();
