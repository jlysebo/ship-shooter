import { Enemy } from "./enemy.js";
import { Mine } from "./mine.js";
import { normalizeAngle } from "./tools/angle.js";
import { randomInteger } from "./tools/random.js";

export class Submarine extends Enemy {
    constructor(x, y, angle, speed, width, height, hitPoints, reloadTime, direction) {
        super(x, y, angle, speed, width, height, hitPoints);
        this.reloadTime = reloadTime;
        this.direction = direction;
        this.lastMineDrop = new Date();
        this.mines = [];
        this.alive = true;
        this.underwater = true;
        this.surfacetime = 2000;
    }

    update(player) {
        if (this.alive) {
            const tempDate = new Date();
            if (this.lastMineDrop < tempDate - this.reloadTime) {
                this.mines.push(new Mine(this.x, this.y, 0, 0, 25, 25, 1, randomInteger(40, 60), randomInteger(30000, 45000)));
                this.lastMineDrop = tempDate;
            }
            if (tempDate < this.lastMineDrop + this.surfacetime / 2 || this.lastMineDrop > tempDate - this.surfacetime / 2) {
                this.underwater = false;
            }
            else {
                this.underwater = true;
            }
            if (this.hitPoints <= 0) {
                this.alive = false;
            }
            this.adjustAngle(player);
            if (this.direction == 1) {
                this.angle = normalizeAngle(this.angle + Math.PI/6);
            }
            else if (this.direction == 0) {
                this.angle = normalizeAngle(this.angle - Math.PI/6);
            }
            let x = this.nextX();
            let y = this.nextY();
            if (this.validateX(x)) this.moveX(x);
            if (this.validateY(y)) this.moveY(y);
            this.lastUpdate = tempDate;
        }
    }
}