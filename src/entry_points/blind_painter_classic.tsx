import React, { CSSProperties } from "react"
import ReactDOM from "react-dom"
import { CaptionCard } from "../tsx/caption_card"
import { JSONDownloadButton } from "../tsx/json_download_button"
import { ScreenShotButton } from "../tsx/screen_shot_button"

const App = () => {
  const fixedPositionStyle: CSSProperties = { position: "fixed" }
  const relativePositionStyle: CSSProperties = { position: "relative" }
  const subtitle = (
    <p>
      2019 ALife Game Jam<br />ProcessingJS, Genetic Algorithm, Artificial Life
    </p>
  )

  return (
    <div>
      <div style={fixedPositionStyle}>
        <canvas id="canvas" data-processing-sources="../processingjs/classic_main.pde" ></canvas >
        <div style={relativePositionStyle}>
          <ScreenShotButton getTimestamp={() => getTimestamp()} />
          <JSONDownloadButton title="Download Current State" filenamePrefix="live_data" getJSON={() => getLives()}
            getTimestamp={() => getTimestamp()} />
        </div>
      </div>
      <br />
      <CaptionCard title="BlindPainter" subtitle={subtitle}>
        <p>
          本作は生態系の変化し続ける様を表現したアート作品です。動きまわるドットが生命を、色が遺伝子（種族）を表しており、人工生命の趨勢を観察できます。
          <br /><a href="https://note.com/_mitsuyoshi/n/nc96d3f0a8565">説明記事</a>
        </p>
      </CaptionCard>
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById("root"))
