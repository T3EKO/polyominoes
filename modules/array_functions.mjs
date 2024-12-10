function arrayContains(array, value, predicate) {
    for(let i = 0;i < array.length;i++) {
        if(predicate(array[i], value)) return true;
    }
    return false;
}

function numberOfOccurances(array, value, predicate) {
    let numOcc = 0;
    for(let i = 0;i < array.length;i++) {
        if(predicate(array[i], value)) numOcc++;
    }
    return numOcc;
}

function findDuplicateIdxs(array, value, predicate, vIdx) {
    let duplicateIdxs = new Array();
    for(let i = 0;i < array.length;i++) {
        if(i == vIdx) continue;
        if(predicate(array[i], value)) duplicateIdxs.push(i);
    }
    return duplicateIdxs;
}

function filterUnique(array, predicate) {
    const uniqueArray = new Array();
    for(let i = 0;i < array.length;i++) {
        if(arrayContains(uniqueArray, array[i], predicate)) continue;
        uniqueArray.push(array[i]);
    }
    return uniqueArray;
}

function getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function setIntersect(setA, setB, predicate) {
    return setA.filter((element) => arrayContains(setB, element, predicate));
}

function setSubtract(setA, setB, predicate) {
    return setA.filter((element) => !arrayContains(setB, element, predicate));
}

export { arrayContains, numberOfOccurances, findDuplicateIdxs, filterUnique, getRandomElement, setIntersect, setSubtract }