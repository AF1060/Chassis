// PDF Export module
// Uses a lightweight approach: opens SVG in new window for print-to-PDF

function exportPDF(svgContent, filename) {
    // Open print dialog with SVG content
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
        alert("Popup blocked. Please allow popups for PDF export.");
        return;
    }

    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Chassis Export</title>
            <style>
                body { margin: 0; padding: 10mm; }
                svg { max-width: 100%; height: auto; }
                @media print {
                    body { padding: 0; }
                    @page { size: auto; margin: 10mm; }
                }
            </style>
        </head>
        <body>
            ${svgContent}
            <script>
                window.addEventListener('load', function() {
                    setTimeout(function() {
                        window.print();
                        window.close();
                    }, 300);
                });
            <\/script>
        </body>
        </html>
    `);
    printWindow.document.close();
}
