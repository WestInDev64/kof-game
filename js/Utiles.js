
export function getRandomArbitrary(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

export function findAndRemove(array, el) {
    const index = array.indexOf(el)
    if (index !== -1) {
        array.splice(index, 1)
    }
    return array
}