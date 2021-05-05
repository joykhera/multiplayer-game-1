import express from 'express'
import expressWs from 'express-ws'
import msgpack from 'msgpack-lite'
import MainLoop from 'mainloop.js'
import { wsHandler, players, clients, area } from './ws.js'
import { enemies, addEnemies } from './addEnemies.js'
import bounce from './bounce.js'
import path from 'path'

const app = express()
const port = process.env.PORT || 3000
const __dirname = path.resolve();
expressWs(app)
wsHandler(app)
app.use(express.static('../public'))
app.get('/', (req, res) => res.sendFile(path.join(__dirname, '../public/index.html')))
app.ws.binaryType = "arraybuffer"
app.listen(port, () => console.log(`Server listening at http://localhost:${port}`))
let tick = 0
let interval = 50

MainLoop.setUpdate(() => {
    for (const enemy of enemies) enemy.move(area)
    bounce(enemies)
    addEnemies(players)
}).start()

setInterval(() => { for (const player in players) if (!players[player].alive) players[player].time-- }, 1000)

setInterval(() => {
    for (const client in clients) clients[client].ws.send(msgpack.encode({ players: Object.values(players).map(player => player.getState()), tick, clientTick: clients[client].tick, enemies: Object.values(enemies).map(enemy => enemy.getState()), state: 2 }))
    for (const client in clients) console.log('a' + msgpack.encode({ players, tick, clientTick: clients[client].tick, enemies, state: 2 }).byteLength)
    for (const client in clients) console.log('b' + msgpack.encode({ players: Object.values(players).map(player => player.getState()), tick, clientTick: clients[client].tick, enemies: Object.values(enemies).map(enemy => enemy.getState()), state: 2 }).byteLength)
    tick++
}, interval)

export default interval