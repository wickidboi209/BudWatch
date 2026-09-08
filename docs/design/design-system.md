# Design System

The BudWatch design system is a dark, cinematic system built for focused discovery. Tokens are the source of truth for color, spacing, typography, radii, elevation, and motion.

## Visual Direction

- Dark neutral canvas with restrained green action color.
- High-contrast white content and quiet secondary text.
- Rounded surfaces used for actual content groups, not every page region.
- Imagery carries emotion; UI chrome stays quiet.
- Avoid purple-heavy gradients, decorative blobs, and generic dashboard patterns.

## Token Rules

Use `src/theme` tokens instead of local literals. New tokens should be named by role, not by appearance: `surfaceElevated`, `textSecondary`, and `primary` are preferred over `darkGray` or `green2`.

Required token groups:

- Colors: canvas, surfaces, borders, content, actions, semantic states.
- Spacing: a small consistent scale for layout rhythm.
- Typography: display, title, heading, body, and label roles.
- Radius: small, medium, large, and pill roles.
- Shadows: platform-aware elevation and depth.

## Component Rules

Components must expose intent-focused props, remain theme-driven, and own their local presentation. Screens compose components and own orchestration state. Repeated UI belongs in a reusable component.

## Accessibility

Interactive controls require a meaningful accessibility role and label. Touch targets should be at least 44 points where practical. Do not use color as the only state indicator.