// Bill of Materials generator — 4-layer sandwich

function generateBOM(params) {
    const outW = params.outW, outH = params.outH;
    const glassW = params.glassW, glassH = params.glassH, glassT = params.glassT;
    const dsT = params.dsT;
    const magCount = params.magCount, magD = params.magD;
    const material = params.material;
    const spThick = glassT + params.glassSep;
    const plateW = getDSPlateWidth(params);
    const plateH = getDSPlateHeight(params);

    const parts = [
        { name: t("svg.frontFrame"),       qty: 1, w: outW,  h: outH,  mat: material,    note: "Film gate cutout + flange recess" },
        { name: t("svg.darkslideUFrame"),  qty: 1, w: outW,  h: outH,  mat: material,    note: "Side rails " + params.dsSideRail + "mm + bottom rail " + params.dsBottomRail + "mm" },
        { name: t("svg.spacer"),            qty: 1, w: outW,  h: outH,  mat: material,    note: spThick + "mm " + t("svg.thick") + ", magnets + inner cutout" },
        { name: t("svg.backPanel"),         qty: 1, w: outW,  h: outH,  mat: material,    note: "Magnets + " + t("svg.fingerPull") },
        { name: t("svg.darkslidePlate"),    qty: 1, w: plateW.toFixed(1), h: plateH.toFixed(1), mat: "Aluminium", note: dsT + "mm " + t("svg.thick") },
        { name: "Glass",                    qty: 1, w: glassW, h: glassH, mat: "Glass",   note: glassT + "mm " + t("svg.thick") },
        { name: "\u00D8" + magD + "mm",     qty: magCount, w: magD, h: magD, mat: "Neodymium", note: "Round" },
    ];

    let totalArea = 0;
    parts.forEach(function(p) {
        if (p.mat === material) {
            let area = p.qty * p.w * p.h;
            if (p.name === t("svg.frontFrame") || p.name === t("svg.spacer") || p.name === t("svg.backPanel")) {
                const support = 1;
                const cutW = Math.max(0, glassW - 2 * support);
                const cutH = Math.max(0, glassH - 2 * support);
                area -= cutW * cutH;
            }
            if (area > 0) totalArea += area;
        }
    });

    return { parts: parts, totalArea: Math.max(0, Math.round(totalArea)), material: material, thickness: getMaterialThickness(material) };
}

function renderBOMTable(bom) {
    let html = '<table>' +
        '<tr><th>' + t("bom.part") + '</th><th>' + t("bom.qty") + '</th><th>' + t("bom.w") + '</th><th>' + t("bom.h") + '</th><th>' + t("bom.material") + '</th><th>' + t("bom.note") + '</th></tr>';
    for (let i = 0; i < bom.parts.length; i++) {
        const p = bom.parts[i];
        html += '<tr>' +
            '<td>' + p.name + '</td><td>' + p.qty + '</td>' +
            '<td>' + p.w + '</td><td>' + p.h + '</td>' +
            '<td>' + p.mat + '</td><td>' + p.note + '</td>' +
        '</tr>';
    }
    html += '</table>';
    html += '<p style="margin-top:10px;color:#aaa;">' +
        t("bom.sheetArea") + ': ' + bom.totalArea + ' mm\u00B2 (' + bom.material + ', ' + bom.thickness + 'mm)' +
    '</p>';
    return html;
}
