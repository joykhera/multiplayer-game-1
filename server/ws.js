import msgpack from 'msgpack-lite'
import Area from './area.js'
import Player from './player.js'
import { interval, enemyTick } from './server.js'
import game from './game.js'
import Enemy from './enemy.js'

let clientId = 0
const clients = new Map(), players = new Map(), canvas = { width: 1600, height: 900 }, area = new Area(canvas)
for (let i = 0; i < game.enemyNum; i++) game.enemies.push(new Enemy(15, 5, area))

function wsHandler(app) {
    app.ws('/', (ws) => {
        clientId++
        const client = { id: clientId, ws, tick: 0 }, player = new Player(canvas)
        clients.set(clientId, client)
        players.set(clientId, player)

        for (const [id, client] of clients) id == clientId ? client.ws.send(msgpack.encode({ players: Array.from(players), clientId, area, interval, enemies: game.enemies, enemyTick, time: Date.now(), state: 0 })) : client.ws.send(msgpack.encode({ clientId, player, state: 1 }))

        ws.on('message', (buffer) => {
            const msg = msgpack.decode(buffer)
            clients.get(msg.clientId).tick = msg.tick
            players.get(msg.clientId).update(msg.input, area, game.enemies, players.values())
        })

        ws.on('close', () => {
            client.ws.close()
            client.ws.removeAllListeners()
            clients.delete(client.id)
            players.delete(client.id)
            for (const otherClient of clients.values()) otherClient.ws.send(msgpack.encode({ clientId: client.id, state: 3 }))
        })
    })
}

export { wsHandler, clients, players, area }