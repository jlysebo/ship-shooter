import { distance } from "./calculations.js";

/**
 * Keep angle between 0 and 2*pi.
 * @param {*} angle 
 * @returns angle between 0 and 2*pi.
 */
export function normalizeAngle(angle) {
    angle = angle % (2 * Math.PI);
    return angle < 0 ? angle + 2 * Math.PI : angle;
}

/**
 * Calculates the angle from (x1, y1) to (x2, y2).
 * @param {*} x1 x origin.
 * @param {*} y1 y origin.
 * @param {*} x2 x destination.
 * @param {*} y2 y destination.
 */
export function calculateAngle(x1, y1, x2, y2) {
    let dX = x2 - x1;
    let h = distance(x1, y1, x2, y2);
    let dY = y2 - y1;
    let theta = Math.asin(Math.abs(dY / h));
    if (dX >= 0 && dY >= 0) return theta;
    else if (dX >= 0 && dY <= 0) return 2 * Math.PI - theta;
    else if (dX <= 0 && dY >= 0) return Math.PI - theta;
    else if (dX <= 0 && dY <= 0) return Math.PI + theta;
}