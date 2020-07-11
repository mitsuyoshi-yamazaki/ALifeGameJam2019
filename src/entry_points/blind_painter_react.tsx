import * as p5 from "p5"
import React, { useState } from "react"
import { Button, ButtonGroup, Dropdown, ToggleButton } from "react-bootstrap"
import ReactDOM from "react-dom"
import { isFunctionScopeBoundary } from "tslint/lib/utils"
import { Life } from "../classes/life"
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
import { Color, random, URLParameter } from "../utilities"

// tslint:disable-next-line:variable-name
const App = () => {

  const modes = [
    {"name": "default", "value": "default"},
    {"name": "attracted", "value": "attracted"},
    {"name": "equidistant", "value": "equidistant"},
    {"name": "scroll", "value": "scroll"},
    {"name": "family", "value": "family"},
  ]
  const page = "blind_painter_react"

  return (
    <div className="App">
      <p>Blind Painter</p>
      <div id="canvas-parent"/>
      <ScreenShotButton/>
      <br/>
      <Button variant="primary" onClick={reset}>Restart</Button>
      <br/>
      <BoolParameterButton parameters={parameters} paramKey={"a"} page={page} defaultValue={false}
                           effect={value => artMode = value}>ArtMode</BoolParameterButton>
      <br/>
      <SelectionParameterRadioButton parameters={parameters} modes={modes} paramKey={"m"} page={page} defaultValue={"default"}
                                     effect={value => mode = value}/>
      <br/>
      <br/>
      <NumberParameterInput parameters={parameters} paramKey={"f"} page={page} defaultValue={0.99}
                            effect={value => friction = value} detail={"friction 0.00-1.00"} label={"friction"}/>
    </div>
  )
}

const parameters = new URLParameter()
const DEBUG = parameters.boolean("debug", true, "d")        // デバッグフラグ
let TEST = parameters.boolean("test", false, "t")           // テストを実行

// 実行モードを変更
// default: 通常
// attracted: 遺伝子ごとのアトラクタに誘引される
// equidistant: attracted のアトラクタを等間隔に配置
// scroll: アトラクタを世代で分割
// family: 自己複製する集団ごとにまとまりをつくる
let mode = parameters.string("mode", "default", "m")
let artMode = parameters.boolean("art_mode", false, "a")  // アートモードで描画
const transparency = parameters.float("background_transparency", 1, "t")    // アートモード時の背景の透過（0-0xFF）
const statisticsInterval = parameters.int("statistics_interval", 500, "si") // 統計情報の表示間隔
const size = parameters.int("size", 1000, "s")                  // canvas サイズ
let friction = parameters.float("friction", 0.99, "f")        // 運動に対する摩擦力（0-1）
const rawInitialGenes = parameters.string("initial_genes", "33c", "g") // 初期遺伝子の指定（hex）例: initial_genes=20e,169
const initialGeneType = parameters.int("initial_gene_type", 0, "ig")  // 初期ランダム遺伝子の種類 0: 無制限 initial_genes を指定しない場合のみ有効
const machineCount = parameters.int("initial_population", 100, "p") // 初期個体数
const mutationRate = parameters.float("mutation_rate", 0.03, "mr")  // 突然変異率（0-1）
const machineSize = parameters.float("life_size", 6, "ls")          // 最大個体サイズ
const initialLifespan = parameters.float("initial_lifespan", 10, "l") // 個体生成時の初期寿命
const birthAdditionalLifespan = parameters.float("birth_life", 5, "bl")   // 子孫生成時に増加する寿命
const matureInterval = parameters.int("mature_interval", 200, "mi")       // 個体生成から子孫を残せるようになるまでの時間
const reproduceInterval = parameters.int("reproduce_interval", 100, "ri") // 連続して子孫生成できる最小間隔
const attractForce = parameters.float("attract_force", 0.6, "af")         // mode: attracted, equidistant の引力
const repulsingForce = parameters.float("repulsing_force", 1, "rf")     // 衝突した際に発生する斥力の大きさ
const familyLifespanDecresement = parameters.float("family_lifespan_decresement", 1, "fd")     // Family 同士で衝突した際のlifespanの減少分
const familyVelocity = parameters.float("family_velocity", 0.1, "fv")     //
const lifespanDecresement = parameters.float("lifespan_decresement", 0.001, "ld")     // 時間で減少する寿命

function log(message: string): void {
  if (DEBUG) {
    console.log(message)
  }
}

let t = 0
let world: MachineWorld
const genes: number[] = []

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
    const fieldSize: Vector = this.fieldSize
    this.p.resizeCanvas(fieldSize.x, fieldSize.y)

    const unusedParameters = parameters.unusedKeys()
    if (unusedParameters.length > 0) {
      const errorMessage = `Unrecognized URL parameters: ${String(unusedParameters)}`
      if (DEBUG) {
        alert(errorMessage)
      }
      console.log(`[CAUTION] ${errorMessage}\n\n`)
    }
    const parsedInitialGenes = parseInitialGenes()
    const geneParameter = (parsedInitialGenes.length > 0) ?
      `${String(parsedInitialGenes.map(g => g.hex))}` : (initialGeneType === 0 ? "random" : `random (${initialGeneType}) patterns`)

    log(`System... DEBUG: ${DEBUG}, TEST: ${TEST}, mode: ${mode}, art mode: ${artMode}, background transparency: ${backgroundTransparency()}, statistics interval: ${statisticsInterval}`)
    log(`Field... size: ${String(fieldSize)}, friction: ${friction}, repulsing force: ${repulsingForce}`)
    log(`Enviornment... initial genes: ${geneParameter}, population: ${machineCount}`)
    log(`Life... size: ${machineSize}, mutation rate: ${mutationRate * 100}%, lifespan: ${initialLifespan}, birth additional lifespan: ${birthAdditionalLifespan}, mature interval: ${matureInterval}steps, reproduce interval: ${reproduceInterval}steps`)

    if (TEST) {
      tests()
    }

    const machines: Machine[] = []
    const initialGenes: Gene[] = []
    if (parsedInitialGenes.length > 0) {
      initialGenes.push(...parsedInitialGenes)
    } else {
// tslint:disable-next-line:newline-per-chained-call
      initialGenes.push(...[...Array(initialGeneType).keys()].map(_ => Gene.random()))
    }

    for (let i = 0; i < machineCount; i += 1) {
      let gene: Gene
      if (initialGenes.length > 0) {
        gene = initialGenes[Math.floor(random(initialGenes.length))]
      } else {
        gene = Gene.random()
      }
      const position = new Vector(random(fieldSize.x), random(fieldSize.y))
      machines.push(new Machine(position, gene))
    }

    const terrains: Terrain[] = [
      new FrictedTerrain(fieldSize, friction),
    ]
    world = new MachineWorld(fieldSize, terrains)
    world.addLives(machines)

    this.p.background(0xFF)
  }

  public get fieldSize() {
    switch (mode) {
      case "attracted":
      case "equidistant":
      case "scroll":
        return new Vector(size, size)
      case "family":
      default:
        return new Vector(size, Math.floor(size * 0.6))
    }
  }
}

const main = (p: p5) => {
  controller = new Controller(p)
  p.setup = () => {
    const fieldSize = controller.fieldSize
    const canvas = p.createCanvas(fieldSize.x, fieldSize.y)
    canvas.id("canvas")
    canvas.parent("canvas-parent")
    controller.reset()
  }

  p.draw = () => {
    p.background(0xFF, backgroundTransparency())

    world.next()
    world.draw(p)
    const currentTime = (new Date()).getTime()
    if (currentTime % 1000 === 0) {
      t = Math.floor(currentTime / 1000) - Screenshot.launchTime
      if ((t % statisticsInterval) === 0) {
        showStatistics()
      }
    }

  }
}

const sketch = new p5(main)

function parseInitialGenes(): Gene[] {
  if (rawInitialGenes.length === 0) {
    return []
  }
  const result: Gene[] = []
  rawInitialGenes.split(",")
    .forEach(hexString => {
      const value = parseInt(hexString, 16)
      if (isNaN(value)) {
        log(`[CAUTION] Value ${hexString} specified in "initial_genes" cannot parse to integer`)

        return
      }
      result.push(new Gene(value))
    })

  return result
}

function showStatistics(): void {
  const genesMap = new Map<number, number>() // {gene: number of genes}

  world.lives.forEach(m => {
// tslint:disable-next-line: strict-boolean-expressions
    const numberOfMachines = genesMap.get(m.gene.value) || 0
    genesMap.set(m.gene.value, numberOfMachines + 1)
  })

// tslint:disable-next-line:no-shadowed-variable
  const genes: [number, number][] = []
  genesMap.forEach((value, gene) => {
    genes.push([gene, value])
  })

  log(`\n\n\n${t} steps\nPopulation: ${world.lives.length}, number of species(genes): ${genes.length}`)
  log(`Genes:`)
  const sorted = genes.sort((lhs, rhs) => rhs[1] - lhs[1])
  sorted.slice(0, Math.min(sorted.length, 10))
    .forEach(e => {
      log(`0x${Gene.hex(e[0])}: ${e[1]}`)
    })
}

/**
 * geneLength bits binary
 * |-header-|-transition table-|
 */
class Gene {
  public static headerLength = 4
  public static geneLength = 10
  public static geneMask = Math.pow(2, Gene.geneLength) - 1
  public static transitionTableLength = Gene.geneLength - Gene.headerLength
  public static headerMask = Math.pow(2, Gene.headerLength) - 1
  public static transitionTableMask = Math.pow(2, Gene.transitionTableLength) - 1
  public readonly header: number
  public readonly transitionTable: number // geneLength bits
  public get color(): Color {
    return this._color
  }

  public get hex(): string {
    return Gene.hex(this.value)
  }

  private _color: Color

  public constructor(public readonly value: number) {
    this.header = value >> Gene.transitionTableLength
    const rawTransitionTable = value & Gene.transitionTableMask
    const upper = rawTransitionTable << Gene.headerLength
    const lower = rawTransitionTable >> (Gene.transitionTableLength - Gene.headerLength)
    this.transitionTable = upper + lower

    const r = ((this.header << 4) / 2) + 0x80
    const g = ((rawTransitionTable & 0xF0) / 2) + 0x80
    const b = (((rawTransitionTable & 0xF) << 4) / 2) + 0x80
    this._color = new Color(r, g, b)

    if (genes.indexOf(value) === -1) {
      genes.push(value)
    }
  }

  public static hex(value: number): string {
    return `${value.toString(16).padStart(Math.ceil(Gene.geneLength / 4), "0")}`
  }

  public static random(): Gene {
    return new Gene(Math.floor(random(Gene.geneMask)))
  }

  public mutated(): Gene {
    const mutation = 1 << Math.floor(random(Gene.geneLength, 0))
    const mutatedValue = this.value ^ mutation

    return new Gene(mutatedValue)
  }

  public reproduce(other: Gene): Gene[] {
    const result: Gene[] = []
    const otherDoubledValue = ((other.value << Gene.geneLength) + other.value)
    const shiftOrigin = Gene.transitionTableLength + Gene.geneLength
    const start = 0 // Math.floor(random(Gene.geneLength))
    for (let i = 0; i < Gene.geneLength; i += 1) {
      const j = (i + start) % Gene.geneLength
      const checkValue = (otherDoubledValue >> (shiftOrigin - j)) & Gene.headerMask
      if ((checkValue ^ this.header) === Gene.headerMask) {
        const newValue = this.decode(other.value, (j + Gene.headerLength) % Gene.geneLength)
        result.push(new Gene(newValue))
        if (TEST === false) {
          break // 生産数が多すぎるため、mating ごとの子孫数を1未満に制限
        }
      }
    }

    return result
  }

/// i: number of bits to shift the table
  private decode(rawTable: number, i: number): number {
    const table = (((rawTable << Gene.geneLength) + rawTable) >> (Gene.geneLength - i)) & Gene.geneMask
// log(`${this.transitionTable.toString(2)} ^ ${table.toString(2)}(${rawTable.toString(2)}, ${i}) -> ${(this.transitionTable ^ table).toString(2)}`)

    return this.transitionTable ^ table
  }
}

class Machine extends Life {
  public family: Family | undefined
  public createdAt: number
  public forces: Vector[] = []

  public get age(): number {
    return t - this.createdAt
  }

  public get isAlive(): boolean {
    return this.lifespan > 0
  }

  public get canMate(): boolean {
    if (this.age < matureInterval) {
      return false
    }
    if (this.reproducedAt == undefined) {
      return true
    }

    return (t - this.reproducedAt) > reproduceInterval
  }

  private lifespan = initialLifespan

  private reproducedAt: number | undefined
  private previousPosition: Vector

  public constructor(position: Vector, public readonly gene: Gene) {
    super(position)
    this.createdAt = t
    this._size = machineSize
    this.previousPosition = position
  }

  public reproduce(other: Machine): Machine[] {
    const offsprings = this.gene.reproduce(other.gene)
      .map(g => {
        const position = this.position.add(this.velocity.sized(this.size * -2))
        const gene = (random(1) < mutationRate) ? g.mutated() : g
        const offspring = new Machine(position, gene)
        offspring.velocity = this.velocity.sized(-0.5)

        return offspring
      })

    if (offsprings.length > 0) {
      this.reproducedAt = t
      this.lifespan += offsprings.length * birthAdditionalLifespan
    }

    return offsprings
  }

  public didCollide(damage: number): void {
    this.lifespan -= damage
  }

  public next(): [Force, WorldObject[]] {
    this.lifespan -= lifespanDecresement
    this.previousPosition = this.position

    if (this.isAlive === false) {
      return [Force.zero(), []]
    }

    switch (mode) {
      case "attracted":
      case "equidistant": {
        let target: number
        if (mode === "attracted") {
          target = (this.gene.value / Gene.geneMask) * Math.PI * 2

        } else {
          const geneIndex = genes.indexOf(this.gene.value)
          if (geneIndex < 0) {
            break
          }

          target = (geneIndex / genes.length) * Math.PI * 2
        }
        const targetPosition = new Vector(
          Math.cos(target),
          Math.sin(target),
        )
          .sized(size * 0.3)
          .add(world.size.div(2))

        const movingForce = targetPosition
          .sub(this.position)
          .sized(attractForce)
          .add(Vector.random(attractForce * 0.5, -attractForce * 0.5))

        return [new Force(movingForce), []]
      }

      case "scroll": {
        const targetX = (this.gene.value / Gene.geneMask) * world.size.x * 0.8 + world.size.x * 0.1
        const normalized = reproduceInterval
        const targetY = world.size.y * 0.7 - t + (Math.floor(this.createdAt / normalized) * normalized)
        const targetPosition = new Vector(targetX, targetY)

        const movingForce = targetPosition
          .sub(this.position)
          .sized(attractForce)
          .add(Vector.random(attractForce * 0.5, -attractForce * 0.5))

        return [new Force(movingForce), []]
      }

      case "family":
        if (this.family == undefined) {
          break
        }
        const distance = this.position.dist(this.family.center)
        const maxDistance = 20
        const forceSize = (Math.min(distance + 10, maxDistance) / maxDistance) * attractForce

        const familyCenterForce = this.family.center
          .sub(this.position)
          .sized(forceSize)
          .add(Vector.random(attractForce * 0.5, -attractForce * 0.5))

        const movingDirectionForce = this.family.velocity.mult(familyVelocity)

        const movingForce = familyCenterForce.add(movingDirectionForce)

        return [new Force(movingForce), []]

      default:
        break
    }

    const max = 0.1
    const vx = random(max, -max)
    const vy = random(max, -max)

    return [new Force(new Vector(vx, vy)), []]
  }

  public draw(p: p5, anchor: Vector): void {
    if (artMode) {
      if (mode === "family") {
        return
      }
      p.noFill()
      p.stroke(this.gene.color.p5(p, 0xA0))
      p.strokeWeight(0.5)
      p.line(this.previousPosition.x, this.previousPosition.y, this.position.x, this.position.y)

    } else {
      if ((mode !== "family") || (this.family != undefined)) {
        p.noStroke()
      } else {
        p.stroke(0x20, 0x80)
        p.strokeWeight(0.5)
      }
      p.fill(this.gene.color.p5(p, 0xA0))

      const diameter = Math.min((this.age + 400) / 100, this.size)
      p.circle(this.position.x + anchor.x, this.position.y + anchor.y, diameter)
    }
  }
}

class Family {
  public get machines(): Machine[] {
    return this._machines
  }

  public get center(): Vector {
    return this._center
  }

  public get velocity(): Vector {
    return this._velocity
  }

  private _machines: Machine[] = []
  private _center = world.size.div(2)
  private _velocity = Vector.zero()
  private genes: number[] = []

  public constructor() {
  }

  public canAddMachine(machine: Machine): boolean {
    return (this.machines.length <= 2) || (this.genes.indexOf(machine.gene.value) >= 0)
  }

  public addMachine(machine: Machine): void {
    this._machines.push(machine)
    machine.family = this
  }

  public next(): Family[] {
    const result: Family[] = []
    this._machines = this._machines.filter(m => m.isAlive)

    if (this.machines.length > 40) {
      const center = this.machines.reduce(
        (previous, current) => {
          return previous + current.position.x
        },
        0,
      ) / this.machines.length

      const remains: Machine[] = []
      const newFamily = new Family()

      this.machines.forEach(m => {
        if (m.position.x > center) {
          remains.push(m)
        } else {
          newFamily.addMachine(m)
        }
      })

      this._machines = remains
      result.push(newFamily)
// result.push(...newFamily.next())   // Maximum call stack size exceeded
      newFamily._velocity = new Vector(-2, newFamily.velocity.y)
    }

    if (this.machines.length <= 1) {
      const machine = this.machines.pop()
      if (machine != undefined) {
        machine.family = undefined
      }
    }
    this.genes = []
    this.machines.forEach(m => {
      if (this.genes.indexOf(m.gene.value) === -1) {
        this.genes.push(m.gene.value)
      }
    })

// TODO: 中心点を動かしたり周回させたりする
    this._center = this.machines.reduce(
      (previous, current) => {
        return previous.add(current.position)
      },
      Vector.zero(),
    )
      .div(this.machines.length)

    this._velocity = this.machines.reduce(
      (previous, current) => {
        return previous.add(current.velocity)
      },
      Vector.zero(),
    )
      .div(this.machines.length)

    return result
  }

  public draw(p: p5): void {
    if (artMode === false) {
      return
    }
    console.log(`is artMode: ${artMode}`)
    p.stroke(0x20, 0x80)
    p.strokeWeight(0.5)

    const diameter = Math.sqrt(this.machines.length * machineSize * machineSize)
    p.circle(this.center.x, this.center.y, diameter)
  }
}

class MachineWorld extends VanillaWorld {
  protected _lives: Machine[] = []
  public get lives(): Machine[] {
    return this._lives
  }

  private families: Family[] = []

// tslint:disable-next-line:cyclomatic-complexity
  public next(): void {
    const newLives: Machine[] = []

    const sortedX = [...this.lives].sort((lhs, rhs) => {
      return lhs.position.x - rhs.position.x
    })

    for (let i = 0; i < this.lives.length; i += 1) {
      const life = this.lives[i]
      life.forces = []

      if (life.isAlive === false) {
        continue
      }

      const xIndex = sortedX.indexOf(life)
      const maxX = life.position.x + life.size
      const minX = life.position.x - life.size

      const compareTo: Machine[] = []

      for (let k = i + 1; k < this.lives.length; k += 1) {
        compareTo.push(this.lives[k])
      }

// FixMe: 衝突判定が漏れる
// for (let k = xIndex + 1; k < sortedX.length; k += 1) {
//   if (sortedX[k].position.x > maxX) {
//     break
//   }
//   compareTo.push(sortedX[k])
// }
// for (let k = xIndex - 1; k >= 0; k -= 1) {
//   if (sortedX[k].position.x < minX) {
//     break
//   }
//   compareTo.push(sortedX[k])
// }

      for (let j = 0; j < compareTo.length; j += 1) {
        const otherLife = compareTo[j]
        const distance = life.position.dist(otherLife.position)
        const minDistance = (life.size + otherLife.size) / 2
        const isColliding = distance < minDistance

        if (isColliding === false) {
          continue
        }

        const offsprings: Machine[] = []
        const isDifferentFamily = (life.family != undefined) && (otherLife.family != undefined) && (life.family !== otherLife.family)

        if (life.canMate && otherLife.canMate && (isDifferentFamily === false)) {
          offsprings.push(...life.reproduce(otherLife))
          offsprings.push(...otherLife.reproduce(life))
          newLives.push(...offsprings)

          if (random(1) < 0.1) {
            offsprings.pop()  // Familyに追加されない
          }
        }

        const normalizedDistance = ((minDistance - distance) / minDistance)
        const forceMagnitude = normalizedDistance * repulsingForce
        life.forces.push(life.position.sub(otherLife.position)
                           .sized(forceMagnitude))
        otherLife.forces.push(otherLife.position.sub(life.position)
                                .sized(forceMagnitude))

        if (mode === "family") {
          if ((life.family != undefined) && (life.family === otherLife.family)) {
            const family = life.family
            offsprings.forEach(m => {
              family.addMachine(m)
            })
          } else if ((life.family != undefined) && (otherLife.family == undefined)) {
            const family = life.family
            if (family.canAddMachine(otherLife)) {
              family.addMachine(otherLife)
            }
            offsprings.forEach(m => {
              if (family.canAddMachine(m)) {
                family.addMachine(m)
              }
            })
          } else if ((life.family == undefined) && (otherLife.family != undefined)) {
            const family = otherLife.family
            if (family.canAddMachine(life)) {
              family.addMachine(life)
            }
            offsprings.forEach(m => {
              if (family.canAddMachine(m)) {
                family.addMachine(m)
              }
            })
          } else if ((life.gene.value === otherLife.gene.value) && (life.family == undefined) && (otherLife.family == undefined)) {
            const newFamily = new Family()
            this.families.push(newFamily)
            newFamily.addMachine(life)
            newFamily.addMachine(otherLife)
            offsprings.forEach(m => {
              newFamily.addMachine(m)
            })
          }
        }

        if ((life.family != undefined) && (life.family === otherLife.family)) {
          life.didCollide(familyLifespanDecresement)
          otherLife.didCollide(familyLifespanDecresement)
        } else

// TODO: 歳をとるごとに衝突によるlifespan減少幅が大きくなるようにする
        if (life.age >= matureInterval && otherLife.age >= matureInterval) {
          life.didCollide(1)
          otherLife.didCollide(1)
        }
      }
    }

    this._lives = this.lives.filter(l => l.isAlive)

    for (let i = 0; i < this.lives.length; i += 1) {
      const life = this.lives[i]

      const next = life.next()
      const sumForces = life.forces.reduce(
        (result, current) => {
          return result.add(new Force(current))
        },
        next[0],
      )

      const coordinate = this.updateCoordinateFor(life.position, life.velocity, sumForces, life.mass)
      life.position = coordinate[0]
      life.velocity = coordinate[1]
    }

    this.addLives(newLives)

    const newFamilies: Family[] = []
    this.families.forEach(f => {
      newFamilies.push(...f.next())
    })
    this.families = this.families.filter(f => f.machines.length > 0)
    this.families.push(...newFamilies)
  }

  public draw(p: p5): void {
    super.draw(p)

    this.families.forEach(f => {
      f.draw(p)
    })
  }
}

// ----- TEST -----

function assert(b: boolean, message: string): void {
  if (b !== true) {
// FixMe: テストが最後まで実行されるようにする
    throw new Error(`[Failed] ${message}`)
  }
}

function tests(): void {
  assert(Gene.geneLength === 10, `Expected gene length == 10`)

  const reproducibleValues = [
    0b1100111100,
    0b1111000000,
  ]

  reproducibleValues.forEach(v => {
    const reproducibleGene = new Gene(v)
    const reproducedGenes = reproducibleGene.reproduce(reproducibleGene)
    assert(reproducedGenes.length > 0, `Reproduction failed (${reproducibleGene.value.toString(2)})`)

    const reproducedValues = reproducedGenes.map(g => g.value)
    assert(reproducedValues.indexOf(v) >= 0, `${v.toString(2)}'s offsprings do not contain itself: ${reproducedValues.join(",")}`)
  })

  log(`Test finished`)
  TEST = false
}

ReactDOM.render(<App/>, document.getElementById("root"))
