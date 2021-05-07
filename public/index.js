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
let onTab = true

setInterval(() => {
    if (players[clientId].playing && players[clientId].alive) score++
    if (players[clientId].time <= 0) location.reload()
}, 1000)


function update() {
    if (onTab && players[clientId]) {
        inputs[tick] = Object.assign({}, input)
        for (const enemy of enemies) enemy.move(area)
        // bounce(enemies)
        for (const player in players) {
            if (player == clientId) players[player].update(inputs[tick], area, enemies, players)
            else players[player].move(serverTick, interval)
        }

        ws.send(msgpack.encode({ clientId, tick, input: inputs[tick] }))

        tick++
        draw()
    }
    requestAnimationFrame(update)
}

function draw() {
    ctx.fillStyle = 'black'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    area.draw(ctx, players[clientId])
    for (const enemy of enemies) enemy.draw(players[clientId], ctx)
    for (const player in players) players[player].draw(ctx, players[clientId])
    drawScore(score, ctx)
    drawDeath(players, clientId, ctx)
}

document.addEventListener("visibilitychange", event => {
    if (document.visibilityState == "visible") onTab = true
    else onTab = false
})

setInterval(() => { console.log(tick) }, 1000)
export { ctx, update }