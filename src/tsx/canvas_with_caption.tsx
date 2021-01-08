import React, { CSSProperties } from "react"
import { CaptionCard } from "../tsx/caption_card"
import { ScreenShotButton } from "../tsx/screen_shot_button"

interface Props {
  title: string
  subtitle: JSX.Element
  body: JSX.Element
  additionalButton: JSX.Element | undefined
  getTimestamp(): number
}

export function CanvasWithCaption({ title, subtitle, body, additionalButton, getTimestamp }: Props) {
  const fixedPositionStyle: CSSProperties = { position: "fixed" }
  const relativePositionStyle: CSSProperties = { position: "relative" }

  return (
    <div>
      <div style={fixedPositionStyle}>
        <div id="canvas-parent"></div>
        <div style={relativePositionStyle}>
          <ScreenShotButton getTimestamp={getTimestamp} />
          {additionalButton}
        </div>
      </div>
      <br />
      <CaptionCard title="BlindPainter" subtitle={subtitle} body={body} />
    </div>
  )
}
