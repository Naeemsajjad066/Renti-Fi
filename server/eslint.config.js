import js from '@eslint/js';
import prettierConfig from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';

export default [
  // Ignore generated / vendored files
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      'coverage/**',
      'scripts/**', // one-off utility scripts
    ],
  },

  // Base JS rules
  js.configs.recommended,

  // Prettier — turns off all rules that conflict with Prettier formatting
  prettierConfig,

  // Main config block
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module', // ESM project (type: "module" in package.json)
      globals: {
        // Node.js globals
        process: 'readonly',
        console: 'readonly',
        setTimeout: 'readonly',
        setInterval: 'readonly',
        clearTimeout: 'readonly',
        clearInterval: 'readonly',
        setImmediate: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        Buffer: 'readonly',
        URL: 'readonly',
        URLSearchParams: 'readonly',
      },
    },
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      // Prettier as an ESLint rule
      'prettier/prettier': 'error',

      // Variables
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      'prefer-const': 'error',
      'no-var': 'error',

      // Code quality
      eqeqeq: ['error', 'always', { null: 'ignore' }],
      'no-debugger': 'error',
      'no-duplicate-imports': 'error',
      'no-return-await': 'error',

      // Node / async safety
      'no-process-exit': 'off', // allow in scripts
      'no-throw-literal': 'error',

      // Console — allow in backend (server logs are useful)
      'no-console': 'off',
    },
  },
];
