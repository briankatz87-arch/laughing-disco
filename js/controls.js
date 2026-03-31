import * as THREE from 'three';

export class SpaceshipControls {
  constructor(camera, canvas) {
    this.camera = camera;
    this.canvas = canvas;

    this.isLocked = false;
    this.moveSpeed = 2.0; // units per frame
    this.minSpeed = 0.01;
    this.maxSpeed = 800;

    this.keys = {};
    this.euler = new THREE.Euler(0, 0, 0, 'YXZ');
    this.quaternion = new THREE.Quaternion();

    this.mouseSensitivity = 0.0015;

    this._onMouseMove = this._onMouseMove.bind(this);
    this._onKeyDown = this._onKeyDown.bind(this);
    this._onKeyUp = this._onKeyUp.bind(this);
    this._onScroll = this._onScroll.bind(this);
    this._onPointerLockChange = this._onPointerLockChange.bind(this);
    this._onCanvasClick = this._onCanvasClick.bind(this);

    document.addEventListener('mousemove', this._onMouseMove);
    document.addEventListener('keydown', this._onKeyDown);
    document.addEventListener('keyup', this._onKeyUp);
    canvas.addEventListener('wheel', this._onScroll, { passive: true });
    document.addEventListener('pointerlockchange', this._onPointerLockChange);
    canvas.addEventListener('click', this._onCanvasClick);

    // Initialize euler from camera
    this.euler.setFromQuaternion(camera.quaternion, 'YXZ');
  }

  _onCanvasClick() {
    if (!this.isLocked) {
      this.canvas.requestPointerLock();
    }
  }

  _onPointerLockChange() {
    this.isLocked = document.pointerLockElement === this.canvas;
    const hint = document.getElementById('pointer-hint');
    const crosshair = document.getElementById('crosshair');
    if (this.isLocked) {
      if (hint) hint.textContent = 'Press Esc to exit flight mode';
      if (crosshair) crosshair.classList.add('visible');
    } else {
      if (hint) hint.textContent = 'Click to enter flight mode';
      if (crosshair) crosshair.classList.remove('visible');
    }
  }

  _onMouseMove(e) {
    if (!this.isLocked) return;
    this.euler.y -= e.movementX * this.mouseSensitivity;
    this.euler.x -= e.movementY * this.mouseSensitivity;
    // Clamp vertical look (allow full vertical 360 in space)
    this.euler.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.euler.x));
    this.camera.quaternion.setFromEuler(this.euler);
  }

  _onKeyDown(e) { this.keys[e.code] = true; }
  _onKeyUp(e)   { this.keys[e.code] = false; }

  _onScroll(e) {
    if (e.deltaY > 0) {
      this.moveSpeed = Math.min(this.maxSpeed, this.moveSpeed * 1.2);
    } else {
      this.moveSpeed = Math.max(this.minSpeed, this.moveSpeed / 1.2);
    }
  }

  get speedBoost() {
    return (this.keys['ShiftLeft'] || this.keys['ShiftRight']) ? 5 : 1;
  }

  update() {
    if (!this.isLocked) return;

    const speed = this.moveSpeed * this.speedBoost;
    const dir = new THREE.Vector3();

    if (this.keys['KeyW'] || this.keys['ArrowUp'])   dir.z -= 1;
    if (this.keys['KeyS'] || this.keys['ArrowDown'])  dir.z += 1;
    if (this.keys['KeyA'] || this.keys['ArrowLeft'])  dir.x -= 1;
    if (this.keys['KeyD'] || this.keys['ArrowRight']) dir.x += 1;
    if (this.keys['KeyQ']) dir.y -= 1;
    if (this.keys['KeyE']) dir.y += 1;

    if (dir.lengthSq() > 0) {
      dir.normalize().multiplyScalar(speed);
      dir.applyQuaternion(this.camera.quaternion);
      this.camera.position.add(dir);
    }
  }

  getSpeedDisplay() {
    let s = this.moveSpeed;
    let unit = 'units/frame';
    // Convert to km/s equivalent for display
    // 1 unit = 0.01 AU = 1,496,000 km
    // At 60fps: km/s = speed * 1,496,000 / 60
    const kmPerSec = s * 1496000 / 60;
    if (kmPerSec < 1000) return `${kmPerSec.toFixed(1)} km/s`;
    if (kmPerSec < 1e6) return `${(kmPerSec / 1000).toFixed(1)} Mm/s`;
    return `${(kmPerSec / 1.496e8).toFixed(3)} AU/s`;
  }

  resetToOverview() {
    this.camera.position.set(0, 60, 200);
    this.euler.set(-0.28, 0, 0);
    this.camera.quaternion.setFromEuler(this.euler);
  }

  dispose() {
    document.removeEventListener('mousemove', this._onMouseMove);
    document.removeEventListener('keydown', this._onKeyDown);
    document.removeEventListener('keyup', this._onKeyUp);
    this.canvas.removeEventListener('wheel', this._onScroll);
    document.removeEventListener('pointerlockchange', this._onPointerLockChange);
    this.canvas.removeEventListener('click', this._onCanvasClick);
  }
}
