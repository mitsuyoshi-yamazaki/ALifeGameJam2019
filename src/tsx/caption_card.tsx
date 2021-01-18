import React, { CSSProperties } from "react"

interface Props {
  title: string
  subtitle: React.ReactNode
}

export const CaptionCard: React.FunctionComponent<Props> = props => {
  const cardStyle: CSSProperties = {
    width: "40rem",
    marginTop: "80%",
    marginBottom: "20%",
  }
  const cardBodyStyle: CSSProperties = {
    marginLeft: "5%",
    paddingRight: "0px",
  }
  const borderStyle: CSSProperties = {
    backgroundColor: "#000000",
    width: "100%",
    height: "1px",
    border: "none",
  }
  const subtitleStyle: CSSProperties = {
    marginBottom: "2rem",
  }
  const bodyStyle: CSSProperties = {
    paddingRight: "5%",
  }

  return (
    <div className="card shadow mx-auto" style={cardStyle}>
      <div className="card-body" style={cardBodyStyle}>
        <h5 className="card-title custom-card-text">{props.title}</h5>
        <hr style={borderStyle} />
        <div className="card-subtitle" style={subtitleStyle}>
          {props.subtitle}
        </div>
        <div className="card-text" style={bodyStyle}>
          {props.children}
        </div>
      </div>
    </div>
  )
}
