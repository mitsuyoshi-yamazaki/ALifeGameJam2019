import PropTypes from "prop-types"
import React, { Props } from "react"
import { Button } from "react-bootstrap"
import { Screenshot } from "../classes/screenshot"

export class ScreenShotButton extends React.Component {
  public render() {
    return (
      <Button variant="primary" onClick={Screenshot.saveScreenshot}>Save Screenshot</Button>
    )
  }
}
