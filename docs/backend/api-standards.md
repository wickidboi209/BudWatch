# API Standards

## Service Boundaries

TMDB provides movie metadata, imagery, ratings, and cast data. Supabase provides authentication and BudWatch-owned data. UI components must not call either provider directly.

## Request Rules

- Keep endpoint construction inside services.
- Encode identifiers and query values.
- Check HTTP and provider errors explicitly.
- Map provider responses into stable application types.
- Do not leak provider-specific error payloads to users.
- Include loading, empty, error, and retry behavior in the consuming workflow.

## Caching and Rate Limits

Cache read-heavy movie metadata where practical and avoid refetching on every render. Respect TMDB rate limits and attribution requirements. Mutations should be idempotent where possible.

## Secrets

Public Expo variables are suitable only for public client keys such as Supabase’s anon key and TMDB’s client key. Never put service-role keys or privileged credentials in the app bundle.