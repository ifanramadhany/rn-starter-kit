module.exports = {
  preset: 'react-native',
  setupFiles: ['./jest.setup.ts'],
  watchman: false,
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native|@react-navigation|react-native-screens|react-native-safe-area-context|react-native-gesture-handler)/)',
  ],
};
