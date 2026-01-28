//const canvas = document.getElementById("gameCanvas");

export const Settings = {
    window: {
        width: 650,
        height: 650,
        margin: 25,
        visualPadding: 150
    },
    map: {
        width: 1950,
        height: 1950,
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
        missile: "cruise_missile",
        enemy1: "enemyJolle",
        destroyer: "destroyer",
        cruiser: "cruiser",
        coin_1: "coin1",
        coin_5: "coin5",
        submarine: "submarine",
        submarineUnderwater: "submarine_underwater",
        mine: "mine",
        mineRed: "mine_red",
        explosion75: "explosion75",
        heart: "heart",
        skull: "skull",
        shield: "shield",
        multishot: "multishot",
        seashore_side: "seashore_side_bigger",
        seashore_corner: "seashore_corner_bigger",
        sea_middle: "sea_middle",
        fighterjet: "fighterjet",
        mini_shield: "mini_shield",
        mini_shield_aura: "miniShieldAura",
        helicopter: "helicopter",
        waves: "waves_bigger",
    }
}

export default Object.freeze(Settings)