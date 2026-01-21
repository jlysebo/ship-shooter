import { Bullet } from "./bullet.js";
import { Settings } from "./settings.js";
import { Entity } from "./tools/entity.js";

export class Missle extends Bullet {
	constructor(x, y, angle, speed, width, height, hitPoints) {
		super(x, y, angle, speed, width, height, hitPoints);
		this.alive = true; 
	}

	move(playerPos) {
		if (this.x > Settings.window.width || this.x < 0 || this.y > Settings.window.height || this.y < 0) {
			this.hitPoints = 0;
		}
		let moveDirVector = { x: Math.cos(this.angle), y: Math.sin(this.angle) };
		let perpVectorToPlayer = { x: playerPos.y - this.y, y: -(playerPos.x - this.x) };
		let dotProduct = moveDirVector.x * perpVectorToPlayer.x + moveDirVector.y * perpVectorToPlayer.y;

		if (dotProduct > 0.0) {
			this.rotate(0.014)
		} else {
			this.rotate(-0.014)
		}

		super.move();
	}
}