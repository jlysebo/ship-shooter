import { Settings } from "../settings.js";

/**
 * Random integer including min, excluding max.
 * @param {*} min 
 * @param {*} max 
 * @returns integer [min, max).
 */
export function randomInteger(min, max) {
    return Math.floor(randomDecimal(min, max));
}

/**
 * Returns float including min, excluding max.
 * @param {*} min 
 * @param {*} max 
 * @returns float [min, max).
 */
export function randomDecimal(min, max) {
    return Math.random() * (max - min) + min;
}

/**
 * Random set of coordinates inside of map boundaries.
 * @returns a list [x, y].
 */
export function randomXY() {
    return [randomInteger(Settings.window.margin, Settings.window.width - Settings.window.margin),
    randomInteger(Settings.window.margin, Settings.window.height - Settings.window.margin)];
}