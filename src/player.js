import { Settings } from "./settings.js"
import { normalizeAngle } from "./tools/normalizeAngle.js";
import { getQuadrant } from "./tools/getQuadrant.js";
import { Bullet } from "./bullet.js";
import { Entity } from "./tools/entity.js";
import { gameStats } from "./gameStats.js";

export class Player extends Entity {
    constructor(x, y, angle, speed, width, height, hitPoints) {
        super(x, y, angle, speed, width, height, hitPoints);
        this.shotAngle = angle;
        this.bullets = [];
        this.lastBulletFired = new Date();
        this.lastDamage = new Date();
        this.stats = new gameStats();
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
        this.bullets.forEach(bullet => bullet.move());
        this.bullets = this.bullets.filter(bullet => bullet.alive);
    }

    bulletReady() {
        const tempDate = new Date();
        if (this.lastBulletFired.getTime() < tempDate.getTime() - 170) {
            return true;
        }
        else return false;
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
            this.rotateCannon(-Math.PI / 36);
        }
        if (keys.ArrowRight) {
            this.rotateCannon(Math.PI / 36);
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
        if (keys.Space && this.bulletReady()) {
            this.bullets.push(new Bullet(this.x, this.y, this.shotAngle, 10, 11, 11, 1));
            this.lastBulletFired = new Date();
            this.stats.registerShot();
        }
    }
}