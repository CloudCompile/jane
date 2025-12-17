# Deployment Guide for GitHub Pages

This guide explains how to deploy the Jan web application to GitHub Pages.

## Overview

The deployment is automated through GitHub Actions and configured to deploy to:
**https://cloudcompile.github.io/jane/**

## Automatic Deployment

### Setup (One-time)

1. **Enable GitHub Pages** in your repository:
   - Go to repository Settings → Pages
   - Source: "GitHub Actions"

2. **Configure GitHub Actions**:
   - The workflow file is at `.github/workflows/deploy.yml`
   - It automatically deploys when changes are pushed to `main` branch

### How it Works

When you push to the `main` branch:
1. GitHub Actions triggers the workflow
2. Dependencies are installed with `yarn install`
3. The web app is built with `yarn build:web`
4. Build output (`dist-web/`) is deployed to GitHub Pages
5. Site becomes available at the configured URL

## Manual Deployment

### Using the Deploy Script

```bash
./deploy.sh
```

This script will:
- Install dependencies
- Build the web application with GitHub Pages configuration
- Show instructions for local preview

### Manual Build Commands

```bash
# Install dependencies
yarn install

# Build for GitHub Pages
GITHUB_PAGES=true yarn build:web

# Preview locally
yarn serve:web
```

The app will be available at `http://localhost:3001`

## Configuration

### Base Path

The application is configured to use `/jane/` as the base path when deployed to GitHub Pages. This is controlled by:

- Environment variable: `GITHUB_PAGES=true`
- Vite config: `vite.config.web.ts`

```typescript
base: process.env.GITHUB_PAGES === 'true' ? '/lyra/' : '/'
```

### Build Output

- Development: `dist/`
- Web build: `dist-web/`
- GitHub Pages deploys: `dist-web/`

## Workspace Dependencies

⚠️ **Important Note**: This application has workspace dependencies:

- `@janhq/core` - Core functionality
- `@jan/extensions-web` - Web extensions

### Current Status

The workspace dependencies are currently resolved using mocks at `src/test/mocks/extensions-web.ts` for the `@jan/extensions-web` package.

For `@janhq/core`, you have these options:

1. **Publish to npm**: Publish the core package to npm and update package.json
2. **Include in repo**: Copy the core package into this repository
3. **Mock/stub**: Create comprehensive mocks for all required functionality
4. **Monorepo**: Deploy from the full Jan monorepo instead

### Recommended Solution

For a production deployment, we recommend either:

1. Publishing `@janhq/core` to npm as a standalone package
2. Building from the full Jan monorepo with all workspace packages

## Troubleshooting

### Build Fails with Missing Packages

If the build fails due to missing `@janhq/core` or `@jan/extensions-web`:

1. Check that the packages are available in the workspace
2. Verify the aliases in `vite.config.web.ts`
3. Consider using the mock approach for testing

### GitHub Actions Fails

Check the Actions tab in your GitHub repository for detailed error logs:
- Dependency installation errors
- Build errors
- Deployment errors

### Local Preview Issues

If `yarn serve:web` doesn't work:
- Ensure the build completed successfully
- Check that `dist-web/` directory exists
- Try the alternative: `yarn serve:web:alt`

## Environment Variables

The following environment variables can be configured:

- `GITHUB_PAGES`: Set to 'true' for GitHub Pages deployment
- `GA_MEASUREMENT_ID`: Google Analytics measurement ID
- `POSTHOG_KEY`: PostHog analytics key
- `POSTHOG_HOST`: PostHog host URL
- `MODEL_CATALOG_URL`: URL for model catalog

## Repository Structure

```
.
├── .github/
│   └── workflows/
│       └── deploy.yml         # GitHub Actions workflow
├── src/                       # Source code
├── public/                    # Static assets
├── dist-web/                  # Build output (gitignored)
├── vite.config.web.ts         # Vite configuration for web
├── deploy.sh                  # Manual deployment script
└── README.md                  # Main documentation
```

## Additional Resources

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Vite Documentation](https://vitejs.dev/)
