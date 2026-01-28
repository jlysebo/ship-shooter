import { Bullet } from "./bullet.js";
import { Settings } from "./settings.js";
import { Entity } from "./tools/entity.js";

export class Missle extends Bullet {
	constructor(x, y, angle, speed, width, height, hitPoints, anglesPerSecond, flightDuration = 15000) {
		super(x, y, angle, speed, width, height, hitPoints);
		this.anglesPerSecond = anglesPerSecond;
		this.flightDuration = flightDuration;
		this.alive = true; 
		this.shotTime = new Date();
		this.lastUpdate = new Date();
	}

	move(playerPos) {
		let tempDate = new Date();
		let millis = tempDate - this.lastUpdate;
		if (tempDate - this.shotTime > this.flightDuration) {
			this.hitPoints = 0;
		}
		if (this.x > Settings.map.width || this.x < 0 || this.y > Settings.map.height || this.y < 0) {
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