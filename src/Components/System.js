import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// Add audio setup at the beginning of the file
let backgroundMusic;
let isMusicPlaying = true; // Changed to true for default on

// Create audio control button
const createAudioControls = () => {
  const audioButton = document.createElement("button");
  audioButton.innerHTML = "🔊 Music On"; // Changed default text
  audioButton.style.position = "fixed";
  audioButton.style.bottom = "20px";
  audioButton.style.right = "20px";
  audioButton.style.padding = "10px 20px";
  audioButton.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
  audioButton.style.color = "white";
  audioButton.style.border = "1px solid white";
  audioButton.style.borderRadius = "5px";
  audioButton.style.cursor = "pointer";
  audioButton.style.zIndex = "1000";

  // Initialize audio
  backgroundMusic = new Audio();
  backgroundMusic.src = require("../assets/space-ambient.mp3");
  backgroundMusic.loop = true;
  backgroundMusic.volume = 0.3;

  // Auto-play music (will only work after user interaction due to browser policies)
  const startMusic = () => {
    backgroundMusic.play().catch((e) => {
      // Catch and handle any autoplay errors silently
      console.log("Autoplay prevented - waiting for user interaction");
    });
  };

  // Try to start music immediately
  startMusic();

  // Also attempt to start music on first user interaction
  document.addEventListener(
    "click",
    () => {
      if (!backgroundMusic.playing) {
        startMusic();
      }
    },
    { once: true }
  );

  audioButton.addEventListener("click", () => {
    if (!isMusicPlaying) {
      backgroundMusic.play();
      audioButton.innerHTML = "🔊 Music On";
      isMusicPlaying = true;
    } else {
      backgroundMusic.pause();
      audioButton.innerHTML = "🔇 Music Off";
      isMusicPlaying = false;
    }
  });

  // Add volume control
  const volumeSlider = document.createElement("input");
  volumeSlider.type = "range";
  volumeSlider.min = "0";
  volumeSlider.max = "100";
  volumeSlider.value = "30";
  volumeSlider.style.position = "fixed";
  volumeSlider.style.bottom = "60px";
  volumeSlider.style.right = "20px";
  volumeSlider.style.width = "100px";
  volumeSlider.style.zIndex = "1000";

  volumeSlider.addEventListener("input", (e) => {
    backgroundMusic.volume = e.target.value / 100;
  });

  document.body.appendChild(audioButton);
  document.body.appendChild(volumeSlider);
};

// Call createAudioControls after the scene setup
createAudioControls();

// Setup
// Add this after creating all the celestial bodies
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
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

// Add new objects for NEAs, NECs, and PHAs
const createRandomOrbitObject = (size, color, orbitRadius, orbitTilt) => {
  const geometry = new THREE.SphereGeometry(size, 16, 16);
  const material = new THREE.MeshBasicMaterial({ color: color });
  const object = new THREE.Mesh(geometry, material);

  const orbit = new THREE.Object3D();
  orbit.rotation.x = orbitTilt;
  orbit.add(object);
  object.position.set(orbitRadius, 0, 0);

  scene.add(orbit);
  return { object, orbit };
};

// Create multiple NEAs
const neas = [];
for (let i = 0; i < 10; i++) {
  const nea = createRandomOrbitObject(
    0.5 + Math.random() * 1.5, // Size between 0.5 and 2
    "#dbe9f4", // Brown color
    80 + Math.random() * 40, // Orbit radius between 80 and 120
    (Math.random() * Math.PI) / 4 // Random tilt up to 45 degrees
  );
  neas.push(nea);
}

// Create a few NECs
const necs = [];
for (let i = 0; i < 3; i++) {
  const nec = createRandomOrbitObject(
    0.8 + Math.random() * 1.8, // Size between 1 and 3
    "#FFFFFF", // Steel Blue color
    120 + Math.random() * 60, // Orbit radius between 120 and 180
    (Math.random() * Math.PI) / 3 // Random tilt up to 60 degrees
  );
  necs.push(nec);
}

// Create a couple of PHAs
const phas = [];
for (let i = 0; i < 2; i++) {
  const pha = createRandomOrbitObject(
    2 + Math.random() * 3, // Size between 2 and 5
    "#808080", // Orange Red color
    90 + Math.random() * 30, // Orbit radius between 90 and 120
    (Math.random() * Math.PI) / 6 // Random tilt up to 30 degrees
  );
  phas.push(pha);
}

// Update the celestialBodies object with more detailed information
const celestialBodies = {
  sun: {
    mesh: sun,
    label: "Sun",
    info: "The star at the center of our Solar System. Diameter: 1,391,000 km. Surface temperature: 5,500°C.",
  },
  mercury: {
    mesh: mercury,
    label: "Mercury",
    info: "Smallest planet, closest to the Sun. Diameter: 4,879 km. Day length: 59 Earth days.",
  },
  venus: {
    mesh: venus,
    label: "Venus",
    info: "Often called Earth's twin. Diameter: 12,104 km. Rotates in opposite direction to most planets.",
  },
  earth: {
    mesh: earth,
    label: "Earth",
    info: "Our home planet. Diameter: 12,742 km. Only known planet with life. One moon.",
  },
  moon: {
    mesh: moon,
    label: "Moon",
    info: "Earth's only natural satellite. Diameter: 3,474 km. Distance from Earth: 384,400 km.",
  },
  mars: {
    mesh: mars,
    label: "Mars",
    info: "The Red Planet. Diameter: 6,779 km. Has the largest volcano in the Solar System: Olympus Mons.",
  },
  jupiter: {
    mesh: jupiter,
    label: "Jupiter",
    info: "Largest planet in our Solar System. Diameter: 139,820 km. Has a Great Red Spot, a giant storm.",
  },
  saturn: {
    mesh: saturn,
    label: "Saturn",
    info: "Known for its prominent ring system. Diameter: 116,460 km. Has 82 known moons.",
  },
  uranus: {
    mesh: uranus,
    label: "Uranus",
    info: "Ice giant, tilted on its side. Diameter: 50,724 km. Discovered in 1781 by William Herschel.",
  },
  neptune: {
    mesh: neptune,
    label: "Neptune",
    info: "Windiest planet in our Solar System. Diameter: 49,244 km. Has 14 known moons.",
  },
  pluto: {
    mesh: pluto,
    label: "Pluto",
    info: "Dwarf planet in the Kuiper belt. Diameter: 2,377 km. Discovered in 1930, reclassified in 2006.",
  },
  iss: {
    mesh: iss,
    label: "ISS",
    info: "International Space Station. Length: 109m. Orbits Earth at about 400 km altitude.",
  },
};

// Modify the labelDiv styles for better readability
const labelDiv = document.createElement("div");
labelDiv.style.position = "absolute";
labelDiv.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
labelDiv.style.color = "white";
labelDiv.style.padding = "10px";
labelDiv.style.borderRadius = "5px";
labelDiv.style.display = "none";
labelDiv.style.maxWidth = "250px";
labelDiv.style.fontSize = "14px";
labelDiv.style.lineHeight = "1.4";
document.body.appendChild(labelDiv);

// Add event listeners
renderer.domElement.addEventListener("mousemove", onMouseMove);
renderer.domElement.addEventListener("mouseout", onMouseOut);

function onMouseMove(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects(
    Object.values(celestialBodies).map((body) => body.mesh)
  );

  if (intersects.length > 0) {
    const intersectedObject = intersects[0].object;
    const bodyName = Object.keys(celestialBodies).find(
      (key) => celestialBodies[key].mesh === intersectedObject
    );
    if (bodyName) {
      const body = celestialBodies[bodyName];
      labelDiv.innerHTML = `<strong>${body.info}</strong><br>${body.info}`;
      labelDiv.style.display = "block";
      labelDiv.style.left = event.clientX + 15 + "px";
      labelDiv.style.top = event.clientY + "px";
    }
  } else {
    labelDiv.style.display = "none";
  }
}

function onMouseOut() {
  labelDiv.style.display = "none";
}
// all movement stuff done here
function System() {
  // Initialize audio context on first user interaction
  document.addEventListener(
    "click",
    () => {
      if (backgroundMusic && backgroundMusic.paused) {
        // Create audio context on user interaction to comply with browser policies
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const audioContext = new AudioContext();
      }
    },
    { once: true }
  );
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

    // requestAnimationFrame(System);
    // Animate NEAs
    neas.forEach((nea, index) => {
      const speed = 0.005 + index * 0.001;
      nea.orbit.rotation.y += speed * orbitFactor;
      nea.object.rotation.y += 0.02 * rotateFactor;
    });

    // Animate NECs
    necs.forEach((nec, index) => {
      const speed = 0.003 + index * 0.001;
      nec.orbit.rotation.y += speed * orbitFactor;
      nec.object.rotation.y += 0.01 * rotateFactor;
    });

    // Animate PHAs
    phas.forEach((pha, index) => {
      const speed = 0.004 + index * 0.002;
      pha.orbit.rotation.y += speed * orbitFactor;
      pha.object.rotation.y += 0.03 * rotateFactor;
    });
    // Update the picking ray with the camera and mouse position
    raycaster.setFromCamera(mouse, camera);

    // Calculate objects intersecting the picking ray
    const intersects = raycaster.intersectObjects(
      Object.values(celestialBodies).map((body) => body.mesh)
    );

    if (intersects.length > 0) {
      const intersectedObject = intersects[0].object;
      const bodyName = Object.keys(celestialBodies).find(
        (key) => celestialBodies[key].mesh === intersectedObject
      );
      if (bodyName) {
        labelDiv.textContent = `${celestialBodies[bodyName].label} = ${celestialBodies[bodyName].info}`;
        labelDiv.style.display = "block";
      }
    } else {
      labelDiv.style.display = "none";
    }

    requestAnimationFrame(() => animate(orbitFactor, rotateFactor));
  };
  animate(orbitFactor, rotateFactor);
}
export default System;
