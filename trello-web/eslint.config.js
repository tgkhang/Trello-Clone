import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      // Code quality
      'no-console': 'warn',
      'no-lonely-if': 'warn',
      'no-unused-vars': 'warn',
      'no-trailing-spaces': 'warn',
      'no-multi-spaces': 'warn',
      'no-multiple-empty-lines': 'warn',
      'no-unexpected-multiline': 'warn',

      // Formatting
      'space-before-blocks': ['error', 'always'],
      'object-curly-spacing': ['warn', 'always'],
      'indent': ['warn', 2],
      'semi': ['warn', 'never'],
      'quotes': ['error', 'single'],
      'array-bracket-spacing': 'warn',
      'linebreak-style': 'off',
      'keyword-spacing': 'warn',
      //'comma-dangle': 'warn',
      'comma-spacing': 'warn',
      'arrow-spacing': 'warn',
    },
  },
])
