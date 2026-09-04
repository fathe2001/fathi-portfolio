import { render, screen } from "@testing-library/react";
import { About } from "./About";
import type { Profile } from "@/content/schema";

const mockProfile: Profile = {
  name: "Fathi Zidan",
  headline: "Computer Science Graduate — Software, Cloud & Systems",
  summary:
    "Computer Science graduate from the Hebrew University of Jerusalem with hands-on production engineering experience at Dynamic Yield.",
  location: "Tel Aviv, Israel",
  statusLine: ["HUJI B.Sc. '26", "Cloud & Systems", "Tel Aviv"],
  highlights: [
    "Maintained and optimised production infrastructure at Dynamic Yield.",
    "Tutored Python to 30+ university students through the Atidim programme.",
    "Fluent in Arabic (native), Hebrew, and English.",
  ],
  languages: [
    { name: "Arabic", level: "Native" },
    { name: "Hebrew", level: "Fluent" },
    { name: "English", level: "Fluent" },
  ],
};

describe("About", () => {
  it("renders the summary paragraph (Req 3.1)", () => {
    render(<About profile={mockProfile} />);
    expect(
      screen.getByText(/Computer Science graduate from the Hebrew University/i)
    ).toBeInTheDocument();
  });

  it("renders the summary inside an element with the max-w-measure class for 72ch constraint (Req 3.3)", () => {
    render(<About profile={mockProfile} />);
    const summary = screen.getByText(/Computer Science graduate from the Hebrew University/i);
    expect(summary).toHaveClass("max-w-measure");
  });

  it("renders all highlights as list items (Req 3.2)", () => {
    render(<About profile={mockProfile} />);
    expect(
      screen.getByText(/Maintained and optimised production infrastructure/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Tutored Python to 30\+ university students/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Fluent in Arabic \(native\), Hebrew, and English/i)
    ).toBeInTheDocument();
  });

  it('renders the "Languages" sub-heading (Req 3.2)', () => {
    render(<About profile={mockProfile} />);
    expect(screen.getByRole("heading", { name: /languages/i })).toBeInTheDocument();
  });

  it("renders each language with its proficiency level (Req 3.2)", () => {
    render(<About profile={mockProfile} />);
    // The languages heading is an h3; get the list that follows it by querying
    // within the containing <div> rather than by text (which also matches the
    // highlights bullet "Fluent in Arabic (native)...").
    const languagesHeading = screen.getByRole("heading", { name: /languages/i });
    const languagesSection = languagesHeading.closest("div")!;

    expect(languagesSection).toHaveTextContent("Arabic");
    expect(languagesSection).toHaveTextContent("Native");
    expect(languagesSection).toHaveTextContent("Hebrew");
    expect(languagesSection).toHaveTextContent("Fluent");
    expect(languagesSection).toHaveTextContent("English");

    // Confirm Arabic maps specifically to Native (not just any Fluent)
    const items = languagesSection.querySelectorAll("li");
    expect(items[0]).toHaveTextContent("Arabic");
    expect(items[0]).toHaveTextContent("Native");
    expect(items[1]).toHaveTextContent("Hebrew");
    expect(items[1]).toHaveTextContent("Fluent");
    expect(items[2]).toHaveTextContent("English");
    expect(items[2]).toHaveTextContent("Fluent");
  });

  it('wraps content in a section landmark with id="about" (Req 12.4)', () => {
    render(<About profile={mockProfile} />);
    const section = document.querySelector("section#about");
    expect(section).toBeInTheDocument();
  });

  it('renders the "About" section heading (Req 12.1)', () => {
    render(<About profile={mockProfile} />);
    expect(screen.getByRole("heading", { name: "About" })).toBeInTheDocument();
  });
});
