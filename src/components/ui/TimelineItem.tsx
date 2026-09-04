/**
 * TimelineItem — renders a single experience entry inside the timeline.
 *
 * Displays company, role, location + date range (meta), achievement bullets,
 * and optional technology chips. Used exclusively by the Experience section.
 */

import type { ExperienceEntry } from "@/content/schema";
import { formatDateRange } from "@/lib/dates";
import { Chip } from "@/components/ui/Chip";

interface TimelineItemProps {
  entry: ExperienceEntry;
}

export function TimelineItem({ entry }: TimelineItemProps) {
  return (
    <article>
      {/* Company and role (Req 4.1) */}
      <p className="text-meta mb-0.5">{entry.company}</p>
      <h3 className="text-title font-semibold mb-1">{entry.role}</h3>

      {/* Location and date range (Req 4.1, 4.3) */}
      <p className="text-meta text-muted mb-4">
        {entry.location}
        <span aria-hidden="true" className="mx-1.5">
          ·
        </span>
        {formatDateRange(entry.start, entry.end)}
      </p>

      {/* Achievement bullets (Req 4.4) */}
      <ul className="list-disc list-outside pl-5 space-y-1.5 mb-4 max-w-measure">
        {entry.achievements.map((achievement, i) => (
          <li key={i} className="leading-relaxed">
            {achievement}
          </li>
        ))}
      </ul>

      {/* Optional technology chips (Req 4.5) */}
      {entry.technologies && entry.technologies.length > 0 && (
        <div className="flex flex-wrap gap-1.5" aria-label="Technologies">
          {entry.technologies.map((tech) => (
            <Chip key={tech}>{tech}</Chip>
          ))}
        </div>
      )}
    </article>
  );
}
