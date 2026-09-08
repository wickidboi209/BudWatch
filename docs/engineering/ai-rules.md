# AI Rules

This document is the operating contract for AI-assisted development in BudWatch.

## Before Editing

- Read this file, the relevant product/design documentation, and the nearest owning implementation.
- State a local hypothesis about the behavior and identify a cheap check that could disprove it.
- Prefer the smallest change that tests the hypothesis.

## While Editing

- Preserve existing user changes and public contracts.
- Reuse local abstractions before adding new ones.
- Do not invent APIs, credentials, or product behavior without marking them as placeholders.
- Keep business logic out of presentation components.
- Explain meaningful architectural decisions in the final response.

## After Editing

- Run a focused executable validation immediately after the first substantive edit.
- Fix local failures before broadening scope.
- Report what changed, what was validated, and any known limitations.

## Safety and Privacy

- Never expose or copy secrets from `.env` files.
- Treat authentication, consumption context, and social data as sensitive.
- Do not add analytics or data collection without product justification and consent boundaries.