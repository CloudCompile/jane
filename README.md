# Jan Web Application

A React + TypeScript + Vite web application for Jan, an AI assistant platform.

## 🚀 Quick Start

### Automated Deployment (GitHub Pages)

This application is automatically deployed to GitHub Pages when changes are pushed to the `main` branch.

**Live Site:** https://cloudcompile.github.io/jane/

### Manual Build

To build and test locally:

```bash
# Run the deployment script
./deploy.sh

# Or manually:
yarn install
GITHUB_PAGES=true yarn build:web
yarn serve:web
```

The built application will be in the `dist-web/` directory.

## 📋 Setup Instructions

### First Time Setup

1. **Extract the zip file** (if starting fresh):
   - The zip file has already been extracted
   - It's now in `.gitignore` to prevent re-committing

2. **Enable GitHub Pages**:
   - Go to repository Settings → Pages
   - Source: Select "GitHub Actions"
   - Save the settings

3. **Push to main branch**:
   - The GitHub Actions workflow will automatically build and deploy
   - Check the Actions tab for deployment status

### Deployment Configuration

The deployment is configured in `.github/workflows/deploy.yml`:
- Triggers on push to `main` branch
- Can also be manually triggered from the Actions tab
- Builds with `yarn build:web`
- Deploys to GitHub Pages automatically

## 🛠️ Development

### Workspace Dependencies

This application was extracted from the Jan monorepo and originally had workspace dependencies:
- `@janhq/core` - Core functionality package
- `@jan/extensions-web` - Web extensions package

**Solution:** Mock implementations are provided in `src/test/mocks/`:
- `core.ts` - Mock for `@janhq/core`
- `extensions-web.ts` - Mock for `@jan/extensions-web`
- `janhq-core/index.ts` - Index file for core package

These mocks allow the application to build standalone without the full monorepo.

### Available Scripts

- `yarn dev` - Start development server
- `yarn build` - Build for production
- `yarn preview` - Preview production build
- `yarn lint` - Run ESLint
- `yarn test` - Run tests
- `yarn dev:web` - Start web-specific development server
- `yarn build:web` - Build web application
- `yarn serve:web` - Serve built web application

### Build Configuration

The application uses Vite with a custom configuration for GitHub Pages:
- Base path: `/jane/` (set via `GITHUB_PAGES=true` environment variable)
- Output directory: `dist-web/`
- Workspace dependencies are resolved via mocks

### Technology Stack

- **Framework:** React 19 with TypeScript
- **Build Tool:** Vite 6
- **Router:** TanStack Router
- **Styling:** Tailwind CSS 4
- **UI Components:** Radix UI primitives
- **Testing:** Vitest

## 📦 Build Output

A successful build creates:
- `dist-web/index.html` - Entry point with proper base paths
- `dist-web/assets/` - Bundled JavaScript and CSS
- `dist-web/images/` - Static images
- `dist-web/fonts/` - Web fonts

The build is optimized for production with:
- Code splitting
- Minification
- Asset optimization

## 📚 Documentation

For more detailed information:
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Complete deployment guide
- [CONTRIBUTING.md](./CONTRIBUTING.md) - Contribution guidelines

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```

## 🐛 Troubleshooting

### Build Issues

If the build fails:
1. Delete `node_modules` and `yarn.lock`, then run `yarn install`
2. Clear Vite cache: `rm -rf node_modules/.vite`
3. Ensure Node.js version 20 or higher is installed

### GitHub Actions Issues

If deployment fails:
1. Check the Actions tab for error logs
2. Ensure GitHub Pages is enabled in repository settings
3. Verify the workflow has proper permissions (Settings → Actions → General → Workflow permissions)

### Local Preview Issues

If `yarn serve:web` doesn't work:
- Ensure port 3001 is available
- Try the alternative: `yarn serve:web:alt`
- Check that `dist-web/` directory exists with built files

## 🔗 Links

- **Live Site:** https://cloudcompile.github.io/jane/
- **Repository:** https://github.com/CloudCompile/jane
- **Jan Project:** https://jan.ai
