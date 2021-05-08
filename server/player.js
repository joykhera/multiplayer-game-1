class Player {
    constructor(canvas) {
        this.x = this.prevx = canvas.width / 2
        this.y = this.prevy = canvas.height / 2
        this.size = this.prevsize = 20
        this.speed = this.prevspeed = 15
        this.currentSpeed = this.prevcurrentSpeed = this.speed
        this.color = this.prevcolor = 'green'
        this.playing = this.prevplaying = false
        this.alive = this.prevalive = true
        this.time = this.prevtime = 10
    }

    update(input, area, enemies, players) {
        this.move(input)
        this.border(area)
        this.collision(enemies, players)
    }

    move(input) {
        if (input.shift && this.alive) this.currentSpeed = this.speed / 2
        else if (this.alive) this.currentSpeed = this.speed
        if (input.left) this.x -= this.currentSpeed
        if (input.right) this.x += this.currentSpeed
        if (input.up) this.y -= this.currentSpeed
        if (input.down) this.y += this.currentSpeed
    }

    border(area) {
        if (this.x - this.size < area.x) this.x = area.x + this.size
        if (this.x + this.size > area.x + area.size) this.x = area.x + area.size - this.size
        if (this.y - this.size < area.y) this.y = area.y + this.size
        if (this.y + this.size > area.y + area.size) this.y = area.y + area.size - this.size

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
            if (this.x - this.size < area.sz.x) this.x = area.sz.x - this.size
            if (this.x + this.size > area.sz.x + area.szSize) this.x = area.sz.x + area.szSize + this.size
            if (this.y - this.size < area.sz.y) this.y = area.sz.y - this.size
            if (this.y + this.size > area.sz.y + area.szSize) this.y = area.sz.y + area.szSize + this.size
        }
    }

    collision(enemies, players) {
        for (const enemy of enemies) {
            if (this.playing && (this.x - enemy.x) * (this.x - enemy.x) + (this.y - enemy.y) * (this.y - enemy.y) <= (this.size + enemy.size) * (this.size + enemy.size)) {
                this.alive = false
                this.color = 'red'
                this.currentSpeed = 0
            }
        }

        for (const player of players) {
            if (player != this && (this.x - player.x) * (this.x - player.x) + (this.y - player.y) * (this.y - player.y) <= (this.size + player.size) * (this.size + player.size)) {
                this.alive = true
                this.color = 'green'
                this.currentSpeed = this.speed
                this.time = 10
            }
        }
    }

    getChanges() {
        const changes = {}
        for (const property in this) {
            if (!property.includes('prev')) {
                if (this[property] != this[`prev${property}`]) changes[property] = this[property]
                this[`prev${property}`] = this[property]
            }
        }
        return changes
    }
}

export default Player