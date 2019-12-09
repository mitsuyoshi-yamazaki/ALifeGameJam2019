import * as p5 from "p5"

const main = (p: p5) => {
  p.setup = () => {
    const size = 800
    p.createCanvas(size, size)
  }

  p.draw = () => {
  }
}

const sketch = new p5(main)
