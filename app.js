// ═══════════════════════════════════════════════════
// Main Application Controller — 4-Layer Sandwich
// Front Frame → Darkslide U-Frame → Spacer → Back Panel
// ═══════════════════════════════════════════════════

const LAYER_COLORS = {
    front:     { fill: "#e8d5a3", stroke: "#b8a573" },
    uframe:    { fill: "#ddd8c4", stroke: "#ada894" },
    spacer:    { fill: "#c8e6c9", stroke: "#98b69a" },
    back:      { fill: "#ffcdd2", stroke: "#cf9da2" },
    darkslide: { fill: "#b0c4de", stroke: "#8094ae" }
};

let currentSVG = "";
let debounceTimer = null;

const STORAGE_KEY = "chassis_params";

// ── Param validation ──
function validateParams(p) {
    if (!p || typeof p !== "object") {
        throw new Error("No parameters were available.");
    }
    const errors = [];
    if (!Number.isFinite(p.outW) || p.outW <= 0) errors.push(t("error.outW"));
    if (!Number.isFinite(p.outH) || p.outH <= 0) errors.push(t("error.outH"));
    if (!Number.isFinite(p.glassW) || p.glassW <= 0) errors.push(t("error.glassW"));
    if (!Number.isFinite(p.glassH) || p.glassH <= 0) errors.push(t("error.glassH"));
    if (!Number.isFinite(p.glassT) || p.glassT <= 0) errors.push(t("error.glassT"));
    if (!Number.isFinite(p.flangeW) || p.flangeW < 0) errors.push(t("error.flangeW"));
    if (!Number.isFinite(p.flangeT) || p.flangeT <= 0) errors.push(t("error.flangeT"));
    if (!Number.isFinite(p.spacerMargin) || p.spacerMargin < 0) errors.push(t("error.spacerMargin"));
    if (!Number.isFinite(p.dsSideRail) || p.dsSideRail <= 0) errors.push(t("error.dsSideRail"));
    if (!Number.isFinite(p.dsBottomRail) || p.dsBottomRail <= 0) errors.push(t("error.dsBottomRail"));
    if (!Number.isFinite(p.dsT) || p.dsT <= 0) errors.push(t("error.dsT"));
    if (!Number.isFinite(p.dsClearance) || p.dsClearance < 0) errors.push(t("error.dsClearance"));
    if (!Number.isFinite(p.pullW) || p.pullW <= 0) errors.push(t("error.pullW"));
    if (!Number.isFinite(p.pullD) || p.pullD <= 0) errors.push(t("error.pullD"));
    if (!Number.isFinite(p.kerf) || p.kerf < 0) errors.push(t("error.kerf"));
    if (!Number.isFinite(p.ltDepth) || p.ltDepth <= 0) errors.push(t("error.ltDepth"));
    if (!Number.isFinite(p.ltWidth) || p.ltWidth <= 0) errors.push(t("error.ltWidth"));
    if (!Number.isFinite(p.magD) || p.magD <= 0) errors.push(t("error.magD"));
    if (!Number.isInteger(p.magCount) || p.magCount < 0) errors.push(t("error.magCount"));

    if (errors.length > 0) {
        throw new Error(errors.join("\n"));
    }

    if (p.glassW >= p.outW) errors.push(t("error.glassWvsOutW"));
    if (p.glassH >= p.outH) errors.push(t("error.glassHvsOutH"));
    if (p.flangeW * 2 + p.glassW > p.outW) errors.push(t("error.flangeFit"));
    if (p.dsSideRail * 2 >= p.outW) errors.push(t("error.uframeFit"));
    if (p.dsBottomRail >= p.outH) errors.push(t("error.ubottomFit"));
    if (errors.length > 0) {
        throw new Error(errors.join("\n"));
    }
}

// ── Read UI parameters ──
function readParams() {
    const getValue = function(id, fallback) {
        const el = document.getElementById(id);
        return el && el.value !== undefined ? el.value : fallback;
    };

    const raw = {
        outW:         getValue("outW", "140"),
        outH:         getValue("outH", "200"),
        glassW:       getValue("glassW", "130"),
        glassH:       getValue("glassH", "180"),
        glassT:       getValue("glassT", "2"),
        glassSep:     getValue("glassSep", "1"),
        flangeW:      getValue("flangeW", "3"),
        flangeT:      getValue("flangeT", "2"),
        spacerMargin: getValue("spacerMargin", "1.5"),
        dsSideRail:   getValue("dsSideRail", "16.1"),
        dsBottomRail: getValue("dsBottomRail", "21.7"),
        dsT:          getValue("dsT", "0.5"),
        dsClearance:  getValue("dsClearance", "0.5"),
        pullW:        getValue("pullW", "30"),
        pullD:        getValue("pullD", "8"),
        kerf:         getValue("kerf", "0.12"),
        kerfMode:     getValue("kerfComp", "inside"),
        material:     getValue("material", "plywood2"),
        ltDepth:      getValue("ltDepth", "3"),
        ltWidth:      getValue("ltWidth", "2"),
        magD:         getValue("magD", "6"),
        magCount:     getValue("magCount", "4"),
        part:         getValue("partSelect", "all"),
    };

    const params = {};
    for (const key of Object.keys(raw)) {
        if (key === "kerfMode" || key === "material" || key === "part") {
            params[key] = raw[key];
        } else if (key === "magCount") {
            const parsed = parseInt(raw[key], 10);
            params[key] = Number.isNaN(parsed) ? 4 : parsed;
        } else {
            const parsed = parseFloat(raw[key]);
            params[key] = Number.isNaN(parsed) ? 0 : parsed;
        }
    }
    return params;
}

function getMaterialThickness(matKey) {
    if (Materials[matKey]) return Materials[matKey].thickness;
    return 2;
}

function getSpacerThickness(params) {
    return params.glassT + params.glassSep;
}

function getDSPlateWidth(params) {
    return Math.max(5, params.outW - 2 * params.dsSideRail - 2 * params.dsClearance);
}

function getDSPlateHeight(params) {
    return Math.max(5, params.outH - params.dsBottomRail - params.dsClearance);
}

// ══════════════════════════════════════════════════
// PART DRAWING FUNCTIONS
// ══════════════════════════════════════════════════

    // ── LAYER 1: FRONT FRAME ──
function drawFrontFrame(params, ox, oy) {
        const outW = params.outW, outH = params.outH;
        const glassW = params.glassW, glassH = params.glassH;
        const flangeW = params.flangeW;
        const kerf = params.kerf, kerfMode = params.kerfMode;
        const c = LAYER_COLORS.front;
        const svg = [];

        svg.push(svgLabel(ox, oy - 8, t("svg.frontFrame")));

        const outer = kerfRect(ox, oy, outW, outH, kerf,
                              (kerfMode === "outside" || kerfMode === "both") ? "outside" : "none");
        svg.push(svgRect(outer.x, outer.y, outer.w, outer.h, c.fill, c.stroke, 0.3));

        const gateX = ox + (outW - glassW) / 2;
        const gateY = oy + (outH - glassH) / 2;
        const gate = kerfRect(gateX, gateY, glassW, glassH, kerf,
                              (kerfMode === "inside" || kerfMode === "both") ? "inside" : "none");
        svg.push(svgRect(gate.x, gate.y, gate.w, gate.h, "none", "#e94560", 0.3));

    const fx = gateX - flangeW;
    const fy = gateY - flangeW;
    const fw = glassW + 2 * flangeW;
    const fh = glassH + 2 * flangeW;
    if (flangeW > 0) {
        svg.push(svgRect(fx, fy, fw, fh, "none", "#888", 0.15));
    }

    svg.push(svgDimH(ox, ox + outW, oy + outH, outW + " mm", "below"));
    svg.push(svgDimV(ox + outW, oy, oy + outH, outH + " mm", "right"));
    svg.push(svgDimH(gateX, gateX + glassW, gateY, glassW + " mm", "above"));
    svg.push(svgDimV(gateX, gateY, gateY + glassH, glassH + " mm", "left"));
    if (flangeW > 0) {
        svg.push(svgDimLeader(fx, fy, fx - 8, fy - 5, t("svg.flange") + " " + flangeW + "mm"));
    }

    return svg.join("");
}

// ── LAYER 2: DARKSLIDE U-FRAME ──
function drawUFrame(params, ox, oy) {
    const outW = params.outW, outH = params.outH;
    const sr = params.dsSideRail, br = params.dsBottomRail;
    const kerf = params.kerf, kerfMode = params.kerfMode;
    const c = LAYER_COLORS.uframe;
    const svg = [];

    svg.push(svgLabel(ox, oy - 8, t("svg.darkslideUFrame")));

    const outer = kerfRect(ox, oy, outW, outH, kerf,
                          (kerfMode === "outside" || kerfMode === "both") ? "outside" : "none");
    svg.push(svgRect(outer.x, outer.y, outer.w, outer.h, "none", "#333", 0.3));

    // Filled rails with layer color
    svg.push(svgRect(ox, oy, sr, outH, c.fill, c.stroke, 0.15));
    svg.push(svgRect(ox + outW - sr, oy, sr, outH, c.fill, c.stroke, 0.15));
    svg.push(svgRect(ox + sr, oy + outH - br, outW - 2 * sr, br, c.fill, c.stroke, 0.15));

    // Inner channel outline (open at top = U shape)
    const chX = ox + sr, chY = oy, chW = outW - 2 * sr, chH = outH - br;
    svg.push(svgLine(chX, chY, chX, chY + chH, "#e94560", 0.2));
    svg.push(svgLine(chX + chW, chY, chX + chW, chY + chH, "#e94560", 0.2));
    svg.push(svgLine(chX, chY + chH, chX + chW, chY + chH, "#e94560", 0.2));
    svg.push(svgLine(chX, oy, chX + chW, oy, "#e94560", 0.1));

    svg.push(svgDimH(ox, ox + outW, oy + outH, outW + " mm", "below"));
    svg.push(svgDimV(ox + outW, oy, oy + outH, outH + " mm", "right"));
    svg.push(svgDimH(ox, ox + sr, oy + outH + 8, sr + " mm", "below"));
    svg.push(svgDimV(ox + outW + 8, oy + outH - br, oy + outH, br + " mm", "right"));
    svg.push(svgDimH(chX, chX + chW, oy + 3, chW.toFixed(1) + " mm", "above"));

    return svg.join("");
}

// ── LAYER 3: SPACER ──
// Outer rectangle with finger notch on top edge + inner cutout + magnets
function drawSpacer(params, ox, oy) {
    const outW = params.outW, outH = params.outH;
    const glassW = params.glassW, glassH = params.glassH;
    const spacerMargin = params.spacerMargin;
    const kerf = params.kerf, kerfMode = params.kerfMode;
    const magD = params.magD, magCount = params.magCount;
    const c = LAYER_COLORS.spacer;
    const svg = [];

    svg.push(svgLabel(ox, oy - 8, t("svg.spacer")));

    const outer = kerfRect(ox, oy, outW, outH, kerf,
                          (kerfMode === "outside" || kerfMode === "both") ? "outside" : "none");

    const ny = outer.y;
    const ob = outer.y + outer.h;
    const notchCx = outer.x + outer.w / 2;

    // Inner cutout: 1mm smaller than glass on each side for support lip
    const support = 1;
    const cutW = Math.max(5, glassW - 2 * support);
    const cutH = Math.max(5, glassH - 2 * support);
    const inner = kerfRect(outer.x + (outer.w - cutW) / 2,
                         outer.y + (outer.h - cutH) / 2,
                         cutW, cutH, kerf,
                         (kerfMode === "inside" || kerfMode === "both") ? "inside" : "none");

    // Notch parameters: target diameter 18mm (radius 9mm), but cap to fit inner opening
    const notchR = Math.min(9, Math.max(1, inner.w / 2 - 0.5));
    const nx1 = notchCx - notchR;
    const nx2 = notchCx + notchR;

    // Compound path: outer rectangle and inner hole. The finger notch is applied to the inner cut line (top edge).
    const nyInner = inner.y;
    const d = "M " + outer.x + " " + outer.y +
            " L " + (outer.x + outer.w) + " " + outer.y +
            " L " + (outer.x + outer.w) + " " + ob +
            " L " + outer.x + " " + ob + " Z" +
            " M " + inner.x + " " + inner.y +
            " L " + (notchCx - notchR) + " " + nyInner +
            " A " + notchR + " " + notchR + " 0 0 1 " + (notchCx + notchR) + " " + nyInner +
            " L " + (inner.x + inner.w) + " " + nyInner +
            " L " + (inner.x + inner.w) + " " + (inner.y + inner.h) +
            " L " + inner.x + " " + (inner.y + inner.h) + " Z";
    svg.push(svgPath(d, c.fill, c.stroke, 0.3, "evenodd"));

    // Cut line for the inner opening (so the hole edge is clearly visible)
    svg.push(svgRect(inner.x, inner.y, inner.w, inner.h, "none", "#e94560", 0.25));

    // Ghost outline of glass for reference
    const gx = ox + (outW - glassW) / 2;
    const gy = oy + (outH - glassH) / 2;
    svg.push(svgRect(gx, gy, glassW, glassH, "none", "#aaa", 0.08));

    // Magnet holes on the spacer: place magnets in canonical positions so they align with the back panel
    svg.push(drawMagnets(ox, oy, outW, outH, magD, magCount, false));

    const spThick = getSpacerThickness(params);
    svg.push(svgLabel(ox + outW + 2, oy + 4, t("svg.thick") + ": " + spThick + "mm"));

    svg.push(svgDimH(ox, ox + outW, oy + outH, outW + " mm", "below"));
    svg.push(svgDimV(ox + outW, oy, oy + outH, outH + " mm", "right"));
    svg.push(svgDimH(inner.x, inner.x + inner.w, inner.y, inner.w + " mm", "above"));
    svg.push(svgDimV(inner.x, inner.y, inner.y + inner.h, inner.h + " mm", "left"));
    svg.push(svgDimLeader(ox + spacerMargin / 2, oy + outH, ox + spacerMargin / 2, oy + outH + 12, t("svg.margin") + " " + spacerMargin + "mm"));
    if (magCount > 0) {
        svg.push(svgDimLeader(ox + 5 + magD / 2, oy + 5 + magD / 2, ox + 5 + magD + 8, oy + 3, "\u00D8" + magD + "mm"));
    }

    return svg.join("");
}

// ── LAYER 4: BACK PANEL ──
function drawBack(params, ox, oy) {
    const outW = params.outW, outH = params.outH;
    const kerf = params.kerf, kerfMode = params.kerfMode;
    const magD = params.magD, magCount = params.magCount;
    const pullW = params.pullW, pullD = params.pullD;
    const c = LAYER_COLORS.back;
    const svg = [];

    svg.push(svgLabel(ox, oy - 8, t("svg.backPanel")));

    const outer = kerfRect(ox, oy, outW, outH, kerf,
                          (kerfMode === "outside" || kerfMode === "both") ? "outside" : "none");
    svg.push(svgRect(outer.x, outer.y, outer.w, outer.h, c.fill, c.stroke, 0.3));

    svg.push(drawFingerPull(params, ox, oy));
    svg.push(drawMagnets(ox, oy, outW, outH, magD, magCount, false));

    svg.push(svgDimH(ox, ox + outW, oy + outH, outW + " mm", "below"));
    svg.push(svgDimV(ox + outW, oy, oy + outH, outH + " mm", "right"));
    const fpx = ox + (outW - pullW) / 2;
    const fpy = oy + outH - pullD;
    svg.push(svgDimH(fpx, fpx + pullW, oy + outH, pullW + " mm", "above"));
    svg.push(svgDimLeader(fpx + pullW / 2, fpy, fpx + pullW / 2 + 12, fpy - 6, t("svg.depth") + " " + pullD + "mm"));
    if (magCount > 0) {
        svg.push(svgDimLeader(ox + 5 + magD / 2, oy + 5 + magD / 2, ox + 5 + magD + 8, oy + 3, "\u00D8" + magD + "mm"));
    }

    return svg.join("");
}

// ── FINGER PULL ──
function drawFingerPull(params, ox, oy) {
    const outW = params.outW, outH = params.outH;
    const pullW = params.pullW, pullD = params.pullD;
    const svg = [];

    const px = ox + (outW - pullW) / 2;
    const py = oy + outH - pullD;
    const r = Math.min(pullD / 2, pullW / 4);

    const d = "M " + px + " " + (oy + outH) +
            " L " + px + " " + (py + r) +
            " Q " + px + " " + py + " " + (px + r) + " " + py +
            " L " + (px + pullW - r) + " " + py +
            " Q " + (px + pullW) + " " + py + " " + (px + pullW) + " " + (py + r) +
            " L " + (px + pullW) + " " + (oy + outH) +
            " Z";

    svg.push(svgPath(d, "none", "#e94560", 0.25));
    svg.push(svgLabel(px + pullW + 1, py + 2, t("svg.fingerPull")));

    return svg.join("");
}

// ══════════════════════════════════════════════════
// SANDWICH / CROSS-SECTION VIEW
// ══════════════════════════════════════════════════

function drawSandwichView(params) {
    const matThick = getMaterialThickness(params.material);
    const spThick = getSpacerThickness(params);
    const dsT = params.dsT;
    const outW = params.outW;
    const outH = params.outH;

    const layers = [
        { nameKey: "svg.frontFrame",      thick: matThick, color: LAYER_COLORS.front.fill,     stroke: LAYER_COLORS.front.stroke },
        { nameKey: "svg.darkslideUFrame", thick: matThick, color: LAYER_COLORS.uframe.fill,    stroke: LAYER_COLORS.uframe.stroke },
        { nameKey: "svg.darkslidePlate",  thick: dsT,      color: LAYER_COLORS.darkslide.fill, stroke: LAYER_COLORS.darkslide.stroke },
        { nameKey: "svg.spacer",          thick: spThick,   color: LAYER_COLORS.spacer.fill,    stroke: LAYER_COLORS.spacer.stroke },
        { nameKey: "svg.backPanel",       thick: matThick, color: LAYER_COLORS.back.fill,      stroke: LAYER_COLORS.back.stroke }
    ];

    const totalThick = layers.reduce((sum, l) => sum + l.thick, 0);

    // Scale and sizing
    const scale = 5;
    const barH = Math.min(80, outH * 0.3);
    const totalWidth = totalThick * scale;
    const minCanvasW = 120;
    const canvasW = Math.max(minCanvasW, totalWidth + 30);
    const marginL = (canvasW - totalWidth) / 2;
    const marginTop = 10;
    const dimPad = 18;
    const margin = 10 + dimPad;
    const plateW = getDSPlateWidth(params);
    // ═══════════════════════════════════════════════════
    // SVG LAYOUT / GENERATION
    // ══════════════════════════════════════════════════
    const legendRows = Math.ceil(layers.length / 3);
    const legendRowH = 4.5;
    const legendTopPad = 6;
    const contentH = marginTop + barH + 8 + 4.5 + 2.5 + 4 + legendRows * legendRowH + legendTopPad + 6;
    const canvasH = Math.max(90, contentH);

    const svg = [svgHeader(canvasW, canvasH)];

    // Title
    svg.push('<text x="' + (canvasW / 2) + '" y="6" font-size="1.5mm" font-family="sans-serif" fill="#333" text-anchor="middle" font-weight="bold">' + t("svg.sandwichTitle") + '</text>');

    // Draw layer bars
    let x = marginL;
    const barTop = marginTop;
    for (const layer of layers) {
        const barW = Math.max(layer.thick * scale, 0.5);
        svg.push(svgRect(x, barTop, barW, barH, layer.color, layer.stroke, 0.15));

        if (barW > t(layer.nameKey).length * 0.65) {
            const textX = x + barW / 2;
            const textY = barTop + barH / 2;
            svg.push('<text x="' + textX + '" y="' + textY + '" font-size="0.8mm" font-family="sans-serif" fill="#444" text-anchor="middle" transform="rotate(-90,' + textX + ',' + textY + ')">' + t(layer.nameKey) + '</text>');
        }

        svg.push('<text x="' + (x + barW / 2) + '" y="' + (barTop + barH + 2.5) + '" font-size="0.9mm" font-family="sans-serif" fill="#0066cc" text-anchor="middle">' + layer.thick + '</text>');
        x += barW;
    }

    // FRONT / BACK labels
    svg.push('<text x="' + (marginL - 1.5) + '" y="' + (barTop + barH / 2) + '" font-size="0.7mm" font-family="sans-serif" fill="#bbb" text-anchor="middle" transform="rotate(-90,' + (marginL - 1.5) + ',' + (barTop + barH / 2) + ')">' + t("svg.front") + '</text>');
    svg.push('<text x="' + (x + 1.5) + '" y="' + (barTop + barH / 2) + '" font-size="0.7mm" font-family="sans-serif" fill="#bbb" text-anchor="middle" transform="rotate(90,' + (x + 1.5) + ',' + (barTop + barH / 2) + ')">' + t("svg.back") + '</text>');

    // Separator line
    const sepY = barTop + barH + 4.5;
    svg.push(svgLine(marginL, sepY, x, sepY, "#ddd", 0.06));

    // Total thickness
    const totalY = sepY + 2.5;
    svg.push('<text x="' + (canvasW / 2) + '" y="' + totalY + '" font-size="1mm" font-family="sans-serif" fill="#333" text-anchor="middle" font-weight="bold">' + t("svg.total") + ': ' + totalThick.toFixed(1) + ' mm</text>');

    // Legend: dynamic grid
    const legendStartY = totalY + 5;
    const legendColW = Math.max(24, canvasW / 3);
    const legendBoxW = 1.8;
    const legendBoxH = 1.8;
    const legendTextX = 2.8;
    for (let j = 0; j < layers.length; j++) {
        const row = Math.floor(j / 3);
        const col = j % 3;
        const lx = marginL + col * legendColW + 1;
        const ly = legendStartY + row * legendRowH;
        svg.push(svgRect(lx, ly, legendBoxW, legendBoxH, layers[j].color, layers[j].stroke, 0.1));
        svg.push('<text x="' + (lx + legendTextX) + '" y="' + (ly + 1.35) + '" font-size="0.8mm" font-family="sans-serif" fill="#666">' + t(layers[j].nameKey) + '</text>');
    }

    svg.push(svgFooter());
    return svg.join("");
}

// ══════════════════════════════════════════════════
// SVG LAYOUT / GENERATION
// ══════════════════════════════════════════════════

function generateSVG(params) {
    if (!params) return svgHeader(100, 100) + svgFooter();
    const outW = params.outW, outH = params.outH;
    const part = params.part;
    const dimPad = 18;
    const margin = 10 + dimPad;
    const parts = [];
    let canvasW, canvasH;

    if (part === "all") {
        const plateW = getDSPlateWidth(params);
        canvasW = outW * 4 + plateW + margin * 6;
        canvasH = outH + margin * 2 + 20;

        const y = margin + 5;
        const x1 = margin;
        const x2 = x1 + outW + margin;
        const x3 = x2 + outW + margin;
        const x4 = x3 + outW + margin;
        const x5 = x4 + outW + margin;

        parts.push(drawFrontFrame(params, x1, y));
        parts.push(drawUFrame(params, x2, y));
        parts.push(drawSpacer(params, x3, y));
        parts.push(drawBack(params, x4, y));
        parts.push(drawDarkslidePlate(params, x5, y));

    } else if (part === "sandwich") {
        return drawSandwichView(params);

    } else if (part === "front") {
        canvasW = outW + margin * 2;
        canvasH = outH + margin * 2 + 15;
        parts.push(drawFrontFrame(params, margin, margin + 5));

    } else if (part === "uframe") {
        canvasW = outW + margin * 2;
        canvasH = outH + margin * 2 + 15;
        parts.push(drawUFrame(params, margin, margin + 5));

    } else if (part === "spacer") {
        canvasW = outW + margin * 2;
        canvasH = outH + margin * 2 + 15;
        parts.push(drawSpacer(params, margin, margin + 5));

    } else if (part === "back") {
        canvasW = outW + margin * 2;
        canvasH = outH + margin * 2 + 15;
        parts.push(drawBack(params, margin, margin + 5));

    } else if (part === "darkslide") {
        const pw = getDSPlateWidth(params);
        canvasW = pw + margin * 2 + 20;
        canvasH = outH + margin * 2 + 10;
        parts.push(drawDarkslidePlate(params, margin, margin + 5));
    }

    return svgHeader(canvasW, canvasH) + parts.join("") + svgFooter();
}

// ── Save / restore parameters ──
function saveParams(params) {
    try {
        const data = JSON.stringify(params);
        SafeStore.setItem(STORAGE_KEY, data);
    } catch (e) {
        // ignore storage errors
    }
}

function restoreParams() {
    try {
        const raw = SafeStore.getItem(STORAGE_KEY);
        if (!raw) return null;
        return JSON.parse(raw);
    } catch (e) {
        return null;
    }
}

function applyRestoredParams(saved) {
    if (!saved) return;
    const map = {
        outW: "outW", outH: "outH", glassW: "glassW", glassH: "glassH",
        glassT: "glassT", glassSep: "glassSep", flangeW: "flangeW",
        flangeT: "flangeT", spacerMargin: "spacerMargin", dsSideRail: "dsSideRail",
        dsBottomRail: "dsBottomRail", dsT: "dsT", dsClearance: "dsClearance",
        pullW: "pullW", pullD: "pullD", kerf: "kerf", kerfMode: "kerfComp",
        material: "material", ltDepth: "ltDepth", ltWidth: "ltWidth",
        magD: "magD", magCount: "magCount", part: "partSelect"
    };
    for (const [paramKey, elemId] of Object.entries(map)) {
        const el = document.getElementById(elemId);
        const val = saved[paramKey];
        if (el && val !== undefined && val !== null && val !== "") {
            el.value = val;
        }
    }
}

// ── UI: Render preview ──
function updatePreview() {
    try {
        const params = readParams();
        validateParams(params);
        currentSVG = generateSVG(params);
        const container = document.getElementById("svgContainer");
        if (container) {
            container.innerHTML = "";
            const parser = new DOMParser();
            const doc = parser.parseFromString(currentSVG, "image/svg+xml");
            const svgNode = doc.documentElement;
            if (svgNode && svgNode.nodeName.toLowerCase() === "svg") {
                const serializer = new XMLSerializer();
                const svgMarkup = serializer.serializeToString(svgNode);
                container.insertAdjacentHTML("beforeend", svgMarkup);
                const svg = container.querySelector("svg.generated-svg, svg");
                if (svg) {
                    svg.setAttribute("width", "100%");
                    svg.removeAttribute("height");
                    svg.style.display = "block";
                    svg.style.maxWidth = "100%";
                    svg.style.width = "100%";
                    svg.style.height = "auto";
                    svg.style.margin = "0 auto";
                }
            } else {
                container.innerHTML = '<div class="error-message">Preview markup could not be rendered.</div>';
            }
            container.scrollTop = 0;
            container.scrollLeft = 0;
        }
        saveParams(params);
    } catch (e) {
        console.error("Preview error:", e);
        const container = document.getElementById("svgContainer");
        if (container) {
            container.innerHTML = '<div class="error-message">' + escapeHtml(e.message) + '</div>';
        }
    }
}

function escapeHtml(str) {
    const safe = (str === undefined || str === null) ? "" : String(str);
    return safe.replace(/&/g, "&amp;")
              .replace(/</g, "&lt;")
              .replace(/>/g, "&gt;");
}

// ── Debounced update ──
function debouncedUpdate() {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(updatePreview, 200);
}

// ── Event handlers ──
function initUI() {
    try {
        if (typeof applyTranslations === "function") {
            try { applyTranslations(); } catch (e) { console.error("Translation init failed:", e); }
        }

        try {
            const saved = restoreParams();
            if (saved) {
                applyRestoredParams(saved);
            }
        } catch (e) {
            console.error("Restore params failed:", e);
        }

        const langBtn = document.getElementById("btnLang");
        if (langBtn) {
            langBtn.addEventListener("click", function() {
                try { toggleLanguage(); } catch (e) { console.error("toggleLanguage failed:", e); }
            });
        }

        const cameraProfile = document.getElementById("cameraProfile");
        if (cameraProfile) {
            cameraProfile.addEventListener("change", function() {
                try {
                    applyProfile(this.value);
                    updatePreview();
                } catch (e) { console.error("Camera profile change failed:", e); }
            });
        }

        const inputs = document.querySelectorAll("#sidebar input, #sidebar select");
        if (inputs && inputs.forEach) {
            inputs.forEach(function(el) {
                try {
                    el.addEventListener("input", debouncedUpdate);
                    el.addEventListener("change", updatePreview);
                } catch (e) {
                    console.error("Input binding failed:", e);
                }
            });
        }

        const refreshBtn = document.getElementById("btnRefresh");
        if (refreshBtn) {
            refreshBtn.addEventListener("click", function() {
                try { updatePreview(); } catch (e) { console.error("Refresh failed:", e); }
            });
        }

        const exportSVGBtn = document.getElementById("btnExportSVG");
        if (exportSVGBtn) {
            exportSVGBtn.addEventListener("click", function() {
                try { exportSVG(currentSVG, "chassis.svg"); } catch (e) { console.error("Export SVG failed:", e); }
            });
        }

        const exportDXFBtn = document.getElementById("btnExportDXF");
        if (exportDXFBtn) {
            exportDXFBtn.addEventListener("click", function() {
                try {
                    const params = readParams();
                    const parts = buildDXFParts(params);
                    exportDXF(parts, "chassis.dxf");
                } catch (e) { console.error("Export DXF failed:", e); }
            });
        }

        const exportPDFBtn = document.getElementById("btnExportPDF");
        if (exportPDFBtn) {
            exportPDFBtn.addEventListener("click", function() {
                try { exportPDF(currentSVG, "chassis.pdf"); } catch (e) { console.error("Export PDF failed:", e); }
            });
        }

        const bomModal = document.getElementById("bomModal");
        const bomBtn = document.getElementById("btnBOM");
        const bomTable = document.getElementById("bomTable");
        const closeBOMBtn = document.getElementById("btnCloseBOM");
        if (bomBtn && bomModal && bomTable) {
            bomBtn.addEventListener("click", function() {
                try {
                    const params = readParams();
                    const bom = generateBOM(params);
                    bomTable.innerHTML = renderBOMTable(bom);
                    bomModal.classList.remove("hidden");
                } catch (e) { console.error("BOM failed:", e); }
            });
        }
        if (closeBOMBtn && bomModal) {
            closeBOMBtn.addEventListener("click", function() {
                try { bomModal.classList.add("hidden"); } catch (e) { console.error("Close BOM failed:", e); }
            });
        }
        if (bomModal) {
            bomModal.addEventListener("click", function(e) {
                try {
                    if (e.target === bomModal) {
                        bomModal.classList.add("hidden");
                    }
                } catch (e2) { console.error("BOM modal click failed:", e2); }
            });
            document.addEventListener("keydown", function(e) {
                try {
                    if (e.key === "Escape" && !bomModal.classList.contains("hidden")) {
                        bomModal.classList.add("hidden");
                    }
                } catch (e2) { console.error("BOM modal keydown failed:", e2); }
            });
        }

        try { updatePreview(); } catch (e) { console.error("Initial preview render failed:", e); }
    } catch (e) {
        console.error("UI init failed:", e);
        const container = document.getElementById("svgContainer");
        if (container) {
            container.innerHTML = '<div class="error-message">' + escapeHtml(e.message) + '</div>';
        }
    }
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initUI);
} else {
    initUI();
}
