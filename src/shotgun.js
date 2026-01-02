import { normalizeAngle } from "./tools/angle.js";
import { Weapon } from "./weapon.js";
import { Bullet } from "./bullet.js";

export class Shotgun extends Weapon {
    constructor(weapon) {
        super();
        this.shotDelay = weapon.shotDelay;
        this.capacity = weapon.capacity;
        this.reloadDelay = weapon.reloadDelay;
        this.stats = weapon.stats;
        this.bulletSpeed = weapon.bulletSpeed;
        this.ammo = weapon.ammo;
        this.reloadAmount = 1;
        this.bullets = weapon.bullets;
        this.lastBulletFired = weapon.lastBulletFired;
        this.lastReloadTime = weapon.lastBulletFired;
        this.upgradable = [this.shotDelay, this.capacity, this.reloadDelay, this.bulletSpeed]
        this.multishot = Math.min(weapon.multishot + 1, 5);
    }

    fire(x, y, angle) {
        if (this.bulletReady() && this.ammo > 0) {
            if (this.multishot == 2) {
                this.bullets.push(new Bullet(x, y, normalizeAngle(angle + Math.PI / 20), this.bulletSpeed.value, 11, 11, 1));
                this.bullets.push(new Bullet(x, y, normalizeAngle(angle - Math.PI / 20), this.bulletSpeed.value, 11, 11, 1));

            }
            else if (this.multishot == 3) {
                this.bullets.push(new Bullet(x, y, normalizeAngle(angle + Math.PI / 16), this.bulletSpeed.value, 11, 11, 1));
                this.bullets.push(new Bullet(x, y, normalizeAngle(angle - Math.PI / 16), this.bulletSpeed.value, 11, 11, 1));
                this.bullets.push(new Bullet(x, y, angle, this.bulletSpeed.value, 11, 11, 1));
            }
            else if (this.multishot == 4) {
                this.bullets.push(new Bullet(x, y, normalizeAngle(angle - Math.PI / 8), this.bulletSpeed.value, 11, 11, 1));
                this.bullets.push(new Bullet(x, y, normalizeAngle(angle + Math.PI / 8), this.bulletSpeed.value, 11, 11, 1));
                this.bullets.push(new Bullet(x, y, normalizeAngle(angle + Math.PI / 20), this.bulletSpeed.value, 11, 11, 1));
                this.bullets.push(new Bullet(x, y, normalizeAngle(angle - Math.PI / 20), this.bulletSpeed.value, 11, 11, 1));


            }
            else if (this.multishot > 4) {
                this.bullets.push(new Bullet(x, y, normalizeAngle(angle - Math.PI / 8), this.bulletSpeed.value, 11, 11, 1));
                this.bullets.push(new Bullet(x, y, normalizeAngle(angle + Math.PI / 8), this.bulletSpeed.value, 11, 11, 1));
                this.bullets.push(new Bullet(x, y, normalizeAngle(angle + Math.PI / 20), this.bulletSpeed.value, 11, 11, 1));
                this.bullets.push(new Bullet(x, y, normalizeAngle(angle - Math.PI / 20), this.bulletSpeed.value, 11, 11, 1));
                this.bullets.push(new Bullet(x, y, angle, this.bulletSpeed.value, 11, 11, 1));
            }
            this.lastBulletFired = new Date();
            this.ammo -= 1;
        }
    }
}