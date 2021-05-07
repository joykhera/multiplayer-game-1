import Player from './player.js'
import OtherPlayer from './otherPlayer.js'
import Area from './area.js'
import Enemy from './enemy.js'
import { ctx, update } from './index.js'
import bounce from './bounce.js'

const ws = new WebSocket(`${(location.protocol == 'http:') ? 'ws' : 'wss'}://${location.host}`)
ws.binaryType = "arraybuffer"
let clientId, serverTick, interval, area
let players = {}
const inputs = {}
const enemies = []

ws.addEventListener('message', (buffer) => {
    const msg = msgpack.decode(new Uint8Array(buffer.data))

    if (msg.state == 0) {
        // console.log(msg.players)
        clientId = msg.clientId
        players = msg.players
        interval = msg.interval
        area = new Area(msg.area)
        for (const enemy of msg.enemies) enemies.push(new Enemy(enemy))

        for (const player in players) {
            if (player == clientId) players[player] = new Player(players[player])
            else players[player] = new OtherPlayer(players[player])
        }
        update()
    }

    else if (msg.state == 1) {
        players[msg.clientId] = new OtherPlayer(msg.player)
    }

    else if (msg.state == 2) {
        // console.log(msg.clientTick, tick)
        // console.log(msg.tick, msg.enemies[0])
        // console.log(enemies[0])
        serverTick = msg.tick
        for (let i = 0; i < enemies.length; i++) Object.assign(enemies[i], msg.enemies[i])
        for (const player in msg.players) {
            if (player != clientId) {
                players[player].prevX = players[player].x
                players[player].prevY = players[player].y
            }
            Object.assign(players[player], msg.players[player])
        }
        // console.log(tick)
        if (tick > msg.clientTick + 1) for (let i = msg.clientTick + 1; i < tick; i++) {
            players[clientId].move(inputs[i], area, enemies, players, ctx)
            for (const enemy of enemies) enemy.move(area)
            // bounce(enemies)
        }
        // console.log(enemies[0])
        for (const tick in inputs) if (tick < msg.clientTick) delete inputs[tick]
    }

    else if (msg.state == 3) {
        delete players[msg.playerId]
    }

    else if (msg.state == 4) {
        enemies.push(new Enemy(msg.newEnemy))
    }

    else if (msg.state == 5) {
        enemies.splice(msg.enemyNum, msg.enemiesAdded)
    }
})

export { players, ws, serverTick, interval, inputs, clientId, area, enemies }