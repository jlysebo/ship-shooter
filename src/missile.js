import { Bullet } from "./bullet.js";
import { Settings } from "./settings.js";
import { Entity } from "./tools/entity.js";

export class Missle extends Bullet {
	constructor(x, y, angle, speed, width, height, hitPoints, anglesPerSecond) {
		super(x, y, angle, speed, width, height, hitPoints);
		this.anglesPerSecond = anglesPerSecond;
		this.alive = true; 
		this.lastUpdate = new Date();
	}

	move(playerPos) {
		let tempDate = new Date();
		let millis = tempDate - this.lastUpdate;
		if (this.x > Settings.window.width || this.x < 0 || this.y > Settings.window.height || this.y < 0) {
			this.hitPoints = 0;
		}
		let moveDirVector = { x: Math.cos(this.angle), y: Math.sin(this.angle) };
		let perpVectorToPlayer = { x: playerPos.y - this.y, y: -(playerPos.x - this.x) };
		let dotProduct = moveDirVector.x * perpVectorToPlayer.x + moveDirVector.y * perpVectorToPlayer.y;

		if (dotProduct > 0.0) {
			this.rotate(millis*this.anglesPerSecond/1000);
		} else {
			this.rotate(-millis*this.anglesPerSecond/1000);
		}

		super.move();
	}
}