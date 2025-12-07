import { Bullet } from "./bullet.js";
import { Upgradable } from "./tools/upgradable.js";

export class Weapon {
    constructor(shotDelay, capacity, reloadDelay) {
        this.shotDelay = new Upgradable("Shot Delay", shotDelay, -5, 40, 20, 20);
        this.capacity = new Upgradable("Ammo Capacity", capacity, 10, 20, 1, 1000);
        this.reloadDelay = new Upgradable("Reload Delay", reloadDelay, -5, 40, 20, 20);
        this.bulletSpeed = new Upgradable("Bullet Speed", 10, 0.5, 50, 50, 10);
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
                console.log(this.lastReloadTime.getTime() - tempDate.getTime() - this.reloadDelay.value)
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