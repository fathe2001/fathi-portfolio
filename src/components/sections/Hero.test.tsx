import { render, screen } from '@testing-library/react';
import { Hero } from './Hero';
import type { Profile, ContactLink } from '@/content/schema';

const mockProfile: Profile = {
  name: 'Fathi Zidan',
  headline: 'Computer Science Graduate — Software, Cloud & Systems',
  summary: 'Short summary.',
  location: 'Tel Aviv, Israel',
  statusLine: ["HUJI B.Sc. '26", 'Cloud & Systems', 'Tel Aviv'],
  highlights: [],
  languages: [],
};

const mockContact: ContactLink[] = [
  { kind: 'cv', label: 'Download CV', href: '/fathi-zidan-cv.pdf', primary: true },
  { kind: 'email', label: 'test@example.com', href: 'mailto:test@example.com' },
];

describe('Hero', () => {
  it('renders the name as h1 (Req 2.1)', () => {
    render(<Hero profile={mockProfile} contact={mockContact} />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Fathi Zidan');
  });

  it('renders the headline beneath the name (Req 2.2)', () => {
    render(<Hero profile={mockProfile} contact={mockContact} />);
    expect(
      screen.getByText('Computer Science Graduate — Software, Cloud & Systems'),
    ).toBeInTheDocument();
  });

  it('renders all three status-line facts (Req 2.3)', () => {
    render(<Hero profile={mockProfile} contact={mockContact} />);
    // The status line is a single <p aria-label="Status"> with text nodes
    // interleaved with separator <span>s, so we locate it by its label and
    // check the combined textContent rather than individual text nodes.
    const statusContainer = screen.getByLabelText('Status');
    const text = statusContainer.textContent ?? '';
    expect(text).toContain("HUJI B.Sc. '26");
    expect(text).toContain('Cloud & Systems');
    expect(text).toContain('Tel Aviv');
  });

  it('renders the "Download CV" link with a download attribute (Req 2.4)', () => {
    render(<Hero profile={mockProfile} contact={mockContact} />);
    const cvLink = screen.getByRole('link', { name: /download cv/i });
    expect(cvLink).toBeInTheDocument();
    expect(cvLink).toHaveAttribute('href', '/fathi-zidan-cv.pdf');
    expect(cvLink).toHaveAttribute('download');
  });

  it('renders the "Get in touch" link pointing at #contact (Req 2.4)', () => {
    render(<Hero profile={mockProfile} contact={mockContact} />);
    const contactLink = screen.getByRole('link', { name: /get in touch/i });
    expect(contactLink).toBeInTheDocument();
    expect(contactLink).toHaveAttribute('href', '#contact');
  });

  it('renders hero content as real text, not an image (Req 2.6)', () => {
    render(<Hero profile={mockProfile} contact={mockContact} />);
    // If the name were an image, getByRole('heading') would fail — this
    // assertion confirms it is text-based DOM content.
    const h1 = screen.getByRole('heading', { level: 1 });
    expect(h1.tagName).toBe('H1');
    expect(h1.textContent).toBe('Fathi Zidan');
  });

  it('renders without a "Download CV" link when no cv contact is supplied', () => {
    const contactWithoutCv: ContactLink[] = [
      { kind: 'email', label: 'test@example.com', href: 'mailto:test@example.com' },
    ];
    render(<Hero profile={mockProfile} contact={contactWithoutCv} />);
    expect(screen.queryByRole('link', { name: /download cv/i })).not.toBeInTheDocument();
    // "Get in touch" is always rendered regardless
    expect(screen.getByRole('link', { name: /get in touch/i })).toBeInTheDocument();
  });
});
