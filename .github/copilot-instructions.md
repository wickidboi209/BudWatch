# BudWatch Copilot Instructions

BudWatch is a premium, cinematic, social movie discovery product. Treat the repository documentation as the source of truth for product intent, design, architecture, engineering, backend, and delivery decisions.

## Required Reading

Before making changes, read the relevant documents and always read:

- `docs/product/vision.md`
- `docs/product/principles.md`
- `docs/design/design-system.md`
- `docs/architecture/architecture.md`
- `docs/engineering/coding-standards.md`
- `docs/engineering/ai-rules.md`

Read the narrower design, backend, navigation, state, feature, or sprint document when the task touches that area.

## Architecture Rules

- Prefer reusable components over large screens.
- Keep screens focused on composition and workflow state.
- Keep business logic and external API calls out of UI components.
- Map external data into application types at service boundaries.
- Use typed navigation params and pass stable IDs instead of mutable object graphs.
- Use React Context only for genuinely cross-cutting state such as authentication.
- Do not introduce a global store without a documented synchronization need.
- Use theme tokens instead of hardcoded visual values.
- Keep new components focused and approximately 200 lines or less.

## Design Rules

- Preserve BudWatch’s dark, cinematic visual language.
- Start discovery from feeling and mood.
- Use imagery to carry emotion and keep UI chrome restrained.
- Prefer hierarchy, spacing, typography, and subtle motion over decoration.
- Build loading, empty, error, and recovery states with every remote workflow.
- Give interactive elements accessible roles, labels, and practical 44-point targets.
- Do not use color as the only state indicator.

## Engineering Rules

- Use TypeScript strictness and functional React components.
- Avoid `any`; narrow `unknown` explicitly.
- Use `FlatList` for repeated or potentially long collections.
- Use native-driver-compatible animation properties where possible.
- Stop animation loops on unmount.
- Never expose, print, or commit `.env` secrets.
- Treat authentication, consumption context, notes, and social data as sensitive.
- Respect user changes in a dirty worktree and do not revert unrelated edits.
- Do not add application code when the request is documentation-only.

## AI Workflow

Before editing, identify the owning abstraction, state one local hypothesis, and choose a cheap check that could disprove it. Make the smallest testable edit. Immediately run a focused typecheck, test, lint, or build after the first substantive edit. Finish with a concise summary of decisions, validation, and known limitations.

## Documentation Duties

When behavior, architecture, API contracts, product principles, or delivery conventions change, update the relevant document in the same work item. New features should follow `docs/sprints/sprint-template.md` and should identify privacy implications.

## Product Boundaries

BudWatch is not a streaming service, cannabis marketplace, or medical product. Cannabis is one optional viewing context, never the platform identity. Avoid medical claims and assumptions about a member’s consumption, impairment, or lifestyle.