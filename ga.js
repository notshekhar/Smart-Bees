function newGeneration() {
    target = new Target({
        x: map(Math.random(), 0, 1, 0, canvasWidth),
        y: map(Math.random(), 0, 1, 0, canvasHeight),
    })
    diedBees = normalize(diedBees)
    bees = newpopulation(diedBees)
    bestBee = diedBees.sort((a, b) => b.fitness - a.fitness)[0]
    gen++
    console.clear()
    console.log(`Generation: ${gen}`, bestBee.fitness)
    length = population
    diedBees = new Array()
}

function normalize(bees) {
    let sum = 0
    for (let i = 0; i < bees.length; i++) {
        sum += bees[i].score
    }
    return bees.map((bee) => {
        bee.fitness = bee.score / sum
        return bee
    })
}

function newpopulation(diedBees) {
    let newBees = new Array(population).fill(0).map((e) => {
        let selected = poolSelection(diedBees)
        let newBee = new Bee(
            { x: canvasWidth / 2, y: canvasHeight - 10 },
            {
                x: map(Math.random(), 0, 1, -1, 1),
                y: map(Math.random(), 0, 1, -1, 1),
            },
            target,
            false,
            selected.brain
        )
        newBee.mutate()
        return newBee
    })

    return newBees
}

function poolSelection(bees) {
    let index = 0
    let r = Math.random()
    while (r > 0) {
        r -= bees[index].fitness
        index++
    }
    index--
    return bees[index]
}
