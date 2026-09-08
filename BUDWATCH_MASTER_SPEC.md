# BUDWATCH MASTER SPEC
Version: 1.0
Status: Active
Owner: Product

---

# 1. Mission

BudWatch is a premium movie discovery platform centered around experiences.

We do not begin with movies.

We begin with emotion.

The first question BudWatch asks is:

"What kind of night are you having?"

Everything in the application exists to answer that question.

---

# 2. Product Principles

1. Movie artwork is the interface.

2. Less UI is better UI.

3. Every screen has one focal point.

4. Typography is more important than decoration.

5. Motion should feel calm, cinematic and intentional.

6. Never copy Letterboxd.

7. Never copy Netflix.

8. Draw inspiration from:

- Apple TV
- Apple Music
- Arc Browser
- A24
- Linear

---

# 3. Visual Language

Mood

Premium.

Editorial.

Minimal.

Modern.

Calm.

Confident.

Dark.

Movie-first.

Avoid:

- Generic dashboards
- Busy interfaces
- Loud colors
- Heavy borders
- Random cards
- Material Design styling

---

# 4. Home Screen

Purpose:

Help someone discover tonight's movie within 30 seconds.

Layout:

Header

↓

Hero Movie

↓

Mood Selector

↓

For You

↓

Community

The Hero always dominates the first screen.

The hero is never smaller than the mood selector.

Movie artwork should occupy more space than interface elements.

---

# 5. Hero

Contains:

Backdrop

Poster

Movie Title

Short Tagline

Bud Score

Watch Tonight

Details

The backdrop is the primary visual element.

Never cover the artwork with unnecessary UI.

---

# 6. Mood

BudWatch is built around moods.

Mood is the primary navigation system.

Not genres.

Not search.

Not ratings.

Examples:

Laugh

Mind Bending

Escape

Relax

Horror

Animation

Each mood changes recommendations throughout the app.

---

# 7. Components

Reusable only.

MovieHero

MoviePosterCard

MovieRow

MoodCard

BudScoreCard

ExperienceCard

ProfileHeader

SectionHeader

FloatingNavigation

PrimaryButton

No duplicate components.

---

# 8. Motion

Everything fades.

Everything glides.

Nothing bounces.

No flashy animations.

Every transition should feel cinematic.

---

# 9. Typography

Large.

Confident.

Editorial.

Movie titles should dominate.

Secondary text should remain quiet.

---

# 10. Engineering Rules

TypeScript only.

Reusable components.

Theme tokens only.

No duplicated UI.

No hardcoded colors.

No hardcoded spacing.

Screens compose components.

Components never fetch data directly.

Services own networking.

Hooks own state.

---

# 11. Product Rule

When making any implementation decision ask:

"Would this make someone want to watch a movie tonight?"

If the answer is no,

don't build it.