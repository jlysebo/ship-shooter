import { Entity } from "./tools/entity.js";

export class Enemy extends Entity {
    constructor(x, y, angle, speed, width, height, hitPoints) {
        super(x, y, angle, speed, width, height, hitPoints);
    }

    update(player) {
        this.adjustAngle(player);
        let x = this.nextX();
        let y = this.nextY();
        if (this.validateX(x)) this.moveX(x);
        if (this.validateY(y)) this.moveY(y);
    }
}