

class Vec2 {

    x;
    y;

    constructor(x, y) {
        this.x = ensureNumber(x);
        this.y = ensureNumber(y);
    }

    static zero() {
        return new Vec2(0, 0);
    }

    // property getter functions / conversions

    clone() {
        return new Vec2(this.x, this.y);
    }

    toString() {
        return `(${this.x}, ${this.y})`;
    }

    mag2() {
        return this.dot(this);
    }

    mag() {
        return Math.sqrt(this.mag2());
    }

    // unary operators

    negateMut() {
        this.x = -this.x;
        this.y = -this.y;
        return this;
    }

    negate() {
        return this.clone().negateMut();
    }

    normalizeMut() {
        let invMag = 1 / this.mag();
        this.x = ensureNumber(this.x * invMag);
        this.y = ensureNumber(this.y * invMag);
        return this;
    }

    normalize() {
        return this.clone().normalizeMut();
    }

    floorMut() {
        this.x = Math.floor(this.x);
        this.y = Math.floor(this.y);
        return this;
    }

    floor() {
        return this.clone().floorMut();
    }

    // binary operators

    matches(vec2) {
        return this.x == vec2.x && this.y == vec2.y;
    }

    notMatches(vec2) {
        return !this.matches(vec2);
    }

    addMut(vec2) {
        this.x += vec2.x;
        this.y += vec2.y;
        return this;
    }

    add(vec2) {
        return this.clone().addMut(vec2);
    }

    subMut(vec2) {
        this.addMut(vec2.negate());
        return this;
    }

    sub(vec2) {
        return this.clone().subMut(vec2);
    }

    scaleMut(scalar) {
        this.x *= scalar;
        this.y *= scalar;
        return this;
    }

    scale(scalar) {
        return this.clone().scaleMut(scalar);
    }

    rotateMut(angle) {
        let newX = this.x * Math.cos(angle) - this.y * Math.sin(angle);
        this.y = this.x * Math.sin(angle) + this.y * Math.cos(angle);
        this.x = newX;
        return this;
    }

    rotate(angle) {
        return this.clone().rotateMut(angle);
    }

    dot(vec2) {
        return this.x * vec2.x + this.y * vec2.y;
    }

    orthogProjection(vec2) {
        return vec2.scale(ensureNumber(this.dot(vec2) / vec2.mag2()));
    }

    // static array unary operators

    static minBounds(...vecs) {
        return vecs.reduce(Vec2.min);
    }

    static maxBounds(...vecs) {
        return vecs.reduce(Vec2.max);
    }

    // static binary operators

    static matches(a, b) {
        return a.matches(b);
    }

    static notMatches(a, b) {
        return a.notMatches(b);
    }

    static min(a, b) {
        return new Vec2(Math.min(a.x, b.x), Math.min(a.y, b.y));
    }

    static max(a, b) {
        return new Vec2(Math.max(a.x, b.x), Math.max(a.y, b.y));
    }

    static add(a, b) {
        return a.add(b);
    }

    static sub(a, b) {
        return a.sub(b);
    }

    static scale(v2, s) {
        return v2.scale(s);
    }

    static rotate(v2, a) {
        return v2.rotate(a);
    }

    // static array-left-hand binary operators

    static addAll(...vecs) {
        return vecs.reduce(Vec2.add);
    }

    static arrayAdd(array, b) {
        return array.map(a => a.add(b));
    }

    static arraySub(array, b) {
        return array.map(a => a.sub(b));
    }

    static arrayScale(array, s) {
        return array.map(v2 => v2.scale(s));
    }

    static arrayRotate(array, a) {
        return array.map(v2 => v2.rotate(a));
    }

}

function ensureNumber(num) {
    if(typeof num != "number") return 0;
    return num || 0;
}

export { Vec2 as default, ensureNumber };