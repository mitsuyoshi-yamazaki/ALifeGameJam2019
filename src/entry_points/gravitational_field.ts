import * as p5 from "p5"
import { Life } from "../classes/life"
import { Vector } from "../classes/physics"
import { GravitationalTerrain, Terrain } from "../classes/terrain"
import { VanillaWorld, World } from "../classes/world"
import { random } from "../utilities"

const main = (p: p5) => {
  let world: World
  p.setup = () => {
    const size = 800
    const worldSize = new Vector(size, size)
    p.createCanvas(size, size)
    const terrains: Terrain[] = [
      new GravitationalTerrain(worldSize, worldSize.mult(0.33), 2),
      new GravitationalTerrain(worldSize, worldSize.mult(0.66), 2),
    ]
    world = new VanillaWorld(worldSize, terrains)

    const lives = randomLives(80, size, 1)
    world.addLives(lives)
  }

  p.draw = () => {
    world.next()
    world.draw(p)
  }

  function randomLives(numberOfLives: number, positionSpace: number, velocity?: number | undefined): Life[] {
    const lives: Life[] = []
    for (let i = 0; i < numberOfLives; i += 1) {
      lives.push(new Life(new Vector(random(positionSpace), random(positionSpace))))
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
