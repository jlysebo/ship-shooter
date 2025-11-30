import { Settings } from "../settings.js";

export function randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

export function randomXY() {
    return [randomInteger(Settings.window.margin, Settings.window.width - Settings.window.margin),
            randomInteger(Settings.window.margin, Settings.window.height - Settings.window.margin)];
}