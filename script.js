// 1. Initialize the map
const map = L.map('map').setView([50, 10], 5);  // adjust center if needed

// 2. Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 18
}).addTo(map);

// 3. Load your GeoJSON file (with corridor labels)
fetch("data/chargers_with_corridors.geojson")
  .then(response => response.json())
  .then(data => {
    L.geoJSON(data, {
      pointToLayer: function (feature, latlng) {
        const corridor = feature.properties.corridor;
        const color = getColorByCorridor(corridor);
        return L.circleMarker(latlng, {
          radius: 6,
          fillColor: color,
          color: "#000",
          weight: 1,
          fillOpacity: 0.8
        });
      },
      onEachFeature: function (feature, layer) {
        layer.bindPopup(`Corridor: ${feature.properties.corridor}`);
      }
    }).addTo(map);
  });

// 4. Function to choose color based on corridor label
function getColorByCorridor(corridor) {
  const colors = [
    "#1f77b4", "#ff7f0e", "#2ca02c", "#d62728",
    "#9467bd", "#8c564b", "#e377c2", "#7f7f7f",
    "#bcbd22", "#17becf"
  ];
  if (corridor === -1) return "#999";  // -1 = noise (unclustered)
  return colors[corridor % colors.length];
}
