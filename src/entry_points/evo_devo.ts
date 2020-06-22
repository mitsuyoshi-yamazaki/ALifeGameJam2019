import * as p5 from "p5"
import { Vector } from "../classes/physics"
import { parsedQueries } from "../utilities"

const parameters = parsedQueries()
// tslint:disable: no-string-literal
const DEBUG = parameters["debug"] ? true : false  // Caution: 0 turns to "0" and it's true. Use "" to disable it.
const size = parameters["size"] ? parseInt(parameters["size"], 10) : 1000
const rawRules = parameters["rules"]  // rules=A:-C+B+C,B:A
const speed = parameters["speed"] ? parseInt(parameters["speed"], 10) : 1
// tslint:enable: no-string-literal

const canvasSize = new Vector(size, size)
let node: Node
let t = 0

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

    node = new Node(parseRules(rawRules), undefined, "A")
  }

  p.draw = () => {
    if (t % speed === 0) {
      step()
    }
    p.background(0)
    node.draw(p)
    t += 1
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

function step(): void {
  log(node.fullState())
  node.step()
}

class Node {
  public get state(): string {
    return this._state
  }
  public readonly children: Node[] = []
  private readonly _state: string
  private matured = false
  public constructor(public readonly rules: Map<string, string>, public readonly parent: Node | null, initialState: string) {
    this._state = initialState
  }

  public fullState(): string {
    if (this.matured === false) {
      return this.state
    }

    let result = ""
    this.children.forEach(child => {
      result += child.fullState()
    })

    return result
  }

  public step(): void {
    if (this.matured === false) {
      this.matured = true
      const nextCondition = this.rules.get(this.state)
      if (nextCondition != undefined) {
        for (const c of nextCondition) {
          this.children.push(new Node(this.rules, this, c))
        }
      }
    } else {
      this.children.forEach(child => {
        child.step()
      })
    }
  }

  public draw(p: p5): void {
    // TODO:

    this.children.forEach(childNode => {
      childNode.draw(p)
    })
  }

  public neighbourhood(): Node[] {
    const result: Node[] = this.children
    if (this.parent != undefined) {
      result.push(this.parent)
    }

    return result
  }

  public neighbourhoodStates(): Map<string, number> {
    const result = new Map<string, number>()

    this.neighbourhood().forEach(neighbour => {
      const value = (result.get(neighbour.state) | 0) + 1
      result.set(neighbour.state, value)
    })

    return result
  }

  // private recursiveDraw(p: p5, condition: string, position: Vector, direction: number, depth: number, previousCenter: Vector | undefined): void {
  //   if (depth < 1) {
  //     return
  //   }

  //   let newDirection = direction
  //   const length = Math.pow(0.9, maxDepth - depth) * unitLength

  //   for (const c of condition) {
  //     const directionChange = this.constants.get(c)
  //     if (directionChange != undefined) {
  //       newDirection += directionChange
  //       continue
  //     }

  //     const radian = newDirection * (Math.PI / 180)
  //     const nextPosition = position.moved(radian, length)
  //     // p.line(position.x, position.y, nextPosition.x, nextPosition.y)
  //     const center = nextPosition.add(position)
  //       .div(2)
  //     p.strokeWeight(1)
  //     if (drawCircle) {
  //       p.circle(center.x, center.y, length * 0.5)
  //     }
  //     if (drawLine && (previousCenter != undefined)) {
  //       p.strokeWeight(0.5)
  //       p.line(center.x, center.y, previousCenter.x, previousCenter.y)
  //     }

  //     const nextCondition = this.rules.get(c)
  //     if (nextCondition != undefined) {
  //       this.recursiveDraw(p, nextCondition, nextPosition, newDirection, depth - 1, center)
  //       continue
  //     }
  //   }
  // }
}

const sketch = new p5(main)
