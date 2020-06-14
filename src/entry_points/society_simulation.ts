import * as p5 from "p5"
import { Vector } from "../classes/physics"
import { parsedQueries } from "../utilities"

/*
* まず一人のエージェントを作ってみる
*/

const parameters = parsedQueries()
// tslint:disable: no-string-literal
const DEBUG: boolean = parameters["debug"] ? parseInt(parameters["debug"], 10) > 0 : false
const size = parameters["size"] ? parseInt(parameters["size"], 10) : 800
const numberOfAgents = parameters["agents"] ? parseInt(parameters["agents"], 10) : 20
// tslint:enable: no-string-literal

let id = 0
const agents: Agent[] = []
const worldSize = new Vector(size, size)

const main = (p: p5) => {
  p.setup = () => {
    const canvas = p.createCanvas(worldSize.x, worldSize.y)
    canvas.id("canvas")
    canvas.parent("canvas-parent")

    for (let i = 0; i < numberOfAgents; i += 1) {
      const position = worldSize.randomized()
      agents.push(new Person(`${id}`, position))
      id += 1
    }
  }

  p.draw = () => {
    p.background(0)

    agents.forEach(agent => {
      agent.draw(p)
    })
  }
}

enum ObjectType {
  Object = 0,
  Agent = 1,
}

enum AgentType {
  Stone = 0,
  Tree = 1,
  Animal = 2,
  Person = 3,
}

class WorldObject {
  public id: string
  public position: Vector
  public type: ObjectType
  public enabled = true

  public constructor(id: string, position: Vector) {
    this.id = id
    this.position = position
    this.type = ObjectType.Object
  }

  public draw(p: p5): void { }
}

class Agent extends WorldObject {
  public inventory: WorldObject[]

  public constructor(id: string, position: Vector) {
    super(id, position)
    this.type = ObjectType.Agent
  }

  public move(agentsInView: Agent[]): void { }
}

class Animal extends Agent {  // TODO: 人間のつけたラベルではなく機能で命名する
  public id: string
  public position: Vector
  public inventory: WorldObject[] = []

  public move(agentsInView: Agent[]): void {
    // TODO:
  }

  public draw(p: p5): void {
    p.noFill()
    p.stroke(0xFF)
    p.circle(this.position.x, this.position.y, 10)
  }
}

interface Interaction<T extends WorldObject> {
  target: T
  self: Agent

  canInteract(): boolean
  do(): void
}

class ApproachInteraction implements Interaction<WorldObject, Agent> {
  public constructor(public readonly self: Agent, public readonly target: WorldObject) { }

  public canInteract(): boolean {
    return this.target.enabled
  }

  public do(): void {

  }

  public next(): Interaction<Agent, WorldObject> | null {
    if (this.target.type === ObjectType.Agent) {
      return new PickupInteraction(this.self, this.target as Agent)
    } else {
      // TODO:
      return undefined
    }
  }
}

class PickupInteraction implements Interaction<WorldObject, WorldObject> {
  public constructor(public readonly self: Agent, public readonly target: Agent) { }

  public canInteract(): boolean {
    return this.self.position.dist(this.target.position) < 10
  }

  public do(): void {

  }

  public next(): Interaction | null {
    return undefined
  }
}

class Person extends Agent {
  public id: string
  public position: Vector
  public inventory: WorldObject[] = []
  public fieldOfView = 100
  private readonly interaction: Interaction | null

  public move(agentsInView: Agent[]): void {
    if (this.interaction !== null && this.interaction.canInteract()) {
      this.interaction.do()
    } else {

    }
  }

  public draw(p: p5): void {
    p.noStroke()
    p.fill(0xFF)
    p.circle(this.position.x, this.position.y, 20)
  }
}

interface Gene {
  // まずは寿命は考えないものとする
  // メモリを制限するのであれば、Tierraのように仮想CPUにしたらどうか
}

// 遺伝子の距離（差異）を返す
function distant(lhs: Gene, rhs: Gene): number {
  return 0  // TODO:
}

const sketch = new p5(main)
