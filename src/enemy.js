import { normalizeAngle } from "./tools/angle.js";
import { Entity } from "./tools/entity.js";

export class Enemy extends Entity {
    constructor(x, y, angle, speed, width, height, hitPoints, angleOffset) {
        super(x, y, angle, speed, width, height, hitPoints);
        this.angleOffset = angleOffset;
    }

    update(player) {
        this.adjustAngle(player);
        this.angle = normalizeAngle(this.angle + this.angleOffset);
        let x = this.nextX();
        let y = this.nextY();
        if (this.validateX(x)) this.moveX(x);
        if (this.validateY(y)) this.moveY(y);
        super.update();
    }
}