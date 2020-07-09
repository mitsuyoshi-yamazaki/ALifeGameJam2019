import React, { useState } from "react"
import ReactDOM from "react-dom"

// tslint:disable-next-line:variable-name
const App = () => {

  return (
    <div>
      <p>Hello</p>
    </div>
  )
}

ReactDOM.render(<App/>, document.getElementById("root"))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// import * as p5 from "p5"
//
// const main = (p: p5) => {
//   p.setup = () => {
//     const canvas = p.createCanvas(100, 100)
//     canvas.id("canvas")
//     canvas.parent("canvas-parent")
//   }
//
//   p.draw = () => {
//     p.background(0)
//     p.fill(255)
//     p.ellipse(20, 20, 60, 60)
//   }
// }
//
// const sketch = new p5(main)
