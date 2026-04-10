import * as THREE from 'three';
import { SUN, PLANETS, DWARF_PLANETS, ASTEROID_BELT } from './data.js';
import { orbitPath } from './orbits.js';

const textureLoader = new THREE.TextureLoader();
let loadedCount = 0;
let totalTextures = 0;
const onProgressCallbacks = [];

function loadTexture(url, fallbackColor) {
  totalTextures++;
  return new Promise(resolve => {
    if (!url) {
      // No URL — count it done immediately so progress stays accurate
      loadedCount++;
      notifyProgress();
      resolve(null);
      return;
    }
    textureLoader.load(
      url,
      tex => { loadedCount++; notifyProgress(); resolve(tex); },
      undefined,
      () => { loadedCount++; notifyProgress(); resolve(null); } // fallback on error
    );
  });
}

function notifyProgress() {
  const pct = totalTextures > 0 ? loadedCount / totalTextures : 1;
  onProgressCallbacks.forEach(cb => cb(pct));
}

export function onProgress(cb) { onProgressCallbacks.push(cb); }

// Creates the Sun mesh with glow sprite
export async function createSun(scene) {
  const tex = await loadTexture(
    'https://www.solarsystemscope.com/textures/download/2k_sun.jpg',
    null
  );

  const geo = new THREE.SphereGeometry(SUN.displayRadius, 64, 64);
  const mat = new THREE.MeshBasicMaterial({
    map: tex,
    color: tex ? 0xFFFFFF : SUN.color,
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.userData = { bodyData: SUN, isSun: true };
  scene.add(mesh);

  // Additive glow sprites (layered)
  const glowSizes = [14, 22, 35];
  const glowOpacities = [0.25, 0.12, 0.06];
  glowSizes.forEach((size, idx) => {
    const spriteMat = new THREE.SpriteMaterial({
      color: 0xFFAA44,
      transparent: true,
      opacity: glowOpacities[idx],
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const sprite = new THREE.Sprite(spriteMat);
    sprite.scale.setScalar(size);
    scene.add(sprite);
  });

  // Point light at sun
  const light = new THREE.PointLight(0xFFF4E0, 4.0, 0, 0.8);
  scene.add(light);

  return mesh;
}

// Creates a planet mesh, orbit line, and moons
export async function createPlanet(bodyData, scene, orbitLinesGroup) {
  // Load textures in parallel
  const [tex, normalTex, cloudTex] = await Promise.all([
    loadTexture(bodyData.textureUrl, null),
    loadTexture(bodyData.normalMapUrl, null),
    loadTexture(bodyData.cloudsUrl, null),
  ]);

  const geo = new THREE.SphereGeometry(bodyData.displayRadius, 64, 64);
  const matParams = {
    map: tex,
    color: tex ? 0xFFFFFF : bodyData.color,
  };
  if (normalTex) matParams.normalMap = normalTex;

  const mat = new THREE.MeshStandardMaterial(matParams);
  const mesh = new THREE.Mesh(geo, mat);
  mesh.rotation.z = (bodyData.axialTilt || 0) * Math.PI / 180;
  mesh.userData = { bodyData, type: 'planet' };
  scene.add(mesh);

  // Cloud layer for Earth
  if (cloudTex) {
    const cloudGeo = new THREE.SphereGeometry(bodyData.displayRadius * 1.008, 64, 64);
    const cloudMat = new THREE.MeshStandardMaterial({
      map: cloudTex,
      transparent: true,
      opacity: 0.6,
      depthWrite: false,
    });
    const clouds = new THREE.Mesh(cloudGeo, cloudMat);
    mesh.add(clouds);
    mesh.userData.clouds = clouds;
  }

  // Saturn rings
  if (bodyData.ringData) {
    const ringTex = await loadTexture(bodyData.ringData.textureUrl, null);
    const ringInner = bodyData.ringData.innerRadius;
    const ringOuter = bodyData.ringData.outerRadius;
    const ringGeo = new THREE.RingGeometry(ringInner, ringOuter, 128, 4);
    // Fix UV mapping for ring (Three.js RingGeometry UVs need adjustment)
    const pos = ringGeo.attributes.position;
    const uv = ringGeo.attributes.uv;
    const inner = ringInner;
    const outer = ringOuter;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i), z = pos.getZ(i);
      const r = Math.sqrt(x * x + z * z);
      uv.setXY(i, (r - inner) / (outer - inner), 0.5);
    }
    const ringMat = new THREE.MeshBasicMaterial({
      map: ringTex,
      color: ringTex ? 0xFFFFFF : 0xC8B890,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: ringTex ? 1.0 : 0.6,
      depthWrite: false,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2;
    ring.userData = { isRing: true };
    mesh.add(ring);
  }

  // Orbit line
  const orbitPoints = orbitPath(bodyData);
  const orbitGeo = new THREE.BufferGeometry().setFromPoints(orbitPoints);
  const orbitMat = new THREE.LineBasicMaterial({
    color: 0x334466,
    transparent: true,
    opacity: 0.4,
    depthWrite: false,
  });
  const orbitLine = new THREE.LineLoop(orbitGeo, orbitMat);
  orbitLinesGroup.add(orbitLine);

  // Moons
  const moonMeshes = [];
  if (bodyData.moons) {
    for (const moonData of bodyData.moons) {
      const moonTex = await loadTexture(moonData.textureUrl, null);
      const moonGeo = new THREE.SphereGeometry(moonData.displayRadius, 32, 32);
      const moonMat = new THREE.MeshStandardMaterial({
        map: moonTex,
        color: moonTex ? 0xFFFFFF : moonData.color,
      });
      const moonMesh = new THREE.Mesh(moonGeo, moonMat);
      moonMesh.userData = { bodyData: moonData, type: 'moon', parentMesh: mesh };
      scene.add(moonMesh);
      moonMeshes.push({ mesh: moonMesh, data: moonData });
    }
  }

  return { mesh, moonMeshes };
}

// Creates all dwarf planets
export async function createDwarfPlanet(bodyData, scene, orbitLinesGroup) {
  const tex = await loadTexture(bodyData.textureUrl, null);
  const geo = new THREE.SphereGeometry(bodyData.displayRadius, 32, 32);
  const mat = new THREE.MeshStandardMaterial({
    map: tex,
    color: tex ? 0xFFFFFF : bodyData.color,
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.userData = { bodyData, type: 'dwarfPlanet' };
  scene.add(mesh);

  const orbitPoints = orbitPath(bodyData);
  const orbitGeo = new THREE.BufferGeometry().setFromPoints(orbitPoints);
  const orbitMat = new THREE.LineBasicMaterial({
    color: 0x223344,
    transparent: true,
    opacity: 0.25,
    depthWrite: false,
  });
  orbitLinesGroup.add(new THREE.LineLoop(orbitGeo, orbitMat));

  return mesh;
}

// Creates the asteroid belt using InstancedMesh
export function createAsteroidBelt(scene) {
  const { innerRadius, outerRadius, count, ySpread } = ASTEROID_BELT;
  const geo = new THREE.IcosahedronGeometry(0.06, 0);
  const mat = new THREE.MeshStandardMaterial({ color: 0x887766, roughness: 0.9, metalness: 0.1 });
  const belt = new THREE.InstancedMesh(geo, mat, count);
  belt.userData = { isAsteroidBelt: true };

  const dummy = new THREE.Object3D();
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const r = innerRadius + Math.random() * (outerRadius - innerRadius);
    const y = (Math.random() - 0.5) * ySpread;
    dummy.position.set(r * Math.cos(angle), y, r * Math.sin(angle));
    dummy.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
    const s = 0.4 + Math.random() * 1.2;
    dummy.scale.setScalar(s);
    dummy.updateMatrix();
    belt.setMatrixAt(i, dummy.matrix);
  }
  belt.instanceMatrix.needsUpdate = true;
  scene.add(belt);
  return belt;
}
