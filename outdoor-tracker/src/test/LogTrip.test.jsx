// LogTrip.test.jsx — Tests for the trip logging form
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import LogTrip from "../pages/LogTrip";

// Mock the context so tests don't need a real provider
vi.mock("../context/TripContext", () => ({
  useTrip: () => ({ addTrip: vi.fn().mockReturnValue({ id: 999 }) }),
}));

// Mock the location service to avoid real HTTP calls in tests
vi.mock("../services/locationService", () => ({
  searchLocations: vi.fn().mockResolvedValue([]),
  reverseGeocode: vi.fn(),
}));

// Mock the weather service
vi.mock("../services/weatherService", () => ({
  fetchWeatherByCoords: vi.fn().mockResolvedValue({
    tempF: 68, conditions: "Clear sky", windMph: 5, humidity: 55, weatherCode: 0,
  }),
}));

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return { ...actual, useNavigate: () => mockNavigate };
});

function renderLogTrip() {
  return render(
    <MemoryRouter>
      <LogTrip />
    </MemoryRouter>
  );
}

describe("LogTrip", () => {
  beforeEach(() => vi.clearAllMocks());

  test("renders the form heading", () => {
    renderLogTrip();
    expect(screen.getByText(/Log a New Trip/i)).toBeInTheDocument();
  });

  test("renders step 1 with location input and trip type buttons", () => {
    renderLogTrip();
    expect(screen.getByPlaceholderText(/Search location/i)).toBeInTheDocument();
    expect(screen.getByText(/🎣 Fishing/i)).toBeInTheDocument();
    expect(screen.getByText(/🦌 Hunting/i)).toBeInTheDocument();
    expect(screen.getByText(/🥾 Hiking/i)).toBeInTheDocument();
    expect(screen.getByText(/⛺ Camping/i)).toBeInTheDocument();
  });

  test("shows error if Next is clicked without a location", () => {
    renderLogTrip();
    fireEvent.click(screen.getByText(/Next: Add Details/i));
    expect(screen.getByText(/Please select a location/i)).toBeInTheDocument();
  });

  test("trip type buttons are selectable", () => {
    renderLogTrip();
    const hikingBtn = screen.getByText(/🥾 Hiking/i);
    fireEvent.click(hikingBtn);
    expect(hikingBtn).toHaveClass("selected");
  });

  test("date input has today's date by default", () => {
    renderLogTrip();
    const today = new Date().toISOString().split("T")[0];
    const dateInput = screen.getByDisplayValue(today);
    expect(dateInput).toBeInTheDocument();
  });

  test("renders step 2 progress indicators", () => {
    renderLogTrip();
    // Both step dots should be visible
    const dots = document.querySelectorAll(".step-dot");
    expect(dots).toHaveLength(2);
  });

  test("step 1 dot is active on load", () => {
    renderLogTrip();
    const dots = document.querySelectorAll(".step-dot");
    expect(dots[0]).toHaveClass("active");
    expect(dots[1]).not.toHaveClass("active");
  });
});
