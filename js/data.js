// Solar system data with real Keplerian orbital elements (J2000 epoch)
// Scale: 1 unit = 0.01 AU  →  Earth orbit radius ≈ 100 units
// Planet display radii are visually exaggerated; real-scale toggle available

export const AU = 100; // units per AU

export const SUN = {
  name: 'Sun',
  type: 'Star',
  radius: 6.957e5, // km
  displayRadius: 4.5,
  mass: '1.989 × 10³⁰ kg',
  color: 0xFFF4E0,
  emissive: 0xFFAA00,
  info: {
    diameter: '1,392,700 km',
    mass: '1.989 × 10³⁰ kg',
    surfaceTemp: '5,778 K (surface) / ~15,000,000 K (core)',
    atmosphere: 'Hydrogen (74%), Helium (24%), trace metals',
    age: '~4.6 billion years',
    type: 'G-type main-sequence star (Yellow Dwarf)',
    luminosity: '3.828 × 10²⁶ W',
    description: 'The Sun is the star at the center of our Solar System. It accounts for 99.86% of the total mass of the Solar System. Its gravity holds the Solar System together, keeping everything from the largest planets to the smallest bits of debris in orbit around it.'
  }
};

export const PLANETS = [
  {
    name: 'Mercury',
    type: 'Terrestrial Planet',
    // Keplerian elements at J2000
    semiMajorAxis: 0.38709893 * AU,
    eccentricity: 0.20563069,
    inclination: 7.00487,
    longitudeAscNode: 48.33167,
    argPerihelion: 77.45645,
    meanLongitude: 252.25084,
    orbitalPeriod: 87.969,  // days
    // Visual
    radius: 2439.7,
    displayRadius: 0.35,
    realDisplayRadius: 0.0244,
    axialTilt: 0.034,
    rotationPeriod: 1407.6, // hours
    color: 0xA8A8A8,
    textureUrl: 'https://www.solarsystemscope.com/textures/download/2k_mercury.jpg',
    // Info
    info: {
      diameter: '4,879 km',
      mass: '3.285 × 10²³ kg',
      distanceFromSun: '57.9 million km (0.387 AU)',
      orbitalPeriod: '88 Earth days',
      rotationPeriod: '58.6 Earth days',
      axialTilt: '0.034°',
      surfaceTemp: '-180°C to 430°C',
      atmosphere: 'Virtually none (trace sodium, oxygen)',
      moons: '0',
      description: 'Mercury is the smallest planet and the closest to the Sun. Despite being close to the Sun, it is not the hottest planet — that distinction belongs to Venus. Mercury has no atmosphere to retain heat, causing extreme temperature swings.'
    }
  },
  {
    name: 'Venus',
    type: 'Terrestrial Planet',
    semiMajorAxis: 0.72333199 * AU,
    eccentricity: 0.00677323,
    inclination: 3.39471,
    longitudeAscNode: 76.68069,
    argPerihelion: 131.53298,
    meanLongitude: 181.97973,
    orbitalPeriod: 224.701,
    radius: 6051.8,
    displayRadius: 0.87,
    realDisplayRadius: 0.0605,
    axialTilt: 177.4,
    rotationPeriod: -5832.5, // negative = retrograde
    color: 0xE8C58A,
    textureUrl: 'https://www.solarsystemscope.com/textures/download/2k_venus_surface.jpg',
    info: {
      diameter: '12,104 km',
      mass: '4.867 × 10²⁴ kg',
      distanceFromSun: '108.2 million km (0.723 AU)',
      orbitalPeriod: '225 Earth days',
      rotationPeriod: '243 Earth days (retrograde)',
      axialTilt: '177.4°',
      surfaceTemp: '~465°C (constant)',
      atmosphere: 'CO₂ (96.5%), Nitrogen (3.5%), sulfuric acid clouds',
      moons: '0',
      description: 'Venus is the hottest planet in the Solar System due to a runaway greenhouse effect. It rotates backwards relative to most planets, and a day on Venus is longer than its year. The surface pressure is 92× Earth\'s.'
    }
  },
  {
    name: 'Earth',
    type: 'Terrestrial Planet',
    semiMajorAxis: 1.00000011 * AU,
    eccentricity: 0.01671022,
    inclination: 0.00005,
    longitudeAscNode: -11.26064,
    argPerihelion: 102.94719,
    meanLongitude: 100.46435,
    orbitalPeriod: 365.256,
    radius: 6371.0,
    displayRadius: 0.92,
    realDisplayRadius: 0.0637,
    axialTilt: 23.44,
    rotationPeriod: 23.9345,
    color: 0x2266AA,
    textureUrl: 'https://www.solarsystemscope.com/textures/download/2k_earth_daymap.jpg',
    normalMapUrl: 'https://www.solarsystemscope.com/textures/download/2k_earth_normal_map.jpg',
    specularMapUrl: 'https://www.solarsystemscope.com/textures/download/2k_earth_specular_map.jpg',
    cloudsUrl: 'https://www.solarsystemscope.com/textures/download/2k_earth_clouds.jpg',
    info: {
      diameter: '12,742 km',
      mass: '5.972 × 10²⁴ kg',
      distanceFromSun: '149.6 million km (1.000 AU)',
      orbitalPeriod: '365.25 days',
      rotationPeriod: '23h 56min',
      axialTilt: '23.44°',
      surfaceTemp: '-89°C to 58°C (avg 15°C)',
      atmosphere: 'Nitrogen (78%), Oxygen (21%), Argon (0.9%)',
      moons: '1 (Luna)',
      description: 'Earth is the only known planet harboring life. It has liquid water on its surface, a protective magnetic field, and an oxygen-rich atmosphere. Earth\'s Moon is unusually large relative to its host planet, stabilizing Earth\'s axial tilt.'
    },
    moons: [
      {
        name: 'Moon',
        type: 'Natural Satellite',
        orbitalRadius: 2.56, // display units
        orbitalPeriod: 27.32,
        displayRadius: 0.25,
        color: 0xAAAAAA,
        textureUrl: 'https://www.solarsystemscope.com/textures/download/2k_moon.jpg',
        info: {
          diameter: '3,474 km',
          mass: '7.342 × 10²² kg',
          distanceFromEarth: '384,400 km',
          orbitalPeriod: '27.3 days',
          surfaceTemp: '-173°C to 127°C',
          atmosphere: 'Virtually none (exosphere)',
          description: 'Earth\'s only natural satellite. The Moon is the fifth-largest moon in the Solar System and the largest relative to its planet. It stabilizes Earth\'s axial tilt and drives ocean tides.'
        }
      }
    ]
  },
  {
    name: 'Mars',
    type: 'Terrestrial Planet',
    semiMajorAxis: 1.52366231 * AU,
    eccentricity: 0.09341233,
    inclination: 1.85061,
    longitudeAscNode: 49.57854,
    argPerihelion: 336.04084,
    meanLongitude: 355.45332,
    orbitalPeriod: 686.97,
    radius: 3389.5,
    displayRadius: 0.49,
    realDisplayRadius: 0.0339,
    axialTilt: 25.19,
    rotationPeriod: 24.623,
    color: 0xC1440E,
    textureUrl: 'https://www.solarsystemscope.com/textures/download/2k_mars.jpg',
    info: {
      diameter: '6,779 km',
      mass: '6.39 × 10²³ kg',
      distanceFromSun: '227.9 million km (1.524 AU)',
      orbitalPeriod: '687 Earth days (1.88 years)',
      rotationPeriod: '24h 37min',
      axialTilt: '25.19°',
      surfaceTemp: '-125°C to 20°C (avg -60°C)',
      atmosphere: 'CO₂ (95.3%), Nitrogen (2.7%), Argon (1.6%)',
      moons: '2 (Phobos, Deimos)',
      description: 'Mars is called the Red Planet due to iron oxide (rust) on its surface. It hosts Olympus Mons, the tallest volcano in the Solar System (21 km), and Valles Marineris, a canyon system 4,000 km long. Mars has the most Earth-like seasons of any planet.'
    }
  },
  {
    name: 'Jupiter',
    type: 'Gas Giant',
    semiMajorAxis: 5.20336301 * AU,
    eccentricity: 0.04839266,
    inclination: 1.30530,
    longitudeAscNode: 100.55615,
    argPerihelion: 14.75385,
    meanLongitude: 34.40438,
    orbitalPeriod: 4332.589,
    radius: 69911,
    displayRadius: 3.2,
    realDisplayRadius: 0.699,
    axialTilt: 3.13,
    rotationPeriod: 9.925,
    color: 0xC88B3A,
    textureUrl: 'https://www.solarsystemscope.com/textures/download/2k_jupiter.jpg',
    info: {
      diameter: '139,820 km',
      mass: '1.898 × 10²⁷ kg',
      distanceFromSun: '778.5 million km (5.203 AU)',
      orbitalPeriod: '11.86 Earth years',
      rotationPeriod: '9h 55min (fastest of all planets)',
      axialTilt: '3.13°',
      surfaceTemp: '-110°C (cloud tops)',
      atmosphere: 'Hydrogen (89%), Helium (10%), traces of methane, ammonia',
      moons: '95 known (4 large Galilean moons)',
      description: 'Jupiter is the largest planet in the Solar System, more than twice as massive as all other planets combined. The Great Red Spot is a storm larger than Earth that has persisted for centuries. Jupiter acts as a gravitational shield protecting the inner Solar System.'
    },
    moons: [
      {
        name: 'Io',
        type: 'Galilean Moon',
        orbitalRadius: 5.2,
        orbitalPeriod: 1.769,
        displayRadius: 0.22,
        color: 0xFFD700,
        textureUrl: 'https://www.solarsystemscope.com/textures/download/2k_io.jpg',
        info: {
          diameter: '3,643 km',
          orbitalPeriod: '1.77 days',
          distanceFromJupiter: '421,700 km',
          description: 'Io is the most volcanically active body in the Solar System. Tidal forces from Jupiter and neighboring moons generate intense heat, powering hundreds of volcanoes that erupt sulfur compounds, giving Io its distinctive yellow-orange color.'
        }
      },
      {
        name: 'Europa',
        type: 'Galilean Moon',
        orbitalRadius: 8.3,
        orbitalPeriod: 3.551,
        displayRadius: 0.19,
        color: 0xE8D8C0,
        textureUrl: 'https://www.solarsystemscope.com/textures/download/2k_europa.jpg',
        info: {
          diameter: '3,122 km',
          orbitalPeriod: '3.55 days',
          distanceFromJupiter: '671,100 km',
          description: 'Europa has a smooth icy surface with a subsurface ocean of liquid water beneath. This makes it one of the most promising candidates for extraterrestrial life in our Solar System. ESA\'s JUICE mission and NASA\'s Europa Clipper will study it in detail.'
        }
      },
      {
        name: 'Ganymede',
        type: 'Galilean Moon',
        orbitalRadius: 13.2,
        orbitalPeriod: 7.155,
        displayRadius: 0.28,
        color: 0xA09080,
        textureUrl: 'https://www.solarsystemscope.com/textures/download/2k_ganymede.jpg',
        info: {
          diameter: '5,268 km',
          orbitalPeriod: '7.15 days',
          distanceFromJupiter: '1,070,400 km',
          description: 'Ganymede is the largest moon in the Solar System, even larger than Mercury. It is the only moon known to have its own magnetic field. It also has a subsurface ocean, making it another candidate for habitability research.'
        }
      },
      {
        name: 'Callisto',
        type: 'Galilean Moon',
        orbitalRadius: 23.2,
        orbitalPeriod: 16.69,
        displayRadius: 0.26,
        color: 0x808888,
        textureUrl: 'https://www.solarsystemscope.com/textures/download/2k_callisto.jpg',
        info: {
          diameter: '4,821 km',
          orbitalPeriod: '16.69 days',
          distanceFromJupiter: '1,882,700 km',
          description: 'Callisto is the most heavily cratered object in the Solar System — its surface has remained geologically dead for billions of years. It also likely has a subsurface ocean and is considered a potential location for a future human outpost due to its distance from Jupiter\'s radiation belts.'
        }
      }
    ]
  },
  {
    name: 'Saturn',
    type: 'Gas Giant',
    semiMajorAxis: 9.53707032 * AU,
    eccentricity: 0.05415060,
    inclination: 2.48446,
    longitudeAscNode: 113.71504,
    argPerihelion: 92.43194,
    meanLongitude: 49.94432,
    orbitalPeriod: 10759.22,
    radius: 58232,
    displayRadius: 2.6,
    realDisplayRadius: 0.582,
    axialTilt: 26.73,
    rotationPeriod: 10.656,
    color: 0xEAD6A0,
    textureUrl: 'https://www.solarsystemscope.com/textures/download/2k_saturn.jpg',
    ringData: {
      innerRadius: 3.8,
      outerRadius: 7.2,
      textureUrl: 'https://www.solarsystemscope.com/textures/download/2k_saturn_ring_alpha.png'
    },
    info: {
      diameter: '116,460 km',
      mass: '5.683 × 10²⁶ kg',
      distanceFromSun: '1.43 billion km (9.537 AU)',
      orbitalPeriod: '29.46 Earth years',
      rotationPeriod: '10h 39min',
      axialTilt: '26.73°',
      surfaceTemp: '-140°C (cloud tops)',
      atmosphere: 'Hydrogen (96%), Helium (3%), trace methane and ammonia',
      moons: '146 known (including Titan)',
      description: 'Saturn is famous for its spectacular ring system, made of ice and rock particles ranging from tiny grains to boulders. Saturn is the least dense planet — it would float on water. Its moon Titan is the only moon in the Solar System with a dense atmosphere.'
    },
    moons: [
      {
        name: 'Titan',
        type: 'Natural Satellite',
        orbitalRadius: 16.0,
        orbitalPeriod: 15.945,
        displayRadius: 0.28,
        color: 0xE8A840,
        textureUrl: 'https://www.solarsystemscope.com/textures/download/2k_titan.jpg',
        info: {
          diameter: '5,151 km',
          orbitalPeriod: '15.95 days',
          distanceFromSaturn: '1,221,870 km',
          atmosphere: 'Nitrogen (98.4%), Methane (1.4%)',
          description: 'Titan is Saturn\'s largest moon and the second-largest moon in the Solar System. It is the only moon with a dense atmosphere and the only body other than Earth known to have stable liquid on its surface — lakes and seas of liquid methane and ethane. NASA\'s Dragonfly mission will explore Titan in the 2030s.'
        }
      }
    ]
  },
  {
    name: 'Uranus',
    type: 'Ice Giant',
    semiMajorAxis: 19.19126393 * AU,
    eccentricity: 0.04716771,
    inclination: 0.76986,
    longitudeAscNode: 74.22988,
    argPerihelion: 170.96424,
    meanLongitude: 313.23218,
    orbitalPeriod: 30688.5,
    radius: 25362,
    displayRadius: 1.5,
    realDisplayRadius: 0.254,
    axialTilt: 97.77,
    rotationPeriod: -17.24, // retrograde
    color: 0x7DE8E8,
    textureUrl: 'https://www.solarsystemscope.com/textures/download/2k_uranus.jpg',
    info: {
      diameter: '50,724 km',
      mass: '8.681 × 10²⁵ kg',
      distanceFromSun: '2.87 billion km (19.19 AU)',
      orbitalPeriod: '84.01 Earth years',
      rotationPeriod: '17h 14min (retrograde)',
      axialTilt: '97.77° (orbits on its side)',
      surfaceTemp: '-195°C (cloud tops, coldest planet)',
      atmosphere: 'Hydrogen (83%), Helium (15%), Methane (2.3%)',
      moons: '28 known',
      description: 'Uranus rotates on its side with an axial tilt of nearly 98°, likely caused by a massive collision early in the Solar System\'s history. It is the coldest planet with a minimum atmospheric temperature of -224°C. Its blue-green color comes from methane absorption of red light.'
    }
  },
  {
    name: 'Neptune',
    type: 'Ice Giant',
    semiMajorAxis: 30.06896348 * AU,
    eccentricity: 0.00858587,
    inclination: 1.76917,
    longitudeAscNode: 131.72169,
    argPerihelion: 44.97135,
    meanLongitude: 304.88003,
    orbitalPeriod: 60182,
    radius: 24622,
    displayRadius: 1.45,
    realDisplayRadius: 0.246,
    axialTilt: 28.32,
    rotationPeriod: 16.11,
    color: 0x4466FF,
    textureUrl: 'https://www.solarsystemscope.com/textures/download/2k_neptune.jpg',
    info: {
      diameter: '49,244 km',
      mass: '1.024 × 10²⁶ kg',
      distanceFromSun: '4.50 billion km (30.07 AU)',
      orbitalPeriod: '164.8 Earth years',
      rotationPeriod: '16h 6min',
      axialTilt: '28.32°',
      surfaceTemp: '-200°C (cloud tops)',
      atmosphere: 'Hydrogen (80%), Helium (19%), Methane (1.5%)',
      moons: '16 known (including Triton)',
      description: 'Neptune is the farthest planet from the Sun. It was the first planet found through mathematical prediction rather than observation. Neptune has the strongest sustained winds in the Solar System, reaching 2,100 km/h. Its moon Triton orbits in the opposite direction to Neptune\'s rotation, suggesting it was captured from the Kuiper Belt.'
    }
  }
];

export const DWARF_PLANETS = [
  {
    name: 'Pluto',
    type: 'Dwarf Planet',
    semiMajorAxis: 39.48168677 * AU,
    eccentricity: 0.24880766,
    inclination: 17.14175,
    longitudeAscNode: 110.30347,
    argPerihelion: 224.06676,
    meanLongitude: 238.92881,
    orbitalPeriod: 90560,
    radius: 1188.3,
    displayRadius: 0.2,
    realDisplayRadius: 0.0119,
    axialTilt: 122.53,
    rotationPeriod: -153.3, // retrograde
    color: 0xC8A878,
    textureUrl: 'https://www.solarsystemscope.com/textures/download/2k_pluto.jpg',
    info: {
      diameter: '2,376 km',
      mass: '1.303 × 10²² kg',
      distanceFromSun: '5.91 billion km (39.5 AU)',
      orbitalPeriod: '248 Earth years',
      rotationPeriod: '6.39 Earth days (retrograde)',
      axialTilt: '122.53°',
      surfaceTemp: '-218°C to -228°C',
      atmosphere: 'Tenuous nitrogen, methane, carbon monoxide',
      moons: '5 (Charon, Nix, Hydra, Kerberos, Styx)',
      description: 'Pluto was considered the ninth planet until 2006, when it was reclassified as a dwarf planet by the IAU. NASA\'s New Horizons probe revealed Pluto has a heart-shaped plain of nitrogen ice (Tombaugh Regio) and surprisingly complex geology including ice mountains 3,500 m tall.'
    }
  },
  {
    name: 'Ceres',
    type: 'Dwarf Planet',
    semiMajorAxis: 2.7658 * AU,
    eccentricity: 0.07554,
    inclination: 10.593,
    longitudeAscNode: 80.393,
    argPerihelion: 72.522,
    meanLongitude: 95.989,
    orbitalPeriod: 1680.5,
    radius: 476.2,
    displayRadius: 0.12,
    realDisplayRadius: 0.00476,
    axialTilt: 4.0,
    rotationPeriod: 9.074,
    color: 0x888880,
    textureUrl: 'https://www.solarsystemscope.com/textures/download/2k_ceres.jpg',
    info: {
      diameter: '945 km',
      mass: '9.39 × 10²⁰ kg',
      distanceFromSun: '413.7 million km (2.77 AU)',
      orbitalPeriod: '4.60 Earth years',
      rotationPeriod: '9h 4min',
      axialTilt: '4°',
      surfaceTemp: '-105°C (average)',
      atmosphere: 'Very thin water vapor',
      moons: '0',
      description: 'Ceres is the largest object in the asteroid belt and the only dwarf planet in the inner Solar System. NASA\'s Dawn spacecraft discovered mysterious bright spots in Occator Crater — now known to be sodium carbonate (salt) deposits from brine that rose to the surface.'
    }
  }
];

// Asteroid belt configuration (visual only, not individual asteroids)
export const ASTEROID_BELT = {
  innerRadius: 2.2 * AU,
  outerRadius: 3.2 * AU,
  count: 2500,
  ySpread: 4.0
};
