import { Item } from "./item.js";

export class miniShield extends Item{
    constructor(x, y, range, time, hitPoints) {
        super(30000);
        this.x = x;
        this.y = y;
        this.range = range;
        this.time = time;
        this.hitPoints = hitPoints;
        this.width = 20;
        this.height = 20;
        this.active = true;
        this.aquiredTime = null;

    }

    aquire() {
        this.aquiredTime = new Date();
    }

}