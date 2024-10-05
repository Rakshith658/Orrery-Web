import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  3000
);
const renderer = new THREE.WebGLRenderer();
const loader = new THREE.TextureLoader();
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
camera.position.setZ(50);
camera.position.setX(200);
camera.position.setY(20);
let timestamp = 0;

// Lights
const pointLight = new THREE.PointLight(0xffffff, 2, 0, 2);
const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
pointLight.position.set(0, 0, 0);
scene.add(pointLight, ambientLight);

// Mouse controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.minDistance = 50;
controls.maxDistance = 900;
controls.enabled = true;
const minPan = new THREE.Vector3(-400, -400, -400);
const maxPan = new THREE.Vector3(400, 400, 400);

var _v = new THREE.Vector3();

controls.addEventListener("change", function () {
  _v.copy(controls.target);
  controls.target.clamp(minPan, maxPan);
  _v.sub(controls.target);
  camera.position.sub(_v);
});

// Set background image
const bg = loader.load(require("../assets/stars_milky_way.jpeg"));
// scene.background = bg;
const bgSphere = new THREE.Mesh(
  new THREE.BoxGeometry(2800, 2800, 2800),
  new THREE.MeshBasicMaterial({
    map: bg,
    side: THREE.DoubleSide,
  })
);
scene.add(bgSphere);

// Create all planets and add them to the scene
// sun
const sunTexture = loader.load(require("../assets/sun.jpeg"));
const sun = new THREE.Mesh(
  new THREE.SphereGeometry(40, 32, 32),
  new THREE.MeshBasicMaterial({ map: sunTexture })
);
scene.add(sun);

// mercury
const mercuryGeo = new THREE.SphereGeometry(2, 32, 32);
const mercuryTexture = loader.load(require("../assets/mercury.jpeg"));
const mercuryMaterial = new THREE.MeshStandardMaterial({ map: mercuryTexture });
const mercury = new THREE.Mesh(mercuryGeo, mercuryMaterial);
mercury.position.set(0, 0, 60);
scene.add(mercury);
// mercury orbit path visualization
const mercuryPath = new THREE.RingGeometry(60, 60.5, 100);
const mercuryPathMaterial = new THREE.MeshBasicMaterial({
  color: 0xffffff,
  opacity: 0.5,
  transparent: true,
  side: THREE.DoubleSide,
});
const mercuryPathMesh = new THREE.Mesh(mercuryPath, mercuryPathMaterial);
mercuryPathMesh.rotateX(Math.PI / 2);
mercuryPathMesh.rotateY(-0.15);
scene.add(mercuryPathMesh);

// venus
const venusGeo = new THREE.SphereGeometry(4, 32, 32);
const venusTexture = loader.load(require("../assets/venus.jpeg"));
const venusMaterial = new THREE.MeshStandardMaterial({ map: venusTexture });
const venus = new THREE.Mesh(venusGeo, venusMaterial);
venus.position.set(0, 0, 80);
scene.add(venus);
// venus orbit path visualization
const venusPath = new THREE.RingGeometry(80, 80.5, 100);
const venusPathMaterial = new THREE.MeshBasicMaterial({
  color: 0xffffff,
  opacity: 0.5,
  transparent: true,
  side: THREE.DoubleSide,
});
const venusPathMesh = new THREE.Mesh(venusPath, venusPathMaterial);
venusPathMesh.rotateX(Math.PI / 2);
scene.add(venusPathMesh);

// earth
const earthGeo = new THREE.SphereGeometry(4, 32, 32);
const earthTexture = loader.load(require("../assets/earth.jpeg"));
const earthMaterial = new THREE.MeshStandardMaterial({ map: earthTexture });
const earth = new THREE.Mesh(earthGeo, earthMaterial);
earth.position.set(0, 0, 100);
earth.rotateX(0.5);

scene.add(earth);

// earth orbit path visualization
const earthPath = new THREE.RingGeometry(100, 100.5, 100);
const earthPathMaterial = new THREE.MeshBasicMaterial({
  color: "#0000FF",
  opacity: 1,
  transparent: true,
  side: THREE.DoubleSide,
});
const earthPathMesh = new THREE.Mesh(earthPath, earthPathMaterial);
earthPathMesh.rotateX(Math.PI / 2);
earth.rotateY(-0.09);
scene.add(earthPathMesh);

// moon
const moonGeo = new THREE.SphereGeometry(1, 32, 32);
const moonTexture = loader.load(require("../assets/moon.jpeg"));
const moonMaterial = new THREE.MeshStandardMaterial({ map: moonTexture });
const moon = new THREE.Mesh(moonGeo, moonMaterial);
moon.position.set(10, 0, 0); // Initial position relative to Earth
earth.add(moon); // Add moon as a child of earth

// moon orbit path visualization
const moonPath = new THREE.RingGeometry(10, 10.2, 64);
const moonPathMaterial = new THREE.MeshBasicMaterial({
  color: 0xffffff,
  opacity: 0.5,
  transparent: true,
  side: THREE.DoubleSide,
});
const moonPathMesh = new THREE.Mesh(moonPath, moonPathMaterial);
moonPathMesh.rotateX(Math.PI / 2);
earth.add(moonPathMesh);

// ISS
const issGeo = new THREE.BoxGeometry(0.2, 0.2, 0.3);
const issMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
const iss = new THREE.Mesh(issGeo, issMaterial);
iss.position.set(5, 0, 0); // Initial position relative to Earth
earth.add(iss); // Add ISS as a child of earth

// ISS orbit path visualization
const issPath = new THREE.RingGeometry(5, 5.05, 64);
const issPathMaterial = new THREE.MeshBasicMaterial({
  color: 0x00ff00,
  opacity: 0.5,
  transparent: true,
  side: THREE.DoubleSide,
});
const issPathMesh = new THREE.Mesh(issPath, issPathMaterial);
issPathMesh.rotateX(Math.PI / 2);
earth.add(issPathMesh);

// mars
const marsGeo = new THREE.SphereGeometry(3, 32, 32);
const marsTexture = loader.load(require("../assets/mars.jpeg"));
const marsMaterial = new THREE.MeshStandardMaterial({ map: marsTexture });
const mars = new THREE.Mesh(marsGeo, marsMaterial);
mars.position.set(0, 0, 120);
mars.rotateX(0.5);
scene.add(mars);
// mars orbit path visualization
const marsPath = new THREE.RingGeometry(120, 120.5, 100);
const marsPathMaterial = new THREE.MeshBasicMaterial({
  color: 0xffffff,
  opacity: 0.5,
  transparent: true,
  side: THREE.DoubleSide,
});
const marsPathMesh = new THREE.Mesh(marsPath, marsPathMaterial);
marsPathMesh.rotateX(Math.PI / 2);
scene.add(marsPathMesh);

// jupiter
const jupiterGeo = new THREE.SphereGeometry(10, 32, 32);
const jupiterTexture = loader.load(require("../assets/jupiter.jpeg"));
const jupiterMaterial = new THREE.MeshStandardMaterial({ map: jupiterTexture });
const jupiter = new THREE.Mesh(jupiterGeo, jupiterMaterial);
jupiter.position.set(0, 0, 160);
scene.add(jupiter);
// jupiter orbit path visualization
const jupiterPath = new THREE.RingGeometry(160, 160.5, 100);
const jupiterPathMaterial = new THREE.MeshBasicMaterial({
  color: 0xffffff,
  opacity: 0.5,
  transparent: true,
  side: THREE.DoubleSide,
});
const jupiterPathMesh = new THREE.Mesh(jupiterPath, jupiterPathMaterial);
jupiterPathMesh.rotateX(Math.PI / 2);
scene.add(jupiterPathMesh);

// saturn
const saturnGeo = new THREE.SphereGeometry(9.5, 32, 32);
const saturnTexture = loader.load(require("../assets/saturn.jpeg"));
const saturnMaterial = new THREE.MeshStandardMaterial({ map: saturnTexture });
const saturn = new THREE.Mesh(saturnGeo, saturnMaterial);
saturn.position.set(0, 0, 200);
saturn.rotateX(0.55);
scene.add(saturn);
// saturn orbit path visualization
const saturnPath = new THREE.RingGeometry(200, 200.5, 100);
const saturnPathMaterial = new THREE.MeshBasicMaterial({
  color: 0xffffff,
  opacity: 0.5,
  transparent: true,
  side: THREE.DoubleSide,
});
const saturnPathMesh = new THREE.Mesh(saturnPath, saturnPathMaterial);
saturnPathMesh.rotateX(Math.PI / 2);
scene.add(saturnPathMesh);

// uranus
const uranusGeo = new THREE.SphereGeometry(6, 32, 32);
const uranusTexture = loader.load(require("../assets/uranus.jpeg"));
const uranusMaterial = new THREE.MeshStandardMaterial({ map: uranusTexture });
const uranus = new THREE.Mesh(uranusGeo, uranusMaterial);
uranus.position.set(0, 0, 240);
uranus.rotateX(1);
scene.add(uranus);
// uranus orbit path visualization
const uranusPath = new THREE.RingGeometry(240, 240.5, 100);
const uranusPathMaterial = new THREE.MeshBasicMaterial({
  color: 0xffffff,
  opacity: 0.5,
  transparent: true,
  side: THREE.DoubleSide,
});
const uranusPathMesh = new THREE.Mesh(uranusPath, uranusPathMaterial);
uranusPathMesh.rotateX(Math.PI / 2);
uranusPathMesh.rotateY(Math.sin(0.1) * -0.5);
scene.add(uranusPathMesh);

// neptune
const neptuneGeo = new THREE.SphereGeometry(6, 32, 32);
const neptuneTexture = loader.load(require("../assets/neptune.jpeg"));
const neptuneMaterial = new THREE.MeshStandardMaterial({ map: neptuneTexture });
const neptune = new THREE.Mesh(neptuneGeo, neptuneMaterial);
neptune.rotateX(0.6);
neptune.position.set(0, 0, 280);
scene.add(neptune);
// neptune orbit path visualization
const neptunePath = new THREE.RingGeometry(280, 280.5, 100);
const neptunePathMaterial = new THREE.MeshBasicMaterial({
  color: 0xffffff,
  opacity: 0.5,
  transparent: true,
  side: THREE.DoubleSide,
});
const neptunePathMesh = new THREE.Mesh(neptunePath, neptunePathMaterial);
neptunePathMesh.rotateX(Math.PI / 2);
scene.add(neptunePathMesh);

// pluto
const plutoGeo = new THREE.SphereGeometry(2, 32, 32);
const plutoTexture = loader.load(require("../assets/pluto.png"));
const plutoMaterial = new THREE.MeshStandardMaterial({ map: plutoTexture });
const pluto = new THREE.Mesh(plutoGeo, plutoMaterial);
pluto.position.set(0, 0, 340);
scene.add(pluto);
// pluto orbit path visualization
const plutoPath = new THREE.RingGeometry(340, 340.5, 100);
const plutoPathMaterial = new THREE.MeshBasicMaterial({
  color: 0xffffff,
  opacity: 0.5,
  transparent: true,
  side: THREE.DoubleSide,
});
const plutoPathMesh = new THREE.Mesh(plutoPath, plutoPathMaterial);
plutoPathMesh.rotateX(Math.PI / 2);
plutoPathMesh.rotateY(Math.sin(0.1) * 0.55);
scene.add(plutoPathMesh);

// saturn ring
const saturnRingGeo = new THREE.RingGeometry(15, 20, 32);
const saturnRingTexture = loader.load(require("../assets/saturn-ring.png"));
const saturnRingMaterial = new THREE.MeshStandardMaterial({
  map: saturnRingTexture,
  side: THREE.DoubleSide,
  transparent: true,
  opacity: 0.8,
});
const saturnRing = new THREE.Mesh(saturnRingGeo, saturnRingMaterial);
saturnRing.rotateX(45);
saturnRing.position.set(0, 0, 200);
scene.add(saturnRing);

// factors for slider
let orbitFactor = 0.5;
let rotateFactor = 0.5;

const freeLook = () => {
  camera.position.setZ(50);
  camera.position.setX(200);
  camera.position.setY(20);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.minDistance = 50;
  controls.maxDistance = 900;
  controls.enabled = true;
  const minPan = new THREE.Vector3(-400, -400, -400);
  const maxPan = new THREE.Vector3(400, 400, 400);

  var _v = new THREE.Vector3();

  controls.addEventListener("change", function () {
    _v.copy(controls.target);
    controls.target.clamp(minPan, maxPan);
    _v.sub(controls.target);
    camera.position.sub(_v);
  });
};

const freeLookInstructions = () => {
  // if free look is clicked, display movement container
  document.getElementById("movement-container").style.display = "flex";
};

document.getElementById("look").addEventListener("click", () => {
  freeLookInstructions();
  // dont want this in animation look or else there are bugs
  freeLook();
  if (document.getElementById("card-container").childNodes.length > 0) {
    document.getElementById("card-container").innerHTML = "";
  }
});
// all movement stuff done here
function System() {
  const animate = (orbitFactor, rotateFactor) => {
    renderer.render(scene, camera);
    const EARTH_YEAR = rotateFactor * (50 * Math.PI * (1 / 60) * (1 / 60));
    // relative rotations
    sun.rotation.y += EARTH_YEAR * 0.25;
    mercury.rotation.y += EARTH_YEAR * 0.5;
    venus.rotation.y -= EARTH_YEAR * 0.1;
    earth.rotation.y += EARTH_YEAR;
    mars.rotation.y += EARTH_YEAR * 1.05;
    jupiter.rotation.y += EARTH_YEAR * 4;
    saturn.rotation.y += EARTH_YEAR * 4;
    uranus.rotation.y -= EARTH_YEAR * 3;
    neptune.rotation.y += EARTH_YEAR * 3;
    pluto.rotation.y += EARTH_YEAR * 0.75;

    timestamp = orbitFactor * (Date.now() * 0.0001);

    // relative orbits
    mercury.position.x = Math.sin(timestamp * 5) * 60;
    mercury.position.z = Math.cos(timestamp * 5) * 60;
    mercury.position.y = Math.sin(timestamp * 5) * -10;

    venus.position.x = Math.sin(timestamp * 4) * 80;
    venus.position.z = Math.cos(timestamp * 4) * 80;

    earth.position.x = Math.sin(timestamp * 3) * 100;
    earth.position.z = Math.cos(timestamp * 3) * 100;
    // Moon rotation and orbit
    moon.rotation.y += EARTH_YEAR * 1.5;
    const moonOrbitSpeed = 13.4; // Moon orbits roughly 13.4 times faster than Earth's year
    moon.position.x = Math.sin(timestamp * moonOrbitSpeed) * 10;
    moon.position.z = Math.cos(timestamp * moonOrbitSpeed) * 10;

    // ISS orbit
    const issOrbitSpeed = 100; // ISS orbits much faster than the moon
    iss.position.x = Math.sin(timestamp * issOrbitSpeed) * 5;
    iss.position.z = Math.cos(timestamp * issOrbitSpeed) * 5;
    iss.position.y = Math.sin(timestamp * issOrbitSpeed) * 0.5;

    timestamp = orbitFactor * (Date.now() * 0.0001);

    mars.position.x = Math.sin(timestamp * 2) * 120;
    mars.position.z = Math.cos(timestamp * 2) * 120;

    jupiter.position.x = Math.sin(timestamp * 0.8) * 160;
    jupiter.position.z = Math.cos(timestamp * 0.8) * 160;

    saturn.position.x = Math.sin(timestamp * 0.5) * 200;
    saturn.position.z = Math.cos(timestamp * 0.5) * 200;
    saturnRing.position.x = Math.sin(timestamp * 0.5) * 200;
    saturnRing.position.z = Math.cos(timestamp * 0.5) * 200;

    uranus.position.x = Math.sin(timestamp * 0.4) * 240;
    uranus.position.z = Math.cos(timestamp * 0.4) * 240;
    uranus.position.y = Math.sin(timestamp * 0.4) * -10;

    neptune.position.x = Math.sin(timestamp * 0.2) * 280;
    neptune.position.z = Math.cos(timestamp * 0.2) * 280;

    pluto.position.x = Math.sin(timestamp * 0.1) * 340;
    pluto.position.z = Math.cos(timestamp * 0.1) * 340;
    pluto.position.y = Math.sin(timestamp * 0.1) * 20;

    requestAnimationFrame(System);
  };
  animate(orbitFactor, rotateFactor);
}
export default System;
