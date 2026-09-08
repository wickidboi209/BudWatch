# Folder Structure

```text
src/
  components/       Reusable presentational components
  hooks/             Reusable stateful behavior
  navigation/       Typed navigators and route contracts
  providers/        Cross-cutting React providers
  screens/          Screen-level composition and workflow state
  services/         External APIs, persistence, and domain adapters
  theme/            Design tokens
  types/            Shared domain types when they span features
  utils/             Pure helpers with no UI ownership
docs/
  product/          Product intent and principles
  design/           Visual language and motion
  architecture/    System structure and technical decisions
  engineering/     Implementation and AI standards
  backend/         Data and API contracts
  features/        Feature briefs and acceptance criteria
  sprints/         Delivery planning and templates
```

## Placement Rules

- A component belongs in `src/components` when it is reusable across screens.
- A feature-specific component may live under a feature folder when it has no meaningful reuse outside that feature.
- A screen should read like a composition outline.
- Services should be platform- and UI-independent.
- Documentation links to source files using repository-relative paths.