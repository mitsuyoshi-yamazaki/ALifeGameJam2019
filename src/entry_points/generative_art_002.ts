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
      const direction = random(Math.PI * 2)
      const obj = new Circle(objectSize, position, direction)
      objects.push(obj)
    }
  }

  function next(): void {
    objects.forEach(obj => {
      obj.next()
    })
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
  public direction: number  // 0 ~ 2pi
  private readonly speed = 1

  public constructor(public readonly size: number, position: Vector, direction: number) {
    this.position = position
    this.direction = direction
  }

  public next(): void {
    const move = new Vector(Math.cos(this.direction), Math.sin(this.direction)).sized(this.speed)
    this.position = this.position.add(move)
  }

  public draw(p: p5): void {
    p.noFill()
    p.stroke(255)
    p.strokeWeight(1)

    p.circle(this.position.x, this.position.y, this.size)

    this.drawDirectionArrow(p)
  }

  private drawDirectionArrow(p: p5): void {
    const radius = this.size / 2
    const head = (new Vector(Math.cos(this.direction), Math.sin(this.direction)))
      .sized(radius)
      .add(this.position)
    drawArrow(p, this.position, head)
  }
}

function drawArrow(p: p5, from: Vector, to: Vector): void {
  p.noFill()
  p.stroke(255)
  p.strokeWeight(1)

  p.line(from.x, from.y, to.x, to.y)
  // TODO:
}

const sketch = new p5(main)
