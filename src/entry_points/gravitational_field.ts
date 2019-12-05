import * as p5 from "p5"
import { Life, PassiveLife } from "../classes/life"
import { Vector } from "../classes/physics"
import { GravitationalTerrain, Terrain } from "../classes/terrain"
import { VanillaWorld, World } from "../classes/world"
import { random } from "../utilities"

const main = (p: p5) => {
  let world: World
  const size = 800
  const worldSize = new Vector(size, size)
  const gravity = 100

  p.setup = () => {
    p.createCanvas(size, size)
    const terrains: Terrain[] = [
      new GravitationalTerrain(worldSize, worldSize.mult(0.33), gravity),
      new GravitationalTerrain(worldSize, worldSize.mult(0.66), gravity),
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
    const lives: PassiveLife[] = []
    for (let i = 0; i < numberOfLives; i += 1) {
      lives.push(new PassiveLife(new Vector(random(positionSpace), random(positionSpace))))
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
