/**
 * Automated accessibility audit — Req 12.6
 *
 * Renders each section component (and a full-page composition) through
 * jest-axe / axe-core and asserts zero critical or serious violations.
 *
 * What is covered here:
 *   - Req 12.1  Single h1 per page, heading hierarchy has no skipped levels
 *   - Req 12.2  Visible focus indicator on every focusable element
 *               (focus-visible:ring classes; structural check only — browser
 *               CSS rendering is outside jsdom scope but the markup is verified)
 *   - Req 12.4  Every content section is a <section aria-labelledby> landmark
 *   - Req 12.6  Zero critical or serious axe violations
 *   - Req 11.5  WCAG AA contrast 4.5:1 for body and muted text (verified
 *               analytically in task 21 — see contrast rationale below)
 *
 * Why section-by-section rather than a full page render:
 *   Nav and ThemeToggle are 'use client' components that rely on DOM APIs
 *   (IntersectionObserver, localStorage, matchMedia) which are not available
 *   in jsdom. Rendering them would require heavy mocking that obscures real
 *   violations. The section components contain all the content markup and
 *   are the correct scope for heading-hierarchy and landmark testing.
 *
 * Contrast rationale (Req 11.5) — calculated with the WCAG relative-luminance
 * formula. All values exceed 4.5:1 (AA):
 *
 *   Light theme
 *     --text  #16191C on --bg #FAFAF8  →  16.89 : 1  ✓
 *     --muted #5A6169 on --bg #FAFAF8  →   6.00 : 1  ✓
 *
 *   Dark theme
 *     --text  #E7E9E6 on --bg #121417  →  15.11 : 1  ✓
 *     --muted #99A1A8 on --bg #121417  →   7.04 : 1  ✓
 */

import { render } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import { expect } from "vitest";

// Extend Vitest's expect with the jest-axe matcher.
expect.extend(toHaveNoViolations);

// Section components
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Experience } from "@/components/sections/Experience";
import { Skills } from "@/components/sections/Skills";
import { Projects } from "@/components/sections/Projects";
import { Education } from "@/components/sections/Education";
import { Courses } from "@/components/sections/Courses";
import { Contact } from "@/components/sections/Contact";

// Shared test fixtures — minimal but realistic
import type {
  Profile,
  ContactLink,
  ExperienceEntry,
  SkillGroup,
  Project,
  Education as EducationType,
  Course,
} from "@/content/schema";

const profile: Profile = {
  name: "Fathi Zidan",
  headline: "Computer Science Graduate — Software, Cloud & Systems",
  summary:
    "CS graduate with production engineering experience at Dynamic Yield. Skilled in cloud infrastructure, automation, and software development.",
  location: "Tel Aviv, Israel",
  statusLine: ["HUJI B.Sc. '26", "Cloud & Systems", "Tel Aviv, Israel"],
  highlights: [
    "Maintained production infrastructure at Dynamic Yield.",
    "Tutored Python to 30+ university students.",
    "Fluent in Arabic, Hebrew, and English.",
  ],
  languages: [
    { name: "Arabic", level: "Native" },
    { name: "Hebrew", level: "Fluent" },
    { name: "English", level: "Fluent" },
  ],
};

const contact: ContactLink[] = [
  { kind: "email", label: "fathi@example.com", href: "mailto:fathi@example.com" },
  { kind: "phone", label: "+972-00-000-0000", href: "tel:+972000000000" },
  {
    kind: "linkedin",
    label: "linkedin.com/in/fathi-zidan",
    href: "https://linkedin.com/in/fathi-zidan",
  },
  { kind: "github", label: "github.com/fathi-zidan", href: "https://github.com/fathi-zidan" },
  { kind: "cv", label: "Download CV", href: "/fathi-zidan-cv.pdf", primary: true },
];

const experience: ExperienceEntry[] = [
  {
    id: "dynamic-yield",
    company: "Dynamic Yield (a Mastercard company)",
    role: "Platform Operations Engineer",
    location: "Tel Aviv, Israel",
    start: "2023-09",
    end: "2025-02",
    achievements: [
      "Monitored and maintained production infrastructure across AWS.",
      "Developed Python and Bash automation scripts.",
    ],
    technologies: ["AWS", "Docker", "Python", "Bash"],
  },
  {
    id: "atidim",
    company: "Atidim Program",
    role: "Python Tutor",
    location: "Remote",
    start: "2022-08",
    end: null,
    achievements: ["Delivered Python tutoring to 30+ students."],
  },
];

const skills: SkillGroup[] = [
  { label: "Languages", items: ["Python", "C", "Java", "Bash"] },
  { label: "Cloud & DevOps", items: ["AWS", "Docker", "Linux"] },
];

const projects: Project[] = [
  {
    id: "log-analysis",
    name: "Log Analysis & Automation Tool",
    description: "Automated log parsing and analysis tool.",
    technologies: ["Python", "Bash", "OpenSearch"],
  },
  {
    id: "alert-hub",
    name: "Alert Hub",
    description: "Microservices notification system.",
    technologies: ["Docker", "Python"],
    repoUrl: "https://github.com/fathi-zidan/alert-hub",
  },
];

const education: EducationType = {
  degree: "B.Sc. in Computer Science",
  institution: "The Hebrew University of Jerusalem",
  graduationYear: 2026,
  coursework: ["Algorithms", "Operating Systems", "Machine Learning"],
};

const courses: Course[] = [
  {
    title: "Microservices Development & DevOps",
    provider: "MS&T",
    year: 2025,
    status: "completed",
    durationHours: 250,
    projectNote: "Built Alert Hub microservices notification system",
  },
  {
    title: "AI Engineer Career Accelerator Program",
    provider: "Hasoub",
    year: 2026,
    status: "in-progress",
  },
];

// ---------------------------------------------------------------------------
// Axe configuration — suppress colour-contrast rule because jsdom does not
// compute CSS custom property values. Contrast is verified analytically above.
// ---------------------------------------------------------------------------
const axeConfig = {
  rules: {
    "color-contrast": { enabled: false },
  },
};

// ---------------------------------------------------------------------------
// Individual section tests (Req 12.6)
// ---------------------------------------------------------------------------

describe("Accessibility — Hero section (Req 12.1, 12.4, 12.6)", () => {
  it("has no critical or serious axe violations", async () => {
    const { container } = render(
      // Hero is not inside a <main>; wrap in a landmark to satisfy the
      // "all page content must be contained in landmarks" rule.
      <main>
        <Hero profile={profile} contact={contact} />
      </main>
    );
    const results = await axe(container, axeConfig);
    expect(results).toHaveNoViolations();
  });

  it("renders a single h1 containing the name (Req 12.1)", () => {
    const { container } = render(
      <main>
        <Hero profile={profile} contact={contact} />
      </main>
    );
    const h1s = container.querySelectorAll("h1");
    expect(h1s).toHaveLength(1);
    expect(h1s[0].textContent).toBe("Fathi Zidan");
  });
});

describe("Accessibility — About section (Req 12.4, 12.6)", () => {
  it("has no critical or serious axe violations", async () => {
    const { container } = render(
      <main>
        <About profile={profile} />
      </main>
    );
    const results = await axe(container, axeConfig);
    expect(results).toHaveNoViolations();
  });

  it("wraps content in a <section> with aria-labelledby (Req 12.4)", () => {
    const { container } = render(
      <main>
        <About profile={profile} />
      </main>
    );
    const section = container.querySelector('section[aria-labelledby="about-heading"]');
    expect(section).not.toBeNull();
    const heading = container.querySelector("#about-heading");
    expect(heading?.tagName).toBe("H2");
  });
});

describe("Accessibility — Experience section (Req 12.4, 12.6)", () => {
  it("has no critical or serious axe violations", async () => {
    const { container } = render(
      <main>
        <Experience entries={experience} />
      </main>
    );
    const results = await axe(container, axeConfig);
    expect(results).toHaveNoViolations();
  });
});

describe("Accessibility — Skills section (Req 12.4, 12.6)", () => {
  it("has no critical or serious axe violations", async () => {
    const { container } = render(
      <main>
        <Skills groups={skills} />
      </main>
    );
    const results = await axe(container, axeConfig);
    expect(results).toHaveNoViolations();
  });
});

describe("Accessibility — Projects section (Req 12.4, 12.6)", () => {
  it("has no critical or serious axe violations", async () => {
    const { container } = render(
      <main>
        <Projects projects={projects} />
      </main>
    );
    const results = await axe(container, axeConfig);
    expect(results).toHaveNoViolations();
  });

  it('external links have rel="noopener noreferrer" (Req 6.5)', () => {
    const { container } = render(
      <main>
        <Projects projects={projects} />
      </main>
    );
    const externalLinks = container.querySelectorAll('a[target="_blank"]');
    externalLinks.forEach((link) => {
      expect(link.getAttribute("rel")).toContain("noopener");
      expect(link.getAttribute("rel")).toContain("noreferrer");
    });
  });
});

describe("Accessibility — Education section (Req 12.4, 12.6)", () => {
  it("has no critical or serious axe violations", async () => {
    const { container } = render(
      <main>
        <Education education={education} />
      </main>
    );
    const results = await axe(container, axeConfig);
    expect(results).toHaveNoViolations();
  });

  it("uses correct heading levels — h2 section, h3 degree, h4 coursework (Req 12.1)", () => {
    const { container } = render(
      <main>
        <Education education={education} />
      </main>
    );
    expect(container.querySelector("h2")).not.toBeNull();
    expect(container.querySelector("h3")).not.toBeNull();
    expect(container.querySelector("h4")).not.toBeNull();
    // Verify there is no h5 (no skipped levels downward either)
    expect(container.querySelector("h5")).toBeNull();
  });
});

describe("Accessibility — Courses section (Req 12.4, 12.6)", () => {
  it("has no critical or serious axe violations", async () => {
    const { container } = render(
      <main>
        <Courses courses={courses} />
      </main>
    );
    const results = await axe(container, axeConfig);
    expect(results).toHaveNoViolations();
  });
});

describe("Accessibility — Contact section (Req 12.4, 12.6)", () => {
  it("has no critical or serious axe violations", async () => {
    const { container } = render(
      <main>
        <Contact contact={contact} />
      </main>
    );
    const results = await axe(container, axeConfig);
    expect(results).toHaveNoViolations();
  });
});

// ---------------------------------------------------------------------------
// Composed page — heading hierarchy (Req 12.1)
// ---------------------------------------------------------------------------

describe("Accessibility — Full page composition (Req 12.1, 12.6)", () => {
  it("has exactly one h1 across all sections", () => {
    const { container } = render(
      <main id="main-content">
        <div id="hero">
          <Hero profile={profile} contact={contact} />
        </div>
        <About profile={profile} />
        <Experience entries={experience} />
        <Skills groups={skills} />
        <Projects projects={projects} />
        <Education education={education} />
        <Courses courses={courses} />
        <Contact contact={contact} />
      </main>
    );
    const h1s = container.querySelectorAll("h1");
    expect(h1s).toHaveLength(1);
  });

  it("has no h3 without a preceding h2 at the same subtree depth (no skipped levels, Req 12.1)", () => {
    const { container } = render(
      <main id="main-content">
        <div id="hero">
          <Hero profile={profile} contact={contact} />
        </div>
        <About profile={profile} />
        <Experience entries={experience} />
        <Skills groups={skills} />
        <Projects projects={projects} />
        <Education education={education} />
        <Courses courses={courses} />
        <Contact contact={contact} />
      </main>
    );
    // Collect all headings in document order and verify no level is skipped.
    const headings = Array.from(container.querySelectorAll("h1,h2,h3,h4,h5,h6"));
    const levels = headings.map((h) => parseInt(h.tagName.slice(1), 10));

    for (let i = 1; i < levels.length; i++) {
      // The heading level may stay the same, go up (smaller number), or go
      // down by exactly 1.  A jump of 2+ is a skipped level (e.g. h2 → h4).
      const delta = levels[i] - levels[i - 1];
      expect(delta).toBeLessThanOrEqual(1);
    }
  });

  it("has no critical or serious axe violations on the full composition (Req 12.6)", async () => {
    const { container } = render(
      <main id="main-content">
        <div id="hero">
          <Hero profile={profile} contact={contact} />
        </div>
        <About profile={profile} />
        <Experience entries={experience} />
        <Skills groups={skills} />
        <Projects projects={projects} />
        <Education education={education} />
        <Courses courses={courses} />
        <Contact contact={contact} />
      </main>
    );
    const results = await axe(container, axeConfig);
    expect(results).toHaveNoViolations();
  });
});

// ---------------------------------------------------------------------------
// Focus indicator presence — structural check (Req 12.2)
// ---------------------------------------------------------------------------

describe("Accessibility — Focus indicator markup (Req 12.2)", () => {
  it("Hero CTAs have focus-visible ring classes", () => {
    const { container } = render(
      <main>
        <Hero profile={profile} contact={contact} />
      </main>
    );
    const links = container.querySelectorAll("a");
    // Both CTAs (Download CV and Get in touch) should carry focus-visible styling.
    const ctaLinks = Array.from(links).filter((a) =>
      a.textContent?.match(/download cv|get in touch/i)
    );
    expect(ctaLinks.length).toBeGreaterThanOrEqual(1);
    ctaLinks.forEach((link) => {
      expect(link.className).toMatch(/focus-visible/);
    });
  });

  it("Contact links have focus-visible ring classes (Req 12.2)", () => {
    const { container } = render(
      <main>
        <Contact contact={contact} />
      </main>
    );
    const links = container.querySelectorAll("a");
    expect(links.length).toBeGreaterThan(0);
    links.forEach((link) => {
      expect(link.className).toMatch(/focus-visible|focus:/);
    });
  });

  it("ExternalLink always has focus-visible ring (Req 12.2)", () => {
    const { container } = render(
      <main>
        <Projects projects={projects.filter((p) => p.repoUrl)} />
      </main>
    );
    const externalLinks = container.querySelectorAll('a[target="_blank"]');
    externalLinks.forEach((link) => {
      expect(link.className).toMatch(/focus-visible/);
    });
  });
});
