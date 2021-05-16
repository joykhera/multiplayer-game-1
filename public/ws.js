import Player from './player.js'
import OtherPlayer from './otherPlayer.js'
import Area from './area.js'
import Enemy from './enemy.js'
import { update, tick } from './index.js'
import bounce from './bounce.js'

const ws = new WebSocket(`${(location.protocol == 'http:') ? 'ws' : 'wss'}://${location.host}`)
ws.binaryType = "arraybuffer"
let clientId, serverTick, interval, area, players, mainPlayer
const inputs = {}, enemies = []

ws.addEventListener('message', (buffer) => {
    const msg = msgpack.decode(new Uint8Array(buffer.data))
    switch (msg.state) {
        case 0:
            clientId = msg.clientId
            players = new Map(msg.players)
            interval = msg.interval
            area = new Area(msg.area)
            enemyTick = msg.enemyTick
            for (const enemy of msg.enemies) enemies.push(new Enemy(enemy))
            for (let i = 0; i < Math.ceil((Date.now() - msg.time) / 16.666 + 1); i++) {
                for (const enemy of enemies) enemy.move(area)
                enemyTick++
            }
            for (const [id, player] of players) id == clientId ? players.set(id, new Player(player)) : players.set(id, new OtherPlayer(player))
            mainPlayer = players.get(clientId)
            MainLoop.setUpdate(update).start()
            break

        case 1:
            players.set(msg.clientId, new OtherPlayer(msg.player))
            break

        case 2:
            // console.log(buffer.data)
            console.log(msg.enemyTick, enemyTick)
            serverTick = msg.tick
            const msgPlayers = new Map(msg.players)

            for (let i = 0; i < enemies.length; i++) Object.assign(enemies[i], msg.enemies[i])
            if (msg.enemyTick > enemyTick) console.log('no assign')
            for (const [id, player] of msgPlayers) {
                const currentPlayer = players.get(id)
                if (id != clientId) {
                    currentPlayer.prevX = currentPlayer.x
                    currentPlayer.prevY = currentPlayer.y
                }
                Object.assign(currentPlayer, player)
            }
            for (let i = msg.clientTick; i < tick; i++) mainPlayer.move(inputs[i + 1], area, enemies, players.values())
            for (let i = msg.enemyTick; i < enemyTick; i++) for (const enemy of enemies) enemy.move(area)
            for (const tick in inputs) if (tick < msg.clientTick) delete inputs[tick]
            break

        case 3:
            players.delete(msg.clientId)
            break

        case 4:
            enemies.push(new Enemy(msg.newEnemy))
            break

        case 5:
            enemies.splice(msg.enemyNum, msg.enemiesAdded)
            break
    }
})

export { players, ws, serverTick, interval, inputs, clientId, area, enemies, mainPlayer }