import React, { CSSProperties } from "react"

interface Props {
  title: string
  className?: string
}

export const ArtworkRow: React.FunctionComponent<Props> = props => {
  const classes = ["row"]
  if (props.className) {
    classes.push(props.className)
  }
  const titleStyle: CSSProperties = {
    marginTop: "4rem",
  }

  return (
    <div>
      <h2 style={titleStyle}>{props.title}</h2>
      <div className={classes.join(" ")}>
        {props.children}
      </div>
    </div>
  )
}
