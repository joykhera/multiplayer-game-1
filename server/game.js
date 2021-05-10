import Enemy from "./enemy.js"
import msgpack from 'msgpack-lite'

const game = {
    enemyNum: 5,
    enemies: [],
    size: 15,
    speed: 5,
    enemiesAdded: 0,
    playing: false,
    intervalSet: false,
    interval: null,
    intervalTime: 3000,

    addEnemies(players, clients, area) {
        this.playing = false
        for (const player of players) if (player.playing) this.playing = true
        if (this.playing && !this.intervalSet) {
            function interval(game) {
                const newEnemy = new Enemy(Math.random() * game.size + 5, Math.random() * game.speed + 1, area)
                game.enemies.push(newEnemy)
                for (const client of clients.values()) client.ws.send(msgpack.encode({ newEnemy, state: 4 }))
                game.size++
                game.speed += 0.1
                game.enemiesAdded++
                game.intervalTime += 100
                game.interval = setTimeout(() => interval(game), game.intervalTime)
            }
            setTimeout(() => interval(this), this.intervalTime)
            this.intervalSet = true
        }

        else if (!this.playing && this.enemies.length != this.enemyNum) {
            this.enemies.splice(this.enemyNum, this.enemiesAdded)
            this.size = 15
            this.speed = 5
            this.intervalTime = 3000
            clearTimeout(this.interval)
            this.intervalSet = false
            for (const client of clients.values()) client.ws.send(msgpack.encode({ enemyNum: this.enemyNum, enemiesAdded: this.enemiesAdded, state: 5 }))
        }
    }
}
export default game