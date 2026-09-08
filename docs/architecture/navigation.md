# Navigation

Navigation is typed and organized as a root stack around the authenticated tab experience.

## Current Shape

- Root stack: authentication boundary, main tabs, movie detail, and experience flows.
- Bottom tabs: Home, Search, Reviews, Watchlist, Profile.
- Detail flows receive stable identifiers, not entire mutable data objects.

## Rules

- Every route belongs in the route parameter type.
- Pass IDs and small intent parameters; fetch or derive detail data at the destination.
- Hide headers when the screen owns its own header treatment.
- Preserve back behavior and make every custom back control accessible.
- Do not let a tab screen reach into another tab’s internal state.