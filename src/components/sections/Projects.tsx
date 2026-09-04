/**
 * Projects — renders each project entry with name, description,
 * technology chips, and an optional repository link.
 *
 * - Repository link is only rendered when `repoUrl` is present (Req 6.3).
 * - External links use `<ExternalLink>` which enforces `rel="noopener noreferrer"` (Req 6.5).
 * - No card shadows — layout is clean separation via spacing and hairline rules (design doc).
 * - Server component — no 'use client' needed.
 */

import type { Project } from '@/content/schema';
import { Section } from '@/components/layout/Section';
import { Chip } from '@/components/ui/Chip';
import { ExternalLink } from '@/components/ui/ExternalLink';

interface ProjectsProps {
  projects: Project[];
}

export function Projects({ projects }: ProjectsProps) {
  return (
    <Section id="projects" title="Projects">
      <div className="space-y-10">
        {projects.map((project) => (
          <article key={project.id}>
            <div className="flex items-baseline gap-4 flex-wrap mb-2">
              <h3 className="text-title">{project.name}</h3>
              {project.repoUrl && (
                <ExternalLink href={project.repoUrl} className="text-sm">
                  Repository
                </ExternalLink>
              )}
            </div>

            <p className="text-body mb-4">{project.description}</p>

            {project.technologies.length > 0 && (
              <ul
                aria-label="Technologies"
                className="flex flex-wrap gap-2 list-none p-0 m-0"
              >
                {project.technologies.map((tech) => (
                  <li key={tech}>
                    <Chip>{tech}</Chip>
                  </li>
                ))}
              </ul>
            )}
          </article>
        ))}
      </div>
    </Section>
  );
}
