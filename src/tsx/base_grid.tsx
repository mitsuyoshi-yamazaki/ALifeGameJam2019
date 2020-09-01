import { Grid, Table, TableHeaderRow } from "@devexpress/dx-react-grid-bootstrap4"
import React, { useEffect, useState } from "react"
import { URLParameter } from "../utilities"

interface Props {
  title: string,
  initialRows: any[]
  columns: any[]
}

export function BaseGrid({ title, initialRows, columns}: Props) {
  return <div>
    <label>{ title}</label>
    <Grid
      rows={ initialRows}
      columns={ columns}
    >
      <Table/>
      <TableHeaderRow/>
    </Grid>
  </div>

}
