// Light trap drawing module
// Light traps are maze-like channels that prevent light leaks at panel joints

function drawLightTrap(ox, oy, length, ltDepth, ltWidth, direction) {
    // direction: "horizontal" or "vertical"
    // Draws a zigzag channel along the edge
    const wallThickness = ltWidth;
    const channelWidth = ltWidth;
    const toothCount = Math.max(1, Math.floor(length / (ltDepth * 2)));
    const toothLen = length / toothCount;
    const svg = [];

    if (direction === "horizontal") {
        for (let i = 0; i < toothCount; i++) {
            const tx = ox + i * toothLen;
            svg.push(svgRect(tx, oy, toothLen / 2, wallThickness, "#aaa", "#333", 0.15));
            svg.push(svgRect(tx + toothLen / 2, oy + ltDepth - wallThickness, toothLen / 2, wallThickness, "#aaa", "#333", 0.15));
        }
        svg.push(svgRect(ox, oy, length, ltDepth, "none", "#e94560", 0.1));
    } else {
        for (let i = 0; i < toothCount; i++) {
            const ty = oy + i * toothLen;
            svg.push(svgRect(ox, ty, wallThickness, toothLen / 2, "#aaa", "#333", 0.15));
            svg.push(svgRect(ox + ltDepth - wallThickness, ty + toothLen / 2, wallThickness, toothLen / 2, "#aaa", "#333", 0.15));
        }
        svg.push(svgRect(ox, oy, ltDepth, length, "none", "#e94560", 0.1));
    }
    return svg.join("");
}

// Draw light traps around the perimeter of a panel
function drawPerimeterLightTraps(ox, oy, w, h, ltDepth, ltWidth) {
    const svg = [];
    svg.push(drawLightTrap(ox + ltDepth, oy, w - 2 * ltDepth, ltDepth, ltWidth, "horizontal"));
    svg.push(drawLightTrap(ox + ltDepth, oy + h - ltDepth, w - 2 * ltDepth, ltDepth, ltWidth, "horizontal"));
    svg.push(drawLightTrap(ox, oy + ltDepth, h - 2 * ltDepth, ltDepth, ltWidth, "vertical"));
    svg.push(drawLightTrap(ox + w - ltDepth, oy + ltDepth, h - 2 * ltDepth, ltDepth, ltWidth, "vertical"));
    return svg.join("");
}
