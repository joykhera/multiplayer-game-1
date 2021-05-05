import { players, ws, serverTick, interval, inputs, clientId, area, enemies } from './ws.js'
import input from './input.js'
import bounce from './bounce.js'
import './scaler.js'

const canvas = document.getElementById('canvas')
const ctx = canvas.getContext("2d")
window.tick = 0
let score = 0

setInterval(() => {
    if (players[clientId].playing && players[clientId].alive) score++
    if (players[clientId].time <= 0) location.reload()
}, 1000)

MainLoop.setUpdate(() => {
    ctx.fillStyle = 'black'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    inputs[tick] = Object.assign({}, input)

    if (ws.readyState == 1 && players[clientId]) {
        area.draw(ctx, players[clientId])
        for (const enemy of enemies) enemy.update(area, players[clientId], ctx)
        bounce(enemies)

        for (const player in players) {
            if (player == clientId) players[player].update(inputs[tick], area, enemies, players, ctx)
            else players[player].update(ctx, serverTick, interval, players[clientId])
        }

        ctx.fillStyle = 'red'
        ctx.font = "50px Arial";
        ctx.textAlign = "center";
        ctx.fillText(`Score: ${score}`, canvas.width / 2, 50)

        if (Object.values(players).find(player => player.alive == false)) {
            ctx.fillStyle = 'red'
            ctx.font = "20px Arial";
            ctx.textAlign = "center";
            ctx.fillText(`Someone is dead`, canvas.width / 2, 100)
        }

        ws.send(msgpack.encode({ clientId, tick, input: inputs[tick] }))
    }

    tick++
}).start()

export default ctx