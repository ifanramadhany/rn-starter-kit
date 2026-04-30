# Folder Structure

## Overview

```txt
RNStarterKit/
├── src/
│   ├── app/                # App composition, providers, root navigation
│   ├── features/           # Product/domain features
│   └── shared/             # Cross-feature reusable code
├── android/                # Android native code
├── ios/                    # iOS native code
├── __tests__/              # App-level tests
├── docs/                   # Project documentation
└── [config files]
```

## `src/app/`

App-level composition code. This layer can import from `features` and `shared`, but feature modules should not import from `app`.

```txt
src/app/
├── App.tsx
├── navigation/
│   ├── RootNavigator.tsx
│   ├── AuthNavigator.tsx
│   └── MainNavigator.tsx
└── providers/
    └── AppProviders.tsx
```

Use this folder for:

- root app component
- navigation containers and route groups
- app-wide providers
- app bootstrap code

## `src/features/`

Feature-owned product code. Each feature should be understandable and mostly editable without touching unrelated features.

```txt
src/features/
├── auth/
│   ├── screens/
│   ├── services/
│   ├── store/
│   └── index.ts
└── home/
    ├── screens/
    └── index.ts
```

Recommended feature folders:

- `screens/` for route-level UI
- `components/` for feature-only components
- `services/` for feature-specific IO and business operations
- `store/` for feature state
- `hooks/` for feature-specific hooks
- `types.ts` for feature types
- `index.ts` for the public feature API

Prefer importing other features through their `index.ts` file. Avoid deep imports into another feature's internals unless there is a clear reason.

## `src/shared/`

Reusable cross-feature infrastructure.

```txt
src/shared/
└── storage/
    └── storage.ts
```

Use this folder for:

- API clients
- storage adapters
- shared UI primitives
- shared hooks
- generic utilities
- constants and shared types

Shared code must not depend on product features.

## Import Direction

Allowed direction:

```txt
app -> features -> shared
app -> shared
```

Avoid:

```txt
shared -> features
features -> app
feature A -> feature B internals
```

## Testing

Keep feature tests close to the source when they are feature-specific. Use `__tests__/` for app-level smoke tests and integration-style tests.

## Team Rules

- A feature owns its screens, store, services, hooks, and private components.
- Shared code must be generic enough for at least two features or clearly infrastructure-level.
- Do not add root-level folders unless they represent a stable architectural layer.
- Update this document when the architecture changes.
