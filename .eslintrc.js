module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: ['standard-with-typescript', 'plugin:prettier/recommended'],
  overrides: [],
  parserOptions: {
    project: './tsconfig.json',
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  rules: {
    '@typescript-eslint/restrict-template-expressions': 0,
    '@typescript-eslint/strict-boolean-expressions': 0,
    '@typescript-eslint/ban-ts-comment': 0,
    '@typescript-eslint/promise-function-async': 0
  }
}
