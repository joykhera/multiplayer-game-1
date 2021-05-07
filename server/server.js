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
    // bounce(enemies)
    addEnemies(players)
}).start()

setInterval(() => { for (const player in players) if (!players[player].alive) players[player].time-- }, 1000)

setInterval(() => {
    const enemyChanges = enemies.map(enemy => enemy.getChanges())
    // if (clients[1]) console.log(clients[1].tick, enemyChanges[0])
    for (const client in clients) clients[client].ws.send(msgpack.encode({ players, tick, clientTick: clients[client].tick, enemies: enemyChanges, state: 2 }))
    tick++
}, interval)

export default interval