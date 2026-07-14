// Darkslide drawing module
// The darkslide plate slides into the U-frame channel from the top

function drawDarkslidePlate(params, ox, oy) {
    const pw = getDSPlateWidth(params);
    const ph = getDSPlateHeight(params);
    const dsT = params.dsT;
    const kerf = params.kerf, kerfMode = params.kerfMode;
    const c = LAYER_COLORS.darkslide;
    const svg = [];

    const r = kerfRect(ox, oy, pw, ph, kerf,
                      (kerfMode === "outside" || kerfMode === "both") ? "outside" : "none");
    svg.push(svgLabel(r.x, r.y - 6, t("svg.darkslidePlate")));

    // The plate
    svg.push(svgRect(r.x, r.y, r.w, r.h, c.fill, c.stroke, 0.2));

    // Handle tab at top center
    const tabW = Math.min(20, pw * 0.3);
    const tabH = 8;
    svg.push(svgRect(r.x + pw / 2 - tabW / 2, r.y - tabH, tabW, tabH, c.fill, c.stroke, 0.2));

    // Dimensions
    svg.push(svgDimH(ox, ox + pw, oy + ph, pw.toFixed(1) + " mm", "below"));
    svg.push(svgDimV(ox + pw, oy, oy + ph, ph.toFixed(1) + " mm", "right"));
    svg.push(svgDimLeader(ox + pw / 2, oy + ph / 2, ox + pw / 2 + 10, oy + ph / 2 - 8, dsT + "mm " + t("svg.thick")));

    return svg.join("");
}
