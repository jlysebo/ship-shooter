import { Settings } from "../settings.js";
import { normalizeAngle, calculateAngle } from "./angle.js";

export class Entity {
    constructor(x, y, angle, speed, width, height, hitPoints) {
        this.x = x,
            this.y = y,
            this.angle = angle,
            this.speed = speed,
            this.width = width;
        this.height = height;
        this.hitPoints = hitPoints;
        this.lastUpdate = null;
    }

    alive() {
        if (this.hitPoints > 0) return true;
        else return false;
    }

    /**
     * Rotates the enitity.
     * @param {*} angle angle to rotate. 
     */
    rotate(angle) {
        this.angle = normalizeAngle(this.angle + angle);
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
            return this.x + Math.cos(this.angle) * this.speed * (millis) / 17;
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
            return this.y + Math.sin(this.angle) * this.speed * (millis) / 17;
        }
    }

    /**
     * Moves to given X.
     * @param {*} nextX new X. 
     */
    moveX(nextX) {
        this.x = nextX;
    }

    /**
     * Moves to given Y.
     * @param {*} nextY new Y.
     */
    moveY(nextY) {
        this.y = nextY;
    }

    /**
     * Validates if given X is a valid position.
     * @param {*} nextX next X.
     * @returns true or false.
     */
    validateX(nextX) {
        const { width, height, margin } = Settings.map;
        if (nextX < width - margin && nextX > margin) {
            return true;
        }
        else return false;
    }

    /**
     * Validates if given Y is a valid position.
     * @param {*} nextY next Y.
     * @returns true or false.
     */
    validateY(nextY) {
        const { width, height, margin } = Settings.map;
        if (nextY < height - margin && nextY > margin) {
            return true;
        }
        else return false;
    }

    /**
     * Checks if there is contact between two entities.
     * @param {*} entity to check contact with.
     * @returns true if overlap, false otherwise.
     */
    contact(entity) {
        // Uses pythagoras betwen the centre points of each entity.
        // Approximates a hitbox by making a circle with radius equal to the average between height and width.
        if (Math.sqrt((this.x - entity.x) ** 2 + (this.y - entity.y) ** 2) <= 0.80 * (this.width / 4 + this.height / 4 + entity.width / 4 + entity.height / 4)) return true;
        else return false;
    }

    adjustAngle(entity) {
        this.angle = calculateAngle(this.x, this.y, entity.x, entity.y);
    }

    update() {
        this.lastUpdate = new Date();
    }
}