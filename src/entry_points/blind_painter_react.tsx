import * as p5 from "p5"
import React, { useState } from "react"
import ReactDOM from "react-dom"
import { isFunctionScopeBoundary } from "tslint/lib/utils"
import { Gene } from "../classes/gene"
import { GeneticActiveLife, GeneticLife, GeneticResource, Life, MetaActiveLife } from "../classes/life"
import { calculateOrbitalVelocity, Vector } from "../classes/physics"
import { FrictedTerrain, Terrain, VanillaTerrain } from "../classes/terrain"
import { PredPreyWorld, World } from "../classes/world"
import { random, URLParameter } from "../utilities"

// tslint:disable-next-line:variable-name
const App = () => {

  return (
    <div>
      <p>Blind Painter</p>
      <div id="canvas-parent"/>
      <button onClick={ reset}>Restart</button>
    </div>
  )
}

ReactDOM.render(<App/>, document.getElementById("root"))
//
// const parameters = new URLParameter()
// const DEBUG = parameters.boolean("debug", false)
// const artMode = parameters.boolean("art_mode", false)
// const size = parameters.int("size", 1200)
// const lifeSize = parameters.float("life_size", 6)
// const population = parameters.int("population", 4000)
// const friction = parameters.float("friction", 0.99)
// const mutationRate = parameters.float("mutation_rate", 0.03)

const startsWithSingleGene = true

let world: World
const backgroundTransparency = 0xFF
const fieldWidth = 1200
const fieldHeight = Math.floor(fieldWidth * 1)
const worldSize = new Vector(fieldWidth, fieldHeight)
const gravityCenter = worldSize.mult(0.5)
const worldCenter = worldSize.div(2)
const gravity = 20
const friction = 0.99
const immobilizedWidth = 0
const initialEnergy = 100
const lifeSize = 6

function reset() {
  const terrains: Terrain[] = [
    new VanillaTerrain(worldSize, worldCenter, gravity, friction, immobilizedWidth),
    // new GravitationalTerrain(worldSize, gravityCenter, gravity),
  ]
  world = new PredPreyWorld(worldSize, terrains)

  const lives = randomLives(4000, worldSize, 1)
  world.addLives(lives)

}

function randomLives(numberOfLives: number, positionSpace: Vector, velocity?: number | undefined): Life[] {
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

const main = (p: p5) => {

  p.setup = () => {
    p.createCanvas(fieldWidth, fieldHeight)
    reset()
  }

  p.draw = () => {
    p.fill(0xFF, backgroundTransparency)
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

let sketch = new p5(main)
