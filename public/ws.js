import Player from './player.js'
import OtherPlayer from './otherPlayer.js'
import Area from './area.js'
import Enemy from './enemy.js'
import { update, tick } from './index.js'
import bounce from './bounce.js'

const ws = new WebSocket(`${(location.protocol == 'http:') ? 'ws' : 'wss'}://${location.host}`)
ws.binaryType = "arraybuffer"
let clientId, serverTick, interval, area, players, mainPlayer
const inputs = {}
const enemies = []

ws.addEventListener('message', (buffer) => {
    const msg = msgpack.decode(new Uint8Array(buffer.data))

    if (msg.state == 0) {
        clientId = msg.clientId
        players = new Map(msg.players)
        interval = msg.interval
        area = new Area(msg.area)
        enemyTick = msg.enemyTick
        enemyTick += Math.floor((Date.now() - msg.time) / 16.67)

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
        // console.log(buffer.data)
        // console.log(msg.enemyTick, msg.enemies[0], enemyTick, enemies[0])
        // const prevPlayer = Object.assign({}, mainPlayer)
        // const prevEnemies = JSON.parse(JSON.stringify(enemies))
        serverTick = msg.tick
        const msgPlayers = new Map(msg.players)

        for (let i = 0; i < enemies.length; i++) Object.assign(enemies[i], msg.enemies[i])
        for (const [id, player] of msgPlayers) {
            const currentPlayer = players.get(id)
            if (id != clientId) {
                currentPlayer.prevX = currentPlayer.x
                currentPlayer.prevY = currentPlayer.y
            }
            Object.assign(currentPlayer, player)
        }
        for (let i = msg.clientTick; i < tick; i++) mainPlayer.move(inputs[i + 1], area, enemies, players.values())
        for (let i = msg.enemyTick; i < enemyTick; i++) for (const enemy of enemies) enemy.move(area, 16.67)
        // if (enemies[0].x != prevEnemies[0].x || enemies[0].y != prevEnemies[0].y) console.log('error')
        // if (prevPlayer.x != mainPlayer.x || prevPlayer.y != mainPlayer.y) console.log('error')
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

export { players, ws, serverTick, interval, inputs, clientId, area, enemies, mainPlayer }