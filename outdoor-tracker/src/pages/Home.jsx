// Home.jsx — Dashboard: hero + recent trips + quick stats
import { Link } from "react-router-dom";
import { useTrip } from "../context/TripContext";
import TripCard from "../components/TripCard";
import heroImg from "../assets/hero.jpg";

const TYPE_META = {
  fishing: { icon: "🎣", label: "Fishing" },
  hunting: { icon: "🦌", label: "Hunting" },
  hiking:  { icon: "🥾", label: "Hiking" },
  camping: { icon: "⛺", label: "Camping" },
  other:   { icon: "🌲", label: "Other" },
};

export default function Home() {
  const { trips } = useTrip();
  const recent = trips.slice(0, 3);

  // Quick stats
  const typeCounts = trips.reduce((acc, t) => {
    acc[t.tripType] = (acc[t.tripType] || 0) + 1;
    return acc;
  }, {});
  const topType = Object.entries(typeCounts).sort((a, b) => b[1] - a[1])[0];

  return (
    <>
      {/* Hero */}
      <section className="hero">
        <img src={heroImg} alt="Outdoor adventure" className="hero-bg" />
        <div className="hero-overlay">
          <span className="hero-eyebrow">🌲 Your Outdoor Journal</span>
          <h2>Track Every<br />Adventure.</h2>
          <p>
            Log fishing trips, hunting spots, hikes, and camps — with
            automatic weather snapshots and map pins for every location.
          </p>
          <div className="hero-cta-row">
            <Link to="/log" className="hero-btn">Log a Trip</Link>
            {trips.length > 0 && (
              <Link to="/trips" className="hero-btn-ghost">View Journal →</Link>
            )}
          </div>
        </div>
      </section>

      {/* Stats bar (only if trips exist) */}
      {trips.length > 0 && (
        <section className="stats-bar">
          <div className="stats-inner">
            <div className="stat-item">
              <span className="stat-num">{trips.length}</span>
              <span className="stat-label">Total Trips</span>
            </div>
            {topType && (
              <div className="stat-item">
                <span className="stat-num">
                  {TYPE_META[topType[0]]?.icon} {topType[1]}
                </span>
                <span className="stat-label">
                  {TYPE_META[topType[0]]?.label} Trips
                </span>
              </div>
            )}
            <div className="stat-item">
              <span className="stat-num">
                {new Set(trips.map((t) => t.location)).size}
              </span>
              <span className="stat-label">Unique Locations</span>
            </div>
          </div>
        </section>
      )}

      {/* Recent trips */}
      {recent.length > 0 && (
        <section className="recent-section">
          <div className="recent-inner">
            <div className="recent-header">
              <h3>Recent Trips</h3>
              <Link to="/trips" className="see-all">See all →</Link>
            </div>
            <div className="trip-grid">
              {recent.map((t) => <TripCard key={t.id} trip={t} />)}
            </div>
          </div>
        </section>
      )}

      {/* Empty CTA */}
      {trips.length === 0 && (
        <section className="home-empty">
          <div className="home-empty-inner">
            <p className="home-empty-icon">🗺️</p>
            <h3>Start Your Outdoor Journal</h3>
            <p>Log your first trip and get automatic weather data, map pins, and notes — all in one place.</p>
            <Link to="/log" className="btn-accent" style={{marginTop:"1.5rem",display:"inline-block"}}>
              Log Your First Trip
            </Link>
          </div>
        </section>
      )}
    </>
  );
}
