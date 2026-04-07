module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  extends: [
    '@react-native',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  plugins: ['@typescript-eslint', 'unused-imports'],
  rules: {
    'react/react-in-jsx-scope': 'off',
    'import/namespace': 'off',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'error',
    'unused-imports/no-unused-imports': 'error',
    'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 0 }],
    'padded-blocks': ['error', 'never'],
    'no-console': ['warn', { allow: ['warn', 'error'] }],
  },
};