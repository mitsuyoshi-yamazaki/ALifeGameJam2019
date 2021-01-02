import * as p5 from "p5"
import React from "react"
import ReactDOM from "react-dom"
import { CanvasWithCaption } from "../tsx/canvas_with_caption"

const App = () => {
  const subtitle = (
    <p>
      2019 ALife Game Jam<br />ProcessingJS, Genetic Algorithm, Artificial Life
    </p>
  )
  const body = (
    <p>
      本作は生態系の変化し続ける様を表現したアート作品です。各ドットで生命の位置を、色で生命の遺伝子（種族）を表しており、人工生命の趨勢を観察できます。
    </p>
  )

  return (
    <CanvasWithCaption title="BlindPainter" subtitle={subtitle} body={body} />
  )
}

ReactDOM.render(<App />, document.getElementById("root"))

// -------- //

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
