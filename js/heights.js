const heightsBuffer = await(await fetch("data/heights.dat")).arrayBuffer();
const heights = new Float32Array(heightsBuffer);

const bushBuffer = await(await fetch("data/bush.dat")).arrayBuffer();
const bush = KDBush.from(bushBuffer);

let layerGroup = null;

window.handleCircle = (circle) => {
  const bounds = circle.getBounds();
  // console.log(bounds);
  const withinBounds = bush.range(bounds.getSouth(), bounds.getWest(), bounds.getNorth(), bounds.getEast());
  if (withinBounds.length > 100) {
    console.log(`${withinBounds.length} points is too many!`);
    return;
  }
  const markers = [];

  // objects of { height: number, distance: number, }
  const buildingData = [];
  for (const i of withinBounds) {
    const [x, y, height] = heights.slice(i * 3, i * 3 + 3);
    const distance = window.map.distance(circle.getLatLng(), L.latLng(x, y));
    if (distance > circle.getRadius()) {
      continue;
    }

    markers.push(L.marker([x, y]));

    buildingData.push({ height, distance });
  }
  if (layerGroup) {
    layerGroup.remove();
  }
  layerGroup = L.layerGroup(markers).addTo(window.map);
  window.change_heights(buildingData);
};
