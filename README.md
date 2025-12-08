# GitHub Pull Requests

A dark-themed React application for viewing GitHub pull requests that are awaiting your review, with the ability to exclude specific authors.

## Features

- 🔍 **Smart Filtering**: Automatically fetches PRs where you've been requested as a reviewer
- 🚫 **Author Exclusion**: Exclude PRs from specific authors (e.g., bots like Dependabot)
- 🌙 **Dark Theme**: GitHub-inspired dark theme for comfortable viewing
- 🔄 **Auto-refresh**: Automatically refreshes PR list every 5 minutes
- 📊 **Comprehensive Information**: View repository, title, author, comments, dates, labels, and status
- 🖱️ **Quick Access**: Click any row to open the PR in a new tab
- 📄 **No Pagination Needed**: Automatically fetches all pages of results

## Setup

### Prerequisites

- Node.js 20.19+ or 22.12+
- A GitHub Personal Access Token with `repo` scope

### Creating a GitHub Personal Access Token

1. Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token (classic)"
3. Give it a descriptive name (e.g., "PR Review Dashboard")
4. Select the `repo` scope (this gives full access to repositories)
5. Click "Generate token"
6. **Copy the token immediately** - you won't be able to see it again!

### Installation

1. Clone or download this repository
2. Install dependencies:
   ```bash
   yarn
   ```

3. Create a `.env` file in the root directory:
   ```bash
   cp .env.example .env
   ```

4. Edit `.env` and add your credentials:
   ```env
   VITE_GITHUB_TOKEN=your_personal_access_token_here
   VITE_GITHUB_USERNAME=your_github_username
   ```

5. Start the development server:
   ```bash
   yarn dev
   ```

6. Open your browser to the URL shown in the terminal (typically `http://localhost:5173`)

## Configuration

### Excluded Authors

You can customize which authors to exclude by editing `src/config/constants.ts`:

```typescript
export const EXCLUDED_AUTHORS = [
  'app/dependabot',
  'app/actionbot-app',
  'SvcGitHubPATGithubPREditorPAT'
];
```

Add or remove usernames as needed. The format `app/username` is used for GitHub bot accounts.

### Auto-refresh Interval

The default refresh interval is 5 minutes. You can change this in `src/config/constants.ts`:

```typescript
export const REFRESH_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes in milliseconds
```

## How It Works

The app uses the GitHub Search API to find pull requests with the following criteria:

- `is:open` - Only open PRs
- `is:pr` - Only pull requests (not issues)
- `review-requested:YOUR_USERNAME` - PRs where you've been requested to review
- `archived:false` - Exclude archived repositories
- `-author:USERNAME` - Exclude specific authors (for each in the exclusion list)

The search query is equivalent to:
```
is:open is:pr review-requested:YOUR_USERNAME archived:false -author:app/dependabot -author:app/actionbot-app -author:SvcGitHubPATGithubPREditorPAT
```

## API Rate Limits

The GitHub Search API has the following rate limits:
- **Authenticated requests**: 30 requests per minute
- **Maximum results**: 1,000 results per search (10 pages of 100)

The app automatically handles pagination to fetch all available results.

## Technology Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **GitHub REST API** - Data source

## Development

### Available Scripts

- `yarn run dev` - Start development server
- `yarn run build` - Build for production
- `yarn run preview` - Preview production build
- `yarn run lint` - Run ESLint
- `yarn run type-check` - Find TypeScript errors

## Troubleshooting

### "Configuration Required" Error

Make sure you've:
1. Created a `.env` file
2. Added your GitHub Personal Access Token
3. Added your GitHub username
4. Restarted the dev server after creating/editing `.env`

### "GitHub API error: 401"

Your GitHub token is invalid or has expired. Generate a new token and update your `.env` file.

### "GitHub API error: 403"

You may have hit the API rate limit. Wait a few minutes and try again. The rate limit resets every minute.

### No Results Showing

Check that:
1. You have PRs awaiting your review on GitHub
2. Your username is spelled correctly in `.env`
3. The PRs aren't from excluded authors
4. The repositories aren't archived

## License

This project is open source and available for personal use.

## Contributing

This is a personal project, but suggestions and improvements are welcome!
