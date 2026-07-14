// SVG Export module

function exportSVG(svgContent, filename) {
    download(filename || "chassis.svg", svgContent);
}

function download(filename, text) {
    const a = document.createElement("a");
    a.href = "data:image/svg+xml;charset=utf8," + encodeURIComponent(text);
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}
