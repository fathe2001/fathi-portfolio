// src/lib/sections.ts
// Section registry — single source of truth for which sections exist and
// whether they are enabled for a given resume dataset.
//
// Both page.tsx and Nav read this, so a section can never appear in the
// navigation without also appearing on the page (and vice versa).
//
// Req 1.3: a section backed by an empty array is omitted entirely.
// Req 8.1: nav items are derived from this registry, not hardcoded.

import type { ResumeContent } from "@/content/schema";

export interface SectionMeta {
  id: string;
  label: string;
  enabled: boolean;
}

/**
 * Build the ordered section list for a given resume dataset.
 * Only sections whose backing content is non-empty are returned.
 */
export function buildSections(resume: ResumeContent): SectionMeta[] {
  const sections: SectionMeta[] = [
    // Hero and About are always enabled — profile always exists.
    { id: "hero", label: "Home", enabled: true },
    { id: "about", label: "About", enabled: true },
    { id: "experience", label: "Experience", enabled: resume.experience.length > 0 },
    { id: "skills", label: "Skills", enabled: resume.skills.length > 0 },
    { id: "projects", label: "Projects", enabled: resume.projects.length > 0 },
    // Education is always enabled — degree always present.
    { id: "education", label: "Education", enabled: true },
    { id: "courses", label: "Courses", enabled: resume.courses.length > 0 },
    { id: "contact", label: "Contact", enabled: resume.contact.length > 0 },
  ];

  return sections.filter((s) => s.enabled);
}
