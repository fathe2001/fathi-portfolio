/**
 * ThemeToggle — flips the `dark` class on <html> and persists the choice.
 *
 * Initial state is read from the class already set by the pre-paint script
 * in layout.tsx, so the button icon is always in sync with the active theme
 * without triggering a re-paint.
 *
 * The 150 ms color cross-fade is handled by `globals.css` behind
 * `@media (prefers-reduced-motion: no-preference)` — no extra work needed here.
 *
 * Satisfies:
 *   Req 11.2 — control to toggle between light and dark
 *   Req 11.3 — persists the choice across page reloads
 *   Req 11.4 — no flash (pre-paint script reads the stored value before paint)
 *
 * 'use client' is required because this component reads and writes
 * document.documentElement and localStorage after hydration.
 */

'use client';

import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

export function ThemeToggle() {
  /**
   * Start with false (light) as the SSR-safe default. The useEffect below
   * immediately syncs this to whatever the pre-paint script set on <html>,
   * so there is never a mismatch visible to the user.
   */
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Read the class that the pre-paint script already applied.
    setIsDark(document.documentElement.classList.contains('dark'));
  }, []);

  const toggle = () => {
    const next = !isDark;

    // Mutate the class directly — no React state drives the theme.
    // The 150 ms transition in globals.css handles the visual cross-fade.
    if (next) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Persist so the pre-paint script can apply the right theme on the next load.
    try {
      localStorage.setItem('theme', next ? 'dark' : 'light');
    } catch {
      // Storage may be blocked in some private-browsing environments.
      // Silently ignore — the class is still applied for this session.
    }

    setIsDark(next);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      /**
       * The label describes what the button will DO, not what the current
       * state is — follows the principle of labelling the action, not the state.
       * Req 12.2: visible focus indicator via focus-visible:ring-2.
       */
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      className={[
        /* 44 × 44 px minimum touch target (Req 10.4) */
        'min-h-[44px] min-w-[44px]',
        'flex items-center justify-center',
        'text-muted hover:text-text',
        'transition-colors duration-150',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-signal focus-visible:rounded',
      ].join(' ')}
    >
      {isDark ? (
        /* Sun icon: currently dark → switching to light */
        <Sun className="w-5 h-5" aria-hidden="true" />
      ) : (
        /* Moon icon: currently light → switching to dark */
        <Moon className="w-5 h-5" aria-hidden="true" />
      )}
    </button>
  );
}
