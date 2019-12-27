import * as p5 from "p5"
import { Vector } from "../classes/physics"
import { random } from "../utilities"

const size = 800
const canvasSize = new Vector(size, size)
const objects: WorldObject[] = []

const main = (p: p5) => {
  p.setup = () => {
    p.createCanvas(canvasSize.x, canvasSize.y)
    setupObjects()
  }

  p.draw = () => {
    next()
    draw()
  }

  function setupObjects(): void {
    for (let i = 0; i < 20; i += 1) {
      const position = canvasSize.randomized()
      const obj = new Ant(position)
      objects.push(obj)
    }
  }

  function next(): void {
    objects.forEach(obj => {
      obj.next()
    })
  }

  function draw(): void {
    p.background(0)

    objects.forEach(obj => {
      if (obj.position.x < 0 || obj.position.x > canvasSize.x || obj.position.y < 0 || obj.position.y > canvasSize.y) {
        return
      }
      obj.draw(p)
    })
  }
}

interface WorldObject {
  position: Vector

  next(): void
  draw(p: p5): void
}

class Ant implements WorldObject {
  public position: Vector

  public constructor(position: Vector) {
    this.position = position
  }

  public next(): void {

  }

  public draw(p: p5): void {
    p.noFill()
    p.stroke(255)
    p.strokeWeight(1)

    p.circle(this.position.x, this.position.y, 60)
  }
}

const sketch = new p5(main)
