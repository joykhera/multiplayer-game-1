import msgpack from 'msgpack-lite'
import Area from './area.js'
import Player from './player.js'
import interval from './server.js'
import game from './game.js'
import Enemy from './enemy.js'

let clientId = 0
const clients = {}
const players = {}
const canvas = { width: 1600, height: 900 }
const area = new Area(canvas)
for (let i = 0; i < game.enemyNum; i++) game.enemies.push(new Enemy(15, 5, area))

function wsHandler(app) {
    app.ws('/', (ws) => {
        clientId++
        const client = { id: clientId, ws, tick: 0 }
        clients[client.id] = client
        players[clientId] = new Player(canvas)

        for (const client in clients) {
            if (client == clientId) clients[client].ws.send(msgpack.encode({ players, state: 0, clientId, area, interval, enemies: game.enemies }))
            else clients[client].ws.send(msgpack.encode({ clientId, player: players[clientId], state: 1 }))
        }

        ws.on('message', (buffer) => {
            const msg = msgpack.decode(buffer)
            clients[msg.clientId].tick = msg.tick
            players[msg.clientId].update(msg.input, area, game.enemies, players)
        })

        ws.on('close', () => {
            clients[client.id].ws.close()
            clients[client.id].ws.removeAllListeners()

            delete clients[client.id]
            delete players[client.id]

            for (const c in clients) clients[c].ws.send(msgpack.encode({ playerId: client.id, state: 3 }))
        })
    })
}

export { wsHandler, players, clients, area }