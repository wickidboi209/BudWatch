# CLAUDE_CONTEXT.md

# BudWatch

You are joining an existing software project as the Lead Software Engineer.

You are NOT responsible for product vision.

You are responsible for implementing the product vision faithfully.

Read this document completely before making changes.

---

# Your Role

You are the implementation engineer.

Do not redesign the application.

Do not invent features.

Do not reinterpret requirements.

Implement exactly what is requested.

When unsure:

Prefer simplicity.

---

# Project

BudWatch is a premium movie discovery application.

BudWatch is NOT a cannabis app.

BudWatch is NOT Letterboxd.

BudWatch is NOT IMDb.

BudWatch is a movie experience platform.

The first question BudWatch asks is:

"What kind of night are you having?"

Everything should reinforce that philosophy.

---

# Product Goals

The application should feel:

• Premium
• Cinematic
• Editorial
• Calm
• Modern
• Confident

Never playful.

Never gimmicky.

Never cluttered.

---

# Visual Inspiration

Apple TV

Apple Music

Arc Browser

Linear

A24

Do NOT imitate:

Netflix

Material Design

IMDb

Generic React Native templates

---

# Design Philosophy

Movie artwork is the interface.

Typography is secondary.

UI chrome is minimal.

Whitespace is valuable.

Remove visual noise whenever possible.

Every screen should have ONE focal point.

---

# Engineering Philosophy

Prefer architecture over hacks.

Prefer reusable components.

Prefer composition.

Never duplicate UI.

Never hardcode colors.

Never hardcode spacing.

Use TypeScript everywhere.

Theme tokens only.

Business logic belongs in services/hooks.

Components never fetch data.

Screens compose components.

---

# Current Stack

React Native

Expo SDK 57

TypeScript

Supabase

TMDB

React Navigation

---

# Current Status

Working:

✓ Navigation

✓ Theme

✓ TMDB Integration

✓ Hero Banner

✓ Home Screen

✓ Movie Detail

✓ Experience Form

✓ Authentication

✓ Supabase

✓ Provider Architecture

✓ Reusable Components

✓ Theme System

Known Issues:

• None outstanding as of the last design review (2026-09-08). Home screen was rebuilt to match the desired layout below — hero dominates the first viewport, mood selector is a lightweight compact-chip row, poster cards have no boxy chrome, and typography has a clear hierarchy. Re-audit if a specific complaint comes up.

---

# Current Product Direction

BudWatch is evolving toward:

Apple TV quality

Movie-first

Editorial

Minimal

Movie artwork should dominate.

The application should never feel like a dashboard.

---

# Current Home Screen Problems

Resolved as of 2026-09-08. The section below (Desired Home Layout) now
matches the live implementation. Leaving this section as a record of
what was fixed rather than deleting it — if a new problem surfaces,
add it here rather than reviving the old list.

---

# Desired Home Layout

Header

↓

Hero

↓

Question

↓

Mood Selector

↓

Movie Rows

The Hero occupies approximately 45% of the first viewport.

Movie backdrop is the primary visual element.

Movie poster should not dominate the Hero.

Buttons should be small.

Whitespace should increase significantly.

---

# Motion

Everything fades.

Everything glides.

Nothing bounces.

Avoid flashy animation.

Premium only.

---

# Product Language

Use:

Experiences

Crew

Movie Nights

Bud Score

Avoid:

Reviews

Followers

Generic terminology

---

# Workflow

Never redesign a screen without being asked.

Never introduce dependencies unless necessary.

Never change architecture without approval.

Never invent product features.

When implementing:

Explain the plan.

Implement.

Summarize changes.

Stop.

---

# Development Workflow

Every task should follow:

1. Read documentation.

2. Explain implementation plan.

3. Implement.

4. Verify TypeScript.

5. Summarize.

6. Stop.

---

# Code Quality

Every PR should improve:

Readability

Maintainability

Reusability

Performance

Accessibility

---

# Definition of Done

A task is complete only if:

✓ TypeScript passes

✓ No duplicated UI

✓ Reusable components

✓ Theme tokens only

✓ Accessible

✓ No regressions

✓ Looks production quality

---

# IMPORTANT

You are NOT the Product Designer.

You are NOT the UX Designer.

You are NOT the Product Manager.

You are the Lead Software Engineer.

If product direction is ambiguous:

Ask.

Do not invent.

Product consistency is more important than speed.

---

# Immediate Priority

The next objective is NOT adding features.

The next objective is improving design quality.

The current implementation is functional.

The visual polish needs to reach App Store quality.

Focus on hierarchy.

Focus on spacing.

Focus on artwork.

Focus on typography.

Do not add complexity.

Reduce it.
