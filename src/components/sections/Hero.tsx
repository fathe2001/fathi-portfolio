/**
 * Hero — first-viewport section.
 *
 * - `profile.name` is the single <h1> on the page (Req 2.1, 2.6, 12.1).
 * - Headline, three-fact status line, and two CTAs below (Req 2.2, 2.3, 2.4).
 * - One-time settle animation on the <h1>, gated behind the CSS
 *   `@media (prefers-reduced-motion: no-preference)` rule (Req 12.5).
 * - Server component — no 'use client' needed.
 */

import type { Profile, ContactLink } from '@/content/schema';

interface HeroProps {
  profile: Profile;
  contact: ContactLink[];
}

export function Hero({ profile, contact }: HeroProps) {
  const cvLink = contact.find((c) => c.kind === 'cv');

  return (
    <div className="py-16 md:py-24">
      {/* Name — <h1>, clamped display size, tight tracking (Req 2.1) */}
      <h1 className="text-name animate-hero-settle mb-4">
        {profile.name}
      </h1>

      {/* Positioning headline (Req 2.2) */}
      <p className="text-title text-muted mb-6 max-w-measure">
        {profile.headline}
      </p>

      {/* Three-fact status line (Req 2.3) */}
      <p className="text-meta mb-10" aria-label="Status">
        {profile.statusLine[0]}
        <span aria-hidden="true" className="mx-2 text-rule">·</span>
        {profile.statusLine[1]}
        <span aria-hidden="true" className="mx-2 text-rule">·</span>
        {profile.statusLine[2]}
      </p>

      {/* CTAs (Req 2.4) */}
      <div className="flex flex-wrap gap-4">
        {cvLink && (
          <a
            href={cvLink.href}
            download
            className="inline-flex items-center justify-center min-h-[44px] min-w-[44px] px-6 py-2.5 rounded-sm bg-signal text-bg font-semibold text-[0.9375rem] hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-signal focus-visible:ring-offset-2 focus-visible:ring-offset-bg transition-opacity"
          >
            {cvLink.label}
          </a>
        )}

        <a
          href="#contact"
          className="inline-flex items-center justify-center min-h-[44px] min-w-[44px] px-6 py-2.5 rounded-sm border border-signal text-signal font-semibold text-[0.9375rem] hover:bg-signal hover:text-bg focus:outline-none focus-visible:ring-2 focus-visible:ring-signal focus-visible:ring-offset-2 focus-visible:ring-offset-bg transition-colors"
        >
          Get in touch
        </a>
      </div>
    </div>
  );
}
