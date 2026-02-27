// TripContext.test.jsx — Tests for global state (Context API)
import { render, screen, act } from "@testing-library/react";
import { TripProvider, useTrip } from "../context/TripContext";

// Mock localStorage so it works reliably in the test environment
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] ?? null,
    setItem: (key, value) => { store[key] = String(value); },
    removeItem: (key) => { delete store[key]; },
    clear: () => { store = {}; },
  };
})();
Object.defineProperty(globalThis, "localStorage", { value: localStorageMock });

// A simple consumer component for testing context
function TestConsumer() {
  const { trips, addTrip, deleteTrip } = useTrip();
  return (
    <div>
      <p data-testid="count">{trips.length}</p>
      <button onClick={() =>
        addTrip({ location: "Test Lake", date: "2025-01-01", tripType: "fishing" })
      }>
        Add
      </button>
      <button onClick={() => trips[0] && deleteTrip(trips[0].id)}>
        Delete First
      </button>
      {trips.map((t) => (
        <p key={t.id} data-testid="trip-location">{t.location}</p>
      ))}
    </div>
  );
}

function renderWithProvider() {
  return render(
    <TripProvider>
      <TestConsumer />
    </TripProvider>
  );
}

describe("TripContext", () => {
  // Clear mock storage before each test so they don't bleed into each other
  beforeEach(() => localStorageMock.clear());

  test("starts with zero trips", () => {
    renderWithProvider();
    expect(screen.getByTestId("count").textContent).toBe("0");
  });

  test("addTrip increases trip count", () => {
    renderWithProvider();
    act(() => screen.getByText("Add").click());
    expect(screen.getByTestId("count").textContent).toBe("1");
  });

  test("addTrip saves the correct location", () => {
    renderWithProvider();
    act(() => screen.getByText("Add").click());
    expect(screen.getByTestId("trip-location").textContent).toBe("Test Lake");
  });

  test("addTrip assigns a numeric id", () => {
    let capturedTrips = [];
    function Capture() {
      const { trips, addTrip } = useTrip();
      capturedTrips = trips;
      return (
        <button onClick={() => addTrip({ location: "X", date: "2025-01-01", tripType: "hiking" })}>
          Add
        </button>
      );
    }
    const { getByText } = render(<TripProvider><Capture /></TripProvider>);
    act(() => getByText("Add").click());
    expect(typeof capturedTrips[0].id).toBe("number");
  });

  test("deleteTrip removes a trip", () => {
    renderWithProvider();
    act(() => screen.getByText("Add").click());
    expect(screen.getByTestId("count").textContent).toBe("1");
    act(() => screen.getByText("Delete First").click());
    expect(screen.getByTestId("count").textContent).toBe("0");
  });

  test("multiple trips can be added", () => {
    renderWithProvider();
    act(() => screen.getByText("Add").click());
    act(() => screen.getByText("Add").click());
    act(() => screen.getByText("Add").click());
    expect(screen.getByTestId("count").textContent).toBe("3");
  });

  test("useTrip throws when used outside TripProvider", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    function BareConsumer() {
      useTrip();
      return null;
    }
    expect(() => render(<BareConsumer />)).toThrow(
      "useTrip must be used inside TripProvider"
    );
    spy.mockRestore();
  });

  test("trips persist to localStorage", () => {
    renderWithProvider();
    act(() => screen.getByText("Add").click());
    const saved = JSON.parse(localStorageMock.getItem("outdoor_tracker_trips"));
    expect(saved).toHaveLength(1);
    expect(saved[0].location).toBe("Test Lake");
  });
});
