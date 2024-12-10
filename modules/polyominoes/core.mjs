import Vec2 from "/modules/vec2.mjs";
import { Matrix2x2 }  from "/modules/matrices.mjs";
import * as ArrayFunctions from "/modules/array_functions.mjs";

class Polyomino {
    #cells;
    #size;

    constructor(cells) {
        this.#cells = cleanupCellData(cells);
        this.resetSize();
    }
    
    // special constructors

    static fromGridInt(gridInt, width) {
        gridInt = BigInt(gridInt);
        let pos = new Vec2(0, 0);
        const cells = new Array();
        while(gridInt > 0n) {
            const cCell = gridInt & 1n;
            if(cCell == 1n) {
                cells.push(pos.clone());
            }
            gridInt >>= 1n;
            pos.x--;
            if(pos.x < 1 - width) {
                pos.y--;
                pos.x = 0;
            }
        }
        return new Polyomino(cells);
    }

    // property getter functions

    clone() {
        return new Polyomino(this.getAllCells());
    }

    getAllCells() {
        return this.#cells.map((cell) => cell.clone());
    }

    get size() {
        if(this.#size !== null) {
            return this.#size;
        }
        this.#size = Vec2.maxBounds(...this.#cells).add(new Vec2(1, 1));
        return this.#size;
    }

    resetSize() {
        this.#size = null;
        return this;
    }

    getName() {
        const prefixes = ["mon", "d", "tri", "tetr", "pent", "hex", "hept", "oct", "non", "dec", "undec", "duodec"];
        if(this.#cells.length - 1 >= prefixes.length || this.#cells.length - 1 < 0) return `${this.#cells.length}-omino`;
        return `${prefixes[this.#cells.length - 1]}omino`;
    }

    getShapeString() {
        let shapeStr = "";
        for(let iy = 0;iy < this.size.y;iy++) {
            for(let ix = 0;ix < this.size.x;ix++) {
                shapeStr += this.containsCell(new Vec2(ix, iy)) ? "█" : " ";
            }
            if(iy < this.size.y - 1) shapeStr += "\n";
        }
        return shapeStr;
    }

    // checks

    containsCell(pos) {
        return ArrayFunctions.arrayContains(this.#cells, pos, Vec2.matches);
    }

    sameSize(poly) {
        return this.#cells.length == poly.#cells.length;
    }

    matchesFixed(poly) {
        if(!this.sameSize(poly)) return false;
        for(let i = 0;i < this.#cells.length;i++) {
            if(!poly.containsCell(this.#cells[i])) return false;
        }
        return true;
    }

    matchesOneSided(poly) {
        if(!this.sameSize(poly)) return false;
        for(let i = 0;i < 4;i++) {
            if(this.rotatedBy(i).matchesFixed(poly)) return true;
        }
        return false;
    }

    matchesFree(poly) {
        if(!this.sameSize(poly)) return false;
        if(this.matchesOneSided(poly)) return true;
        if(this.flippedOver('x').matchesOneSided(poly)) return true;
        return false;
    }

    // mutating operators

    addCell(pos) {
        const newCells = this.getAllCells();
        newCells.push(pos);
        this.#cells = cleanupCellData(newCells);
        return this.resetSize();
    }

    removeCell(pos) {
        this.#cells = cleanupCellData(this.#cells.filter(cell => cell.notMatches(pos)));
        return this.resetSize();
    }

    transform(t_matr) {
        this.#cells = cleanupCellData(
            this.#cells.map(
                cell => t_matr.applyToVec2(cell)
            )
        );
        return this.resetSize();
    }

    rotate(quarterTurns) {
        const turnTable = [
            Matrix2x2.IDENTITY,
            Matrix2x2.ROTATE_90,
            Matrix2x2.ROTATE_180,
            Matrix2x2.ROTATE_270
        ];
        return this.transform(turnTable[quarterTurns - 4 * Math.floor(quarterTurns * 0.25)]);
    }

    flip(axis) {
        switch(axis) {
        case "x":
            return this.transform(Matrix2x2.REFLECT_X);
        case "y":
            return this.transform(Matrix2x2.REFLECT_Y);
        default:
            return this;
        }
    }

    // non-mutating operators

    withCell(pos) {
        return this.clone().addCell(pos);
    }

    withoutCell(pos) {
        return this.clone().removeCell(pos);
    }

    transformedBy(t_matr) {
        return this.clone().transform(t_matr);
    }

    rotatedBy(quarterTurns) {
        return this.clone().rotate(quarterTurns);
    }

    flippedOver(axis) {
        return this.clone().flip(axis);
    }

    // predicates

    static matchesFixed(a, b) {
        return a.matchesFixed(b);
    }

    static matchesOneSided(a, b) {
        return a.matchesOneSided(b);
    }

    static matchesFree(a, b) {
        return a.matchesFree(b);
    }
}

function cleanupCellData(cells) {
    return ArrayFunctions.filterUnique(Vec2.arraySub(cells, Vec2.minBounds(...cells)), Vec2.matches);
}

export { Polyomino as default, cleanupCellData };