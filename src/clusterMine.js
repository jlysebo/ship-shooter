import { Missle } from "./missile.js";
import { Mine } from "./mine.js";

export class ClusterMine extends Mine {
    constructor(x, y, angle, speed, width, height, hitPoints, detonateRadius, detonationTime, missileCount, anglesPerSecond, game) {
        super(x, y, angle, speed, width, height, hitPoints, detonateRadius, detonationTime)
        this.missileCount = missileCount;
        this.anglesPerSecond = anglesPerSecond;
        this.game = game;
    }

    detonate(mineList) {
        for (let i = 0; i < this.missileCount; i++) {
            this.game.missiles.push(new Missle(this.x, this.y, i / this.missileCount * Math.PI * 2, 3, 8, 8, 1, Math.PI / 4));
        }
        this.hitPoints = 0;
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
