const canvas = document.querySelector("canvas")
const ctx = canvas.getContext("2d")

const [canvasWidth, canvasHeight] = [canvas.width, canvas.height]

function clearCanvas() {
    ctx.beginPath()
    ctx.fillStyle = "rgb(33, 33, 33)"
    ctx.rect(0, 0, canvasWidth, canvasHeight)
    ctx.fill()
}
function map(value, minV, maxV, minL, maxL) {
    return ((value - minV) * (maxL - minL)) / (maxV - minV) + minL
}

const population = 600
let length = population
let gen = 0
let diedBees = new Array()
let target = new Target({
    x: map(Math.random(), 0, 1, 0, canvasWidth),
    y: map(Math.random(), 0, 1, 0, canvasHeight),
})
let bees = new Array(population).fill(0).map(
    (e) =>
        new Bee(
            { x: canvasWidth / 2, y: canvasHeight - 10 },
            {
                x: map(Math.random(), 0, 1, -1, 1),
                y: map(Math.random(), 0, 1, -1, 1),
            },
            target
        )
)
let bestBee = bees[0]
let showBest = false
function runBestToggle() {
    showBest = !showBest
}
function draw() {
    clearCanvas()
    target.show()
    if (!showBest) {
        if (length <= 0) {
            // console.log("generate new generation")
            newGeneration()
        } else {
            bees.forEach((bee) => {
                bee.show()
                bee.update()
            })
        }
        if (diedBees.length > 0) diedBees.forEach((d) => d.show())
    } else {
        bestBee.show()
        bestBee.update()
        if (bestBee.die()) {
            target = new Target({
                x: map(Math.random(), 0, 1, 0, canvasWidth),
                y: map(Math.random(), 0, 1, 0, canvasHeight),
            })
            bestBee.target = target
            bestBee.lifespan = 150
            bestBee.pos = vector(canvasWidth / 2, canvasHeight - 10)
            bestBee.vel = vector(0, 0)
        }
    }
    requestAnimationFrame(draw)
}
// setInterval(() => {
//     clearCanvas()
//     bee.show()
//     bee.update()
// }, 21)
requestAnimationFrame(draw)
