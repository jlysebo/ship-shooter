import { normalizeAngle } from "./tools/angle.js";
import { Entity } from "./tools/entity.js";
import { Weapon } from "./weapon.js";
import { Upgradable } from "./tools/upgradable.js";

export class Player extends Entity {
    constructor(x, y, angle, speed, width, height, hitPoints, stats) {
        super(x, y, angle, speed, width, height, hitPoints);
        this.speed = new Upgradable("Ship Speed", speed, 0.25, 10, 5, 4, stats);
        this.stats = stats;
        this.shotAngle = angle;
        this.lastDamage = new Date();
        this.weapon = new Weapon(700, 50, 1000, stats);
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
         * Calculates next X position.
         * @returns next X.
         */
    nextX() {
        let tempDate = new Date();
        if (this.lastUpdate == null) {
            return this.x;
        }
        else {
            let millis = tempDate - this.lastUpdate;
            return this.x + Math.cos(this.angle) * this.speed.value * (millis)/17;
        }
    }
    
    /**
     * Calculates next Y position.
     * @returns next Y.
    */
   nextY() {
        let tempDate = new Date();
        if (this.lastUpdate == null) {
            return this.y;
        }
        else {
            let millis = tempDate - this.lastUpdate;
            return this.y + Math.sin(this.angle) * this.speed.value * (millis)/17;
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