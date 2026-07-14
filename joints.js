// Finger joints module
// Generates interlocking finger joint patterns along an edge

function generateFingers(edgeLength, fingerWidth, thickness) {
    const count = Math.max(1, Math.round(edgeLength / fingerWidth));
    const actualW = edgeLength / count;
    const fingers = [];
    for (let i = 0; i < count; i++) {
        fingers.push({
            x: i * actualW,
            w: actualW,
            isTab: i % 2 === 0
        });
    }
    return fingers;
}

function drawFingersTop(ox, oy, edgeLen, fingerW, thickness) {
    if (edgeLen <= 0 || thickness <= 0) return "";
    const fingers = generateFingers(edgeLen, fingerW, thickness);
    const parts = [];
    let x = ox;
    for (const f of fingers) {
        if (f.isTab) {
            parts.push(svgRect(x, oy - thickness, f.w, thickness, "none", "#888", 0.1));
        } else {
            parts.push(svgRect(x, oy, f.w, thickness, "none", "#888", 0.1));
        }
        x += f.w;
    }
    return parts.join("");
}

function drawFingersBottom(ox, oy, edgeLen, fingerW, thickness) {
    if (edgeLen <= 0 || thickness <= 0) return "";
    const fingers = generateFingers(edgeLen, fingerW, thickness);
    const parts = [];
    let x = ox;
    for (const f of fingers) {
        if (f.isTab) {
            parts.push(svgRect(x, oy, f.w, thickness, "none", "#888", 0.1));
        } else {
            parts.push(svgRect(x, oy - thickness, f.w, thickness, "none", "#888", 0.1));
        }
        x += f.w;
    }
    return parts.join("");
}

function drawFingersLeft(ox, oy, edgeLen, fingerW, thickness) {
    if (edgeLen <= 0 || thickness <= 0) return "";
    const fingers = generateFingers(edgeLen, fingerW, thickness);
    const parts = [];
    let y = oy;
    for (const f of fingers) {
        if (f.isTab) {
            parts.push(svgRect(ox - thickness, y, thickness, f.w, "none", "#888", 0.1));
        } else {
            parts.push(svgRect(ox, y, thickness, f.w, "none", "#888", 0.1));
        }
        y += f.w;
    }
    return parts.join("");
}

function drawFingersRight(ox, oy, edgeLen, fingerW, thickness) {
    if (edgeLen <= 0 || thickness <= 0) return "";
    const fingers = generateFingers(edgeLen, fingerW, thickness);
    const parts = [];
    let y = oy;
    for (const f of fingers) {
        if (f.isTab) {
            parts.push(svgRect(ox, y, thickness, f.w, "none", "#888", 0.1));
        } else {
            parts.push(svgRect(ox - thickness, y, thickness, f.w, "none", "#888", 0.1));
        }
        y += f.w;
    }
    return parts.join("");
}
