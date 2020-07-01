import * as p5 from "p5"
import { Gene } from "../classes/gene"
import { GeneticActiveLife, GeneticLife, Life } from "../classes/life"
import { calculateOrbitalVelocity, Vector } from "../classes/physics"
import { FrictedTerrain, Terrain } from "../classes/terrain"
import { PredPreyWorld, World } from "../classes/world"
import { parsedQueries, random } from "../utilities"

const parameters = parsedQueries()
// tslint:disable: no-string-literal
const DEBUG = parameters["debug"] ? true : false  // Caution: 0 turns to "0" and it's true. Use "" to disable it.
const lifeSize = parameters["life_size"] ? parseInt(parameters["life_size"], 10) : 6
const population = parameters["population"] ? parseInt(parameters["population"], 10) : 4000
const friction = parameters["friction"] ? parseFloat(parameters["friction"]) : 0.99
const mutationRate = parameters["mutation_rate"] ? parseFloat(parameters["mutation_rate"]) : 0.99
// tslint:enable: no-string-literal

const startsWithSingleGene = true

let world: World
const backgroundTransparency = 0xFF
const fieldWidth = 1200
const fieldHeight = Math.floor(fieldWidth * 1)
const worldSize = new Vector(fieldWidth, fieldHeight)
const gravityCenter = worldSize.mult(0.5)
const worldCenter = worldSize.div(2)
const gravity = 20
const immobilizedWidth = 0
const initialEnergy = 100

const main = (p: p5) => {
  p.setup = () => {
    const canvas = p.createCanvas(fieldWidth, fieldHeight)
    canvas.id("canvas")
    canvas.parent("canvas-parent")

    const terrains: Terrain[] = [
      // new VanillaTerrain(worldSize, worldCenter, gravity, friction, immobilizedWidth),
      new FrictedTerrain(worldSize, friction),
    ]
    world = new PredPreyWorld(worldSize, terrains)

    const lives = randomLives(population, worldSize, 1)
    world.addLives(lives)
  }

  p.draw = () => {
    p.fill(0xFF, backgroundTransparency)
    p.rect(0, 0, fieldWidth, fieldHeight) // background() では動作しない

    const resources: GeneticLife[] = []
    const resourceSize = lifeSize * 0.6
    const resourceEnergy = initialEnergy * 0.6
    const positionSpace = fieldWidth * 0.9
    for (let i = 0; i < 1; i += 1) {
      const position = new Vector(random(positionSpace), random(positionSpace))
      const resource = new GeneticLife(position, Gene.random(), resourceSize, resourceEnergy)
      resource.velocity = calculateOrbitalVelocity(position, gravityCenter, gravity)
      resources.push(resource)
    }

    world.addLives(resources)
    world.next()
    world.draw(p)
  }

  function randomLives(numberOfLives: number, positionSpace: Vector, velocity?: number | undefined): Life[] {
    const lives: GeneticActiveLife[] = []

    const initialGene = new Gene(0x99, 0x99) // Gene.random()

    for (let i = 0; i < numberOfLives; i += 1) {
      const position = new Vector(random(positionSpace.x), random(positionSpace.y))
      const gene = startsWithSingleGene ? initialGene : Gene.random()
      lives.push(new GeneticActiveLife(position, gene, lifeSize, initialEnergy))
    }
    if (velocity != undefined) {
      lives.forEach(life => {
        life.velocity = new Vector(random(-velocity, velocity), random(-velocity, velocity))
      })
    }

    return lives
  }
}

const sketch = new p5(main)
