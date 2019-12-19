import * as p5 from "p5"
import { Gene } from "../classes/gene"
import { GeneticActiveLife, GeneticLife, Life } from "../classes/life"
import { calculateOrbitalVelocity, Vector } from "../classes/physics"
import { FrictedTerrain, Terrain, VanillaTerrain } from "../classes/terrain"
import { PredPreyWorld, World } from "../classes/world"
import { random } from "../utilities"

const main = (p: p5) => {
  const startsWithSingleGene = true

  let world: World
  const fieldWidth = 1200
  const fieldHeight = Math.floor(fieldWidth * 1)
  const worldSize = new Vector(fieldWidth, fieldHeight)
  const gravityCenter = worldSize.mult(0.5)
  const initialEnergy = 100
  const lifeSize = 6

  p.setup = () => {
    p.createCanvas(fieldWidth, fieldHeight)
    const terrains: Terrain[] = [
      new FrictedTerrain(worldSize, 0.9),
    ]
    world = new PredPreyWorld(worldSize, terrains)

    const lives = randomLives(2000, worldSize)
    world.addLives(lives)
  }

  p.draw = () => {
    p.fill(0xFF)
    p.rect(0, 0, fieldWidth, fieldHeight) // background() では動作しない

    const resources: GeneticLife[] = []
    const resourceSize = lifeSize * 0.6
    const resourceEnergy = initialEnergy * 0.6
    for (let i = 0; i < 1; i += 1) {
      const position = Vector.random(fieldWidth * 0.9, fieldWidth * 0.1)
      const resource = new GeneticLife(position, Gene.random(), resourceSize, resourceEnergy)
      resources.push(resource)
    }

    world.addLives(resources)
    world.next()
    world.draw(p)
  }

  function randomLives(numberOfLives: number, positionSpace: Vector): Life[] {
    const lives: GeneticActiveLife[] = []

    const initialGene = new Gene(0x99, 0x99) // Gene.random()

    for (let i = 0; i < numberOfLives; i += 1) {
      const position = new Vector(random(positionSpace.x * 0.7, positionSpace.x * 0.3), random(positionSpace.x * 0.6, positionSpace.x * 0.4))
      const gene = startsWithSingleGene ? initialGene : Gene.random()
      lives.push(new GeneticActiveLife(position, gene, lifeSize, initialEnergy))
    }

    return lives
  }
}

const sketch = new p5(main)
