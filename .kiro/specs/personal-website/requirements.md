# Requirements Document

## Introduction

A personal portfolio website for **Fathi Zidan**, a Computer Science graduate (Hebrew University of Jerusalem) with production engineering experience at Dynamic Yield (a Mastercard company).

The site's primary job is to convert a recruiter or hiring manager who has 30 seconds into someone who reads the whole page and then either downloads the CV or sends a message. Secondary audiences are peers, meetup contacts, and course cohort members.

It is a **static, content-driven single-page site** with anchor navigation. All résumé content lives in one typed data file so the site is updated by editing data, never markup. There is no backend, no database, and no user accounts.

**Non-goals for v1:** blog engine, CMS, comments, analytics dashboards, multi-user features, server-side rendering.

---

## Requirement 1: Content Data Layer

**User Story:** As the site owner, I want all my résumé content stored in a single typed data file, so that I can update my website by editing one file without touching any component code.

### Acceptance Criteria

1. THE SYSTEM SHALL store all résumé content (profile, experience, skills, education, projects, courses, contact) in a single source-of-truth module at `src/content/resume.ts`.
2. THE SYSTEM SHALL define TypeScript interfaces for every content entity, so that a malformed entry fails at build time.
3. WHEN a content array is empty THEN the system SHALL omit that section from the rendered page rather than rendering an empty heading.
4. WHEN a new experience or project entry is appended to the data file THEN the system SHALL render it without any change to component code.
5. THE SYSTEM SHALL NOT hardcode any résumé text inside JSX components.

---

## Requirement 2: Hero Section

**User Story:** As a recruiter landing on the site, I want to know within five seconds who this person is and what they do, so that I can decide whether to keep reading.

### Acceptance Criteria

1. THE SYSTEM SHALL display the full name "Fathi Zidan" as the dominant visual element of the first viewport.
2. THE SYSTEM SHALL display the positioning line "Computer Science Graduate — Software, Cloud & Systems" directly beneath the name.
3. THE SYSTEM SHALL display a status line with three facts: education status, current focus, and location.
4. THE SYSTEM SHALL display two primary actions in the hero: "Download CV" and "Get in touch".
5. WHEN the viewport is at the top of the page THEN the system SHALL render the hero without requiring the user to scroll to read the name, role, and both actions.
6. THE SYSTEM SHALL render the hero content as real text in the HTML, never as an image.

---

## Requirement 3: About Section

**User Story:** As a hiring manager, I want a short narrative summary, so that I understand the candidate's strengths beyond a bullet list.

### Acceptance Criteria

1. THE SYSTEM SHALL render a summary paragraph of no more than 60 words derived from the CV summary.
2. THE SYSTEM SHALL render a short list of highlights covering: production systems experience, teaching experience, and language proficiency (Arabic, Hebrew, English).
3. THE SYSTEM SHALL constrain the summary text to a measure of at most 72 characters per line.

---

## Requirement 4: Experience Section

**User Story:** As a recruiter, I want to see each role with its company, dates, and concrete achievements, so that I can assess seniority and impact.

### Acceptance Criteria

1. THE SYSTEM SHALL render each experience entry with company, role title, location, start date, and end date.
2. THE SYSTEM SHALL render experience entries in reverse-chronological order derived from the data, not from array order.
3. WHEN an entry has no end date THEN the system SHALL render "Present" in its place.
4. THE SYSTEM SHALL render each entry's achievement bullets as a list.
5. THE SYSTEM SHALL render an optional technology tag list per entry when the entry supplies one.
6. THE SYSTEM SHALL render the two known roles: Dynamic Yield — Platform Operations Engineer (Sep 2023 – Feb 2025, TLV), and Atidim Program — Python Tutor (Aug 2022 – Aug 2025, remote).

---

## Requirement 5: Skills Section

**User Story:** As a technical reviewer, I want skills grouped by category, so that I can scan for the specific stack I am hiring for.

### Acceptance Criteria

1. THE SYSTEM SHALL group skills into the categories: Languages, Areas, Cloud & DevOps, and Tools.
2. THE SYSTEM SHALL render each category with its label and its member skills.
3. THE SYSTEM SHALL render skills as text labels WITHOUT proficiency bars, star ratings, or percentage indicators.
4. WHEN the viewport width is below 640 px THEN the system SHALL stack skill categories in a single column.

---

## Requirement 6: Projects Section

**User Story:** As an engineer reviewing the candidate, I want to see what was actually built, so that I can judge hands-on ability.

### Acceptance Criteria

1. THE SYSTEM SHALL render each project with a name, a one-to-two sentence description, and a technology tag list.
2. WHEN a project entry supplies a repository URL THEN the system SHALL render a link to it.
3. WHEN a project entry supplies no repository URL THEN the system SHALL render the project card without a broken or placeholder link.
4. THE SYSTEM SHALL render the "Log Analysis & Automation Tool" project from the CV.
5. WHEN a link points to an external domain THEN the system SHALL open it in a new tab with `rel="noopener noreferrer"`.

---

## Requirement 7: Education, Courses & Certifications

**User Story:** As a recruiter screening for degree requirements, I want education and training clearly listed, so that I can confirm eligibility quickly.

### Acceptance Criteria

1. THE SYSTEM SHALL render the degree "B.Sc. in Computer Science", the institution "The Hebrew University of Jerusalem", and the graduation year.
2. THE SYSTEM SHALL render the key coursework list from the CV.
3. THE SYSTEM SHALL render each course or certification with its title, provider, year, and an optional duration and project note.
4. WHEN a course entry is marked as in progress THEN the system SHALL render an "In progress" status marker instead of a completion year.
5. THE SYSTEM SHALL render the "AI Engineer Career Accelerator Program — Hasoub" entry with in-progress status.

---

## Requirement 8: Navigation

**User Story:** As a visitor, I want to jump to any section, so that I can find what I care about without scrolling the whole page.

### Acceptance Criteria

1. THE SYSTEM SHALL render a navigation control listing every section present on the page.
2. WHEN a user activates a navigation item THEN the system SHALL scroll to the corresponding section.
3. WHEN a section occupies the majority of the viewport THEN the system SHALL mark its navigation item as active.
4. WHEN the viewport width is below 768 px THEN the system SHALL render navigation in a collapsed form that does not obscure page content.
5. WHEN the user has `prefers-reduced-motion: reduce` set THEN the system SHALL jump to the section without smooth-scroll animation.

---

## Requirement 9: Contact and CV Download

**User Story:** As a recruiter who wants to reach out, I want the contact details and a downloadable CV in one obvious place, so that I do not have to hunt for them.

### Acceptance Criteria

1. THE SYSTEM SHALL render the email address as a `mailto:` link.
2. THE SYSTEM SHALL render the phone number as a `tel:` link.
3. THE SYSTEM SHALL render links to LinkedIn and GitHub profiles.
4. WHEN a user activates "Download CV" THEN the system SHALL serve the PDF from `/public` with a descriptive filename.
5. THE SYSTEM SHALL NOT render the email address in a form that can be scraped as plain text without obfuscation or a mailto wrapper.
6. THE SYSTEM SHALL NOT include a contact form in v1, since there is no backend to receive submissions.

---

## Requirement 10: Responsive Layout

**User Story:** As a visitor on a phone, I want the site to be fully readable and usable, so that I get the same information as a desktop visitor.

### Acceptance Criteria

1. THE SYSTEM SHALL render all content legibly at viewport widths from 320 px to 2560 px.
2. THE SYSTEM SHALL NOT produce horizontal scrolling at any supported viewport width.
3. THE SYSTEM SHALL render body text at a minimum of 16 px on mobile viewports.
4. THE SYSTEM SHALL render every interactive target at a minimum of 44 × 44 px on touch viewports.

---

## Requirement 11: Theme

**User Story:** As a visitor, I want the site to respect my system's light or dark preference, so that it is comfortable to read.

### Acceptance Criteria

1. WHEN the user's system preference is dark THEN the system SHALL render the dark palette on first paint.
2. THE SYSTEM SHALL render a control that toggles between light and dark.
3. WHEN a user toggles the theme THEN the system SHALL persist that choice across page reloads.
4. WHEN a persisted theme choice exists THEN the system SHALL apply it before first paint WITHOUT a flash of the opposite theme.
5. THE SYSTEM SHALL meet WCAG AA contrast (4.5:1 for body text) in both themes.

---

## Requirement 12: Accessibility

**User Story:** As a visitor using a keyboard or screen reader, I want to navigate the entire site, so that I can access the same content as any other visitor.

### Acceptance Criteria

1. THE SYSTEM SHALL expose a single `<h1>` per page and a heading hierarchy with no skipped levels.
2. WHEN a user navigates with the keyboard THEN the system SHALL render a visible focus indicator on every focusable element.
3. THE SYSTEM SHALL provide a "Skip to content" link as the first focusable element.
4. THE SYSTEM SHALL wrap each content section in a landmark element with an accessible name.
5. WHEN `prefers-reduced-motion: reduce` is set THEN the system SHALL disable all non-essential animation and transitions.
6. THE SYSTEM SHALL pass an automated axe-core scan with zero critical or serious violations.

---

## Requirement 13: SEO and Metadata

**User Story:** As the site owner, I want the site to be findable and to preview well when shared, so that a link I paste into a message looks professional.

### Acceptance Criteria

1. THE SYSTEM SHALL render a `<title>` and meta description derived from the profile data.
2. THE SYSTEM SHALL render Open Graph and Twitter card tags including an image.
3. THE SYSTEM SHALL emit a `Person` JSON-LD block containing name, job title, alma mater, and profile links.
4. THE SYSTEM SHALL serve `robots.txt` and `sitemap.xml`.
5. THE SYSTEM SHALL set a canonical URL.

---

## Requirement 14: Performance

**User Story:** As a visitor on a mobile connection, I want the page to load quickly, so that I do not abandon it.

### Acceptance Criteria

1. THE SYSTEM SHALL produce a Lighthouse performance score of at least 95 on a mobile emulated run.
2. THE SYSTEM SHALL ship a first-load JavaScript bundle under 100 KB gzipped.
3. THE SYSTEM SHALL serve all images in a modern format with explicit width and height attributes.
4. THE SYSTEM SHALL self-host fonts with `font-display: swap` rather than blocking on a third-party font request.
5. THE SYSTEM SHALL produce a Cumulative Layout Shift below 0.1.

---

## Requirement 15: Build and Deployment

**User Story:** As the site owner, I want pushing to main to publish the site, so that updating my CV content takes one commit.

### Acceptance Criteria

1. THE SYSTEM SHALL build to a fully static output directory with no server runtime requirement.
2. WHEN a commit is pushed to `main` THEN the CI workflow SHALL install, lint, type-check, test, and build.
3. WHEN any CI step fails THEN the workflow SHALL fail WITHOUT publishing.
4. WHEN all CI steps pass on `main` THEN the workflow SHALL publish the static output to the hosting target.
5. THE SYSTEM SHALL include a README documenting local development, content editing, and deployment.
