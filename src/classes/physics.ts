import { random } from "../utilities"

export class Vector {

  public get transposed(): Vector {
    return new Vector(this.y, this.x)
  }

  public get size(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y)
  }

  public constructor(public readonly x: number, public readonly y: number) {
  }

  public static zero(): Vector {
    return new Vector(0, 0)
  }

  public static random(max: number, min: number): Vector {
    return new Vector(random(max, min), random(max, min))
  }

  public toString(): string {
    return `(${this.x.toFixed(2)}, ${this.y.toFixed(2)})`
  }

  public add(other: Vector): Vector {
    return new Vector(this.x + other.x, this.y + other.y)
  }

  public sub(other: Vector): Vector {
    return new Vector(this.x - other.x, this.y - other.y)
  }

  public mult(n: number): Vector {
    return new Vector(this.x * n, this.y * n)
  }

  public div(n: number): Vector {
    return new Vector(this.x / n, this.y / n)
  }

  public dist(other: Vector): number {
    return Math.sqrt(Math.pow(this.x - other.x, 2) + Math.pow(this.y - other.y, 2))
  }

  public sized(size: number): Vector {
    const mul = size / this.size

    return this.mult(mul)
  }

  public rotated(radian: number): Vector {
    const x = this.x * Math.cos(radian) - this.y * Math.sin(radian)
    const y = this.x * Math.sin(radian) + this.y * Math.cos(radian)

    return new Vector(x, y)
  }

  public randomized(): Vector {
    return new Vector(random(this.x), random(this.y))
  }

  public moved(radian: number, length: number): Vector {
    const x = this.x + Math.cos(radian) * length
    const y = this.y + Math.sin(radian) * length

    return new Vector(x, y)
  }

  public min(vector: Vector): Vector {
    return new Vector(Math.min(this.x, vector.x), Math.min(this.y, vector.y))
  }

  public max(vector: Vector): Vector {
    return new Vector(Math.max(this.x, vector.x), Math.max(this.y, vector.y))
  }
}

export class Force {
  public constructor(public readonly magnitude: Vector) {
  }

  public static zero(): Force {
    return new Force(new Vector(0, 0))
  }

  public accelerationTo(mass: number): Vector {
    return this.magnitude.div(mass)
  }

  public consumedEnergyWith(mass: number): number {
    return this.magnitude.size * mass
  }

  public add(other: Force): Force {
    const vector = this.magnitude.add(other.magnitude)

    return new Force(vector)
  }
}

export function calculateOrbitalSpeed(position: Vector, gravityCenter: Vector, gravity: number): number {
  const distance = position.dist(gravityCenter)

  return Math.sqrt(gravity / distance)
}

export function calculateOrbitalVelocity(position: Vector, gravityCenter: Vector, gravity: number): Vector {
  const orbitalSpeed = calculateOrbitalSpeed(position, gravityCenter, gravity)
  const tangentVector = position.sub(gravityCenter)
    .rotated(Math.PI / 2)

  return tangentVector.sized(orbitalSpeed)
}
