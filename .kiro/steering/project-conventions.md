---
inclusion: always
---

# Project conventions

## Stack
Next.js 15 App Router with `output: 'export'`, TypeScript strict mode,
Tailwind CSS v4. No server runtime. No state management library, no
animation library, no component kit.

## Content rule
All résumé content lives in `src/content/resume.ts`, typed against
`src/content/schema.ts`. Never hardcode résumé text inside a component.
If a component needs new content, extend the schema first.

## Styling rule
Colors come from CSS custom properties defined in `globals.css`
(`--bg`, `--surface`, `--text`, `--muted`, `--rule`, `--signal`).
Never write a raw hex value in a component. One border-radius value
across the whole system.

## Components
Server components by default. Only `Nav` and `ThemeToggle` are
`'use client'`. Keep the first-load JS bundle under 100 KB gzipped.

## Accessibility
Every interactive element is keyboard reachable with a visible focus
ring. All motion is wrapped in `@media (prefers-reduced-motion:
no-preference)`. One `<h1>` per page.

## Definition of done
A task is done when `npm run lint`, `npm run typecheck`, `npm test`,
and `npm run build` all pass.
