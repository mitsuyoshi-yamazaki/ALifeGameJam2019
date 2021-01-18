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
  description?: string
}

const TextSection: React.FunctionComponent<TextSectionProps> = props => {
  const style: CSSProperties = {
    padding: "1rem",
  }
  const description: React.ReactNode = props.description == undefined ? undefined : (<p>{props.description}</p>)

  return (
    <div style={style}>
      <h2>{props.title}</h2>
      <div>
        {description}
        {props.children}
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
        <TextSection title="はじめに" description="このページはBlindPainter他、人工生命系の観察結果を記録するために設けたものです。" />
      </Section>
      <Section>
        <TextSection title="コンセプト" description="Jupyter Notebookのように、ある程度の実行環境と説明、動画や画像による視覚情報を統合的に扱える場として扱えることが理想です。" />
      </Section>
      <Section>
        <TextSection title="課題, TODO">
          <ul>
            <li>
              MVPとしてはコミットIDが明示されていればソースコードを取得できるため、実行環境を用意する必要性は薄い。外部記事にリンクするのでも要は足りる。
            </li>
            <li>
              <a href="https://github.com/mitsuyoshi-yamazaki/ALifeGameJam2019/issues/133">元issue</a>
            </li>
          </ul>
        </TextSection>
      </Section>
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById("root"))
