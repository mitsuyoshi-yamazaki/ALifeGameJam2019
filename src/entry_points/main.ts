import * as p5 from "p5"
import { Gene } from "../classes/gene"
import { GeneticLife, Life } from "../classes/life"
import { Vector } from "../classes/physics"
import { Terrain } from "../classes/terrain"
import { VanillaWorld, World } from "../classes/world"
import { random } from "../utilities"

const main = (p: p5) => {
  let world: World
  p.setup = () => {
    const fieldWidth = 1200
    const fieldHeight = Math.floor(fieldWidth * 0.6)
    const worldSize = new Vector(fieldWidth, fieldHeight)
    p.createCanvas(fieldWidth, fieldHeight)
    const terrains: Terrain[] = []
    world = new VanillaWorld(worldSize, terrains)

    const lives = randomLives(80, worldSize, 1)
    world.addLives(lives)
  }

  p.draw = () => {
    world.next()
    world.draw(p)
  }

  function randomLives(numberOfLives: number, positionSpace: Vector, velocity?: number | undefined): Life[] {
    const lives: GeneticLife[] = []
    for (let i = 0; i < numberOfLives; i += 1) {
      const position = new Vector(random(positionSpace.x), random(positionSpace.y))
      lives.push(new GeneticLife(position, Gene.random()))
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
