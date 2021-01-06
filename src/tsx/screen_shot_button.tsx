import { Button } from "@material-ui/core"
import React from "react"
import { Screenshot } from "../classes/downloader"

export class ScreenShotButton extends React.Component {
  public render() {
    return (
      <div>
        <Button variant="contained" onClick={Screenshot.saveScreenshot}>Save Screenshot</Button>
        <a id="link"/>
      </div>
    )
  }
}
