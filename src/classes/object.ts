import * as p5 from "p5"
import { Vector } from "./physics"

export class WorldObject {
  public static collisionPriority = 0
  public velocity: Vector = new Vector(0, 0)
  public mass = 1

  public constructor(public position: Vector) {
  }

  public collideWith(other: WorldObject): void {
    // TODO: implement
    // ここで何かが起きるのは物理法則の何かを発動するということ
    return
  }

  public draw(p: p5): void {
    p.noStroke()
    p.fill(255, 0, 0)
    const radius = 1
    const diameter = radius * 2
    p.ellipse(this.position.x - radius, this.position.y - radius, diameter, diameter)
  }
}

export class Wall extends WorldObject {
  public static collisionPriority = 1

  public constructor(public position: Vector, public width: number, public height: number) {
    super(position)
  }

  public draw(p: p5): void {
    p.noStroke()
    p.fill(207, 196, 251)
    p.rect(this.position.x, this.position.y, this.width, this.height)
  }
}
