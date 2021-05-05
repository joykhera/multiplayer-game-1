class Player {
    constructor(canvas) {
        this.x = canvas.width / 2
        this.y = canvas.height / 2
        this.size = 20
        this.speed = 15
        this.currentSpeed = this.speed
        this.color = 'green'
        this.playing = false
        this.alive = true
        this.time = 10
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
                console.log(this.currentSpeed)
            }
        }

        for (const player in players) {
            if (players[player] != this && (this.x - players[player].x) * (this.x - players[player].x) + (this.y - players[player].y) * (this.y - players[player].y) <= (this.size + players[player].size) * (this.size + players[player].size)) {
                this.alive = true
                this.color = 'green'
                this.currentSpeed = this.speed
                this.time = 10
            }
        }
    }
}

export default Player