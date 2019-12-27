import * as p5 from "p5"
import { Force, Vector } from "../classes/physics"
import { random } from "../utilities"

/*
* https://vimeo.com/22955812
*
* F1: Circle
* F2: Line  // Not implemented
*
* B1: Move in a straight line
* B2: Constrain to surface
* B3: Change direction while touching another Element
* B4: Move away from an overlapping Element
* B5: Enter from the opposite edge after moving off the surface
* B6: Orient toward the direction of an Element that is touching  // Not implemented
* B7: Deviate from the current direction                          // Not implemented
*
* E1: F1 + B1 + B2 + B3 + B4
* E2: F1 + B1 + B5
* E3: F2 + B1 + B3 + B5
* E4: F1 + B1 + B2 + B3
* E5: F2 + B1 + B5 + B6 + B7
*/

enum DrawMode {
  Backend = "backend",
  Artistic = "artistic",
  Both = "both",
}

enum Form {
  F1,
  F2,
}

enum Behavior {
  B1,
  B2,
  B3,
  B4,
  B5,
  B6,
  B7,
}

class Element {
  public get B1(): boolean {
    return this.behavior.indexOf(Behavior.B1) >= 0
  }
  public get B2(): boolean {
    return this.behavior.indexOf(Behavior.B2) >= 0
  }
  public get B3(): boolean {
    return this.behavior.indexOf(Behavior.B3) >= 0
  }
  public get B4(): boolean {
    return this.behavior.indexOf(Behavior.B4) >= 0
  }
  public get B5(): boolean {
    return this.behavior.indexOf(Behavior.B5) >= 0
  }
  public get B6(): boolean {
    return this.behavior.indexOf(Behavior.B6) >= 0
  }
  public get B7(): boolean {
    return this.behavior.indexOf(Behavior.B7) >= 0
  }

  public constructor(public readonly form: Form, public readonly behavior: Behavior[]) {
  }
}

const rawQuery = document.location.search
const queries = rawQuery
  .slice(rawQuery.indexOf("?") + 1)
  .split("&")
const parameters = { }

for (const query of queries) {
  const pair = query.split("=")
  parameters[pair[0]] = pair[1]
}
console.log(parameters)

// tslint:disable: no-string-literal
const drawMode: DrawMode = parameters["draw_mode"] ? parameters["draw_mode"] : DrawMode.Artistic
const numberOfObjects = parameters["objects"] ? parameters["objects"] : 50
const behavior: Behavior[] = (() => {
  const given = parameters["behavior"]
  if (given == undefined) {
    return [
      Behavior.B1,
      Behavior.B2,
      Behavior.B3,
      Behavior.B4,
    ]
  }

  return given.split(",")
    .map((e: string) => {
      return Behavior[e]
    })
})()
// const interval = parameters["i"] ? parameters["i"] : 200
// tslint:enable: no-string-literal

const element1 = new Element(Form.F1, behavior)
const element = element1

let t = 0
const size = 800
const canvasSize = new Vector(size, size * 0.6)
const objects: Circle[] = []
const objectMinSize = 20
const objectMaxSize = objectMinSize * 2

const main = (p: p5) => {
  p.setup = () => {
    if (drawMode === DrawMode.Both) {
      p.createCanvas(canvasSize.x, canvasSize.y * 2)
    } else {
      p.createCanvas(canvasSize.x, canvasSize.y)
    }
    createObjects()

    if (drawMode === DrawMode.Artistic || drawMode === DrawMode.Both) {
      p.background(0)
    }
  }

  p.draw = () => {
    t += 1
    next()
    draw()

    // if (t % interval === 0) {
    //   const objectSize = random(objectMaxSize * 3, objectMinSize * 3)
    //   const position = canvasSize.randomized()
    //   const direction = random(Math.PI * 2)
    //   const obj = new Circle(objectSize, position, direction)
    //   objects.push(obj)
    //   console.log("add")
    // }
  }

  function createObjects() {
    for (let i = 0; i < numberOfObjects; i += 1) {
      const objectSize = random(objectMaxSize, objectMinSize)
      const position = canvasSize.randomized()
      const direction = random(Math.PI * 2)
      const obj = new Circle(objectSize, position, direction)
      if (random(1) > 1) {
        obj.ignoreB4 = true
      }
      objects.push(obj)
    }
  }

  function next(): void {
    objects.forEach(obj => {
      obj.next()

      if (element.B2) {
        const radius = obj.size / 2
        const xMin = radius
        const xMax = canvasSize.x - radius
        const yMin = radius
        const yMax = canvasSize.y - radius

        const x = Math.max(Math.min(obj.position.x, xMax), xMin)
        const y = Math.max(Math.min(obj.position.y, yMax), yMin)
        obj.position = new Vector(x, y)

      } else if (element.B5) {
        let x = obj.position.x
        let y = obj.position.y

        if (x < 0) {
          x += canvasSize.x
        } else if (x > canvasSize.x) {
          x -= canvasSize.x
        }

        if (y < 0) {
          y += canvasSize.y
        } else if (y > canvasSize.y) {
          y -= canvasSize.y
        }

        obj.position = new Vector(x, y)
      }

      //
      obj.isColliding = false
      obj.forces = []
    })

    for (let i = 0; i < objects.length; i += 1) {
      const obj = objects[i]

      for (let j = i + 1; j < objects.length; j += 1) {
        const other = objects[j]

        const distance = obj.position.dist(other.position)
        const minDistance = (obj.size + other.size) / 2
        const isColliding = distance < minDistance

        if (isColliding) {
          obj.isColliding = true
          other.isColliding = true

          const normalizedDistance = ((minDistance - distance) / minDistance)
          const forceMagnitude = normalizedDistance * 10
          obj.forces.push(obj.position.sub(other.position).sized(forceMagnitude))
          other.forces.push(other.position.sub(obj.position).sized(forceMagnitude))

          if (drawMode === DrawMode.Artistic || drawMode === DrawMode.Both) {
            p.noFill()

            p.stroke(255 * normalizedDistance, 128)
            p.strokeWeight(0.5)

            p.line(obj.position.x, obj.position.y, other.position.x, other.position.y)
          }
        }
      }

      if (element.B3 && obj.isColliding) {
        obj.direction += Math.PI / 300
      }
    }
  }

  function draw(): void {
    switch (drawMode) {
      case DrawMode.Backend:
        p.background(0)

        objects.forEach(obj => {
          obj.draw(p)
        })
        break

      case DrawMode.Both:
        p.noStroke()
        p.fill(0)
        p.rect(0, canvasSize.y - 1, canvasSize.x, canvasSize.y)

        objects.forEach(obj => {
          obj.draw(p)
        })
        break

      default:
        break
    }
  }
}

class Circle {
  public position: Vector
  public direction: number  // 0 ~ 2pi
  public isColliding = false
  public forces: Vector[] = []
  public ignoreB4 = false
  private readonly speed = (1 / 60) * objectMinSize

  public constructor(public readonly size: number, position: Vector, direction: number) {
    this.position = position
    this.direction = direction
  }

  public next(): void {
    const directionalMove = new Vector(Math.cos(this.direction), Math.sin(this.direction)).sized(this.speed)
    const separationForces: Vector[] = (element.B4 && !this.ignoreB4) ? this.forces : []
    const affectedForces = element.B1 ? separationForces.concat(directionalMove) : separationForces

    const sumForces = (result: Vector, value: Vector) => {
      return result.add(value)
    }
    const move = affectedForces.reduce(sumForces, Vector.zero())

    this.position = this.position.add(move)
  }

  public draw(p: p5): void {
    p.noFill()
    p.stroke(255)
    p.strokeWeight(0.5)

    const position = drawMode == DrawMode.Both ? new Vector(this.position.x, this.position.y + canvasSize.y) : this.position

    p.circle(position.x, position.y, this.size)

    this.drawDirectionArrow(p, position)
    this.drawSeparationArrows(p, position)

    if (this.isColliding) {
      this.drawChangingDirectionArrow(p, position)
    }
  }

  private drawDirectionArrow(p: p5, position: Vector): void {
    if (!element.B1) {
      return
    }
    const radius = this.size / 2
    const head = (new Vector(Math.cos(this.direction), Math.sin(this.direction)))
      .sized(radius)
      .add(position)

    drawArrow(p, position, head)
  }

  private drawChangingDirectionArrow(p: p5, position: Vector): void {
    if (!element.B3) {
      return
    }

    const fromRadian = this.direction + Math.PI / 2
    const toRadian = this.direction - Math.PI
    const arcDiameter = this.size / 2

    drawArcArrow(p, position, arcDiameter, fromRadian, toRadian)
  }

  private drawSeparationArrows(p: p5, position: Vector): void {
    if (!element.B4 || this.ignoreB4) {
      return
    }
    const arrowSize = this.size / 8

    this.forces.forEach(force => {
      const head = force
        .sized(arrowSize)
        .add(position)

      drawArrow(p, position, head)
    })
  }
}

function drawArrow(p: p5, from: Vector, to: Vector): void {
  p.noFill()
  p.stroke(255)
  p.strokeWeight(0.5)

  p.line(from.x, from.y, to.x, to.y)
  // TODO:
}

function drawArcArrow(p: p5, center: Vector, radius: number, fromRadian: number, toRadian: number): void {
  p.noFill()
  p.stroke(255)
  p.strokeWeight(0.5)

  p.arc(center.x, center.y, radius, radius, fromRadian, toRadian)
  // TODO:
}

const sketch = new p5(main)
