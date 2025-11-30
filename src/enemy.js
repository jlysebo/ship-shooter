import { Entity } from "./tools/entity.js";
import { normalizeAngle } from "./tools/normalizeAngle.js";
import { distance } from "./tools/pythagoras.js";

export class Enemy extends Entity {
    constructor(x, y, angle, speed, width, height, hitPoints) {
        super(x, y, angle, speed, width, height, hitPoints);
    }

    adjustAngle(player) {
        let dX = player.x - this.x;
        let h = distance(this.x, this.y, player.x, player.y);
        let dY = player.y - this.y;
        let theta = Math.asin(Math.abs(dY / h));
        if (dX >= 0 && dY >= 0) this.angle = theta;
        else if (dX >= 0 && dY <= 0) this.angle = 2*Math.PI - theta;
        else if (dX <= 0 && dY >= 0) this.angle = Math.PI - theta;
        else if (dX <= 0 && dY <= 0) this.angle = Math.PI + theta;
    }

    update() {
        let x = this.nextX();
        let y = this.nextY();
        if (this.validateX(x)) this.moveX(x);
        if (this.validateY(y)) this.moveY(y);
    }
}