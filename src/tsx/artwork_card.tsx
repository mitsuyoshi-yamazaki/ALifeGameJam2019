import React, { CSSProperties } from "react"

interface Props {
  imagePath: string | undefined
  title: string
  description?: string
  link: string
}

export const ArtworkCard: React.FunctionComponent<Props> = props => {
  const cardStyle: CSSProperties = {
    width: "280px",
    marginTop: "1.25rem",
  }
  const thumbnailImageStyle: CSSProperties = {
    objectFit: "cover",
    height: "10rem",
  }
  const emptyThumbnailStyle: CSSProperties = {
    height: "160px",
    backgroundColor: "lightgrey",
  }
  const thumbnail: JSX.Element = props.imagePath != undefined ?
    <img className="card-img-top" src={props.imagePath} style={thumbnailImageStyle} /> : <div style={emptyThumbnailStyle} />
  const bodyStyle: CSSProperties = {
    height: "11rem",
  }
  const linkStyle: CSSProperties = {
    display: "block",
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
  }

  return (
    <div className="col-xs-12 col-sm-12 col-md-6 col-lg-4 col-xl-3">
      <div className="card" style={cardStyle}>
        {thumbnail}
        <div className="card-body" style={bodyStyle}>
          <h5 className="card-title">{props.title}</h5>
          <p className="card-text">
            {props.description}
          </p>
        </div>
        <a href={props.link} style={linkStyle} />
      </div>
    </div>
  )
}
