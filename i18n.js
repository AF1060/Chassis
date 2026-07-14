// Internationalization module — EN / PT (European Portuguese)

// Safe storage wrapper: localStorage is unavailable on opaque origins
// (e.g. opened directly via file://) and in some privacy modes. Fall back
// to an in-memory object so the app never crashes on load.
const SafeStore = (function () {
    const mem = {};
    function available() {
        const k = "__chassis_test__";
        try {
            if (typeof window === "undefined" || !window.localStorage) return false;
            window.localStorage.setItem(k, "1");
            window.localStorage.removeItem(k);
            return true;
        } catch (e) {
            return false;
        }
    }
    const hasLS = available();
    return {
        getItem: function (k) { return hasLS ? window.localStorage.getItem(k) : (k in mem ? mem[k] : null); },
        setItem: function (k, v) { if (hasLS) window.localStorage.setItem(k, v); else mem[k] = String(v); }
    };
})();

let currentLang = SafeStore.getItem("chassis_lang") || "en";

const Translations = {
    en: {
        // Header
        "app.title": "Photographic Chassis CAD",
        "app.subtitle": "Parametric generator for laser-cut camera chassis — 4-layer sandwich",

        // Sections
        "section.cameraProfile": "Camera Profile",
        "section.outsideDimensions": "Outside Dimensions",
        "section.filmGate": "Film Gate / Glass",
        "section.flange": "Flange",
        "section.spacer": "Spacer (with magnets)",
        "section.darkslide": "Darkslide Channel (U-Frame)",
        "section.fingerPull": "Back Panel — Finger Pull",
        "section.material": "Material",
        "section.kerf": "Laser / Kerf",
        "section.lightTrap": "Light Trap",
        "section.magnets": "Magnets",
        "section.partToDraw": "Part to Draw",

        // Labels
        "label.profile": "Profile",
        "label.width": "Width (mm)",
        "label.height": "Height (mm)",
        "label.thickness": "Thickness (mm)",
        "label.glassSeparation": "Glass Separation (mm)",
        "label.flangeWidth": "Width (mm)",
        "label.flangeThickness": "Thickness (mm)",
        "label.spacerMargin": "Margin from outer edge (mm)",
        "label.sideRail": "Side Rail (mm)",
        "label.bottomRail": "Bottom Rail (mm)",
        "label.plateThickness": "Plate Thickness (mm)",
        "label.plateClearance": "Plate Clearance (mm)",
        "label.pullWidth": "Pull Width (mm)",
        "label.pullDepth": "Pull Depth (mm)",
        "label.sheetMaterial": "Sheet Material",
        "label.kerf": "Kerf (mm)",
        "label.kerfComp": "Kerf Compensation",
        "label.ltDepth": "Depth (mm)",
        "label.ltWidth": "Width (mm)",
        "label.magDiameter": "Diameter (mm)",
        "label.magCount": "Count",

        // Profile options
        "profile.custom": "Custom",
        "profile.180x240": "180\u00D7240 European",
        "profile.4x5": "4\u00D75 Large Format",
        "profile.5x7": "5\u00D77 Large Format",
        "profile.8x10": "8\u00D710 Large Format",

        // Material options
        "material.plywood1": "Birch Plywood 1mm",
        "material.plywood2": "Birch Plywood 2mm",
        "material.plywood3": "Birch Plywood 3mm",
        "material.pvc2": "PVC 2mm",
        "material.aluminium05": "Aluminium 0.5mm",
        "material.carbon1": "Carbon Fibre 1mm",

        // Kerf options
        "kerf.none": "None",
        "kerf.inside": "Inside cuts",
        "kerf.outside": "Outside cuts",
        "kerf.both": "Both",

        // Part options
        "part.all": "All 4 Layers + Plate",
        "part.sandwich": "Sandwich View (Cross-section)",
        "part.front": "Front Frame",
        "part.uframe": "Darkslide U-Frame",
        "part.spacer": "Spacer",
        "part.back": "Back Panel",
        "part.darkslide": "Darkslide Plate",

        // Buttons
        "btn.refresh": "Refresh Preview",
        "btn.exportSVG": "Export SVG",
        "btn.exportDXF": "Export DXF",
        "btn.exportPDF": "Export PDF",
        "btn.bom": "Bill of Materials",

        // BOM
        "bom.title": "Bill of Materials",
        "bom.part": "Part",
        "bom.qty": "Qty",
        "bom.w": "W (mm)",
        "bom.h": "H (mm)",
        "bom.material": "Material",
        "bom.note": "Note",
        "bom.close": "Close",
        "bom.sheetArea": "Sheet material area",

        // SVG labels
        "svg.frontFrame": "Front Frame",
        "svg.darkslideUFrame": "Darkslide U-Frame",
        "svg.spacer": "Spacer",
        "svg.backPanel": "Back Panel",
        "svg.darkslidePlate": "Darkslide Plate",
        "svg.flange": "flange",
        "svg.thick": "thick",
        "svg.margin": "margin",
        "svg.fingerPull": "finger pull",
        "svg.depth": "depth",
        "svg.lightTrap": "light trap",
        "svg.sandwichTitle": "Sandwich Cross-Section Profile",
        "svg.total": "Total",
        "svg.front": "FRONT",
        "svg.back": "BACK",

        // Language
        "lang.toggle": "PT",
        "lang.current": "EN",

        // Validation errors
        "error.outW": "Invalid outside width.",
        "error.outH": "Invalid outside height.",
        "error.glassW": "Invalid glass width.",
        "error.glassH": "Invalid glass height.",
        "error.glassT": "Invalid glass thickness.",
        "error.flangeW": "Invalid flange width.",
        "error.flangeT": "Invalid flange thickness.",
        "error.spacerMargin": "Invalid spacer margin.",
        "error.dsSideRail": "Invalid darkslide side rail.",
        "error.dsBottomRail": "Invalid darkslide bottom rail.",
        "error.dsT": "Invalid darkslide plate thickness.",
        "error.dsClearance": "Invalid darkslide clearance.",
        "error.pullW": "Invalid pull width.",
        "error.pullD": "Invalid pull depth.",
        "error.kerf": "Invalid kerf value.",
        "error.ltDepth": "Invalid light trap depth.",
        "error.ltWidth": "Invalid light trap width.",
        "error.magD": "Invalid magnet diameter.",
        "error.magCount": "Invalid magnet count.",
        "error.glassWvsOutW": "Glass width must be smaller than outside width.",
        "error.glassHvsOutH": "Glass height must be smaller than outside height.",
        "error.flangeFit": "Flange + glass width exceeds outside width.",
        "error.uframeFit": "Darkslide side rails exceed outside width.",
        "error.ubottomFit": "Darkslide bottom rail exceeds outside height."
    },

    pt: {
        // Header
        "app.title": "CAD de Chassis Fotogr\u00E1fico",
        "app.subtitle": "Gerador param\u00E9trico para chassis de c\u00E2mara — sandu\u00EDche de 4 camadas",

        // Sections
        "section.cameraProfile": "Perfil da C\u00E2mara",
        "section.outsideDimensions": "Dimens\u00F5es Exteriores",
        "section.filmGate": "Janela / Vidro",
        "section.flange": "Flange",
        "section.spacer": "Espa\u00E7ador (com \u00EDmanes)",
        "section.darkslide": "Canal Darkslide (Moldura U)",
        "section.fingerPull": "Painel Traseiro — Abertura",
        "section.material": "Material",
        "section.kerf": "Laser / Kerf",
        "section.lightTrap": "Armadilha de Luz",
        "section.magnets": "\u00CDmanes",
        "section.partToDraw": "Pe\u00E7a a Desenhar",

        // Labels
        "label.profile": "Perfil",
        "label.width": "Largura (mm)",
        "label.height": "Altura (mm)",
        "label.thickness": "Espessura (mm)",
        "label.glassSeparation": "Separa\u00E7\u00E3o do Vidro (mm)",
        "label.flangeWidth": "Largura (mm)",
        "label.flangeThickness": "Espessura (mm)",
        "label.spacerMargin": "Margem da borda exterior (mm)",
        "label.sideRail": "Trilho Lateral (mm)",
        "label.bottomRail": "Trilho Inferior (mm)",
        "label.plateThickness": "Espessura da Placa (mm)",
        "label.plateClearance": "Folga da Placa (mm)",
        "label.pullWidth": "Largura da Abertura (mm)",
        "label.pullDepth": "Profundidade da Abertura (mm)",
        "label.sheetMaterial": "Material da Chapa",
        "label.kerf": "Kerf (mm)",
        "label.kerfComp": "Compensa\u00E7\u00E3o Kerf",
        "label.ltDepth": "Profundidade (mm)",
        "label.ltWidth": "Largura (mm)",
        "label.magDiameter": "Di\u00E2metro (mm)",
        "label.magCount": "Quantidade",

        // Profile options
        "profile.custom": "Personalizado",
        "profile.180x240": "180\u00D7240 Europeu",
        "profile.4x5": "4\u00D75 Grande Formato",
        "profile.5x7": "5\u00D77 Grande Formato",
        "profile.8x10": "8\u00D710 Grande Formato",

        // Material options
        "material.plywood1": "Contraplacado B\u00E9tula 1mm",
        "material.plywood2": "Contraplacado B\u00E9tula 2mm",
        "material.plywood3": "Contraplacado B\u00E9tula 3mm",
        "material.pvc2": "PVC 2mm",
        "material.aluminium05": "Alum\u00EDnio 0.5mm",
        "material.carbon1": "Fibra de Carbono 1mm",

        // Kerf options
        "kerf.none": "Nenhuma",
        "kerf.inside": "Cortes interiores",
        "kerf.outside": "Cortes exteriores",
        "kerf.both": "Ambos",

        // Part options
        "part.all": "4 Camadas + Placa",
        "part.sandwich": "Vista Sandu\u00EDche (Corte transversal)",
        "part.front": "Moldura Frontal",
        "part.uframe": "Moldura U Darkslide",
        "part.spacer": "Espa\u00E7ador",
        "part.back": "Painel Traseiro",
        "part.darkslide": "Placa Darkslide",

        // Buttons
        "btn.refresh": "Atualizar Pr\u00E9-visualiza\u00E7\u00E3o",
        "btn.exportSVG": "Exportar SVG",
        "btn.exportDXF": "Exportar DXF",
        "btn.exportPDF": "Exportar PDF",
        "btn.bom": "Lista de Materiais",

        // BOM
        "bom.title": "Lista de Materiais",
        "bom.part": "Pe\u00E7a",
        "bom.qty": "Qtd",
        "bom.w": "L (mm)",
        "bom.h": "A (mm)",
        "bom.material": "Material",
        "bom.note": "Nota",
        "bom.close": "Fechar",
        "bom.sheetArea": "\u00C1rea do material da chapa",

        // SVG labels
        "svg.frontFrame": "Moldura Frontal",
        "svg.darkslideUFrame": "Moldura U Darkslide",
        "svg.spacer": "Espa\u00E7ador",
        "svg.backPanel": "Painel Traseiro",
        "svg.darkslidePlate": "Placa Darkslide",
        "svg.flange": "flange",
        "svg.thick": "esp.",
        "svg.margin": "margem",
        "svg.fingerPull": "abertura",
        "svg.depth": "prof.",
        "svg.lightTrap": "armadilha de luz",
        "svg.sandwichTitle": "Perfil de Corte Transversal",
        "svg.total": "Total",
        "svg.front": "FRENTE",
        "svg.back": "TR\u00C1S",

        // Language
        "lang.toggle": "EN",
        "lang.current": "PT",

        // Validation errors
        "error.outW": "Largura exterior inválida.",
        "error.outH": "Altura exterior inválida.",
        "error.glassW": "Largura do vidro inválida.",
        "error.glassH": "Altura do vidro inválida.",
        "error.glassT": "Espessura do vidro inválida.",
        "error.flangeW": "Largura da flange inválida.",
        "error.flangeT": "Espessura da flange inválida.",
        "error.spacerMargin": "Margem do espaçador inválida.",
        "error.dsSideRail": "Trilho lateral inválido.",
        "error.dsBottomRail": "Trilho inferior inválido.",
        "error.dsT": "Espessura da placa inválida.",
        "error.dsClearance": "Folga da placa inválida.",
        "error.pullW": "Largura da abertura inválida.",
        "error.pullD": "Profundidade da abertura inválida.",
        "error.kerf": "Valor de kerf inválido.",
        "error.ltDepth": "Profundidade da armadilha de luz inválida.",
        "error.ltWidth": "Largura da armadilha de luz inválida.",
        "error.magD": "Diâmetro do íman inválido.",
        "error.magCount": "Quantidade de ímanes inválida.",
        "error.glassWvsOutW": "Largura do vidro deve ser menor que a largura exterior.",
        "error.glassHvsOutH": "Altura do vidro deve ser menor que a altura exterior.",
        "error.flangeFit": "Flange + vidro excede a largura exterior.",
        "error.uframeFit": "Trilhos laterais excedem a largura exterior.",
        "error.ubottomFit": "Trilho inferior excede a altura exterior."
    }
};

// Get translated string
function t(key) {
    const dict = Translations[currentLang] || Translations.en;
    return dict[key] || Translations.en[key] || key;
}

function applyTranslations() {
    const elements = document.querySelectorAll("[data-i18n]");
    elements.forEach(function(el) {
        const key = el.getAttribute("data-i18n");
        if (el.tagName === "OPTION" || el.tagName === "INPUT" || el.tagName === "BUTTON") {
            el.textContent = t(key);
        } else {
            el.textContent = t(key);
        }
    });

    const phElements = document.querySelectorAll("[data-i18n-placeholder]");
    phElements.forEach(function(el) {
        el.placeholder = t(el.getAttribute("data-i18n-placeholder"));
    });

    const langBtn = document.getElementById("btnLang");
    if (langBtn) {
        langBtn.textContent = t("lang.toggle");
        langBtn.title = currentLang === "en" ? "Mudar para Portugu\u00EAs" : "Switch to English";
    }
}

function toggleLanguage() {
    currentLang = (currentLang === "en") ? "pt" : "en";
    SafeStore.setItem("chassis_lang", currentLang);
    applyTranslations();
    if (typeof updatePreview === "function") {
        updatePreview();
    }
}
