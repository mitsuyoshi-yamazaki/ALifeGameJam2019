import { Grid, Table, TableHeaderRow } from "@devexpress/dx-react-grid-bootstrap4"
import React, { useEffect, useState } from "react"
import { URLParameter } from "../utilities"

interface Props {
  initialRows: any[]
  columns: any[]
}

export function BaseGrid({ initialRows, columns}: Props) {
  return <div>
    <Grid
      rows={ initialRows}
      columns={ columns}
    >
      <Table/>
      <TableHeaderRow/>
    </Grid>
  </div>

}
