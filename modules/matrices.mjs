import Vec2, { ensureNumber } from "/modules/vec2.mjs";

// class Matrix {
//     #rows;
//     #size;

//     get size() {
//         return this.#size;
//     }

//     constructor(size, fillWithValues) {
//         this.#size = size;
//         if(!fillWithValues) return;
//         this.#rows = new Array(this.#size.x).fill(0).map(
//             (_, i) => new Array(this.#size.y).fill(0).map(
//                 this.#size.x == this.#size.y ? ((_, j) => i == j ? 1 : 0) : () => 0
//             )
//         );
//     }

//     static createColumnVec2(x, y) {
//         return new Matrix(new Vec2(2, 1), false).populate([[x], [y]]);
//     }

//     static vec2ToColumn(vec2) {
//         return Matrix.createColumnVec2(vec2.x, vec2.y);
//     }

//     static create2x2(a1, a2, b1, b2) {
//         return new Matrix(new Vec2(2, 2), false).populate([[a1, a2], [b1, b2]]);
//     }

//     // property getter functions / conversions

//     clone() {
//         return new Matrix(this.#size, false).populate(this.#rows);
//     }

//     toString() {
//         let columnSpaceStrings = new Array(this.#size.y).fill(0).map(
//             (_, i) => new Array(this.#size.x).fill(0).map(
//                 (_, j) => this.#rows[j][i].toString().length
//             ).reduce(
//                 (a, b) => Math.max(a, b)
//             )
//         ).map(
//             a => new Array(a + 1).join(" ")
//         );

//         let str = "";
//         for(let i = 0;i < this.#size.x;i++) {
//             let rowStr = "[ ";
//             for(let j = 0;j < this.#size.y;j++) {
//                 let cellStr = this.#rows[i][j].toString();
//                 cellStr += columnSpaceStrings[j].slice(cellStr.length);
//                 rowStr += cellStr + " ";
//             }
//             rowStr += "]\n";
//             str += rowStr;
//         }
//         return str;
//     }

//     toVec2() {
//         if(this.#size.notMatches(new Vec2(2, 1))) return new Vec2(null, null);
//         return new Vec2(this.#rows[0][0], this.#rows[1][0]);
//     }

//     getRow(rowIdx) {
//         return this.#rows[rowIdx].map(
//             (e) => e
//         );
//     }

//     getColumn(columnIdx) {
//         return new Array(this.#size.x).fill(null).map(
//             (_, i) => this.#rows[i][columnIdx]
//         );
//     }

//     // binary operators

//     populate(data) {
//         this.#rows = new Array(this.#size.x).fill(0).map(
//             (a, i) => new Array(this.#size.y).fill(0).map(
//                 // I don't know what the commented code does
//                 // (b, j) => data instanceof Array ? i < data.length ? data[i] instanceof Array ? j < data[i].length ? data[i][j] : null : null : null : null
//                 (b, j) => {
//                     if(!(data instanceof Array)) return null;
//                     if(!(i < data.length)) return null;
//                     if(!(data[i] instanceof Array)) return null;
//                     if(!(j < data[i].length)) return null;

//                     return data[i][j];
//                 }
//             )
//         ).map(
//             (a, i) => a.map(
//                 // (b, j) => b === null ? this.#rows instanceof Array ? i < this.#rows.length ? this.#rows[i] instanceof Array ? j < this.#rows[i].length ? this.#rows[i][j] : 0 : 0 : 0 : 0 : b
//                 (b, j) => {
//                     if(b !== null) return b;

//                     if(!(this.#rows instanceof Array)) return 0;
//                     if(!(i < this.#rows.length)) return 0;
//                     if(!(this.#rows[i] instanceof Array)) return 0;
//                     if(!(j < this.#rows[i].length)) return 0;

//                     return this.#rows[i][j];
//                 }
//             )
//         );
//         return this;
//     }

//     isAddCompatible(matr_b) {
//         return this.#size.matches(matr_b.#size);
//     }

//     isMulCompatible(matr_b) {
//         return this.#size.y == matr_b.#size.x;
//     }

//     addMut(matr_b) {
//         if(!this.isAddCompatible(matr_b)) {
//             throw new TypeError(`Cannot add matrix of size ${matr_b.#size.toString()} to matrix of size ${this.#size.toString()}`);
//         }

//         for(let iy = 0;iy < this.#size.x;iy++) {
//             for(let ix = 0;ix < this.#size.y;ix++) {
//                 this.#rows[iy][ix] += matr_b.#rows[iy][ix];
//             }
//         }

//         return this;
//     }

//     add(matr_b) {
//         return this.clone().addMut(matr_b);
//     }

//     mulMut(matr_b) {
//         const mulResult = this.mul(matr_b);
//         this.#size = mulResult.#size;
//         this.#rows = mulResult.#rows;
//         return this;
//     }

//     mul(matr_b) {
//         if(!this.isMulCompatible(matr_b)) {
//             throw new TypeError(`Cannot multiply matrix with ${this.#size.y} columns by matrix with ${matr_b.#size.x} rows`);
//         }

//         return new Matrix(new Vec2(this.#size.x, matr_b.#size.y)).populate(new Array(this.#size.x).fill(0).map(
//             (_, iy) => new Array(matr_b.#size.y).fill(0).map(
//                 (_, ix) => mulAddArrays(this.getRow(iy), matr_b.getColumn(ix))
//             )
//         ));
//     }
// }

class Matrix2x2 {
    #rows;

    get size() {
        return new Vec2(2, 2);
    }

    constructor(a1, a2, b1, b2) {
        this.#rows = [[a1, a2], [b1, b2]];
    }

    // constants

    static IDENTITY = new Matrix2x2(1, 0, 0, 1);

    static ROTATE_90 = new Matrix2x2(0, -1, 1, 0);
    static ROTATE_180 = new Matrix2x2(-1, 0, 0, -1);
    static ROTATE_270 = new Matrix2x2(0, 1, -1, 0);

    static REFLECT_X = new Matrix2x2(1, 0, 0, -1);
    static REFLECT_Y = new Matrix2x2(-1, 0, 0, 1);
    static REFLECT_Y_EQUALS_X = new Matrix2x2(0, 1, 1, 0);
    static REFLECT_Y_EQUALS_NEGATIVE_X = new Matrix2x2(0, -1, -1, 0);

    // property getter functions / conversions

    clone() {
        return new Matrix2x2(this.#rows[0][0], this.#rows[0][1], this.#rows[1][0], this.#rows[1][1]);
    }

    toString() {
        return `[ ${this.#rows[0][0]} ${this.#rows[0][1]} ]\n[ ${this.#rows[1][0]} ${this.#rows[1][1]} ]`;
    }

    getRow(rowIdx) {
        return this.#rows[rowIdx].map(e => e);
    }

    getColumn(columnIdx) {
        return new Array(2).fill(null).map(
            (_, i) => this.#rows[i][columnIdx]
        );
    }

    // unary operators

    transposeMut() {
        const matr_1 = this.clone();
        for(let iy = 0;iy < 2;iy++) {
            for(let ix = 0;ix < 2;ix++) {
                this.#rows[iy][ix] = matr_1.#rows[ix][iy];
            }
        }
        return this;
    }

    transpose() {
        return this.clone().transposeMut();
    }

    // binary operators

    scaleMut(scalar) {
        for(let iy = 0;iy < 2;iy++) {
            for(let ix = 0;ix < 2;ix++) {
                this.#rows[iy][ix] *= scalar;
            }
        }
        return this;
    }

    scale(scalar) {
        return this.clone().scaleMut(scalar);
    }

    addMut(matr_2) {
        for(let iy = 0;iy < 2;iy++) {
            for(let ix = 0;ix < 2;ix++) {
                this.#rows[iy][ix] += matr_2.#rows[iy][ix];
            }
        }
        return this;
    }

    add(matr_2) {
        return this.clone().addMut(matr_2);
    }

    mulMut(matr_2) {
        const matr_1 = this.clone();
        for(let iy = 0;iy < 2;iy++) {
            for(let ix = 0;ix < 2;ix++) {
                this.#rows[iy][ix] = mulAddArrays(matr_1.getRow(iy), matr_2.getColumn(ix));
            }
        }
        return this;
    }

    mul(matr_2) {
        return this.clone().mulMut(matr_2);
    }

    applyToVec2(vec2) {
        return new Vec2(vec2.x * this.#rows[0][0] + vec2.y * this.#rows[0][1], vec2.x * this.#rows[1][0] + vec2.y * this.#rows[1][1]);
    }

    // transformation matrices

    static scaleMatrix(scalar) {
        return new Matrix2x2(scalar, 0, 0, scalar);
    }

    static rotationMatrix(theta) {
        return new Matrix2x2(Math.cos(theta), -Math.sin(theta), Math.sin(theta), Math.cos(theta));
    }

    static reflectionMatrix(theta) {
        return this.vectorReflectionMatrix(new Vec2(Math.cos(theta), Math.sin(theta)));
    }

    static vectorReflectionMatrix(vec2) {
        return new Matrix2x2(vec2.x * vec2.x - vec2.y * vec2.y, 2 * vec2.x * vec2.y, 2 * vec2.x * vec2.y, vec2.y * vec2.y - vec2.x * vec2.x);
    }
}

function mulAddArrays(a1, a2) {
    return new Array(Math.min(a1.length, a2.length)).fill(0).map(
        (_, i) => ensureNumber(a1[i]) * ensureNumber(a2[i])
    ).reduce(
        (a, b) => a + b
    );
}

export { Matrix2x2, mulAddArrays };