import * as p5 from "p5"
import { Vector } from "../classes/physics"
import { parsedQueries } from "../utilities"

/**
 * TODO:
 * "Dynamic L-System"
 * Cellular Automata の処理を実装する
 * 一定 depth を超えると停止するようにする
 * 適当なGAを実装する
 * LSystemのルール適用時にランダムで適当な状態になるようにしたら"奇形"ができる
 * http://0.0.0.0:8000/pages/evo_devo.html?debug=1&speed=100&limit=6&position=0.5,0.5&rules=A:-A++B,B:A&constants=+:20,-:-20
 */

const parameters = parsedQueries()
// tslint:disable: no-string-literal
const DEBUG = parameters["debug"] ? true : false  // Caution: 0 turns to "0" and it's true. Use "" to disable it.
const size = parameters["size"] ? parseInt(parameters["size"], 10) : 1000
// const rawRules = parameters["rules"]  // rules=A:-C+B+C,B:A
// const rawConstants = parameters["constants"]  // constants=+:55,-:-55
const rawPosition = parameters["position"]  // 0.5,0.5
const speed = parameters["speed"] ? parseInt(parameters["speed"], 10) : 1000
const unitLength = parameters["length"] ? parseInt(parameters["length"], 10) : 100
const limit = parameters["limit"] ? parseInt(parameters["limit"], 10) : 6
// tslint:enable: no-string-literal

const initialState = "A"
const rawRules = "A:aAbB,B:A"
const rawConstants = "a:20,b:-40"

const staticStates = ["U", "V", "W", "X", "Y", "Z"]
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

    const system = new LSystem(parseRules(rawRules), parseConstants(rawConstants))
    const position = parsePosition()
    log(`position: ${String(position)}`)
    node = new Node(system, undefined, initialState, position, -90)
  }

  p.draw = () => {
    if (t % speed === 0) {
      log(`t: ${Math.floor(t / speed)}`)
      step()
    }
    p.background(0)
    node.draw(p)
    t += 1
    setTimestamp(t)
  }
}

function parseRules(raw: string | undefined): Map<string, string> {
  const map = new Map<string, string>()
  if (raw == undefined) {
    log(`No rule specified`)
    map.set("A", "-A++A")

    return map
  }
  const rawRuleSet = raw.split(",")
  rawRuleSet.forEach(line => {
    const keyValue = line.split(":")
    if (keyValue.length !== 2) {
      log(`[Warning] Parameter "rules" line "${line}" should be "<character>:<string>"`)

      return
    }
    map.set(keyValue[0], keyValue[1])
  })

  return map
}

function parseConstants(raw: string | undefined): Map<string, number> {
  const map = new Map<string, number>()
  if (raw == undefined) {
    log(`No constant specified`)
    map.set("+", 20)
    map.set("-", -20)

    return map
  }
  const rawRuleSet = raw.split(",")
  rawRuleSet.forEach(line => {
    const keyValue = line.split(":")
    if (keyValue.length !== 2) {
      log(`[Warning] Parameter "constants" line "${line}" should be "<character>:<number>"`)

      return
    }
    const angle = parseInt(keyValue[1], 10)
    if (angle === undefined) {
      log(`[Warning] Parameter "constants" line "${line}" should be "<character>:<number>"`)

      return
    }
    map.set(keyValue[0], angle)
  })

  return map
}

function parsePosition(): Vector {
  const defaultPosition = new Vector(canvasSize.x * 0.5, canvasSize.y * 0.9)
  if (rawPosition == undefined) {
    return defaultPosition
  }
  const components = rawPosition.split(",")
  if (components.length !== 2) {
    return defaultPosition
  }
  const x = parseFloat(components[0])
  const y = parseFloat(components[1])
  log(`raw position: ${x}, ${y}`)
  if (x == undefined || y == undefined) {
    return defaultPosition
  }

  return new Vector(canvasSize.x * Math.min(Math.max(x, 0), 1), canvasSize.y * Math.min(Math.max(y, 0), 1))
}

function step(): void {
  log(node.fullState())
  node.step()
}

class LSystem {
  public constructor(public readonly rules: Map<string, string>, public readonly constants: Map<string, number>) {
  }
}

class Node {
  public get currentState(): string {
    return this._currentState
  }
  public get nextState(): string {
    return this._nextState
  }
  public get direction(): number {
    return this._direction
  }
  public get history(): string {
    if (this.parent == undefined) {
      return ""
    }

    return this.parent.history + this.currentState
  }
  public get age(): number {
    return this._age
  }
  public get depth(): number {
    return this._depth
  }
  public get isLeaf(): boolean {
    return this.children.length === 0
  }
  public readonly children: Node[] = []
  public readonly caStates = new Map<string, number>()
  private _currentState: string
  private _nextState: string
  private _direction: number
  private readonly _history: string
  private _age = 0
  private readonly _depth: number
  public constructor(
    public readonly system: LSystem,
    public readonly parent: Node | undefined,
    state: string,
    public readonly position: Vector,
    direction: number,
  ) {
    this._currentState = state
    this._nextState = state
    this._direction = direction
    this._depth = this.history.length
  }

  public fullState(): string {
    let result = ""
    this.children.forEach(child => {
      result += child.fullState()
    })

    return this.currentState + result
  }

  public step(): void {
    this._age += 1
    this.stepLsystem()
    // this.stepCellularAutomata()

    this._currentState = this._nextState
  }

  public draw(p: p5): void {
    if (this.parent) {
      const weight = Math.max(Math.min(this.age / 1, (10 - (this.depth + 1) + 2)), 1)
      // log(`weight: ${weight}, age: ${this.age}`)
      p.strokeWeight(weight)
      p.noFill()

      // tslint:disable-next-line: strict-boolean-expressions
      const c = this.caStates.get("C") || 0
      const color = 255 - ((100 / limit) * c)

      p.stroke(color, 0xFF, color, 0xA0)
      p.line(this.parent.position.x, this.parent.position.y, this.position.x, this.position.y)
    }

    this.children.forEach(childNode => {
      childNode.draw(p)
    })
  }

  public neighbourhood(): Node[] {
    const result: Node[] = ([] as Node[]).concat(this.children)
    if (this.parent != undefined) {
      result.push(this.parent)
    }

    return result
  }

  public neighbourhoodStates(): Map<string, number> {
    const result = new Map<string, number>()

    this.neighbourhood()
      .forEach(neighbour => {
        neighbour.caStates.forEach((value, state) => {
          // tslint:disable-next-line: strict-boolean-expressions
          const currentValue = result.get(state) || 0
          if (currentValue > value) {
            if (currentValue <= 1) {
              result.delete(state)
            } else {
              result.set(state, currentValue - 1)
            }
          } else {
            if (value <= 1) {
              result.delete(state)
            } else {
              result.set(state, value - 1)
            }
          }
        })
      })

    return result
  }

  public nearbyChildren(state: string, depth: number): boolean {
    if (this.currentState === state) {
      return true
    }
    if (depth <= 0) {
      return false
    }
    for (const child of this.children) {
      if (child.nearbyChildren(state, depth - 1) === true) {
        return true
      }
    }

    return false
  }

  public nearbyParent(state: string, depth: number, from: Node): boolean {
    if (this.currentState === state) {
      return true
    }
    if (depth <= 0) {
      return false
    }
    if ((this.parent != undefined) && (this.parent.nearbyParent(state, depth - 1, this) === true)) {
      return true
    }
    for (const child of this.children) {
      if (child === from) {
        continue
      }
      if (child.nearbyChildren(state, depth - 1) === true) {
        return true
      }
    }

    return false
  }

  private stepLsystem(): void {
    this.children.forEach(child => {
      child.step()
    })

    if (this.depth > limit) {
      return
    }

    if (this.currentState === "B") {
      const targetState = "A"
      const depth = limit / 2
      if ((this.parent != undefined) && (this.nearbyParent(targetState, depth, this) === true)) {
        return
      }
      if (this.nearbyChildren(targetState, depth) === true) {
        return
      }
    }

    const nextCondition = this.system.rules.get(this.currentState)
    if (nextCondition != undefined) {
      const length = (1 / (this.depth + 1)) * unitLength

      for (const c of nextCondition) {
        const directionChange = this.system.constants.get(c)
        if (directionChange != undefined) {
          this._direction += directionChange
          continue
        }

        const radian = this.direction * (Math.PI / 180)
        const nextPosition = this.position.moved(radian, length)

        this.children.push(new Node(this.system, this, c, nextPosition, this.direction))
      }
    }

    if (this.currentState === "A") {
      this._nextState = "X"
    }
  }

  private stepCellularAutomata(): void {
    if (this.currentState === "C") {
      this._nextState = "A"
      this.caStates.set("C", limit)

      return
    }

    const neighbourhoodStates = this.neighbourhoodStates()
    // tslint:disable-next-line: strict-boolean-expressions
    const cValue = (neighbourhoodStates.get("C") || 0)
    if (cValue <= 0) {
      this._nextState = "C"

      return
    } else {
      this.caStates.set("C", cValue - 1)
    }

    // const neighbourhoodStates = this.neighbourhoodStates()
    // // tslint:disable-next-line: strict-boolean-expressions
    // if ((neighbourhoodStates.get("Z") || 0) <= 1) {
    //   const historyStates = new Map<string, number>()
    //   for (const c of this.history) {
    //     const n = historyStates.get(c) | 0
    //     historyStates.set(c, n + 1)
    //   }
    //   log(`[$ { this.history }], $ { historyStates.get("Z") } `)
    //   // tslint:disable-next-line: strict-boolean-expressions
    //   if ((historyStates.get("Z") || 0) > 2) {
    //     return
    //   }

    //   if (this.state === "X") {
    //     this._state = "A"

    //     return
    //   }
    //   if (this.state === "Y") {
    //     this._state = "B"

    //     return
    //   }
    // }
  }
}

const sketch = new p5(main)
