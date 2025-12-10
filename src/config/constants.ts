/**
 * Configuration constants for the GitHub Pull Requests app
 */

/**
 * Array of GitHub usernames to exclude from the PR list.
 * These authors' PRs will not appear in the results.
 */
export const EXCLUDED_AUTHORS = [
  'app/dependabot',
  'app/actionbot-app',
  'SvcGitHubPATGithubPREditorPAT',
  'SvcGitHubPATREPOSAUTOINCREMENTPAT'
];

/**
 * GitHub API configuration
 */
export const GITHUB_API_BASE_URL = 'https://api.github.com';

/**
 * Maximum number of results per page from GitHub API
 */
export const PER_PAGE = 500;
