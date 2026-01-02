import { Upgradable } from "./tools/upgradable.js";

export class ShieldAbility {
    constructor(range, duration, cooldown, stats) {
        this.range = range;
        this.duration = duration;
        this.cooldown = cooldown;
        this.active = false;
        this.lastActivationTime = null;
        this.x, this.y = null;
        this.available = new Upgradable("Shield", 0, 1, 30, 0, 1, stats);
    }

    activate() {
        if (this.available.value) {
            if (!this.active) {
                const tempDate = new Date();
                if (this.lastActivationTime == null || (tempDate - this.lastActivationTime > this.cooldown)) {
                    this.lastActivationTime = tempDate;
                    this.active = true;
                }
            }
        }
    }

    contact(entity) {
        if (Math.sqrt((this.x - entity.x) ** 2 + (this.y - entity.y) ** 2) < this.range + entity.width / 2) {
            return true;
        }
        else return false;
    }

    update(player) {
        if (this.active) {
            const tempDate = new Date();
            this.x = player.x;
            this.y = player.y;
            if (tempDate - this.lastActivationTime > this.duration) {
                this.active = false;
            }
        }
    }
}