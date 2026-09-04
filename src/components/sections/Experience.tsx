/**
 * Experience — vertical timeline of employment entries.
 *
 * - Entries are sorted reverse-chronologically by `byStartDesc` before
 *   rendering, so array order in resume.ts never affects output (Req 4.2).
 * - A hairline left border acts as the timeline spine; each item gets a
 *   filled dot positioned on the spine (design doc).
 * - Server component — no 'use client' needed.
 */

import type { ExperienceEntry } from '@/content/schema';
import { byStartDesc } from '@/lib/dates';
import { Section } from '@/components/layout/Section';
import { TimelineItem } from '@/components/ui/TimelineItem';

interface ExperienceProps {
  entries: ExperienceEntry[];
}

export function Experience({ entries }: ExperienceProps) {
  const sorted = [...entries].sort(byStartDesc);

  return (
    <Section id="experience" title="Experience">
      <ol className="relative border-l border-rule pl-6 space-y-12">
        {sorted.map((entry) => (
          <li key={entry.id} className="relative">
            {/* Dot on the spine */}
            <span
              aria-hidden="true"
              className="absolute -left-[1.65rem] top-1.5 w-2 h-2 rounded-full bg-signal border-2 border-bg"
            />
            <TimelineItem entry={entry} />
          </li>
        ))}
      </ol>
    </Section>
  );
}
