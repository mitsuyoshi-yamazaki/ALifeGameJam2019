import * as p5 from "p5"
import { parsedQueries, random } from "../utilities"

/**
 * TODO:
 * iをランダムな位置から検索し、子孫数を1未満にする
 */

const parameters = parsedQueries()
// tslint:disable: no-string-literal
const rawDebug = parseInt(parameters["debug"], 10)
const DEBUG = isNaN(rawDebug) ? false : (rawDebug ? true : false)
const rawTest = parseInt(parameters["test"], 10)
let TEST = isNaN(rawTest) ? false : (rawTest ? true : false)
const size = parameters["size"] ? parseInt(parameters["size"], 10) : 100
const machineCount = parameters["machines"] ? parseInt(parameters["machines"], 10) : 100
const machineMax = parameters["max"] ? parseInt(parameters["max"], 10) : 1000
const matingRate = parameters["mating_rate"] ? parseFloat(parameters["mating_rate"]) : 0.1
const mutationRate = parameters["mutation_rate"] ? parseFloat(parameters["mutation_rate"]) : 0.03
const speed = parameters["speed"] ? parseInt(parameters["speed"], 10) : 300
const rawSingleGene = parseInt(parameters["single_gene"], 10)
const singleGene = isNaN(rawSingleGene) ? true : (rawSingleGene ? true : false)
// tslint:enable: no-string-literal

function log(message: string): void {
  if (DEBUG) {
    console.log(message)
  }
}

let tt = -1
let t = 0
let machines: Machine[] = []

const main = (p: p5) => {
  p.setup = () => {
    const fieldSize = size
    const canvas = p.createCanvas(fieldSize, fieldSize)
    canvas.id("canvas")
    canvas.parent("canvas-parent")

    if (TEST) {
      tests()
    }

    for (let i = 0; i < machineCount; i += 1) {
      const gene = singleGene ? new Gene(0b1100111100) : Gene.random()
      machines.push(new Machine(gene))
    }

    log(`DEBUG: ${DEBUG}, TEST: ${TEST}`)
    log(`max: ${machineMax}, mating rate: ${matingRate}, mutation rate: ${mutationRate}, single gene: ${singleGene}`)
  }

  p.draw = () => {
    tt += 1
    if (tt % speed !== 0) {
      return
    }

    next()
    t += 1
    setTimestamp(t)
  }
}

const sketch = new p5(main)

function next(): void {
  const trimmed = trimMachines()
  const born = reproduceMachines()
  showStatistics(born, trimmed)
}

function reproduceMachines(): number {
  const newMachines: Machine[] = []

  for (let i = 0; i < machines.length; i += 1) {
    const machine = machines[i]

    for (let j = i + 1; j < machines.length; j += 1) {
      if (random(1) > matingRate) {
        continue
      }
      const other = machines[j]
      const offsprings = machine.reproduce(other)
      newMachines.push(...offsprings)
    }
  }

  machines.push(...newMachines)

  return newMachines.length
}

function trimMachines(): number {
  if (machines.length <= machineMax) {
    return 0
  }

  const trimmed: Machine[] = []
  for (let i = 0; i < machines.length; i += 1) {
    if ((machines.length - trimmed.length) <= machineMax) {
      break
    }

    const machine = machines[i]
    if (machine.age > 0) {  // machines は先頭から古い順に並ぶため // TODO: 子孫を多く残したものを優先して残す
      trimmed.push(machine)
    }
  }

  machines = machines.filter(m => trimmed.indexOf(m) === -1)

  return trimmed.length
}

function showStatistics(born: number, trimmed: number): void {
  const genesMap = new Map<number, number>() // {gene: number of genes}

  log(`\n\n\n[${t}]\nMachines: ${machines.length}, ${born} born, ${trimmed} die`)

  machines.forEach(m => {
    // tslint:disable-next-line: strict-boolean-expressions
    const numberOfMachines = genesMap.get(m.gene.value) || 0
    genesMap.set(m.gene.value, numberOfMachines + 1)
  })

  const genes: [number, number][] = []
  genesMap.forEach((value, gene) => {
    genes.push([gene, value])
  })

  const sorted = genes.sort((lhs, rhs) => rhs[1] - lhs[1])
  sorted.slice(0, Math.min(sorted.length, 5))
    .forEach(e => {
      log(`${e[0].toString(2)}: ${e[1]}`)
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

  public constructor(public readonly value: number) {
    this.header = value >> Gene.transitionTableLength
    const rawTransitionTable = value & Gene.transitionTableMask
    const upper = rawTransitionTable << Gene.headerLength
    const lower = rawTransitionTable >> (Gene.transitionTableLength - Gene.headerLength)
    this.transitionTable = upper + lower
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

class Machine {
  public createdAt: number
  public get age(): number {
    return t - this.createdAt
  }

  public constructor(public readonly gene: Gene) {
    this.createdAt = t
  }

  public reproduce(other: Machine): Machine[] {
    return this.gene.reproduce(other.gene)
      .map(g => {
        if (random(1) < mutationRate) {
          return new Machine(g.mutated())
        } else {
          return new Machine(g)
        }
      })
  }
}

function assert(b: boolean, message: string): void {
  if (b !== true) {
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
