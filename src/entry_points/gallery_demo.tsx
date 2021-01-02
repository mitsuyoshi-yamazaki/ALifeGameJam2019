import * as p5 from "p5"

const main = (p: p5) => {
  p.setup = () => {
    const canvas = p.createCanvas(p.windowWidth, 800)
    canvas.id("canvas")
    canvas.parent("canvas-parent")

    console.log(`window size: (${p.windowWidth}, ${p.windowHeight})`)
  }

  p.draw = () => {
    p.background(0xEF, 0xCC, 0xCC)
  }
}

const sketch = new p5(main)

// --- レイアウト --- //
