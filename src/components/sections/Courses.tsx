/**
 * Courses — Req 7.3, 7.4, 7.5
 * Renders each course with title, provider, and either a year or an
 * outlined "In progress" marker.
 */

import { Section } from "@/components/layout/Section";
import type { Course } from "@/content/schema";

interface CoursesProps {
  courses: Course[];
}

export function Courses({ courses }: CoursesProps) {
  return (
    <Section id="courses" title="Courses & Certifications">
      <ul className="space-y-6">
        {courses.map((course, i) => (
          <li key={i}>
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <h3 className="text-title">{course.title}</h3>
                <p className="text-meta">{course.provider}</p>
              </div>
              <div className="text-meta shrink-0">
                {course.status === "in-progress" ? (
                  <span
                    className="inline-block border border-signal text-signal px-2 py-0.5 rounded text-xs font-medium"
                    aria-label="In progress"
                  >
                    In progress
                  </span>
                ) : (
                  <span>{course.year}</span>
                )}
              </div>
            </div>
            {course.durationHours && <p className="text-meta mt-1">{course.durationHours} hours</p>}
            {course.projectNote && <p className="text-meta mt-1">{course.projectNote}</p>}
          </li>
        ))}
      </ul>
    </Section>
  );
}
