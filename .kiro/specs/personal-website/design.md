# Design Document

## Overview

A statically exported single-page portfolio site. Every section is a pure presentational component fed by one typed content module. There is no runtime data fetching, no API, and no client state beyond the theme toggle and the scroll-spy observer.

The architectural bet: **content is data, layout is code, and the two never mix.** Updating the CV means editing `src/content/resume.ts` and pushing. That single decision drives the component contracts, the tests, and the deployment model.

---

## Technology Stack

| Concern   | Choice                                                     | Why                                                                             |
| --------- | ---------------------------------------------------------- | ------------------------------------------------------------------------------- |
| Framework | Next.js 15 (App Router), `output: 'export'`                | Static HTML out, first-class metadata API, no server to pay for or patch        |
| Language  | TypeScript, `strict: true`                                 | The content schema is enforced at build time, which is the whole point of Req 1 |
| Styling   | Tailwind CSS v4 with CSS custom properties as tokens       | Tokens live in one place; theme switching is a class on `<html>`                |
| Fonts     | Self-hosted via `next/font/local`                          | Req 14.4 — no third-party font request on the critical path                     |
| Icons     | `lucide-react`, imported per-icon                          | Tree-shakes; avoids shipping an icon font                                       |
| Testing   | Vitest + React Testing Library; `@axe-core/react` for a11y | Component contracts and Req 12.6                                                |
| CI/CD     | GitHub Actions                                             | Req 15                                                                          |
| Hosting   | GitHub Pages (default) or S3 + CloudFront (alternative)    | Both consume the same static export                                             |

**Deliberately excluded:** state management libraries, animation libraries, a CMS, a component kit. None of them earn their bundle weight for a page this size.

---

## Architecture

```
┌─────────────────────────────────────────────┐
│  src/content/resume.ts   (single source)    │
│  typed against src/content/schema.ts        │
└───────────────────┬─────────────────────────┘
                    │ imported at build time
                    ▼
┌─────────────────────────────────────────────┐
│  app/layout.tsx                             │
│   ├─ ThemeScript (pre-paint, inline)        │
│   ├─ SkipLink                               │
│   ├─ Nav (scroll-spy, from section registry)│
│   └─ app/page.tsx                           │
│        └─ <Section> wrappers                │
│             Hero / About / Experience /     │
│             Skills / Projects / Education /  │
│             Courses / Contact               │
└─────────────────────────────────────────────┘
                    │ next build
                    ▼
              out/  →  static host
```

### Section registry

`Nav` must not hardcode a section list (Req 8.1, Req 1.3). A registry module exports an ordered array of `{ id, label, enabled }`, where `enabled` is computed from whether the corresponding content array is non-empty. `page.tsx` and `Nav` both read that registry, so a section can never appear in the nav but not on the page.

---

## Data Models

```ts
// src/content/schema.ts

export interface Profile {
  name: string;
  headline: string; // "Computer Science Graduate — Software, Cloud & Systems"
  summary: string; // ≤ 60 words (Req 3.1)
  location: string;
  statusLine: [string, string, string]; // exactly three facts (Req 2.3)
  highlights: string[];
  languages: { name: string; level: string }[];
}

export interface ContactLink {
  kind: "email" | "phone" | "linkedin" | "github" | "cv";
  label: string;
  href: string; // mailto: / tel: / https: / /fathi-zidan-cv.pdf
  primary?: boolean;
}

export interface ExperienceEntry {
  id: string;
  company: string;
  role: string;
  location: string;
  start: string; // 'YYYY-MM' — sortable (Req 4.2)
  end: string | null; // null renders as "Present" (Req 4.3)
  achievements: string[];
  technologies?: string[];
}

export interface SkillGroup {
  label: "Languages" | "Areas" | "Cloud & DevOps" | "Tools";
  items: string[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  repoUrl?: string; // optional (Req 6.3)
  liveUrl?: string;
}

export interface Education {
  degree: string;
  institution: string;
  graduationYear: number;
  coursework: string[];
}

export interface Course {
  title: string;
  provider: string;
  year: number;
  status: "completed" | "in-progress"; // Req 7.4
  durationHours?: number;
  projectNote?: string;
}

export interface ResumeContent {
  profile: Profile;
  contact: ContactLink[];
  experience: ExperienceEntry[];
  skills: SkillGroup[];
  projects: Project[];
  education: Education;
  courses: Course[];
}
```

`start` and `end` are `YYYY-MM` strings, not `Date` objects: they sort lexicographically, serialize cleanly, and avoid timezone drift on a date that only has month precision.

### Seed content (from the CV)

- **Experience:** Dynamic Yield (a Mastercard company) — Platform Operations Engineer — TLV, `2023-09` → `2025-02`. Technologies: AWS (EC2, S3, RDS), Docker, Python, Bash, Grafana, OpenSearch. / Atidim Program — Python Tutor — Remote, `2022-08` → `2025-08`.
- **Skills:** Languages: Python, C, C++, Java, Bash. Areas: Algorithms & Data Structures, Software Engineering, Machine Learning, Operating Systems, Networking. Cloud & DevOps: AWS (EC2, S3, IAM), Docker, CI/CD, Linux. Tools: Git, Grafana, OpenSearch, Jira.
- **Projects:** Log Analysis & Automation Tool. Alert Hub — Microservices Notification System (from the MS&T course).
- **Education:** B.Sc. Computer Science, The Hebrew University of Jerusalem, 2026.
- **Courses:** Microservices Development & DevOps, MS&T, 2025, completed, 250 hours. / AI Engineer Career Accelerator Program, Hasoub, 2026, in-progress.
- **Languages:** Arabic (native), Hebrew (fluent), English (fluent).

---

## Visual Design System

### Direction

The subject is someone who kept production systems healthy and taught Python one-to-one. The design is grounded in **instrumentation**: calm, high-signal, legible under pressure. Not a terminal pastiche — an instrument panel. Structure carries meaning; nothing is decorative.

One bold element, everything else disciplined: **the name is set very large and tight in the hero, and nothing else on the page competes with it.**

### Color tokens

Defined once as CSS custom properties on `:root` and `.dark`:

```css
:root {
  --bg: #fafaf8; /* paper, very slightly warm off-white */
  --surface: #efefea; /* recessed panels, tag chips */
  --text: #16191c; /* body ink */
  --muted: #5a6169; /* dates, meta, secondary lines */
  --rule: #d5d6d0; /* hairlines and dividers */
  --signal: #1d6a6a; /* deep teal — links, active nav, focus */
}
.dark {
  --bg: #121417;
  --surface: #1b1f23;
  --text: #e7e9e6;
  --muted: #99a1a8;
  --rule: #2c3238;
  --signal: #4fb3a8;
}
```

The accent is a single deep teal used **only** for interactive and active states, never as decoration. No gradients. No colored section backgrounds.

### Typography

Two families, clearly distinct:

- **Display — Space Grotesk.** Name, section headings. Slightly mechanical, wide apertures; carries the instrument-panel personality without novelty.
- **Body — Source Sans 3.** Paragraphs, bullets, labels. Neutral, tall x-height, reads well at 16 px.

Scale (1.25 ratio, clamped for fluid sizing):

| Role                   | Size                       | Weight | Notes                                |
| ---------------------- | -------------------------- | ------ | ------------------------------------ |
| Name                   | `clamp(3rem, 9vw, 6.5rem)` | 700    | tracking `-0.03em`, line-height 0.95 |
| Section heading        | `clamp(1.5rem, 3vw, 2rem)` | 600    | sentence case                        |
| Role / project title   | 1.25rem                    | 600    |                                      |
| Body                   | 1rem / 1.0625rem           | 400    | line-height 1.6, measure ≤ 72ch      |
| Meta (dates, location) | 0.875rem                   | 400    | `--muted`, sentence case             |

**Prohibited treatments** (these read as templated): all-caps tracked-out eyebrow labels above headings, one accent-colored word inside a headline, meta strings joined by middle dots, arrows appended to link text, monospace used decoratively for labels.

### Layout

Desktop ≥ 1024 px — asymmetric two-column, left rail sticky:

```
┌──────────────┬──────────────────────────────────┐
│ FATHI        │  ┌ hero ───────────────────────┐ │
│ ZIDAN        │  │  FATHI                      │ │
│              │  │  ZIDAN                      │ │
│ About        │  │  CS Graduate — Software,    │ │
│ Experience   │  │  Cloud & Systems            │ │
│ Skills   ◄── │  │  HUJI '26 · Cloud & systems │ │
│ Projects     │  │  · Israel                   │ │
│ Education    │  │  [Download CV] [Get in touch]│ │
│ Contact      │  └─────────────────────────────┘ │
│              │  ── About ───────────────────    │
│ ○ light/dark │  ...                             │
└──────────────┴──────────────────────────────────┘
   240px fixed         max-width 68ch content
```

Below 1024 px the rail collapses to a top bar; below 768 px the nav becomes a disclosure button (Req 8.4). Content is left-aligned throughout — never centered body text.

Sections are separated by a hairline rule and generous vertical space, not by cards. Chips (skills, technologies) use `--surface` with a 4 px radius; everything else has square corners. **One radius value in the whole system.**

### Structural devices with meaning

- Experience is genuinely a sequence, so it renders as a vertical timeline with a hairline spine.
- Skills and projects are **not** sequences, so they get no numbering and no timeline.
- The in-progress course carries a small outlined status marker; completed ones carry only a year.

### Motion

One orchestrated moment: on first paint the hero name settles from 0.98 scale and 0 opacity over 400 ms, once. Nothing else animates on scroll. Interaction feedback (focus ring, nav active state, theme cross-fade at 150 ms) is allowed because it reports a change the user caused. All of it is wrapped in `@media (prefers-reduced-motion: no-preference)`.

---

## Component Interfaces

```
components/
  layout/
    Nav.tsx            props: { sections: SectionMeta[] }        — scroll-spy via IntersectionObserver
    SkipLink.tsx       props: {}
    ThemeToggle.tsx    props: {}                                  — 'use client'
    Section.tsx        props: { id, title, children }             — <section aria-labelledby>
  sections/
    Hero.tsx           props: { profile: Profile; contact: ContactLink[] }
    About.tsx          props: { profile: Profile }
    Experience.tsx     props: { entries: ExperienceEntry[] }
    Skills.tsx         props: { groups: SkillGroup[] }
    Projects.tsx       props: { projects: Project[] }
    Education.tsx      props: { education: Education }
    Courses.tsx        props: { courses: Course[] }
    Contact.tsx        props: { contact: ContactLink[] }
  ui/
    Chip.tsx           props: { children }
    ExternalLink.tsx   props: { href, children }                  — enforces target/rel (Req 6.5)
    TimelineItem.tsx   props: { entry: ExperienceEntry }
```

Only `Nav` and `ThemeToggle` are client components. Everything else renders on the server at build time — that is how Req 14.2 is met.

### Theme, without a flash

An inline script in `<head>`, executed before paint, reads `localStorage.theme`, falls back to `matchMedia('(prefers-colors-scheme: dark)')`, and sets `class="dark"` on `<html>`. `ThemeToggle` only writes to `localStorage` and flips the class after hydration. This ordering is what satisfies Req 11.4; putting the read inside a React effect would guarantee the flash.

### Date formatting

One utility, `formatDateRange(start, end)`, returns `"Sep 2023 – Feb 2025"` or `"Aug 2022 – Present"`. Sorting uses a separate `byStartDesc` comparator on the raw `YYYY-MM` string.

---

## Error Handling

There is no runtime error surface — no fetches, no forms, no user input. Failures are pushed to build time:

1. **Schema violations** → TypeScript compile error, CI fails before publish.
2. **Missing CV PDF** → a build-time assertion in the content module checks that every `href` starting with `/` resolves to a file in `public/`. Fails the build with the offending path.
3. **Empty content arrays** → not an error; the section registry drops the section (Req 1.3).
4. **Optional links absent** → the component branches on presence and renders nothing (Req 6.3).
5. **Unexpected client error** → `app/error.tsx` renders a minimal, in-voice message and a link back to the top. No stack traces, no apology copy.
6. **Unknown route** → `app/not-found.tsx` with a link home.

---

## Testing Strategy

**Unit (Vitest)**

- `formatDateRange` — present-date, single-month, year-boundary cases.
- `byStartDesc` — ordering is derived from dates, not array order (Req 4.2).
- Section registry — a section with an empty array is excluded.

**Component (React Testing Library)**

- Hero renders name, headline, three status facts, and both CTAs (Req 2).
- Experience renders "Present" when `end` is null (Req 4.3).
- Projects renders no anchor when `repoUrl` is absent (Req 6.3).
- Courses renders an in-progress marker instead of a year (Req 7.4).
- ExternalLink always emits `rel="noopener noreferrer"` (Req 6.5).

**Accessibility**

- `axe-core` run against the fully rendered page; the assertion is zero critical or serious violations (Req 12.6).
- Manual keyboard pass, scripted as a checklist in the README: skip link first, focus visible on every stop, nav reachable and operable, no focus trap.

**Performance**

- Lighthouse CI on the built output, budget-gated: performance ≥ 95, CLS < 0.1, first-load JS < 100 KB gzipped (Req 14).

**Cross-cutting**

- Responsive checks at 320 / 375 / 768 / 1024 / 1440 / 2560 px, asserting no horizontal overflow (Req 10.2).
- Both themes checked for AA contrast on body and muted text (Req 11.5).

---

## Deployment

`next build` with `output: 'export'` produces `out/`.

**Default — GitHub Pages.** Workflow on push to `main`: checkout → setup Node → `npm ci` → `npm run lint` → `npm run typecheck` → `npm test` → `npm run build` → upload `out/` as a Pages artifact → deploy. Any failing step stops the job before deploy (Req 15.3).

**Alternative — AWS.** `aws s3 sync out/ s3://$BUCKET --delete` followed by a CloudFront invalidation of `/*`, with credentials from an OIDC role rather than long-lived keys. Same gating steps; only the publish step differs.

The README documents both paths, plus how to edit `resume.ts` and how to replace the CV PDF.
