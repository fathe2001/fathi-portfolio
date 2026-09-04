import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-4 text-center">
      <h1 className="text-heading font-display">Page not found</h1>
      <p className="text-meta text-muted max-w-measure">
        The page you&apos;re looking for doesn&apos;t exist. Maybe it moved, or the link was
        mistyped.
      </p>
      <Link
        href="/"
        className="min-h-[44px] px-6 py-2 bg-signal text-bg rounded-sm font-semibold hover:opacity-90 flex items-center transition-opacity"
      >
        Back to home
      </Link>
    </div>
  );
}
