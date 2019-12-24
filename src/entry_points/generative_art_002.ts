import * as p5 from "p5"
import { Vector } from "../classes/physics"
import { random } from "../utilities"

/*
* Element 1
*
* F1: Circle
* B1: Move in a straight line
* B2: Constrain to surface
* B3: Change direction while touching another Element
* B4: Move away from an overlapping Element
*/

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
      obj.isColliding = false
      obj.next()

      const radius = obj.size / 2
      const xMin = radius
      const xMax = canvasSize.x - radius
      const yMin = radius
      const yMax = canvasSize.y - radius

      const x = Math.max(Math.min(obj.position.x, xMax), xMin)
      const y = Math.max(Math.min(obj.position.y, yMax), yMin)
      obj.position = new Vector(x, y)
    })

    for (let i = 0; i < objects.length; i += 1) {
      const obj = objects[i]

      for (let j = i + 1; j < objects.length; j += 1) {
        const other = objects[j]

        if (obj.isCollidingWith(other)) {
          obj.isColliding = true
          other.isColliding = true
        }
      }
    }

    objects.forEach(obj => {
      if (obj.isColliding) {
        obj.direction += Math.PI / 300
      }
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
  public isColliding = false
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

    if (this.isColliding) {
      this.drawChangingDirectionArrow(p)
    }
  }

  public isCollidingWith(other: Circle): boolean {
    const distance = this.position.dist(other.position)

    return distance < ((this.size + other.size) / 2)
  }

  private drawDirectionArrow(p: p5): void {
    const radius = this.size / 2
    const head = (new Vector(Math.cos(this.direction), Math.sin(this.direction)))
      .sized(radius)
      .add(this.position)

    drawArrow(p, this.position, head)
  }

  private drawChangingDirectionArrow(p: p5): void {
    const fromRadian = this.direction + Math.PI / 2
    const toRadian = this.direction - Math.PI
    const arcDiameter = this.size / 2

    drawArcArrow(p, this.position, arcDiameter, fromRadian, toRadian)
  }
}

function drawArrow(p: p5, from: Vector, to: Vector): void {
  p.noFill()
  p.stroke(255)
  p.strokeWeight(1)

  p.line(from.x, from.y, to.x, to.y)
  // TODO:
}

function drawArcArrow(p: p5, center: Vector, radius: number, fromRadian: number, toRadian: number): void {
  p.noFill()
  p.stroke(255)
  p.strokeWeight(1)

  p.arc(center.x, center.y, radius, radius, fromRadian, toRadian)
  // TODO:
}

const sketch = new p5(main)
