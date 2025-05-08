import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['.next', 'node_modules', 'dist', '.yarn'],
  },
  {
    files: ['**/*.{js,ts,jsx,tsx}'],
    rules: {
      // Универсальные правила для всех пакетов
      'no-console': 'warn',
      'no-debugger': 'error',
      'eqeqeq': ['error', 'always'],
      'curly': 'error',
      'no-empty': ['error', { allowEmptyCatch: true }],
      // Можно добавить еще общих правил по желанию
    },
    languageOptions: {
      parserOptions: {
        projectService: true,
      },
    },
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },
  }
);
