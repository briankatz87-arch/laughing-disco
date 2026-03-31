import * as THREE from 'three';

export class BodyRaycaster {
  constructor(camera, canvas, onHit) {
    this.camera = camera;
    this.canvas = canvas;
    this.onHit = onHit;
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.clickables = [];

    this._onClick = this._onClick.bind(this);
    canvas.addEventListener('click', this._onClick);
  }

  setClickables(meshList) {
    this.clickables = meshList;
  }

  _onClick(e) {
    // Only raycast when pointer is NOT locked (user is browsing freely)
    if (document.pointerLockElement === this.canvas) return;

    const rect = this.canvas.getBoundingClientRect();
    this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const hits = this.raycaster.intersectObjects(this.clickables, false);

    if (hits.length > 0) {
      const obj = hits[0].object;
      const bodyData = obj.userData.bodyData;
      if (bodyData && this.onHit) {
        this.onHit(bodyData, obj);
      }
    }
  }

  dispose() {
    this.canvas.removeEventListener('click', this._onClick);
  }
}
