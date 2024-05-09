const map = new L.Map('map');
window.map = map;
map.setView([40.693, -73.985], 14, false);

new L.tileLayer('https://tiles.stadiamaps.com/tiles/stamen_toner_background/{z}/{x}/{y}{r}.png', {
  attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://www.stamen.com/" target="_blank">Stamen Design</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  maxZoom: 18,
  maxNativeZoom: 20
}).addTo(map);
var osmb = new OSMBuildings(map).load('https://{s}.data.osmbuildings.org/0.2/anonymous/tile/{z}/{x}/{y}.json');


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

