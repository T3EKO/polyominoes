import * as Polyominoes from "/modules/polyominoes.mjs"

// lets not do a cookie clicker moment
// cookie clicker has a single object containing everything DIRECTLY
// no cool class hierarchies to better organize information and functions
// as a result, most function names are extremely verbose (except the notorious Game.earn())

// to avoid cookie clicker's terribly awful situation, we can employ the main principle of OOP, that being class hierarchies
// store the entire program state inside a single class (idk what to call it rn) and then have everything descend from that
// have a class for every sub-system, storing information about that system and various methods required for it
// this has the added benefit that all that is needed to start things going is to instantiate the class and run an init function

const p = new Polyominoes.PolyominoGenerator(5).generateRandomCompleteDescendant();
const el = Polyominoes.drawPolyomino(p, 64, 3, "#00ff00");

document.body.appendChild(el);

const dataURL = el.toDataURL("image/png");

document.getElementById("dynamicFavicon").href = dataURL;