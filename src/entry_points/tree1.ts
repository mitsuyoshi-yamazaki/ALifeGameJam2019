import * as p5 from "p5"

const main = (p: p5) => {
  p.setup = () => {
    const canvas = p.createCanvas(100, 100)
    canvas.id("canvas")
    canvas.parent("canvas-parent")
  }

  p.draw = () => {
    p.background(0)
    p.fill(255)
    p.ellipse(20, 20, 60, 60)
  }
}

const sketch = new p5(main)
