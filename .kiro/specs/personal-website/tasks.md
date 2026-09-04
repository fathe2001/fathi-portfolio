# Implementation Plan

Each task is written to be executed by Kiro one at a time, in order. Every task names the files it touches and the requirements it satisfies. Do not start a task before its predecessors are complete — later tasks assume earlier files exist.

---

- [x] 1. Scaffold the project and toolchain
  - Create a Next.js 15 project with the App Router, TypeScript, and Tailwind CSS v4 in the repository root.
  - Set `output: 'export'` and `images.unoptimized: true` in `next.config.ts`.
  - Enable `strict: true` and the `@/*` path alias in `tsconfig.json`.
  - Add ESLint and Prettier with a format-on-build check, and `npm` scripts: `dev`, `build`, `lint`, `typecheck`, `test`.
  - Verify `npm run build` produces an `out/` directory.
  - _Requirements: 15.1_

- [x] 2. Define the content schema
  - Create `src/content/schema.ts` with the interfaces `Profile`, `ContactLink`, `ExperienceEntry`, `SkillGroup`, `Project`, `Education`, `Course`, and `ResumeContent` exactly as specified in the design document.
  - Export a `ResumeContent` type that every downstream component imports rather than redeclaring shapes.
  - _Requirements: 1.1, 1.2_

- [x] 3. Populate the content module from the CV
  - Create `src/content/resume.ts` exporting a single `resume: ResumeContent` object, typed against the schema.
  - Fill in profile, contact links, both experience entries, four skill groups, projects, education, and both courses using the seed content listed in the design document.
  - Add a build-time assertion that every internal `href` beginning with `/` corresponds to a file in `public/`.
  - Place the CV PDF at `public/fathi-zidan-cv.pdf`.
  - _Requirements: 1.1, 1.5, 4.6, 5.1, 6.4, 7.1, 7.2, 7.5, 9.4_

- [x] 4. Build the design token layer and typography
  - Define the light and dark CSS custom properties from the design document in `src/app/globals.css`, on `:root` and `.dark`.
  - Load Space Grotesk and Source Sans 3 through `next/font/local` with `display: 'swap'`, self-hosting the font files under `src/app/fonts/`.
  - Map the tokens into Tailwind's theme so components reference semantic names, never raw hex values.
  - Implement the type scale, including the clamped name size and the 72ch measure utility.
  - _Requirements: 3.3, 10.3, 11.5, 14.4_

- [x] 5. Implement date and ordering utilities with tests
  - Create `src/lib/dates.ts` with `formatDateRange(start, end)` and `byStartDesc`.
  - `formatDateRange` returns `"Sep 2023 – Feb 2025"`, and `"Aug 2022 – Present"` when `end` is null.
  - Write Vitest unit tests covering present-date, single-month, and year-boundary cases, and verify sorting is derived from dates rather than array order.
  - _Requirements: 4.2, 4.3_

- [x] 6. Implement the section registry
  - Create `src/lib/sections.ts` exporting an ordered array of `{ id, label, enabled }`, where `enabled` is computed from whether the matching content is non-empty.
  - Write a test asserting that a section backed by an empty array is excluded.
  - _Requirements: 1.3, 8.1_

- [x] 7. Build the root layout, skip link, and pre-paint theme script
  - Create `src/app/layout.tsx` with the html lang attribute, font variables, and landmark structure.
  - Add `SkipLink` as the first focusable element, targeting the main content region.
  - Inline a `<head>` script that reads `localStorage.theme`, falls back to `prefers-color-scheme`, and sets the `dark` class on `<html>` before first paint.
  - Verify by hard-reloading in dark mode that no light flash occurs.
  - _Requirements: 11.1, 11.4, 12.3, 12.4_

- [x] 8. Build the Section wrapper and shared UI primitives
  - Create `Section.tsx` rendering a `<section>` with an id and `aria-labelledby` pointing at its heading.
  - Create `Chip.tsx` and `ExternalLink.tsx`; `ExternalLink` must always emit `target="_blank"` and `rel="noopener noreferrer"`.
  - Write a component test asserting the `rel` attribute is present on every external link.
  - _Requirements: 6.5, 12.1, 12.4_

- [x] 9. Build the Hero section
  - Render the name as the single `<h1>`, at the clamped display size with tight tracking.
  - Render the headline, the three-fact status line, and the "Download CV" and "Get in touch" actions.
  - Implement the one-time settle animation, gated behind `prefers-reduced-motion: no-preference`.
  - Write a component test asserting the name, headline, three status facts, and both actions render as text.
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 12.5_

- [x] 10. Build the About section
  - Render the summary paragraph constrained to the 72ch measure, plus the highlights list and language proficiencies.
  - _Requirements: 3.1, 3.2, 3.3_

- [x] 11. Build the Experience section
  - Render entries sorted with `byStartDesc` as a vertical timeline with a hairline spine.
  - Render company, role, location, formatted date range, achievement bullets, and optional technology chips per entry.
  - Write a component test asserting "Present" renders when `end` is null.
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6_

- [x] 12. Build the Skills section
  - Render each group with its label and member skills as chips, with no proficiency bars, stars, or percentages.
  - Collapse to a single column below 640 px.
  - _Requirements: 5.1, 5.2, 5.3, 5.4_

- [x] 13. Build the Projects section
  - Render name, description, and technology chips per project, with a repository link only when `repoUrl` is present.
  - Write a component test asserting no anchor is rendered when `repoUrl` is absent.
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [x] 14. Build the Education and Courses sections
  - Render degree, institution, graduation year, and the coursework list.
  - Render each course with title, provider, and either a year or an outlined "In progress" marker.
  - Write a component test asserting the in-progress marker replaces the year for the Hasoub entry.
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [x] 15. Build the Contact section
  - Render the email as a `mailto:` link, the phone as a `tel:` link, and the LinkedIn and GitHub profile links.
  - Render the CV download pointing at the file in `public/`, with a descriptive filename.
  - Do not build a contact form.
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6_

- [x] 16. Build the navigation with scroll-spy
  - Render nav items from the section registry, as a sticky left rail at 1024 px and above.
  - Use an `IntersectionObserver` to mark the section occupying the majority of the viewport as active.
  - Collapse to a top bar below 1024 px and to a disclosure button below 768 px that does not obscure content.
  - Disable smooth scrolling when `prefers-reduced-motion: reduce` is set.
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

- [x] 17. Build the theme toggle
  - Render a control that flips the `dark` class and persists the choice to `localStorage`.
  - Give it an accessible name that describes the action, and a 150 ms cross-fade only when motion is permitted.
  - Verify the persisted choice survives a reload with no flash.
  - _Requirements: 11.2, 11.3, 11.4_

- [x] 18. Assemble the page and verify responsiveness
  - Compose all sections in `src/app/page.tsx` in registry order, feeding each from `resume.ts`.
  - Check 320, 375, 768, 1024, 1440, and 2560 px for legibility, absence of horizontal overflow, 16 px minimum body text, and 44 × 44 px touch targets.
  - _Requirements: 10.1, 10.2, 10.3, 10.4_

- [x] 19. Add metadata, structured data, and crawler files
  - Populate the Next.js `metadata` export with title, description, canonical URL, Open Graph, and Twitter card tags derived from the profile data.
  - Add an Open Graph image at 1200 × 630.
  - Emit a `Person` JSON-LD block with name, job title, alma mater, and profile links.
  - Add `robots.txt` and `sitemap.xml`.
  - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5_

- [x] 20. Add error and not-found routes
  - Create `app/error.tsx` and `app/not-found.tsx` with plain, in-voice copy and a link back to the top. No stack traces.
  - _Requirements: 12.1_

- [x] 21. Run and fix the accessibility audit
  - Wire `@axe-core/react` into the test run against the fully rendered page and fix every critical and serious violation.
  - Verify heading hierarchy has a single `h1` and no skipped levels, focus indicators are visible on every focusable element, and both themes meet 4.5:1 on body and muted text.
  - _Requirements: 12.1, 12.2, 12.5, 12.6, 11.5_

- [x] 22. Meet the performance budget
  - Run Lighthouse against the production build and raise performance to at least 95 on mobile emulation.
  - Confirm first-load JS is under 100 KB gzipped, all images carry explicit dimensions and use a modern format, and CLS is under 0.1.
  - _Requirements: 14.1, 14.2, 14.3, 14.5_

- [x] 23. Add the CI/CD workflow
  - Create `.github/workflows/deploy.yml` running on push to `main`: install, lint, typecheck, test, build, then publish `out/`.
  - Ensure a failure in any step aborts before the publish step.
  - Configure the GitHub Pages deploy path, and include the S3 + CloudFront alternative as a commented block.
  - _Requirements: 15.2, 15.3, 15.4_

- [x] 24. Write the README
  - Document local development, how to update `src/content/resume.ts`, how to replace the CV PDF, how to deploy, and the manual keyboard-accessibility checklist.
  - _Requirements: 15.5_
