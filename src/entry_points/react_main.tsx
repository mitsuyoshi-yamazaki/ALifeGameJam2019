import * as p5 from "p5"
import React, { useState } from "react"
import { Button, ButtonGroup, Container, Dropdown, ToggleButton } from "react-bootstrap"
import ReactDOM from "react-dom"
import { isFunctionScopeBoundary } from "tslint/lib/utils"
import { Gene } from "../classes/gene"
import { ActiveLife, GeneticLife, GeneticResource, Life } from "../classes/life"
import { WorldObject } from "../classes/object"
import { calculateOrbitalVelocity, Force, Vector } from "../classes/physics"
import { Screenshot } from "../classes/screenshot"
import { FrictedTerrain, Terrain, VanillaTerrain } from "../classes/terrain"
import { PredPreyWorld, World } from "../classes/world"
import { VanillaWorld } from "../classes/world"
import { BoolParameterButton } from "../tsx/bool_parameter_button"
import { NumberParameterInput } from "../tsx/number_parameter_input"
import { ScreenShotButton } from "../tsx/screen_shot_button"
import { SelectionParameterRadioButton } from "../tsx/selectoin_parameter_radio_button"
import { TextParameterInput } from "../tsx/text_parameter_input"
import { Color, random, URLParameter } from "../utilities"

// tslint:disable-next-line:variable-name
const App = () => {

  const page = "react_main"

  return (
    <div className="App">
      <div id="canvas-parent"/>
      <ScreenShotButton/>
      <br/>
      <Button variant="primary" onClick={reset}>Restart</Button>
      <br/>
      <br/>
      <Container>
        <BoolParameterButton parameters={parameters} paramKey={"a"} page={page} defaultValue={false}
                             effect={value => artMode = value}>ArtMode</BoolParameterButton>
        <BoolParameterButton parameters={parameters} paramKey={"sr"} page={page} defaultValue={true}
                             effect={value => showResource = value}>showResource</BoolParameterButton>
        <NumberParameterInput parameters={parameters} paramKey={"t"} page={page} defaultValue={0}
                              effect={value => transparency = value}
                              detail={"opacity of the background in Art Mode.need page reload. 0-255"}
                              label={"background transparency"}/>
        <BoolParameterButton parameters={parameters} paramKey={"sg"} page={page} defaultValue={true}
                             effect={value => startsWithSingleGene = value}>startsWithSingleGene</BoolParameterButton>
        <NumberParameterInput parameters={parameters} paramKey={"p"} page={page} defaultValue={100}
                              effect={value => initialPopulation = value} detail={"initial population "} label={"initial population"}/>
        <NumberParameterInput parameters={parameters} paramKey={"f"} page={page} defaultValue={0.99}
                              effect={value => friction = value} detail={"friction 0.00-1.00"} label={"friction"}/>
        <NumberParameterInput parameters={parameters} paramKey={"gv"} page={page} defaultValue={20}
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
        <NumberParameterInput parameters={parameters} paramKey={"rr"} page={page} defaultValue={1}
                              effect={value => resourceGenerateRate = value} detail={"resourceGenerateRate"}
                              label={"resourceGenerateRate"}/>
      </Container>
      <br/>
      <br/>
      <br/>
      <br/>
    </div>
  )
}

const parameters = new URLParameter()
let artMode = parameters.boolean("art_mode", false, "a")  // アートモードで描画
let transparency = parameters.float("background_transparency", 0, "t")    // アートモード時の背景の透過（0-0xFF）
let initialPopulation = parameters.int("initial_population", 100, "p") // 初期個体数
let friction = parameters.float("friction", 0.1, "f")        // 運動に対する摩擦力（0-1）
let gravity = parameters.float("gravity", 0, "gv")        //
let immobilizedWidth = parameters.float("immobilizedWidth", 0, "im")        //
let initialEnergy = parameters.float("initialEnergy", 100, "e")        //
let resourceEnergy = parameters.float("resourceEnergy", 1000, "re")        //
let lifeSize = parameters.float("lifeSize", 12, "ls")        //
let startsWithSingleGene = parameters.boolean("startsWithSingleGene", true, "sg")        //
let mutationRate = parameters.float("mutation_rate", 0.03, "mr")  // 突然変異率（0-1）
let showResource = parameters.boolean("show_Resource", true, "sr")
let energyConsumptionRate = parameters.float("energyConsumptionRate", 0.1, "ec")
let resourceGenerateRate = parameters.float("resourceGenerateRate", 1, "rr")

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
      lives.push(new PaintActiveLife(position, gene, lifeSize, initialEnergy, mutationRate))
    }
    if (velocity != undefined) {
      lives.forEach(life => {
        life.velocity = new Vector(0, 0)
      })
    }

    return lives
  }
}

let world: World
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
    p.fill(0xFF, backgroundTransparency())
    p.rect(0, 0, fieldWidth, fieldHeight) // background() では動作しない

    const resources: GeneticLife[] = []
    const resourceSize = showResource ? lifeSize * 0.6 : 0
    for (let i = 0; i < resourceGenerateRate; i += 1) {
      const position = new Vector(random(fieldWidth * 0.99), random(fieldHeight * 0.99))
      const resource = new GeneticResource(position, Gene.random(), resourceSize, resourceEnergy)
      resource.velocity = calculateOrbitalVelocity(position, gravityCenter, gravity)
      resources.push(resource)
    }

    world.addLives(resources)
    world.next()
    world.draw(p)
  }

}

ReactDOM.render(<App/>, document.getElementById("root"))

const sketch = new p5(main)

export class PaintActiveLife extends ActiveLife {
  protected _gene: Gene
  protected _energy: number

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
  ) {
    super(position)
    this._size = size
    this._mass = 0.5
    this._energy = energy
    this._gene = gene
  }

  public eaten(): WorldObject[] {
    this._energy = 0

    return []
  }

  public next(): [Force, WorldObject[]] {
    if (this.isAlive === false) {
      return [Force.zero(), []]
    }

    const max = 1
    const vx = random(max, -max)
    const vy = random(max, -max)

    const force = new Force(new Vector(vx, vy))
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
    const offspring = new PaintActiveLife(position, gene, this.size, energyAfterReproduction, this.mutationRate)
    offspring.velocity = this.velocity.sized(-1)

    return [offspring]
  }
}
