// Default camera/chassis parameters (overridden by UI inputs at runtime)
const Camera = {
    outside: { width: 140, height: 200 },
    glass: { width: 130, height: 180, thickness: 2 },
    flange: { width: 3, thickness: 2 },
    darkslide: {
        sideRail: 16.1,     // mm width of each side rail
        bottomRail: 21.7,   // mm height of bottom rail
        thickness: 0.5,     // mm plate thickness
        clearance: 0.5      // mm clearance for plate in channel
    },
    spacer: {
        margin: 1.5,         // mm border from outer edge to inner cutout
        glassSeparation: 1   // mm separation from glass surface
    },
    fingerPull: { width: 30, depth: 8 },
    laser: { kerf: 0.12 },
    lightTrap: { depth: 3, width: 2 },
    magnets: { diameter: 6, count: 4 }
};
