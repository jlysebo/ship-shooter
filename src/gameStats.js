export class gameStats {
    constructor() {
        this.level = 1;
        this.kills = 0;
        this.shots = 0;
        this.itemList = [];
        this.coins = 0;
    }

    registerKill() {
        this.kills += 1;
    }

    registerShot() {
        this.shots += 1;
    }

    setLevel(level) {
        this.level = level;
    }

    refreshItems() {
        this.itemList = this.itemList.filter(item => item.active);
    }

}