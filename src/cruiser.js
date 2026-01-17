import { Bullet } from "./bullet.js";
import { Enemy } from "./enemy.js";
import { Missle } from "./missile.js";
import { distance } from "./tools/calculations.js";
import { randomInteger } from "./tools/random.js";

export class Cruiser extends Enemy {
	constructor(x, y, angle, speed, width, height, hitPoints, range, reloadTime) {
		super(x, y, angle, speed, width, height, hitPoints, 0);
		this.range = range;
		this.reloadTime = reloadTime;
		this.missiles = [];
		this.lastShotTime = new Date();
	}

	update(player) {
		let tempDate = new Date();
		if (distance(this.x, this.y, player.x, player.y) > this.range) {
			super.update(player);
			this.lastShotTime = tempDate;
		}
		else if (this.lastShotTime < tempDate - this.reloadTime) {
			this.lastUpdate = tempDate;
			this.adjustAngle(player);
			this.missiles.push(new Missle(this.x, this.y, this.angle, 3, 11, 11, 1))
			this.lastShotTime = tempDate;
			this.reloadTime = randomInteger(2000, 4000);
		}
		else {
			this.lastUpdate = tempDate;
			this.adjustAngle(player);
		}
		this.missiles.forEach(bullet => bullet.move({ x: player.x, y: player.y }));
		this.missiles = this.missiles.filter(bullet => bullet.alive);
	}
}