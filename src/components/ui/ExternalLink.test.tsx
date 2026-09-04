import { render, screen } from "@testing-library/react";
import { ExternalLink } from "./ExternalLink";

describe("ExternalLink", () => {
  it('always emits rel="noopener noreferrer"', () => {
    render(<ExternalLink href="https://example.com">Link</ExternalLink>);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("always opens in a new tab", () => {
    render(<ExternalLink href="https://example.com">Link</ExternalLink>);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("target", "_blank");
  });

  it("renders the correct href", () => {
    render(<ExternalLink href="https://example.com">Visit</ExternalLink>);
    expect(screen.getByRole("link")).toHaveAttribute(
      "href",
      "https://example.com"
    );
  });
});
