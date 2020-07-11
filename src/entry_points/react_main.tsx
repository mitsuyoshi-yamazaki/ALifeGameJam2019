import * as p5 from "p5"
import React, { useState } from "react"
import { Button, ButtonGroup, Container, Dropdown, ToggleButton } from "react-bootstrap"
import ReactDOM from "react-dom"
import { isFunctionScopeBoundary } from "tslint/lib/utils"
import { Gene } from "../classes/gene"
import { GeneticActiveLife, GeneticLife, GeneticResource, Life } from "../classes/life"
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
        <NumberParameterInput parameters={parameters} paramKey={"t"} page={page} defaultValue={0}
                              effect={value => transparency = value}
                              detail={"opacity of the background in Art Mode.need page reload. 0-255"}
                              label={"background transparency"}/>
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

    const lives = this.randomLives(4000, worldSize, 1)
    world.addLives(lives)
  }

  private randomLives(numberOfLives: number, positionSpace: Vector, velocity?: number | undefined): Life[] {
    const lives: GeneticActiveLife[] = []

    const initialGene = new Gene(0x99, 0x99) // Gene.random()

    for (let i = 0; i < numberOfLives; i += 1) {
      const position = new Vector(random(positionSpace.x), random(positionSpace.y))
      const gene = startsWithSingleGene ? initialGene : Gene.random()
      lives.push(new GeneticActiveLife(position, gene, lifeSize, initialEnergy, 0.03))
    }
    if (velocity != undefined) {
      lives.forEach(life => {
        life.velocity = new Vector(random(-velocity, velocity), random(-velocity, velocity))
      })
    }

    return lives
  }
}

const startsWithSingleGene = true

let world: World
const fieldWidth = 1200
const fieldHeight = Math.floor(fieldWidth * 10 / 16)
const worldSize = new Vector(fieldWidth, fieldHeight)
const gravityCenter = worldSize.mult(0.5)
const worldCenter = worldSize.div(2)
const gravity = 20
const friction = 0.99
const immobilizedWidth = 0
const initialEnergy = 100
const lifeSize = 6

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
    const resourceSize = lifeSize * 0.6
    const resourceEnergy = initialEnergy * 0.6
    const positionSpace = fieldWidth * 0.9
    for (let i = 0; i < 1; i += 1) {
      const position = new Vector(random(positionSpace), random(positionSpace))
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
