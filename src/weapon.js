import { Bullet } from "./bullet.js";

export class Weapon {
    constructor(shotDelay, capacity, reloadDelay) {
        this.shotDelay = shotDelay;
        this.capacity = capacity;
        this.reloadDelay = reloadDelay;
        this.ammo = capacity;
        this.reloadAmount = 1;
        this.bulletSpeed = 10;
        this.bullets = [];
        this.lastBulletFired = new Date();
        this.lastReloadTime = new Date();
    }

    bulletReady() {
        const tempDate = new Date();
        if (this.lastBulletFired.getTime() < tempDate.getTime() - this.shotDelay) {
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
            this.bullets.push(new Bullet(x, y, angle, this.bulletSpeed, 11, 11, 1));
            this.lastBulletFired = new Date();
            this.ammo -= 1;
        }
    }

    update() {
        this.updateBullets();
        const tempDate = new Date();
        if (this.lastReloadTime.getTime() < tempDate.getTime() - this.reloadDelay && this.ammo < this.capacity && this.lastBulletFired.getTime() < tempDate.getTime() - this.reloadDelay*2) {
            if (this.ammo + this.reloadAmount <= this.capacity) {
                this.ammo += this.reloadAmount;
                console.log(this.lastReloadTime.getTime() - tempDate.getTime() - this.reloadDelay)
            }
            else this.ammo = this.capacity;
            this.lastReloadTime = tempDate;
        }
    }
}