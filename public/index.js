import { players, ws, serverTick, interval, inputs, clientId, area, enemies, mainPlayer } from './ws.js'
import input from './input.js'
import bounce from './bounce.js'
import drawDeath from './drawDeath.js'
import drawScore from './drawScore.js'
import './scaler.js'

const canvas = document.getElementById('canvas')
const ctx = canvas.getContext("2d")
let tick = 0
let score = 0
window.enemyTick = 0
let prevTime = Date.now()

setInterval(() => {
    if (mainPlayer.playing && mainPlayer.alive) score++
    else if (!mainPlayer.alive) mainPlayer.time--
    // if (mainPlayer.time <= 0) location.reload()
}, 1000)


function update() {
    tick++
    enemyTick++
    ctx.fillStyle = 'black'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    area.draw(ctx, mainPlayer)
    inputs[tick] = Object.assign({}, input)
    for (const enemy of enemies) enemy.update(area, Date.now() - prevTime, mainPlayer, ctx)
    // bounce(enemies)
    for (const [id, player] of players) {
        if (id == clientId) player.update(inputs[tick], area, enemies, players.values(), ctx)
        else player.update(serverTick, interval, mainPlayer, ctx)
    }
    drawScore(score, ctx)
    drawDeath(players.values(), ctx)
    if (ws.readyState == 1) ws.send(msgpack.encode({ clientId, tick, input: inputs[tick] }))
    prevTime = Date.now()
    // console.log(enemyTick, enemies[0].x, enemies[0].y)
}

let timeLeft
document.addEventListener("visibilitychange", event => {
    console.log('visibilitychange')
    prevTime = Date.now()
    if (document.visibilityState == "visible") {
        if (timeLeft) enemyTick += Math.floor((Date.now() - timeLeft) / 16.67)
        MainLoop.setUpdate(update).start()
    }
    else {
        MainLoop.stop()
        timeLeft = Date.now()
    }
})

export { update, tick }