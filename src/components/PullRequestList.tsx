/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useState } from 'react';
import { usePullRequests } from '../hooks/usePullRequests';
import { PullRequestRow } from './PullRequestRow';
import { AuthorFilterManager } from './AuthorFilterManager';
import { githubService } from '../services/github';
import { useAppContext } from '../AppContext';
import type { AuthorFilter } from '../types/github';
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

const infoBarInnerStyle = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const infoBarLeftStyle = css`
  display: flex;
  gap: 24px;
  align-items: center;
`;

const authorFilterButtonStyle = css`
  background: #21262d;
  border: 1px solid #30363d;
  border-radius: 4px;
  padding: 0.5rem 0.75rem;
  color: #c9d1d9;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background 0.2s;
  
  &:hover {
    background: #30363d;
  }
`;

const refreshDropdownStyle = {
  backgroundColor: '#0d1117',
  border: '1px solid #30363d',
  borderRadius: '4px',
  padding: '0.25rem 0.5rem',
  color: '#c9d1d9',
  fontSize: '0.9rem',
  cursor: 'pointer'
};

const sortButtonStyle = css`
  background: #21262d;
  border: 1px solid #30363d;
  border-radius: 4px;
  padding: 0.25rem 0.5rem;
  color: #c9d1d9;
  font-size: 1rem;
  cursor: pointer;
  margin-left: 0.25rem;
  transition: background 0.2s;
  
  &:hover {
    background: #30363d;
  }
`;

const sinceContainerStyle = css`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const dateInputStyle = {
  backgroundColor: '#0d1117',
  border: '1px solid #30363d',
  borderRadius: '4px',
  padding: '0.25rem 0.5rem',
  color: '#c9d1d9',
  fontSize: '0.9rem',
  cursor: 'pointer'
};

export function PullRequestList() {
  const { 
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
    includeReviewedByMe,
    setIncludeReviewedByMe
  } = useAppContext();
  const { pullRequests, loading, error, lastUpdated, refetch } = usePullRequests();
  const [showFilterManager, setShowFilterManager] = useState(false);
  const config = githubService.getConfig(authorFilters);

  const handleSaveFilters = (filters: AuthorFilter[]) => {
    setAuthorFilters?.(filters);
    setShowFilterManager(false);
    // Trigger refetch with new filters
    refetch();
  };

  const excludedCount = authorFilters.filter(f => f.mode === 'exclude').length;
  const includedCount = authorFilters.filter(f => f.mode === 'include').length;

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

  const RefreshTimeDropdown = (
    <select
      value={refreshIntervalMins}
      onChange={(e) => {
        const minutes = Number(e.target.value);
        setRefreshIntervalMins?.(minutes);
        refetch();
      }}
      style={refreshDropdownStyle}
    >
      {[1, 2, 5, 10, 15, 30, 60, 90, 120].map((min) => (
        <option key={min} value={min}>
          {min} minute{min !== 1 ? 's' : ''}
        </option>
      ))}
    </select>
  );

  const SortDropdown = (
    <select
      value={sortBy}
      onChange={(e) => {
        setSortBy?.(e.target.value as 'created' | 'updated' | 'comments');
        refetch();
      }}
      style={refreshDropdownStyle}
    >
      <option value="created">Created</option>
      <option value="updated">Updated</option>
      <option value="comments">Comments</option>
    </select>
  );

  const SortDirectionButton = (
    <button
      css={sortButtonStyle}
      onClick={() => {
        setSortDirection?.(sortDirection === 'desc' ? 'asc' : 'desc');
        refetch();
      }}
      title={sortDirection === 'desc' ? 'Descending' : 'Ascending'}
    >
      {sortDirection === 'desc' ? '↓' : '↑'}
    </button>
  );

  const SinceFilter = (
    <div css={sinceContainerStyle}>
      <label style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', cursor: 'pointer' }}>
        <input
          type="checkbox"
          checked={sinceEnabled}
          onChange={(e) => {
            setSinceEnabled?.(e.target.checked);
            refetch();
          }}
          style={{ cursor: 'pointer' }}
        />
        Since:
      </label>
      {sinceEnabled ? (
        <input
          type="date"
          value={sinceDate}
          onChange={(e) => {
            setSinceDate?.(e.target.value);
            refetch();
          }}
          style={dateInputStyle}
        />
      ) : (
        <span style={{ fontStyle: 'italic' }}>All time</span>
      )}
    </div>
  );

  const IncludeReviewedByMeFilter = (
    <div>
      <label style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', cursor: 'pointer' }}>
        <input
          type="checkbox"
          checked={includeReviewedByMe}
          onChange={(e) => {
            setIncludeReviewedByMe?.(e.target.checked);
            refetch();
          }}
          style={{ cursor: 'pointer' }}
        />
        Include PRs I've reviewed
      </label>
    </div>
  );

  return (
    <div className="container">
      <header className="header">
        <div>
          <h1>GitHub Pull Requests</h1>
          <p className="subtitle">
            Showing open PRs awaiting review or reviewed by <strong>{config.username}</strong>
          </p>
        </div>
        <div className="header-actions">
          <button onClick={() => refetch()} disabled={loading}>
            {loading ? 'Refreshing...' : '🔄 Refresh'}
          </button>
        </div>
      </header>

      <div className="info-bar">
        <div css={infoBarInnerStyle}>
          <div css={infoBarLeftStyle}>
            <div className="info-item">
              <strong>{pullRequests.length}</strong> pull request{pullRequests.length !== 1 ? 's' : ''}
            </div>
            <div className="info-item">
              Last updated: {lastUpdated ? lastUpdated.toLocaleTimeString() : '--:--:-- --'}
            </div>
            <div className="info-item">
              {`Auto-refresh:`} {RefreshTimeDropdown}
            </div>
            <div className="info-item">
              {`Sort:`} {SortDropdown}
              {SortDirectionButton}
            </div>
            <div className="info-item">
              {SinceFilter}
            </div>
            <div className="info-item">
              {IncludeReviewedByMeFilter}
            </div>
          </div>
          <div>
            <button 
              css={authorFilterButtonStyle}
              onClick={() => setShowFilterManager(true)}
            >
              {excludedCount > 0 && (
                <>
                Excluding {excludedCount} author{excludedCount !== 1 ? 's' : ''}
                {includedCount > 0 && ', '}
                </>
              )}
              {includedCount > 0 && (
                <>
                Including {includedCount} author{includedCount !== 1 ? 's' : ''}
                </>
              )}
              {excludedCount === 0 && includedCount === 0 && 
                'No author filters'
              }
            </button>
          </div>
        </div>
      </div>

      {showFilterManager && (
        <AuthorFilterManager
          filters={authorFilters}
          onSave={handleSaveFilters}
          onClose={() => setShowFilterManager(false)}
        />
      )}

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
        <p css={footerNoteStyle}>
          Click any row to open the PR in a new tab
        </p>
      </footer>
    </div>
  );
}
