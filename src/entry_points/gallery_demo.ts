import * as p5 from "p5"

const main = (p: p5) => {
  p.setup = () => {
    const canvas = p.createCanvas(1600, 1000)
    canvas.id("canvas")
    canvas.parent("canvas-parent")
  }

  p.draw = () => {
    p.background(0xEF, 0xCC, 0xCC)
  }
}

const sketch = new p5(main)
