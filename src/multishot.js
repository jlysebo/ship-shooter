import { Item } from "./item.js";

export class Multishot extends Item {
    constructor(x, y, value) {
        super(5000);
        this.x = x;
        this.y = y;
        this.value = value;
        this.width = 20;
        this.height = 20;
        this.active = true;
    }
}