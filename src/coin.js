import { Item } from "./item.js";

export class Coin extends Item {
    constructor(x, y, value) {
        super(30000);
        this.x = x;
        this.y = y;
        this.value = value;
        this.width = 20;
        this.height = 20;
        this.active = true;
    }
}