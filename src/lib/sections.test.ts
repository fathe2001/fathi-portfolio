// src/lib/sections.test.ts
// Unit tests for the section registry.
//
// Req 1.3: a section backed by an empty array must be excluded.
// Req 8.1: nav sections are derived from this registry.

import { describe, it, expect } from 'vitest';
import { buildSections } from './sections';
import type { ResumeContent } from '@/content/schema';

// ---------------------------------------------------------------------------
// Minimal stub helpers
// ---------------------------------------------------------------------------

/** A minimal but valid ResumeContent for testing. */
function makeResume(overrides: Partial<ResumeContent> = {}): ResumeContent {
  const base: ResumeContent = {
    profile: {
      name: 'Test User',
      headline: 'Developer',
      summary: 'A short summary.',
      location: 'Somewhere',
      statusLine: ['Fact 1', 'Fact 2', 'Fact 3'],
      highlights: [],
      languages: [],
    },
    contact: [{ kind: 'email', label: 'test@example.com', href: 'mailto:test@example.com' }],
    experience: [
      {
        id: 'job-1',
        company: 'Acme',
        role: 'Engineer',
        location: 'Remote',
        start: '2023-01',
        end: null,
        achievements: ['Did things'],
      },
    ],
    skills: [{ label: 'Languages', items: ['Python'] }],
    projects: [
      {
        id: 'proj-1',
        name: 'My Project',
        description: 'A project.',
        technologies: ['Python'],
      },
    ],
    education: {
      degree: 'B.Sc.',
      institution: 'University',
      graduationYear: 2026,
      coursework: [],
    },
    courses: [
      { title: 'Course A', provider: 'Provider', year: 2024, status: 'completed' },
    ],
  };
  return { ...base, ...overrides };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('buildSections', () => {
  it('always includes hero and about regardless of content', () => {
    const sections = buildSections(makeResume());
    const ids = sections.map((s) => s.id);
    expect(ids).toContain('hero');
    expect(ids).toContain('about');
  });

  it('excludes experience when the experience array is empty', () => {
    const sections = buildSections(makeResume({ experience: [] }));
    const ids = sections.map((s) => s.id);
    expect(ids).not.toContain('experience');
  });

  it('includes experience when the experience array is non-empty', () => {
    const sections = buildSections(makeResume());
    const ids = sections.map((s) => s.id);
    expect(ids).toContain('experience');
  });

  it('excludes skills when the skills array is empty', () => {
    const sections = buildSections(makeResume({ skills: [] }));
    expect(sections.map((s) => s.id)).not.toContain('skills');
  });

  it('excludes projects when the projects array is empty', () => {
    const sections = buildSections(makeResume({ projects: [] }));
    expect(sections.map((s) => s.id)).not.toContain('projects');
  });

  it('always includes education', () => {
    const sections = buildSections(makeResume());
    expect(sections.map((s) => s.id)).toContain('education');
  });

  it('excludes courses when the courses array is empty', () => {
    const sections = buildSections(makeResume({ courses: [] }));
    expect(sections.map((s) => s.id)).not.toContain('courses');
  });

  it('excludes contact when the contact array is empty', () => {
    const sections = buildSections(makeResume({ contact: [] }));
    expect(sections.map((s) => s.id)).not.toContain('contact');
  });

  it('returns sections in the canonical order', () => {
    const sections = buildSections(makeResume());
    const ids = sections.map((s) => s.id);
    // All sections present — verify canonical order
    expect(ids).toEqual([
      'hero',
      'about',
      'experience',
      'skills',
      'projects',
      'education',
      'courses',
      'contact',
    ]);
  });

  it('preserves order when some sections are disabled', () => {
    const sections = buildSections(makeResume({ experience: [], projects: [] }));
    const ids = sections.map((s) => s.id);
    // experience and projects should be missing; remaining order preserved
    expect(ids).toEqual(['hero', 'about', 'skills', 'education', 'courses', 'contact']);
  });

  it('returns only enabled sections (no disabled entries in output)', () => {
    const sections = buildSections(makeResume({ courses: [] }));
    expect(sections.every((s) => s.enabled)).toBe(true);
  });
});
