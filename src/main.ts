let drawer: P5Drawer<SimpleLife>
let world: World<WorldObject>

function setup(): void {
  drawer = new P5Drawer<SimpleLife>()

  const worldSize = 200
  createCanvas(worldSize, worldSize)
  world = new VanillaWorld(createVector(worldSize, worldSize))

  const objects: ObjectWrapper<SimpleLife>[] = [
    new ObjectWrapper<SimpleLife>(new SimpleLife(), createVector(50, 50), createVector(0, 0)),
  ]
  world.addObjects(objects)
}

function draw(): void {
  world.next()
  drawer.draw(world.objects)
}

// TODO: ファイルを分割する
/// Worlds
interface World<ObjectType extends WorldObject> {
  size: p5.Vector
  t: number
  objects: ObjectWrapper<ObjectType>[]  // FIXME: 複数の型の WorldObject が許容されない

  addObjects(objects: ObjectWrapper<ObjectType>[]): void
  next(): void
}

class VanillaWorld<ObjectType extends WorldObject> implements World<ObjectType> {
  private readonly _size: p5.Vector
  public get size(): p5.Vector {
    return this._size
  }

  private _t = 0
  public get t(): number {
    return this._t
  }

  private _objects: ObjectWrapper<ObjectType>[] = []
  public get objects(): ObjectWrapper<ObjectType>[] {
    return this._objects
  }

  public constructor(size: p5.Vector) {
    this._size = size
  }

  public addObjects(objects: ObjectWrapper<ObjectType>[]): void {
    this._objects = this._objects.concat(objects)
  }

  public next(): void {
    this._t += 1

    this._objects.forEach(wrapper => {
      this.nextObject(wrapper)
    })
  }

  private nextObject(wrapper: ObjectWrapper<ObjectType>): void {
    const force = wrapper.obj.next()
    if (force == undefined) {
      return
    }

    const mass = 1
    const friction = 0.5
    const acceleration = force.accelerationTo(mass)

    wrapper.position = p5.Vector.add(wrapper.position, wrapper.velocity)
    wrapper.velocity = p5.Vector.add(p5.Vector.mult(wrapper.velocity, friction), acceleration)
  }
}

/// Objects
interface WorldObject {
  next(): Force | undefined
}

class ObjectWrapper<ObjectType extends WorldObject> {
  public constructor(public readonly obj: ObjectType, public position: p5.Vector, public velocity: p5.Vector) {
  }
}

class SimpleObject implements WorldObject {
  public next(): Force | undefined {
    return
  }
}

class SimpleLife implements WorldObject {
  public next(): Force | undefined {
    const max = 3
    const vx = random(-max, max)
    const vy = random(-max, max)

    return new Force(vx, vy)
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
interface Drawer<ObjectType extends WorldObject> {
  draw(objects: ObjectWrapper<ObjectType>[]): void
}

class P5Drawer<ObjectType extends WorldObject> implements Drawer<ObjectType> {
  public draw(objects: ObjectWrapper<ObjectType>[]): void {
    background(220)
    noStroke()
    fill(255, 0, 0)
    const radius = 10
    objects.forEach(wrapper => {
      ellipse(wrapper.position.x, wrapper.position.y, radius, radius)
    })
  }
}
