# Database Plan

Supabase Postgres is the planned durable data store. Row Level Security is mandatory for member-owned and social data.

## Core Tables

- `profiles`: public display identity linked one-to-one with `auth.users`.
- `experiences`: member, movie identifier, Bud Score, mood, notes, spoiler flag, timestamps.
- `crews`: crew identity and ownership.
- `crew_members`: membership, role, status, timestamps.
- `lists`: member-owned or crew-owned collections.
- `list_items`: ordered movie references within lists.
- `reactions`: one reaction per member, experience, and reaction type.
- `comments`: threaded comments using a nullable parent comment ID.

## Rules

- Use UUIDs for application-owned records.
- Store TMDB IDs, not duplicated movie metadata, as the canonical external reference.
- Add `created_at` and `updated_at` to mutable records.
- Enable RLS before exposing a table to the client.
- Default to private; explicitly authorize public community fields.
- Add indexes for member IDs, movie IDs, crew IDs, and feed timestamps.

## Privacy

Consumption method and notes are sensitive member data. They must not be public by default. Moderation and deletion flows are required before broad social launch.