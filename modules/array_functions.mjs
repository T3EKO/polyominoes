function arrayContains(array, value, predicate) {
    return array.filter((v) => predicate(v, value)).length > 0;
}

function filterUnique(array, predicate) {
    const uniqueArray = new Array();
    for(let i = 0;i < array.length;i++) {
        if(arrayContains(uniqueArray, array[i], predicate)) continue;
        uniqueArray.push(array[i]);
    }
    return uniqueArray;
}

export { arrayContains, filterUnique }