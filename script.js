// Initialize the map centered over Europe
var map = L.map('map').setView([50, 10], 5);

// Add the OpenStreetMap tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Load the GeoJSON file for corridors
fetch('data/chargers_with_corridors.geojson')
  .then(response => {
    if (!response.ok) {
      throw new Error("GeoJSON file not found or not reachable.");
    }
    return response.json();
  })
  .then(data => {
    L.geoJSON(data, {
      style: {
        color: 'blue',
        weight: 3,
        opacity: 0.7
      },
      onEachFeature: function (feature, layer) {
        if (feature.properties && feature.properties.name) {
          layer.bindPopup("Corridor: " + feature.properties.name);
        }
      }
    }).addTo(map);
  })
  .catch(error => {
    console.error("Error loading GeoJSON:", error);
  });
