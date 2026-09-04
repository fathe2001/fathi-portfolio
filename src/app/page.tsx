/**
 * Page — assembles all content sections from the resume data.
 *
 * Layout:
 *   ≥ 1024 px  asymmetric two-column: sticky 240 px left rail (Nav +
 *              ThemeToggle) + fluid content column (max ~68ch)
 *   768–1023 px  single column; Nav renders its own horizontal top bar
 *   < 768 px   single column; Nav renders its own disclosure button
 *
 * Section order is driven by the registry (Req 8.1, 1.3): only sections
 * with non-empty content arrays are rendered and listed in the nav.
 *
 * Req 10.1 — all content legible at 320–2560 px
 * Req 10.2 — no horizontal overflow at any supported width
 * Req 10.3 — 16 px minimum body font (set in globals.css)
 * Req 10.4 — interactive targets ≥ 44 × 44 px (enforced per-component)
 */

import { resume } from '@/content/resume';
import { buildSections } from '@/lib/sections';
import { Nav } from '@/components/layout/Nav';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { Hero } from '@/components/sections/Hero';
import { About } from '@/components/sections/About';
import { Experience } from '@/components/sections/Experience';
import { Skills } from '@/components/sections/Skills';
import { Projects } from '@/components/sections/Projects';
import { Education } from '@/components/sections/Education';
import { Courses } from '@/components/sections/Courses';
import { Contact } from '@/components/sections/Contact';

export default function Page() {
  const sections = buildSections(resume);

  /**
   * Req 13.3 — Person JSON-LD with name, job title, alma mater, and profile
   * links. Derived from resume data so it stays in sync automatically.
   */
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: resume.profile.name,
    jobTitle: resume.profile.headline,
    alumniOf: {
      '@type': 'CollegeOrUniversity',
      name: resume.education.institution,
    },
    sameAs: resume.contact
      .filter((c) => c.kind === 'linkedin' || c.kind === 'github')
      .map((c) => c.href),
    url: 'https://fathi-zidan.github.io',
  };

  return (
    /*
     * overflow-x-hidden on the outer wrapper guarantees Req 10.2 at every
     * breakpoint. min-h-screen gives the left rail something to fill.
     */
    <div className="overflow-x-hidden min-h-screen">
      {/*
       * lg:flex creates the two-column layout on desktop.
       * On narrower viewports the children stack vertically and the Nav
       * renders its own top-bar / disclosure-button variants.
       */}
      <div className="lg:flex lg:items-start">

        {/* ── Left rail ───────────────────────────────────────────────── */}
        {/*
         * lg:sticky lg:top-0 lg:h-screen keeps the rail fixed while the
         * content column scrolls. flex-col + justify-between pushes the
         * ThemeToggle to the bottom of the rail on desktop (Req 11.2).
         *
         * On mobile/tablet the rail is non-sticky and the Nav renders its
         * own sticky top bar internally.
         */}
        <aside
          aria-label="Site navigation"
          className="lg:w-[240px] lg:shrink-0 lg:sticky lg:top-0 lg:h-screen lg:flex lg:flex-col lg:justify-between lg:py-10 lg:pl-8 lg:pr-4 lg:border-r lg:border-rule"
        >
          {/*
           * On mobile/tablet, wrap Nav + ThemeToggle in a relative container
           * so the toggle can be positioned at the top-right of the same
           * sticky bar the Nav renders. On desktop (lg+) Nav fills the top
           * portion of the rail and the toggle sits at the bottom.
           */}
          <div className="relative lg:contents">
            <Nav sections={sections} />

            {/* ThemeToggle — positioned in the top-right of the Nav bar on
                mobile/tablet, and as a standalone element below the nav
                links on desktop. Both instances use absolute/flex placement
                to avoid pushing content around.
                Req 10.4 — 44×44 px touch target enforced inside ThemeToggle */}
            <div
              className={[
                /* Mobile/tablet: absolute top-right inside the sticky Nav bar */
                'absolute top-0 right-4 z-40',
                'flex items-center',
                'h-[53px]', /* matches Nav mobile bar height */
                /* Desktop: hidden here — rendered in the aside's flex column below */
                'lg:hidden',
              ].join(' ')}
            >
              <ThemeToggle />
            </div>
          </div>

          {/* Desktop-only ThemeToggle at the bottom of the left rail */}
          <div className="hidden lg:flex justify-start pl-1 pb-2">
            <ThemeToggle />
          </div>
        </aside>

        {/* ── Content column ──────────────────────────────────────────── */}
        {/*
         * min-w-0 prevents the flex child from overflowing its container.
         * px padding provides breathing room; the content width is capped
         * so lines stay readable at large viewports.
         * pb-24 gives generous bottom space after the last section.
         */}
        <div className="flex-1 min-w-0 px-5 sm:px-8 lg:px-12 xl:px-16 max-w-3xl pb-24">

          {/* Hero — no <Section> wrapper (has no h2); id is required for
              scroll-spy IntersectionObserver in Nav.tsx */}
          <div id="hero">
            <Hero profile={resume.profile} contact={resume.contact} />
          </div>

          {/* Sections in registry order — each wraps itself in <Section>
              with id, h2, and aria-labelledby (Req 12.4) */}
          <About profile={resume.profile} />

          {resume.experience.length > 0 && (
            <Experience entries={resume.experience} />
          )}

          {resume.skills.length > 0 && (
            <Skills groups={resume.skills} />
          )}

          {resume.projects.length > 0 && (
            <Projects projects={resume.projects} />
          )}

          <Education education={resume.education} />

          {resume.courses.length > 0 && (
            <Courses courses={resume.courses} />
          )}

          {resume.contact.length > 0 && (
            <Contact contact={resume.contact} />
          )}
        </div>
      </div>

      {/* Req 13.3 — Person JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  );
}
