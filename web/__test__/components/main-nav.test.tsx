import { render, screen } from "@testing-library/react";
import {MainNav} from "@/components/main-nav";

describe("MainNav Component", () => {
  it("renders", () => {
    render(<MainNav />);

    const heading = screen.getByText('Funny Movies');

    expect(heading).toBeDefined();
  });
});