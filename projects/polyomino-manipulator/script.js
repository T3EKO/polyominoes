import Vec2 from "/modules/vec2.mjs";
import { Matrix2x2 } from "/modules/matrices.mjs";
import * as ArrayFunctions from "/modules/array_functions.mjs";
import Polyomino from "/modules/polyominoes/core.mjs";
import PolyominoGenerator from "../../modules/polyominoes/generator.mjs";
import PolyominoRenderer from "../../modules/polyominoes/renderer.mjs";

const colors = [
    "#f00",
    "#f10",
    "#f20",
    "#f30",
    "#f40",
    "#f50",
    "#f60",
    "#f70",
    "#f80",
    "#f90",
    "#fa0",
    "#fb0",
    "#fc0",
    "#fd0",
    "#fe0",
    "#ff0",
    "#ef0",
    "#df0",
    "#cf0",
    "#bf0",
    "#af0",
    "#9f0",
    "#8f0",
    "#7f0",
    "#6f0",
    "#5f0",
    "#4f0",
    "#3f0",
    "#2f0",
    "#1f0",
    "#0f0",
    "#0f1",
    "#0f2",
    "#0f3",
    "#0f4",
    "#0f5",
    "#0f6",
    "#0f7",
    "#0f8",
    "#0f9",
    "#0fa",
    "#0fb",
    "#0fc",
    "#0fd",
    "#0fe",
    "#0ff",
    "#0ef",
    "#0df",
    "#0cf",
    "#0bf",
    "#0af",
    "#09f",
    "#08f",
    "#07f",
    "#06f",
    "#05f",
    "#04f",
    "#03f",
    "#02f",
    "#01f",
    "#00f",
    "#10f",
    "#20f",
    "#30f",
    "#40f",
    "#50f",
    "#60f",
    "#70f",
    "#80f",
    "#90f",
    "#a0f",
    "#b0f",
    "#c0f",
    "#d0f",
    "#e0f",
    "#f0f",
    "#f0e",
    "#f0d",
    "#f0c",
    "#f0b",
    "#f0a",
    "#f09",
    "#f08",
    "#f07",
    "#f06",
    "#f05",
    "#f04",
    "#f03",
    "#f02",
    "#f01"
];

const nullColors = [
    // "#8f7f7f",
    // "#8f877f",
    // "#8f8f7f",
    // "#878f7f",
    // "#7f8f7f",
    // "#7f8f87",
    // "#7f8f8f",
    // "#7f878f",
    // "#7f7f8f",
    // "#877f8f",
    // "#8f7f8f",
    // "#8f7f87"

    "#ff7f7f",
    "#ffbf7f",
    "#ffff7f",
    "#bfff7f",
    "#7fff7f",
    "#7fffbf",
    "#7fffff",
    "#7fbfff",
    "#7f7fff",
    "#bf7fff",
    "#ff7fff",
    "#ff7fbf"
];

const I4COLOR = "#00ffff";
const L4COLOR = "#ff7f00";
const J4COLOR = "#0000ff";
const T4COLOR = "#7f00ff";
const O4COLOR = "#ffff00";
const Z4COLOR = "#ff0000";
const S4COLOR = "#00ff00";

const presetColors = {
    // ring heptominoes
    // 295406: "#ff007f",
    // 295403: "#7f00ff",
    // 295151: "#007fff",
    // 295343: "#00ff7f"
};

function getColor(polyID) {
    if(presetColors[polyID]) return presetColors[polyID];
    // return colors[polyID % BigInt(colors.length)];
    return nullColors[polyID % BigInt(nullColors.length)];
}

const predicate = Polyomino.matchesFixed;

const ominoes = new Array();
// PolyominoGenerator.generateAllUniqueGrids(1).forEach(poly => ominoes.push(poly));
// PolyominoGenerator.generateAllUniqueGrids(2).forEach(poly => ominoes.push(poly));
// PolyominoGenerator.generateAllUniqueGrids(3).forEach(poly => ominoes.push(poly));
// PolyominoGenerator.generateAllUniqueGrids(4).forEach(poly => ominoes.push(poly));
// PolyominoGenerator.generateAllUniqueLeaves(1, predicate).forEach(poly => ominoes.push(poly));
// PolyominoGenerator.generateAllUniqueLeaves(2, predicate).forEach(poly => ominoes.push(poly));
// PolyominoGenerator.generateAllUniqueLeaves(3, predicate).forEach(poly => ominoes.push(poly));
// PolyominoGenerator.generateAllUniqueLeaves(4, predicate).forEach(poly => ominoes.push(poly));
// PolyominoGenerator.generateAllUniqueLeaves(5, predicate).forEach(poly => ominoes.push(poly));
// PolyominoGenerator.generateAllUniqueLeaves(6, predicate).forEach(poly => ominoes.push(poly));
// PolyominoGenerator.generateAllUniqueLeaves(7, predicate).forEach(poly => ominoes.push(poly));
PolyominoGenerator.generateAllLeaves(5).forEach(poly => ominoes.push(poly));

const ominoIndices = ominoes.map(generateUniqueIndex);

function generateUniqueIndex(poly) {
    let n = (poly.getAllCells().length > 1 ? BigInt(new Array(poly.getAllCells().length - 1).fill(2).reduce((a, b) => a * b)) : 1n) * (poly.size.x > 1 ? BigInt(new Array(poly.size.x - 1).fill(3).reduce((a, b) => a * b)) : 1n);
    for(let iy = 0;iy < poly.size.y;iy++) {
        for(let ix = 0;ix < poly.size.x;ix++) {
            n *= 2n;
            if(poly.containsCell(new Vec2(ix, iy))) n++;
        }
    }
    return n;
}

function addOminoCard(omino, n) {
    const idx = generateUniqueIndex(omino);
    const canv = PolyominoRenderer.renderPolyomino(omino, 2, getColor(idx));
    const ctx = canv.getContext("2d");
    ctx.fillStyle = "#000";
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 5;
    ctx.textBaseline = "top";
    ctx.font = "15px sans-serif";

    let text = "#" + n.toString() + ": " + idx.toString(10).toUpperCase();
    let occuranceCount = ArrayFunctions.numberOfOccurances(ominoIndices, idx, (a, b) => a == b);
    if(occuranceCount > 1) {
        text += ` - ${occuranceCount}`;
        ctx.font = "30px sans-serif";
        ctx.fillStyle = "#f00";
    }

    ctx.strokeText(text, 3, 3);
    ctx.fillText(text, 3, 3);
    document.body.appendChild(canv);
}

// ominoes.forEach(addOminoCard);

function generateOminoInfo(omino, n) {
    const duplicateIdxs = ArrayFunctions.findDuplicateIdxs(ominoes, omino, Polyomino.matchesFixed, n);

    const duplicateData = duplicateIdxs.map(
        idx => `\t- \`${idx}\``
    );

    return [
        `# \`#${n}\` - \`${omino.size.x}x${omino.size.y}\` ${omino.getName()}`,
        `\`${generateUniqueIndex(omino)}\` | \`0b${generateUniqueIndex(omino).toString(2)}\` | \`0x${generateUniqueIndex(omino).toString(16)}\``,
        `\n\`\`\`\n${omino.getShapeString()}\n\`\`\``,
        `\nother instances: ${duplicateIdxs.length}\n${duplicateData.join("\n\n")}`,
        `--------`
    ].join("\n");
}

let allOminoInfo = "";
ominoes.forEach(
    (omino, n) => {
        allOminoInfo += generateOminoInfo(omino, n);
        allOminoInfo += "\n\n";
    }
);

console.log(allOminoInfo);

window.generateUniqueIndex = generateUniqueIndex;