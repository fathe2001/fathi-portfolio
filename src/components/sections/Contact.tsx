/**
 * Contact — renders all ContactLink entries as appropriate anchors.
 *
 * - email  → mailto: link (Req 9.1). Address is never bare plain text (Req 9.5).
 * - phone  → tel: link (Req 9.2).
 * - linkedin / github → <ExternalLink> (opens new tab, rel enforced) (Req 9.3).
 * - cv     → <a download> pointing at the PDF in public/ (Req 9.4).
 * - No contact form (Req 9.6).
 * - Every interactive target is at least 44 × 44 px (Req 10.4).
 * - Server component — no 'use client' needed.
 */

import { Mail, Phone, Linkedin, Github, Download } from 'lucide-react';
import type { ContactLink } from '@/content/schema';
import { Section } from '@/components/layout/Section';
import { ExternalLink } from '@/components/ui/ExternalLink';

interface ContactProps {
  contact: ContactLink[];
}

// Map each ContactLink kind to its lucide icon.
function ContactIcon({ kind }: { kind: ContactLink['kind'] }) {
  const cls = 'w-5 h-5 shrink-0';
  switch (kind) {
    case 'email':
      return <Mail className={cls} aria-hidden="true" />;
    case 'phone':
      return <Phone className={cls} aria-hidden="true" />;
    case 'linkedin':
      return <Linkedin className={cls} aria-hidden="true" />;
    case 'github':
      return <Github className={cls} aria-hidden="true" />;
    case 'cv':
      return <Download className={cls} aria-hidden="true" />;
  }
}

// Shared class for every link row: full touch target, flex, consistent gap.
const rowCls =
  'inline-flex items-center gap-3 min-h-[44px] min-w-[44px] text-signal underline underline-offset-2 hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-signal focus-visible:rounded';

function renderContactLink(link: ContactLink) {
  switch (link.kind) {
    // Req 9.1 — mailto: (address never exposed as raw plain text, Req 9.5)
    case 'email':
      return (
        <a href={link.href} className={rowCls}>
          <ContactIcon kind="email" />
          <span>{link.label}</span>
        </a>
      );

    // Req 9.2 — tel:
    case 'phone':
      return (
        <a href={link.href} className={rowCls}>
          <ContactIcon kind="phone" />
          <span>{link.label}</span>
        </a>
      );

    // Req 9.3 — external profile links open in new tab (rel enforced by ExternalLink)
    case 'linkedin':
    case 'github':
      return (
        <ExternalLink href={link.href} className="inline-flex items-center gap-3 min-h-[44px] min-w-[44px]">
          <ContactIcon kind={link.kind} />
          <span>{link.label}</span>
        </ExternalLink>
      );

    // Req 9.4 — CV download from public/; `download` attribute prompts save dialog
    case 'cv':
      return (
        <a
          href={link.href}
          download
          className={link.primary ? [
            'inline-flex items-center justify-center gap-3',
            'min-h-[44px] min-w-[44px] px-6 py-2.5 rounded-sm',
            'bg-signal text-bg font-semibold text-[0.9375rem]',
            'hover:opacity-90 focus:outline-none focus-visible:ring-2',
            'focus-visible:ring-signal focus-visible:ring-offset-2',
            'focus-visible:ring-offset-bg transition-opacity',
          ].join(' ') : rowCls}
        >
          <ContactIcon kind="cv" />
          <span>{link.label}</span>
        </a>
      );
  }
}

export function Contact({ contact }: ContactProps) {
  return (
    <Section id="contact" title="Contact">
      <p className="text-body text-muted mb-8 max-w-measure">
        Feel free to reach out via email or LinkedIn — I respond within a day or two.
      </p>

      <ul className="space-y-5 list-none p-0 m-0">
        {contact.map((link) => (
          <li key={link.kind}>{renderContactLink(link)}</li>
        ))}
      </ul>
    </Section>
  );
}
