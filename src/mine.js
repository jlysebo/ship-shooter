import { Entity } from "./tools/entity.js";

export class Mine extends Entity {
    constructor(x, y, angle, speed, width, height, hitPoints, detonateRadius, detonationTime) {
        super(x, y, angle, speed, width, height, hitPoints);
        this.detonateRadius = detonateRadius;
        this.detonationTime = detonationTime;
        this.creationTime = new Date();
        this.detonationStage = 0;

    }

    detonate(mineList) {
        this.width = this.detonateRadius;
        this.height = this.detonateRadius;
        this.detonationStage = 2;
        this.detonationTime = new Date();
        mineList.forEach(mine => {
            if (this.contact(mine) && !(mine.detonationStage == 2)) {
                mine.detonate(mineList);
            }
        });
    }

    update(tempDate, mineList) {
        if (this.detonationStage >= 2) {
            this.detonationStage = 3;
            if (tempDate - this.detonationTime > 150) {
                this.hitPoints = 0;
            }
        }
        else if (this.detonationTime < tempDate - this.creationTime) {
                this.detonate(mineList);
            }
        else if (this.detonationTime - 2500 < tempDate - this.creationTime) {
            this.detonationStage = 1;
        }
    }
}