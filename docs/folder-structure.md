# Folder Structure

## Overview
```
RNStarterKit/
├── src/                    # Source code
├── android/                # Android native code
├── ios/                    # iOS native code
├── __tests__/              # Test files
├── docs/                   # Documentation
└── [config files]          # Configuration files
```

## `src/` Directory

### `src/modules/`
Feature-based modules, each containing domain-specific logic:
- `auth/` - Authentication module
  - `services/authStorage.ts` - Storage operations
  - `store/useAuthStore.ts` - Zustand store
- `product/` - Product-related functionality
- `user/` - User-related functionality

**Pattern**: Each module should be self-contained and follow a consistent structure.

### `src/navigation/`
Navigation configuration:
- `root/` - Root navigation stack
- `stacks/` - Individual navigation stacks

**Pattern**: Use React Navigation for stack, tab, and drawer navigation.

### `src/screens/`
Screen components organized by feature:
- `app/` - Main app screens
  - `HomeScreen.tsx`
- `auth/` - Authentication screens (login, signup, etc.)

### `src/services/`
Shared services used across modules (API clients, utility services).

### `src/store/`
Global state management and store setup (if needed beyond module-level stores).

### `src/utils/`
Utility functions and helpers:
- `storage.ts` - Centralized storage interface (MMKV with fallback)

## Root-Level Files

### Configuration Files
- `package.json` - Project dependencies and scripts
- `tsconfig.json` - TypeScript configuration
- `jest.config.js` - Jest testing framework setup
- `babel.config.js` - Babel transpiler configuration
- `metro.config.js` - React Native Metro bundler configuration
- `app.json` - React Native app configuration

### Other Files
- `App.tsx` - Main app component
- `index.js` - Entry point
- `README.md` - Project documentation
- `Gemfile` - Ruby dependencies (for iOS builds)

## `android/` Directory
Android-specific native code:
- `app/src/main/` - Main Android application code
- `build.gradle` - Android build configuration

## `ios/` Directory
iOS-specific native code:
- `RNStarterKit/` - iOS app files
  - `AppDelegate.swift` - App entry point
  - `Info.plist` - iOS app configuration
  - `LaunchScreen.storyboard` - Launch screen UI
- `RNStarterKit.xcworkspace/` - Xcode workspace (use this, not .xcodeproj)
- `Pods/` - CocoaPods dependencies

## `__tests__/` Directory
Unit and integration tests:
- `App.test.tsx` - App component tests

**Pattern**: Tests should mirror the source structure where possible.

## Best Practices

### Module Organization
- Keep modules focused on a single domain
- Use consistent naming conventions within modules
- Export public APIs clearly

### Import Paths
- Use relative paths for local imports within the same module
- Use absolute/relative paths based on project preferences
- Consider path aliases if the project grows

### Code Separation
- UI components in `screens/`
- Business logic in `services/` and `store/`
- Utilities in `utils/`
- Keep concerns separated by feature module
