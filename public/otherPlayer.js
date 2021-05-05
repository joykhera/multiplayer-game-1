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

    update(ctx, tick, interval, player) {
        this.move(tick, interval)
        this.draw(ctx, player)
    }

    move(tick, interval) {
        if (this.currentTick !== tick) {
            this.lerpTime = 0
            this.currentTick = tick
        }
        else this.lerpTime += (1000 / interval) / 60

        this.curX = lerp(this.prevX, this.x, this.lerpTime)
        this.curY = lerp(this.prevY, this.y, this.lerpTime)
    }

    draw(ctx, player) {
        ctx.beginPath();
        ctx.arc(this.curX - player.x + canvas.width / 2, this.curY - player.y + canvas.height / 2, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color
        ctx.fill();
        ctx.closePath();

        if (!this.alive) {
            ctx.font = "20px Arial";
            ctx.fillStyle = 'red'
            ctx.textAlign = "center";
            ctx.fillText(`${this.time}`, this.curX - player.x + canvas.width / 2, this.curY - player.y + canvas.height / 2 - this.size - 10)
        }
        else this.color = 'green'
    }
}