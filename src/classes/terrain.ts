import * as p5 from "p5"
import { Force, Vector } from "./physics"

export class Terrain {
  public constructor(public readonly size: Vector) {
  }

  public frictionAt(position: Vector): number {
    return 1  // 0(停止) ~ 1(摩擦なし)
  }

  public forceAt(position: Vector): Force {
    return Force.zero()
  }

  public draw(p: p5): void {
    return
  }
}

export class VanillaTerrain extends Terrain {
  public constructor(
    public readonly size: Vector,
    public readonly immobilizedWidth: number,
  ) {
    super(size)
  }

  public frictionAt(position: Vector): number {
    if (position.x < this.immobilizedWidth) {
      return (position.x / this.immobilizedWidth)
    }
    if (position.x > (this.size.x - this.immobilizedWidth)) {
      return (this.size.x - position.x) / this.immobilizedWidth
    }
    if (position.y < this.immobilizedWidth) {
      return (position.y / this.immobilizedWidth)
    }
    if (position.y > (this.size.y - this.immobilizedWidth)) {
      return (this.size.y - position.y) / this.immobilizedWidth
    }

    return 1
  }

  public forceAt(position: Vector): Force {
    return Force.zero()
  }

  public draw(p: p5): void {
    p.stroke(207, 196, 251)
    p.strokeWeight(this.immobilizedWidth)
    p.noFill()
    p.rect(0, 0, this.size.x, this.size.y)
  }
}

export class GravitationalTerrain extends Terrain {
  public constructor(public readonly size: Vector, public readonly center: Vector, public readonly gravity: number) {
    super(size)
  }

  public frictionAt(position: Vector): number {
    // // 大気圏
    // const distance = Math.max(this.center.dist(position), 0.1)
    // if (distance > 10) {
    //   return 1
    // }

    // return (distance / 10)

    return 1
  }

  public forceAt(position: Vector): Force {
    const distance = Math.max(this.center.dist(position), this.gravity / 10) // ブラックホールは法律で禁止されている
    const magnitude = (1 / (distance * distance)) * this.gravity

    const vector = this.center.sub(position)

    return new Force(vector.sized(magnitude))
  }

  public draw(p: p5): void {
    p.noStroke()
    p.fill(80)
    const size = Math.max(this.gravity / 10, 4)
    p.ellipse(this.center.x, this.center.y, size, size)
  }
}
