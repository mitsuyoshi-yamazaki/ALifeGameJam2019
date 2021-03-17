import p5 from "p5"
import { Vector } from "../classes/physics"
import { random, URLParameter } from "../utilities"

const parameters = new URLParameter()

const DEBUG = parameters.boolean("debug", true, "d")
const artMode = parameters.boolean("art_mode", true, "a")
const fullscreenEnabled = parameters.boolean("fullscreen", false, "f")
let fieldWidth = parameters.int("field_size", 1200, "s")
const populationSize = parameters.int("population_size", 1000, "p")
const mutationRate = parameters.float("mutation_rate", 0.005, "mr")
const resourceGrowth = parameters.float("resource_growth", 4, "r")
const geneBitLength = parameters.int("gene_bit_length", 4, "bl")
const eatProbability = parameters.float("eat_probability", 0.5, "e")

let t = 0
const canvasId = "canvas"

// Population
let lives: Life[] = []
const initialResourceSize = 600

// Field
let fieldHeight = (fieldWidth / 16) * 9
const initialPopulationFieldSize = 600 // 起動時に生まれるLifeの置かれる場所の大きさ

if (fullscreenEnabled) {
  fieldWidth = window.screen.width
  fieldHeight = window.screen.height
}

// Color
let backgroundTransparency = 0xFF
const enableEatColor = true
const disableResourceColor = false

// Life Parameter
const lifeRadius = 6
const resourceSize = lifeRadius * 0.3
const defaultEnergy = 50
const energyConsumptionRate = 1 / (lifeRadius * lifeRadius * 40)
const defaultMoveDistance = lifeRadius / 2

if (artMode) {
  backgroundTransparency = 0
  // enableEatColor = false;
  // disableResourceColor = true;
}

function log(data: string) {
  if (DEBUG === false) { return }
  console.log(data)
}

const main = (p: p5) => {
  p.setup = () => {
    const canvas = p.createCanvas(fieldWidth, fieldHeight)
    canvas.id(canvasId)
    canvas.parent("canvas-parent")

    p.background(0xFF)

    const fontA = p.loadFont("courier")
    p.textFont(fontA, 14)

    const paddingWidth = Math.max(fieldWidth - (initialPopulationFieldSize), 20) / 2
    const paddingHeight = Math.max(fieldHeight - (initialPopulationFieldSize / 4), 20) / 2

    const initialGenes = [Gene.randomGene(), Gene.randomGene(), Gene.randomGene(), Gene.randomGene()]
    const numberOfGenes = initialGenes.length
    const width = (fieldWidth / numberOfGenes)

    for (let i = 0; i < populationSize; i += 1) {
      const index = Math.floor(i / (populationSize / numberOfGenes))
      const gene = initialGenes[index]
      const position = new Vector(random(width) + (width * index), random(paddingHeight, fieldHeight - paddingHeight))
      lives[i] = new Life(
        position,
        lifeRadius,
        defaultEnergy,
        gene,
      )
    }
    for (let i = 0; i < initialResourceSize; i += 1) {
      const position = new Vector(random(fieldWidth), random(paddingHeight, fieldHeight - paddingHeight))
      lives[lives.length] = Life.makeResource(position, resourceSize, Gene.randomGene())
    }
  }

  p.draw = () => {
    p.fill(0xFF, backgroundTransparency)
    p.rect(0, 0, fieldWidth, fieldHeight) // background() だと動作しない

    const killed: Life[] = []
    const born: Life[] = []

    const sortedX = lives.slice(0, lives.length)
    sortedX.sort((lhs, rhs) => {
      return lhs.position.x - rhs.position.x
    })

    const sortedY = lives.slice(0, lives.length)
    sortedY.sort((lhs, rhs) => {
      return lhs.position.y - rhs.position.y
    })

    for (let i = 0; i < lives.length; i += 1) {
      const life = lives[i]
      if (life.alive()) {
        born.push(...life.update())

        const compareTo: Life[] = []

        const xIndex = sortedX.indexOf(life)

        const maxX = life.position.x + life.size / 2
        const minX = life.position.x - life.size / 2

        for (let k = xIndex + 1; k < sortedX.length; k += 1) {
          if (sortedX[k].position.x > maxX) {
            break
          }
          compareTo[compareTo.length] = sortedX[k]
        }
        for (let k = xIndex - 1; k >= 0; k -= 1) {
          if (sortedX[k].position.x < minX) {
            break
          }
          compareTo[compareTo.length] = sortedX[k]
        }

        const yIndex = sortedY.indexOf(life)

        const maxY = life.position.y + life.size / 2
        const minY = life.position.y - life.size / 2

        for (let k = yIndex + 1; k < sortedY.length; k += 1) {
          if (sortedY[k].position.x > maxY) {
            break
          }
          compareTo[compareTo.length] = sortedY[k]
        }
        for (let k = yIndex - 1; k >= 0; k -= 1) {
          if (sortedY[k].position.x < minY) {
            break
          }
          compareTo[compareTo.length] = sortedY[k]
        }

        for (let j = 0; j < compareTo.length; j += 1) {
          if (i === j) { continue }
          if (life.isCollided(compareTo[j])) {
            const threshold = random(eatProbability, 1)
            if (life.gene.canEat(compareTo[j].gene) > threshold) {
              const predator = life
              const prey = compareTo[j]
              predator.eat(prey)
              killed[killed.length] = prey
              break
            }
          }
        }
      }
      life.draw(p)
    }

    lives = lives.filter((l: Life) => {
      return killed.indexOf(l) < 0
    })

    lives = lives.concat(born)

    addResources()

    t += 1
  }

  p.mousePressed = () => {
    if (fullscreenEnabled !== true) {
      return
    }
    if (
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.mozFullScreenElement ||
      document.msFullscreenElement
    ) {
      if (document.exitFullscreen != undefined) {
        document.exitFullscreen()
      } else if (document.mozCancelFullScreen != undefined) {
        document.mozCancelFullScreen()
      } else if (document.webkitExitFullscreen != undefined) {
        document.webkitExitFullscreen()
      } else if (document.msExitFullscreen != undefined) {
        document.msExitFullscreen()
      }
    } else {
      const canvas = document.getElementById(canvasId)
      if (canvas?.requestFullscreen !== undefined) {
        canvas.requestFullscreen()
      } else if (canvas?.mozRequestFullScreen !== undefined) {
        canvas.mozRequestFullScreen()
      } else if (canvas?.webkitRequestFullscreen !== undefined) {
        canvas.webkitRequestFullscreen() // (Element.ALLOW_KEYBOARD_INPUT)
      } else if (canvas?.msRequestFullscreen !== undefined) {
        canvas.msRequestFullscreen()
      }
    }
  }
}

const sketch = new p5(main)

class Color {
  public r: number
  public g: number
  public b: number

  public constructor(r: number, g: number, b: number) {
    this.r = r
    this.g = g
    this.b = b
  }
}

class Gene {
  public static geneLength = geneBitLength
  public static geneMaxValue = Math.pow(2, Gene.geneLength) - 1
  public static binaryLength = Gene.geneLength * 2
  public geneColor: Color

  public constructor(public readonly predatorGene: number, public readonly preyGene: number) {
    const r = (predatorGene / Gene.geneMaxValue) * 0xF0 + 0xF
    const g = (preyGene / Gene.geneMaxValue) * 0xF0 + 0xF
    this.geneColor = new Color(r, g, 0xFF)
  }

  public static randomGene(): Gene {
    return new Gene(Math.floor(random(0, Gene.geneMaxValue)), Math.floor(random(0, Gene.geneMaxValue)))
  }

  public static fromBinary(b: number): Gene {
    return new Gene(b >> Gene.geneLength, b & Gene.geneMaxValue)
  }

  public mutantGene(): Gene {
    const mutation = (1 << (random(0, Gene.binaryLength)))
    const childwholegene = this.binary ^ mutation

    return Gene.fromBinary(childwholegene)
  }

  public childGene(): Gene {
    if (mutationRate > random(0, 1)) {
      return this.mutantGene()
    } else {
      return new Gene(this.predatorGene, this.preyGene)
    }
  }

  public get binary(): number {
    return ((this.predatorGene << Gene.geneLength) | (this.preyGene))
  }

  public canEat(other: Gene): number {
    let diff = 0

    for (let i = 0; i < Gene.geneLength; i += 1) {
      if (((this.predatorGene >> i) & 0x01) === ((other.preyGene >> i) & 0x01)) {
        diff += 1
      }
    }

    return diff / Gene.geneLength
  }

  public description(): string {
    return `${this.predatorGene} | ${this.preyGene}`
  }
}

class Life {
  public v = 0
  public r = 0
  public bodyEnergy: number
  public isEaten = false
  public type = "Life"

  public constructor(public position: Vector, public readonly size: number, public energy: number, public readonly gene: Gene) {
    this.bodyEnergy = size * size
  }

  public static makeResource(position: Vector, size: number, gene: Gene): Life {
    const resource = new Life(position, size, 0, gene)
    resource.bodyEnergy *= 20
    resource.type = "Resource"

    return resource
  }

  public show(): string {
    return `size: ${this.size}.\nenergy: ${this.energy}.\nposition: ${String(this.position)}.\ngene: ${this.gene.description()} (${this.gene.binary.toString(16)}).`
  }

  public alive() {
    return this.energy > 0
  }

  public eat(other: Life) {
    this.energy += other.energy + other.bodyEnergy
    other.energy = 0
    other.bodyEnergy = 0
    other.eaten()
  }

  public eaten() {
    this.isEaten = true
  }

  public isCollided(another: Life): boolean {
    const distance = this.position.dist(another.position)

    return distance <= (this.size + another.size) / 2
  }

  public draw(p: p5) {
    if (this.type === "Life") {
      if (enableEatColor && this.isEaten) {
        p.noStroke()
        p.fill(255, 0, 0)
        p.ellipse(this.position.x, this.position.y, this.size, this.size)

      } else {
        p.noStroke()
        p.fill(this.gene.geneColor.r, this.gene.geneColor.g, this.gene.geneColor.b)

        if (this.alive()) {
          p.ellipse(this.position.x, this.position.y, this.size, this.size)
        } else {
          if (disableResourceColor) { return }
          p.rect(this.position.x, this.position.y, this.size * 0.5, this.size * 0.5)
        }
      }

    } else {
      if (disableResourceColor) { return }

      if (this.isEaten) {
        p.noStroke()
        p.fill(255, 0, 0)

      } else {
        // Alive
        p.noStroke()
        p.fill(81, 145, 198)
      }
      p.rect(this.position.x, this.position.y, this.size, this.size)
    }
  }

  public update(): Life[] {
    if (this.alive() === false) { return [] }

    const birthEnergy = this.size * this.size

    if (this.energy > birthEnergy) {
      const energyAfterBirth = (this.energy - birthEnergy) / 2
      const radian = random(0, 2 * Math.PI)

      const x = this.position.x + Math.sin(radian) * this.size * 3
      const y = this.position.y + Math.cos(radian) * this.size * 3

      const newGene = this.gene.childGene()

      const child = new Life(new Vector(x, y), this.size, energyAfterBirth, newGene)

      this.energy = energyAfterBirth

      return [child]
    }

    const vx = random(-defaultMoveDistance, defaultMoveDistance)
    const vy = random(-defaultMoveDistance, defaultMoveDistance)

    const lower = Vector.zero()
    const upper = new Vector(fieldWidth, fieldHeight)
    this.position = this.position.add(new Vector(vx, vy))
      .min(upper)
      .max(lower)

    const energyConsumption = (new Vector(vx, vy)).size * this.size * this.size * energyConsumptionRate
    this.energy -= energyConsumption

    return []
  }
}

function addResources() {
  const numberOfResources = Math.floor(random(0, resourceGrowth))

  for (let i = 0; i < numberOfResources; i += 1) {
    const position = new Vector(random(10, fieldWidth - 10), random(10, fieldHeight - 10))
    lives[lives.length] = Life.makeResource(position, resourceSize, Gene.randomGene())
  }
}
