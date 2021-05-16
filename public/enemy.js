export default class Enemy {
    constructor(enemy) {
        this.x = enemy.x
        this.y = enemy.y
        this.size = enemy.size
        this.color = 'black'
        this.velX = enemy.velX
        this.velY = enemy.velY
        this.playing = enemy.playing
    }

    update(area, mainPlayer, ctx) {
        this.move(area)
        this.draw(mainPlayer, ctx)
    }

    move(area) {
        this.x += this.velX
        this.y += this.velY

        if (this.x - this.size < area.x || this.x + this.size > area.x + area.size) this.velX *= -1
        if (this.y - this.size < area.y || this.y + this.size > area.y + area.size) this.velY *= -1

        if (
            this.x + this.size < area.sz.x ||
            this.x - this.size > area.sz.x + area.szSize ||
            this.y + this.size < area.sz.y ||
            this.y - this.size > area.sz.y + area.szSize
        ) this.playing = true

        if (
            this.playing &&
            this.x - this.size < area.sz.x + area.szSize &&
            this.x + this.size > area.sz.x &&
            this.y - this.size < area.sz.y + area.szSize &&
            this.y + this.size > area.sz.y
        ) {
            if (this.x - this.size < area.sz.x || this.x + this.size > area.sz.x + area.szSize) this.velX *= -1
            if (this.y - this.size < area.sz.y || this.y + this.size > area.sz.y + area.szSize) this.velY *= -1
        }
    }

    draw(mainPlayer, ctx) {
        ctx.beginPath()
        ctx.fillStyle = this.color
        ctx.arc(this.x - mainPlayer.x + canvas.width / 2, this.y - mainPlayer.y + canvas.height / 2, this.size, 0, Math.PI * 2)
        ctx.fill()
        ctx.closePath()
    }
}