// TripCard.jsx — Summary card for a single trip in the grid view
import { Link } from "react-router-dom";

const TYPE_META = {
  fishing: { icon: "🎣", color: "#38bdf8" },
  hunting: { icon: "🦌", color: "#fb923c" },
  hiking:  { icon: "🥾", color: "#a3e635" },
  camping: { icon: "⛺", color: "#c084fc" },
  other:   { icon: "🌲", color: "#4ade80" },
};

export default function TripCard({ trip }) {
  const meta = TYPE_META[trip.tripType] || TYPE_META.other;
  const formattedDate = trip.date
    ? new Date(trip.date + "T12:00:00").toLocaleDateString("en-US", {
        month: "short", day: "numeric", year: "numeric",
      })
    : null;

  return (
    <Link to={`/trips/${trip.id}`} className="trip-card">
      <div className="trip-card-top">
        <span className="trip-type-icon" style={{ color: meta.color }}>{meta.icon}</span>
        {trip.isPublic !== undefined && (
          <span className="trip-vis">{trip.isPublic ? "🌐" : "🔒"}</span>
        )}
      </div>
      <h3 className="trip-card-location">{trip.location}</h3>
      {trip.species && <p className="trip-card-species">{trip.species}</p>}
      <div className="trip-card-footer">
        {formattedDate && <span className="trip-card-date">{formattedDate}</span>}
        {trip.weather && (
          <span className="trip-card-weather">
            {trip.weather.tempF}°F · {trip.weather.conditions}
          </span>
        )}
      </div>
      <span className="trip-card-arrow">→</span>
    </Link>
  );
}
