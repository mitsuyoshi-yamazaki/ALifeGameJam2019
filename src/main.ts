let drawer: P5Drawer<SimpleObject>
let world: World<WorldObject>

function setup(): void {
  drawer = new P5Drawer<SimpleObject>()

  const worldSize = 200
  createCanvas(worldSize, worldSize)
  world = new VanillaWorld(createVector(worldSize, worldSize))

  const objects: [SimpleObject, p5.Vector][] = [
    [new SimpleObject(), createVector(50, 50)],
  ]
  world.addObjects(objects)
}

function draw(): void {
  world.next()
  drawer.draw(world.objects)
}

// TODO: ファイルを分割する
/// Worlds
interface World<ObjectType> {
  size: p5.Vector
  t: number
  objects: [ObjectType, p5.Vector][]

  addObjects(objects: [ObjectType, p5.Vector][]): void
  next(): void
}

class VanillaWorld<ObjectType> implements World<ObjectType> {
  private readonly _size: p5.Vector
  public get size(): p5.Vector {
    return this._size
  }

  private _t = 0
  public get t(): number {
    return this._t
  }

  private _objects: [ObjectType, p5.Vector][] = []
  public get objects(): [ObjectType, p5.Vector][] {
    return this._objects
  }

  public constructor(size: p5.Vector) {
    this._size = size
  }

  public addObjects(objects: [ObjectType, p5.Vector][]): void {
    this._objects = this._objects.concat(objects)
  }

  public next(): void {
    this._t += 1
    // TODO: implement here
  }
}

/// Objects
interface WorldObject {
  next(): Movement | undefined
}

class SimpleObject implements WorldObject {
  public next(): Movement | undefined {
    return
  }
}

/// Other
interface Movement {

}

/// Utility
interface Drawer<ObjectType extends WorldObject> {
  draw(objects: [ObjectType, p5.Vector][]): void
}

class P5Drawer<ObjectType extends WorldObject> implements Drawer<ObjectType> {
  public draw(objects: [ObjectType, p5.Vector][]): void {
    background(220)
    noStroke()
    fill(255, 0, 0)
    const radius = 10
    objects.forEach(value => {
      const position = value[1]
      ellipse(position.x, position.y, radius, radius)
    })
  }
}
