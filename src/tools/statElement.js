export class statElement {
    constructor(label, value, upgradable, upgradeIncrement = 0) {
        this.label = label;
        this.value = value;
        this.upgradable = upgradable;
        this.upgradeIncrement = upgradeIncrement;
        this.upgradeCost = 1;
    }

    render() {
        const container = document.createElement('div');
        container.className = 'stats-container';
        let temp = "";
        if (this.upgradable) {
            temp = `<button class="upgrade-button">Upgrade: ${this.upgradeCost}</button>`
        }
        container.innerHTML = `
        <span class="stat-label">${this.label}:</span>
        <span class="value-label">${this.value}:</span>
        ${temp}
        `;

        if (this.upgradable) {
            container.querySelector('.upgrade-button').addEventListener('click', () => {
                this.value += this.upgradeIncrement;
                container.querySelector('.value-label').textContent = this.value;
            })
        }
        return container;

    }
}