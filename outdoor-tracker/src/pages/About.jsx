// About.jsx
export default function About() {
  return (
    <div className="about-section">
      <h2>About Outdoor Tracker</h2>
      <p>
        Outdoor Tracker is a personal adventure journal built for hunters, anglers,
        hikers, and campers. Log trips, pin locations on a map, record what you caught
        or spotted, and capture weather conditions — all from a single app.
      </p>
      <p>
        Every trip is saved with a weather snapshot pulled automatically from
        <strong> Open-Meteo</strong> (free, no API key needed) and a pin on an
        interactive <strong>OpenStreetMap</strong> map via Leaflet. Location autocomplete
        is powered by <strong>Nominatim</strong>, also completely free.
      </p>
      <p>
        Your trip journal persists across sessions — data is saved locally in your
        browser, with a backend-connected version coming in a future update.
      </p>
      <div className="about-tech">
        {["React 19","React Router v7","Open-Meteo API","Nominatim / OSM","Leaflet.js","Vite","CSS Variables"].map(t => (
          <span key={t} className="tech-tag">{t}</span>
        ))}
      </div>
    </div>
  );
}
