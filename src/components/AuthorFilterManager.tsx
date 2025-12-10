/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useState, useEffect } from 'react';
import type { AuthorFilter } from '../types/github';
import { EXCLUDED_AUTHORS } from '../config/constants';

const overlayStyle = css`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const modalStyle = css`
  background: #0d1117;
  border: 1px solid #30363d;
  border-radius: 6px;
  padding: 1.5rem;
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
`;

const headerStyle = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  
  h2 {
    margin: 0;
    font-size: 1.25rem;
    color: #c9d1d9;
  }
`;

const authorRowStyle = css`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: #161b22;
  border: 1px solid #30363d;
  border-radius: 4px;
  margin-bottom: 0.5rem;
  
  &:hover {
    background: #1c2128;
  }
`;

const authorInputStyle = css`
  flex: 1;
  background: #0d1117;
  border: 1px solid #30363d;
  border-radius: 4px;
  padding: 0.5rem;
  color: #c9d1d9;
  font-size: 0.9rem;
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
  
  &:focus {
    outline: none;
    border-color: #58a6ff;
  }
`;

const toggleButtonStyle = (mode: 'include' | 'exclude') => css`
  background: #21262d;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 0.75rem;
  color: ${mode === 'include' ? '#38c053' : '#e5413f'};;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 70px;
  transition: filter 0.2s;

  &:hover {
    filter: brightness(1.2);
  }
`;

const deleteButtonStyle = css`
  align-items: center;
  background: #21262d;
  border-radius: 4px;
  border: none;
  color: #ff0400;
  cursor: pointer;
  display: flex;
  font-size: 1rem;
  font-weight: 800;
  justify-content: center;
  line-height: 1.1;
  padding: 0.5rem;
  transition: opacity 0.2s;
  
  &:hover {
    background: #c51815;
    color: white;
  }
`;

const addButtonStyle = css`
  background: #073a11;
  border: 1px solid #164d21;
  border-radius: 4px;
  padding: 0.75rem 1rem;
  color: white;
  font-size: 0.9rem;
  cursor: pointer;
  width: 100%;
  margin-bottom: 1rem;
  
  &:hover {
    background: #258739;
    border-color: #2ea043;
  }
`;

const buttonGroupStyle = css`
  display: flex;
  gap: 0.5rem;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #30363d;
`;

const buttonStyle = css`
  flex: 1;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: opacity 0.2s;
`;

const saveButtonStyle = css`
  ${buttonStyle}
  background: #238636;
  border: 1px solid transparent;
  color: white;

  &:hover {
    background: #329b47;
    border-color: #63d67a;
  }
`;

const cancelButtonStyle = css`
  ${buttonStyle}
  background: #21262d;
  color: #c9d1d9;
  border: 1px solid #30363d;
`;

const resetButtonStyle = css`
  ${buttonStyle}
  background: #3374bf;
  border: 1px solid transparent;
  color: white;

  &:hover {
    background: #4c95e9;
    border-color: #79c0ff;
  }
`;

interface AuthorFilterManagerProps {
  filters: AuthorFilter[];
  onSave: (filters: AuthorFilter[]) => void;
  onClose: () => void;
}

export function AuthorFilterManager({ filters, onSave, onClose }: AuthorFilterManagerProps) {
  const [localFilters, setLocalFilters] = useState<AuthorFilter[]>(filters);

  // Sync with props when they change
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const addAuthor = () => {
    setLocalFilters([...localFilters, { username: '', mode: 'exclude' }]);
  };

  const updateAuthor = (index: number, username: string) => {
    const updated = [...localFilters];
    updated[index] = { ...updated[index], username };
    setLocalFilters(updated);
  };

  const toggleMode = (index: number) => {
    const updated = [...localFilters];
    updated[index] = {
      ...updated[index],
      mode: updated[index].mode === 'exclude' ? 'include' : 'exclude'
    };
    setLocalFilters(updated);
  };

  const deleteAuthor = (index: number) => {
    setLocalFilters(localFilters.filter((_, i) => i !== index));
  };

  const resetToDefaults = () => {
    setLocalFilters(EXCLUDED_AUTHORS.map(username => ({ username, mode: 'exclude' as const })));
  };

  const handleSave = () => {
    // Filter out empty usernames
    const validFilters = localFilters.filter(f => f.username.trim() !== '');
    onSave(validFilters);
  };

  return (
    <div css={overlayStyle} onClick={onClose}>
      <div css={modalStyle} onClick={(e) => e.stopPropagation()}>
        <div css={headerStyle}>
          <h2>Author Filters</h2>
        </div>

        <div>
          {localFilters.map((filter, index) => (
            <div key={index} css={authorRowStyle}>
              <input
                css={authorInputStyle}
                type="text"
                value={filter.username}
                onChange={(e) => updateAuthor(index, e.target.value)}
                placeholder="Enter GitHub username"
              />
              <button
                css={toggleButtonStyle(filter.mode)}
                onClick={() => toggleMode(index)}
                title={filter.mode === 'exclude' ? 'Excluding' : 'Including'}
              >
                {filter.mode === 'exclude' ? ' Exclude' : ' Include'}
              </button>
              <button
                css={deleteButtonStyle}
                onClick={() => deleteAuthor(index)}
                title="Delete"
              >
                {<>&mdash;</>}
              </button>
            </div>
          ))}
        </div>

        <button css={addButtonStyle} onClick={addAuthor}>
          + Add Author
        </button>

        <div css={buttonGroupStyle}>
          <button css={resetButtonStyle} onClick={resetToDefaults}>
            Reset to Defaults
          </button>
          <button css={cancelButtonStyle} onClick={onClose}>
            Cancel
          </button>
          <button css={saveButtonStyle} onClick={handleSave}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
