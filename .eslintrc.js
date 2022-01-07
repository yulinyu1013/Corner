module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: [
    'react',
  ],
  rules: {
    'import/no-extraneous-dependencies': 0,
    'no-param-reassign': 0,
    'object-shorthand': 0,
    'spaced-comment': 0,
    'dot-notation': 0,
    'no-lonely-if': 0,
    'prefer-destructuring': 0,
    'no-console': 0,
    'func-names': 0,
  },
  settings: {
    react: {
      version: '999.999.999',
    },
  },
};
