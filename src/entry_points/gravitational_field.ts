import * as p5 from "p5"
import { Life, PassiveLife } from "../classes/life"
import { calculateOrbitalVelocity, Vector } from "../classes/physics"
import { GravitationalTerrain, Terrain } from "../classes/terrain"
import { VanillaWorld, World } from "../classes/world"
import { random } from "../utilities"

const main = (p: p5) => {
  let world: World
  const size = 800
  const worldSize = new Vector(size, size)
  const numberOfLives = 40
  const gravityCenter = worldSize.mult(0.5)
  const gravity = 200

  p.setup = () => {
    p.createCanvas(size, size)
    const terrains: Terrain[] = [
      new GravitationalTerrain(worldSize, worldSize.mult(0.42), gravity),
      new GravitationalTerrain(worldSize, worldSize.mult(0.58), gravity * 0.5),
    ]
    world = new VanillaWorld(worldSize, terrains)

    const lives = randomLives()
    world.addLives(lives)
  }

  p.draw = () => {
    world.next()
    world.draw(p)
  }

  function randomLives(): Life[] {
    const positionSpace = size * 0.9
    const lives: PassiveLife[] = []
    for (let i = 0; i < numberOfLives; i += 1) {
      lives.push(new PassiveLife(new Vector(random(positionSpace), random(positionSpace))))
    }
    lives.forEach(life => {
      life.velocity = calculateOrbitalVelocity(life.position, gravityCenter, gravity)
    })

    return lives
  }
}

const sketch = new p5(main)
