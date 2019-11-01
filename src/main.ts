let world: World

function setup(): void {
  const worldSize = 200
  createCanvas(worldSize, worldSize)
  world = new VanillaWorld(createVector(worldSize, worldSize))

  const walls = wallsAround(worldSize, worldSize, worldSize * 0.01)
  world.addObjects(walls)

  const lives: Life[] = [
    new Life(createVector(random(worldSize), random(worldSize))),
  ]
  world.addLives(lives)
}

function draw(): void {
  world.next()
  world.draw()
}

function wallsAround(width: number, height: number, wallWidth: number): Wall[] {
  return [
    new Wall(createVector(0, 0), width, wallWidth),
    new Wall(createVector(width - wallWidth, wallWidth), wallWidth, height - wallWidth * 2),
    new Wall(createVector(0, height - wallWidth), width, wallWidth),
    new Wall(createVector(0, wallWidth), wallWidth, height - wallWidth * 2),
  ]
}

// TODO: ファイルを分割する
/// Worlds
interface World {
  size: p5.Vector
  t: number
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

  private _objects: WorldObject[] = []
  public get objects(): WorldObject[] {
    return this._objects
    }

  private _lives: Life[] = []
  public get lives(): Life[] {
    return this._lives
  }

  public constructor(size: p5.Vector) {
    this._size = size
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
      life.next()
    })
  }

  public draw(): void {
    background(220)

    this._objects.forEach(obj => {
      obj.draw()
    })
    this._lives.forEach(life => {
      life.draw()
    })
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
    fill(255, 0, 0)
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

  public next(): void {
    const max = 3
    const vx = random(-max, max)
    const vy = random(-max, max)

    const force = new Force(vx, vy)

    const friction = 0.5
    const acceleration = force.accelerationTo(this.mass)

    this.position = p5.Vector.add(this.position, this.velocity)
    this.velocity = p5.Vector.add(p5.Vector.mult(this.velocity, friction), acceleration)
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
