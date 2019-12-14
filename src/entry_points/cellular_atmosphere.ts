import * as p5 from "p5"
import { random } from "../utilities"

let t = 0
const cells: Cell[][] = []
const size = 100
const cellSize = 1000 / size
const maxPressure = 1000
const radius = 1
const diameter = radius * 2 + 1
const numberOfNeighbors = (radius + 1) * radius * 4

const main = (p: p5) => {
  p.setup = () => {
    const fieldSize = size * cellSize
    p.createCanvas(fieldSize, fieldSize)
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
  }

  function draw(): void {
    p.noStroke()
    const white = p.color(255)

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
      }
    }
  }

  function update(): void {
    cells.forEach(row => {
      row.forEach(cell => {
        cell.next()
      })
      console.log(`${String(row.map(cell => cell.currentState.pressure))}`)
    })

    for (let y = 0; y < cells.length; y += 1) {
      const row = cells[y]
      for (let x = 0; x < row.length; x += 1) {
        const cell = row[x]

        const neighbourCells: Cell[] = []
        for (let j = -radius; j <= radius; j += 1) {
          for (let i = -radius; i <= radius; i += 1) {
            if ((i === 0) && (j === 0)) {
              continue
            }
            const neighbour = cells[(y + j + size) % size][(x + i + size) % size]
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
            cell.nextState.pressure = 0
          }
        } else {
          const sameMaterialCells = neighbourCells.filter(c => {
            return c.currentState.material === cell.currentState.material
          })

          sameMaterialCells.forEach(neighbour => {
            if (neighbour.currentState.pressure > cell.currentState.pressure) { // 絶対値の小さい方に floor しなければ気圧が負数をとりうるため
              const pressureDifference = (neighbour.currentState.pressure - cell.currentState.pressure) / numberOfNeighbors
              const transferAmount = Math.floor(transferAmountOf(cell.currentState.material, pressureDifference))
              if (transferAmount < 1) {
                return
              }
              cell.nextState.pressure += transferAmount
              // console.log(`${cell.currentState.pressure} + ${transferAmount}`)
            } else {
              const pressureDifference = (cell.currentState.pressure - neighbour.currentState.pressure) / numberOfNeighbors
              const transferAmount = Math.floor(transferAmountOf(cell.currentState.material, pressureDifference))
              if (transferAmount < 1) {
                return
              }
              cell.nextState.pressure -= transferAmount
              // console.log(`${cell.currentState.pressure} - ${transferAmount}`)
            }
            // console.log(`${cell.nextState.pressure}`)
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
        const cell = new Cell(state)
        row.push(cell)
      }
      cells.push(row)
    }

    const maxPressureState = new State()
    maxPressureState.pressure = maxPressure
    const fixedCell = new FixedCell(maxPressureState)
    const centerIndex = Math.round(size / 2)
    cells[centerIndex][centerIndex] = fixedCell
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

function transferAmountOf(material: Material, pressureDifference: number): number {
  let flowRate: number
  switch (material) {
    case Material.Vacuum:
      return 0

    case Material.Hydrogen:
      flowRate = 2
      break

    case Material.Nitrogen:
      flowRate = 3
      break

    case Material.CarbonDioxide:
      flowRate = 4
      break

    default:
      return 0
  }

  const maxTransferAmount = maxPressure / 50

  return Math.min(pressureDifference / flowRate, maxTransferAmount)
}

class Cell {
  public get currentState(): State {
    return this._currentState
  }
  public get nextState(): State {
    return this._nextState
  }
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
  public next(): void {
    this._nextState = this.currentState.clone()
  }
}

class State {
  public static minimumPressure = 1
  public material = Material.Hydrogen
  private _pressure = 0
  public set pressure(value: number) {
    if (value <= 0) {
      this._pressure = 0

      return
    }
    this._pressure = value
  }
  public get pressure(): number {
    return this._pressure
  }

  public static random(): State {
    const state = new State()
    const materials: Material[] = [
      Material.Vacuum,
      Material.Hydrogen,
      // Material.Nitrogen,
      // Material.CarbonDioxide,
    ]

    state.material = materials[Math.floor(random(materials.length))]

    const isVacuum = state.material === Material.Vacuum
    state.pressure = isVacuum ? 0 : Math.floor(random(maxPressure))

    return state
  }

  public color(p: p5): p5.Color {
    return colorOf(this.material, p)
  }

  public clone(): State {
    const state = new State()
    state.material = this.material
    state.pressure = this.pressure

    return state
  }
}

function pressureOf(state: State, surroundings: State[]): number {
   return 0	// TODO: materialが異なれば与えるpressureが異なる？
}

// function transference(to: State, from: State, pressure): number {
//   if (to.material != ) {

//     }
// }
