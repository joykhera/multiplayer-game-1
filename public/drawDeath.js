export default function drawDeath(players, ctx) {
    if (Object.values(players).filter(player => player.alive == false).length) {
        ctx.fillStyle = 'red'
        ctx.font = "20px Arial"
        ctx.textAlign = "center"
        ctx.fillText(`Someone is dead`, canvas.width / 2, 100)
    }
}