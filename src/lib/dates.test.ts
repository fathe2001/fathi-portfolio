// src/lib/dates.test.ts
import { describe, it, expect } from 'vitest';
import { formatDateRange, byStartDesc } from './dates';
import type { ExperienceEntry } from '@/content/schema';

// Minimal stub factory — only `start` matters for sorting tests.
function makeEntry(id: string, start: string, end: string | null = null): ExperienceEntry {
  return {
    id,
    company: 'Company',
    role: 'Role',
    location: 'Location',
    start,
    end,
    achievements: [],
  };
}

describe('formatDateRange', () => {
  it('formats a range where end is null as "Present"', () => {
    expect(formatDateRange('2022-08', null)).toBe('Aug 2022 – Present');
  });

  it('formats a range with both dates', () => {
    expect(formatDateRange('2023-09', '2025-02')).toBe('Sep 2023 – Feb 2025');
  });

  it('handles a year-boundary range (Dec → Jan)', () => {
    expect(formatDateRange('2024-12', '2025-01')).toBe('Dec 2024 – Jan 2025');
  });

  it('handles a single-month range (same start and end)', () => {
    expect(formatDateRange('2024-06', '2024-06')).toBe('Jun 2024 – Jun 2024');
  });

  it('formats January correctly (month index 1)', () => {
    expect(formatDateRange('2023-01', '2023-12')).toBe('Jan 2023 – Dec 2023');
  });
});

describe('byStartDesc', () => {
  it('places the more recent entry first regardless of input order', () => {
    const entries = [
      makeEntry('older', '2022-08'),
      makeEntry('newer', '2023-09'),
    ];
    const sorted = [...entries].sort(byStartDesc);
    expect(sorted[0].id).toBe('newer');
    expect(sorted[1].id).toBe('older');
  });

  it('produces the same order regardless of initial array order', () => {
    const a = makeEntry('a', '2023-09');
    const b = makeEntry('b', '2022-08');
    const c = makeEntry('c', '2024-01');

    const order1 = [a, b, c].sort(byStartDesc).map((e) => e.id);
    const order2 = [c, a, b].sort(byStartDesc).map((e) => e.id);
    const order3 = [b, c, a].sort(byStartDesc).map((e) => e.id);

    expect(order1).toEqual(['c', 'a', 'b']);
    expect(order2).toEqual(order1);
    expect(order3).toEqual(order1);
  });

  it('handles entries in the same month as equal (stable within month)', () => {
    const e1 = makeEntry('x', '2023-05');
    const e2 = makeEntry('y', '2023-05');
    const result = byStartDesc(e1, e2);
    expect(result).toBe(0);
  });
});
