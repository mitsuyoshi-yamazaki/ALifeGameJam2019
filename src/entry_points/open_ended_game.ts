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
const canvasSize = parameters.int("canvas_size", 1000, "s")

let t = 0
const fieldSize = new Vector(Math.floor(canvasSize / gridSize) * gridSize, Math.floor(canvasSize / gridSize) * gridSize)
const numberOfRows = Math.floor(fieldSize.y / gridSize)
const numberOfLines = Math.floor(fieldSize.x / gridSize)
const neighbourRadius = 1
const neighbourDiameter = neighbourRadius * 2 + 1
const grids: Grid[][] = []
const neighbours: Grid[][][] = []
const objects: Obj[] = []

const main = (p: p5) => {
  p.setup = () => {
    const canvas = p.createCanvas(fieldSize.x, fieldSize.y)
    canvas.id("canvas")
    canvas.parent("canvas-parent")

    setupGrids()
    setupNeighbours()
    setupObjects()
  }

  p.draw = () => {
    p.background(0xFF)

    objects.forEach(o => {
      const properties = o.grid.properties
      o.attributes.forEach(attribute => {
        attribute.execute(properties) // TODO: gridに渡す
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

function setupGrids(): void {
  for (let y = 0; y < numberOfRows; y += 1) {
    const line: Grid[] = []
    for (let x = 0; x < numberOfLines; x += 1) {
      const position = new Vector(x, y)
      const grid = new Grid(position)
      line.push(grid)
    }
    grids.push(line)
  }
}

function setupNeighbours(): void {
  for (let y = 0; y < numberOfRows; y += 1) {
    const line: Grid[][] = []
    for (let x = 0; x < numberOfLines; x += 1) {
      const position = new Vector(x, y)
      line.push(getNeighbours(position))
    }
    neighbours.push(line)
  }
}

function getNeighbours(position: Vector): Grid[] {
  // TODO: トーラスではなく、外周に壁を張る
  const neighbourGrids: Grid[] = []
  for (let j = position.x - neighbourRadius; j < neighbourDiameter; j += 1) {
    for (let i = position.y - neighbourRadius; i < neighbourDiameter; i += 1) {
      if (i === 0 && j === 0) {
        continue
      }
      const x = (i + numberOfLines) % numberOfLines
      const y = (j + numberOfRows) % numberOfRows
      neighbourGrids.push(grids[y][x])
    }
  }

  return neighbourGrids
}

function setupObjects(): void {
  const halfGridSize = gridSize / 2
  const objectSize = gridSize * 0.6
  const burnableAttribute = new Burnable(100, 10)
  const burnableRate = 0.5

  for (let y = 0; y < numberOfRows; y += 1) {
    for (let x = 0; x < numberOfLines; x += 1) {
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
    this._properties = { "temperature": 0}
  }

  public update(): void {

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
  public get grid(): Grid {
    const x = Math.floor(this.position.x / gridSize)
    const y = Math.floor(this.position.y / gridSize)

    return grids[y][x]
  }

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
