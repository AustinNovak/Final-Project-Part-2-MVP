// Header.jsx — Sticky nav with mobile hamburger
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="navbar">
      <div className="nav-container">
        <Link to="/" className="logo">
          <span className="logo-icon">🌲</span> Outdoor Tracker
        </Link>

        {/* Desktop nav */}
        <nav className="nav-links">
          <NavLink to="/" end className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>Home</NavLink>
          <NavLink to="/log" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>Log Trip</NavLink>
          <NavLink to="/trips" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>My Trips</NavLink>
          <NavLink to="/about" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>About</NavLink>
        </nav>

        {/* Hamburger */}
        <button className="hamburger" onClick={() => setOpen(!open)} aria-label="Menu">
          <span className={`ham-bar ${open ? "open" : ""}`} />
          <span className={`ham-bar ${open ? "open" : ""}`} />
          <span className={`ham-bar ${open ? "open" : ""}`} />
        </button>
      </div>

      {/* Mobile nav */}
      {open && (
        <nav className="mobile-nav">
          <NavLink to="/" end onClick={() => setOpen(false)}>Home</NavLink>
          <NavLink to="/log" onClick={() => setOpen(false)}>Log Trip</NavLink>
          <NavLink to="/trips" onClick={() => setOpen(false)}>My Trips</NavLink>
          <NavLink to="/about" onClick={() => setOpen(false)}>About</NavLink>
        </nav>
      )}
    </header>
  );
}
