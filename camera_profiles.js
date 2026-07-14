// Camera profiles for common formats
// Dimensions in mm — each profile defines all 4 layers

const CameraProfiles = {
    "180x240": {
        name: "180\u00D7240 European",
        outside: { width: 215, height: 280 },
        glass:   { width: 178, height: 236, thickness: 2 },
        flange:  { width: 3, thickness: 2 },
        darkslide: { sideRail: 16.1, bottomRail: 21.7, thickness: 0.5, clearance: 0.5 }
    },
    "4x5": {
        name: "4\u00D75 Large Format",
        outside: { width: 140, height: 172 },
        glass:   { width: 102, height: 127, thickness: 2 },
        flange:  { width: 3, thickness: 2 },
        darkslide: { sideRail: 12, bottomRail: 18, thickness: 0.5, clearance: 0.5 }
    },
    "5x7": {
        name: "5\u00D77 Large Format",
        outside: { width: 165, height: 223 },
        glass:   { width: 127, height: 178, thickness: 2 },
        flange:  { width: 3, thickness: 2 },
        darkslide: { sideRail: 14, bottomRail: 20, thickness: 0.5, clearance: 0.5 }
    },
    "8x10": {
        name: "8\u00D710 Large Format",
        outside: { width: 241, height: 299 },
        glass:   { width: 203, height: 254, thickness: 2 },
        flange:  { width: 3, thickness: 2 },
        darkslide: { sideRail: 16, bottomRail: 22, thickness: 0.5, clearance: 0.5 }
    }
};

// Apply a profile to the UI inputs
function applyProfile(profileKey) {
    if (profileKey === "custom") return;
    const p = CameraProfiles[profileKey];
    if (!p) return;

    setVal("outW", p.outside.width);
    setVal("outH", p.outside.height);
    setVal("glassW", p.glass.width);
    setVal("glassH", p.glass.height);
    setVal("glassT", p.glass.thickness);
    setVal("flangeW", p.flange.width);
    setVal("flangeT", p.flange.thickness);
    setVal("dsSideRail", p.darkslide.sideRail);
    setVal("dsBottomRail", p.darkslide.bottomRail);
    setVal("dsT", p.darkslide.thickness);
    setVal("dsClearance", p.darkslide.clearance);
}

function setVal(id, v) {
    const el = document.getElementById(id);
    if (el) el.value = v;
}
