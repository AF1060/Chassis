// Magnet housings drawing module
// Supports notch avoidance: magnets won't overlap the finger-pull notch area.

function computeMagnetPositions(ox, oy, panelW, panelH, magD, magCount, avoidNotch, notchWidth) {
    const positions = [];
    if (magCount <= 0) return positions;

    const r = magD / 2;
    const padding = 5;
    const notchW = notchWidth || 12;
    const notchCx = ox + panelW / 2;

    const avoid = (cx) => {
        if (!avoidNotch) return cx;
        const minX = notchCx - notchW / 2 - r - 2;
        const maxX = notchCx + notchW / 2 + r + 2;
        if (cx >= minX && cx <= maxX) {
            cx = (cx < notchCx) ? minX : maxX;
        }
        return cx;
    };

    if (magCount <= 2) {
        const spacing = panelW / (magCount + 1);
        for (let i = 0; i < magCount; i++) {
            const cx = avoid(ox + spacing * (i + 1));
            positions.push({ cx, cy: oy + padding + r, r });
        }
    } else {
        const perSide = Math.ceil(magCount / 4);
        let idx = 0;

        // Top — avoid notch zone
        for (let i = 0; i < perSide && idx < magCount; i++, idx++) {
            const cx = avoid(ox + (panelW / (perSide + 1)) * (i + 1));
            positions.push({ cx, cy: oy + padding + r, r });
        }
        // Bottom
        for (let i = 0; i < perSide && idx < magCount; i++, idx++) {
            const cx = ox + (panelW / (perSide + 1)) * (i + 1);
            positions.push({ cx, cy: oy + panelH - padding - r, r });
        }
        // Left
        for (let i = 0; i < perSide && idx < magCount; i++, idx++) {
            const cy = oy + (panelH / (perSide + 1)) * (i + 1);
            positions.push({ cx: ox + padding + r, cy, r });
        }
        // Right
        for (let i = 0; i < perSide && idx < magCount; i++, idx++) {
            const cy = oy + (panelH / (perSide + 1)) * (i + 1);
            positions.push({ cx: ox + panelW - padding - r, cy, r });
        }
    }
    return positions;
}

function drawMagnets(ox, oy, panelW, panelH, magD, magCount, avoidNotch, notchWidth) {
    const positions = computeMagnetPositions(ox, oy, panelW, panelH, magD, magCount, avoidNotch, notchWidth);
    return positions.map(p => drawMagnetHousing(p.cx, p.cy, p.r)).join("");
}

function drawMagnetHousing(cx, cy, r) {
    const parts = [];
    parts.push(svgCircle(cx, cy, r, "none", "#e94560", 0.15));
    parts.push(svgRect(cx - r - 0.5, cy - r - 0.5, (r + 0.5) * 2, (r + 0.5) * 2, "none", "#888", 0.1));
    return parts.join("");
}
