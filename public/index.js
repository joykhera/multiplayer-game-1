import { players, ws, serverTick, interval, inputs, clientId, area, enemies, mainPlayer } from './ws.js'
import input from './input.js'
import bounce from './bounce.js'
import drawDeath from './drawDeath.js'
import drawScore from './drawScore.js'
import './scaler.js'

const canvas = document.getElementById('canvas'), ctx = canvas.getContext("2d")
let tick = 0, score = 0, timeLeft
window.enemyTick = 0

setInterval(() => {
    if (mainPlayer.playing && mainPlayer.alive) score++
    else if (!mainPlayer.alive) mainPlayer.time--
    if (mainPlayer.time <= 0) location.reload()
}, 1000)

function update() {
    tick++
    enemyTick++
    ctx.fillStyle = 'black'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    area.draw(ctx, mainPlayer)
    inputs[tick] = Object.assign({}, input)
    for (const enemy of enemies) enemy.update(area, mainPlayer, ctx)
    for (const [id, player] of players) id == clientId ? player.update(inputs[tick], area, enemies, players.values(), ctx) : player.update(serverTick, interval, mainPlayer, ctx)
    drawScore(score, ctx)
    drawDeath(players.values(), ctx)
    if (ws.readyState == 1) ws.send(msgpack.encode({ clientId, tick, input: inputs[tick] }))
}

document.addEventListener("visibilitychange", event => {
    if (document.visibilityState == "visible") {
        if (timeLeft) enemyTick += Math.ceil((Date.now() - timeLeft) / 16.67)
        MainLoop.setUpdate(update).start()
    }
    else {
        MainLoop.stop()
        timeLeft = Date.now()
    }
})

export { update, tick }