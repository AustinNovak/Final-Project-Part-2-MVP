// LogTrip.jsx
// Multi-step form: location (with autocomplete) → trip details → notes.
// Weather is automatically fetched from the selected coordinates.
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTrip } from "../context/TripContext";
import LocationAutocomplete from "../components/LocationAutocomplete";
import { fetchWeatherByCoords } from "../services/weatherService";

const TRIP_TYPES = [
  { value: "fishing",  label: "🎣 Fishing" },
  { value: "hunting",  label: "🦌 Hunting" },
  { value: "hiking",   label: "🥾 Hiking" },
  { value: "camping",  label: "⛺ Camping" },
  { value: "other",    label: "🌲 Other" },
];

export default function LogTrip() {
  const { addTrip } = useTrip();
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1 = basics, 2 = details
  const [location, setLocation] = useState(null); // { shortName, displayName, lat, lon }
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [tripType, setTripType] = useState("fishing");
  const [species, setSpecies] = useState("");
  const [notes, setNotes] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!location) { setError("Please select a location."); return; }
    setError("");
    setSubmitting(true);

    let weather = null;
    try {
      weather = await fetchWeatherByCoords(location.lat, location.lon);
    } catch {
      // Weather is optional — don't block the save
    }

    const trip = addTrip({
      location: location.shortName,
      locationFull: location.displayName,
      lat: location.lat,
      lon: location.lon,
      date,
      tripType,
      species: species.trim(),
      notes: notes.trim(),
      isPublic,
      weather,
    });

    setSubmitting(false);
    navigate(`/trips/${trip.id}`);
  }

  return (
    <div className="log-page">
      <div className="log-card">
        {/* Header */}
        <div className="log-header">
          <h2>Log a New Trip</h2>
          <div className="log-steps">
            <span className={`step-dot ${step >= 1 ? "active" : ""}`}>1</span>
            <span className="step-line" />
            <span className={`step-dot ${step >= 2 ? "active" : ""}`}>2</span>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <div className="form-step">
              <div className="form-group">
                <label>Location</label>
                <LocationAutocomplete onSelect={setLocation} value={location} />
                {location && (
                  <p className="location-confirm">✓ {location.shortName}</p>
                )}
              </div>

              <div className="form-group">
                <label>Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Trip Type</label>
                <div className="type-grid">
                  {TRIP_TYPES.map((t) => (
                    <button
                      key={t.value}
                      type="button"
                      className={`type-btn ${tripType === t.value ? "selected" : ""}`}
                      onClick={() => setTripType(t.value)}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {error && <p className="form-error">{error}</p>}

              <button
                type="button"
                className="btn-primary"
                onClick={() => {
                  if (!location) { setError("Please select a location first."); return; }
                  setError("");
                  setStep(2);
                }}
              >
                Next: Add Details →
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="form-step">
              <div className="form-group">
                <label>
                  {tripType === "fishing" ? "Species Targeted / Caught" :
                   tripType === "hunting" ? "Game / Species" :
                   "Target / Goal"}
                </label>
                <input
                  type="text"
                  placeholder={
                    tripType === "fishing" ? "e.g. Largemouth Bass, Crappie…" :
                    tripType === "hunting" ? "e.g. White-tail Deer, Turkey…" :
                    "e.g. Summit hike, Overnight camp…"
                  }
                  value={species}
                  onChange={(e) => setSpecies(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Trip Notes</label>
                <textarea
                  placeholder="What happened? Conditions, success, tips for next time…"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={5}
                />
              </div>

              <div className="form-group">
                <label className="toggle-label">
                  <span>Visibility</span>
                  <div className="toggle-row">
                    <button
                      type="button"
                      className={`vis-btn ${!isPublic ? "selected" : ""}`}
                      onClick={() => setIsPublic(false)}
                    >
                      🔒 Personal
                    </button>
                    <button
                      type="button"
                      className={`vis-btn ${isPublic ? "selected" : ""}`}
                      onClick={() => setIsPublic(true)}
                    >
                      🌐 Public
                    </button>
                  </div>
                </label>
                <p className="hint">
                  {isPublic
                    ? "Anyone with the link can view this trip."
                    : "Only visible to you in your journal."}
                </p>
              </div>

              <div className="btn-row">
                <button type="button" className="btn-secondary" onClick={() => setStep(1)}>
                  ← Back
                </button>
                <button type="submit" className="btn-primary" disabled={submitting}>
                  {submitting ? "Saving…" : "Save Trip ✓"}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
