/**
 * Nav — page navigation with scroll-spy.
 *
 * Layout:
 *   ≥ 1024 px  sticky left rail, ~240 px wide (Req 8.4)
 *   768–1023 px  horizontal top bar, sticky
 *   < 768 px   disclosure button that expands a push-down list (Req 8.4)
 *
 * Scroll-spy (Req 8.3):
 *   IntersectionObserver with a narrow horizontal band near the viewport
 *   centre. Whichever observed section has the highest intersectionRatio
 *   at the moment of callback is marked active.
 *
 * Smooth-scroll (Req 8.2, 8.5):
 *   Clicks call scrollIntoView with behavior: 'smooth' unless the user
 *   has prefers-reduced-motion: reduce, in which case behavior: 'auto'.
 *
 * Accessibility:
 *   <nav aria-label="Page navigation"> wraps all variants.
 *   Links are plain <a href="#id"> anchors, keyboard-reachable.
 *   Mobile toggle button has a descriptive aria-label.
 *
 * 'use client' is required for IntersectionObserver and window references.
 */

"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { SectionMeta } from "@/lib/sections";

interface NavProps {
  sections: SectionMeta[];
}

export function Nav({ sections }: NavProps) {
  const [activeId, setActiveId] = useState<string>(sections[0]?.id ?? "");
  const [mobileOpen, setMobileOpen] = useState(false);

  // Track latest ratios across observer callbacks so we can pick the winner.
  const ratioMap = useRef<Map<string, number>>(new Map());

  useEffect(() => {
    if (sections.length === 0) return;

    /**
     * rootMargin slices the viewport to a thin band just above centre:
     *   top:    -40%  — ignore the top 40 % (above the active zone)
     *   bottom: -55%  — ignore the bottom 55 % (below the active zone)
     * This leaves a 5 % band at ~45 % from the top, so the section whose
     * heading is closest to that band triggers as "active".
     */
    const observer = new IntersectionObserver(
      (entries) => {
        // Update the ratio map for each observed entry.
        entries.forEach((entry) => {
          ratioMap.current.set(entry.target.id, entry.intersectionRatio);
        });

        // Find the id with the highest ratio across ALL tracked sections.
        let bestId = "";
        let bestRatio = -1;
        ratioMap.current.forEach((ratio, id) => {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestId = id;
          }
        });

        // Only update state when there is a clear winner (ratio > 0).
        if (bestRatio > 0) {
          setActiveId(bestId);
        }
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: [0, 0.1, 0.25, 0.5, 0.75, 1.0] }
    );

    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) {
        ratioMap.current.set(s.id, 0);
        observer.observe(el);
      }
    });

    // Capture the ref value in the closure so the cleanup uses the same map
    // instance that was set up in this effect run (satisfies react-hooks lint).
    const currentMap = ratioMap.current;

    return () => {
      observer.disconnect();
      currentMap.clear();
    };
  }, [sections]);

  const handleNavClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;

    // Req 8.5 — instant jump when the user prefers reduced motion.
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });

    // Close mobile menu after navigation.
    setMobileOpen(false);
  }, []);

  // Shared link renderer used by all three layout variants.
  function NavLink({ id, label }: { id: string; label: string }) {
    const isActive = id === activeId;
    return (
      <a
        href={`#${id}`}
        onClick={(e) => handleNavClick(e, id)}
        aria-current={isActive ? "location" : undefined}
        className={[
          "block py-1 text-sm transition-colors duration-150",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-signal focus-visible:rounded",
          isActive ? "text-signal font-semibold" : "text-muted hover:text-text",
        ].join(" ")}
      >
        {label}
      </a>
    );
  }

  return (
    <nav aria-label="Page navigation">
      {/* ── Desktop: sticky left rail ≥ 1024 px ────────────────────────── */}
      <div className="hidden lg:flex flex-col gap-1 sticky top-8 w-[240px] shrink-0 self-start">
        {sections.map((s) => (
          <NavLink key={s.id} id={s.id} label={s.label} />
        ))}
      </div>

      {/* ── Tablet: horizontal top bar 768–1023 px ──────────────────────── */}
      <div
        className={[
          "hidden md:flex lg:hidden flex-wrap gap-x-4 gap-y-1",
          "sticky top-0 z-30 bg-bg border-b border-rule py-3 px-4",
        ].join(" ")}
      >
        {sections.map((s) => (
          <NavLink key={s.id} id={s.id} label={s.label} />
        ))}
      </div>

      {/* ── Mobile: disclosure button + push-down list < 768 px ─────────── */}
      <div className="flex flex-col md:hidden sticky top-0 z-30 bg-bg border-b border-rule">
        {/* Toggle button */}
        <button
          type="button"
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav-list"
          aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
          onClick={() => setMobileOpen((prev) => !prev)}
          className={[
            "flex items-center justify-between px-4 py-3 w-full text-left",
            "text-sm font-medium text-text",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-signal focus-visible:ring-inset",
          ].join(" ")}
        >
          <span>
            {/* Show the active section name as context */}
            {sections.find((s) => s.id === activeId)?.label ?? "Navigate"}
          </span>
          {/* Chevron icon — rotates when open. aria-hidden because label is on button. */}
          <svg
            aria-hidden="true"
            className={`w-4 h-4 shrink-0 transition-transform duration-150 ${mobileOpen ? "rotate-180" : ""}`}
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="4 6 8 10 12 6" />
          </svg>
        </button>

        {/*
         * Push-down list — position: static so it pushes content down,
         * never overlays it. Req 8.4 compliance.
         */}
        {mobileOpen && (
          <ul
            id="mobile-nav-list"
            role="list"
            className="flex flex-col px-4 pb-3 gap-1 border-t border-rule"
          >
            {sections.map((s) => (
              <li key={s.id}>
                <NavLink id={s.id} label={s.label} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </nav>
  );
}
