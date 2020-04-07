export function arrayToDictionary(array) {
    let dict = {};
    array.forEach(item => dict[item] = true);
    return dict;
}
