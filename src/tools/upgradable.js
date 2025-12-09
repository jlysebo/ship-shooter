export class Upgradable {
    constructor(name, value, increment, cost, costIncrement, maxLevel, stats) {
        this.name = name;
        this.value = value;
        this.increment = increment;
        this.cost = cost;
        this.costIncrement = costIncrement;
        this.maxLevel = maxLevel;
        this.stats = stats;
        this.level = 0;
    }

    upgrade() {
        if (this.level < this.maxLevel && this.stats.coins >= this.cost) {
            this.stats.coins -= this.cost;
            this.value += this.increment;
            this.cost += this.costIncrement;
            this.level += 1;
        }
    }
}