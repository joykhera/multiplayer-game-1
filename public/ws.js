import Player from './player.js'
import OtherPlayer from './otherPlayer.js'
import Area from './area.js'
import Enemy from './enemy.js'
import { ctx, update } from './index.js'
import bounce from './bounce.js'

const ws = new WebSocket(`${(location.protocol == 'http:') ? 'ws' : 'wss'}://${location.host}`)
ws.binaryType = "arraybuffer"
let clientId, serverTick, interval, area
let players
const inputs = {}
const enemies = []

ws.addEventListener('message', (buffer) => {
    const msg = msgpack.decode(new Uint8Array(buffer.data))

    if (msg.state == 0) {
        clientId = msg.clientId
        players = new Map(msg.players)
        interval = msg.interval
        area = new Area(msg.area)
        for (const enemy of msg.enemies) enemies.push(new Enemy(enemy))
        for (let [id, player] of players) {
            if (id == clientId) players.set(id, new Player(player))
            else players.set(id, new OtherPlayer(player))
        }
        update()
    }

    else if (msg.state == 1) {
        players.set(msg.clientId, new OtherPlayer(msg.player))
    }

    else if (msg.state == 2) {
        console.log(buffer.data)
        serverTick = msg.tick
        const msgPlayers = new Map(msg.players)
        for (let i = 0; i < enemies.length; i++) Object.assign(enemies[i], msg.enemies[i])
        for (const [id, player] of msgPlayers) {
            if (id != clientId) {
                players.get(id).prevX = players.get(id).x
                players.get(id).prevY = players.get(id).y
            }
            Object.assign(players.get(id), player)
        }

        if (tick > msg.clientTick + 1) for (let i = msg.clientTick + 1; i < tick; i++) {
            players.get(clientId).move(inputs[i], area, enemies, players.values(), ctx)
            for (const enemy of enemies) enemy.move(area)
            // bounce(enemies)
        }
        for (const tick in inputs) if (tick < msg.clientTick) delete inputs[tick]
    }

    else if (msg.state == 3) {
        players.delete(msg.clientId)
    }

    else if (msg.state == 4) {
        enemies.push(new Enemy(msg.newEnemy))
    }

    else if (msg.state == 5) {
        enemies.splice(msg.enemyNum, msg.enemiesAdded)
    }
})

export { players, ws, serverTick, interval, inputs, clientId, area, enemies }