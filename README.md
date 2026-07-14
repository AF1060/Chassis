We will create a parametric CAD similar to software like FreeCAD, but specialized in photographic chassis.
The first version will be a web application (HTML + JavaScript + SVG).

A complete parametric CAD, with a graphical interface, geometric engine, SVG/DXF/PDF export, kerf compensation, material library, automatic pagination when necessary; bill of materials (BOM), and algorithms to automatically generate the different layers of the chassis.

Geometric engine: parametric generation of 2D parts from defined parameters.
Graphical interface: form for changing dimensions, materials, thicknesses, and tolerances, with real-time visualization.
Model library: profiles for different cameras and sheet metal formats, allowing the system to be reused in future projects.

Automatic generation of all parts (frames, spacers, dark slide guides, flange, cover, magnet housings).
Graphical interface to change dimensions, materials, and tolerances without editing the code.
Export to SVG, DXF, and PDF, bill of materials (BOM), profiles for different cameras.

Example for standard mesures for an European 180x240 mm chassis:

Layer 1 - Frontal frame: external dimensions 215x280 mm and cutted inner window with 178x236 mm)
Layer 2 - Dark slide: U shape frame (sides left/wright 16.1 mm, bottom 21.7 mm) that allows the one piece of chosen material (wood, aluminium, …) to slide in/out perfectly in the U shape frame;
Layer 3 - Spacer: with maximum measure for chassis but the window inside must bee 1 mm shorter than the negative used in order to support/hold the sensitized glass or aluminium plate. This layer could have the magnets if it is the only one before de back slide. If there is an optional spacer layer, the magnets position will be draw in the spacer before the dark slide.;
Layer 4 : Back slide, same dimensions like Layer 1, with magnets position aligned with the previous layer, with an area for finger pull, in order to allow ease frame separation.

The goal will be for the program to:
1) Automatically draw all parts;
2) Allow choosing the material and thickness;
3) Calculate laser compensation;
4) Draw, in an canvas, each piece, side by side, with optional visible measures;
5) Allow choosing to put all pieces together, like a sandwich, showing each layer with a different colour, like a 3D image or as a profile showing the total thickness of the final chassis;
6) Generate the bill of materials;
7) Export to SVG, DXF, and PDF;
8) Allow to export each individual piece or all pieces;
9) Be reusable for any chassis format.
