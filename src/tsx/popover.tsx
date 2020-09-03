import { createStyles, FormGroup, Popover, Theme, Typography } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
import React from "react"

const useStyles = makeStyles((theme: Theme) =>
                               createStyles({
                                              "popover": {
                                                "pointerEvents": "none",
                                              },
                                              "paper": {
                                                "padding": theme.spacing(1),
                                              },
                                            }),
)

interface Props {
  paramKey: string
  anchorEl: HTMLElement | null

  detail: string

  open: boolean

  handlePopoverClose(): void
}

export function CommonPopover({paramKey, open, anchorEl, handlePopoverClose, detail}: Props) {

  const classes = useStyles()

  return <Popover
    id={`tooltip-${paramKey}`}
    className={classes.popover}
    classes={{
      "paper": classes.paper,
    }}
    open={open}
    anchorEl={anchorEl}
    anchorOrigin={{
      "vertical": "bottom",
      "horizontal": "left",
    }}
    transformOrigin={{
      "vertical": "top",
      "horizontal": "left",
    }}
    onClose={handlePopoverClose}
    disableEnforceFocus
  >
    <Typography>{detail}</Typography>
  </Popover>

}
