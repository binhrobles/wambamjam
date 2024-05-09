const map = new L.Map('map');
window.map = map;
map.setView([40.693, -73.985], 14, false);

new L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© Map tiles <a href="https://mapbox.com">Mapbox</a>',
  maxZoom: 18,
  maxNativeZoom: 20
}).addTo(map);


// ------ control initialization ------ //
const control = L.control({ position: 'topleft' });
const controlDiv = L.DomUtil.create('div', 'control');
L.DomEvent
  .disableClickPropagation(controlDiv)
  .disableScrollPropagation(controlDiv);

control.onAdd = () => {
  control.update();
  return controlDiv;
};

control.update = () => {
  controlDiv.innerHTML = `<button id="sampleButton">button</button>`
};

control.addTo(map);

