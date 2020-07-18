import * as p5 from "p5"
import { Vector } from "./physics"

export class WorldObject {
  public static collisionPriority = 0
  public velocity: Vector = new Vector(0, 0)

  protected _size = 1
  public get size(): number {
    return this._size
  }

  protected _mass = 1
  public get mass(): number {
    return this._mass
  }

  public get toString(): string {
    return `${String(typeof this)}, position: ${String(this.position)}, velocity: ${String(this.velocity)}`
  }

  public constructor(public position: Vector) {
  }

  public isCollidingWith(other: WorldObject): boolean {
    const distance = this.position.dist(other.position)

    return distance < ((this.size + other.size) / 2)
  }

  public collideWith(other: WorldObject): void {
    // TODO: implement
    // ここで何かが起きるのは物理法則の何かを発動するということ
    return
  }

  public draw(p: p5, anchor: Vector): void {
    p.noStroke()
    p.fill(255, 0, 0)
    const radius = 1
    const diameter = radius * 2
    p.ellipse(this.position.x - radius + anchor.x, this.position.y - radius + anchor.y, diameter, diameter)
  }
}

export class Wall extends WorldObject {
  public static collisionPriority = 1

  public constructor(public position: Vector, public width: number, public height: number) {
    super(position)
  }

  public draw(p: p5, anchor: Vector): void {
    p.noStroke()
    p.fill(207, 196, 251)
    p.rect(this.position.x + anchor.x, this.position.y + anchor.y, this.width, this.height)
  }
}
