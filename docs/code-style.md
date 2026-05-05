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
- `npm test` runs Jest with Watchman disabled in `jest.config.js` for CI and restricted environments.

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
- Screen styles: sibling PascalCase style files, for example `LoginScreen.styles.ts`.
- Hooks and stores: camelCase with `use` prefix, for example `useAuthStore.ts`.
- Services and utilities: camelCase, for example `authStorage.ts`.
- Public feature exports: `index.ts`.

## Styling

- Keep route-level screen styles in a sibling `.styles.ts` file.
- Use the same base name as the screen, for example `PostsScreen.tsx` and `PostsScreen.styles.ts`.
- Keep small feature-only component styles inline until they grow or become shared.
- Keep shared color tokens in `src/shared/theme/colors.ts`.
- Use color tokens from `colors` instead of hardcoded hex or `rgba()` values in feature styles.
- Add dark-mode values to `colorPalettes.dark` so components can keep referring to the same token names.
- Use `useTheme()` for theme-aware UI. The app defaults to the OS color scheme through `system` mode.
- Persist user theme choice as `system`, `light`, or `dark`; do not store raw color values in app storage.
- Export screen styles as `createStyles(colors)` when they depend on the active theme.
- Use `useResponsiveLayout()` and shared breakpoints for tablet/large-screen layout changes.
- Prefer width classes, max widths, flexible columns, and spacing changes over device-specific checks.
- Move other reusable design primitives, spacing, and typography into `src/shared/` when multiple features need them.

## State Management

- Keep feature state inside the owning feature.
- Keep app-wide state rare and deliberate.
- Do not put business logic directly in screens when it belongs in a store, hook, or service.

## Storage

- Use the centralized storage adapter from `src/shared/storage/storage.ts`.
- Fallback storage is development-only and only used when MMKV cannot initialize.
- Do not hardcode secrets or encryption keys in source code.
- For production authentication tokens, prefer a platform secure-storage solution.

## Environment

- Keep required environment variables in `.env.example` with safe example values.
- Read env values through `src/shared/config/env.ts`.
- Validate required env values at startup so missing configuration fails clearly.
- Do not store secrets in React Native env files; bundled env values are visible in the app build.

## Testing

- Add tests near the code when behavior is feature-specific.
- Keep app-level smoke tests in `__tests__/`.
- CI should run lint, typecheck, and tests before merge.
- Keep tests independent from local Watchman availability.

## Git Workflow

Use clear commit messages:

- `feat: add user profile screen`
- `fix: handle missing auth token`
- `docs: update folder structure`
- `refactor: move auth into feature module`
- `test: add auth store tests`
- `chore: update tooling`
