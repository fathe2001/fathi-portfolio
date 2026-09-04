import { render, screen } from '@testing-library/react';
import { Contact } from './Contact';
import type { ContactLink } from '@/content/schema';

const links: ContactLink[] = [
  { kind: 'email', label: 'fathi@example.com', href: 'mailto:fathi@example.com' },
  { kind: 'phone', label: '+972-00-000-0000', href: 'tel:+972000000000' },
  {
    kind: 'linkedin',
    label: 'linkedin.com/in/fathi-zidan',
    href: 'https://linkedin.com/in/fathi-zidan',
  },
  {
    kind: 'github',
    label: 'github.com/fathi-zidan',
    href: 'https://github.com/fathi-zidan',
  },
  { kind: 'cv', label: 'Download CV', href: '/fathi-zidan-cv.pdf', primary: true },
];

describe('Contact', () => {
  it('renders the email as a mailto: link (Req 9.1)', () => {
    render(<Contact contact={links} />);
    const emailLink = screen.getByRole('link', { name: /fathi@example\.com/i });
    expect(emailLink).toHaveAttribute('href', 'mailto:fathi@example.com');
  });

  it('does not expose the email address as raw plain text (Req 9.5)', () => {
    const { container } = render(<Contact contact={links} />);
    // The address must live inside an <a> element, not as a bare text node
    const emailAnchor = container.querySelector('a[href^="mailto:"]');
    expect(emailAnchor).not.toBeNull();
  });

  it('renders the phone as a tel: link (Req 9.2)', () => {
    render(<Contact contact={links} />);
    const phoneLink = screen.getByRole('link', { name: /\+972/i });
    expect(phoneLink).toHaveAttribute('href', 'tel:+972000000000');
  });

  it('renders LinkedIn with target="_blank" and rel="noopener noreferrer" (Req 9.3)', () => {
    render(<Contact contact={links} />);
    const liLink = screen.getByRole('link', { name: /linkedin\.com/i });
    expect(liLink).toHaveAttribute('target', '_blank');
    expect(liLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders GitHub with target="_blank" and rel="noopener noreferrer" (Req 9.3)', () => {
    render(<Contact contact={links} />);
    const ghLink = screen.getByRole('link', { name: /github\.com/i });
    expect(ghLink).toHaveAttribute('target', '_blank');
    expect(ghLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders the CV link with the download attribute (Req 9.4)', () => {
    render(<Contact contact={links} />);
    const cvLink = screen.getByRole('link', { name: /download cv/i });
    expect(cvLink).toHaveAttribute('href', '/fathi-zidan-cv.pdf');
    expect(cvLink).toHaveAttribute('download');
  });

  it('does not render a contact form (Req 9.6)', () => {
    render(<Contact contact={links} />);
    expect(screen.queryByRole('form')).not.toBeInTheDocument();
  });

  it('renders all five contact entries', () => {
    render(<Contact contact={links} />);
    expect(screen.getAllByRole('link')).toHaveLength(5);
  });
});
