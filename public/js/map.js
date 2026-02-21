mapboxgl.accessToken = mapToken;

const defaultCoords = [79.06, 14.73];
const centerCoords = coordinates.length === 2 ? coordinates : defaultCoords;

const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/streets-v12",
  center: centerCoords,
  zoom: 9,
});

console.log("Coordinates:", coordinates);

// ✅ ADD MARKER
if (coordinates.length === 2) {
  new mapboxgl.Marker({ color: "red" })
    .setLngLat(coordinates)
    .setPopup(new mapboxgl.Popup({offset: 25})
    .setHTML(`<h4>${listing.location}</h4><p>Exact Location provided after booking</p>`))
    .addTo(map);
}