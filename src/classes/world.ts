import * as p5 from "p5"
import { random } from "../utilities"
import { GeneticLife, Life } from "./life"
import { WorldObject } from "./object"
import { Force, Vector } from "./physics"
import { Terrain } from "./terrain"

export interface World {
  size: Vector
  t: number
  terrains: Terrain[]
  objects: WorldObject[]
  lives: Life[]

  addObjects(objects: WorldObject[]): void
  addLives(lives: Life[]): void
  next(): void

  draw(p: p5): void
}

export class VanillaWorld implements World {
  public get size(): Vector {
    return this._size
  }
  public get t(): number {
    return this._t
  }
  public get terrains(): Terrain[] {
    return this._terrains
  }
  public get objects(): WorldObject[] {
    return this._objects
  }
  public get lives(): Life[] {
    return this._lives
  }

  protected _lives: Life[] = []
  private readonly _size: Vector

  private _t = 0

  private readonly _terrains: Terrain[]

  private _objects: WorldObject[] = []

  public constructor(size: Vector, terrains: Terrain[]) {
    this._size = size
    this._terrains = terrains
  }

  public addObjects(objects: WorldObject[]): void {
    this._objects = this._objects.concat(objects)
  }

  public addLives(lives: Life[]): void {
    this._lives = this._lives.concat(lives)
  }

  public next(): void {
    this._t += 1

    this._lives.forEach(life => {
      const forces: Force[] = this.terrains.map(terrain => {
        return terrain.forceAt(life.position)
      })
      const sumForces = (result: Force, value: Force) => {
        return result.add(value)
      }
      const fieldForce: Force = forces.reduce(sumForces, Force.zero())
      const force = life.next()
        .add(fieldForce)

      const frictions: number[] = this.terrains.map(terrain => {
        return terrain.frictionAt(life.position)
      })
      const sumFrictions = (sum: number, value: number) => {
        return sum + value
      }
      const friction: number = frictions.reduce(sumFrictions, 1) / (frictions.length + 1)
      const acceleration = force.accelerationTo(life.mass)

      const nextPosition = life.position.add(life.velocity)
      const nextVelocity = life.velocity.mult(friction)
        .add(acceleration)
      let x = nextPosition.x
      let y = nextPosition.y
      let dx = nextVelocity.x
      let dy = nextVelocity.y
      if (x < 0) {
        x = 0
        dx = 0
      } else if (x > this.size.x) {
        x = this.size.x
        dx = 0
      }
      if (y < 0) {
        y = 0
        dy = 0
      } else if (y > this.size.y) {
        y = this.size.y
        dy = 0
      }
      life.position = new Vector(x, y)
      life.velocity = new Vector(dx, dy)
    })
  }

  public draw(p: p5): void {
    p.background(220)

    this.terrains.forEach(terrain => {
      terrain.draw(p)
    })
    this._objects.forEach(obj => {
      obj.draw(p)
    })
    this._lives.forEach(life => {
      life.draw(p)
    })
  }
}

export class PredPreyWorld extends VanillaWorld {
  protected _lives: GeneticLife[] = []
  public get lives(): GeneticLife[] {
    return this._lives
  }

  public next(): void {
    super.next()

    const eatProbability = 0.9

    const killed: GeneticLife[] = []
    const born: GeneticLife[] = []

    const sortedX = [...this.lives].sort((lhs, rhs) => {
      return lhs.position.x - rhs.position.x
    })

    for (let i = 0; i < this.lives.length; i += 1) {
      const life = this.lives[i]

      if (life.isAlive) {
        const xIndex = sortedX.indexOf(life)
        const maxX = life.position.x + life.size / 2
        const minX = life.position.x - life.size / 2

        const compareTo: GeneticLife[] = []

        for (let k = xIndex + 1; k < sortedX.length; k += 1) {
          if (sortedX[k].position.x > maxX) {
            break
          }
          compareTo.push(sortedX[k])
        }
        for (let k = xIndex - 1; k >= 0; k -= 1) {
          if (sortedX[k].position.x < minX) {
            break
          }
          compareTo.push(sortedX[k])
        }

        const threshold = random(1, eatProbability)

        for (let j = 0; j < compareTo.length; j += 1) {
          const otherLife = compareTo[j]
          if (life.isCollidingWith(otherLife)) {
            if (life.gene.canEat(otherLife.gene, threshold)) {
              const predator = life
              const prey = otherLife
              predator.eat(prey)
              killed.push(prey)
              console.log(`${String(predator)} eats ${String(prey)}`)
              break

            } else {
              continue
            }
          }
        }
      }
    }

    this._lives = this.lives.filter(l => {
      return killed.indexOf(l) < 0
    })
  }
}
