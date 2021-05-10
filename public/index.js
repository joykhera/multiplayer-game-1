import { players, ws, serverTick, interval, inputs, clientId, area, enemies } from './ws.js'
import input from './input.js'
import bounce from './bounce.js'
import drawDeath from './drawDeath.js'
import drawScore from './drawScore.js'
import './scaler.js'

const canvas = document.getElementById('canvas')
const ctx = canvas.getContext("2d")
window.tick = 0
let score = 0

setInterval(() => {
    if (players.get(clientId).playing && players.get(clientId).alive) score++
    else if (!players.get(clientId).alive) players.get(clientId).time--
    if (players.get(clientId).time <= 0) location.reload()
}, 1000)


function update() {
    tick++
    ctx.fillStyle = 'black'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    area.draw(ctx, players.get(clientId))
    inputs[tick] = Object.assign({}, input)
    for (const enemy of enemies) enemy.update(area, players.get(clientId), ctx)
    // bounce(enemies)
    for (const [id, player] of players) {
        if (id == clientId) player.update(inputs[tick], area, enemies, players.values(), ctx)
        else player.update(serverTick, interval, players.get(clientId), ctx)
    }
    drawScore(score, ctx)
    drawDeath(players.values(), ctx)
    console.log(tick, enemies[0])
    if (ws.readyState == 1) ws.send(msgpack.encode({ clientId, tick, input: inputs[tick] }))
    requestAnimationFrame(update)
}

export { ctx, update }