import * as p5 from "p5"
import { Life } from "../classes/life"
import { WorldObject } from "../classes/object"
import { Force, Vector } from "../classes/physics"
import { FrictedTerrain, Terrain } from "../classes/terrain"
import { VanillaWorld } from "../classes/world"
import { Color, random, URLParameter } from "../utilities"

const parameters = new URLParameter()
const DEBUG = parameters.boolean("debug", true, "d")        // デバッグフラグ
let TEST = parameters.boolean("test", false, "t")           // テストを実行
const mode = parameters.string("mode", "default", "m")      // 実行モードを変更 default: 通常, attracted: 遺伝子ごとのアトラクタに誘引される, equidistant: attracted のアトラクタを等間隔に配置
const artMode = parameters.boolean("art_mode", false, "a")  // アートモードで描画
const transparency = parameters.float("background_transparency", 1, "t")    // アートモード時の背景の透過（0-0xFF）
const statisticsInterval = parameters.int("statistics_interval", 500, "si") // 統計情報の表示間隔
const size = parameters.int("size", 1000, "s")                  // canvas サイズ
const friction = parameters.float("friction", 0.99, "f")        // 運動に対する摩擦力（0-1）
const singleGene = parameters.boolean("single_gene", true, "g") // 初期の個体の遺伝子を同一の状態から始める：false  falseのときは下のinitial_gene_typeに従う
const initialGeneType = parameters.int("initial_gene_type", 0, "ig")         // 初期遺伝子の種類 default:0 無制限 singleGene=trueのとき無効
const machineCount = parameters.int("initial_population", 100, "p") // 初期個体数
const mutationRate = parameters.float("mutation_rate", 0.03, "mr")  // 突然変異率（0-1）
const machineSize = parameters.float("life_size", 6, "ls")          // 最大個体サイズ
const initialLifespan = parameters.float("initial_lifespan", 10, "l") // 個体生成時の初期寿命
const birthAdditionalLifespan = parameters.float("birth_life", 5, "bl")   // 子孫生成時に増加する寿命
const matureInterval = parameters.int("mature_interval", 200, "mi")       // 個体生成から子孫を残せるようになるまでの時間
const reproduceInterval = parameters.int("reproduce_interval", 100, "ri") // 連続して子孫生成できる最小間隔
const attractForce = parameters.float("attract_force", 0.6, "af")         // mode: attracted, equidistant の引力

function log(message: string): void {
  if (DEBUG) {
    console.log(message)
  }
}

let t = 0
let world: MachineWorld
const genes: number[] = []
const backgroundTransparency = artMode ? transparency : 0xFF

const main = (p: p5) => {
  p.setup = () => {
    let fieldSize: Vector
    switch (mode) {
      case "attracted":
      case "equidistant":
        fieldSize = new Vector(size, size)
        break
      default:
        fieldSize = new Vector(size, Math.floor(size * 0.6))
        break
    }

    const canvas = p.createCanvas(fieldSize.x, fieldSize.y)
    canvas.id("canvas")
    canvas.parent("canvas-parent")

    const unusedParameters = parameters.unusedKeys()
    if (unusedParameters.length > 0) {
      const errorMessage = `Unrecognized URL parameters: ${String(unusedParameters)}`
      if (DEBUG) {
        alert(errorMessage)
      }
      console.log(`[CAUTION] ${errorMessage}\n\n`)
    }
    log(`System... DEBUG: ${DEBUG}, TEST: ${TEST}, mode: ${mode}, art mode: ${artMode}, background transparency: ${backgroundTransparency}, statistics interval: ${statisticsInterval}`)
    log(`Field... size: ${String(fieldSize)}, friction: ${friction}`)
    log(`Enviornment... single gene: ${singleGene}, population: ${machineCount}`)
    log(`Life... size: ${machineSize}, mutation rate: ${mutationRate * 100}%, lifespan: ${initialLifespan}, birth additional lifespan: ${birthAdditionalLifespan}, mature interval: ${matureInterval}steps, reproduce interval: ${reproduceInterval}steps`)

    if (TEST) {
      tests()
    }

    const machines: Machine[] = []
    const initialGenes: Gene[] = [...Array(initialGeneType).keys()].map(_ => Gene.random())

    for (let i = 0; i < machineCount; i += 1) {
      const gene = singleGene ? new Gene(0b1100111100) : initialGeneType == 0 ? Gene.random() : initialGenes[Math.floor(random(initialGeneType))]
      const position = new Vector(random(fieldSize.x), random(fieldSize.y))
      machines.push(new Machine(position, gene))
    }

    const terrains: Terrain[] = [
      new FrictedTerrain(fieldSize, friction),
    ]
    world = new MachineWorld(fieldSize, terrains)
    world.addLives(machines)

    p.background(0xFF)
  }

  p.draw = () => {
    p.background(0xFF, backgroundTransparency)

    world.next()
    world.draw(p)

    if ((t % statisticsInterval) === 0) {
      showStatistics()
    }

    t += 1
    setTimestamp(t)
  }
}

const sketch = new p5(main)

function showStatistics(): void {
  const genesMap = new Map<number, number>() // {gene: number of genes}

  world.lives.forEach(m => {
    // tslint:disable-next-line: strict-boolean-expressions
    const numberOfMachines = genesMap.get(m.gene.value) || 0
    genesMap.set(m.gene.value, numberOfMachines + 1)
  })

  const genes: [number, number][] = []
  genesMap.forEach((value, gene) => {
    genes.push([gene, value])
  })

  log(`\n\n\n${t} steps\nPopulation: ${world.lives.length}, number of species(genes): ${genes.length}`)
  log(`Genes:`)
  const sorted = genes.sort((lhs, rhs) => rhs[1] - lhs[1])
  sorted.slice(0, Math.min(sorted.length, 10))
    .forEach(e => {
      log(`0x${e[0].toString(16).padStart(Math.ceil(Gene.geneLength / 4), "0")}: ${e[1]}`)
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
    const start = Math.floor(random(Gene.geneLength))
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
        offspring.velocity = this.velocity.sized(-1)

        return offspring
      })

    if (offsprings.length > 0) {
      this.reproducedAt = t
      this.lifespan += offsprings.length * birthAdditionalLifespan
    }

    return offsprings
  }

  public didCollide(): void {
    this.lifespan -= 1
  }

  public next(): [Force, WorldObject[]] {
    this.previousPosition = this.position

    if (this.isAlive === false) {
      return [Force.zero(), []]
    }

    switch (mode) {
      case "attracted":
      case "equidistant":
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
      p.noFill()
      p.stroke(this.gene.color.p5(p, 0xA0))
      p.strokeWeight(0.5)
      p.line(this.previousPosition.x, this.previousPosition.y, this.position.x, this.position.y)

    } else {
      p.noStroke()
      p.fill(this.gene.color.p5(p, 0xA0))

      const diameter = Math.min((this.age + 400) / 100, this.size)
      p.circle(this.position.x + anchor.x, this.position.y + anchor.y, diameter)
    }
  }
}

class MachineWorld extends VanillaWorld {
  protected _lives: Machine[] = []
  public get lives(): Machine[] {
    return this._lives
  }

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

        if (life.canMate && otherLife.canMate) {
          newLives.push(...life.reproduce(otherLife))
          newLives.push(...otherLife.reproduce(life))
        }

        const normalizedDistance = ((minDistance - distance) / minDistance)
        const forceMagnitude = normalizedDistance * 1
        life.forces.push(life.position.sub(otherLife.position)
          .sized(forceMagnitude))
        otherLife.forces.push(otherLife.position.sub(life.position)
          .sized(forceMagnitude))
        // TODO: 歳をとるごとに衝突によるlifespan減少幅が大きくなるようにする
        if (life.age >= matureInterval && otherLife.age >= matureInterval) {
          life.didCollide()
          otherLife.didCollide()
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
