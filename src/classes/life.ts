import * as p5 from "p5"
import { random } from "../utilities"
import { Gene } from "./gene"
import { WorldObject } from "./object"
import { Force, Vector } from "./physics"
import { PredPreyWorld } from "./world"

export class Life extends WorldObject {
  public static collisionPriority = 100

  public get isAlive(): boolean {
    return true
  }

  public constructor(public position: Vector) {
    super(position)
    this._size = 3
    const radius = this._size / 2
    this._mass = radius * radius
  }
  public next(): [Force, WorldObject[]] {
    return [Force.zero(), []]
  }

  public draw(p: p5, anchor: Vector): void {
    p.noFill()
    p.stroke(86, 51, 245)

    const diameter = this.size
    p.circle(this.position.x + anchor.x, this.position.y + anchor.y, diameter)
  }
}

export class PassiveLife extends Life {
  public constructor(public position: Vector, size: number) {
    super(position)
    this._size = size
    const radius = this._size / 2
    this._mass = (radius * radius) / 100
  }

  public next(): [Force, WorldObject[]] {
    return [Force.zero(), []]
  }

  public draw(p: p5, anchor: Vector): void {
    p.noFill()
    p.stroke(86, 51, 245)

    this.drawCircles(p, 6, this.position.x + anchor.x, this.position.y + anchor.y, this.size)
  }

  private drawCircles(p: p5, numberOfCircles: number, x: number, y: number, diameter: number): void {
    if (numberOfCircles <= 0) {
      return
    }
    p.circle(x, y, diameter)
    this.drawCircles(p, numberOfCircles - 1, x - this.velocity.x * 2.5, y - this.velocity.y * 2.5, diameter * 0.6)
  }
}

export class GeneticLife extends Life {  // Abstruct class
  public get energy(): number {
    return 0
  }
  public get isAlive(): boolean {
    return false
  }
  public get gene(): Gene {
    return Gene.empty()
  }

  public constructor(public position: Vector) {
    super(position)
  }

  public eaten(): void {
  }
}

export class GeneticResource extends GeneticLife {
  protected _gene: Gene
  protected _energy: number

  public get gene(): Gene {
    return this._gene
  }

  public get energy(): number {
    return this._energy
  }

  public get isAlive(): boolean {
    return false
  }

  public constructor(public position: Vector, gene: Gene, size: number, energy: number) {
    super(position)
    this._size = size
    this._mass = 0.5
    this._energy = energy
    this._gene = gene
  }

  public next(): [Force, WorldObject[]] {
    return [Force.zero(), []]
  }

  public draw(p: p5, anchor: Vector): void {
    p.noStroke()
    p.fill(this.gene.color.p5(p, 0xFF))
    const diameter = this.size
    p.rect(this.position.x - this.size + anchor.x, this.position.y - this.size + anchor.y, diameter, diameter)
  }

  public eaten(): void {
    this._energy = 0
  }
}

export class MetaActiveLife extends GeneticLife {

  public get gene(): Gene {
    return new Gene(0x99, 0x99) // TODO:
  }

  public get isAlive(): boolean {
    return this.containedLives.findIndex(life => life.isAlive) >= 0 // TODO: Gene をチェックして多様過ぎたら死亡するようにする
  }
  private containedLives: GeneticLife[]

  public constructor(
    public position: Vector,
    lives: GeneticLife[],
  ) {
    super(position)
    if (lives.length === 0) {
      this._size = 10
    } else {
      const square: number = lives.reduce(
        (previous, current) => {
          return previous + (current.size * current.size)
        },
        0,
      )
      this._size = Math.sqrt(square * 4)
    }
    this._mass = lives.reduce(
      (previous, current) => {
        return previous + current.mass
      },
      0,
    )
    this.containedLives = lives
  }

  public next(): [Force, WorldObject[]] {
    if (this.isAlive === false) {
      return [Force.zero(), []]
    }

    const eatProbability = 0.9
    const newLives: GeneticLife[] = []
    const killed: GeneticLife[] = []
    for (let i = 0; i < this.containedLives.length; i += 1) {
      const life = this.containedLives[i]
      if (life.isAlive === false) {
        continue
      }

      const next = life.next()
      const coordinate = this.updateCoordinateFor(life.position, life.velocity, next[0], life.mass, life.size)
      life.position = coordinate[0]
      life.velocity = coordinate[1]
      const offsprings = next[1] as GeneticLife[]
      newLives.push(...offsprings)

      if (life instanceof GeneticActiveLife) {
        const threshold = random(1, eatProbability)

        for (let j = (i + 1); j < this.containedLives.length; j += 1) {
          const otherLife = this.containedLives[j]
          if (life.isCollidingWith(otherLife)) {
            if (life.gene.canEat(otherLife.gene, threshold)) {
              const predator = life
              const prey = otherLife
              predator.eat(prey)
              killed.push(prey)
              break

            } else {
              continue
            }
          }
        }
      }
    }

    this.containedLives = this.containedLives.filter(l => {
      return killed.indexOf(l) < 0
    })

    this.containedLives.push(...newLives)

    const max = 0.1
    const vx = random(max, -max)
    const vy = random(max, -max)

    const force = new Force(new Vector(vx, vy))

    return [force, []]
  }

  public draw(p: p5, anchor: Vector): void {
    const localAnchor = anchor.add(this.position)
    this.containedLives.forEach(life => {
      life.draw(p, localAnchor)
    })

    p.fill(this.gene.color.p5(p, 0x20))
    p.strokeWeight(1)
    p.stroke(0x20, 0x80)
    const diameter = this.size
    p.circle(this.position.x + anchor.x, this.position.y + anchor.y, diameter)
  }

  public eat(life: GeneticLife): void {
    // TODO:
  }

  // 返り値は [newPosition: Vector, newVelocity: Vector]
  private updateCoordinateFor(position: Vector, velocity: Vector, force: Force, mass: number, lifeSize: number): [Vector, Vector] {
    const friction = 0.5
    const acceleration = force.accelerationTo(mass)

    let nextPosition = position.add(velocity)
    let nextVelocity: Vector
    const radius = (this.size - lifeSize) / 2
    if (nextPosition.size > radius) {
      nextPosition = nextPosition.sized(radius)
      nextVelocity = Vector.zero()
    } else {
      nextVelocity = velocity.mult(friction)
        .add(acceleration)
    }

    return [nextPosition, nextVelocity]
  }
}

export class GeneticActiveLife extends GeneticLife {
  protected _gene: Gene
  protected _energy: number

  public get gene(): Gene {
    return this._gene
  }

  public get energy(): number {
    return this._energy
  }

  public get isAlive(): boolean {
    return this.energy > 0
  }

  public constructor(
    public position: Vector,
    gene: Gene,
    size: number,
    energy: number,
    public readonly mutationRate: number,
  ) {
    super(position)
    this._size = size
    this._mass = 0.5
    this._energy = energy
    this._gene = gene
  }

  public eaten(): void {
    this._energy = 0
  }

  public next(): [Force, WorldObject[]] {
    if (this.isAlive === false) {
      return [Force.zero(), []]
    }

    const energyConsumptionRate = 1 / 10
    const max = 0.1
    const vx = random(max, -max)
    const vy = random(max, -max)

    const force = new Force(new Vector(vx, vy))
    this._energy = Math.max(this.energy - (force.consumedEnergyWith(this.mass) * energyConsumptionRate), 0)

    const offsprings = this.reproduce()

    return [force, offsprings]
  }

  public draw(p: p5, anchor: Vector): void {
    if (this.isAlive) {
      p.noStroke()
      if (this.energy < 1) {
        p.fill(255, 0, 0)
      } else {
        p.fill(this.gene.color.p5(p, 0xFF))
      }
    } else {
      p.noFill()
      p.strokeWeight(1)
      p.stroke(this.gene.color.p5(p, 0x80))
    }

    const diameter = this.size
    p.circle(this.position.x + anchor.x, this.position.y + anchor.y, diameter)
  }

  public eat(other: GeneticLife): void {
    this._energy += other.energy
    other.eaten()
  }

  private reproduce(): GeneticActiveLife[] {
    const reproductionEnergy = this.size * this.size
    if (this._energy <= (reproductionEnergy * 2)) {
      return []
    }

    const energyAfterReproduction = (this._energy - reproductionEnergy) / 2
    this._energy = energyAfterReproduction

    const position = this.position.add(this.velocity.sized(this.size * -2))
    let gene: Gene
    if (random(1) < this.mutationRate) {
      gene = this.gene.mutated()
    } else {
      gene = this.gene.copy()
    }
    const offspring = new GeneticActiveLife(position, gene, this.size, energyAfterReproduction, this.mutationRate)
    offspring.velocity = this.velocity.sized(-1)

    return [offspring]
  }
}
