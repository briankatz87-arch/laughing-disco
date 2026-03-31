import * as THREE from 'three';

export function initScene(canvas) {
  // Renderer
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.8;

  // Scene
  const scene = new THREE.Scene();

  // Camera
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.001, 200000);
  camera.position.set(0, 60, 200);
  camera.lookAt(0, 0, 0);

  // Lighting
  const sunLight = new THREE.PointLight(0xFFF4E0, 3.0, 0);
  sunLight.position.set(0, 0, 0);
  scene.add(sunLight);

  const ambientLight = new THREE.AmbientLight(0x111122, 0.4);
  scene.add(ambientLight);

  // Stars background
  const starCount = 12000;
  const starPositions = new Float32Array(starCount * 3);
  const starColors = new Float32Array(starCount * 3);
  const starSizes = new Float32Array(starCount);

  for (let i = 0; i < starCount; i++) {
    // Fibonacci sphere distribution for even coverage
    const theta = Math.acos(1 - 2 * (i + 0.5) / starCount);
    const phi = Math.PI * (1 + Math.sqrt(5)) * i;
    const r = 80000 + (Math.random() - 0.5) * 20000;
    starPositions[i * 3]     = r * Math.sin(theta) * Math.cos(phi);
    starPositions[i * 3 + 1] = r * Math.sin(theta) * Math.sin(phi);
    starPositions[i * 3 + 2] = r * Math.cos(theta);

    // Slight color variation: white/blue/yellow tints
    const t = Math.random();
    if (t < 0.6) {
      starColors[i * 3] = 0.9 + Math.random() * 0.1;
      starColors[i * 3 + 1] = 0.9 + Math.random() * 0.1;
      starColors[i * 3 + 2] = 0.9 + Math.random() * 0.1;
    } else if (t < 0.8) {
      // Blue-white
      starColors[i * 3] = 0.7 + Math.random() * 0.2;
      starColors[i * 3 + 1] = 0.8 + Math.random() * 0.2;
      starColors[i * 3 + 2] = 1.0;
    } else {
      // Yellow-orange
      starColors[i * 3] = 1.0;
      starColors[i * 3 + 1] = 0.85 + Math.random() * 0.15;
      starColors[i * 3 + 2] = 0.5 + Math.random() * 0.3;
    }
    starSizes[i] = 0.5 + Math.random() * 1.5;
  }

  const starGeo = new THREE.BufferGeometry();
  starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
  starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));
  starGeo.setAttribute('size', new THREE.BufferAttribute(starSizes, 1));

  const starMat = new THREE.PointsMaterial({
    size: 0.8,
    sizeAttenuation: false,
    vertexColors: true,
    transparent: true,
    opacity: 0.9,
  });

  scene.add(new THREE.Points(starGeo, starMat));

  // Handle resize
  function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
  window.addEventListener('resize', onResize);

  return { renderer, scene, camera };
}
