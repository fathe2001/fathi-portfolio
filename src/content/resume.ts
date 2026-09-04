// src/content/resume.ts
// Single source of truth for all résumé content.
// Edit this file to update the website — no component changes needed.
//
// Req 1.1: All résumé content in a single module.
// Req 1.5: No résumé text lives in JSX.

import type {
  ResumeContent,
  Profile,
  ContactLink,
  ExperienceEntry,
  SkillGroup,
  Project,
  Education,
  Course,
} from "./schema";

// ---------------------------------------------------------------------------
// Build-time assertion: every internal href (starting with "/") must resolve
// to a real file under public/. Catches a missing CV PDF before deploy.
// Req 9.4
// ---------------------------------------------------------------------------
function assertInternalHrefsExist(links: ContactLink[]): void {
  // Only runs in a Node.js environment (build time), not in the browser.
  if (typeof window !== "undefined") return;

  // Dynamic require so bundlers don't try to include 'fs' in client bundles.
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const fs = require("fs") as typeof import("fs");
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const path = require("path") as typeof import("path");

  // process.cwd() is the project root during both `next build` and `next dev`.
  // __dirname would point to the compiled .next/server/ directory at build time.
  const publicDir = path.resolve(process.cwd(), "public");

  for (const link of links) {
    if (link.href.startsWith("/")) {
      const filePath = path.join(publicDir, link.href);
      if (!fs.existsSync(filePath)) {
        throw new Error(
          `[resume.ts] Internal href "${link.href}" does not resolve to a file in public/.\n` +
            `Expected: ${filePath}\n` +
            `Make sure the file exists before building.`
        );
      }
    }
  }
}

// ---------------------------------------------------------------------------
// Profile — Req 2.1–2.3, 3.1–3.2
// ---------------------------------------------------------------------------
const profile: Profile = {
  name: "Fathi Zidan",
  headline: "Computer Science Graduate — Software, Cloud & Systems",
  // ≤ 60 words — Req 3.1
  summary:
    "Computer Science graduate from the Hebrew University of Jerusalem with hands-on production engineering experience at Dynamic Yield (a Mastercard company). Skilled in cloud infrastructure, automation, and software development. Experienced in mentoring through the Atidim program. Strong communicator across Arabic, Hebrew, and English.",
  location: "Tel Aviv-Yafo, Israel",
  // Exactly three facts — Req 2.3
  statusLine: ["HUJI B.Sc. Computer Science '26", "Cloud & Systems", "Tel Aviv, Israel"],
  highlights: [
    "Maintained and optimised production infrastructure at Dynamic Yield (a Mastercard company), supporting millions of daily events.",
    "Tutored Python to 30+ university students through the Atidim mentoring programme over three years.",
    "Fluent in Arabic (native), Hebrew, and English — communicates across technical and cross-cultural teams.",
  ],
  languages: [
    { name: "Arabic", level: "Native" },
    { name: "Hebrew", level: "Fluent" },
    { name: "English", level: "Fluent" },
  ],
};

// ---------------------------------------------------------------------------
// Contact links — Req 9.1–9.5
// ---------------------------------------------------------------------------
const contact: ContactLink[] = [
  {
    kind: "email",
    label: "fathi.zidan@example.com",
    href: "mailto:fathi.zidan@example.com",
  },
  {
    kind: "phone",
    label: "+972 50-227-9800",
    href: "tel:+972502279800",
  },
  {
    kind: "linkedin",
    label: "linkedin.com/in/fathi-zidan",
    href: "https://linkedin.com/in/fathi-zidan",
  },
  {
    kind: "github",
    label: "github.com/fathe2001",
    href: "https://github.com/fathe2001",
  },
  {
    kind: "cv",
    label: "Download CV",
    href: "/fathi-zidan-cv.pdf",
    primary: true,
  },
];

// ---------------------------------------------------------------------------
// Experience — Req 4.1–4.6
// start/end are YYYY-MM strings: they sort lexicographically and avoid
// timezone issues. null end renders as "Present" (Req 4.3).
// ---------------------------------------------------------------------------
const experience: ExperienceEntry[] = [
  {
    id: "dynamic-yield",
    company: "Dynamic Yield (a Mastercard company)",
    role: "Platform Operations Engineer",
    location: "Tel Aviv, Israel",
    start: "2023-09",
    end: "2025-02",
    achievements: [
      "Monitored and maintained production infrastructure across AWS (EC2, S3, RDS), ensuring 99.9 % uptime for a platform processing millions of daily personalisation events.",
      "Developed Python and Bash automation scripts that reduced mean time to recovery for recurring operational incidents.",
      "Participated in on-call rotations, triaging and resolving production alerts with Grafana dashboards and OpenSearch log queries.",
      "Identified and executed cost-optimisation measures across EC2 and S3 usage, contributing to measurable cloud spend reduction.",
      "Collaborated with engineering and product teams in a Docker-based microservices environment, contributing to CI/CD pipeline improvements.",
    ],
    technologies: ["AWS (EC2, S3, RDS)", "Docker", "Python", "Bash", "Grafana", "OpenSearch"],
  },
  {
    id: "atidim",
    company: "Atidim Program",
    role: "Python Tutor",
    location: "Remote",
    start: "2022-08",
    end: "2025-08",
    achievements: [
      "Delivered one-on-one and small-group Python tutoring sessions to 30+ university students from underrepresented communities.",
      "Designed exercises covering core programming concepts: data structures, algorithms, file I/O, and object-oriented design.",
      "Tracked individual student progress and adjusted teaching methods to improve comprehension and course completion rates.",
      "Mentored students on study habits, technical interview preparation, and career path navigation in software engineering.",
    ],
  },
];

// ---------------------------------------------------------------------------
// Skills — Req 5.1–5.3
// Four groups, no proficiency indicators.
// ---------------------------------------------------------------------------
const skills: SkillGroup[] = [
  {
    label: "Languages",
    items: ["Python", "C", "C++", "Java", "Bash"],
  },
  {
    label: "Areas",
    items: [
      "Algorithms & Data Structures",
      "Software Engineering",
      "Machine Learning",
      "Operating Systems",
      "Networking",
    ],
  },
  {
    label: "Cloud & DevOps",
    items: ["AWS (EC2, S3, IAM)", "Docker", "CI/CD", "Linux"],
  },
  {
    label: "Tools",
    items: ["Git", "Grafana", "OpenSearch", "Jira"],
  },
];

// ---------------------------------------------------------------------------
// Projects — Req 6.1–6.5
// repoUrl is omitted when not public; the component must handle the absence.
// ---------------------------------------------------------------------------
const projects: Project[] = [
  {
    id: "log-analysis",
    name: "Log Analysis & Automation Tool",
    description:
      "Automated log parsing and analysis tool built during the Platform Operations role. Reduces mean time to investigate incidents by surfacing relevant log patterns from OpenSearch indices.",
    technologies: ["Python", "Bash", "OpenSearch"],
    // repoUrl intentionally absent — Req 6.3
  },
  {
    id: "alert-hub",
    name: "Alert Hub — Microservices Notification System",
    description:
      "Microservices-based notification system built as the capstone project for the Microservices Development & DevOps course. Demonstrates service isolation, inter-service communication, and container orchestration.",
    technologies: ["Docker", "Python", "CI/CD"],
    // repoUrl intentionally absent — Req 6.3
  },
];

// ---------------------------------------------------------------------------
// Education — Req 7.1–7.2
// ---------------------------------------------------------------------------
const education: Education = {
  degree: "B.Sc. in Computer Science",
  institution: "The Hebrew University of Jerusalem",
  graduationYear: 2026,
  coursework: [
    "Algorithms & Data Structures",
    "Operating Systems",
    "Computer Networks",
    "Machine Learning",
    "Software Engineering",
    "Database Systems",
    "Computer Architecture",
    "Object-Oriented Programming",
  ],
};

// ---------------------------------------------------------------------------
// Courses & Certifications — Req 7.3–7.5
// ---------------------------------------------------------------------------
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
// Assemble and export — Req 1.1
// ---------------------------------------------------------------------------

// Run the assertion at module evaluation time so Next.js fails the build if
// any internal href is broken. Safe to call before exporting.
assertInternalHrefsExist(contact);

export const resume: ResumeContent = {
  profile,
  contact,
  experience,
  skills,
  projects,
  education,
  courses,
};
