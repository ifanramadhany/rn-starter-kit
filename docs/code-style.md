# Code Style Guide

## Language & Framework
- **Language**: TypeScript
- **Runtime**: React Native
- **State Management**: Zustand
- **Navigation**: React Navigation

## Formatting & Linting
- **Formatter**: Prettier
- **Linter**: ESLint with TypeScript support
- Run `npm run lint` to check code
- Run `npm run lint:fix` to auto-fix issues
- Run `npm run format` to format with Prettier

## Code Organization

### Module Structure
Code is organized into feature-based modules under `src/modules/`:
- Each module should have its own `services/`, `store/`, and related files
- Example: `src/modules/auth/` contains authentication-related code

### File Naming
- **Components**: PascalCase (e.g., `HomeScreen.tsx`)
- **Services**: camelCase (e.g., `authStorage.ts`)
- **Hooks/State**: camelCase with `use` prefix (e.g., `useAuthStore.ts`)
- **Utilities**: camelCase (e.g., `storage.ts`)

### TypeScript
- All code must be typed
- Use interfaces for contracts (e.g., `StorageInterface`)
- Avoid using `any`
- Use strict mode enabled

## State Management (Zustand)
- Store definitions use `create<StateType>()`
- Separate store from business logic (services)
- Example pattern:
  ```typescript
  export const useAuthStore = create<AuthState>((set) => ({
    token: null,
    login: (token) => { /* ... */ },
  }));
  ```

## Storage & Persistence
- Use the centralized `storage` interface from `src/utils/storage.ts`
- The storage automatically falls back to in-memory when MMKV is unavailable
- Always handle storage operations that may fail gracefully

## Error Handling
- Wrap native module initialization in try-catch blocks
- Log warnings for fallback behavior
- Ensure fallback implementations maintain API contract

## Testing
- Tests location: `__tests__/`
- Run `npm run test` to execute tests
- Use Jest configuration from `jest.config.js`

# Git Workflow & Commit Guidelines

## Commit Message Format
- Use clear, descriptive messages in English
- Format: `<type>: <description>`
- Examples:
  - `feat: add user authentication`
  - `fix: handle null storage fallback`
  - `docs: update readme`
  - `refactor: simplify auth store`

## Types
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Formatting, missing semicolons, etc.
- `refactor:` - Code refactoring without feature changes
- `test:` - Adding or updating tests
- `chore:` - Dependency updates, build changes

## Best Practices
- Keep commits atomic (one logical change per commit)
- Use present tense ("add" not "added")
- First line max 50 characters
- Reference issues when applicable: `fix: auth bug (#123)`