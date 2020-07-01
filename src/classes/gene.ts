import { Color, random } from "../utilities"

export class Gene {
  public get predatorGene(): number {
    return this._predatorGene
  }

  public get preyGene(): number {
    return this._preyGene
  }

  public get binaryRepresentation(): number {
    return (this.predatorGene << Gene.geneLength) | this.preyGene
  }

  public get color(): Color {
    return this._color
  }

  public static readonly geneLength = 3		// predatorGene, preyGene それぞれの長さ
  public static readonly binaryLength = Gene.geneLength * 2
  public static readonly geneMaxValue = Math.pow(2, Gene.geneLength)
  public static readonly maxLength = Math.pow(2, Gene.geneMaxValue) - 1

  private readonly _predatorGene: number

  private readonly _preyGene: number

  private readonly _color: Color

  public constructor(_predatorGene: number, _preyGene: number) {
    const geneLength = Gene.geneLength
    const geneMaxValue = Gene.geneMaxValue
    this._predatorGene = _predatorGene % geneMaxValue
    this._preyGene = _preyGene % geneMaxValue

    const shiftInt = (shiftee: number, shiftLength: number) => {
      if (shiftLength > 0) {
        return (shiftee << shiftLength)
      } else {
        return (shiftee >> (-shiftLength))
      }
    }

    const r = shiftInt(this.predatorGene, 8 - geneLength)
    const g = shiftInt(this.preyGene, 8 - geneLength)
    const b = 0xFF
    this._color = new Color(r, g, b)
  }

  public static createWith(binary: number): Gene {
    const geneLengthMask = Math.pow(2, Gene.geneLength) - 1
    const predatorGene = (binary >> Gene.geneLength) & geneLengthMask
    const preyGene = binary & geneLengthMask

    return new Gene(predatorGene, preyGene)
  }

  public static empty(): Gene {
    return new Gene(0, 0)
  }

  public static random(): Gene {
    const maxLength = Gene.maxLength

    return new Gene(Math.round(random(maxLength, 0)), Math.round(random(maxLength, 0)))
  }

  public toString(): string {
    return `${this.predatorGene.toString(16)}|${this.preyGene.toString(16)}`
  }

  public copy(): Gene {
    return new Gene(this.predatorGene, this.preyGene)
  }

  public mutated(): Gene {
    const mutation = 1 << Math.floor(random(Gene.binaryLength, 0))
    const mutatedBinary = this.binaryRepresentation ^ mutation

    return Gene.createWith(mutatedBinary)
  }

  public canEat(other: Gene, threshold: number): boolean {
    let diff = 0

    for (let i = 0; i < Gene.geneLength; i += 1) {
      if (((this.predatorGene >> i) & 0x01) === ((other.preyGene >> i) & 0x01)) {
        diff += 1
      }
    }

    return (diff / Gene.geneLength) > threshold
  }
}
