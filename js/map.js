const map = new L.Map('map');
window.map = map;
map.setView([40.693, -73.985], 14, false);

new L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  maxZoom: 18,
  maxNativeZoom: 20
}).addTo(map);
new OSMBuildings(map).load('https://{s}-data.onegeo.co/maps/tiles/{z}/{x}/{y}.json?token=ixsfbgbwi5g2rsp7', { fixedZoom: 15 });

// ------ control initialization ------ //
window.control = L.control({ position: 'topleft' });
const controlDiv = L.DomUtil.create('div', 'control');
L.DomEvent
  .disableClickPropagation(controlDiv)
  .disableScrollPropagation(controlDiv);

window.control.onAdd = () => {
  control.update();
  return controlDiv;
};

window.control.update = () => {
  let audioButton;
  if (window.isPlaying) {
    audioButton = `<button onclick="toggleSound()">&#128263;</button>`
  } else {
    audioButton = `<button onclick="toggleSound()">&#128264;</button>`
  }

  controlDiv.innerHTML = `
    <div id="control">
      ${audioButton}
    </div>
  `;
};

window.control.addTo(map);

