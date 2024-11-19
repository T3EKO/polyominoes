import * as ArrayFunctions from "./array_functions.mjs";

// polyomino class
// stores the cells in a polyomino
class Polyomino {
    #cells;
    #size;

    // constructs a polyomino from cell data
    // the cell data is normalized to remove translation
    constructor(cells) {
        this.#cells = Polyomino.cleanupCellData(cells);
        this.#size = null;
    }

    // returns the number of cells contained by this polyomino
    get cellCount() {
        return this.#cells.length;
    }

    // returns a certain cell contained by this polyomino
    getCell(idx) {
        return this.#cells[idx];
    }

    // returns a copy of the list of cells contained by this polyomino
    getAllCells() {
        return this.#cells.map((cell) => [cell[0], cell[1]]);
    }

    // returns the dimensions of this polyomino
    // calculates the value if it is not present, and caches the result
    // returns the cached result if it is present
    get size() {
        if(this.#size !== null) {
            return this.#size;
        }
        this.#size = [0, 0];
        for(let i = 0;i < this.#cells.length;i++) {
            if(this.#size[0] < this.#cells[i][0] + 1) this.#size[0] = this.#cells[i][0] + 1;
            if(this.#size[1] < this.#cells[i][1] + 1) this.#size[1] = this.#cells[i][1] + 1;
        }
        return this.#size;
    }

    // removes the internally cached size value
    // useful if the contents of this polyomino have been mutated
    resetSize() {
        this.#size = null;
    }

    // returns a copy of this polyomino
    clone() {
        return new Polyomino(this.getAllCells());
    }

    // mutates this polyomino into a flipped version along the given axis ('x' or 'y')
    flip(axis) {
        let mul = [1, 1];
        switch(axis) {
            case 'x':
                mul[1] = -1;
                break;
            case 'y':
                mul[0] = -1;
                break;
            case 'xy':
                mul = [-1, -1];
                break;
        }
        this.#cells = Polyomino.cleanupCellData(this.#cells.map((cell) => {
            return [cell[0] * mul[0], cell[1] * mul[1]];
        }));
        this.resetSize();
        return this;
    }

    // returns a flipped version of this polyomino without mutating this one
    flipped(axis) {
        return this.clone().flip(axis);
    }

    // mutates this polyomino into a clockwise-rotated version of this one
    rotate(quarterTurns) {
        quarterTurns = quarterTurns - 4 * Math.floor(quarterTurns * 0.25);
        switch(quarterTurns) {
            case 1:
                this.#cells = Polyomino.cleanupCellData(this.#cells.map((cell) => {
                    return [-cell[1], cell[0]];
                }));
                this.resetSize();
                return this;
            case 2:
                this.#cells = Polyomino.cleanupCellData(this.#cells.map((cell) => {
                    return [-cell[0], -cell[1]];
                }));
                this.resetSize();
                return this;
            case 3:
                this.#cells = Polyomino.cleanupCellData(this.#cells.map((cell) => {
                    return [cell[1], -cell[0]];
                }));
                this.resetSize();
                return this;
        }
        return this;
    }

    // returns a rotated version of this polyomino without mutating this one
    rotated(quarterTurns) {
        return this.clone().rotate(quarterTurns);
    }

    // tests if another polyomino is an exact match this one
    matchesFixed(polyomino) {
        if(this.#cells.length != polyomino.#cells.length) return false;
        return this.#cells.filter((cell) => {
            return ArrayFunctions.arrayContains(polyomino.#cells, cell, Polyomino.cellsMatch);
        }).length == this.#cells.length;
    }

    // tests if another polyomino can be rotated to exactly match this one
    matchesOneSided(polyomino) {
        if(this.#cells.length != polyomino.#cells.length) return false;
        if(this.matchesFixed(polyomino)) return true;
        for(let i = 0;i < 3;i++) {
            if(this.matchesFixed(polyomino.rotated(i + 1))) return true;
        }
        return false;
    }

    // tests if another polyomino can be rotated or flipped to exactly match this one
    matchesFree(polyomino) {
        if(this.#cells.length != polyomino.#cells.length) return false;
        if(this.matchesOneSided(polyomino)) return true;
        if(this.matchesOneSided(polyomino.flipped('x'))) return true;
        return false;
    }


    // makes sure that the cell data is within a specific range
    // this causes arangements of cells that are identical except for being translated from existing, since all arangements are put against the origin
    static cleanupCellData(cells) {
        let minX = cells[0][0];
        let minY = cells[0][1];
        for(let i = 1;i < cells.length;i++) {
            if(cells[i][0] < minX) minX = cells[i][0];
            if(cells[i][1] < minY) minY = cells[i][1];
        }
        return cells.map((cell) => {
            return [cell[0] - minX, cell[1] - minY];
        });
    }

    // turns a class that isn't nessicerily a Polyomino into a Polyomino
    // if it can't become a Polyomino, it becomes null
    static cast(polyominoConvertible) {
        if(polyominoConvertible instanceof Polyomino) return polyominoConvertible;
        if(polyominoConvertible instanceof PolyominoGenerator) return new Polyomino(polyominoConvertible.getAllCells());
        return null;
    }

    // tests if two cells in the form of arrays with the x coordinate at index 0 and the y coordinate at index 1 match
    static cellsMatch(a, b) {
        return a[0] == b[0] && a[1] == b[1];
    }
}

class PolyominoGenerator {
    #cells;
    #goalCellCount;

    constructor(goalCellCount, initCells) {
        this.#goalCellCount = goalCellCount;
        this.#cells = initCells != undefined ? Polyomino.cleanupCellData(initCells) : [[0, 0]];
    }

    // returns a copy of the list of cells in this generator
    getAllCells() {
        return this.#cells.map((cell) => [cell[0], cell[1]]);
    }

    // returns the set of all cells adjacent to the cells currently present in this generator
    getBorderCells() {
        const edges = new Array();
        const offsets = [[1, 0], [-1, 0], [0, 1], [0, -1]];
        this.#cells.forEach((cell) => {
            offsets.forEach((offset) => {
                const pos = [cell[0] + offset[0], cell[1] + offset[1]];
                if(ArrayFunctions.arrayContains(this.#cells, pos, Polyomino.cellsMatch)) return;
                edges.push(pos);
            });
        });
        return edges;
    }

    // returns every descendant of this generator
    // a descendant of this generator is the same generator but with one additional cell added
    // all possible descendants can be found by looping over all cells adjacent to the cells currently present in the generator
    getDescendants() {
        return this.getBorderCells().map((cell) => {
            const cCells = this.getAllCells();
            cCells.push(cell);
            return new PolyominoGenerator(this.#goalCellCount, cCells);
        });
    }

    // returns all descendants of this generator, but removes duplicates
    getDistinctFixedDescendants() {
        return ArrayFunctions.filterUnique(this.getDescendants(), (a, b) => Polyomino.cast(a).matchesFixed(Polyomino.cast(b)));
    }

    // recursively generates the distinct fixed descendants of the current generator until it reaches a complete polyomino
    recursivelyGetDistinctFixedDescendantsUntilComplete() {
        if(this.#goalCellCount <= this.#cells.length) {
            return new Polyomino(this.#cells.slice(0, this.#goalCellCount));
        }

        const descendants = this.getDistinctFixedDescendants().map((descendant) => {
            return descendant.recursivelyGetDistinctFixedDescendantsUntilComplete();
        }).flat(this.#goalCellCount - this.#cells.length + 1);
        return ArrayFunctions.filterUnique(descendants, (a, b) => Polyomino.cast(a).matchesFixed(Polyomino.cast(b)));
    }
}

// draws a polyomno onto an html canvas with given cell size, border size, fill color, and border color
function drawPolyomino(polyomino, cellSize, borderSize, fillColor, borderColor) {
    const canvas = document.createElement("canvas");
    canvas.width = cellSize * polyomino.size[0] + borderSize;
    canvas.height = cellSize * polyomino.size[1] + borderSize;
    const ctx = canvas.getContext("2d");
    ctx.lineWidth = borderSize || 0;
    ctx.fillStyle = fillColor || "#ff0000";
    ctx.strokeStyle = borderColor || "#000000";
    for(let i = 0;i < polyomino.cellCount;i++) {
        let cell = polyomino.getCell(i);
        ctx.fillRect(cell[0] * cellSize + borderSize * 0.5, cell[1] * cellSize + borderSize * 0.5, cellSize, cellSize);
        ctx.strokeRect(cell[0] * cellSize + borderSize * 0.5, cell[1] * cellSize + borderSize * 0.5, cellSize, cellSize);
    }
    return canvas;
}

// takes a canvas and writes some debug text onto it given a text size and a border size
// the text will always be white with a black outline
function writeDebugInfo(canvas, debugInfo, textSize, borderSize) {
    const ctx = canvas.getContext("2d");
    ctx.textBaseline = "top";
    ctx.strokeStyle = "#000000";
    ctx.fillStyle = "#ffffff";
    ctx.lineWidth = borderSize || 5;
    ctx.font = `${textSize}px sans-serif`;
    const debugLines = debugInfo.split("\n");
    for(let i = 0;i < debugLines.length;i++) {
        ctx.strokeText(debugLines[i], borderSize, i * textSize + borderSize, canvas.width - borderSize * 2);
        ctx.fillText(debugLines[i], 0 + borderSize, i * textSize + borderSize, canvas.width - borderSize * 2);
    }
}

export { Polyomino, PolyominoGenerator, drawPolyomino, writeDebugInfo }