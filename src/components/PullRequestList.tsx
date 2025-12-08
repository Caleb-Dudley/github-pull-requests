/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { usePullRequests } from '../hooks/usePullRequests';
import { PullRequestRow } from './PullRequestRow';
import { githubService } from '../services/github';
import { REFRESH_INTERVAL_MS } from '../config/constants';
import '../assets/PullRequestList.css';

const configListStyle = css`
  margin-top: 1rem;
  margin-left: 1.5rem;
`;

const retryButtonStyle = css`
  margin-top: 1rem;
`;

const excludedAuthorsStyle = css`
  margin-top: 1rem;
  font-size: 0.9rem;
  color: #8b949e;
`;

const footerNoteStyle = css`
  font-size: 0.85rem;
  color: #8b949e;
  margin-top: 0.5rem;
`;

export function PullRequestList() {
  const { pullRequests, loading, error, lastUpdated, refetch } = usePullRequests();
  const config = githubService.getConfig();

  if (!config.hasToken) {
    return (
      <div className="container">
        <header className="header">
          <h1>GitHub Pull Requests</h1>
        </header>
        <div className="error">
          <h2>⚠️ Configuration Required</h2>
          <p>
            Please configure your GitHub Personal Access Token in the <code>.env</code> file.
          </p>
          <ol css={configListStyle}>
            <li>Create a GitHub Personal Access Token with <code>repo</code> scope</li>
            <li>Copy <code>.env.example</code> to <code>.env</code></li>
            <li>Set <code>VITE_GITHUB_TOKEN</code> to your token</li>
            <li>Set <code>VITE_GITHUB_USERNAME</code> to your GitHub username</li>
            <li>Restart the development server</li>
          </ol>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <header className="header">
          <h1>GitHub Pull Requests</h1>
        </header>
        <div className="error">
          <h2>❌ Error</h2>
          <p>{error}</p>
          <button onClick={() => refetch()} css={retryButtonStyle}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  const refreshMinutes = REFRESH_INTERVAL_MS / 1000 / 60;

  return (
    <div className="container">
      <header className="header">
        <div>
          <h1>GitHub Pull Requests</h1>
          <p className="subtitle">
            Showing PRs awaiting review from <strong>{config.username}</strong>
          </p>
        </div>
        <div className="header-actions">
          <button onClick={() => refetch()} disabled={loading}>
            {loading ? 'Refreshing...' : '🔄 Refresh'}
          </button>
        </div>
      </header>

      <div className="info-bar">
        <div className="info-item">
          <strong>{pullRequests.length}</strong> pull request{pullRequests.length !== 1 ? 's' : ''}
        </div>
        {lastUpdated && (
          <div className="info-item">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </div>
        )}
        <div className="info-item">
          Auto-refresh: every {refreshMinutes} minutes
        </div>
      </div>

      {loading && pullRequests.length === 0 ? (
        <div className="loading">
          <div className="spinner"></div>
          <div>Loading pull requests...</div>
        </div>
      ) : pullRequests.length === 0 ? (
        <div className="empty-state">
          <h2>🎉 No pull requests found!</h2>
          <p>You have no open pull requests awaiting your review.</p>
          <p css={excludedAuthorsStyle}>
            Excluded authors: {config.excludedAuthors.join(', ')}
          </p>
        </div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Repository</th>
                <th>Pull Request</th>
                <th>Author</th>
                <th>Comments</th>
                <th>Date</th>
                <th>Labels</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {pullRequests.map((pr) => (
                <PullRequestRow key={pr.id} pr={pr} />
              ))}
            </tbody>
          </table>
        </div>
      )}

      <footer className="footer">
        <p>
          Excluded authors: <code>{config.excludedAuthors.join(', ')}</code>
        </p>
        <p css={footerNoteStyle}>
          Click any row to open the PR in a new tab
        </p>
      </footer>
    </div>
  );
}
