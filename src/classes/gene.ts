import { Color, CustomStringConvertible, random } from "../utilities"

export class Gene implements CustomStringConvertible {
  public static readonly geneLength = 3
  public static readonly maxLength = Math.pow(2, Gene.geneLength) - 1

  private readonly _predatorGene: number
  public get predatorGene(): number {
    return this._predatorGene
  }

  private readonly _preyGene: number
  public get preyGene(): number {
    return this._preyGene
    }

  private readonly _color: Color
  public get color(): Color {
    return this._color
  }

  public get description(): string {
    return `${this.predatorGene}|${this.preyGene}`
  }

  public constructor(_predatorGene: number, _preyGene: number) {
    const geneLength = Gene.geneLength
    this._predatorGene = _predatorGene % (Math.pow(2, geneLength))
    this._preyGene = _preyGene % (Math.pow(2, geneLength))

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

  public static random(): Gene {
    const maxLength = Gene.maxLength

    return new Gene(Math.round(random(maxLength, 0)), Math.round(random(maxLength, 0)))
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
