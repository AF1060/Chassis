// SVG generation helpers

function svgHeader(width, height) {
    const safeWidth = Number.isFinite(width) ? Math.max(10, width) : 120;
    const safeHeight = Number.isFinite(height) ? Math.max(10, height) : 120;
    return `<svg xmlns="http://www.w3.org/2000/svg"
         class="generated-svg"
         viewBox="0 0 ${safeWidth} ${safeHeight}"
         width="${safeWidth}mm"
         height="${safeHeight}mm"
         preserveAspectRatio="xMidYMid meet"
         role="img"
         aria-label="Generated chassis preview"
         style="display:block;max-width:100%;width:100%;height:auto;">`;
}

function svgFooter() {
    return `</svg>`;
}

function svgRect(x, y, w, h, fill, stroke, strokeWidth) {
    fill = fill || "none";
    stroke = stroke || "#333";
    strokeWidth = strokeWidth || 0.2;
    w = Math.max(0, w);
    h = Math.max(0, h);
    return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}"/>\n`;
}

function svgCircle(cx, cy, r, fill, stroke, strokeWidth) {
    fill = fill || "none";
    stroke = stroke || "#333";
    strokeWidth = strokeWidth || 0.2;
    return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}"/>\n`;
}

function svgLine(x1, y1, x2, y2, stroke, strokeWidth) {
    stroke = stroke || "#333";
    strokeWidth = strokeWidth || 0.2;
    return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${stroke}" stroke-width="${strokeWidth}"/>\n`;
}

function svgPath(d, fill, stroke, strokeWidth, fillRule) {
    fill = fill || "none";
    stroke = stroke || "#333";
    strokeWidth = strokeWidth || 0.2;
    const fr = fillRule ? ` fill-rule="${fillRule}"` : "";
    return `<path d="${d}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}"${fr}/>\n`;
}

function svgText(x, y, text, size) {
    size = size || 3;
    return `<text x="${x}" y="${y}" font-size="${size}mm" font-family="sans-serif" fill="#555">${text}</text>\n`;
}

// Draw an L-shaped path (used for light traps)
function svgLPolygon(points, fill, stroke, strokeWidth) {
    if (points.length < 2) return "";
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
        d += ` L ${points[i].x} ${points[i].y}`;
    }
    d += " Z";
    return svgPath(d, fill, stroke, strokeWidth);
}

// Draw a part label
function svgLabel(x, y, label) {
    return svgText(x, y, label, 2.5);
}

// ═══ Dimension annotation helpers ═══
// All dimensions drawn in blue (#0066cc) to distinguish from geometry

const DIM_COLOR = "#0066cc";
const DIM_STROKE = 0.15;
const DIM_FONT = 2;
const DIM_ARROW = 1.2; // arrowhead size
const DIM_EXT = 1;     // extension line overshoot

// Horizontal dimension: measures distance along X at a given Y offset
// side: "above" (offset upward) or "below" (offset downward)
function svgDimH(x1, x2, y, label, side) {
    side = side || "below";
    const dir = (side === "above") ? -1 : 1;
    const off = 5 * dir;
    const extEnd = off + DIM_EXT * dir;
    const dy = y + off;
    const svg = [];

    svg.push(svgLine(x1, y, x1, y + extEnd, DIM_COLOR, DIM_STROKE));
    svg.push(svgLine(x2, y, x2, y + extEnd, DIM_COLOR, DIM_STROKE));

    svg.push(svgLine(x1, dy, x2, dy, DIM_COLOR, DIM_STROKE));

    svg.push(svgArrowH(x1, dy, 1));
    svg.push(svgArrowH(x2, dy, -1));

    const mx = (x1 + x2) / 2;
    svg.push(`<text x="${mx}" y="${dy - 0.8 * dir}" font-size="${DIM_FONT}mm" font-family="sans-serif" fill="${DIM_COLOR}" text-anchor="middle">${label}</text>`);

    return svg.join("");
}

// Vertical dimension: measures distance along Y at a given X offset
// side: "left" or "right"
function svgDimV(x, y1, y2, label, side) {
    side = side || "right";
    const dir = (side === "left") ? -1 : 1;
    const off = 5 * dir;
    const extEnd = off + DIM_EXT * dir;
    const dx = x + off;
    const svg = [];

    svg.push(svgLine(x, y1, x + extEnd, y1, DIM_COLOR, DIM_STROKE));
    svg.push(svgLine(x, y2, x + extEnd, y2, DIM_COLOR, DIM_STROKE));

    svg.push(svgLine(dx, y1, dx, y2, DIM_COLOR, DIM_STROKE));

    svg.push(svgArrowV(dx, y1, 1));
    svg.push(svgArrowV(dx, y2, -1));

    const my = (y1 + y2) / 2;
    svg.push(`<text x="${dx + 1.2 * dir}" y="${my}" font-size="${DIM_FONT}mm" font-family="sans-serif" fill="${DIM_COLOR}" text-anchor="middle" transform="rotate(-90,${dx + 1.2 * dir},${my})">${label}</text>`);

    return svg.join("");
}

// Leader line: points from (fx,fy) to a label at (tx,ty)
function svgDimLeader(fx, fy, tx, ty, label) {
    const svg = [];
    svg.push(svgLine(fx, fy, tx, ty, DIM_COLOR, DIM_STROKE));
    svg.push(svgCircle(fx, fy, 0.4, DIM_COLOR, DIM_COLOR, 0.1));
    svg.push(`<text x="${tx + 1}" y="${ty + 0.5}" font-size="${DIM_FONT}mm" font-family="sans-serif" fill="${DIM_COLOR}">${label}</text>`);
    return svg.join("");
}

// Small arrowhead for horizontal dims
function svgArrowH(x, y, dir) {
    const a = DIM_ARROW;
    const d = `M ${x} ${y} L ${x + a * dir} ${y - a * 0.4} L ${x + a * dir} ${y + a * 0.4} Z`;
    return svgPath(d, DIM_COLOR, DIM_COLOR, 0.05);
}

// Small arrowhead for vertical dims
function svgArrowV(x, y, dir) {
    const a = DIM_ARROW;
    const d = `M ${x} ${y} L ${x - a * 0.4} ${y + a * dir} L ${x + a * 0.4} ${y + a * dir} Z`;
    return svgPath(d, DIM_COLOR, DIM_COLOR, 0.05);
}
