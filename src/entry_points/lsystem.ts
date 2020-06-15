import * as p5 from "p5"
import { Vector } from "../classes/physics"
import { parsedQueries } from "../utilities"

const parameters = parsedQueries()
// tslint:disable: no-string-literal
const DEBUG = parameters["debug"] ? true : false  // Caution: 0 turns to "0" and it's true. Use "" to disable it.
const size = parameters["size"] ? parseInt(parameters["size"], 10) : 1000
const numberOfAgents = parameters["agents"] ? parseInt(parameters["agents"], 10) : 1
const maxDepth = parameters["depth"] ? parseInt(parameters["depth"], 10) : 3
const rawRules = parameters["rules"]  // rules=A:-C+B+C,B:A
const rawConstants = parameters["constants"]  // constants=+:55,-:-55
// tslint:enable: no-string-literal

const canvasSize = new Vector(size, size)
const agents: Agent[] = []
const rules = parseRules(rawRules)
const constants = parseConstants(rawConstants)

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
    const lsystem = new LSystem(rules, constants)
    agents.push(new Agent(position, lsystem))
  }
}

function parseRules(raw: string | undefined): Map<string, string> {
  const map = new Map<string, string>()
  if (raw == undefined) {
    console.log(`No rule specified`)
    map.set("A", "-A++A")

    return map
  }
  const rawRuleSet = raw.split(",")
  rawRuleSet.forEach(line => {
    const keyValue = line.split(":")
    if (keyValue.length !== 2) {
      console.log(`[Warning] Parameter "rules" line "${line}" should be "<character>:<string>"`)

      return
    }
    map.set(keyValue[0], keyValue[1])
  })

  return map
}

function parseConstants(raw: string | undefined): Map<string, number> {
  const map = new Map<string, number>()
  if (raw == undefined) {
    console.log(`No constant specified`)
    map.set("+", 20)
    map.set("-", -20)

    return map
  }
  const rawRuleSet = raw.split(",")
  rawRuleSet.forEach(line => {
    const keyValue = line.split(":")
    if (keyValue.length !== 2) {
      console.log(`[Warning] Parameter "constants" line "${line}" should be "<character>:<number>"`)

      return
    }
    const angle = parseInt(keyValue[1], 10)
    if (angle === undefined) {
      console.log(`[Warning] Parameter "constants" line "${line}" should be "<character>:<number>"`)

      return
    }
    map.set(keyValue[0], angle)
  })

  return map
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
    this.lsystem.draw(p, "A", this.position, maxDepth)
  }
}

const sketch = new p5(main)
