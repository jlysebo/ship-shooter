import { Airstrike } from "../airstrike.js";
import { ClusterMine } from "./clusterMine.js";
import { Settings } from "./settings.js";
import { distance } from "./tools/calculations.js";

export class helicopter extends Airstrike {
    constructor(x, y, angle, speed, hitPoints, game, dropDelay) {
        super(x, y, angle, speed, hitPoints, game, dropDelay);
        this.bombCount = 2;
    }

    update(player) {
        let tempDate = new Date();
        if (0 <= this.x && Settings.map.width >= this.x && 0 <= this.y && Settings.map.height >= this.y) {
            if (tempDate - this.lastStrike > this.dropDelay && distance(this.x, this.y, player.x, player.y) < 400 && this.bombCount > 0)  {
                this.game.mines.push(new ClusterMine(this.x, this.y, 0, 0, 25, 25, 1, 75, 3000, 6, Math.PI / 4, this.game));
                this.lastStrike = tempDate;
                this.bombCount -= 1;
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