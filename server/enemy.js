export default class Enemy {
    constructor(size, speed, area) {
        this.size = this.prevsize = size
        this.x = this.prevx = area.x + area.size / 2
        this.y = this.prevy = area.y + area.size / 2
        let angle = Math.random() * Math.PI * 2
        this.velX = this.prevvelX = Math.cos(angle) * speed;
        this.velY = this.prevvelY = Math.sin(angle) * speed;
        this.playing = this.prevplaying = false
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
        for (const property in this) {
            if (!property.includes('prev') && property != 'x' && property != 'y') {
                if (this[property] != this[`prev${property}`]) changes[property] = this[property]
                this[`prev${property}`] = this[property]
            }
        }
        return changes
    }
}