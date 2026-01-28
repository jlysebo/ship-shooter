export class Item {
    constructor(activeDuration = 30000) {
        this.createdTime = new Date();
        this.activeDuration = activeDuration;
        this.active = true;
    }

    update(tempDate) {
        if (tempDate - this.createdTime > this.activeDuration) {
            this.active = false;
        }
    }
}