/**
 * SkipLink — the first focusable element on the page.
 *
 * Visually hidden until focused, then jumps to #main-content.
 * Satisfies Req 12.3 (skip to content) and Req 12.2 (visible focus indicator).
 */
export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-signal focus:text-bg focus:rounded"
    >
      Skip to content
    </a>
  );
}
