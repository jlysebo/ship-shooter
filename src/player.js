import { normalizeAngle } from "./tools/angle.js";
import { Bullet } from "./bullet.js";
import { Entity } from "./tools/entity.js";
import { Weapon } from "./weapon.js";

export class Player extends Entity {
    constructor(x, y, angle, speed, width, height, hitPoints, stats) {
        super(x, y, angle, speed, width, height, hitPoints);
        this.stats = stats;
        this.shotAngle = angle;
        this.lastDamage = new Date();
        this.weapon = new Weapon(300, 100, 200, stats);
    }


    /**
     * Rotates ship and cannon.
     * @param {*} angle Angle to rotate.
     */
    rotate(angle) {
        this.angle = normalizeAngle(this.angle + angle);
        this.shotAngle = normalizeAngle(this.shotAngle + angle);
    }

    /**
     * Rotates only the cannon.
     * @param {*} angle Angle to rotate.
     */
    rotateCannon(angle) {
        this.shotAngle = normalizeAngle(this.shotAngle + angle);
    }

    updateBullets() {
        this.weapon.updateBullets();
    }

    /**
     * Takes damage if vounerable.
     */
    takeDamage() {
        const tempDate = new Date();
        if (this.lastDamage < tempDate - 2000) {
            this.hitPoints -= 1;
            this.lastDamage = tempDate;
        }
    }

    /**
     * Updates player position
     * @param {*} keys a list of booleans of keys pressed
     */
    update(keys) {
        if (keys.d) {
            this.rotate(Math.PI / 36);
        }
        if (keys.a) {
            this.rotate(-Math.PI / 36);
        }
        if (keys.ArrowLeft) {
            this.rotateCannon(-Math.PI / 60);
        }
        if (keys.ArrowRight) {
            this.rotateCannon(Math.PI / 60);
        }
        if (keys.w) {
            const nextX = this.nextX();
            const nextY = this.nextY();
            if (this.validateX(nextX)) {
                this.moveX(nextX);
            }
            if (this.validateY(nextY)) {
                this.moveY(nextY);
            }
        }
        if (keys.Space) {
            this.weapon.fire(this.x, this.y, this.shotAngle);
        }
        this.weapon.update();
        super.update();
    }
}