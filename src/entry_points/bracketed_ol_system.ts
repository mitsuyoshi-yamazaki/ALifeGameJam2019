import * as p5 from "p5"
import { Vector } from "../classes/physics"
import { parsedQueries } from "../utilities"

/**
 * ?debug=1&length=5&weight=1&depth=5&rules=F:F[+F]F[-F]F&constants=+:25.7,-:-25.7&condition=F
 * ?debug=1&length=10&weight=1&depth=5&rules=F:F[+F]F[-F][F]&constants=+:20,-:-20&condition=F
 * ?debug=1&length=8&weight=1&depth=5&rules=F:FF-[-F+F+F]+[+F-F-F]&constants=+:22.5,-:-22.5&condition=F
 * ?debug=1&length=1&weight=1&depth=7&rules=X:F[+X][-X]FX,F:FF&constants=+:25.7,-:-25.7&condition=X
 */

const parameters = parsedQueries()
// tslint:disable: no-string-literal
const DEBUG = parameters["debug"] ? true : false  // Caution: 0 turns to "0" and it's true. Use "" to disable it.
const size = parameters["size"] ? parseInt(parameters["size"], 10) : 1000
const maxDepth = parameters["depth"] ? parseInt(parameters["depth"], 10) : 5
const rawRules = parameters["rules"]  // rules=F:F[+F]F[-F]F
const rawConstants = parameters["constants"]  // constants=+:25.7,-:-25.7
const initialCondition = parameters["condition"]  // condition=F
const unitLength = parameters["length"] ? parseInt(parameters["length"], 10) : 100
const unitWeight = parameters["weight"] ? parseFloat(parameters["weight"]) : 1
// tslint:enable: no-string-literal

const canvasSize = new Vector(size, size)
let agent: Agent
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

    const diff = new Vector(0, size * 0.4)
    const position = canvasSize.div(2)
      .add(diff)
    const lsystem = new BracketedOLSystem(rules, constants)
    agent = new Agent(position, lsystem)
  }

  p.draw = () => {
    p.background(0)
    agent.draw(p)
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
    const angle = parseFloat(keyValue[1])
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

class Coordinate {
  public constructor(public readonly direction: number, public readonly position: Vector) {
  }
}

class BracketedOLSystem {
  public constructor(public readonly rules: Map<string, string>, public readonly constants: Map<string, number>) {
  }

  public draw(p: p5, initialCondition: string, position: Vector, depth: number): void {
    p.noFill()
    p.strokeWeight(unitWeight)
    p.stroke(0xFF, 0x80)

    const state = this.getResult(initialCondition, depth)
    const stack: Coordinate[] = []

    // TODO: 文字によりlenghtを変える
    const length = unitLength

    let currentPosition = position
    let currentDirection = -90  // 上向き

    for (const c of state) {
      if (c === "[") {
        stack.push(new Coordinate(currentDirection, currentPosition))
        // log(`push ${currentDirection}, ${String(currentPosition)}`)
        continue
      }
      if (c === "]") {
        const coordinate = stack.pop()
        if (coordinate == undefined) {
          log(`ERROR Stack is empty`)
          continue
        }
        // log(`pop ${currentDirection} -> ${coordinate.direction}, ${String(currentPosition)} -> ${String(coordinate.position)}`)
        currentDirection = coordinate.direction
        currentPosition = coordinate.position
        continue
      }

      const directionChange = this.constants.get(c)
      if (directionChange != undefined) {
        // log(`direction ${currentDirection} -> ${currentDirection + directionChange}`)
        currentDirection += directionChange
        continue
      }

      // 文字であった場合
      const radian = currentDirection * (Math.PI / 180)
      const nextPosition = currentPosition.moved(radian, length)
      p.line(currentPosition.x, currentPosition.y, nextPosition.x, nextPosition.y)
      // log(`draw ${String(currentPosition)} -> ${String(nextPosition)}`)
      currentPosition = nextPosition
    }
    // log(`END`)
  }

  private getResult(condition: string, depth: number): string {
    if (depth < 1) {
      return condition
    }

    let result = condition
    this.rules.forEach((value, key) => {
      const components = result.split(key)
      result = components.join(value)
    })
    // log(`getResult "${condition}" -> "${result}"`)

    return this.getResult(result, depth - 1)
  }
}

class Agent implements Drawable {
  public constructor(public readonly position: Vector, public readonly lsystem: BracketedOLSystem) {
  }

  public draw(p: p5): void {
    const condition = initialCondition == undefined ? "A" : initialCondition
    this.lsystem.draw(p, condition, this.position, maxDepth)
  }
}

const sketch = new p5(main)
