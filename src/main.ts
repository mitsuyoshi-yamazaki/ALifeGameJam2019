import * as p5 from "p5"

const sketch = (p: p5) => {
    p.setup = () => {
          setupTest()
        }

    p.draw = () => {
          drawTest()
        }

    let world: World

    function setupTest(): void {
    const size = 800
    const worldSize = p.createVector(size, size)
    p.createCanvas(size, size)
    const terrains: Terrain[] = [
      new GravitationalTerrain(worldSize, p5.Vector.mult(worldSize, 0.33), 2),
      new GravitationalTerrain(worldSize, p5.Vector.mult(worldSize, 0.66), 2),
    ]
    world = new VanillaWorld(worldSize, terrains)

    const lives = randomLives(80, size, 1)
    world.addLives(lives)
  }

    function drawTest(): void {
    world.next()
    world.draw()
  }

    function randomLives(numberOfLives: number, positionSpace: number, velocity?: number | undefined): Life[] {
    const lives: Life[] = []
    for (let i = 0; i < numberOfLives; i += 1) {
      lives.push(new Life(p.createVector(p.random(positionSpace), p.random(positionSpace))))
    }
    if (velocity != undefined) {
      lives.forEach(life => {
        life.velocity = p.createVector(p.random(-velocity, velocity), p.random(-velocity, velocity))
      })
    }

    return lives
  }

  // TODO: ファイルを分割する
  /// Worlds
    interface World {
    size: p5.Vector
    t: number
    terrains: Terrain[]
    objects: WorldObject[]
    lives: Life[]

    addObjects(objects: WorldObject[]): void
    addLives(lives: Life[]): void
    next(): void

    // 描画
    draw(): void
  }

    class VanillaWorld implements World {
    private readonly _size: p5.Vector
    public get size(): p5.Vector {
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

    public constructor(size: p5.Vector, terrains: Terrain[]) {
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

        const nextPosition = p5.Vector.add(life.position, life.velocity)
        const x = Math.max(Math.min(nextPosition.x, this.size.x), 0)
        const y = Math.max(Math.min(nextPosition.y, this.size.y), 0)
        life.position = p.createVector(x, y)
        life.velocity = p5.Vector.add(p5.Vector.mult(life.velocity, friction), acceleration)
      })
    }

    public draw(): void {
      p.background(220)

      this.terrains.forEach(terrain => {
        terrain.draw()
      })
      this._objects.forEach(obj => {
        obj.draw()
      })
      this._lives.forEach(life => {
        life.draw()
      })
    }
  }

  // その場所に存在する力やプロパティを格納する
    class Terrain {
    public constructor(public readonly size: p5.Vector) {
    }

    public frictionAt(position: p5.Vector): number {
      return 1  // 0(停止) ~ 1(摩擦なし)
    }

    public forceAt(position: p5.Vector): Force {
      return Force.zero()
    }

    public draw(): void {
      return
    }
  }

    class VanillaTerrain extends Terrain {
    public constructor(
      public readonly size: p5.Vector,
      public readonly immobilizedWidth: number,
    ) {
      super(size)
    }

    public frictionAt(position: p5.Vector): number {
      if (position.x < this.immobilizedWidth) {
        return (position.x / this.immobilizedWidth)
      }
      if (position.x > (this.size.x - this.immobilizedWidth)) {
        return (this.size.x - position.x) / this.immobilizedWidth
      }
      if (position.y < this.immobilizedWidth) {
        return (position.y / this.immobilizedWidth)
      }
      if (position.y > (this.size.y - this.immobilizedWidth)) {
        return (this.size.y - position.y) / this.immobilizedWidth
      }

      return 1
    }

    public forceAt(position: p5.Vector): Force {
      return Force.zero()
    }

    public draw(): void {
      p.stroke(207, 196, 251)
      p.strokeWeight(this.immobilizedWidth)
      p.noFill()
      p.rect(0, 0, this.size.x, this.size.y)
    }
  }

    class GravitationalTerrain extends Terrain {
    public constructor(public readonly size: p5.Vector, public readonly center: p5.Vector, public readonly gravity: number) {
      super(size)
    }

    public frictionAt(position: p5.Vector): number {
      // // 大気圏
      // const distance = Math.max(this.center.dist(position), 0.1)
      // if (distance > 10) {
      //   return 1
      // }

      // return (distance / 10)

      return 1
    }

    public forceAt(position: p5.Vector): Force {
      const distance = Math.max(this.center.dist(position), 0.1) // ブラックホールは法律で禁止されている
      const magnitude = (1 / (distance * distance)) * this.gravity

      const vector = p5.Vector.sub(this.center, position)

      return new Force(p5.Vector.mult(vector, magnitude))
    }

    public draw(): void {
      p.noStroke()
      p.fill(80)
      const size = 20
      p.ellipse(this.center.x, this.center.y, size, size)
    }
  }

  /// Objects
    class WorldObject {
    public static collisionPriority = 0
    public velocity: p5.Vector = p.createVector(0, 0)
    public mass = 1

    public constructor(public position: p5.Vector) {
    }

    public collideWith(other: WorldObject): void {
      // TODO: implement
      // ここで何かが起きるのは物理法則の何かを発動するということ
      return
    }

    public draw(): void {
      p.noStroke()
      p.fill(255, 0, 0)
      const radius = 1
      const diameter = radius * 2
      p.ellipse(this.position.x - radius, this.position.y - radius, diameter, diameter)
    }
  }

    class Wall extends WorldObject {
    public static collisionPriority = 1

    public constructor(public position: p5.Vector, public width: number, public height: number) {
      super(position)
    }

    public draw(): void {
      p.noStroke()
      p.fill(207, 196, 251)
      p.rect(this.position.x, this.position.y, this.width, this.height)
    }
  }

    class DeadBody extends WorldObject {
    public static collisionPriority = 101

    public get velocity(): p5.Vector {
      return p.createVector(0, 0)
    }

    public draw(): void {
      super.draw()  // TODO: implement
    }
  }

  /// Lives
    class Life extends WorldObject {
    public static collisionPriority = 100

    public constructor(public position: p5.Vector) {
      super(position)
      this.mass = 3
    }

    public next(): Force {
      const max = 3
      const vx = p.random(-max, max)
      const vy = p.random(-max, max)

      // return new Force(p.createVector(vx, vy))
      return Force.zero()
    }

    public draw(): void {
      p.noFill()
      p.stroke(86, 51, 245)

      this.drawCircles(6, this.position.x, this.position.y, 20)
    }

    private drawCircles(numberOfCircles: number, x: number, y: number, diameter: number): void {
      if (numberOfCircles <= 0) {
        return
      }
      p.circle(x, y, diameter)
      this.drawCircles(numberOfCircles - 1, x - this.velocity.x * 2.5, y - this.velocity.y * 2.5, diameter * 0.6)
    }
  }

  /// Other
    class Force {
    public constructor(public readonly magnitude: p5.Vector) {
    }

    public static zero(): Force {
      return new Force(p.createVector(0, 0))
    }

    public accelerationTo(mass: number): p5.Vector {
      return this.magnitude.div(mass)
    }

    public add(other: Force): Force {
      const vector = p5.Vector.add(this.magnitude, other.magnitude)

      return new Force(vector)
    }
  }

/// Utility
}

const sketchP = new p5(sketch)
