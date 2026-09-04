# Fathi Zidan — Portfolio

Personal portfolio site for Fathi Zidan (Computer Science Graduate — Software, Cloud & Systems).

Built as a statically exported [Next.js 15](https://nextjs.org/) (App Router) site with TypeScript in strict mode, Tailwind CSS v4, and self-hosted fonts. There is no runtime data fetching, no API, and no backend — the entire site renders from a single typed content module and exports to plain HTML/CSS/JS.

## Tech stack

- **Framework:** Next.js 15 (App Router) with `output: 'export'`
- **Language:** TypeScript (strict)
- **Styling:** Tailwind CSS v4 with semantic design tokens
- **Fonts:** Space Grotesk and Source Sans 3, self-hosted via `next/font/local`
- **Testing:** Vitest + React Testing Library, with `jest-axe` for accessibility
- **Hosting:** GitHub Pages (default) or S3 + CloudFront (alternative)

## Prerequisites

- Node.js 20 or newer
- npm (bundled with Node.js)

## Local development

Install dependencies:

```bash
npm install
```

Start the dev server (defaults to <http://localhost:3000>):

```bash
npm run dev
```

Other useful scripts:

```bash
npm run lint       # ESLint + Prettier format check
npm run typecheck  # tsc --noEmit
npm test           # Vitest run (unit, component, and a11y tests)
npm run build      # Production build → static export in out/
```

`npm run build` writes the static site to the `out/` directory. That directory is what gets deployed — it contains everything needed to serve the site from any static host.

## Updating the content

All résumé content lives in a single typed module: **`src/content/resume.ts`**. This is the source of truth for the entire site — no résumé text lives inside components, so editing this one file updates the whole page.

The shapes are defined and enforced by **`src/content/schema.ts`**. Because the content is typed against that schema, `npm run typecheck` (and the build) will catch mistakes like a missing field or a mistyped skill-group label.

Common edits:

- **Profile / hero:** update the `profile` object (`name`, `headline`, `summary`, `location`, `statusLine`, `highlights`, `languages`). Note `statusLine` must have exactly three facts and `summary` should stay at or under ~60 words.
- **Contact links:** edit the `contact` array. Each entry has a `kind` (`email`, `phone`, `linkedin`, `github`, or `cv`) and an `href` (`mailto:`, `tel:`, `https:`, or a `/`-relative path into `public/`).
- **Experience:** edit the `experience` array. Dates use the sortable `YYYY-MM` format; set `end` to `null` to render "Present". Entries are sorted by start date automatically — array order does not matter.
- **Skills:** edit the `skills` array. The `label` must be one of the fixed group names in the schema.
- **Projects:** edit the `projects` array. `repoUrl` and `liveUrl` are optional — omit `repoUrl` and no repository link renders.
- **Education & courses:** edit the `education` object and `courses` array. A course with `status: 'in-progress'` shows an "In progress" marker instead of a year.

After editing, run `npm run typecheck` and `npm test` to confirm everything still holds, then `npm run build` to regenerate the export.

> The content module includes a build-time assertion that every internal `href` starting with `/` resolves to a real file in `public/`. If you reference a file that is missing, the build fails — this is intentional and catches a missing CV PDF before deploy.

## Replacing the CV PDF

The downloadable CV lives at **`public/fathi-zidan-cv.pdf`** and is linked from the hero and contact sections.

To replace it:

1. Drop the new PDF into `public/`.
2. Either keep the filename `fathi-zidan-cv.pdf` (simplest — no other change needed), or use a new filename and update the matching `cv` entry's `href` in `src/content/resume.ts`.
3. Run `npm run build`. If the `href` and the file don't match, the build-time assertion will fail — that's the safety net working.

Anything placed in `public/` is served from the site root, so `public/fathi-zidan-cv.pdf` is available at `/fathi-zidan-cv.pdf`.

## Deployment

`npm run build` with `output: 'export'` produces the `out/` directory. Both deployment paths below consume that same static export; only the publish step differs.

### Default — GitHub Pages

A GitHub Actions workflow runs on every push to `main`:

```
checkout → setup Node → npm ci → npm run lint → npm run typecheck → npm test → npm run build → upload out/ as a Pages artifact → deploy
```

Every gating step (`lint`, `typecheck`, `test`, `build`) must pass before the publish step runs. If any step fails, the workflow stops before deploying, so a broken build never ships.

To enable it: in the repository settings, set **Pages → Build and deployment → Source** to **GitHub Actions**.

### Alternative — S3 + CloudFront

For AWS hosting, keep the same gating steps and swap the publish step for:

```bash
aws s3 sync out/ s3://$BUCKET --delete
aws cloudfront create-invalidation --distribution-id $DISTRIBUTION_ID --paths "/*"
```

Prefer short-lived credentials from a GitHub OIDC role over long-lived access keys.

## Manual keyboard-accessibility checklist

Automated `axe` checks run as part of `npm test`, but keyboard behavior needs a manual pass. Before each release, tab through the live site and confirm:

- [ ] **Skip link is first.** The very first `Tab` press focuses the "Skip to content" link, and activating it jumps focus to the main content region.
- [ ] **Focus is visible on every stop.** Every focusable element (links, buttons, the theme toggle, nav items) shows a clear focus indicator as you tab through.
- [ ] **Navigation is reachable and operable.** Every nav item can be reached by keyboard and activated with `Enter`, moving to the correct section.
- [ ] **No focus trap.** Focus never gets stuck — you can `Tab` forward through the whole page and `Shift+Tab` back out again without getting caught in any component.
