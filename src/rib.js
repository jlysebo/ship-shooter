import { calculateAngle, normalizeAngle } from "./tools/angle.js";
import { Enemy } from "./enemy.js";

export class rib extends Enemy {
    constructor(x, y, angle, speed, width, height, hitPoints) {
        super(x, y, angle, speed, width, height, hitPoints);
    }
}