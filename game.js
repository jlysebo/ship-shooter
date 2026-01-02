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
import { Submarine } from "./src/submarine.js";
import { ShieldAbility } from "./src/shield.js";

let game = {};

function drawCanvas() {
    ctx.clearRect(0, 0, Settings.window.width, Settings.window.height);
    drawRotatedImage(playerImg, game.player.x, game.player.y, game.player.angle);
    drawRotatedImage(cannonImg, game.player.x, game.player.y, game.player.shotAngle);
    game.stats.coinList.forEach(coin => {
        if (coin.value == 1) {
            drawRotatedImage(coin1Img, coin.x, coin.y, 0);
        }
        else if (coin.value == 5) {
            drawRotatedImage(coin5Img, coin.x, coin.y, 0);
        }
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
        if (enemy instanceof Submarine) {
            if (enemy.underwater) {
                drawRotatedImage(submarineUnderwaterImg, enemy.x, enemy.y, enemy.angle);
            }
            else {
                drawRotatedImage(submarineImg, enemy.x, enemy.y, enemy.angle);
            }
        }
    });
    game.mines.forEach(mine => {
        if (mine.detonationStage >= 2) {
            drawRotatedImage(explosion75Img, mine.x, mine.y, mine.angle);
        }
        else if (mine.detonationStage == 1) {
            drawRotatedImage(mineRedImg, mine.x, mine.y, mine.angle);
        }
        else if (mine.detonationStage == 0) {
            drawRotatedImage(mineImg, mine.x, mine.y, mine.angle);
        }
    })
    if (game.player.ability instanceof ShieldAbility) {
        const tempDate = new Date();
        if (game.player.ability.active) {
            abilityLabel.textContent = "Active";
            //ctx.beginPath();
            //ctx.arc(game.player.x, game.player.y, game.player.ability.range, 0, 2 * Math.PI);
            //ctx.stroke();
            drawRotatedImage(shieldImg, game.player.x, game.player.y, game.player.angle);
        }
        else if (tempDate - game.player.ability.lastActivationTime > game.player.ability.cooldown + game.player.ability.duration) {
            abilityLabel.textContent = "Ready";
        }
        else {
            abilityLabel.textContent = "Cooldown";
        }
    }
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
    if (dice == 5) {
        game.enemies.push(new Submarine(xy[0], xy[1], randomInteger(0, 6), randomDecimal(1.5, 2.2), 25, 80, 3, randomInteger(4000, 5000), randomInteger(0, 4)));
    }
    if (dice == 6) {
        game.enemies.push(new Destroyer(xy[0], xy[1], randomInteger(0, 6), randomDecimal(1.5, 2.2), 35, 85, 2, randomInteger(280, 450), randomInteger(2000, 3000)));
    }
    else {
        game.enemies.push(new rib(xy[0], xy[1], randomInteger(0, 6), randomDecimal(1.3, Math.max(2.4, game.stats.level * 0.4)), enemy1Img.width, enemy1Img.height, 1, randomDecimal(-Math.PI / 8, Math.PI / 8)));
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

function damageEnemy(enemy, damage) {
    enemy.hitPoints -= damage;
    if (enemy.hitPoints <= 0) {
        game.stats.registerKill();
        if (enemy instanceof rib) {
            game.stats.coinList.push(new Coin(enemy.x, enemy.y, 1));
        }
        else if (enemy instanceof Destroyer) {
            game.stats.coinList.push(new Coin(enemy.x, enemy.y, 1));
        }
        else if (enemy instanceof Submarine) {
            game.stats.coinList.push(new Coin(enemy.x, enemy.y, 5));
        }
    }
}

function updateEnemies() {
    // mine hits player
    const tempDate = new Date();
    game.mines.forEach(mine => {
        mine.update(tempDate, game.mines);
        if (mine.contact(game.player) && mine.detonationStage <= 2) {
            game.player.takeDamage();
            mine.detonate(game.mines);
        }
        game.player.weapon.bullets.forEach(bullet => {
            if (bullet.contact(mine) && (mine.detonationStage < 2)) {
                mine.detonate(game.mines);
                bullet.hitPoints -= 1;
            }
        })
    });
    // mine kills enemy
    game.enemies.forEach(enemy => {
        enemy.update(game.player);
        if (game.player.ability instanceof ShieldAbility && game.player.ability.active) {
            if (game.player.ability.contact(enemy)) {
                damageEnemy(enemy, 10);
            }
        }
        game.mines.forEach(mine => {
            if (mine.detonationStage == 2 && mine.contact(enemy)) {
                damageEnemy(enemy, 5);
            }
        })
        // updates hitpoints for all player bullets.
        game.player.weapon.bullets.forEach(bullet => {
            if (enemy.contact(bullet)) {
                if (enemy instanceof Submarine) {
                    if (!enemy.underwater) {
                        damageEnemy(enemy, 1);
                        bullet.hitPoints -= 1;
                    }
                }
                else {
                    damageEnemy(enemy, 1);
                    bullet.hitPoints -= 1;
                }
            }
        })
        // player takes damage.
        if (game.player.contact(enemy)) {
            if (!(enemy instanceof Submarine && enemy.underwater)) {
                game.player.takeDamage();
            }
        }
        if (enemy instanceof Submarine) {
            while (enemy.mines.length > 0) {
                game.mines.push(enemy.mines.pop());
            }
        }

        // If enemy is a Destroyer, loop through all its bullets.
        if (enemy instanceof Destroyer) {
            enemy.bullets.forEach(bullet => {
                // enemy hits shield.
                if (game.player.ability instanceof ShieldAbility && game.player.ability.active) {
                    if (game.player.ability.contact(bullet)) {
                        bullet.hitPoints -= 10;
                    }
                }
                // enemy hits player.
                if (game.player.contact(bullet)) {
                    game.player.takeDamage();
                    bullet.hitPoints -= 1;
                }
                // enemy hits another enemy.
                game.enemies.forEach(p => {
                    if (p.contact(bullet) && !(p instanceof Destroyer) && !(p instanceof Submarine && p.underwater)) {
                        damageEnemy(p, 1);
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
    game.mines = game.mines.filter(mine => mine.hitPoints > 0);
}

function displayEndscreen() {
    continueButton.style.visibility = "visible";
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

    //info.textContent = "X: " + Math.round(game.player.x) + ", Y: " + Math.round(game.player.y) + ", Angle: " + Math.round(game.player.angle / Math.PI * 180) + "\nshotAngle: " + Math.round(game.player.shotAngle / Math.PI * 180) + " Ammo: " + game.player.weapon.ammo;
    if (keys.m) {
        game.stats.coins += 1000;
    }
    //queues next frame
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
const coin5Img = document.getElementById(Settings.img.coin_5);
const submarineImg = document.getElementById(Settings.img.submarine);
const submarineUnderwaterImg = document.getElementById(Settings.img.submarineUnderwater);
const mineImg = document.getElementById(Settings.img.mine);
const mineRedImg = document.getElementById(Settings.img.mineRed);
const explosion75Img = document.getElementById(Settings.img.explosion75);
const heartImg = document.getElementById(Settings.img.heart);
const skullImg = document.getElementById(Settings.img.skull);
const shieldImg = document.getElementById(Settings.img.shield);




const info = document.getElementById("info");
const statsContainer = document.getElementById('stats-container');
const startButton = document.getElementById("start-button");
const continueButton = document.getElementById("continue-button");
const ammoLabel = document.getElementById("ammo-value");
const healthLabel = document.getElementById("health-value");
const killsLabel = document.getElementById("kills-value");
const coinsLabel = document.getElementById("coin-value");
const abilityLabel = document.getElementById("ability-status");
var startButtonValid = true;



// continue with same player, but new game
function continueGame() {
    game.player.hitPoints = 3;
    game.player.weapon.ammo = game.player.weapon.capacity.value;
    game.enemies.length = 0;
    game.mines.length = 0;
    game.stats.coinList.length = 0;
    game.stats.level = 1;
    setupInput();
    gameLoop();
}


// create new player and game
function startGame() {
    const stats = new gameStats();
    game = {
        stats: stats,
        player: new Player(Settings.window.width / 2, Settings.window.height / 2, 0, 3, Settings.sprite.width, Settings.sprite.height, 3, stats),
        statsDisplay: [],
        enemies: [],
        mines: [],
    }
    game.statsDisplay.length = 0;
    game.player.weapon.upgradable.forEach(item => {
        game.statsDisplay.push(new statElement(item));
    });
    game.statsDisplay.push(new statElement(game.player.speed));
    game.statsDisplay.push(new statElement(game.player.ability.available));
    document.getElementById('upgrade-container').style.visibility = "visible";
    document.getElementById('info-container').style.visibility = "visible";
    document.getElementById('how-to-play').textContent = "";
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

continueButton.addEventListener('click', () => {
    if (startButtonValid) {
        continueGame();
        startButtonValid = false;
    }
})
//starts first loop