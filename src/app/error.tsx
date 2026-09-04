"use client";

import Link from "next/link";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-4 text-center">
      <h1 className="text-heading font-display">Something went wrong</h1>
      <p className="text-meta text-muted max-w-measure">
        An unexpected error occurred. This isn&apos;t your fault — try refreshing the page.
      </p>
      <div className="flex gap-4">
        <button
          onClick={reset}
          className="min-h-[44px] px-6 py-2 bg-signal text-bg rounded-sm font-semibold hover:opacity-90 transition-opacity"
        >
          Try again
        </button>
        <Link
          href="/"
          className="min-h-[44px] px-6 py-2 border border-signal text-signal rounded-sm font-semibold hover:bg-signal hover:text-bg flex items-center transition-colors"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
