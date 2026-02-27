// MyTrips.test.jsx — Tests for the trip list page
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import MyTrips from "../pages/MyTrips";

const mockTrips = [
  { id: 1, location: "Eagle Lake", date: "2025-03-10", tripType: "fishing", species: "Trout", isPublic: false, weather: null },
  { id: 2, location: "Blue Ridge Trail", date: "2025-04-01", tripType: "hiking", species: "Summit hike", isPublic: true, weather: null },
  { id: 3, location: "Cedar Forest", date: "2025-05-20", tripType: "hunting", species: "White-tail Deer", isPublic: false, weather: null },
];

vi.mock("../context/TripContext", () => ({
  useTrip: () => ({ trips: mockTrips }),
}));

function renderMyTrips() {
  return render(
    <MemoryRouter>
      <MyTrips />
    </MemoryRouter>
  );
}

describe("MyTrips", () => {
  test("renders the page heading", () => {
    renderMyTrips();
    expect(screen.getByText(/My Trips/i)).toBeInTheDocument();
  });

  test("displays all trips by default", () => {
    renderMyTrips();
    expect(screen.getByText(/Eagle Lake/i)).toBeInTheDocument();
    expect(screen.getByText(/Blue Ridge Trail/i)).toBeInTheDocument();
    expect(screen.getByText(/Cedar Forest/i)).toBeInTheDocument();
  });

  test("shows correct trip count in subtitle", () => {
    renderMyTrips();
    expect(screen.getByText(/3 trips in your journal/i)).toBeInTheDocument();
  });

  test("filter by fishing shows only fishing trips", () => {
    renderMyTrips();
    fireEvent.click(screen.getByText(/🎣 Fishing/i));
    expect(screen.getByText(/Eagle Lake/i)).toBeInTheDocument();
    expect(screen.queryByText(/Blue Ridge Trail/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Cedar Forest/i)).not.toBeInTheDocument();
  });

  test("filter by hiking shows only hiking trips", () => {
    renderMyTrips();
    fireEvent.click(screen.getByText(/🥾 Hiking/i));
    expect(screen.queryByText(/Eagle Lake/i)).not.toBeInTheDocument();
    expect(screen.getByText(/Blue Ridge Trail/i)).toBeInTheDocument();
  });

  test("'All' filter shows all trips again after filtering", () => {
    renderMyTrips();
    fireEvent.click(screen.getByText(/🎣 Fishing/i));
    fireEvent.click(screen.getByText(/^All$/i));
    expect(screen.getByText(/Eagle Lake/i)).toBeInTheDocument();
    expect(screen.getByText(/Blue Ridge Trail/i)).toBeInTheDocument();
    expect(screen.getByText(/Cedar Forest/i)).toBeInTheDocument();
  });

  test("search box filters trips by location", () => {
    renderMyTrips();
    const searchInput = screen.getByPlaceholderText(/Search trips/i);
    fireEvent.change(searchInput, { target: { value: "Eagle" } });
    expect(screen.getByText(/Eagle Lake/i)).toBeInTheDocument();
    expect(screen.queryByText(/Blue Ridge Trail/i)).not.toBeInTheDocument();
  });

  test("search with no matches shows empty state message", () => {
    renderMyTrips();
    const searchInput = screen.getByPlaceholderText(/Search trips/i);
    fireEvent.change(searchInput, { target: { value: "xyznotexist" } });
    expect(screen.getByText(/No trips match your filters/i)).toBeInTheDocument();
  });

  test("Log Trip button links to /log", () => {
    renderMyTrips();
    const logBtn = screen.getByRole("link", { name: /\+ Log Trip/i });
    expect(logBtn).toHaveAttribute("href", "/log");
  });
});
