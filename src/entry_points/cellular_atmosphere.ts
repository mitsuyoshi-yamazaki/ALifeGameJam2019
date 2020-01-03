import * as p5 from "p5"
import { parsedQueries, random } from "../utilities"

enum Material {
  Wall,
  Vacuum,
  Hydrogen,
  Nitrogen,
  CarbonDioxide,
}

const parameters = parsedQueries()
// tslint:disable: no-string-literal
const DEBUG = parameters["debug"] ? true : false  // Caution: 0 turns to "0" and it's true. Use "" to disable it.
const size = parameters["size"] ? parseInt(parameters["size"], 10) : 100
const isSpringEnabled = parameters["spring"] ? true : false
const radius = 1 // parameters["r"] ? parseInt(parameters["r"], 10) : 1  // FixMe: Not working when r > 1
const gravity = parameters["gravity"] ? parseInt(parameters["gravity"], 10) : 1
const materials: Material[] = (() => {
  const given = parameters["materials"]
  if (given == undefined) {
    return [
      Material.Hydrogen,
      Material.Nitrogen,
    ]
  }

  return given.split(",")
    .map((e: string) => {
      return Material[e]
    })
})()
// tslint:enable: no-string-literal

let t = 0
const cells: Cell[][] = []
const cellSize = 1000 / size
const maxPressure = 1000
const diameter = radius * 2 + 1
const numberOfNeighbors = (radius + 1) * radius * 4

const main = (p: p5) => {
  p.setup = () => {
    const fieldSize = size * cellSize
    const canvas = p.createCanvas(fieldSize, fieldSize)
    canvas.id("canvas")
    canvas.parent("canvas-parent")
    setupCells()
  }

  p.draw = () => {
    if (t % 10 !== 0) {
      t += 1

      return
    }
    update()
    draw()
    t += 1
    setTimestamp(t)
  }

  function draw(): void {
    p.noStroke()
    const white = p.color(255)
    const textSize = cellSize / 10
    const cellRadius = cellSize / 2
    const indicatorRectSize = cellSize / 10
    const showDebugInfo = DEBUG && (indicatorRectSize > 5)

    for (let y = 0; y < cells.length; y += 1) {
      const row = cells[y]
      for (let x = 0; x < row.length; x += 1) {
        const cell = row[x]
        const xx = x * cellSize
        const yy = y * cellSize

        const progress = Math.min(cell.currentState.pressure / maxPressure, 1)
        const color = p.lerpColor(white, cell.currentState.color(p), progress)
        p.fill(color)
        p.rect(xx, yy, cellSize, cellSize)

        if (showDebugInfo) {
          p.textSize(textSize)
          p.fill(0)
          p.text(`${cell.currentState.pressure}, ${cell.imaginaryPressure}`, xx, yy + cellRadius)
          p.fill(cell.currentState.color(p))
          p.rect(xx, yy, indicatorRectSize, indicatorRectSize)
        }
      }
    }
  }

  // tslint:disable-next-line: cyclomatic-complexity
  function update(): void {
    let mass = 0

    cells.forEach(row => {
      row.forEach(cell => {
        cell.next()
      })
      // console.log(`${String(row.map(cell => cell.currentState.pressure))}`)
    })

    for (let y = 0; y < cells.length; y += 1) {
      const row = cells[y]
      for (let x = 0; x < row.length; x += 1) {
        const cell = row[x]
        mass += cell.currentState.mass

        if (!cell.isActive) {
          continue
        }

        // TODO: updateVacuum(), updateGas() に分割する
        if (cell.currentState.material === Material.Vacuum) {
          cell.imaginaryPressure = 0
          continue
        }

        let additionalPressure = 0
        const neighbourCells: Cell[] = []
        for (let j = -radius; j <= radius; j += 1) {
          for (let i = -radius; i <= radius; i += 1) {
            if ((i === 0) && (j === 0)) {
              continue
            }
            const neighbour = cells[(y + j + size) % size][(x + i + size) % size]
            if (!neighbour.isActive) {
              continue
            }
            neighbourCells.push(neighbour)

            if (j < 0) {
              // 重力
              // additionalPressure += neighbour.currentState.pressure * gravity
            }
          }
        }

        const pressures = new Map<Material, number>()
        neighbourCells.forEach(neighbour => {
          // tslint:disable-next-line: strict-boolean-expressions
          const pressure = pressures.get(neighbour.currentState.material) || 0
          pressures.set(neighbour.currentState.material, pressure + neighbour.currentState.pressure)
        })

        let largestPressure = 0
        let largestPressureMaterial: Material | null
        pressures.forEach((pressure, material) => {
          if (material === cell.currentState.material) {
            return
          }
          if (pressure > largestPressure) {
            largestPressureMaterial = material
            largestPressure = pressure
          }
        })

        if (largestPressureMaterial != undefined) {
          // tslint:disable-next-line: strict-boolean-expressions
          const currentMaterialPressure = pressures.get(cell.currentState.material) || 0
          additionalPressure = Math.max(largestPressure - currentMaterialPressure, 0)
        }

        cell.imaginaryPressure = cell.currentState.pressure + additionalPressure
      }
    }
    if (DEBUG) {
      console.log(`Mass: ${mass}`)
    }

    for (let y = 0; y < cells.length; y += 1) {
      const row = cells[y]
      for (let x = 0; x < row.length; x += 1) {
        const cell = row[x]
        if (!cell.isActive) {
          continue
        }

        const neighbourCells: Cell[] = []
        for (let j = -radius; j <= radius; j += 1) {
          for (let i = -radius; i <= radius; i += 1) {
            if ((i === 0) && (j === 0)) {
              continue
            }
            const neighbour = cells[(y + j + size) % size][(x + i + size) % size]
            if (!neighbour.isActive) {
              continue
            }
            neighbourCells.push(neighbour)
          }
        }

        if (cell.currentState.material === Material.Vacuum) {
          const pressures = new Map<Material, number>()
          neighbourCells.forEach(neighbour => {
            // tslint:disable-next-line: strict-boolean-expressions
            const pressure = pressures.get(neighbour.currentState.material) || 0
            pressures.set(neighbour.currentState.material, pressure + neighbour.currentState.pressure)
          })

          let largestPressure = 0
          let largestPressureMaterial: Material | null
          pressures.forEach((pressure, material) => {
            if (pressure > largestPressure) {
              largestPressureMaterial = material
              largestPressure = pressure
            }
          })

          if (largestPressureMaterial != undefined) {
            cell.nextState.material = largestPressureMaterial
            cell.nextState.mass = 0
          }
        } else {  // Not Vaccum
          const sameMaterialCells = neighbourCells.filter(c => {
            return c.currentState.material === cell.currentState.material
          })

          sameMaterialCells.forEach(neighbour => {
            if (neighbour.imaginaryPressure > cell.imaginaryPressure) { // 絶対値の小さい方に floor しなければ気圧が負数をとりうるため
              const pressureDifference = (neighbour.imaginaryPressure - cell.imaginaryPressure)
              const transferAmount = Math.min(transferAmountOf(cell.currentState.material, pressureDifference), neighbour.currentState.pressure) / numberOfNeighbors
              cell.nextState.mass += Math.floor(transferAmount)
            } else {
              const pressureDifference = (cell.imaginaryPressure - neighbour.imaginaryPressure)
              const transferAmount = Math.min(transferAmountOf(cell.currentState.material, pressureDifference), cell.currentState.pressure) / numberOfNeighbors
              cell.nextState.mass -= Math.floor(transferAmount)
            }
            if ((cell.nextState.pressure < numberOfNeighbors) && (cell.imaginaryPressure > 0)) {
              cell.nextState.mass = 0
              cell.nextState.material = Material.Vacuum
            }
          })
        }
      }
    }
  }

  function setupCells(): void {
    for (let y = 0; y < size; y += 1) {
      const row: Cell[] = []
      for (let x = 0; x < size; x += 1) {
        const state = State.random()
        // if (x > size * 0.25 && x < size * 0.75 && y > size * 0.25 && y < size * 0.75) {
        //   state.material = Material.Hydrogen
        // } else {
        //   state.material = Material.Nitrogen
        // }
        const cell = new Cell(state)
        row.push(cell)
      }
      cells.push(row)
    }

    if (isSpringEnabled) {
      const maxPressureState = new State()
      maxPressureState.mass = maxPressure
      const fixedCell = new FixedCell(maxPressureState)
      const centerIndex = Math.round(size / 2)
      cells[centerIndex][centerIndex] = fixedCell
    }

    const isWallEnabled = true
    if (isWallEnabled) {
      const y = size - 1
      const row = cells[y]

      for (let x = 0; x < row.length; x += 1) {
        cells[y][x] = FixedCell.wall()
      }
    }
  }
}

const sketch = new p5(main)

function colorOf(material: Material, p: p5): p5.Color {
  switch (material) {
    case Material.Wall:
      return p.color(128)

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

function transferAmountOf(material: Material, pressureDifference: number): number {
  let flowRate: number
  switch (material) {
    case Material.Wall:
      return 0

    case Material.Vacuum:
      return 0

    case Material.Hydrogen:
      flowRate = 20
      break

    case Material.Nitrogen:
      flowRate = 30
      break

    case Material.CarbonDioxide:
      flowRate = 40
      break

    default:
      return 0
  }

  return pressureDifference / flowRate
}

function pressurePerMass(material: Material): number {
  switch (material) {
    case Material.Wall:
      return 0

    case Material.Vacuum:
      return 0

    case Material.Hydrogen:
      return 1

    case Material.Nitrogen:
      return 0.5

    case Material.CarbonDioxide:
      return 0.001

    default:
      return 0
  }
}

class Cell {
  public get currentState(): State {
    return this._currentState
  }
  public get nextState(): State {
    return this._nextState
  }
  public get isActive(): boolean {
    return this.currentState.material !== Material.Wall
  }

  public imaginaryPressure = 0
  public gravityPressure = 0
  protected _currentState: State
  protected _nextState: State

  public constructor(state: State) {
    this._currentState = state
    this._nextState = this.currentState.clone()
  }

  public static random(): Cell {
    return new Cell(State.random())
  }

  public next(): void {
    this._currentState = this.nextState
    this._nextState = this.currentState.clone()
  }
}

class FixedCell extends Cell {
  public static wall(): FixedCell {
    const state = new State()

    state.material = Material.Wall
    state.mass = maxPressure / 2

    return new FixedCell(state)
  }

  public next(): void {
    this._nextState = this.currentState.clone()
  }
}

class State {
  public set mass(value: number) {
    this._mass = value
  }
  public get mass(): number {
    return this._mass
  }
  public get pressure(): number {
    return this.mass * pressurePerMass(this.material)
  }
  public material = Material.Hydrogen
  private _mass = 0

  public static random(): State {
    const state = new State()

    state.material = materials[Math.floor(random(materials.length))]

    const isVacuum = state.material === Material.Vacuum
    const pressure = isVacuum ? 0 : Math.floor(random(maxPressure))
    state.setPressure(pressure)

    return state
  }

  public color(p: p5): p5.Color {
    return colorOf(this.material, p)
  }

  public clone(): State {
    const state = new State()
    state.material = this.material
    state.mass = this.mass

    return state
  }

  private setPressure(pressure: number): void {
    this.mass = pressure / pressurePerMass(this.material)
  }
}
