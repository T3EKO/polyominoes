import Vec2 from "/modules/vec2.mjs";
import Polyomino from "/modules/polyominoes/core.mjs";
import * as ArrayFunctions from "/modules/array_functions.mjs";

class PolyominoGenerator {


    static generateAllLeaves(n) {
        let ominoes = [new Polyomino([new Vec2(0, 0)])];
        for(let i = 0;i < n - 1;i++) {
            ominoes = ominoes.map(
                omino => getEdgeAdjacents(omino.getAllCells()).map(
                    edge => omino.withCell(edge)
                )
            ).flat();
        }
        return ominoes;
    }

    static generateAllLeavesAndWeed(n, predicate) {
        let ominoes = [new Polyomino([new Vec2(0, 0)])];
        for(let i = 0;i < n - 1;i++) {
            ominoes = ominoes.map(
                omino => getEdgeAdjacents(omino.getAllCells()).map(
                    edge => omino.withCell(edge)
                )
            ).flat();
            ominoes = ArrayFunctions.filterUnique(ominoes, predicate);
        }
        return ominoes;
    }

    static generateAllUniqueLeaves(n, predicate) {
        return ArrayFunctions.filterUnique(PolyominoGenerator.generateAllLeaves(n), predicate);

        // things to note:
        // - 1 of the fixed heptominoes is missing
        // - 14 of the fixed octominoes are missing
    }

    static generateAllGrids(n) {
        return genAllNConfigs(n, n * n - 1).map(
            config => new Polyomino(config.map(
                idx => new Vec2(idx % n, Math.floor(idx / n))
            ))
        );
    }

    static generateAllUniqueGrids(n) {
        return ArrayFunctions.filterUnique(PolyominoGenerator.generateAllGrids(n), Polyomino.matchesFixed);
    }

}

function genAllNConfigs(n, max) {
    let cConfig = new Array(n).fill(0).map((_, i) => i);
    const allConfigs = new Array();
    allConfigs.push(cConfig.map(e => e));
    while(cConfig[0] < max - n + 1) {
        let i = n - 1;
        cConfig[i]++;
        if(cConfig[i] > max) {
            i--;
            cConfig[i]++;
            while(i >= 0 && cConfig[i] > max - (n - 1 - i)) {
                i--;
                cConfig[i]++;
            }
            i++;
            while(i < n) {
                cConfig[i] = cConfig[i - 1] + 1;
                i++;
            }
        }
        allConfigs.push(cConfig.map(e => e));
    }
    return allConfigs;
}

function getEdgeAdjacents(cells) {
    const edgeAdjacents = new Array();
    const offsets = [new Vec2(0, -1), new Vec2(-1, 0), new Vec2(0, 1), new Vec2(1, 0)];
    const min = Vec2.minBounds(...cells);
    const max = Vec2.maxBounds(...cells);
    for(let ix = min.x - 1;ix < max.x + 2;ix++) {
        for(let iy = min.y - 1;iy < min.y + 2;iy++) {
            const cpos = new Vec2(ix, iy);
            if(ArrayFunctions.arrayContains(cells, cpos, Vec2.matches)) continue;

            let hasAdjacentCells = false;
            for(let io = 0;io < offsets.length;io++) {
                const offsetPos = cpos.add(offsets[io]);
                if(ArrayFunctions.arrayContains(cells, offsetPos, Vec2.matches)) hasAdjacentCells = true;
            }

            if(hasAdjacentCells) {
                edgeAdjacents.push(cpos);
            }
        }
    }
    return edgeAdjacents;
}

export { PolyominoGenerator as default, getEdgeAdjacents };