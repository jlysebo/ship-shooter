import { Player } from "./src/player.js";
import { keys, setupInput } from "./src/input.js";
import { Settings } from "./src/settings.js";
import { drawRotatedImage } from "./src/tools/drawRotatedImage.js";
import { rib } from "./src/rib.js";
import { randomDecimal, randomInteger, randomXY } from "./src/tools/random.js";
import { distance } from "./src/tools/calculations.js";
import { Destroyer } from "./src/destroyer.js";
import { gameStats } from "./src/gameStats.js";
import { Coin } from "./src/coin.js";
import { statElement } from "./src/tools/statElement.js";

let game = {};

function drawCanvas() {
    ctx.clearRect(0, 0, Settings.window.width, Settings.window.height);
    drawRotatedImage(playerImg, game.player.x, game.player.y, game.player.angle);
    drawRotatedImage(cannonImg, game.player.x, game.player.y, game.player.shotAngle);
    game.stats.coinList.forEach(coin => {
        drawRotatedImage(coin1Img, coin.x, coin.y, 0);
    })
    game.player.weapon.bullets.forEach(bullet => drawRotatedImage(bulletImg, bullet.x, bullet.y, bullet.angle));
    game.enemies.forEach(enemy => {
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
    while (distance(game.player.x, game.player.y, xy[0], xy[1]) < buffer) {
        xy = randomXY();
    }
    if (dice == 6) {
        game.enemies.push(new Destroyer(xy[0], xy[1], randomInteger(0, 6), randomDecimal(1.5, 2.2), 35, 85, 1, randomInteger(280, 450), randomInteger(2000, 3000)));
    }
    else {
        game.enemies.push(new rib(xy[0], xy[1], randomInteger(0, 6), randomDecimal(1.3, Math.max(2.4, game.stats.level * 0.4)), enemy1Img.width, enemy1Img.height, 1));
    }
}

function updateCoins() {
    game.stats.coinList.forEach(coin => {
        if (game.player.contact(coin)) {
            coin.active = false;
        }
    })
    game.stats.refreshCoinList();
}

function updateEnemies() {
    // add new enemies
    game.enemies.forEach(enemy => {
        enemy.update(game.player);
        // updates hitpoints for all player bullets.
        game.player.weapon.bullets.forEach(bullet => {
            if (enemy.contact(bullet)) {
                enemy.hitPoints -= 1;
                bullet.hitPoints -= 1;
                if (enemy.hitPoints < 1) {
                    game.stats.registerKill();
                    game.stats.coinList.push(new Coin(enemy.x, enemy.y, 1));
                }
            }
        })
        // player takes damage.
        if (game.player.contact(enemy)) {
            game.player.takeDamage();
        }
        // If enemy is a Destroyer, loop through all its bullets.
        if (enemy instanceof Destroyer) {
            enemy.bullets.forEach(bullet => {
                // enemy hits player.
                if (game.player.contact(bullet)) {
                    game.player.takeDamage();
                    bullet.hitPoints -= 1;
                }
                // enemy hits another enemy.
                game.enemies.forEach(p => {
                    if (p.contact(bullet) && !(p instanceof Destroyer)) {
                        p.hitPoints -= 1;
                        bullet.hitPoints -= 1;
                    }
                })
                // bullet hits bullet.
                game.player.weapon.bullets.forEach(q => {
                    if (bullet.contact(q)) {
                        bullet.hitPoints -= 1;
                        q.hitPoints -= 1;
                    }
                })
            })
        }
    });
    if (game.enemies.length == 0) {
        for (let i = 0; i <= game.stats.level; i++) {
            spawnEnemy(250);
        }
        game.stats.level += 0.3;
    }
    game.enemies = game.enemies.filter(enemy => enemy.hitPoints > 0);
}

function displayEndscreen() {
    ctx.font = "50px Arial";
    ctx.fillText("GAME OVER", 150, 300);
    startButtonValid = true;
}

function gameLoop() {
    //update player input
    game.player.update(keys);
    game.player.updateBullets();
    updateEnemies()
    updateCoins();
    drawCanvas();

    healthLabel.textContent = game.player.hitPoints;
    coinsLabel.textContent = game.stats.coins;
    ammoLabel.textContent = game.player.weapon.ammo;
    killsLabel.textContent = game.stats.kills;

    info.textContent = "X: " + Math.round(game.player.x) + ", Y: " + Math.round(game.player.y) + ", Angle: " + Math.round(game.player.angle / Math.PI * 180) + "\nshotAngle: " + Math.round(game.player.shotAngle / Math.PI * 180) + " Ammo: " + game.player.weapon.ammo;

    //queues next framew
    if (game.player.hitPoints < 1 || keys.p) {
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
const coin1Img = document.getElementById(Settings.img.coin_1);





const info = document.getElementById("info");
const statsContainer = document.getElementById('stats-container');
const startButton = document.getElementById("start-button");
const ammoLabel = document.getElementById("ammo-value");
const healthLabel = document.getElementById("health-value");
const killsLabel = document.getElementById("kills-value");
const coinsLabel = document.getElementById("coin-value");
var startButtonValid = true;




function startGame() {
    const stats = new gameStats();
    document.getElementById('upgrade-container').style.visibility = "visible";
    document.getElementById('info-container').style.visibility = "visible";
    document.getElementById('how-to-play').textContent = "";
    game = {
        stats: stats,
        player: new Player(Settings.window.width / 2, Settings.window.height / 2, 0, 3, Settings.sprite.width, Settings.sprite.height, 3, stats),
        statsDisplay: [],
        enemies: [],

    }
    game.statsDisplay.length = 0;
    game.player.weapon.upgradable.forEach(item => {
        game.statsDisplay.push(new statElement(item));
    });
    game.statsDisplay.push(new statElement(game.player.speed));
    statsContainer.innerHTML = "";
    game.statsDisplay.forEach(stat => statsContainer.appendChild(stat.render()));
    console.log("started");
    setupInput();
    gameLoop();
}

//initialize input listeners
startButton.addEventListener('click', () => {
    if (startButtonValid) {
        startGame();
        startButtonValid = false;
    }
})
//starts first loop