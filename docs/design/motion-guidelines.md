# Motion Guidelines

Motion should clarify hierarchy, preserve continuity, and make the product feel alive without competing with the films.

## Principles

- Use one clear entrance motion per surface.
- Prefer opacity, small translation, and restrained scale.
- Use spring motion for direct manipulation such as selected mood chips.
- Use timing curves for content loading and image fades.
- Never animate essential content indefinitely.

## Durations

- Micro feedback: 120–180ms.
- Component entrance: 240–450ms.
- Hero imagery: 450–700ms.
- Refresh and loading: subtle looping opacity only.

## Performance

Prefer native-driver-compatible properties: opacity and transforms. Avoid animating layout dimensions or large text blocks. Stop loops on unmount and respect reduced-motion preferences when the platform exposes them.

## Navigation

Screen transitions should communicate forward progress and preserve context. Detail screens may slide in; modal actions should feel anchored to their source.