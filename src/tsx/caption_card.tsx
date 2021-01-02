import React, { CSSProperties } from "react"

interface Props {
  title: string
  subtitle: JSX.Element
  body: JSX.Element
}

export function CaptionCard({ title, subtitle, body }: Props) {
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
        <h5 className="card-title custom-card-text">{title}</h5>
        <hr style={borderStyle} />
        <div className=".card-subtitle" style={subtitleStyle}>
          {subtitle}
        </div>
        <div className="card-text" style={bodyStyle}>
          {body}
        </div>
      </div>
    </div>
  )
}
