import * as p5 from "p5"
import { parsedQueries, random } from "../utilities"

const parameters = parsedQueries()
// tslint:disable: no-string-literal
const rawDebug = parseInt(parameters["debug"], 10)
const DEBUG = isNaN(rawDebug) ? false : (rawDebug ? true : false)
const rawTest = parseInt(parameters["test"], 10)
const TEST = isNaN(rawTest) ? false : (rawTest ? true : false)
const size = parameters["size"] ? parseInt(parameters["size"], 10) : 100
// tslint:enable: no-string-literal

function log(message: string): void {
  if (DEBUG) {
    console.log(message)
  }
}

let t = 0

const main = (p: p5) => {
  p.setup = () => {
    const fieldSize = size
    const canvas = p.createCanvas(fieldSize, fieldSize)
    canvas.id("canvas")
    canvas.parent("canvas-parent")

    if (TEST) {
      tests()
    }
  }

  p.draw = () => {
    t += 1
    setTimestamp(t)
  }
}

const sketch = new p5(main)

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

  public reproduce(other: Gene): Gene[] {
    const result: Gene[] = []
    const otherDoubledValue = ((other.value << Gene.geneLength) + other.value)
    const shiftOrigin = Gene.transitionTableLength + Gene.geneLength
    for (let i = 0; i < Gene.geneLength; i += 1) {
      const checkValue = (otherDoubledValue >> (shiftOrigin - i)) & Gene.headerMask
      if ((checkValue ^ this.header) === Gene.headerMask) {
        const newValue = this.decode(other.value, (i + Gene.headerLength) % Gene.geneLength)
        result.push(new Gene(newValue))
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
}
