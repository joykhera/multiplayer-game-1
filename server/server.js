import express from 'express'
import expressWs from 'express-ws'
import msgpack from 'msgpack-lite'
import MainLoop from 'mainloop.js'
import { wsHandler, clients, players, area } from './ws.js'
import game from './game.js'
import bounce from './bounce.js'
import path from 'path'

const app = express()
const port = process.env.PORT || 3000
const __dirname = path.resolve();
expressWs(app)
wsHandler(app)
// app.use(express.static("public"));
// app.get('/', (req, res) => res.sendFile(path.join(__dirname, '/public/index.html')));
app.use(express.static('../public'))
app.get('/', (req, res) => res.sendFile(path.join(__dirname, '../public/index.html')))
app.ws.binaryType = "arraybuffer"
app.listen(port, () => console.log(`Server listening at http://localhost:${port}`))
let tick = 0
let interval = 50
let prevTime = Date.now()

MainLoop.setUpdate(() => {
    for (const enemy of game.enemies) enemy.move(area, Date.now() - prevTime)
    // bounce(enemies)
    game.addEnemies(players.values(), clients, area)
    prevTime = Date.now()
}).start()

setInterval(() => { for (const player of players.values()) if (!player.alive && player.time >= 0) player.time--; }, 1000)

setInterval(() => {
    const enemyChanges = game.enemies.map(enemy => enemy.getChanges())
    const playerChanges = new Map()
    for (const [id, player] of players) playerChanges.set(id, player.getChanges())
    for (const client of clients.values()) client.ws.send(msgpack.encode({ players: Array.from(playerChanges), tick, clientTick: client.tick, enemies: enemyChanges, state: 2 }))
    tick++
    if (clients.get(1)) console.log(clients.get(1).tick, game.enemies[0].x, game.enemies[0].y)
}, interval)

export default interval