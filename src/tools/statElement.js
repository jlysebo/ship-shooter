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
        <button class="upgrade-button">Upgrade cost: ${this.upgradable.cost}</button>
        `;

        container.querySelector('.upgrade-button').addEventListener('click', () => {
            this.upgradable.upgrade();
            container.querySelector('.value-label').textContent = this.upgradable.value;
            container.querySelector('.upgrade-button').textContent = "Upgrade cost: " + this.upgradable.cost;
        })
        return container;

    }
}