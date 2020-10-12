import * as p5 from "p5"
import { Vector } from "../classes/physics"
import { random, URLParameter } from "../utilities"

const parameters = new URLParameter()
const DEBUG = parameters.boolean("debug", true, "d")        // デバッグフラグ

function log(message: string): void {
  if (DEBUG) {
    console.log(message)
  }
}

const canvasSize = parameters.int("canvas_size", 1000, "s")

let t = 0
const fieldSize = new Vector(canvasSize, canvasSize)
const objects: Obj[] = []

const main = (p: p5) => {
  p.setup = () => {
    const canvas = p.createCanvas(fieldSize.x, fieldSize.y)
    canvas.id("canvas")
    canvas.parent("canvas-parent")

    setupObjects()
  }

  p.draw = () => {
    p.background(0xFF)

    objects.forEach(o => {
      o.attributes.forEach(attribute => {
        attribute.execute(o)
      })
    })

    objects.forEach(o => {
      o.draw(p)
    })

    if (t % 100 === 0) {
      log(`t: ${t}`)
    }
    t += 1
  }
}

const sketch = new p5(main)

/// Setup
function setupObjects(): void {
  const gridSize = 100
  const halfGridSize = gridSize / 2
  const objectSize = gridSize * 0.6
  const burnableRate = 0.5

  function attributes(x: number, y: number): Attribute[] {
    if (x === 0 && y === 0) {
      const burningAttribute = new Burnable(100, 10)
      burningAttribute.isBurning = true

      return [burningAttribute]
    }
    if (random(1) > burnableRate) {
      return []
    }

    const burnableAttribute = new Burnable(100, 10)

    return [burnableAttribute]
  }

  for (let y = 0; y < Math.floor(fieldSize.y / gridSize); y += 1) {
    for (let x = 0; x < Math.floor(fieldSize.x / gridSize); x += 1) {
      const position = new Vector(x * gridSize + halfGridSize, y * gridSize + halfGridSize)
      const obj = new Obj(position, objectSize, attributes(x, y))
      objects.push(obj)
    }
  }

  log(`${objects.length} objects`)
}

/// World

/// Objects
class AI {
  public constructor() {

  }
}

interface Properties {
  temperature: number
}

interface Attribute {
  receive(heat: number): void // 熱量ではなく熱（計算が煩雑なので熱量は考えないものとする

  execute(obj: Obj): void

  draw(p: p5, position: Vector, size: number): void
}

class Burnable implements Attribute {
  public isBurning = false  // FixMe: 仕組み上privateにしたほうが良い
  private duration = 0
  private isReceivingHeat = false

  public constructor(public readonly combustionTemperature: number, public readonly combustionDuration: number) {
  }

  public receive(heat: number): void {
    if (heat < this.combustionTemperature) {
      return
    }
    this.isReceivingHeat = true
  }

  public execute(obj: Obj): void {
    if (this.isBurning) {
      // TODO: 燃え尽きたときにObjを炭に変化させる
      const flameRadius = 150
      const flameTemprature = 200
      obj.getNeighbours(flameRadius)
        .forEach(neighbour => {
          neighbour.attributes.forEach(attribute => {
            attribute.receive(flameTemprature)
          })
        })
      this.duration = this.combustionDuration
      this.isReceivingHeat = false

      return
    }
    if (this.isReceivingHeat) {
      this.duration += 1
    }
    if (this.duration >= this.combustionDuration) {
      this.isBurning = true
    }
    this.isReceivingHeat = false
  }

  public draw(p: p5, position: Vector, size: number): void {
    if (this.isBurning === false) {
      return
    }

    p.noStroke()
    p.fill(0xFF, 0, 0, 0x40)
    p.circle(position.x, position.y, size * 1.4)
  }
}

class Obj {
  public constructor(public position: Vector, public size: number, public attributes: Attribute[]) {
  }

  public getNeighbours(radius: number): Obj[] {
    const neighbours: Obj[] = []

    objects.forEach(o => {
      if (o === this) {
        return
      }
      if (o.position.dist(this.position) <= radius) {
        neighbours.push(o)
      }
    })

    return neighbours
  }

  public draw(p: p5): void {
    // FixMe: 仮実装
    const isBurnable = this.attributes.length > 0
    if (isBurnable) {
      p.fill(0, 0x80)
    } else {
      p.fill(0xFF, 0x80)
    }
    p.noStroke()

    const radius = this.size / 2
    p.rect(this.position.x - radius, this.position.y - radius, this.size, this.size)

    this.attributes.forEach(attribute => {
      attribute.draw(p, this.position, this.size)
    })
  }
}

class Agent extends Obj {
  private ai: AI

  public constructor(position: Vector, size: number, attributes: Attribute[], ai: AI) {
    super(position, size, attributes)
    this.ai = ai
  }

  public draw(p: p5): void {
    // TODO:
  }
}
