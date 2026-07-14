// DXF Export module — 4-layer sandwich

function exportDXF(parts, filename) {
    let dxf = "";

    dxf += "0\nSECTION\n2\nHEADER\n";
    dxf += "9\n$ACADVER\n1\nAC1015\n";
    dxf += "0\nENDSEC\n";

    dxf += "0\nSECTION\n2\nTABLES\n";
    dxf += "0\nTABLE\n2\nLAYER\n70\n1\n";
    dxf += "0\nLAYER\n2\n0\n70\n0\n62\n7\n6\nCONTINUOUS\n";
    dxf += "0\nENDTAB\n";
    dxf += "0\nENDSEC\n";

    dxf += "0\nSECTION\n2\nENTITIES\n";

    for (let i = 0; i < parts.length; i++) {
        const p = parts[i];
        if (p.type === "rect") {
            dxf += dxfLWPolyline([
                { x: p.x, y: p.y },
                { x: p.x + p.w, y: p.y },
                { x: p.x + p.w, y: p.y + p.h },
                { x: p.x, y: p.y + p.h }
            ], true);
        } else if (p.type === "circle") {
            dxf += dxfCircle(p.cx, p.cy, p.r);
        } else if (p.type === "line") {
            dxf += dxfLine(p.x1, p.y1, p.x2, p.y2);
        }
    }

    dxf += "0\nENDSEC\n";
    dxf += "0\nEOF\n";

    const blob = new Blob([dxf], { type: "application/dxf" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename || "chassis.dxf";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function dxfLWPolyline(points, closed) {
    let s = "0\nLWPOLYLINE\n8\n0\n90\n" + points.length + "\n";
    s += (closed ? "70\n1\n" : "70\n0\n");
    for (let i = 0; i < points.length; i++) {
        s += "10\n" + points[i].x + "\n20\n" + points[i].y + "\n";
    }
    return s;
}

function dxfCircle(cx, cy, r) {
    return "0\nCIRCLE\n8\n0\n10\n" + cx + "\n20\n" + cy + "\n40\n" + r + "\n";
}

function dxfLine(x1, y1, x2, y2) {
    return "0\nLINE\n8\n0\n10\n" + x1 + "\n20\n" + y1 + "\n11\n" + x2 + "\n21\n" + y2 + "\n";
}

// Build DXF parts for the 4-layer sandwich
function buildDXFParts(params) {
    const parts = [];
    const outW = params.outW, outH = params.outH;
    const glassW = params.glassW, glassH = params.glassH;
    const sr = params.dsSideRail, br = params.dsBottomRail;
    const pullW = params.pullW, pullD = params.pullD;
    const magD = params.magD, magCount = params.magCount;
    const spacing = 10;

    // Layer 1: Front Frame
    parts.push({ type: "rect", x: 0, y: 0, w: outW, h: outH });
    const gx = (outW - glassW) / 2;
    const gy = (outH - glassH) / 2;
    parts.push({ type: "rect", x: gx, y: gy, w: glassW, h: glassH });

    // Layer 2: Darkslide U-Frame
    const ufX = outW + spacing;
    parts.push({ type: "rect", x: ufX, y: 0, w: outW, h: outH });
    parts.push({ type: "rect", x: ufX + sr, y: 0, w: outW - 2 * sr, h: outH - br });

    // Layer 3: Spacer (with finger notch on top edge)
    const spX = 2 * (outW + spacing);
    parts.push({ type: "rect", x: spX, y: 0, w: outW, h: outH });
    const notchR = Math.min(6, outW * 0.04);
    const notchCx = spX + outW / 2;
    parts.push({ type: "circle", cx: notchCx, cy: 0, r: notchR });
    const support = 1;
    const cutW = glassW - 2 * support;
    const cutH = glassH - 2 * support;
    const cutX = (outW - cutW) / 2;
    const cutY = (outH - cutH) / 2;
    parts.push({ type: "rect", x: spX + cutX, y: cutY, w: cutW, h: cutH });

    const magPositions = computeMagnetPositions(spX, 0, outW, outH, magD, magCount, true, 2 * notchR);
    magPositions.forEach(p => parts.push({ type: "circle", cx: p.cx, cy: p.cy, r: p.r }));

    // Layer 4: Back Panel
    const bpX = 3 * (outW + spacing);
    parts.push({ type: "rect", x: bpX, y: 0, w: outW, h: outH });
    const fpx = bpX + (outW - pullW) / 2;
    parts.push({ type: "rect", x: fpx, y: outH - pullD, w: pullW, h: pullD });

    const backMagPositions = computeMagnetPositions(bpX, 0, outW, outH, magD, magCount, false);
    backMagPositions.forEach(p => parts.push({ type: "circle", cx: p.cx, cy: p.cy, r: p.r }));

    // Darkslide Plate
    const dpX = 4 * (outW + spacing);
    const plateW = getDSPlateWidth(params);
    const plateH = getDSPlateHeight(params);
    parts.push({ type: "rect", x: dpX, y: 0, w: plateW, h: plateH });

    return parts;
}
