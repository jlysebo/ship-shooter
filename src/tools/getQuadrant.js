/**
 * Function to translate radians to quadrant 1-4. qadrant 4 i from 0 to pi/2
 * @param {*} angle Angle in radians
 * @returns Number 1-4 indicating the quadrant
 */
export function getQuadrant(angle) {
    if (angle < Math.PI / 2) {
        return 4
    }
    else if (angle < Math.PI) {
        return 3
    }
    else if (angle < 3 * Math.PI / 2) {
        return 2
    }
    else return 1
}