export class gameStats {
    constructor() {
        this.level = 1;
        this.kills = 0;
        this.shots = 0;
        this.coinList = [];
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

    refreshCoinList() {
        this.coinList.forEach(coin => {
            if (!coin.active) {
                this.coins += coin.value;
            }
        })
        this.coinList = this.coinList.filter(coin => coin.active);
    }


}