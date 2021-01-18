import React, { CSSProperties } from "react"
import ReactDOM from "react-dom"

const Section: React.FunctionComponent<{}> = props => {
  const sectionStyle: CSSProperties = {
    border: "1px solid",
    borderRadius: "5px",
    borderColor: "lightgrey",
    marginTop: "2rem",
  }

  return (
    <div style={sectionStyle}>
      {props.children}
    </div>
  )
}

interface TextSectionProps {
  title: string
  description: string
}

const TextSection: React.FunctionComponent<TextSectionProps> = props => {
  const style: CSSProperties = {
    padding: "1rem",
  }

  return (
    <div style={style}>
      <h2>{props.title}</h2>
      <div>
        <p>{props.description}</p>
      </div>
    </div>
  )
}

interface CanvasSectionProps {
  src: string
}

class CanvasSection extends React.Component<CanvasSectionProps> {
  private readonly p5Id = "script-p5"
  private readonly simulationId = "script-simulation"

  public componentDidMount() {
    // https://qiita.com/m3816/items/36e5ce2351f3093f2402
    this.replaceScriptElement(this.p5Id, "../../p5.min.js")
    this.replaceScriptElement(this.simulationId, this.props.src)
  }

  public render() {
    return (
      <div>
        <script id={this.p5Id}></script>
        <script id={this.simulationId}></script>
        <div id="canvas-parent" />
      </div>
    )
  }

  private replaceScriptElement(id: string, src: string) {
    const scriptElement = document.createElement("script")

    scriptElement.src = src

    const element = document.getElementById(id)
    if (element == undefined) {
      return
    }
    element.replaceWith(scriptElement)
  }
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
        <CanvasSection src="https://cdn.jsdelivr.net/gh/mitsuyoshi-yamazaki/ALifeGameJam2019@0e7f4c5f63cdd010599f0c1c6fc09cd2ff05c68f/dist/machine.js"/>
      </Section>
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
