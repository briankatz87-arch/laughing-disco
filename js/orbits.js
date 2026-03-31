import * as THREE from 'three';

// Keplerian orbital mechanics
// All angles in degrees in data, converted to radians internally

const DEG = Math.PI / 180;
const J2000 = 2451545.0; // Julian date of J2000 epoch

// Convert calendar date to Julian Day Number
export function dateToJD(date) {
  const y = date.getUTCFullYear();
  const m = date.getUTCMonth() + 1;
  const d = date.getUTCDate() + (date.getUTCHours() + date.getUTCMinutes() / 60) / 24;
  const A = Math.floor(y / 100);
  const B = 2 - A + Math.floor(A / 4);
  return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + d + B - 1524.5;
}

// Days since J2000
export function daysSinceJ2000(date) {
  return dateToJD(date) - J2000;
}

// Solve Kepler's equation M = E - e*sin(E) for E using Newton-Raphson
function solveKepler(M, e) {
  let E = M + e * Math.sin(M) * (1 + e * Math.cos(M));
  for (let i = 0; i < 8; i++) {
    const dE = (M - E + e * Math.sin(E)) / (1 - e * Math.cos(E));
    E += dE;
    if (Math.abs(dE) < 1e-10) break;
  }
  return E;
}

// Compute 3D heliocentric position (in scene units) for a body given its orbital elements
// and days since J2000
export function keplerPosition(body, daysSinceEpoch) {
  const a = body.semiMajorAxis; // already in scene units (AU * AU_scale)
  const e = body.eccentricity;
  const i = body.inclination * DEG;
  const omega = body.argPerihelion * DEG;         // argument of perihelion (ω)
  const Omega = body.longitudeAscNode * DEG;       // longitude of ascending node (Ω)
  const L0 = body.meanLongitude * DEG;             // mean longitude at epoch

  // Mean anomaly at epoch
  const n = (2 * Math.PI) / (body.orbitalPeriod); // mean motion in rad/day
  const M0 = L0 - omega - Omega;

  // Current mean anomaly
  const M = ((M0 + n * daysSinceEpoch) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);

  // Solve Kepler's equation for eccentric anomaly
  const E = solveKepler(M, e);

  // True anomaly
  const sinV = Math.sqrt(1 - e * e) * Math.sin(E);
  const cosV = Math.cos(E) - e;
  const nu = Math.atan2(sinV, cosV);

  // Distance from focus
  const r = a * (1 - e * Math.cos(E));

  // Position in orbital plane
  const xOrb = r * Math.cos(nu);
  const yOrb = r * Math.sin(nu);

  // Rotate to 3D (using argument of perihelion ω, inclination i, longitude of ascending node Ω)
  const cosO = Math.cos(Omega), sinO = Math.sin(Omega);
  const cosI = Math.cos(i),     sinI = Math.sin(i);
  const cosw = Math.cos(omega), sinw = Math.sin(omega);

  const x = (cosO * cosw - sinO * sinw * cosI) * xOrb + (-cosO * sinw - sinO * cosw * cosI) * yOrb;
  const z = (sinO * cosw + cosO * sinw * cosI) * xOrb + (-sinO * sinw + cosO * cosw * cosI) * yOrb;
  const y = (sinw * sinI) * xOrb + (cosw * sinI) * yOrb;

  return { x, y, z };
}

// Generate orbit path points (for LineLoop)
export function orbitPath(body, pointCount = 256) {
  const points = [];
  // Compute position at each step around the orbit
  for (let step = 0; step <= pointCount; step++) {
    const M = (step / pointCount) * 2 * Math.PI;
    const E = solveKepler(M, body.eccentricity);
    const sinV = Math.sqrt(1 - body.eccentricity * body.eccentricity) * Math.sin(E);
    const cosV = Math.cos(E) - body.eccentricity;
    const nu = Math.atan2(sinV, cosV);
    const r = body.semiMajorAxis * (1 - body.eccentricity * Math.cos(E));
    const xOrb = r * Math.cos(nu);
    const yOrb = r * Math.sin(nu);

    const e = body.eccentricity;
    const i = body.inclination * DEG;
    const omega = body.argPerihelion * DEG;
    const Omega = body.longitudeAscNode * DEG;

    const cosO = Math.cos(Omega), sinO = Math.sin(Omega);
    const cosI = Math.cos(i),     sinI = Math.sin(i);
    const cosw = Math.cos(omega), sinw = Math.sin(omega);

    const x = (cosO * cosw - sinO * sinw * cosI) * xOrb + (-cosO * sinw - sinO * cosw * cosI) * yOrb;
    const z = (sinO * cosw + cosO * sinw * cosI) * xOrb + (-sinO * sinw + cosO * cosw * cosI) * yOrb;
    const y = (sinw * sinI) * xOrb + (cosw * sinI) * yOrb;

    points.push(new THREE.Vector3(x, y, z));
  }
  return points;
}

// Simple circular orbit for moons (relative to parent)
export function moonPosition(moon, daysSinceEpoch) {
  const n = (2 * Math.PI) / moon.orbitalPeriod;
  const angle = n * daysSinceEpoch;
  return {
    x: moon.orbitalRadius * Math.cos(angle),
    y: 0,
    z: moon.orbitalRadius * Math.sin(angle)
  };
}
