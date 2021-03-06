function lerp(start, end, time) {
    return (1 - time) * start + time * end
}

export default class OtherPlayer {
    constructor(player) {
        this.prevX = player.x
        this.prevY = player.y
        this.curX = player.x
        this.curY = player.y
        this.x = player.x
        this.y = player.y
        this.size = player.size
        this.speed = player.speed
        this.color = player.color
        this.time = player.time
        this.alive = player.alive
        this.playing = player.playing
        this.lerpTime = 0
        this.currentTick = 0
    }

    update(tick, interval, mainPlayer, ctx) {
        this.move(tick, interval)
        this.draw(mainPlayer, ctx)
    }

    move(tick, interval) {
        if (this.currentTick != tick) {
            this.lerpTime = 0
            this.currentTick = tick
        }
        else this.lerpTime += (1000 / interval) / 60

        this.curX = lerp(this.prevX, this.x, this.lerpTime)
        this.curY = lerp(this.prevY, this.y, this.lerpTime)
    }

    draw(mainPlayer, ctx) {
        ctx.beginPath()
        ctx.arc(this.curX - mainPlayer.x + canvas.width / 2, this.curY - mainPlayer.y + canvas.height / 2, this.size, 0, Math.PI * 2)
        ctx.fillStyle = this.color
        ctx.fill()
        ctx.closePath()

        if (!this.alive) {
            ctx.font = "20px Arial"
            ctx.fillStyle = 'red'
            ctx.textAlign = "center"
            ctx.fillText(`${this.time}`, this.curX - mainPlayer.x + canvas.width / 2, this.curY - mainPlayer.y + canvas.height / 2 - this.size - 10)

            ctx.lineWidth = 5
            ctx.strokeStyle = 'red'
            ctx.beginPath()
            ctx.moveTo(canvas.width / 2, canvas.height / 2)
            ctx.lineTo(this.x - mainPlayer.x + canvas.width / 2, this.y - mainPlayer.y + canvas.height / 2)
            ctx.stroke()
        }
        else this.color = 'green'
    }
}