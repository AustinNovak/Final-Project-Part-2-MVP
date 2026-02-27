# 🌲 Outdoor Tracker

A single-page React application for hunters, anglers, hikers, and campers to log outdoor trips with automatic weather data, interactive maps, and personal notes.

**Live Demo:** [Deploy to Vercel — see instructions below]

---

## Features

- **Location Autocomplete** — Type any lake, park, or city and get instant suggestions via OpenStreetMap Nominatim (free, no API key)
- **GPS Detection** — One-tap "use my location" button
- **Trip Types** — Fishing, Hunting, Hiking, Camping, Other
- **Automatic Weather Snapshot** — Open-Meteo API captures temperature, conditions, wind, and humidity at the time of logging (free, no API key)
- **Interactive Map** — Leaflet + OpenStreetMap pin on every trip detail page
- **Notes & Species Tracking** — Record what you caught, spotted, or did
- **Public / Personal visibility toggle**
- **Filter & Search** — Filter trips by type, search by location or notes
- **Persistent Storage** — Trips saved to localStorage across sessions
- **Responsive Design** — Mobile-first, works great in the field

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + Vite |
| Routing | React Router v7 |
| State | useState + Context API + localStorage |
| Location Search | Nominatim (OpenStreetMap) — free |
| Weather | Open-Meteo API — free, no key |
| Maps | Leaflet.js + OpenStreetMap — free |
| Styling | Vanilla CSS with custom properties |
| Testing | Vitest + React Testing Library |

---

## Setup & Installation

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/outdoor-tracker.git
cd outdoor-tracker

# Install dependencies
npm install

# Start development server
npm run dev
```

> **No API keys required!** All APIs used are free and open.

---

## Routes

| Route | Description |
|---|---|
| `/` | Home dashboard — hero, stats, recent trips |
| `/log` | Log a new trip (2-step form) |
| `/trips` | All trips with filter + search |
| `/trips/:id` | Full trip detail — map, weather, notes |
| `/about` | About the app and tech stack |

---

## API Documentation

### Open-Meteo (Weather)
- **Base URL:** `https://api.open-meteo.com/v1/forecast`
- **Auth:** None required
- **Data used:** temperature, wind speed, humidity, weather code
- **Docs:** https://open-meteo.com/en/docs

### Nominatim (Location Search)
- **Base URL:** `https://nominatim.openstreetmap.org`
- **Auth:** None required
- **Usage policy:** Max 1 request/second, include User-Agent
- **Docs:** https://nominatim.org/release-docs/latest/api/Search/

---

## Deployment (Vercel)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Follow prompts — no environment variables needed
```

Or connect your GitHub repo directly at [vercel.com](https://vercel.com).

---

## Future Improvements

- [ ] User authentication (register/login with JWT)
- [ ] Backend database (PostgreSQL) for cross-device sync
- [ ] Photo upload for catches and sightings
- [ ] Favorites / saved locations list
- [ ] Species database integration (fishing regulations API)
- [ ] Export trip log as PDF
- [ ] Social sharing of public trips
- [ ] Trip statistics dashboard (totals by species, best locations)

---

*Built as a React SPA final project — Austin Novak*
