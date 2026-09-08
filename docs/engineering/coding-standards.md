# Coding Standards

## TypeScript

- Keep strict type checking enabled.
- Prefer explicit domain types at service boundaries.
- Avoid `any`; use `unknown` and narrow it.
- Use descriptive names and avoid one-letter variables outside conventional indexes.

## React Native

- Use functional components and hooks.
- Keep screens focused on composition.
- Use `StyleSheet.create` and theme tokens.
- Add accessibility roles and labels to interactive controls.
- Use `FlatList` for repeated or potentially long collections.

## Components

Components should have one clear responsibility, typed props, and no hidden network calls. Keep files near 200 lines or less; split only when the new boundary improves ownership.

## Errors and Loading

Design loading, empty, error, and retry states as part of the feature. Avoid indefinite spinners when a stable skeleton is possible.

## Changes

Make focused edits, preserve unrelated work, and validate with the narrowest available typecheck or test. Do not commit generated secrets or credentials.