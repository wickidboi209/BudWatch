# Architecture

BudWatch is a React Native and Expo application organized around composition, feature ownership, and explicit service boundaries.

## Layers

1. Screens compose workflows and own screen-level state.
2. Components render reusable interaction and presentation units.
3. Hooks expose reusable stateful behavior.
4. Services own external systems such as TMDB and Supabase.
5. Theme tokens define visual decisions.
6. Navigation defines application movement and typed route contracts.

Business logic should not be hidden inside presentational components. External API response shapes should be mapped into application types at the service boundary.

## Data Flow

External data enters through a service, is validated or mapped, flows into a screen or feature hook, and is passed through typed props to components. Components emit user intent through callbacks; they do not call APIs directly.

## Decisions

- Supabase is the authentication and future member-data boundary.
- TMDB is the movie metadata and imagery boundary.
- React Context is reserved for cross-cutting session state, not arbitrary screen state.
- Placeholder data must live in a named service or fixture module, never in multiple screens.