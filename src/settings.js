//const canvas = document.getElementById("gameCanvas");

export const Settings = {
    window: {
        width: 600,
        height: 600,
        margin: 25
    },
    sprite: {
        width: 50,
        height: 50
    },
    img: {
        player: "jolle",
        cannon: "cannon",
        bullet: "missile",
        enemy1: "enemyJolle",
        destroyer: "destroyer",
        coin_1: "coin1"
    },
    render: {
        delay: 50 // milliseconds
    }
}

export default Object.freeze(Settings)