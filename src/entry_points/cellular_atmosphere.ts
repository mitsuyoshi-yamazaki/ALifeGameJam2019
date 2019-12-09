import * as p5 from "p5"
import { random } from "../utilities"

const main = (p: p5) => {
  let states: State[][] = []
  const size = 100
  const cellSize = 10

  p.setup = () => {
    const fieldSize = size * cellSize
    p.createCanvas(fieldSize, fieldSize)
    setupStates()
  }

  p.draw = () => {
    update()
    draw()
  }

  function draw(): void {
    p.noStroke()
    for (let y = 0; y < states.length; y += 1) {
      const row = states[y]
      for (let x = 0; x < row.length; x += 1) {
        const state = row[x]
        const xx = x * cellSize
        const yy = y * cellSize

        p.fill(state.color(p))
        p.rect(xx, yy, cellSize, cellSize)
      }
    }
  }

  function update(): void {
    for (let y = 0; y < states.length; y += 1) {
      const row = states[y]
      for (let x = 0; x < row.length; x += 1) {
        const state = row[x]
      }
    }
  }

  function setupStates(): void {
    states = []
    for (let y = 0; y < size; y += 1) {
      const row: State[] = []
      for (let x = 0; x < size; x += 1) {
        row.push(State.random())
      }
      states.push(row)
    }
  }
}

const sketch = new p5(main)

enum Material {
  Vacuum = 0,
  Hydrogen = 1,
  Nitrogen = 2,
  CarbonDioxide = 3,
}

function colorOf(material: Material, p: p5): p5.Color {
  switch (material) {
    case Material.Vacuum:
      return p.color(255)

    case Material.Hydrogen:
      return p.color(100, 221, 251)

    case Material.Nitrogen:
      return p.color(205, 160, 196)

    case Material.CarbonDioxide:
      return p.color(166, 180, 210)

    default:
      return p.color(0)
  }
}

class State {
  public material = Material.Hydrogen
  public pressure = 0

  public static random(): State {
    const state = new State()
    const materials: Material[] = [
      Material.Vacuum,
      Material.Hydrogen,
      Material.Nitrogen,
      Material.CarbonDioxide,
    ]
    const maxPressure = 20

    state.material = materials[Math.floor(random(materials.length))]

    const isVacuum = state.material === Material.Vacuum
    state.pressure = isVacuum ? 0 : random(maxPressure) + 1

    return state
  }

  public color(p: p5): p5.Color {
      return colorOf(this.material, p)
    }
}
