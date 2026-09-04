/**
 * Skills section — renders skill groups by category.
 *
 * Each group label is a subheading; its items are rendered as Chip components.
 * No proficiency indicators (Req 5.3). Collapses to single column below 640px (Req 5.4).
 */

import { Section } from "@/components/layout/Section";
import { Chip } from "@/components/ui/Chip";
import type { SkillGroup } from "@/content/schema";

interface SkillsProps {
  groups: SkillGroup[];
}

export function Skills({ groups }: SkillsProps) {
  if (groups.length === 0) return null;

  return (
    <Section id="skills" title="Skills">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        {groups.map((group) => (
          <div key={group.label}>
            <h3 className="text-title mb-3">{group.label}</h3>
            <div className="flex flex-wrap gap-2">
              {group.items.map((item) => (
                <Chip key={item}>{item}</Chip>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
