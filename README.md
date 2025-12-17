# Jan Web Application

A React + TypeScript + Vite web application for Jan, an AI assistant platform.

## 🚀 Deployment

This application is automatically deployed to GitHub Pages when changes are pushed to the `main` branch.

**Live Site:** https://cloudcompile.github.io/jane/

### Automatic Deployment

The GitHub Actions workflow (`.github/workflows/deploy.yml`) automatically:
1. Builds the web application
2. Deploys to GitHub Pages
3. Makes the site available at the URL above

### Manual Deployment

To build and test locally:

```bash
# Run the deployment script
./deploy.sh

# Or manually:
yarn install
GITHUB_PAGES=true yarn build:web
yarn serve:web
```

## 🛠️ Development

This application is part of the Jan project and has dependencies on workspace packages:
- `@janhq/core` - Core functionality package
- `@jan/extensions-web` - Web extensions package

**Note:** This repository contains the web application extracted from the Jan monorepo. To build successfully, you'll need the full Jan monorepo with all workspace dependencies, or these packages need to be published to npm.

For GitHub Pages deployment, the build process will need to be configured to either:
1. Include the required workspace packages in the repository
2. Use published versions of these packages from npm
3. Mock the dependencies for a standalone build

### Available Scripts

- `yarn dev` - Start development server
- `yarn build` - Build for production
- `yarn preview` - Preview production build
- `yarn lint` - Run ESLint
- `yarn test` - Run tests
- `yarn dev:web` - Start web-specific development server
- `yarn build:web` - Build web application
- `yarn serve:web` - Serve built web application

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

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
