// Kerf compensation module

function applyKerf(points, kerf, mode) {
    // mode: "inside", "outside", "both", "none"
    if (mode === "none" || kerf === 0) return points;

    if (mode === "inside") {
        return offsetPolygon(points, -kerf / 2);
    }
    if (mode === "outside") {
        return offsetPolygon(points, kerf / 2);
    }
    if (mode === "both") {
        const inner = offsetPolygon(points, -kerf / 2);
        const outer = offsetPolygon(points, kerf / 2);
        return { inner, outer, mode: "both" };
    }
    return points;
}

// Offset a polygon by a distance (positive = outward, negative = inward)
function offsetPolygon(points, dist) {
    if (points.length < 3) return points;

    const result = [];
    const n = points.length;

    for (let i = 0; i < n; i++) {
        const prev = points[(i - 1 + n) % n];
        const curr = points[i];
        const next = points[(i + 1) % n];

        // Edge normals
        const dx1 = curr.x - prev.x, dy1 = curr.y - prev.y;
        const dx2 = next.x - curr.x, dy2 = next.y - curr.y;
        const len1 = Math.hypot(dx1, dy1) || 1;
        const len2 = Math.hypot(dx2, dy2) || 1;

        // Inward normals
        const nx1 = -dy1 / len1, ny1 = dx1 / len1;
        const nx2 = -dy2 / len2, ny2 = dx2 / len2;

        // Average normal
        const nx = nx1 + nx2, ny = ny1 + ny2;
        const nlen = Math.hypot(nx, ny) || 1;

        result.push({
            x: curr.x + (nx / nlen) * dist,
            y: curr.y + (ny / nlen) * dist
        });
    }
    return result;
}

// Offset a rectangle (simple case)
function kerfRect(x, y, w, h, kerf, mode) {
    if (mode === "none" || kerf === 0) return { x, y, w, h };
    const k = kerf / 2;
    if (mode === "inside") return { x: x + k, y: y + k, w: Math.max(0.1, w - 2 * k), h: Math.max(0.1, h - 2 * k) };
    if (mode === "outside") return { x: x - k, y: y - k, w: w + 2 * k, h: h + 2 * k };
    return { x, y, w, h };
}
