import Enemy from "./enemy.js"
import { clients, area } from './ws.js'
import msgpack from 'msgpack-lite'

const enemyNum = 5
const enemies = []
let size = 15
let speed = 5
let enemiesAdded = 0
let playing = false
let intervalSet = false
let interval

function addEnemies(players) {
    playing = false
    for (const player in players) if (players[player].playing) playing = true

    if (playing && !intervalSet) {
        interval = setInterval(() => {
            const newEnemy = new Enemy(Math.random() * size + 5, Math.random() * speed + 1, area)
            enemies.push(newEnemy)
            for (const client in clients) clients[client].ws.send(msgpack.encode({ newEnemy, state: 4 }))

            size++
            speed += 0.25
            enemiesAdded++
        }, 5000)
        intervalSet = true
    }

    else if (!playing && enemies.length != enemyNum) {
        enemies.splice(enemyNum, enemiesAdded)
        clearInterval(interval)
        intervalSet = false
        for (const client in clients) clients[client].ws.send(msgpack.encode({ enemyNum, enemiesAdded, state: 5 }))
    }
}


export { enemies, enemyNum, addEnemies }
