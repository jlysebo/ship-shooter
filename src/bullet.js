import { Settings } from "./settings.js";
import { Entity } from "./tools/entity.js";

/**
 * Bullet class.
 */
export class Bullet extends Entity {
    constructor(x, y, angle, speed, width, height, hitPoints) {
        super(x, y, angle, speed, width, height, hitPoints);
        this.alive = true; 
    }

    /**
     * Moves the bullet according to the speed and updates alive status.
     * @returns true if bullet still active.
     */
    move() {
        
        this.moveX(this.nextX());
        this.moveY(this.nextY());
        super.update();
        if (this.x < Settings.map.width && this.x > 0 && this.y > 0 && this.y < Settings.map.height && this.hitPoints > 0) {
            return true;
        }
        else {
            //console.log("deleted bullet X: " + this.x + ", Y: " + this.y + ", rotation: " + this.angle)
            this.alive = false;
            return false;
        }

    }


}