import * as THREE from 'three';
import { initScene } from './scene.js';
import { PLANETS, DWARF_PLANETS } from './data.js';
import { keplerPosition, moonPosition, daysSinceJ2000 } from './orbits.js';
import { createSun, createPlanet, createDwarfPlanet, createAsteroidBelt, onProgress } from './objects.js';
import { SpaceshipControls } from './controls.js';
import { BodyRaycaster } from './raycaster.js';
import { UI } from './ui.js';

const canvas = document.getElementById('canvas');
const { renderer, scene, camera } = initScene(canvas);
const ui = new UI();
const controls = new SpaceshipControls(camera, canvas);

// Orbit lines group (for toggling)
const orbitLinesGroup = new THREE.Group();
scene.add(orbitLinesGroup);

// Time state
let simDays = daysSinceJ2000(new Date()); // start at today
let timeMultiplier = 30; // 30 days per second
let paused = false;
let useRealScale = false;
const REAL_SCALE_FACTOR = 1 / 8; // scale down display radii toward real

// Track all meshes for raycasting
const clickableMeshes = [];
const planetObjects = []; // { mesh, moonMeshes, data }
const dwarfMeshes = [];

// Progress tracking
onProgress(pct => {
  ui.setProgress(pct);
  if (pct >= 1) {
    setTimeout(() => ui.hideLoadingScreen(), 300);
  }
});

async function buildSolarSystem() {
  // Sun
  const sunMesh = await createSun(scene);
  clickableMeshes.push(sunMesh);

  // Planets
  for (const planetData of PLANETS) {
    const { mesh, moonMeshes } = await createPlanet(planetData, scene, orbitLinesGroup);
    clickableMeshes.push(mesh);
    moonMeshes.forEach(m => clickableMeshes.push(m.mesh));
    planetObjects.push({ mesh, moonMeshes, data: planetData });
  }

  // Dwarf planets
  for (const dwarfData of DWARF_PLANETS) {
    const mesh = await createDwarfPlanet(dwarfData, scene, orbitLinesGroup);
    clickableMeshes.push(mesh);
    dwarfMeshes.push({ mesh, data: dwarfData });
  }

  // Asteroid belt (no individual raycasting needed)
  createAsteroidBelt(scene);

  // Set up raycaster now that meshes exist
  raycaster.setClickables(clickableMeshes);
}

// Raycaster
const raycaster = new BodyRaycaster(camera, canvas, (bodyData, mesh) => {
  ui.showInfo(bodyData);
  pulseHighlight(mesh);
});

// Highlight animation
let highlightedMesh = null;
let highlightTime = 0;
function pulseHighlight(mesh) {
  if (highlightedMesh && highlightedMesh.material && highlightedMesh.material.emissive) {
    highlightedMesh.material.emissiveIntensity = 0;
  }
  highlightedMesh = mesh;
  highlightTime = 0;
}

// Key handlers for global controls
document.addEventListener('keydown', e => {
  if (e.code === 'KeyO') orbitLinesGroup.visible = !orbitLinesGroup.visible;
  if (e.code === 'KeyR') controls.resetToOverview();
  if (e.code === 'KeyT') toggleScale();
  if (e.code === 'BracketLeft')  changeTime(-1);
  if (e.code === 'BracketRight') changeTime(1);
});

document.getElementById('btn-pause').addEventListener('click', () => {
  paused = !paused;
  document.getElementById('btn-pause').textContent = paused ? '▶' : '⏸';
});
document.getElementById('btn-slower').addEventListener('click', () => changeTime(-1));
document.getElementById('btn-faster').addEventListener('click', () => changeTime(1));

const timeSteps = [0.1, 0.5, 1, 7, 30, 100, 365, 1000, 3650, 10000];
let timeStepIndex = 4; // default: 30 days/s
timeMultiplier = timeSteps[timeStepIndex];

function changeTime(dir) {
  timeStepIndex = Math.max(0, Math.min(timeSteps.length - 1, timeStepIndex + dir));
  timeMultiplier = timeSteps[timeStepIndex];
}

function toggleScale() {
  useRealScale = !useRealScale;
  const allBodies = [...planetObjects.map(p => ({ mesh: p.mesh, data: p.data })),
                     ...planetObjects.flatMap(p => p.moonMeshes.map(m => ({ mesh: m.mesh, data: m.data }))),
                     ...dwarfMeshes.map(d => ({ mesh: d.mesh, data: d.data }))];
  allBodies.forEach(({ mesh, data }) => {
    const targetR = useRealScale ? (data.realDisplayRadius || data.displayRadius) : data.displayRadius;
    mesh.scale.setScalar(targetR / data.displayRadius);
  });
}

// Format simulation date
function formatSimDate(daysSinceJ2000) {
  const ms = daysSinceJ2000 * 86400 * 1000;
  const epoch = new Date('2000-01-01T12:00:00Z');
  const d = new Date(epoch.getTime() + ms);
  return d.toISOString().slice(0, 10);
}

// Main animation loop
let lastTime = performance.now();

function animate() {
  requestAnimationFrame(animate);

  const now = performance.now();
  const dtSeconds = Math.min((now - lastTime) / 1000, 0.1);
  lastTime = now;

  if (!paused) {
    simDays += timeMultiplier * dtSeconds;
  }

  // Update planet positions
  for (const { mesh, moonMeshes, data } of planetObjects) {
    const pos = keplerPosition(data, simDays);
    mesh.position.set(pos.x, pos.y, pos.z);

    // Axial rotation
    const rotSpeed = data.rotationPeriod !== 0
      ? (2 * Math.PI / (Math.abs(data.rotationPeriod) / 24)) * timeMultiplier * dtSeconds * Math.sign(data.rotationPeriod)
      : 0;
    mesh.rotation.y += rotSpeed;

    // Cloud rotation (slightly faster)
    if (mesh.userData.clouds) {
      mesh.userData.clouds.rotation.y += rotSpeed * 1.1;
    }

    // Moon positions (relative to parent planet)
    for (const { mesh: moonMesh, data: moonData } of moonMeshes) {
      const moonPos = moonPosition(moonData, simDays);
      moonMesh.position.set(
        pos.x + moonPos.x,
        pos.y + moonPos.y,
        pos.z + moonPos.z
      );
    }
  }

  // Update dwarf planet positions
  for (const { mesh, data } of dwarfMeshes) {
    const pos = keplerPosition(data, simDays);
    mesh.position.set(pos.x, pos.y, pos.z);
  }

  // Pulse highlight
  if (highlightedMesh && highlightedMesh.material && highlightedMesh.material.emissive) {
    highlightTime += dtSeconds * 3;
    highlightedMesh.material.emissive.set(0x4488ff);
    highlightedMesh.material.emissiveIntensity = Math.max(0, Math.sin(highlightTime) * 0.5);
    if (highlightTime > Math.PI * 4) {
      highlightedMesh.material.emissiveIntensity = 0;
      highlightedMesh = null;
    }
  }

  // Update controls
  controls.update();

  // Update HUD
  ui.updateHUD(formatSimDate(simDays), paused ? 0 : timeMultiplier, controls.getSpeedDisplay());

  renderer.render(scene, camera);
}

// Kick off
buildSolarSystem().then(() => {
  animate();
});
