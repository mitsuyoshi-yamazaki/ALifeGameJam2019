import { Button } from "@material-ui/core"
import React from "react"
import { JSONDownloader } from "../classes/downloader"

interface Props {
  title: string
  filenamePrefix: string
  getJSON(): object
  getTimestamp(): number
}

export class JSONDownloadButton extends React.Component<Props> {
  public render() {
    return (
      <div>
        <Button variant="contained" onClick={() => this.download()}>{this.props.title}</Button>
        <a id="link" />
      </div>
    )
  }

  private download() {
    const json = this.props.getJSON()
    const t = this.props.getTimestamp()
    JSONDownloader.download(json, this.props.filenamePrefix, t)
  }
}
