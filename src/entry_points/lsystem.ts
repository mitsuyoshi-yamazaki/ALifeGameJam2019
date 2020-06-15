import * as p5 from "p5"
import { Vector } from "../classes/physics"
import { parsedQueries } from "../utilities"

const parameters = parsedQueries()
// tslint:disable: no-string-literal
const DEBUG = parameters["debug"] ? true : false  // Caution: 0 turns to "0" and it's true. Use "" to disable it.
const size = parameters["size"] ? parseInt(parameters["size"], 10) : 1000
const numberOfAgents = parameters["agents"] ? parseInt(parameters["agents"], 10) : 1
const maxDepth = parameters["depth"] ? parseInt(parameters["depth"], 10) : 3
const angle = parameters["angle"] ? parseInt(parameters["angle"], 10) : 40  // Debug parameter
// tslint:enable: no-string-literal

const canvasSize = new Vector(size, size)
const agents: Agent[] = []

function log(message: string): void {
  if (DEBUG === false) {
    return
  }
  console.log(message)
}

const main = (p: p5) => {
  p.setup = () => {
    const canvas = p.createCanvas(canvasSize.x, canvasSize.y)
    canvas.id("canvas")
    canvas.parent("canvas-parent")

    initializeAgents()
  }

  p.draw = () => {
    p.background(0)

    agents.forEach(agent => {
      agent.draw(p)
    })
  }
}

function initializeAgents(): void {
  for (let i = 0; i < numberOfAgents; i += 1) {
    const diff = new Vector(0, size * 0.1)
    const position = canvasSize.div(2)
      .add(diff)
    const rules = new Map<string, string>()
    rules.set("F", "-F++F")
    const constants = new Map<string, number>()
    constants.set("+", angle)
    constants.set("-", -angle)
    const lsystem = new LSystem(rules, constants)
    agents.push(new Agent(position, lsystem))
  }
}

interface Drawable {
  draw(p: p5): void
}

class Shape {
  public constructor() {
  }
}

class LSystem {
  public constructor(public readonly rules: Map<string, string>, public readonly constants: Map<string, number>) {
  }

  public draw(p: p5, initialCondition: string, position: Vector, depth: number): void {
    p.noFill()
    p.stroke(0xFF)
    p.strokeWeight(1)

    this.recursiveDraw(p, initialCondition, position, -90, depth)
  }

  private recursiveDraw(p: p5, condition: string, position: Vector, direction: number, depth: number): void {
    if (depth < 1) {
      return
    }

    let newDirection = direction
    const length = (depth / maxDepth) * 100

    for (const c of condition) {
      const nextCondition = this.rules.get(c)
      if (nextCondition != undefined) {
        const radian = newDirection * (Math.PI / 180)
        const nextPosition = position.moved(radian, length)
        p.line(position.x, position.y, nextPosition.x, nextPosition.y)

        // log(`${String(position)} to ${String(nextPosition)}`)

        this.recursiveDraw(p, nextCondition, nextPosition, newDirection, depth - 1)
        continue
      }

      const directionChange = this.constants.get(c)
      if (directionChange != undefined) {
        newDirection += directionChange
        continue
      }

      // log(`End of tree: ${c}`)
    }
  }
}

class Agent implements Drawable {
  public constructor(public readonly position: Vector, public readonly lsystem: LSystem) {
  }

  public draw(p: p5): void {
    this.lsystem.draw(p, "F", this.position, maxDepth)
  }
}

const sketch = new p5(main)
