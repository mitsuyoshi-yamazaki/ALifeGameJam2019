import { Button } from "@material-ui/core"
import * as tf from "@tensorflow/tfjs"
import { Tensor } from "@tensorflow/tfjs-core"
import * as p5 from "p5"
import React, { useState } from "react"
import ReactDOM from "react-dom"
import { Gene } from "../classes/gene"
import { ActiveLife, GeneticActiveLife, GeneticLife, GeneticResource, Life } from "../classes/life"
import { WorldObject } from "../classes/object"
import { calculateOrbitalVelocity, Force, Vector } from "../classes/physics"
import { Terrain, VanillaTerrain } from "../classes/terrain"
import { PredPreyWorld, World } from "../classes/world"
import { BaseChart } from "../tsx/base_chart"
import { BaseGrid } from "../tsx/base_grid"
import { BoolParameterButton } from "../tsx/bool_parameter_button"
import { NumberParameterInput } from "../tsx/number_parameter_input"
import { ScreenShotButton } from "../tsx/screen_shot_button"
import { random, URLParameter } from "../utilities"

// tslint:disable:newline-per-chained-call
// tslint:disable:whitespace
// tslint:disable-next-line:variable-name
const App = () => {
  const [dataRowTick1, setDataRowTick1] = useState([] as DataRowTick[])
  const [dataRowTick2, setDataRowTick2] = useState([] as DataRowTick[])

  updateChart = (_world: World) => {
    const newRow = {
      "tick": world.t, "count": world.lives.filter(life => {
                                                     return life instanceof GeneticActiveLife
                                                   },
      ).length,
    }
    if (_world.t % 100 === 1) {
      if (dataRowTick1.length > 20) {
        dataRowTick1.shift()
      }
      setDataRowTick1([...dataRowTick1, newRow])
    }
    if (_world.t % 500 === 1) {
      if (dataRowTick2.length > 100) {
        dataRowTick2.shift()
      }
      setDataRowTick2([...dataRowTick2, newRow])
    }
  }

  const page = "nn_sample"

  return (
    <div className="App">
      <div id="canvas-parent"/>
      <ScreenShotButton/>
      <br/>
      <Button variant="contained" onClick={reset}>Restart</Button>
      <br/>
      <br/>
      <BoolParameterButton parameters={parameters} paramKey={"a"} page={page} defaultValue={false}
                           effect={value => artMode = value}>ArtMode</BoolParameterButton>
      <BoolParameterButton parameters={parameters} paramKey={"sr"} page={page} defaultValue={true}
                           effect={value => showResource = value}>showResource</BoolParameterButton>
      <NumberParameterInput parameters={parameters} paramKey={"t"} page={page} defaultValue={0}
                            effect={value => transparency = value}
                            detail={"opacity of the background in Art Mode.need page reload. 0-255"}
                            label={"background transparency"}/>
      <BoolParameterButton parameters={parameters} paramKey={"sg"} page={page} defaultValue={false}
                           effect={value => startsWithSingleGene = value}>startsWithSingleGene</BoolParameterButton>
      <NumberParameterInput parameters={parameters} paramKey={"p"} page={page} defaultValue={10}
                            effect={value => initialPopulation = value} detail={"initial population "} label={"initial population"}/>
      <NumberParameterInput parameters={parameters} paramKey={"f"} page={page} defaultValue={0.99}
                            effect={value => friction = value} detail={"friction 0.00-1.00"} label={"friction"}/>
      <NumberParameterInput parameters={parameters} paramKey={"gv"} page={page} defaultValue={0}
                            effect={value => gravity = value} detail={"gravity"} label={"gravity"}/>
      <NumberParameterInput parameters={parameters} paramKey={"im"} page={page} defaultValue={0}
                            effect={value => immobilizedWidth = value} detail={"immobilizedWidth"} label={"immobilizedWidth"}/>
      <NumberParameterInput parameters={parameters} paramKey={"e"} page={page} defaultValue={100}
                            effect={value => initialEnergy = value} detail={"initialEnergy"} label={"initialEnergy"}/>
      <NumberParameterInput parameters={parameters} paramKey={"re"} page={page} defaultValue={100}
                            effect={value => resourceEnergy = value} detail={"resourceEnergy"} label={"resourceEnergy"}/>
      <NumberParameterInput parameters={parameters} paramKey={"mr"} page={page} defaultValue={0.03}
                            effect={value => mutationRate = value} detail={"mutation rate 0.00-1.00"} label={"mutation rate"}/>
      <NumberParameterInput parameters={parameters} paramKey={"ls"} page={page} defaultValue={6}
                            effect={value => lifeSize = value} detail={"lifeSize"} label={"lifeSize"}/>
      <NumberParameterInput parameters={parameters} paramKey={"ec"} page={page} defaultValue={0.01}
                            effect={value => energyConsumptionRate = value} detail={"energyConsumptionRate"}
                            label={"energyConsumptionRate"}/>
      <NumberParameterInput parameters={parameters} paramKey={"rr"} page={page} defaultValue={0.01}
                            effect={value => resourceGenerateRate = value} detail={"resourceGenerateRate"}
                            label={"resourceGenerateRate"}/>
      <br/>
      <BaseGrid title={"grid short term"} initialRows={dataRowTick1} columns={columns}/>
      <BaseChart title={"chart short term"} initialRows={dataRowTick1}/>
      <BaseGrid title={"grid long term"} initialRows={dataRowTick2} columns={columns}/>
      <BaseChart title={"chart long term"} initialRows={dataRowTick2}/>
      <br/>
      <br/>
      <br/>
    </div>
  )
}

let updateChart: (world: World) => void

interface DataRowTick {
  tick: number,
  count: number
}

const columns = [{"name": "tick", "title": "tick"},
                 {"name": "count", "title": "Count"}]

const parameters = new URLParameter()
let artMode = parameters.boolean("art_mode", false, "a")  // アートモードで描画
let transparency = parameters.float("background_transparency", 0, "t")    // アートモード時の背景の透過（0-0xFF）
let initialPopulation = parameters.int("initial_population", 10, "p") // 初期個体数
let friction = parameters.float("friction", 0.1, "f")        // 運動に対する摩擦力（0-1）
let gravity = parameters.float("gravity", 0, "gv")        //
let immobilizedWidth = parameters.float("immobilizedWidth", 0, "im")        //
let initialEnergy = parameters.float("initialEnergy", 10, "e")        //
let resourceEnergy = parameters.float("resourceEnergy", 1000, "re")        //
let lifeSize = parameters.float("lifeSize", 12, "ls")        //
let startsWithSingleGene = parameters.boolean("startsWithSingleGene", true, "sg")        //
let mutationRate = parameters.float("mutation_rate", 0.03, "mr")  // 突然変異率（0-1）
let showResource = parameters.boolean("show_Resource", true, "sr")
let energyConsumptionRate = parameters.float("energyConsumptionRate", 0.1, "ec")
let resourceGenerateRate = parameters.float("resourceGenerateRate", 0, "rr")

function backgroundTransparency() {
  return artMode ? transparency : 0xFF
}

let controller: Controller

function reset() {
  if (controller) {
    controller.reset()
  }
}

class Controller {
  public p: p5

  public constructor(p: p5) {
    this.p = p
  }

  public reset() {
    const terrains: Terrain[] = [
      new VanillaTerrain(worldSize, worldCenter, gravity, friction, immobilizedWidth),
      // new GravitationalTerrain(worldSize, gravityCenter, gravity),
    ]

    world = new PredPreyWorld(worldSize, terrains)

    const lives = this.randomLives(initialPopulation, worldSize, 1)
    world.addLives(lives)
    this.p.background(0xFF)

  }

  private randomLives(numberOfLives: number, positionSpace: Vector, velocity?: number | undefined): Life[] {
    const lives: PaintActiveLife[] = []

    const initialGene = new Gene(0x99, 0x99) // Gene.random()

    for (let i = 0; i < numberOfLives; i += 1) {
      const position = new Vector(random(positionSpace.x), random(positionSpace.y))
      const gene = startsWithSingleGene ? initialGene : Gene.random()
      lives.push(new PaintActiveLife(position, gene, lifeSize, initialEnergy, mutationRate, Brain.randomBrain()))
    }
    if (velocity != undefined) {
      lives.forEach(life => {
        life.velocity = new Vector(0, 0)
      })
    }

    return lives
  }
}

let world: PredPreyWorld
const fieldWidth = 1200
const fieldHeight = Math.floor(fieldWidth * 10 / 16)
const worldSize = new Vector(fieldWidth, fieldHeight)
const gravityCenter = worldSize.mult(0.5)
const worldCenter = worldSize.div(2)


const main = (p: p5) => {
  controller = new Controller(p)

  p.setup = () => {
    const canvas = p.createCanvas(fieldWidth, fieldHeight)
    canvas.id("canvas")
    canvas.parent("canvas-parent")
    reset()
  }

  p.draw = () => {
    function makeResource() {
      const position = new Vector(random(fieldWidth * 0.99), random(fieldHeight * 0.99))
      const resource = new GeneticResource(position, Gene.random(), resourceSize, resourceEnergy)
      resource.velocity = calculateOrbitalVelocity(position, gravityCenter, gravity)
      resources.push(resource)
    }

    p.fill(0xFF, backgroundTransparency())
    p.rect(0, 0, fieldWidth, fieldHeight) // background() では動作しない

    const resources: GeneticLife[] = []
    const resourceSize = showResource ? lifeSize * 0.6 : 0
    if (resourceGenerateRate < 1) {
      if (Math.random() < resourceGenerateRate) {
        makeResource()
      }
    } else {
      for (let i = 0; i < resourceGenerateRate; i += 1) {
        makeResource()
      }
    }

    world.addLives(resources)
    world.next()
    world.draw(p)
    updateChart(world)
  }

}

ReactDOM.render(<App/>, document.getElementById("root"))

const sketch = new p5(main)

class Brain {
  private _wih: Tensor
  private _who: Tensor

  public constructor(wih: Tensor, who: Tensor) {
    this._wih = wih
    this._who = who
  }

  public static randomBrain(): Brain {
    const wih = Brain.getRandomFillTensor(5, 6)
    const who = Brain.getRandomFillTensor(2, 5)

    return new Brain(wih, who)
  }

  private static getRandomFillTensor(a: number, b: number): Tensor {
    return tf.tensor2d(Array.from(Array(a * b).keys()).map(_ => random(1, -1)), [a, b])
  }

  public think(vx: number, vy: number, distFoodX: number, distFoodY: number, distNeighborX: number, distNeighborY: number): number[] {
    const input = tf.tensor1d([vx, vy, distFoodX, distFoodY, distNeighborX, distNeighborY])
    const h1 = this.af(this._wih.dot(input))
    const r = this.af(this._who.dot(h1)).mul(0.01).arraySync() as number[]
    const fx = r[0] ?? 0
    const fy = r[1] ?? 0

    return [fx, fy]
  }

  private af(tensor: Tensor): Tensor {
    return tensor.atan()
  }
}

export class PaintActiveLife extends ActiveLife {
  protected _brain: Brain
  protected _gene: Gene
  protected _energy: number
  protected will: Vector = Vector.zero()

  public get gene(): Gene {
    return this._gene
  }

  public get energy(): number {
    return this._energy
  }

  public get isAlive(): boolean {
    return this.energy > 0
  }

  public constructor(
    public position: Vector,
    gene: Gene,
    size: number,
    energy: number,
    // tslint:disable-next-line:no-shadowed-variable
    public readonly mutationRate: number,
    brain: Brain,
  ) {
    super(position)
    this._size = size
    this._mass = 0.5
    this._energy = energy
    this._gene = gene
    this._brain = brain
  }

  public eaten(): WorldObject[] {
    this._energy = 0

    return []
  }

  public next(): [Force, WorldObject[]] {
    if (this.isAlive === false) {
      return [Force.zero(), []]
    }

    // const max = 1
    // const vx = random(max, -max)
    // const vy = random(max, -max)
    if (world.t % 10 === 0) {
      let nFoodPosition = Vector.zero()
      let nFoodDist = 100000
      let nNeighborPosition = Vector.zero()
      let nNeighborDist = 100000
      world.lives.forEach(life => {
                            if (life === this) {
                              return
                            }
                            const dist = this.position.dist(life.position)
                            // FIXME 定数化
                            if (this.gene.canEat(life.gene, 0.9)) {
                              if (dist < nFoodDist) {
                                nFoodPosition = life.position.sub(this.position)
                                nFoodDist = life.position.dist(this.position)
                              }
                            }
                            if (life instanceof GeneticResource &&
                              life.gene.canEat(this.gene, 0.9)) {
                              if (dist < nNeighborDist) {
                                nNeighborPosition = life.position.sub(this.position)
                                nNeighborDist = life.position.dist(this.position)
                              }
                            }
                          },
      )

      const [vx, vy] = this._brain.think(this.velocity.x,
                                         this.velocity.y,
                                         nFoodPosition.x,
                                         nFoodPosition.y,
                                         nNeighborPosition.x,
                                         nNeighborPosition.y)
      this.will = new Vector(vx, vy)
    }
    const force = new Force(this.will)
    this._energy = Math.max(this.energy - (force.consumedEnergyWith(this.mass) * energyConsumptionRate), 0)

    const offsprings = this.reproduce()

    return [force, offsprings]
  }

  public draw(p: p5, anchor: Vector): void {
    if (this.isAlive) {
      p.noStroke()
      // if (this.energy < 1) {
      //   p.fill(255, 0, 0)
      // } else {
      p.fill(this.gene.color.p5(p, 0xFF))
      // }
    } else {
      p.noFill()
      // p.strokeWeight(1)
      // p.stroke(this.gene.color.p5(p, 0x80))
    }

    const diameter = this.size
    p.circle(this.position.x + anchor.x, this.position.y + anchor.y, diameter)
  }

  public eat(other: GeneticLife): WorldObject[] {
    this._energy += other.energy

    return other.eaten()
  }

  private reproduce(): PaintActiveLife[] {
    const reproductionEnergy = this.size
    if (this._energy <= (reproductionEnergy * 2)) {
      return []
    }

    const energyAfterReproduction = (this._energy - reproductionEnergy) / 2
    this._energy = energyAfterReproduction

    const position = this.position.add(this.velocity.sized(this.size * -2))
    let gene: Gene
    if (random(1) < this.mutationRate) {
      gene = this.gene.mutated()
    } else {
      gene = this.gene.copy()
    }
    const offspring = new PaintActiveLife(position, gene, this.size, energyAfterReproduction, this.mutationRate, this._brain)
    offspring.velocity = this.velocity.sized(-1)

    return [offspring]
  }
}
