import { Bullet } from "./bullet.js";
import { Upgradable } from "./tools/upgradable.js";

export class Weapon {
    constructor(shotDelay, capacity, reloadDelay, stats) {
        this.shotDelay = new Upgradable("Shot Delay", shotDelay, -50, 10, 0, 12, stats);
        this.capacity = new Upgradable("Ammo Capacity", capacity, 20, 5, 1, 1000, stats);
        this.reloadDelay = new Upgradable("Reload Delay", reloadDelay, -50, 5, 1, 18, stats);
        this.stats = stats;
        this.bulletSpeed = new Upgradable("Bullet Speed", 10, 0.5, 10, 5, 10, stats);
        this.ammo = capacity;
        this.reloadAmount = 1;
        this.bullets = [];
        this.lastBulletFired = new Date();
        this.lastReloadTime = new Date();
        this.upgradable = [this.shotDelay, this.capacity, this.reloadDelay, this.bulletSpeed];
    }

    bulletReady() {
        const tempDate = new Date();
        if (this.lastBulletFired.getTime() < tempDate.getTime() - this.shotDelay.value) {
            return true;
        }
        else return false;
    }

    updateBullets() {
        this.bullets.forEach(bullet => bullet.move());
        this.bullets = this.bullets.filter(bullet => bullet.alive);
    }

    fire(x, y, angle) {
        if (this.bulletReady() && this.ammo > 0) {
            this.bullets.push(new Bullet(x, y, angle, this.bulletSpeed.value, 11, 11, 1));
            this.lastBulletFired = new Date();
            this.ammo -= 1;
        }
    }

    update() {
        this.updateBullets();
        const tempDate = new Date();
        if (this.lastReloadTime.getTime() < tempDate.getTime() - this.reloadDelay.value && this.ammo < this.capacity.value && this.lastBulletFired.getTime() < tempDate.getTime() - this.reloadDelay.value * 2) {
            if (this.ammo + this.reloadAmount <= this.capacity.value) {
                this.ammo += this.reloadAmount;
            }
            else this.ammo = this.capacity.value;
            this.lastReloadTime = tempDate;
        }
    }

    /**
     * Upgrades the specified weapon stat.
     * @param {*} stat The aspect to upgrade.
     */
    upgrade(stat) {
        stat.upgrade();
    }


}