const map = new L.Map('map');
window.map = map;
map.setView([40.693, -73.985], 14, false);

new L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© Map tiles <a href="https://mapbox.com">Mapbox</a>',
  maxZoom: 18,
  maxNativeZoom: 20
}).addTo(map);
