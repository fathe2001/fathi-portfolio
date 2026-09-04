import { render, screen } from "@testing-library/react";
import { Projects } from "./Projects";
import type { Project } from "@/content/schema";

const projectWithRepo: Project = {
  id: "log-tool",
  name: "Log Analysis & Automation Tool",
  description: "Parses and aggregates log files to surface anomalies.",
  technologies: ["Python", "Bash"],
  repoUrl: "https://github.com/fathi/log-tool",
};

const projectWithoutRepo: Project = {
  id: "no-repo",
  name: "Internal Dashboard",
  description: "A monitoring dashboard for internal metrics.",
  technologies: ["React", "TypeScript"],
};

describe("Projects", () => {
  it("renders no anchor when repoUrl is absent (Req 6.3)", () => {
    render(<Projects projects={[projectWithoutRepo]} />);
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("renders a repo link when repoUrl is present (Req 6.2)", () => {
    render(<Projects projects={[projectWithRepo]} />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "https://github.com/fathi/log-tool");
  });

  it('renders the repo link with rel="noopener noreferrer" (Req 6.5)', () => {
    render(<Projects projects={[projectWithRepo]} />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
    expect(link).toHaveAttribute("target", "_blank");
  });

  it("renders the project name as a heading (Req 6.1)", () => {
    render(<Projects projects={[projectWithRepo]} />);
    expect(
      screen.getByRole("heading", { name: "Log Analysis & Automation Tool" })
    ).toBeInTheDocument();
  });

  it("renders the project description (Req 6.1)", () => {
    render(<Projects projects={[projectWithRepo]} />);
    expect(
      screen.getByText("Parses and aggregates log files to surface anomalies.")
    ).toBeInTheDocument();
  });

  it("renders technology chips for each technology (Req 6.1)", () => {
    render(<Projects projects={[projectWithRepo]} />);
    expect(screen.getByText("Python")).toBeInTheDocument();
    expect(screen.getByText("Bash")).toBeInTheDocument();
  });

  it("renders multiple projects (Req 6.4)", () => {
    render(<Projects projects={[projectWithRepo, projectWithoutRepo]} />);
    expect(
      screen.getByRole("heading", { name: "Log Analysis & Automation Tool" })
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Internal Dashboard" })).toBeInTheDocument();
  });
});
