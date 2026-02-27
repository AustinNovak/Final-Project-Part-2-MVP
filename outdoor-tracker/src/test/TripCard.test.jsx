// TripCard.test.jsx — Tests for the trip summary card component
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import TripCard from "../components/TripCard";

// Sample trip data for tests
const mockTrip = {
  id: 12345,
  location: "Lake Springfield",
  date: "2025-06-14",
  tripType: "fishing",
  species: "Largemouth Bass",
  isPublic: false,
  weather: { tempF: 72, conditions: "Clear sky" },
};

function renderCard(trip = mockTrip) {
  return render(
    <MemoryRouter>
      <TripCard trip={trip} />
    </MemoryRouter>
  );
}

describe("TripCard", () => {
  test("renders the trip location", () => {
    renderCard();
    expect(screen.getByText(/Lake Springfield/i)).toBeInTheDocument();
  });

  test("renders the species/target", () => {
    renderCard();
    expect(screen.getByText(/Largemouth Bass/i)).toBeInTheDocument();
  });

  test("renders the formatted date", () => {
    renderCard();
    // Date should be formatted (e.g. "Jun 14, 2025")
    expect(screen.getByText(/Jun 14, 2025/i)).toBeInTheDocument();
  });

  test("renders weather info when present", () => {
    renderCard();
    expect(screen.getByText(/72°F/i)).toBeInTheDocument();
    expect(screen.getByText(/Clear sky/i)).toBeInTheDocument();
  });

  test("links to the correct trip detail page", () => {
    renderCard();
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/trips/12345");
  });

  test("shows personal visibility icon when isPublic is false", () => {
    renderCard();
    expect(screen.getByText("🔒")).toBeInTheDocument();
  });

  test("shows public visibility icon when isPublic is true", () => {
    renderCard({ ...mockTrip, isPublic: true });
    expect(screen.getByText("🌐")).toBeInTheDocument();
  });

  test("renders without species gracefully", () => {
    const tripNoSpecies = { ...mockTrip, species: "" };
    renderCard(tripNoSpecies);
    expect(screen.getByText(/Lake Springfield/i)).toBeInTheDocument();
  });

  test("renders without weather gracefully", () => {
    const tripNoWeather = { ...mockTrip, weather: null };
    renderCard(tripNoWeather);
    expect(screen.getByText(/Lake Springfield/i)).toBeInTheDocument();
  });

  test("renders fishing type icon", () => {
    renderCard();
    expect(screen.getByText("🎣")).toBeInTheDocument();
  });

  test("renders hunting type icon", () => {
    renderCard({ ...mockTrip, tripType: "hunting" });
    expect(screen.getByText("🦌")).toBeInTheDocument();
  });
});
