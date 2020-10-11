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

const gridSize = parameters.int("grid_size", 100, "g")
const fieldSize = parameters.int("field_size", 1000, "s")

let t = 0
const grids: Grid[][] = []
const objects: Obj[] = []

const main = (p: p5) => {
  p.setup = () => {
    const canvas = p.createCanvas(fieldSize, fieldSize)
    canvas.id("canvas")
    canvas.parent("canvas-parent")

    setupWorld()
    setupObjects()
  }

  p.draw = () => {
    p.background(0xFF)

    objects.forEach(o => {
      o.attributes.forEach(attribute => {
        // attribute.execute()  // TODO:
      })
    })

    objects.forEach(o => {
      o.draw(p)
    })

    t += 1
  }
}

const sketch = new p5(main)

/// Setup

function setupWorld(): void {

}

function setupObjects(): void {
  const halfGridSize = gridSize / 2
  const gridMax = fieldSize / gridSize
  const objectSize = gridSize * 0.6
  const burnableAttribute = new Burnable(100, 10)
  const burnableRate = 0.5

  for (let y = 0; y < gridMax; y += 1) {
    for (let x = 0; x < gridMax; x += 1) {
      const position = new Vector(x * gridSize + halfGridSize, y * gridSize + halfGridSize)
      const attributes: Attribute[] = (random(1) < burnableRate) ? [burnableAttribute] : []
      const obj = new Obj(position, objectSize, attributes)
      objects.push(obj)
    }
  }

  log(`${objects.length} objects`)
}

/// World

class Grid {
  private _properties: Properties
  public get properties(): Properties {
    return this._properties
  }

  public constructor(public readonly position: Vector) {
  }
}

/// Objects

class AI {
  public constructor() {

  }
}

interface Properties {
  temperature: number
}

interface Attribute {
  execute(properties: Properties): void // propertiesは自身のObjの状態

  draw(p: p5, position: Vector, size: number): void
}

class Burnable implements Attribute {
  public isBurning = false
  private duration = 0

  public constructor(public readonly combustionTemperature: number, public readonly combustionDuration: number) {
  }

  public execute(properties: Properties): void {
    if (properties.temperature < this.combustionTemperature) {
      this.duration = Math.max(this.duration - 1, 0)

      return
    }
    this.duration += 1
    if (this.duration >= this.combustionDuration) {
      // on fire
    }
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
