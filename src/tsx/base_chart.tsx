import { ArgumentAxis, Chart, LineSeries, ValueAxis } from "@devexpress/dx-react-chart-material-ui"
import React, { useEffect, useState } from "react"

interface Props {
  title: string,
  initialRows: any[]
}

export function BaseChart({ title, initialRows}: Props) {

  return <div>
    <label>{ title}</label>
    <Chart
      data={ initialRows}
    >
      <ArgumentAxis/>
      <ValueAxis/>

      <LineSeries valueField="count" argumentField="tick"/>
    </Chart>
  </div>

}
