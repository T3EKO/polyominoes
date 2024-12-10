import Vec2 from "/modules/vec2.mjs";
import Polyomino from "/modules/polyominoes/core.mjs";
import * as ArrayFunctions from "/modules/array_functions.mjs";

class PolyominoRenderer {


    static renderPolyomino(poly, cellSize, color) {
        const canv = document.createElement("canvas");
        canv.width = poly.size.x * cellSize;
        canv.height = poly.size.y * cellSize;
        const ctx = canv.getContext("2d");

        ctx.fillStyle = color;

        poly.getAllCells().forEach(
            cell => {
                ctx.fillRect(cell.x * cellSize, cell.y * cellSize, cellSize, cellSize);
            }
        );
        return canv;
    }

}

export { PolyominoRenderer as default };