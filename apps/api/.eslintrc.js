module.exports = {
  extends: ['@freelanceos/eslint-config'],
  parserOptions: {
    project: ['./tsconfig.json'],
    tsconfigRootDir: __dirname,
  },
  ignorePatterns: ['.eslintrc.js', 'jest-e2e.config.js', 'e2e/**/*.ts'],
  rules: {
    // Add any API-specific ESLint rules here
  },
};
