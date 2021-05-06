export default class Enemy {
    constructor(size, speed, area) {
        this.size = this.prevSize = size
        this.x = this.prevX = area.x + area.size / 2
        this.y = this.prevY = area.y + area.size / 2
        let angle = Math.random() * Math.PI * 2
        this.velX = this.prevVelX = Math.cos(angle) * speed;
        this.velY = this.prevVelY = Math.sin(angle) * speed;
        this.playing = this.prevPlaying = false
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

    getChanges() {
        const changes = {}
        if (this.x != this.prevX) changes.x = this.x
        if (this.y != this.prevY) changes.y = this.y
        if (this.size != this.prevSize) changes.size = this.size
        if (this.velX != this.prevVelX) changes.velX = this.velX
        if (this.velY != this.prevVelY) changes.velY = this.velY
        if (this.playing != this.prevPlaying) changes.playing = this.playing

        this.prevX = this.x
        this.prevY = this.y
        this.prevSize = this.size
        this.prevVelX = this.velX
        this.prevVelY = this.velY
        this.prevPlaying = this.playing
        return changes
    }
}