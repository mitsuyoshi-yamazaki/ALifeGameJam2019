import { Button } from "@material-ui/core"
import React from "react"
import { Screenshot } from "../classes/downloader"

interface Props {
  getTimestamp(): number
}

export class ScreenShotButton extends React.Component<Props> {
  public render() {
    return (
      <div>
        <Button variant="contained" onClick={() => this.saveScreenshot()}>Save Screenshot</Button>
        <a id="link"/>
      </div>
    )
  }

  private saveScreenshot() {
    const t = this.props.getTimestamp()
    Screenshot.saveScreenshot(t)
  }
}
