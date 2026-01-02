export class statElement {
    constructor(upgradable) {
        this.upgradable = upgradable;
    }

    render() {
        const container = document.createElement('div');
        container.className = 'stats-container';
        container.innerHTML = `
        <span class="stat-label">${this.upgradable.name}:</span>
        <span class="value-label">${this.upgradable.value}:</span>
        <button class="upgrade-button">Cost: ${this.upgradable.cost}</button>
        `;

        container.querySelector('.upgrade-button').addEventListener('click', () => {
            this.upgradable.upgrade();
            container.querySelector('.upgrade-button').blur();
            container.querySelector('.value-label').textContent = this.upgradable.value + ":";
            if (this.upgradable.cost == "Max") {
                container.querySelector('.upgrade-button').textContent = "Max level";
            }
            else {
                container.querySelector('.upgrade-button').textContent = "Cost: " + this.upgradable.cost;
            }
        })
        return container;

    }
}