export default class Area {
    constructor(canvas) {
        this.size = 1500
        this.szSize = 100
        this.x = canvas.width / 2 - this.size / 2
        this.y = canvas.height / 2 - this.size / 2
        this.sz = {
            x: canvas.width / 2 - this.szSize / 2,
            y: canvas.height / 2 - this.szSize / 2
        }
    }
}