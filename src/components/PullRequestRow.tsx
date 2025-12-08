/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import type { PullRequestWithRepo } from '../types/github';
import '../assets/PullRequestRow.css';

interface PullRequestRowProps {
  pr: PullRequestWithRepo;
}

const repositoryCellStyle = css`
  min-width: 280px;
`;

const repoNameStyle = css`
  color: #d8e4ee;
`;

const repoLinkStyle = css`
  color: unset;
`;

const ownerLinkStyle = css`
  font-size: 0.75rem;
  color: #bebebe;
  margin-top: 0.25rem;
  display: block;
`;

const prTitleCellStyle = css`
  min-width: 450px;
  color: #fff;
  font-weight: 600;
`;

const authorLinkStyle = css`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
`;

const avatarStyle = css`
  width: 20px;
  height: 20px;
  border-radius: 50%;
`;

const commentsCellStyle = css`
  font-size: 0.9rem;
`;

const dateCellStyle = css`
  min-width: 175px;
`;

const dateTextStyle = css`
  font-size: 0.85rem;
`;

const updatedTextStyle = css`
  font-size: 0.85rem;
  color: #8b949e;
`;

const labelsContainerStyle = css`
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
`;

const noLabelsStyle = css`
  color: #8b949e;
  font-size: 0.85rem;
  font-style: italic;
`;

const statusBadgeStyle = (state: string, isDraft: boolean) => css`
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 500;
  background-color: ${state === 'open' && !isDraft ? '#1a7f37' : '#8b949e'};
  color: #ffffff;
`;

export function PullRequestRow({ pr }: PullRequestRowProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffMs / (1000 * 60));

    if (diffMinutes < 60) {
      return `${diffMinutes}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else if (diffDays < 30) {
      return `${diffDays}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const getContrastColor = (hexColor: string): string => {
    // Remove # if present
    const hex = hexColor.replace('#', '');
    
    // Convert to RGB
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    // Calculate luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    
    // Return black or white depending on luminance
    return luminance > 0.5 ? '#000000' : '#ffffff';
  };

  const handleRowClick = () => {
    window.open(pr.html_url, '_blank', 'noopener,noreferrer');
  };

  return (
    <tr onClick={handleRowClick}>
      <td css={repositoryCellStyle}>
        <strong css={repoNameStyle}>
          <a
            href={pr.repository.html_url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            css={repoLinkStyle}
          >
            {pr.repository.name}
          </a>
        </strong>
        <a
          href={`https://github.com/${pr.repository.owner.login}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          css={ownerLinkStyle}
        >
          {pr.repository.owner.login}
        </a>
      </td>
      <td css={prTitleCellStyle}>
          #{pr.number} {pr.title}
      </td>
      <td>
        <a 
          href={pr.user.html_url} 
          target="_blank" 
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          css={authorLinkStyle}
        >
          <img 
            src={pr.user.avatar_url} 
            alt={pr.user.login}
            css={avatarStyle}
          />
          {pr.user.login}
        </a>
      </td>
      <td css={commentsCellStyle}>{pr.comments}</td>
      <td css={dateCellStyle}>
        <div css={dateTextStyle}>
          Created: {formatDate(pr.created_at)}
        </div>
        <div css={updatedTextStyle}>
          Updated: {formatDate(pr.updated_at)}
        </div>
      </td>
      <td>
        <div css={labelsContainerStyle}>
          {pr.labels.length > 0 ? (
            pr.labels.map((label) => (
              <span
                key={label.id}
                className="label"
                style={{
                  backgroundColor: `#${label.color}`,
                  color: getContrastColor(label.color),
                  borderColor: `#${label.color}`,
                }}
              >
                {label.name}
              </span>
            ))
          ) : (
            <span css={noLabelsStyle}>No labels</span>
          )}
        </div>
      </td>
      <td>
        <span css={statusBadgeStyle(pr.state, pr.draft)}>
          {pr.draft ? 'DRAFT' : pr.state.toUpperCase()}
        </span>
      </td>
    </tr>
  );
}
