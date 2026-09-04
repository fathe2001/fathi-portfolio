// src/content/schema.ts
// Single source of truth for all résumé content types.
// Every component imports from here — no shapes are redeclared elsewhere.

export interface Profile {
  name: string;
  headline: string; // "Computer Science Graduate — Software, Cloud & Systems"
  summary: string; // ≤ 60 words (Req 3.1)
  location: string;
  statusLine: [string, string, string]; // exactly three facts (Req 2.3)
  highlights: string[];
  languages: { name: string; level: string }[];
}

export interface ContactLink {
  kind: 'email' | 'phone' | 'linkedin' | 'github' | 'cv';
  label: string;
  href: string; // mailto: / tel: / https: / /fathi-zidan-cv.pdf
  primary?: boolean;
}

export interface ExperienceEntry {
  id: string;
  company: string;
  role: string;
  location: string;
  start: string; // 'YYYY-MM' — sortable (Req 4.2)
  end: string | null; // null renders as "Present" (Req 4.3)
  achievements: string[];
  technologies?: string[];
}

export interface SkillGroup {
  label: 'Languages' | 'Areas' | 'Cloud & DevOps' | 'Tools';
  items: string[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  repoUrl?: string; // optional (Req 6.3)
  liveUrl?: string;
}

export interface Education {
  degree: string;
  institution: string;
  graduationYear: number;
  coursework: string[];
}

export interface Course {
  title: string;
  provider: string;
  year: number;
  status: 'completed' | 'in-progress'; // Req 7.4
  durationHours?: number;
  projectNote?: string;
}

export interface ResumeContent {
  profile: Profile;
  contact: ContactLink[];
  experience: ExperienceEntry[];
  skills: SkillGroup[];
  projects: Project[];
  education: Education;
  courses: Course[];
}
