import { Player } from "./src/player.js";
import { keys, setupInput } from "./src/input.js";
import { Settings } from "./src/settings.js";
import { drawRotatedImage } from "./src/tools/drawRotatedImage.js";
import { rib } from "./src/rib.js";
import { randomDecimal, randomInteger, randomXY } from "./src/tools/random.js";
import { distance } from "./src/tools/calculations.js";
import { Destroyer } from "./src/destroyer.js";
import { Cruiser } from "./src/cruiser.js";
import { gameStats } from "./src/gameStats.js";
import { Coin } from "./src/coin.js";
import { statElement } from "./src/tools/statElement.js";
import { Submarine } from "./src/submarine.js";
import { ShieldAbility } from "./src/shield.js";
import { Heart } from "./src/heart.js";
import { Multishot } from "./src/multishot.js";
import { Shotgun } from "./src/shotgun.js";
import { Airstrike } from "./airstrike.js";
import { calculateAngle } from "./src/tools/angle.js";
import { miniShield } from "./src/miniShield.js";
import { ClusterMine } from "./src/clusterMine.js";
import { helicopter } from "./src/helicopter.js";
import { daylightCycle } from "./src/daylightCycle.js";

let game = {};

function drawCanvas() {
    ctx.clearRect(0, 0, Settings.window.width, Settings.window.height);
    ctx.drawImage(sea_middleImg, 0, 0, 650, 650);
    ctx.fillStyle = "#33CCCC";
    updateVisualLocation();
    drawRotatedImage(seashore_cornerImg, flooredVisualXY({ x: 75, y: 75 }), 0);
    drawRotatedImage(seashore_cornerImg, flooredVisualXY({ x: Settings.map.width - 75, y: 75 }), Math.PI / 2);
    drawRotatedImage(seashore_cornerImg, flooredVisualXY({ x: 75, y: Settings.map.height - 75 }), 3 * Math.PI / 2);
    drawRotatedImage(seashore_cornerImg, flooredVisualXY({ x: Settings.map.width - 75, y: Settings.map.height - 75 }), Math.PI);
    for (let i = 225; i < Settings.map.width - 150; i += 150) {
        drawRotatedImage(seashore_sideImg, flooredVisualXY({ x: 74, y: i }), 0);
        drawRotatedImage(seashore_sideImg, flooredVisualXY({ x: Settings.map.width - 74, y: i }), Math.PI);
        drawRotatedImage(seashore_sideImg, flooredVisualXY({ x: i, y: 74 }), Math.PI / 2);
        drawRotatedImage(seashore_sideImg, flooredVisualXY({ x: i, y: Settings.map.height - 74 }), 3 * Math.PI / 2);
        for (let k = 225; k < Settings.map.height - 150; k += 150) {
            drawRotatedImage(wavesImg, flooredVisualXY({x: i, y: k}), 0);
        }
    }
    /*
    */
    drawRotatedImage(playerImg, visualXY({ x: game.player.x, y: game.player.y }), game.player.angle);
    drawRotatedImage(cannonImg, visualXY({ x: game.player.x, y: game.player.y }), game.player.shotAngle);
    game.stats.itemList.forEach(item => {
        if (item instanceof Coin) {
            if (item.value == 1) {
                drawRotatedImage(coin1Img, visualXY({ x: item.x, y: item.y }), 0);
            }
            else if (item.value == 5) {
                drawRotatedImage(coin5Img, visualXY({ x: item.x, y: item.y }), 0);
            }
        }
        else if (item instanceof Heart) {
            drawRotatedImage(heartImg, visualXY({ x: item.x, y: item.y }), 0);
        }
        else if (item instanceof Multishot) {
            drawRotatedImage(multishotImg, visualXY({ x: item.x, y: item.y }), 0);
        }
        else if (item instanceof miniShield) {
            drawRotatedImage(mini_shieldImg, visualXY({ x: item.x, y: item.y }), 0);
        }
    })
    game.player.weapon.bullets.forEach(bullet => drawRotatedImage(bulletImg, visualXY({ x: bullet.x, y: bullet.y }), bullet.angle));
    game.mines.forEach(mine => {
        if (mine.detonationStage >= 2) {
            drawRotatedImage(explosion75Img, visualXY({ x: mine.x, y: mine.y }), mine.angle);
        }
        else if (mine.detonationStage == 1) {
            drawRotatedImage(mineRedImg, visualXY({ x: mine.x, y: mine.y }), mine.angle);
        }
        else if (mine.detonationStage == 0) {
            drawRotatedImage(mineImg, visualXY({ x: mine.x, y: mine.y }), mine.angle);
        }
    })
    game.missiles.forEach(missile => {
        drawRotatedImage(missileImg, visualXY({ x: missile.x, y: missile.y }), missile.angle)
    }
    )
    game.enemies.forEach(enemy => {
        if (enemy instanceof rib) {
            drawRotatedImage(enemy1Img, visualXY({ x: enemy.x, y: enemy.y }), enemy.angle);
        }
        if (enemy instanceof Destroyer) {
            drawRotatedImage(destroyerImg, visualXY({ x: enemy.x, y: enemy.y }), enemy.angle);
            enemy.bullets.forEach(bullet => drawRotatedImage(bulletImg, visualXY({ x: bullet.x, y: bullet.y }), bullet.angle));
        }
        if (enemy instanceof Cruiser) {
            drawRotatedImage(cruiserImg, visualXY({ x: enemy.x, y: enemy.y }), enemy.angle);
        }
        if (enemy instanceof Submarine) {
            if (enemy.underwater) {
                drawRotatedImage(submarineUnderwaterImg, visualXY({ x: enemy.x, y: enemy.y }), enemy.angle);
            }
            else {
                drawRotatedImage(submarineImg, visualXY({ x: enemy.x, y: enemy.y }), enemy.angle);
            }
        }
        if (enemy instanceof helicopter) {
            drawRotatedImage(helicopterImg, visualXY({ x: enemy.x, y: enemy.y }), enemy.angle);
        }
        else if (enemy instanceof Airstrike) {
            if (enemy.stage == 0) {
                console.log("line");
                ctx.fillStyle = "#2d3fff";
                ctx.beginPath();
                ctx.moveTo(enemy.x, enemy.y);
                ctx.lineTo(enemy.x + Math.cos(enemy.angle) * 1000, enemy.y + Math.sin(enemy.angle) * 1000);
                ctx.stroke();
            }
            drawRotatedImage(fighterjetImg, visualXY({ x: enemy.x, y: enemy.y }), enemy.angle);
        }
    });
    if (game.player.ability instanceof ShieldAbility) {
        const tempDate = new Date();
        if (game.player.ability.available.value) {
            if (game.player.ability.active) {
                abilityLabel.textContent = "Active";
                //ctx.beginPath();
                //ctx.arc(game.player.x, game.player.y, game.player.ability.range, 0, 2 * Math.PI);
                //ctx.stroke();
                drawRotatedImage(shieldImg, visualXY({ x: game.player.x, y: game.player.y }), game.player.angle);
            }
            else if (tempDate - game.player.ability.lastActivationTime > game.player.ability.cooldown + game.player.ability.duration) {
                abilityLabel.textContent = "Ready";
            }
            else {
                abilityLabel.textContent = "Cooldown";
            }
        }
        else {
            abilityLabel.textContent = "Not Bought";
        }
    }
    if (game.player.secondaryAbility instanceof miniShield) {
        drawRotatedImage(mini_shield_auraImg, visualXY({ x: game.player.x, y: game.player.y }), 0);
    }
    function drawBoatLights(boatX, boatY, rotation) {
        lightCtx.save();
        lightCtx.translate(boatX, boatY);
        lightCtx.rotate(rotation);
        lightCtx.globalCompositeOperation = 'destination-out';

        lightCtx.beginPath();
        lightCtx.moveTo(0, 0);
        lightCtx.lineTo(100, -50);
        lightCtx.arcTo(130, 0, 100, 50, 30);
        lightCtx.lineTo(100, 50);
        lightCtx.lineTo(0, 0);
        lightCtx.closePath();
        lightCtx.fill();

        lightCtx.restore();
        lightCtx.globalCompositeOperation = 'source-over';
    }

    function fadeTime() {
        let lightOpacity = lightCycle.daylightInt();
        lightCtx.fillStyle = `rgba(0, 0, 0, ${lightOpacity})`;
        lightCtx.fillRect(0,0, canvas.width, canvas.height);
    }
    //Daylight logic, progressing time, fading lights and drawing boatlights
    lightCtx.clearRect(0, 0, Settings.window.width, Settings.window.height)
    lightCycle.progressTime();
    fadeTime();
    
    if (lightCycle.daylightInt() > 0.5) {
        drawBoatLights(game.player.x, game.player.y, game.player.angle);
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
    if (dice == 4) {
        game.enemies.push(new Cruiser(xy[0], xy[1], randomInteger(0, 6), randomDecimal(1.0, 1.5), 35, 85, 3, randomInteger(350, 550), randomInteger(2000, 3000)));
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

function updateItems() {
    let tempDate = new Date();
    game.stats.itemList.forEach(item => {
        item.update(tempDate);
        if (game.player.contact(item)) {
            if (item instanceof Coin) {
                game.stats.coins += item.value;
            }
            else if (item instanceof Heart) {
                game.player.hitPoints += 1;
            }
            else if (item instanceof Multishot) {
                game.player.weapon = new Shotgun(game.player.weapon);
                weaponLabel.textContent = "Multishot: " + game.player.weapon.multishot;
            }
            else if (item instanceof miniShield) {
                game.player.secondaryAbility = item;
                item.aquire();
            }
            item.active = false;
        }
    })
    game.stats.refreshItems();
}

function damageEnemy(enemy, damage) {
    enemy.hitPoints -= damage;
    if (enemy.hitPoints <= 0) {
        game.stats.registerKill();
        const number = randomInteger(0, 1000);
        if (number > 975 && game.player.hitPoints < 5) {
            game.stats.itemList.push(new Heart(enemy.x, enemy.y, 1));
        }
        else if (number > 957) {
            game.stats.itemList.push(new Multishot(enemy.x, enemy.y, 1));
        }
        else if (number > 900) {
            game.stats.itemList.push(new miniShield(enemy.x, enemy.y, 100, 5000, 1));
        }
        else {
            if (enemy instanceof rib) {
                game.stats.itemList.push(new Coin(enemy.x, enemy.y, 1));
            }
            else if (enemy instanceof Destroyer) {
                game.stats.itemList.push(new Coin(enemy.x, enemy.y, 1));
            }
            else if (enemy instanceof Cruiser) {
                game.stats.itemList.push(new Coin(enemy.x, enemy.y, 5));
            }
            else if (enemy instanceof Submarine) {
                game.stats.itemList.push(new Coin(enemy.x, enemy.y, 5));
            }
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
    console.log(game.missiles.length);
    game.missiles.forEach(missile => {
        missile.move({ x: game.player.x, y: game.player.y })
        // enemy hits shield.
        if (game.player.ability instanceof ShieldAbility && game.player.ability.active) {
            if (game.player.ability.contact(missile)) {
                missile.hitPoints -= 10;
            }
        }
        // enemy hits player.
        if (game.player.contact(missile)) {
            game.player.takeDamage();
            missile.hitPoints -= 1;
        }
        // enemy hits another enemy.
        game.enemies.forEach(p => {
            if (p.contact(missile) && !(p instanceof Cruiser) && !(p instanceof Submarine && p.underwater)) {
                damageEnemy(p, 1);
                missile.hitPoints -= 1;
            }
        })
        // bullet hits bullet.
        game.player.weapon.bullets.forEach(q => {
            if (missile.contact(q)) {
                missile.hitPoints -= 1;
                q.hitPoints -= 1;
            }
        })
    })
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
        // If enemy is a Cruiser, loop through all its bullets.
        else if (enemy instanceof Cruiser) {
            while (enemy.missiles.length > 0) {
                game.missiles.push(enemy.missiles.pop());
            }
        }
    });

    if (game.enemies.length <= 1) {
        for (let i = 0; i <= game.stats.level; i++) {
            spawnEnemy(250);
        }
        game.stats.level += 0.4;
    }
    game.enemies = game.enemies.filter(enemy => enemy.hitPoints > 0);
    game.mines = game.mines.filter(mine => mine.hitPoints > 0);
    game.missiles = game.missiles.filter(missile => missile.hitPoints > 0);
    let rand = randomInteger(0, 10000);
    if (rand > 9991) {
        let airY = randomInteger(150, Settings.map.height- 150);
        let airX = randomInteger(150, Settings.map.width - 150);
        let direction = randomInteger(0, 4);
        if (direction == 0) {
            airX = 0;
        }
        else if (direction == 1) {
            airX = Settings.map.width;
        }
        else if (direction == 2) {
            airY = 0;
        }
        else {
            airY = Settings.map.height;
        }
        if (randomInteger(0, 2)) {
            game.enemies.push(new Airstrike(airX, airY, calculateAngle(airX, airY, game.player.x, game.player.y), 5, 1, game, 100));
        }
        else {
            game.enemies.push(new helicopter(airX, airY, calculateAngle(airX, airY, game.player.x, game.player.y), 3, 10, game, randomInteger(1800, 3000)));
        }
    }
    /*
*/
}

function displayEndscreen() {
    continueButton.style.visibility = "visible";
    ctx.font = "50px Arial";
    ctx.fillStyle = "black";
    ctx.fillText("GAME OVER", 170, 330);
    startButtonValid = true;
    document.getElementById('button-container').style.display = "flex";
}

function visualXY(coordinates) {
    let visualX = game.visualLocation.x;
    let visualY = game.visualLocation.y;
    return { x: coordinates.x - visualX, y: coordinates.y - visualY };
}

function flooredVisualXY(coordinates) {
    let visualX = game.visualLocation.x;
    let visualY = game.visualLocation.y;
    return { x: Math.floor(coordinates.x - visualX), y: Math.floor(coordinates.y - visualY) };
}

function physicalXY(coordinates) {
    let x = 325;
    let y = 325;
    let visualX = game.visualLocation.x;
    let visualY = game.visualLocation.y;
    return { x: coordinates.x + visualX - x, y: coordinates.y + visualY - y };
}

function updateVisualLocation() {
    let changeX = game.player.x - game.visualLocation.playerX;
    let changeY = game.player.y - game.visualLocation.playerY;
    let newVisualX = game.visualLocation.x + changeX;
    let newVisualY = game.visualLocation.y + changeY;
    let margin = Settings.window.visualPadding;
    let visualPlayerPos = visualXY({ x: game.player.x, y: game.player.y });
    if (((visualPlayerPos.x < margin) && (game.player.x > margin) && (changeX < 0)) || ((visualPlayerPos.x > Settings.window.width - margin) && (game.player.x < Settings.map.width - margin) && (changeX > 0))) {
        game.visualLocation.x += changeX;
    }
    if (((visualPlayerPos.y < margin) && (game.player.y > margin) && (changeY < 0)) || ((visualPlayerPos.y > Settings.window.height - margin) && (game.player.y < Settings.map.height - margin) && (changeY > 0))) {
        game.visualLocation.y += changeY;
    }
    game.visualLocation.playerX = game.player.x;
    game.visualLocation.playerY = game.player.y;
}

function gameLoop() {
    //update player input
    game.player.update(keys);
    game.player.updateBullets();
    updateEnemies()
    updateItems();
    drawCanvas();

    healthLabel.textContent = game.player.hitPoints;
    coinsLabel.textContent = game.stats.coins;
    ammoLabel.textContent = game.player.weapon.ammo;
    killsLabel.textContent = game.stats.kills;
    info.textContent = "X: " + game.player.x + ", Y: " + game.player.y + "Visual X: " + visualXY({ x: game.player.x, y: game.player.y }).x + ", Y: " + visualXY({ x: game.player.x, y: game.player.y }).y;

    if (keys.m && keys.o && keys.n && keys.y) {
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

const lightCanvas = document.getElementById('lightsCanvas');
lightCanvas.width = canvas.width;
lightCanvas.height = canvas.height;
const lightCtx = lightCanvas.getContext('2d');


const playerImg = document.getElementById(Settings.img.player);
const cannonImg = document.getElementById(Settings.img.cannon);
const bulletImg = document.getElementById(Settings.img.bullet);
const missileImg = document.getElementById(Settings.img.missile);
const enemy1Img = document.getElementById(Settings.img.enemy1);
const destroyerImg = document.getElementById(Settings.img.destroyer);
const cruiserImg = document.getElementById(Settings.img.cruiser);
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
const multishotImg = document.getElementById(Settings.img.multishot);
const seashore_cornerImg = document.getElementById(Settings.img.seashore_corner);
const seashore_sideImg = document.getElementById(Settings.img.seashore_side);
const wavesImg = document.getElementById(Settings.img.waves);
const sea_middleImg = document.getElementById(Settings.img.sea_middle);
const fighterjetImg = document.getElementById(Settings.img.fighterjet);
const mini_shieldImg = document.getElementById(Settings.img.mini_shield);
const mini_shield_auraImg = document.getElementById(Settings.img.mini_shield_aura);
const helicopterImg = document.getElementById(Settings.img.helicopter);



const info = document.getElementById("info");
const statsContainer = document.getElementById('stats-container');
const startButton = document.getElementById("start-button");
const continueButton = document.getElementById("continue-button");
const ammoLabel = document.getElementById("ammo-value");
const healthLabel = document.getElementById("health-value");
const killsLabel = document.getElementById("kills-value");
const coinsLabel = document.getElementById("coin-value");
const abilityLabel = document.getElementById("ability-status");
const weaponLabel = document.getElementById("weapon-status");
var startButtonValid = true;
//Time Manager
let lightCycle;



// continue with same player, but new game
function continueGame() {
    game.player.hitPoints = 3;
    game.player.weapon.ammo = game.player.weapon.capacity.value;
    game.enemies.length = 0;
    game.mines.length = 0;
    game.missiles.length = 0;
    game.stats.itemList.length = 0;
    game.stats.level = 1;
    game.player.x = Settings.map.width / 2;
    game.player.y = Settings.map.height / 2;
    game.visualLocation = { x: game.player.x - Settings.window.width / 2, y: game.player.y - Settings.window.height / 2, playerX: Settings.map.width / 2, playerY: Settings.map.height / 2 },
    setupInput();
    gameLoop();
}


// create new player and game
function startGame() {
    const stats = new gameStats();
    lightCycle = new daylightCycle(10000, 3000);
    game = {
        stats: stats,
        player: new Player(Settings.map.width / 2, Settings.map.height / 2, 0, 3, Settings.sprite.width, Settings.sprite.height, 3, stats),
        statsDisplay: [],
        enemies: [],
        mines: [],
        missiles: [],
    }
    game.visualLocation = { x: game.player.x - Settings.window.width / 2, y: game.player.y - Settings.window.height / 2, playerX: Settings.map.width / 2, playerY: Settings.map.height / 2 },
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
        startButtonValid = false;
        startButton.blur();
        document.getElementById('button-container').style.display = "none";
        startGame();
    }
})

continueButton.addEventListener('click', () => {
    if (startButtonValid) {
        startButtonValid = false;
        continueButton.blur();
        document.getElementById('button-container').style.display = "none";
        continueGame();
    }
})
//starts first loop