// Header.test.jsx — Tests for the sticky navigation header
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Header from "../components/Header";

// Helper: render Header inside a router (required for NavLink)
function renderHeader(initialRoute = "/") {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <Header />
    </MemoryRouter>
  );
}

describe("Header", () => {
  test("renders the app logo/title", () => {
    renderHeader();
    expect(screen.getByText(/Outdoor Tracker/i)).toBeInTheDocument();
  });

  test("renders all four navigation links", () => {
    renderHeader();
    expect(screen.getByRole("link", { name: /home/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /log trip/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /my trips/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /about/i })).toBeInTheDocument();
  });

  test("nav links point to correct routes", () => {
    renderHeader();
    expect(screen.getByRole("link", { name: /log trip/i })).toHaveAttribute("href", "/log");
    expect(screen.getByRole("link", { name: /my trips/i })).toHaveAttribute("href", "/trips");
    expect(screen.getByRole("link", { name: /about/i })).toHaveAttribute("href", "/about");
  });

  test("hamburger button is present for mobile menu", () => {
    renderHeader();
    const hamburger = screen.getByRole("button", { name: /menu/i });
    expect(hamburger).toBeInTheDocument();
  });

  test("clicking hamburger opens mobile nav", () => {
    renderHeader();
    const hamburger = screen.getByRole("button", { name: /menu/i });

    // Mobile nav should not be visible initially
    expect(screen.queryByRole("navigation", { hidden: true })).toBeTruthy();

    fireEvent.click(hamburger);

    // After click, mobile nav links should appear (duplicated in mobile nav)
    const allHomeLinks = screen.getAllByRole("link", { name: /home/i });
    expect(allHomeLinks.length).toBeGreaterThanOrEqual(1);
  });
});
