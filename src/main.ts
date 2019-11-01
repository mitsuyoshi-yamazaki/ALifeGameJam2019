let world: World

function setup(): void {
  const size = 200
  const worldSize = createVector(size, size)
  createCanvas(size, size)
  world = new VanillaWorld(worldSize, new VanillaTerrain(worldSize, 10, size * 0.1))

  const lives = randomLives(20, size)
  world.addLives(lives)
}

function draw(): void {
  world.next()
  world.draw()
}

function randomLives(numberOfLives: number, positionSpace: number): Life[] {
  return [...new Array(numberOfLives).keys()].map(_ => {
    return new Life(createVector(random(positionSpace), random(positionSpace)))
  })
}

// TODO: ファイルを分割する
/// Worlds
interface World {
  size: p5.Vector
  t: number
  terrain: Terrain | undefined
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

  private readonly _terrain: Terrain
  public get terrain(): Terrain {
    return this._terrain
  }

  private _objects: WorldObject[] = []
  public get objects(): WorldObject[] {
    return this._objects
    }

  private _lives: Life[] = []
  public get lives(): Life[] {
    return this._lives
  }

  public constructor(size: p5.Vector, terrain: Terrain) {
    this._size = size
    this._terrain = terrain
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
      const force = life.next()

      const friction = 0.5
      const acceleration = force.accelerationTo(life.mass)

      life.position = p5.Vector.add(life.position, life.velocity)
      life.velocity = p5.Vector.add(p5.Vector.mult(life.velocity, friction), acceleration)
    })
  }

  public draw(): void {
    background(220)

    this.terrain.draw()
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
    return 0
  }

  public forceAt(position: p5.Vector): p5.Vector {
    return createVector(0, 0)
  }

  public draw(): void {
    return
  }
}

class VanillaTerrain extends Terrain {
  public constructor(
    public readonly size: p5.Vector,
    public readonly friction: number,
    public readonly immobilizedWidth: number,
  ) {
    super(size)
  }

  public frictionAt(position: p5.Vector): number {
    if (position.x < this.immobilizedWidth) {
      return ((this.immobilizedWidth - position.x) / this.immobilizedWidth) * this.friction
    }
    if (position.x > (this.size.x - this.immobilizedWidth)) {
      return ((this.immobilizedWidth - this.size.x - position.x) / this.immobilizedWidth) * this.friction
    }
    if (position.y < this.immobilizedWidth) {
      return ((this.immobilizedWidth - position.y) / this.immobilizedWidth) * this.friction
    }
    if (position.y > (this.size.y - this.immobilizedWidth)) {
      return ((this.immobilizedWidth - this.size.y - position.y) / this.immobilizedWidth) * this.friction
    }

    return 0
  }

  public forceAt(position: p5.Vector): p5.Vector {
    return createVector(0, 0)
  }

  public draw(): void {
    stroke(207, 196, 251)
    strokeWeight(this.immobilizedWidth)
    noFill()
    rect(0, 0, this.size.x, this.size.y)
  }
}

/// Objects
class WorldObject {
  public static collisionPriority = 0
  public velocity: p5.Vector = createVector(0, 0)
  public mass = 1

  public constructor(public position: p5.Vector) {
  }

  public collideWith(other: WorldObject): void {
    // TODO: implement
    // ここで何かが起きるのは物理法則の何かを発動するということ
    return
  }

  public draw(): void {
    noStroke()
    fill(255, 0, 0)
    const radius = 1
    const diameter = radius * 2
    ellipse(this.position.x - radius, this.position.y - radius, diameter, diameter)
  }
}

class Wall extends WorldObject {
  public static collisionPriority = 1

  public constructor(public position: p5.Vector, public width: number, public height: number) {
    super(position)
  }

  public draw(): void {
    noStroke()
    fill(207, 196, 251)
    rect(this.position.x, this.position.y, this.width, this.height)
  }
}

class DeadBody extends WorldObject {
  public static collisionPriority = 101

  public get velocity(): p5.Vector {
    return createVector(0, 0)
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
    const vx = random(-max, max)
    const vy = random(-max, max)

    return new Force(vx, vy)
  }

  public draw(): void {
    super.draw()  // TODO: implement
  }
}

/// Other
class Force {
  public readonly magnitude: p5.Vector

  public constructor(vx: number, vy: number) {
    this.magnitude = createVector(vx, vy)
  }

  public accelerationTo(mass: number): p5.Vector {
    return this.magnitude.div(mass)
  }
}

/// Utility
