/**
 * About — summary, highlights, and language proficiencies.
 *
 * - Summary paragraph constrained to 72ch (Req 3.1, 3.3).
 * - Highlights list covering production systems, teaching, and languages (Req 3.2).
 * - Language proficiencies rendered as "Name — Level" pairs.
 * - Left-aligned throughout; no centered body text (design doc).
 * - Server component — no 'use client' needed.
 */

import type { Profile } from '@/content/schema';
import { Section } from '@/components/layout/Section';

interface AboutProps {
  profile: Profile;
}

export function About({ profile }: AboutProps) {
  return (
    <Section id="about" title="About">
      {/* Summary paragraph — ≤ 60 words, ≤ 72ch measure (Req 3.1, 3.3) */}
      <p className="max-w-measure leading-relaxed mb-6">
        {profile.summary}
      </p>

      {/* Highlights list (Req 3.2) */}
      <ul className="list-disc list-outside pl-5 space-y-2 mb-8 max-w-measure">
        {profile.highlights.map((highlight, i) => (
          <li key={i} className="leading-relaxed">
            {highlight}
          </li>
        ))}
      </ul>

      {/* Language proficiencies (Req 3.2) */}
      <div>
        <h3 className="text-title mb-3">Languages</h3>
        <ul className="space-y-1">
          {profile.languages.map((lang) => (
            <li key={lang.name} className="text-meta">
              <span className="text-text font-medium">{lang.name}</span>
              {' '}
              <span aria-hidden="true">—</span>
              {' '}
              {lang.level}
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
