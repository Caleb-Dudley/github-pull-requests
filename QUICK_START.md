# Quick Start Guide

## 1. Configure Your Credentials

Edit the `.env` file:
```env
VITE_GITHUB_TOKEN=your_github_personal_access_token_here
VITE_GITHUB_USERNAME=Caleb-Dudley
```

## 2. Start the App

```bash
yarn dev
```

Then open: http://localhost:5173

## 3. Customize Excluded Authors (Optional)

Edit `src/config/constants.ts`:
```typescript
export const EXCLUDED_AUTHORS = [
  'app/dependabot',
  'app/actionbot-app',
  'SvcGitHubPATGithubPREditorPAT'
  // Add more usernames here
];
```

---

## 🔑 Creating a GitHub Personal Access Token

1. Go to: **GitHub.com** → **Settings** → **Developer settings** → **Personal access tokens** → **Tokens (classic)**
2. Click **"Generate new token (classic)"**
3. Name: `PR Review Dashboard`
4. Select scope: ✅ **repo** (full control of private repositories)
5. Click **"Generate token"**
6. **Copy the token immediately** (you can't see it again!)
7. Paste into your `.env` file

---

## 📋 What You Get

✅ All PRs where you're requested as reviewer  
✅ Auto-refreshes every 5 minutes  
✅ Click any row to open in new tab  
✅ Excludes bot PRs automatically  
✅ Shows: repo, title, author, comments, dates, labels, status  
✅ Dark theme 🌙  

---

## 🎛️ Configuration Files

| File | Purpose |
|------|---------|
| `.env` | Your GitHub token & username |
| `src/config/constants.ts` | Excluded authors & refresh interval |

---

## 🆘 Help!

**Not seeing any PRs?**
- Check you have PRs awaiting review on github.com
- Verify username is correct in `.env`
- Restart dev server after editing `.env`

**API Error?**
- **401**: Token invalid → generate new one
- **403**: Rate limited → wait 1 minute

**Need to change something?**
- Edit `.env` or `src/config/constants.ts`
- Restart dev server: `Ctrl+C` then `yarn dev`
