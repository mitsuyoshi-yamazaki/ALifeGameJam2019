import * as p5 from "p5"
import { Life } from "./life"
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

  // 描画
  draw(p: p5): void
}

export class VanillaWorld implements World {
  private readonly _size: Vector
  public get size(): Vector {
    return this._size
  }

  private _t = 0
  public get t(): number {
    return this._t
  }

  private readonly _terrains: Terrain[]
  public get terrains(): Terrain[] {
    return this._terrains
  }

  private _objects: WorldObject[] = []
  public get objects(): WorldObject[] {
    return this._objects
  }

  private _lives: Life[] = []
  public get lives(): Life[] {
    return this._lives
  }

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
      const fieldForce: Force = forces.reduce((result: Force, value: Force) => {
        return result.add(value)
      },                                      Force.zero())
      const force = life.next()
        .add(fieldForce)

      const frictions: number[] = this.terrains.map(terrain => {
        return terrain.frictionAt(life.position)
      })
      const friction: number = frictions.reduce((sum, value) => {
        return sum + value
      },                                        1) / (frictions.length + 1)
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
      life.velocity = new Vector(dx, dy)    })
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
