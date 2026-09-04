/**
 * ExternalLink — a link that always opens in a new tab.
 *
 * Enforces `target="_blank"` and `rel="noopener noreferrer"` on every render
 * so callers cannot accidentally omit them (Req 6.5).
 */

interface ExternalLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export function ExternalLink({ href, children, className = "" }: ExternalLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`text-signal underline underline-offset-2 hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-signal focus-visible:rounded ${className}`}
    >
      {children}
    </a>
  );
}
