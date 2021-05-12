import Player from './player.js'
import OtherPlayer from './otherPlayer.js'
import Area from './area.js'
import Enemy from './enemy.js'
import { update } from './index.js'
import bounce from './bounce.js'

const ws = new WebSocket(`${(location.protocol == 'http:') ? 'ws' : 'wss'}://${location.host}`)
ws.binaryType = "arraybuffer"
let clientId, serverTick, interval, area, players, mainPlayer, gameTick, clientTick
const inputs = {}
const enemies = []

ws.addEventListener('message', (buffer) => {
    const msg = msgpack.decode(new Uint8Array(buffer.data))

    if (msg.state == 0) {
        clientId = msg.clientId
        players = new Map(msg.players)
        interval = msg.interval
        area = new Area(msg.area)
        tick = msg.enemyTick
        // console.log(Date.now() - msg.time)
        // console.log((Date.now() - msg.time) % 16.67)
        // tick += Math.floor((Date.now() - msg.time) / 16.67)

        for (const enemy of msg.enemies) enemies.push(new Enemy(enemy))
        for (let [id, player] of players) {
            if (id == clientId) players.set(id, new Player(player))
            else players.set(id, new OtherPlayer(player))
        }
        mainPlayer = players.get(clientId)
        MainLoop.setUpdate(update).start()
    }

    else if (msg.state == 1) {
        players.set(msg.clientId, new OtherPlayer(msg.player))
    }

    else if (msg.state == 2) {
        // console.log(msg.enemyTick, tick)
        const prevEnemies = JSON.parse(JSON.stringify(enemies))
        const prevPlayer = Object.assign({}, mainPlayer)
        // console.log(players, prevPlayer)
        // console.log(buffer.data)

        serverTick = msg.tick
        gameTick = msg.enemyTick
        clientTick = msg.clientTick
        const msgPlayers = new Map(msg.players)
        // console.log(tick, msgPlayers.get(clientId))
        for (let i = 0; i < enemies.length; i++) Object.assign(enemies[i], msg.enemies[i])
        for (const [id, player] of msgPlayers) {
            const currentPlayer = players.get(id)
            if (id != clientId) {
                currentPlayer.prevX = currentPlayer.x
                currentPlayer.prevY = currentPlayer.y
            }
            Object.assign(currentPlayer, player)
        }
        for (let i = msg.gameTick; i < tick; i++) {
            for (const enemy of enemies) enemy.move(area, 16.67)
        }
        for (let i = msg.clientTick; i < tick; i++) {
            if (inputs[i + 1]) mainPlayer.move(inputs[i + 1], area, enemies, players.values())
        }
        // if (enemies[1].x != prevEnemies[1].x || enemies[1].y != prevEnemies[1].y) console.log('error')
        if (mainPlayer.x != prevPlayer.x || mainPlayer.y != prevPlayer.y) console.log('error', gameTick, msgPlayers.get(clientId), tick, prevPlayer)
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

export { players, ws, serverTick, interval, inputs, clientId, area, enemies, mainPlayer, gameTick, clientTick }