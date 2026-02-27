// MyTrips.jsx
// Trip list with type filter and search
import { useState } from "react";
import { Link } from "react-router-dom";
import { useTrip } from "../context/TripContext";
import TripCard from "../components/TripCard";

const FILTERS = [
  { value: "all", label: "All" },
  { value: "fishing", label: "🎣 Fishing" },
  { value: "hunting", label: "🦌 Hunting" },
  { value: "hiking",  label: "🥾 Hiking" },
  { value: "camping", label: "⛺ Camping" },
  { value: "other",   label: "🌲 Other" },
];

export default function MyTrips() {
  const { trips } = useTrip();
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = trips.filter((t) => {
    const matchType = filter === "all" || t.tripType === filter;
    const matchSearch =
      !search ||
      t.location?.toLowerCase().includes(search.toLowerCase()) ||
      t.species?.toLowerCase().includes(search.toLowerCase()) ||
      t.notes?.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  return (
    <div className="trips-page">
      <div className="trips-header">
        <div>
          <h2>My Trips</h2>
          <p className="trips-subtitle">
            {trips.length} trip{trips.length !== 1 ? "s" : ""} in your journal
          </p>
        </div>
        <Link to="/log" className="btn-accent">+ Log Trip</Link>
      </div>

      {/* Filters + Search */}
      <div className="trips-toolbar">
        <div className="filter-pills">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              className={`filter-pill ${filter === f.value ? "active" : ""}`}
              onClick={() => setFilter(f.value)}
            >
              {f.label}
            </button>
          ))}
        </div>
        <input
          className="search-input"
          type="text"
          placeholder="Search trips…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {trips.length === 0 ? (
        <div className="empty-state">
          <p className="empty-icon">🌲</p>
          <p>Your journal is empty.</p>
          <p className="empty-sub">Log your first outdoor trip to get started.</p>
          <Link to="/log" className="btn-accent" style={{ marginTop: "1.25rem", display: "inline-block" }}>
            Log Your First Trip
          </Link>
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <p className="empty-icon">🔍</p>
          <p>No trips match your filters.</p>
        </div>
      ) : (
        <div className="trip-grid">
          {filtered.map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>
      )}
    </div>
  );
}
