import React, { CSSProperties } from "react"
import ReactDOM from "react-dom"

interface TextSectionProps {
  title: string
  description: string
}

const Section: React.FunctionComponent<{}> = props => {
  const sectionStyle: CSSProperties = {
    border: "1px solid",
    borderRadius: "5px",
    borderColor: "lightgrey",
    marginTop: "2rem",
    padding: "1rem",
  }

  return (
    <div style={sectionStyle}>
      {props.children}
    </div>
  )
}

const TextSection: React.FunctionComponent<TextSectionProps> = props => {
  return (
    <div>
      <h2>{props.title}</h2>
      <div>
        <p>{props.description}</p>
      </div>
    </div>
  )
}

const App = () => {
  const titleStyle: CSSProperties = {
    borderBottom: "2px solid",
    borderBottomColor: "lightgrey",
  }
  const constentStyle: CSSProperties = {
    maxWidth: "52rem",
    margin: "0 auto",
    marginTop: "4rem",
  }

  return (
    <div style={constentStyle}>
      <h1 style={titleStyle}>BlindPainter</h1>
      <Section>
        <TextSection title="はじめに" description="BlindPainterはALife Game Jam 2019で作成した人工生命系/ジェネラティブアートです。作品のコンセプトを 収束しない進化 と設定し、常に移り変わって寡占にならない人工生命系を実装しました。" />
      </Section>
      <Section>
        <TextSection title="コンセプト" description="イベントの  ever changing -変わり続ける- というテーマと 人工生命 というワードから、作品のコンセプトを 収束しない進化 と設定しました。
人工生命系の製作においては、自己複製の最適解におちいって変化しなくなってしまう問題がよく発生します。収束しない進化 というコンセプトはこの問題を回避して変化し続ける = 観察していて飽きない人工生命系を目指すものとして設定しました。" />
      </Section>
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById("root"))
