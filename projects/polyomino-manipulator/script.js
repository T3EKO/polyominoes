import * as Polyominoes from "/modules/polyominoes.mjs"

// lets not do a cookie clicker moment
// cookie clicker has a single object containing everything DIRECTLY
// no cool class hierarchies to better organize information and functions
// as a result, most function names are extremely verbose (except the notorious Game.earn())

// to avoid cookie clicker's terribly awful situation, we can employ the main principle of OOP, that being class hierarchies
// store the entire program state inside a single class (idk what to call it rn) and then have everything descend from that
// have a class for every sub-system, storing information about that system and various methods required for it
// this has the added benefit that all that is needed to start things going is to instantiate the class and run an init function


// const poly = new Polyominoes.Polyomino([[0, 0], [1, 0], [2, 0], [2, 1], [2, 2], [1, 2], [0, 1]]);
const poly = new Polyominoes.PolyominoGenerator(7).generateRandomCompleteDescendant();
window.poly = poly;

for(let i = 0;i < 4;i++) {
    const el = Polyominoes.drawPolyomino(poly.rotated(i), 64, 10, "#3f3f3f", "#00000000");
    const oriented = poly.rotated(i).oriented();
    const elO = Polyominoes.drawPolyomino(oriented, 64, 10, "#7f3f7f", "#00000000");
    document.body.appendChild(el);
    document.body.appendChild(elO);
}