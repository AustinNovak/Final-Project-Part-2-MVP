// locationService.js
// Uses Nominatim (OpenStreetMap) — 100% free, no API key required.
// Usage policy: include a descriptive User-Agent and don't exceed 1 req/sec.

const BASE = "https://nominatim.openstreetmap.org";

/**
 * Autocomplete: search for place names as the user types.
 * Returns array of { displayName, lat, lon, placeId }
 */
export async function searchLocations(query) {
  if (!query || query.length < 3) return [];

  const params = new URLSearchParams({
    q: query,
    format: "json",
    limit: 6,
    addressdetails: 1,
  });

  const res = await fetch(`${BASE}/search?${params}`, {
    headers: { "Accept-Language": "en" },
  });

  if (!res.ok) throw new Error("Location search failed");

  const data = await res.json();

  return data.map((item) => ({
    displayName: item.display_name,
    shortName: buildShortName(item),
    lat: parseFloat(item.lat),
    lon: parseFloat(item.lon),
    placeId: item.place_id,
  }));
}

/**
 * Reverse geocode: get place name from lat/lon (for browser geolocation)
 */
export async function reverseGeocode(lat, lon) {
  const params = new URLSearchParams({ lat, lon, format: "json" });
  const res = await fetch(`${BASE}/reverse?${params}`, {
    headers: { "Accept-Language": "en" },
  });
  if (!res.ok) throw new Error("Reverse geocode failed");
  const data = await res.json();
  return {
    displayName: data.display_name,
    shortName: buildShortName(data),
    lat: parseFloat(data.lat),
    lon: parseFloat(data.lon),
  };
}

function buildShortName(item) {
  const a = item.address || {};
  const parts = [
    a.hamlet || a.village || a.town || a.city || a.county || item.name,
    a.state || a.region,
    a.country,
  ].filter(Boolean);
  return parts.slice(0, 3).join(", ");
}
