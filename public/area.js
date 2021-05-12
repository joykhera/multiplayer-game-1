export default class Area {
    constructor(area) {
        this.size = area.size
        this.szSize = area.szSize
        this.x = area.x
        this.y = area.y
        this.color = 'white'
        this.sz = area.sz
        this.sz.color = 'gray'
    }

    draw(ctx, player) {
        ctx.beginPath()
        ctx.fillStyle = this.color
        ctx.fillRect(this.x - player.x + canvas.width / 2, this.y - player.y + canvas.height / 2, this.size, this.size)
        ctx.closePath()

        ctx.beginPath()
        ctx.fillStyle = this.sz.color
        ctx.fillRect(this.sz.x - player.x + canvas.width / 2, this.sz.y - player.y + canvas.height / 2, this.szSize, this.szSize)
        ctx.closePath()
    }
}