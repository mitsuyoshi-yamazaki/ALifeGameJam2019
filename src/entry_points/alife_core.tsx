import React, { CSSProperties } from "react"
import ReactDOM from "react-dom"
import { CaptionCard } from "../tsx/caption_card"
import { ScreenShotButton } from "../tsx/screen_shot_button"

const App = () => {
  const fixedPositionStyle: CSSProperties = { position: "fixed" }
  const relativePositionStyle: CSSProperties = { position: "relative" }
  const subtitle = (
    <p>
      Mitsuyoshi Yamazaki, ayu-mushi<br />
      2019 ALife Game Jam<br />
      ProcessingJS, Genetic Algorithm, Artificial Life
    </p>
  )

  return (
    <div>
      <div style={fixedPositionStyle}>
        <canvas id="canvas" data-processing-sources="../processingjs/main.pde ../processingjs/droppings.pde"></canvas>
        <div style={relativePositionStyle}>
          <ScreenShotButton getTimestamp={() => getTimestamp()} />
        </div>
      </div>
      <br />
      <CaptionCard title="BlindPainter Backend" subtitle={subtitle}>
        <p>
          本作は収束しない進化を表現した生態系シミュレーションです。動きまわるドットが生命を、色が遺伝子（種族）を表しており、人工生命の趨勢を観察できます。
          <br />描画方法を変えてアート作品 <a href="./blind_painter_classic.html">BlindPainter</a> としても発表しています。
          <br /><a href="https://note.com/_mitsuyoshi/n/nc96d3f0a8565">説明記事</a>
        </p>
      </CaptionCard>
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById("root"))
