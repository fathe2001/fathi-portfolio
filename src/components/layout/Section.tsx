/**
 * Section — wraps each content block in a <section> landmark.
 *
 * - `id` lets nav links and the skip link target the section.
 * - `aria-labelledby` points at the section's heading (Req 12.4).
 * - Heading is always an <h2> so the h1→h2 hierarchy is never broken (Req 12.1).
 */

interface SectionProps {
  id: string;
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function Section({ id, title, children, className = "" }: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className={`border-t border-rule py-16 ${className}`}
    >
      <h2
        id={`${id}-heading`}
        className="text-heading mb-8"
      >
        {title}
      </h2>
      {children}
    </section>
  );
}
