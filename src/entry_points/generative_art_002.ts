import * as p5 from "p5"
import { Vector } from "../classes/physics"
import { random } from "../utilities"

const main = (p: p5) => {
  const size = 800
  const canvasSize = new Vector(size, size * 0.6)
  const objects: Circle[] = []
  const numberOfObjects = 20
  const objectMinSize = 60
  const objectMaxSize = objectMinSize * 2

  p.setup = () => {
    p.createCanvas(canvasSize.x, canvasSize.y)
    createObjects()
  }

  p.draw = () => {
    next()
    draw(p)
  }

  function createObjects() {
    for (let i = 0; i < numberOfObjects; i += 1) {
      const objectSize = random(objectMaxSize, objectMinSize)
      const position = canvasSize.randomized()
      const obj = new Circle(objectSize, position)
      objects.push(obj)
    }
  }

  function next(): void {

  }

  function draw(p: p5): void {
    p.background(0)

    objects.forEach(obj => {
      obj.draw(p)
    })
  }
}

class Circle {
  public position: Vector

  public constructor(public readonly size: number, position: Vector) {
    this.position = position
  }

  public next(): void {

  }

  public draw(p: p5): void {
    p.noFill()
    p.stroke(255)
    p.strokeWeight(1)

    p.circle(this.position.x, this.position.y, this.size)
  }
}

const sketch = new p5(main)
