export class UI {
  constructor() {
    this.panel = document.getElementById('info-panel');
    this.nameEl = document.getElementById('info-name');
    this.typeEl = document.getElementById('info-type-badge');
    this.bodyEl = document.getElementById('info-body');
    this.closeBtn = document.getElementById('info-close');
    this.simDateEl = document.getElementById('sim-date');
    this.simSpeedEl = document.getElementById('sim-speed');
    this.moveSpeedEl = document.getElementById('move-speed');
    this.helpOverlay = document.getElementById('help-overlay');
    this.progressBar = document.getElementById('progress-bar');
    this.progressText = document.getElementById('progress-text');
    this.loadingScreen = document.getElementById('loading-screen');

    this.closeBtn.addEventListener('click', () => this.hideInfo());
    document.addEventListener('keydown', e => {
      if (e.code === 'KeyH') this.toggleHelp();
      if (e.code === 'Escape') this.hideInfo();
    });
  }

  showInfo(bodyData) {
    this.nameEl.textContent = bodyData.name;
    this.typeEl.textContent = bodyData.type;
    this.bodyEl.innerHTML = this._buildInfoHTML(bodyData.info);
    this.panel.classList.add('open');
  }

  hideInfo() {
    this.panel.classList.remove('open');
  }

  _buildInfoHTML(info) {
    if (!info) return '';
    const rows = [
      ['Diameter', info.diameter],
      ['Mass', info.mass],
      ['Distance from Sun', info.distanceFromSun],
      ['Distance from Earth', info.distanceFromEarth],
      ['Distance from Jupiter', info.distanceFromJupiter],
      ['Distance from Saturn', info.distanceFromSaturn],
      ['Orbital Period', info.orbitalPeriod],
      ['Rotation Period', info.rotationPeriod],
      ['Axial Tilt', info.axialTilt],
      ['Surface Temp', info.surfaceTemp],
      ['Atmosphere', info.atmosphere],
      ['Moons', info.moons],
      ['Age', info.age],
      ['Type', info.type],
      ['Luminosity', info.luminosity],
    ].filter(([, v]) => v);

    const rowsHTML = rows.map(([label, value]) => `
      <div class="info-row">
        <span class="info-label">${label}</span>
        <span class="info-value">${value}</span>
      </div>
    `).join('');

    const desc = info.description
      ? `<div class="info-description">${info.description}</div>`
      : '';

    return `
      <div class="info-section">
        <div class="info-section-title">Physical Data</div>
        ${rowsHTML}
      </div>
      ${desc}
    `;
  }

  toggleHelp() {
    this.helpOverlay.classList.toggle('hidden');
  }

  setProgress(pct) {
    if (this.progressBar) this.progressBar.style.width = `${Math.round(pct * 100)}%`;
    if (this.progressText) this.progressText.textContent = `Loading... ${Math.round(pct * 100)}%`;
  }

  hideLoadingScreen() {
    if (this.loadingScreen) {
      this.loadingScreen.classList.add('fade-out');
      setTimeout(() => { this.loadingScreen.style.display = 'none'; }, 900);
    }
  }

  updateHUD(simDate, timeMultiplier, moveSpeedDisplay) {
    if (this.simDateEl) this.simDateEl.textContent = `Date: ${simDate}`;
    if (this.simSpeedEl) {
      const label = timeMultiplier === 0 ? 'PAUSED'
        : `${timeMultiplier >= 1 ? timeMultiplier.toFixed(0) : timeMultiplier.toFixed(2)}× (${this._daysPerSec(timeMultiplier)})`;
      this.simSpeedEl.textContent = `Time: ${label}`;
    }
    if (this.moveSpeedEl) this.moveSpeedEl.textContent = `Speed: ${moveSpeedDisplay}`;
  }

  _daysPerSec(m) {
    const dps = m; // 1 unit of multiplier = 1 day/s
    if (Math.abs(dps) < 1) return `${(dps * 24).toFixed(1)}h/s`;
    if (Math.abs(dps) < 365) return `${dps.toFixed(1)}d/s`;
    return `${(dps / 365.25).toFixed(1)}y/s`;
  }
}
