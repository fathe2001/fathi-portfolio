/**
 * Chip — a small label for skills, technologies, etc.
 *
 * Uses `--surface` background and `--muted` text, with the project's single
 * border-radius value (4 px / `rounded`). Never used for interactive elements.
 */

interface ChipProps {
  children: React.ReactNode;
  className?: string;
}

export function Chip({ children, className = "" }: ChipProps) {
  return (
    <span className={`inline-block bg-surface text-meta px-2 py-0.5 rounded text-sm ${className}`}>
      {children}
    </span>
  );
}
