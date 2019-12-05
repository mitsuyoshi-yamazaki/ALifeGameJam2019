export class Vector {
  public constructor(public readonly x: number, public readonly y: number) {
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
    return Math.sqrt(this.x * other.x + this.y * other.y)
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

  public add(other: Force): Force {
      const vector = this.magnitude.add(other.magnitude)

      return new Force(vector)
  }
}
