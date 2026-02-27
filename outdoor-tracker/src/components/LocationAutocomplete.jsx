// LocationAutocomplete.jsx
// Debounced location search using free Nominatim API.
// Shows a dropdown of results; user can also use their GPS location.
import { useState, useEffect, useRef } from "react";
import { searchLocations, reverseGeocode } from "../services/locationService";

export default function LocationAutocomplete({ onSelect, value }) {
  const [query, setQuery] = useState(value?.shortName || "");
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);
  const debounceRef = useRef(null);
  const containerRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Debounce search
  useEffect(() => {
    clearTimeout(debounceRef.current);
    if (query.length < 3) { setResults([]); setOpen(false); return; }

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await searchLocations(query);
        setResults(data);
        setOpen(data.length > 0);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(debounceRef.current);
  }, [query]);

  function handleSelect(place) {
    setQuery(place.shortName);
    setOpen(false);
    onSelect(place);
  }

  async function handleGPS() {
    if (!navigator.geolocation) return;
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const place = await reverseGeocode(pos.coords.latitude, pos.coords.longitude);
          setQuery(place.shortName);
          onSelect(place);
        } catch {
          // ignore
        } finally {
          setGpsLoading(false);
        }
      },
      () => setGpsLoading(false)
    );
  }

  return (
    <div className="autocomplete-wrap" ref={containerRef}>
      <div className="autocomplete-input-row">
        <input
          type="text"
          className="autocomplete-input"
          placeholder="Search location (city, lake, park…)"
          value={query}
          onChange={(e) => { setQuery(e.target.value); if (!e.target.value) onSelect(null); }}
          onFocus={() => results.length > 0 && setOpen(true)}
          autoComplete="off"
        />
        <button
          type="button"
          className="gps-btn"
          onClick={handleGPS}
          title="Use my location"
          disabled={gpsLoading}
        >
          {gpsLoading ? "…" : "📍"}
        </button>
      </div>
      {loading && <div className="autocomplete-loading">Searching…</div>}
      {open && results.length > 0 && (
        <ul className="autocomplete-list">
          {results.map((r) => (
            <li key={r.placeId} onClick={() => handleSelect(r)} className="autocomplete-item">
              <span className="autocomplete-short">{r.shortName}</span>
              <span className="autocomplete-full">{r.displayName}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
