# Code Style Guide

## Stack

- TypeScript
- React Native
- React Navigation
- Zustand
- Jest
- ESLint
- Prettier

## Commands

- `npm run lint` checks code style.
- `npm run lint:fix` fixes supported lint issues.
- `npm run format` formats files with Prettier.
- `npm run typecheck` runs TypeScript without emitting files.
- `npm test` runs Jest.

## Architecture

Use three top-level source layers:

- `src/app/` for app composition, providers, and navigation.
- `src/features/` for product/domain features.
- `src/shared/` for reusable infrastructure and generic utilities.

Import direction should stay one-way:

```txt
app -> features -> shared
app -> shared
```

Do not import from `app` inside `features` or `shared`.

## Feature Modules

Each feature should expose its public API through `index.ts`.

```txt
src/features/auth/
├── screens/
├── services/
├── store/
└── index.ts
```

Prefer this:

```typescript
import { LoginScreen, useAuthStore } from '../../features/auth';
```

Avoid importing another feature's internal files unless the dependency is intentional and reviewed.

## File Naming

- Components and screens: PascalCase, for example `LoginScreen.tsx`.
- Hooks and stores: camelCase with `use` prefix, for example `useAuthStore.ts`.
- Services and utilities: camelCase, for example `authStorage.ts`.
- Public feature exports: `index.ts`.

## State Management

- Keep feature state inside the owning feature.
- Keep app-wide state rare and deliberate.
- Do not put business logic directly in screens when it belongs in a store, hook, or service.

## Storage

- Use the centralized storage adapter from `src/shared/storage/storage.ts`.
- Fallback storage is development-only and only used when MMKV cannot initialize.
- Do not hardcode secrets or encryption keys in source code.
- For production authentication tokens, prefer a platform secure-storage solution.

## Testing

- Add tests near the code when behavior is feature-specific.
- Keep app-level smoke tests in `__tests__/`.
- CI should run lint, typecheck, and tests before merge.

## Git Workflow

Use clear commit messages:

- `feat: add user profile screen`
- `fix: handle missing auth token`
- `docs: update folder structure`
- `refactor: move auth into feature module`
- `test: add auth store tests`
- `chore: update tooling`
