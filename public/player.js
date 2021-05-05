class Player {
    constructor(player) {
        this.x = player.x
        this.y = player.y
        this.size = player.size
        this.speed = player.speed
        this.color = player.color
        this.playing = player.playing
        this.alive = player.alive
        this.time = player.time
        // this.name = prompt("Please enter a username")
    }

    update(input, area, enemies, players, ctx) {
        this.move(input, area, enemies, players, ctx)
        this.draw(ctx)
    }

    move(input, area, enemies, players, ctx) {
        if (input.left) this.x -= this.speed
        if (input.right) this.x += this.speed
        if (input.up) this.y -= this.speed
        if (input.down) this.y += this.speed
        this.border(area)
        this.collision(enemies, players, ctx)
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

    collision(enemies, players, ctx) {
        for (const enemy of enemies) {
            if (this.playing && (this.x - enemy.x) * (this.x - enemy.x) + (this.y - enemy.y) * (this.y - enemy.y) <= (this.size + enemy.size) * (this.size + enemy.size)) {
                this.alive = false
                this.color = 'red'
                this.speed = 0
            }
        }

        for (const player in players) {
            if (players[player] != this && (this.x - players[player].x) * (this.x - players[player].x) + (this.y - players[player].y) * (this.y - players[player].y) <= (this.size + players[player].size) * (this.size + players[player].size)) {
                this.alive = true
                this.color = 'green'
                this.speed = 15
                this.time = 10
            }
        }

        if (!this.alive) {
            ctx.font = "20px Arial";
            ctx.fillStyle = 'red'
            ctx.textAlign = "center";
            ctx.fillText(`${this.time}`, canvas.width / 2, canvas.height / 2 - this.size - 10)
        }
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.fillStyle = this.color
        ctx.arc(canvas.width / 2, canvas.height / 2, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();

        // ctx.font = "20px Arial";
        // ctx.textAlign = "center";
        // ctx.fillText(`${this.name}`, canvas.width / 2, canvas.height / 2 - this.size - 10)
    }
}

export default Player
