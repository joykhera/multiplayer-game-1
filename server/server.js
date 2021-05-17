import express from 'express'
import expressWs from 'express-ws'
import msgpack from 'msgpack-lite'
import MainLoop from 'mainloop.js'
import { wsHandler, clients, players, area } from './ws.js'
import game from './game.js'
import bounce from './bounce.js'
import path from 'path'

const app = express(), port = process.env.PORT || 3000, __dirname = path.resolve();
expressWs(app)
wsHandler(app)
// app.use(express.static("public"));
// app.get('/', (req, res) => res.sendFile(path.join(__dirname, '/public/index.html')));
// app.listen(port, () => console.log(`Server listening at http://localhost:${port}`))
app.use(express.static('../public'))
    .get('/', (req, res) => res.sendFile(path.join(__dirname, '../public/index.html')))
    .listen(port, () => console.log(`Server listening at http://localhost:${port}`))
app.ws.binaryType = "arraybuffer"
let tick = 0, enemyTick = 0, interval = 40

MainLoop.setUpdate(() => {
    enemyTick++
    for (const player of players.values()) player.collision(game.enemies, players.values())
    for (const enemy of game.enemies) enemy.move(area)
    // bounce(enemies)
    game.addEnemies(players.values(), clients, area)
}).start()

setInterval(() => { for (const player of players.values()) if (!player.alive && player.time >= 0) player.time--; }, 1000)

setInterval(() => {
    const enemyState = game.enemies.map(enemy => enemy.getState()), playerChanges = []
    for (const [id, player] of players) playerChanges.push([id, player.getChanges()])
    for (const client of clients.values()) client.ws.send(msgpack.encode({ players: playerChanges, tick, clientTick: client.tick, enemies: enemyState, enemyTick, state: 2 }))
    tick++
}, interval)

export { interval, enemyTick }