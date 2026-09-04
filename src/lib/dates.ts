// src/lib/dates.ts
// Date formatting and sorting utilities for experience entries.
// Uses an explicit month array for deterministic output (no locale dependency).

import type { ExperienceEntry } from '@/content/schema';

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

/**
 * Parses a YYYY-MM string into its year and short month name.
 */
function parseYYYYMM(yyyymm: string): { year: string; monthName: string } {
  const [year, month] = yyyymm.split('-');
  return { year, monthName: MONTHS[parseInt(month, 10) - 1] };
}

/**
 * Formats a date range from YYYY-MM strings.
 * Returns e.g. "Sep 2023 – Feb 2025", or "Aug 2022 – Present" when end is null.
 */
export function formatDateRange(start: string, end: string | null): string {
  const { year: startYear, monthName: startMonth } = parseYYYYMM(start);
  const startFormatted = `${startMonth} ${startYear}`;
  const endFormatted = end
    ? (() => {
        const { year, monthName } = parseYYYYMM(end);
        return `${monthName} ${year}`;
      })()
    : 'Present';
  return `${startFormatted} \u2013 ${endFormatted}`;
}

/**
 * Comparator for sorting ExperienceEntry arrays in reverse-chronological order.
 * YYYY-MM strings sort lexicographically, so a simple localeCompare works.
 */
export function byStartDesc(a: ExperienceEntry, b: ExperienceEntry): number {
  return b.start.localeCompare(a.start);
}
