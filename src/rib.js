import { Enemy } from "./enemy.js";

export class rib extends Enemy {
    constructor(x, y, angle, speed, width, height, hitPoints, angleOffset) {
        super(x, y, angle, speed, width, height, hitPoints, angleOffset);
    }
}