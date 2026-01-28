import { Enemy } from "./src/enemy.js";
import { Mine } from "./src/mine.js";
import { Settings } from "./src/settings.js";

export class Airstrike extends Enemy {
    constructor(x, y, angle, speed, hitPoints, game, dropDelay) {
        super(x, y, angle, speed);
        this.hitPoints = hitPoints;
        this.game = game;
        this.dropDelay = dropDelay;
        this.lastStrike = new Date();
        this.stage = 0;

    }

    adjustAngle(entity) {
        return
    }

    update(player) {
        let tempDate = new Date();
        if (this.stage == 0) {
            if (tempDate - this.lastStrike > 300) {
                this.stage = 1;
            }
        }
        if (this.stage == 1) {
            if (0 <= this.x && Settings.map.width >= this.x && 0 <= this.y && Settings.map.height >= this.y) {
                if (tempDate - this.lastStrike > this.dropDelay) {
                    this.game.mines.push(new Mine(this.x, this.y, 0, 0, 25, 25, 1, 75, 100));
                    this.lastStrike = tempDate;
                }
                this.moveX(this.nextX());
                this.moveY(this.nextY());
                this.lastUpdate = new Date();
            }
            else {
                this.hitPoints = 0;
            }
        }
    }
}
