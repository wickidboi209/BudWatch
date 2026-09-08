# State Management

Use the smallest state scope that solves the problem.

## Scope Hierarchy

1. Local component state for transient input and visual interaction.
2. Screen state for loading, errors, selections, and workflow composition.
3. Feature hooks for reusable async workflows or derived state.
4. React Context for cross-cutting session state such as authentication.
5. Supabase or another service for durable member data.

Do not introduce a global store until a real cross-screen synchronization problem exists. Do not duplicate server state in multiple contexts without a clear cache policy.

## Async State

Every remote workflow should make loading, success, empty, and error states explicit. Requests must avoid setting state after unmount and should expose recovery actions where possible.

## Persistence

Persist only data required for continuity. Keep credentials and session persistence inside Supabase’s supported auth storage. Never place secrets in source or documentation.