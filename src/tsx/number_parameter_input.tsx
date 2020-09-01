// tslint:disable:object-literal-sort-keys whitespace
import { Button, createStyles, FormGroup, Popover, Theme, Typography } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
import TextField from "@material-ui/core/TextField"
import { Label, TextFields } from "@material-ui/icons"
import React, { useEffect, useState } from "react"
import { URLParameter } from "../utilities"
import { CommonPopover } from "./popover"

interface Props {
  parameters: URLParameter
  paramKey: string
  page: string
  defaultValue: number
  detail: string
  label: string

  effect(value: number): void
}

export function NumberParameterInput({parameters, paramKey, page, effect, defaultValue, label, detail}: Props) {
  const [value, setValue] = useState(parameters.getNumber(paramKey, defaultValue))
  useEffect(() => {
    effect(value)
    parameters.setNumber(paramKey, value)
    window.history.pushState("page", page, `/pages/${page}.html${parameters.toURLString()}`)
  })
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null)
  const open = Boolean(anchorEl)
  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    setAnchorEl(event.currentTarget)
  }
  const handlePopoverClose = () => {
    setAnchorEl(null)
  }

  return <FormGroup row>
    <TextField
      label={label}
      variant="standard"
      value={value}
      onChange={(e: any) => {
        setValue(e.currentTarget.value)
      }}
      aria-owns={open ? "mouse-over-popover" : undefined}
      aria-haspopup="true"
      onMouseEnter={handlePopoverOpen}
      onMouseLeave={handlePopoverClose}
    />
    <CommonPopover paramKey={paramKey} anchorEl={anchorEl} detail={detail} open={open} handlePopoverClose={handlePopoverClose}/>
  </FormGroup>

}
