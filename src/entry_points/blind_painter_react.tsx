import * as p5 from "p5"
import React, { useState } from "react"
import ReactDOM from "react-dom"
import { Gene } from "../classes/gene"
import { GeneticActiveLife, GeneticLife, GeneticResource, MetaActiveLife } from "../classes/life"
import { calculateOrbitalVelocity, Vector } from "../classes/physics"
import { FrictedTerrain, Terrain } from "../classes/terrain"
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

const parameters = new URLParameter()
const DEBUG = parameters.boolean("debug", false)
const artMode = parameters.boolean("art_mode", false)
const size = parameters.int("size", 1200)
const lifeSize = parameters.float("life_size", 6)
const population = parameters.int("population", 4000)
const friction = parameters.float("friction", 0.99)
const mutationRate = parameters.float("mutation_rate", 0.03)

const startsWithSingleGene = true

let world: World
const backgroundTransparency = artMode ? 0x0 : 0xFF
const fieldWidth = size
const fieldHeight = Math.floor(fieldWidth * 0.6)
const worldSize = new Vector(fieldWidth, fieldHeight)
const gravityCenter = worldSize.mult(0.5)
const worldCenter = worldSize.div(2)
const gravity = 20
const immobilizedWidth = 0
const initialEnergy = 100

function reset() {
  const terrains: Terrain[] = [
    // new VanillaTerrain(worldSize, worldCenter, gravity, friction, immobilizedWidth),
    new FrictedTerrain(worldSize, friction),
  ]
  world = new PredPreyWorld(worldSize, terrains)

  const lives = randomLives(population, worldSize, 1)
  world.addLives(lives)

  const metaLives: MetaActiveLife[] = []
  for (let i = 0; i < 20; i += 1) {
    const position = new Vector(random(worldSize.x), random(worldSize.y))
    metaLives.push(new MetaActiveLife(position, randomLives(3, worldSize, undefined)))
  }
  world.addLives(metaLives)
}

function randomLives(numberOfLives: number, positionSpace: Vector, velocity?: number | undefined): GeneticActiveLife[] {
  const lives: GeneticActiveLife[] = []

  const initialGene = new Gene(0x99, 0x99) // Gene.random()

  for (let i = 0; i < numberOfLives; i += 1) {
    const position = new Vector(random(positionSpace.x), random(positionSpace.y))
    const gene = startsWithSingleGene ? initialGene : Gene.random()
    lives.push(new GeneticActiveLife(position, gene, lifeSize, initialEnergy, mutationRate))
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
    const canvas = p.createCanvas(fieldWidth, fieldHeight)
    canvas.id("canvas")
    canvas.parent("canvas-parent")
    reset()
  }

  p.draw = () => {
    p.background(0xFF, backgroundTransparency)

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
