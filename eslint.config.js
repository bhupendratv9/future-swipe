import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'
import pluginRouter from '@tanstack/eslint-plugin-router'

// export default defineConfig([
//   globalIgnores(['dist']),
//   {
//     files: ['**/*.{ts,tsx}'],
//     extends: [
//       js.configs.recommended,
//       tseslint.configs.recommended,
//       reactHooks.configs.flat.recommended,
//       reactRefresh.configs.vite,
//     ],
//     plugins: {
//       '@tanstack/router': pluginRouter,
//     },
//     rules: {
//       '@tanstack/router/create-route-property-order': 'error',
//       'react-refresh/only-export-components': [
//         'warn',
//         { allowConstantExport: true },
//       ],
//     },
//     languageOptions: {
//       ecmaVersion: 2020,
//       globals: globals.browser,
//     },
//   },
// ])

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    plugins: {
      '@tanstack/router': pluginRouter,
    },
    rules: {
      '@tanstack/router/create-route-property-order': 'error',

      // ✅ Disable this rule (best for TanStack Router)
      'react-refresh/only-export-components': 'off',
    },
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
  },
])
