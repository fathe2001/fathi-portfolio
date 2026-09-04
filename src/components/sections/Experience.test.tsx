import { render, screen } from "@testing-library/react";
import { Experience } from "./Experience";
import type { ExperienceEntry } from "@/content/schema";

const olderEntry: ExperienceEntry = {
  id: "tutor",
  company: "Atidim Program",
  role: "Python Tutor",
  location: "Remote",
  start: "2022-08",
  end: "2025-08",
  achievements: ["Taught Python fundamentals to students"],
};

const recentEntry: ExperienceEntry = {
  id: "dy",
  company: "Dynamic Yield",
  role: "Platform Operations Engineer",
  location: "Tel Aviv",
  start: "2023-09",
  end: "2025-02",
  achievements: ["Maintained production infrastructure"],
  technologies: ["AWS", "Docker", "Python"],
};

const currentEntry: ExperienceEntry = {
  id: "job",
  company: "ACME",
  role: "Engineer",
  location: "Remote",
  start: "2022-08",
  end: null,
  achievements: ["Did things"],
};

describe("Experience", () => {
  it('renders "Present" when end is null (Req 4.3)', () => {
    render(<Experience entries={[currentEntry]} />);
    expect(screen.getByText(/Present/)).toBeInTheDocument();
  });

  it("renders entries in reverse-chronological order, not array order (Req 4.2)", () => {
    // Providing older entry first — component must re-sort
    render(<Experience entries={[olderEntry, recentEntry]} />);

    const listItems = screen.getAllByRole("listitem");
    // The most recent entry (Dynamic Yield, 2023-09) must appear before the older one
    const dyIndex = listItems.findIndex((item) => item.textContent?.includes("Dynamic Yield"));
    const atidimIndex = listItems.findIndex((item) => item.textContent?.includes("Atidim Program"));
    expect(dyIndex).toBeLessThan(atidimIndex);
  });

  it("renders company, role, location and formatted dates for each entry (Req 4.1)", () => {
    render(<Experience entries={[recentEntry]} />);
    expect(screen.getByText("Dynamic Yield")).toBeInTheDocument();
    expect(screen.getByText("Platform Operations Engineer")).toBeInTheDocument();
    expect(screen.getByText(/Tel Aviv/)).toBeInTheDocument();
    expect(screen.getByText(/Sep 2023/)).toBeInTheDocument();
    expect(screen.getByText(/Feb 2025/)).toBeInTheDocument();
  });

  it("renders achievement bullets as a list (Req 4.4)", () => {
    render(<Experience entries={[recentEntry]} />);
    expect(screen.getByText("Maintained production infrastructure")).toBeInTheDocument();
    // Achievement text lives inside a <li>
    const achievementItem = screen.getByText("Maintained production infrastructure").closest("li");
    expect(achievementItem).not.toBeNull();
  });

  it("renders technology chips when technologies are provided (Req 4.5)", () => {
    render(<Experience entries={[recentEntry]} />);
    expect(screen.getByText("AWS")).toBeInTheDocument();
    expect(screen.getByText("Docker")).toBeInTheDocument();
    expect(screen.getByText("Python")).toBeInTheDocument();
  });

  it("renders no technology chips when technologies are absent (Req 4.5)", () => {
    render(<Experience entries={[olderEntry]} />);
    // olderEntry has no technologies; the technologies container should not be present
    expect(screen.queryByLabelText("Technologies")).not.toBeInTheDocument();
  });

  it("renders the timeline as an ordered list (timeline structure)", () => {
    render(<Experience entries={[recentEntry]} />);
    // There are multiple lists (the <ol> timeline and <ul> achievements).
    // Confirm the top-level ordered list is present.
    const lists = screen.getAllByRole("list");
    const orderedList = lists.find((el) => el.tagName === "OL");
    expect(orderedList).toBeDefined();
  });
});
