// TripContext.jsx
// Global state for all trips. Uses localStorage for persistence across sessions.
import { createContext, useContext, useState, useMemo, useEffect } from "react";

const TripContext = createContext();

const STORAGE_KEY = "outdoor_tracker_trips";

export function TripProvider({ children }) {
  // Load persisted trips from localStorage on mount
  const [trips, setTrips] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Persist trips to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trips));
  }, [trips]);

  /** Add a new trip (full trip object with all fields) */
  function addTrip(trip) {
    const newTrip = { ...trip, id: Date.now() };
    setTrips((prev) => [newTrip, ...prev]);
    return newTrip;
  }

  /** Update an existing trip by id */
  function updateTrip(id, updates) {
    setTrips((prev) =>
      prev.map((t) => (t.id === Number(id) ? { ...t, ...updates } : t))
    );
  }

  /** Delete a trip by id */
  function deleteTrip(id) {
    setTrips((prev) => prev.filter((t) => t.id !== Number(id)));
  }

  /** Get a single trip by id */
  function getTripById(id) {
    return trips.find((t) => t.id === Number(id));
  }

  const value = useMemo(
    () => ({ trips, addTrip, updateTrip, deleteTrip, getTripById }),
    [trips]
  );

  return <TripContext.Provider value={value}>{children}</TripContext.Provider>;
}

export function useTrip() {
  const context = useContext(TripContext);
  if (!context) throw new Error("useTrip must be used inside TripProvider");
  return context;
}
