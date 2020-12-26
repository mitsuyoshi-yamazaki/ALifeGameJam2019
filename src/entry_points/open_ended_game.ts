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
const defaultTextSize = 32
const objects: Obj[] = []

const main = (p: p5) => {
  p.setup = () => {
    const canvas = p.createCanvas(fieldSize.x, fieldSize.y)
    canvas.id("canvas")
    canvas.parent("canvas-parent")

    addAgents(30)
    add(Meat, 50, 30)
  }

  p.draw = () => {
    p.background(0xFF)

    objects.forEach(o => {
      o.attributes.forEach(attribute => {
        attribute.execute(o)
      })
      o.execute()
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
function addObjects(): void {
  const gridSize = 100
  const halfGridSize = gridSize / 2
  const objectSize = gridSize * 0.6
  const halfObjectSize = objectSize / 2
  const burnableRate = 0.5

  function attributes(): Attribute[] {
    if (random(1) > burnableRate) {
      return []
    }

    const burnableAttribute = new Burnable(100, 10)

    return [burnableAttribute]
  }

  const burningAttribute = new Burnable(100, 10)
  burningAttribute.isBurning = true

  objects.push(new Obj(new Vector(100, 100), objectSize, [burningAttribute]))

  for (let i = 0; i < 100; i += 1) {
    const position = Vector.random(halfObjectSize, canvasSize - halfObjectSize)
    const obj = new Obj(position, objectSize, attributes())
    objects.push(obj)
  }

  log(`${objects.length} objects`)
}

function addAgents(numberOfAgents: number): void {
  const agentSize = 60
  const halfSize = agentSize / 2

  for (let i = 0; i < numberOfAgents; i += 1) {
    const position = Vector.random(halfSize, canvasSize - halfSize)
    const obj = new Agent(position, agentSize, [])
    objects.push(obj)
  }

  log(`${objects.length} agents`)
}

function add<T extends Obj>(c: new (positon: Vector, size: number, attributes: Attribute[]) => T, numberOfObjects: number, size: number): void {
  const halfSize = size / 2

  for (let i = 0; i < numberOfObjects; i += 1) {
    const position = Vector.random(halfSize, canvasSize - halfSize)
    const obj = new c(position, size, [])
    objects.push(obj)
  }

  log(`${objects.length} agents`)
}

/// World

class World {
  public burned(obj: Obj): void {

  }
}

/// Objects

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

    // p.noStroke()
    // p.fill(0xFF, 0, 0, 0x40)
    // p.circle(position.x, position.y, size * 1.4)

    const textSize = 32
    p.textSize(textSize)
    p.text("🔥", position.x - textSize / 2, position.y + textSize / 2)
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

  public execute(): void {
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

class Meat extends Obj {
  public draw(p: p5): void {
    p.fill(0)
    p.textSize(defaultTextSize)
    p.text("🍖", this.position.x, this.position.y)
  }
}

/// Agent

class State<T> {
  public constructor(public value: T, public description: string) { }
}

class Agent extends Obj {
  private stomach = new State(0, "腹")
  public get state(): State<number> {
    let value = 0
    let description = "💤"
    value += this.stomach.value - 50
    if (this.stomach.value < 20) {
      description = "🍖"
    }

    return new State(value, description)
  }

  public constructor(position: Vector, size: number, attributes: Attribute[]) {
    super(position, size, attributes)
    this.stomach.value = Math.floor(random(100))
  }

  public execute(): void {

  }

  public draw(p: p5): void {
    p.noFill()
    p.strokeWeight(1.5)
    p.stroke(0x20)
    p.ellipse(this.position.x, this.position.y, this.size, this.size * 0.8)

    p.fill(0)
    p.textSize(defaultTextSize)
    p.text(this.state.description, this.position.x, this.position.y)
  }
}
