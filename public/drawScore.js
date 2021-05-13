export default function drawScore(score, ctx) {
    ctx.fillStyle = 'red'
    ctx.font = "50px Arial"
    ctx.textAlign = "center"
    ctx.fillText(`Score: ${score}`, canvas.width / 2, 50)
}