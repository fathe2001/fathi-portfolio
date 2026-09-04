/**
 * Education — Req 7.1, 7.2
 * Renders degree, institution, graduation year, and coursework chips.
 */

import { Section } from "@/components/layout/Section";
import { Chip } from "@/components/ui/Chip";
import type { Education as EducationType } from "@/content/schema";

interface EducationProps {
  education: EducationType;
}

export function Education({ education }: EducationProps) {
  return (
    <Section id="education" title="Education">
      <div>
        <h3 className="text-title">{education.degree}</h3>
        <p className="text-meta">
          {education.institution} · {education.graduationYear}
        </p>
        {education.coursework.length > 0 && (
          <div className="mt-4">
            <h4 className="text-[0.875rem] font-semibold mb-2">Key coursework</h4>
            <div className="flex flex-wrap gap-2">
              {education.coursework.map((course) => (
                <Chip key={course}>{course}</Chip>
              ))}
            </div>
          </div>
        )}
      </div>
    </Section>
  );
}
