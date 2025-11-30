import { Player } from "./src/player.js";
import { keys, setupInput } from "./src/input.js";
import { Settings } from "./src/settings.js";
import { drawRotatedImage } from "./src/tools/drawRotatedImage.js";
import { getQuadrant } from "./src/tools/getQuadrant.js";
import { Bullet } from "./src/bullet.js";
import { Enemy } from "./src/enemy.js";
import { randomInteger, randomXY } from "./src/tools/randomInteger.js";
import { distance } from "./src/tools/pythagoras.js";

class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.player = new Player(Settings.window.width / 2, Settings.window.height / 2, 0, 3, Settings.sprite.width, Settings.sprite.height, 3);
        this.enemies = [];
    }
}

function drawCanvas() {
    ctx.clearRect(0, 0, Settings.window.width, Settings.window.height);
    drawRotatedImage(playerImg, player.x, player.y, player.angle);
    drawRotatedImage(cannonImg, player.x, player.y, player.shotAngle);
    player.bullets.forEach(bullet => drawRotatedImage(bulletImg, bullet.x, bullet.y, bullet.angle));
    enemies.forEach(enemy => drawRotatedImage(enemy1Img, enemy.x, enemy.y, enemy.angle));
}

/**
 * Spawns an enemy outside the buffer from the player.
 * @param {*} buffer 
 */
function spawnEnemy(buffer) {
    let xy = randomXY();
    while (distance(player.x, player.y, xy[0], xy[1]) < buffer) {
        xy = randomXY();
    }
    enemies.push(new Enemy(xy[0], xy[1], randomInteger(0, 6), randomInteger(1.5, Math.max(3, player.stats.level*0.5)), enemy1Img.width, enemy1Img.height, 1));
}

function updateEnemies() {
    // add new enemies
    enemies.forEach(enemy => {
        if (player.contact(enemy)) {
            player.takeDamage();
        }
        player.bullets.forEach(bullet => {
            if (enemy.contact(bullet)) {
                enemy.hitPoints -= 1;
                bullet.hitPoints -= 1;
                if (enemy.hitPoints < 1) {
                    player.stats.registerKill();
                }
            }
        })
        enemy.adjustAngle(player);
        enemy.update();
    });
    if (enemies.length == 0) {
        for (let i = 0; i <= player.stats.level; i++) {
            spawnEnemy(250);
        }
        player.stats.level += 0.3;
    }
    enemies = enemies.filter(enemy => enemy.hitPoints > 0);
}

function displayEndscreen(){
    ctx.font = "50px Arial";
    ctx.fillText("GAME OVER", 150, 300);
}

function gameLoop() {
    //clear canvas
    //ctx.clearRect(0, 0, Settings.window.width, Settings.window.height);
    //update player input
    player.update(keys);
    player.updateBullets();
    updateEnemies()
    drawCanvas();

    //draw the ship
    /*
 
    drawRotatedImage(testEnemyImg, testEnemy.x, testEnemy.y, testEnemy.angle);
    drawRotatedImage(jolle, player.x, player.y, player.angle);
    drawRotatedImage(cannon, player.x, player.y, player.shotAngle);
    if (player.bullets.length > 0) {
        player.bullets.forEach(bullet => drawRotatedImage(bulletImg, bullet.x, bullet.y, bullet.angle));
    }
    */

    info.textContent = "X: " + Math.round(player.x) + ", Y: " + Math.round(player.y) + ", Angle: " + Math.round(player.angle / Math.PI * 180) + ", shotAngle: " + Math.round(player.shotAngle / Math.PI * 180);
    a.textContent = "Bulletcount: " + player.bullets.length + ", Contact: " + ", Shot: " + keys.Space;
    stats.textContent = "Lives: " + player.hitPoints + ", Kills: " + player.stats.kills + ", Shots: " + player.stats.shots + ", Enemies: " + enemies.length;

    //queues next framew
    if (player.hitPoints < 1 || keys.p) {
        displayEndscreen();
    }
    else {
    requestAnimationFrame(gameLoop);
}
}



//creates canvas and ship image
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
//const game = new Game(canvas);


const playerImg = document.getElementById(Settings.img.player);
const cannonImg = document.getElementById(Settings.img.cannon);
const bulletImg = document.getElementById(Settings.img.bullet);
const enemy1Img = document.getElementById(Settings.img.enemy1);

const player = new Player(Settings.window.width / 2, Settings.window.height / 2, 0, 3, Settings.sprite.width, Settings.sprite.height, 3);
var enemies = [];


const info = document.getElementById("info");
const a = document.getElementById("debug");
const stats = document.getElementById("stats");

//constructs a new player
//const player = new Player(Settings.window.width / 2 - Settings.sprite.width / 2, Settings.window.height / 2 - Settings.sprite.height / 2, 4, Math.PI, jolle.width, jolle.height, 3);
//const testEnemy = new Enemy(100, 100, 0, 5, testEnemyImg.width, testEnemyImg.height, 3);
//initialize input listeners
setupInput();

//starts first loop
gameLoop();