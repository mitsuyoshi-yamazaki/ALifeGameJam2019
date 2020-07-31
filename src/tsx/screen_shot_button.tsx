import React from "react"
import { Button } from "react-bootstrap"
import { Screenshot } from "../classes/screenshot"

export class ScreenShotButton extends React.Component {
  public render() {
    return (
      <div>
        <Button variant="primary" onClick={Screenshot.saveScreenshot}>Save Screenshot</Button>
        <a id="link"/>
      </div>
    )
  }
}
