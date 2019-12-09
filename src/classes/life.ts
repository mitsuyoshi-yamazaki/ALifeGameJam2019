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

  public draw(p: p5): void {
    p.noFill()
    p.stroke(86, 51, 245)

    const diameter = this.size
    p.circle(this.position.x, this.position.y, diameter)
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

  public draw(p: p5): void {
    p.noFill()
    p.stroke(86, 51, 245)

    this.drawCircles(p, 6, this.position.x, this.position.y, this.size)
  }

  private drawCircles(p: p5, numberOfCircles: number, x: number, y: number, diameter: number): void {
    if (numberOfCircles <= 0) {
      return
    }
    p.circle(x, y, diameter)
    this.drawCircles(p, numberOfCircles - 1, x - this.velocity.x * 2.5, y - this.velocity.y * 2.5, diameter * 0.6)
  }
}

export class GeneticLife extends Life {
  private _energy: number

  public get energy(): number {
    return this._energy
  }

  public get isAlive(): boolean {
    return this.energy > 0
  }

  public constructor(public position: Vector, public readonly gene: Gene, size: number, energy: number) {
    super(position)
    this._size = size
    this._mass = 0.5
    this._energy = energy
  }

  public next(): [Force, WorldObject[]] {
    const max = 0.1
    const vx = random(max, -max)
    const vy = random(max, -max)

    const force = new Force(new Vector(vx, vy))
    this._energy = Math.max(this.energy - force.consumedEnergyWith(this.mass), 0)

    const offsprings = this.reproduce()

    return [force, offsprings]
  }

  public draw(p: p5): void {
    p.noStroke()
    if (this.energy < 1) {
      p.fill(255, 0, 0)
    } else {
      p.fill(this.gene.color.p5(p))
    }

    const diameter = this.size * 2
    p.circle(this.position.x, this.position.y, diameter)
  }

  public eat(other: GeneticLife): void {
    this._energy += other.energy
    other.eaten()
  }

  public eaten(): void {
    this._energy = 0
  }

  private reproduce(): GeneticLife[] {
    const reproductionEnergy = 80
    if (this._energy < (reproductionEnergy * 1.5)) {
      return []
    }

    const energyAfterReproduction = (this._energy - reproductionEnergy) / 2
    this._energy = energyAfterReproduction

    const position = this.position.add(this.velocity.sized(this.size * -2))
    const offspring = new GeneticLife(position, this.gene.mutated(), this.size, energyAfterReproduction)
    offspring.velocity = this.velocity.sized(-1)

    return [offspring]
  }
}

export class DeadBody extends WorldObject {
  public static collisionPriority = 101

  public get velocity(): Vector {
    return new Vector(0, 0)
  }

  public draw(p: p5): void {
    super.draw(p)  // TODO: implement
  }
}
