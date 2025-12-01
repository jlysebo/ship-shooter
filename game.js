import { Player } from "./src/player.js";
import { keys, setupInput } from "./src/input.js";
import { Settings } from "./src/settings.js";
import { drawRotatedImage } from "./src/tools/drawRotatedImage.js";
import { rib } from "./src/rib.js";
import { randomDecimal, randomInteger, randomXY } from "./src/tools/random.js";
import { distance } from "./src/tools/calculations.js";
import { Destroyer } from "./src/destroyer.js";

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
    enemies.forEach(enemy => {
        if (enemy instanceof rib) {
            drawRotatedImage(enemy1Img, enemy.x, enemy.y, enemy.angle);
        }
        if (enemy instanceof Destroyer) {
            drawRotatedImage(destroyerImg, enemy.x, enemy.y, enemy.angle);
            enemy.bullets.forEach(bullet => drawRotatedImage(bulletImg, bullet.x, bullet.y, bullet.angle));
        }
    });
}

/**
 * Spawns an enemy outside the buffer from the player.
 * @param {*} buffer 
 */
function spawnEnemy(buffer) {
    let dice = Math.floor(randomInteger(1, 7));
    let xy = randomXY();
    while (distance(player.x, player.y, xy[0], xy[1]) < buffer) {
        xy = randomXY();
    }
    if (dice == 6) {
        enemies.push(new Destroyer(xy[0], xy[1], randomInteger(0, 6), randomDecimal(1.5, 2.2), 35, 85, 1, randomInteger(280, 450), randomInteger(2000, 3000)));
    }
    else {
        enemies.push(new rib(xy[0], xy[1], randomInteger(0, 6), randomDecimal(1.3, Math.max(2.4, player.stats.level * 0.4)), enemy1Img.width, enemy1Img.height, 1));
    }
}

function updateEnemies() {
    // add new enemies
    enemies.forEach(enemy => {
        enemy.update(player);
        // updates hitpoints for all player bullets.
        player.bullets.forEach(bullet => {
            if (enemy.contact(bullet)) {
                enemy.hitPoints -= 1;
                bullet.hitPoints -= 1;
                if (enemy.hitPoints < 1) {
                    player.stats.registerKill();
                }
            }
        })
        // player takes damage.
        if (player.contact(enemy)) {
            player.takeDamage();
        }
        // If enemy is a Destroyer, loop through all its bullets.
        if (enemy instanceof Destroyer) {
            enemy.bullets.forEach(bullet => {
                // enemy hits player.
                if (player.contact(bullet)) {
                    player.takeDamage();
                    bullet.hitPoints -= 1;
                }
                // enemy hits another enemy.
                enemies.forEach(p => {
                    if (p.contact(bullet) && !(p instanceof Destroyer)) {
                        p.hitPoints -= 1;
                        bullet.hitPoints -= 1;
                    }
                })
                // bullet hits bullet.
                player.bullets.forEach(q => {
                    if (bullet.contact(q)) {
                        bullet.hitPoints -= 1;
                        q.hitPoints -= 1;
                    }
                })
            })
        }
    });
    if (enemies.length == 0) {
        for (let i = 0; i <= player.stats.level; i++) {
            spawnEnemy(250);
        }
        player.stats.level += 0.3;
    }
    enemies = enemies.filter(enemy => enemy.hitPoints > 0);
}

function displayEndscreen() {
    ctx.font = "50px Arial";
    ctx.fillText("GAME OVER", 150, 300);
}

function gameLoop() {
    //update player input
    player.update(keys);
    player.updateBullets();
    updateEnemies()
    drawCanvas();


    info.textContent = "X: " + Math.round(player.x) + ", Y: " + Math.round(player.y) + ", Angle: " + Math.round(player.angle / Math.PI * 180) + ", shotAngle: " + Math.round(player.shotAngle / Math.PI * 180);
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


const playerImg = document.getElementById(Settings.img.player);
const cannonImg = document.getElementById(Settings.img.cannon);
const bulletImg = document.getElementById(Settings.img.bullet);
const enemy1Img = document.getElementById(Settings.img.enemy1);
const destroyerImg = document.getElementById(Settings.img.destroyer);

const player = new Player(Settings.window.width / 2, Settings.window.height / 2, 0, 3, Settings.sprite.width, Settings.sprite.height, 3);
var enemies = [];


const info = document.getElementById("info");
const stats = document.getElementById("stats");

//initialize input listeners
setupInput();

//starts first loop
gameLoop();