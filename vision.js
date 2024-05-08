import {
  HandLandmarker,
  FilesetResolver
} from "./node_modules/@mediapipe/tasks-vision/vision_bundle.mjs";

let handLandmarker = null;

const createHandLandmarker = async () => {
  const vision = await FilesetResolver.forVisionTasks(
    "./node_modules/@mediapipe/tasks-vision/wasm"
  );
  handLandmarker = await HandLandmarker.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath: `./hand_landmarker.task`,
      delegate: "GPU"
    },
    runningMode: 'VIDEO',
    numHands: 2
  });
};
createHandLandmarker();

let circleLayer = null;

const updateCircle = (point1, point2) => {
  /*
  const center = {x: (point1.x + point2.x)/2, y: (point1.y + point2.y)/2};
  const dist = Math.sqrt(Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2));
  console.log(`center at (${center.x}, ${center.y}), dist is ${dist}`);
  */
  point1.x = 1 - point1.x;
  point2.x = 1 - point2.x;

  const map = window.map;
  const mapSize = map.getSize();
  const mapWidth = mapSize.x;
  const mapHeight = mapSize.y;
  const mapPoint1 = L.point(mapWidth * point1.x, mapHeight * point1.y);
  const mapPoint2 = L.point(mapWidth * point2.x, mapHeight * point2.y);
  const latLng1 = map.containerPointToLatLng(mapPoint1);
  const latLng2 = map.containerPointToLatLng(mapPoint2);
  const dist = map.distance(latLng1, latLng2);
  const center = L.LineUtil.polylineCenter([latLng1, latLng2], map.options.crs);

  console.log(`center at ${center}, dist is ${dist}`);

  if (!circleLayer) {
    circleLayer = L.circle(center, {radius: dist/2}).addTo(map);
  } else {
    circleLayer.setLatLng(center);
    circleLayer.setRadius(dist/2);
  }
};

const video = document.getElementById("webcam");

let lastVideoTime = -1;
let results = null;
const predict = async () => {
  let startTimeMs = performance.now();
  if (lastVideoTime !== video.currentTime) {
    lastVideoTime = video.currentTime;
    results = handLandmarker.detectForVideo(video, startTimeMs);
  }
  if (results?.landmarks.length >= 2) {
    // 8 is index finger tip
    updateCircle(results.landmarks[0][8], results.landmarks[1][8]);
  }

  window.requestAnimationFrame(predict);
};

const enableCam = () => {
  if (!handLandmarker) {
    console.log("not ready yet");
    return;
  }

  navigator.mediaDevices.getUserMedia({video: true}).then(stream => {
    video.srcObject = stream;
    video.addEventListener("loadeddata", predict);
  });
};

document.getElementById("enableVision").onclick = enableCam;
