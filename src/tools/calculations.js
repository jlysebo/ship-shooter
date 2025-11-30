/**
 * Calculates the distance between two coordianates in the 2d plane.
 * @param {*} x1 
 * @param {*} y1 
 * @param {*} x2 
 * @param {*} y2 
 * @returns the distance.
 */
export function distance(x1, y1, x2, y2) {
    return Math.sqrt((x2-x1)**2+(y2-y1)**2);
}