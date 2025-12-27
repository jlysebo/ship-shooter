import { Entity } from "./tools/entity.js";

export class Mine extends Entity {
    constructor(x, y, angle, speed, width, height, hitPoints, detonateRadius, detonationTime) {
        super(x, y, angle, speed, width, height, hitPoints);
        this.detonateRadius = detonateRadius;
        this.detonationTime = detonationTime;
        this.creationTime = new Date();
        this.detonating = false;

    }

    detonate() {
        this.width = this.detonateRadius;
        this.height = this.detonateRadius;
        this.detonating = true;
        this.detonationTime = new Date();
    }

    update(tempDate) {
        if (this.detonating) {
            if (this.detonationTime < tempDate - 1000) {
                this.hitPoints = 0;
            }
        }
        else {
            if (this.detonationTime < tempDate - this.creationTime) {
                this.detonate();
            }
        }
    }
}