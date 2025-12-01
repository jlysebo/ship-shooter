import { Bullet } from "./bullet.js";
import { Enemy } from "./enemy.js";
import { distance } from "./tools/calculations.js";

export class Destroyer extends Enemy {
    constructor(x, y, angle, speed, width, height, hitPoints, range, reloadTime) {
        super(x, y, angle, speed, width, height, hitPoints);
        this.range = range;
        this.reloadTime = reloadTime;
        this.bullets = [];
        this.lastShotTime = new Date();
    }

    update(player) {
        let tempDate = new Date();
        if (distance(this.x, this.y, player.x, player.y) > this.range) {
            super.update(player);
            this.lastShotTime = tempDate;
        }
        else if (this.lastShotTime < tempDate - this.reloadTime) {
            this.adjustAngle(player);
            this.bullets.push(new Bullet(this.x, this.y, this.angle, 10, 11, 11, 1))
            this.lastShotTime = tempDate;
        }
        else {
            this.adjustAngle(player);
        }
        this.bullets.forEach(bullet => bullet.move());
        this.bullets = this.bullets.filter(bullet => bullet.alive);
    }
}