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
            this.interval = setInterval(() => {
                const newEnemy = new Enemy(Math.random() * this.size + 5, Math.random() * this.speed + 1, area)
                this.enemies.push(newEnemy)
                for (const client of clients.values()) client.ws.send(msgpack.encode({ newEnemy, state: 4 }))
                this.size++
                this.speed += 0.1
                this.enemiesAdded++
                this.intervalTime += 100
            }, this.intervalTime)
            this.intervalSet = true
        }

        else if (!this.playing && this.enemies.length != this.enemyNum) {
            this.enemies.splice(this.enemyNum, this.enemiesAdded)
            this.size = 15
            this.speed = 5
            this.intervalTime = 3000
            clearInterval(this.interval)
            this.intervalSet = false
            for (const client of clients.values()) client.ws.send(msgpack.encode({ enemyNum: this.enemyNum, enemiesAdded: this.enemiesAdded, state: 5 }))
        }
    }
}
export default game