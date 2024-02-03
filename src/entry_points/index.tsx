import React from "react"
import ReactDOM from "react-dom"
import { ArtworkCard } from "../tsx/artwork_card"
import { ArtworkRow } from "../tsx/artwork_row"

const App = () => {
  return (
    <div className="container">
      <ArtworkRow className="justify-content-start" title="Simulation">
        <ArtworkCard imagePath="resources/docs/image003.gif" title="BlindPainter Backend"
          description="Artificial life ecosystem."
          link="pages/alife_core.html?art_mode=0&population_size=2000&mutation_rate=0.01&single_gene=1&mode=default&field_size=1600&landscape=1&graph=0" />
        <ArtworkCard imagePath="resources/docs/image009.png" title="ALife Core v2"
          description=""
          link="pages/machine.html?d=1&m=attracted&a=0&t=0&si=200&s=1000&f=0.94&g=&ig=0&p=200&ls=6&mr=0&l=40&bl=20&mi=210&ri=210&af=0.6&rf=0.5&fd=0.05&fv=0.45" />
        <ArtworkCard imagePath="resources/docs/image013.gif" title="Cellular Atmosphere"
          description="Atmosphere simulator implemented by cellular automata."
          link="pages/cellular_atmosphere.html?debug=1&size=10&spring=0&speed=10" />
        <ArtworkCard imagePath="resources/docs/image014.gif" title="Orbital Motion"
          description="Orbital motion & orbital velocity demo."
          link="pages/orbital_motion.html" />
        <ArtworkCard imagePath="resources/docs/image015.gif" title="Gravitational Field"
          description="Objects with multiple gravity sources."
          link="pages/gravitational_field.html" />
      </ArtworkRow>
      <ArtworkRow title="Generative Art">
        <ArtworkCard imagePath="resources/docs/image001.png" title="Blind Painter"
          description="An oil painting like generative art based on artificial life ecosystem."
          link="pages/blind_painter_classic.html" />
        <ArtworkCard imagePath="resources/docs/image004.png" title="Family Tree"
          description="Based on ALife Core. The lines connect between a parent and its children."
          link="pages/family_line.html?art_mode=1&population_size=1000&mutation_rate=0.01&single_gene=0&mode=default&field_size=1000" />
        <ArtworkCard imagePath="resources/docs/image007.png" title="Casey Reas's Process"
          description="Copy of Casey Reas's Process series."
          link="pages/generative_art_002.html?draw_mode=both&objects=320&behavior=B1,B2,B3,B4" />
        <ArtworkCard imagePath="resources/docs/image011.png" title="Bracketed OL-System"
          description="Expanded L-System"
          link="pages/bracketed_ol_system.html?debug=1&length=10&weight=1&depth=5&rules=F:F[+F]F[-F][F]&constants=+:20,-:-20&condition=F" />
        <ArtworkCard imagePath="resources/docs/image012.png" title="L-System"
          description=""
          link="pages/lsystem.html?depth=12&angle=30&rules=A:-A++A&constants=+:20,-:-20" />
      </ArtworkRow>
      <ArtworkRow title="Experimental">
        <ArtworkCard imagePath={undefined} title="Evo-Devo"
          description=""
          link="pages/evo_devo.html" />
        <ArtworkCard imagePath="resources/docs/image010.png" title="Matryoshka"
          description=""
          link="pages/matryoshka_2.html?debug=0&art_mode=0&population=100&size=1000&life_size=6&friction=0.5&mutation_rate=0" />
        <ArtworkCard imagePath="resources/docs/image006.png" title="ALife another drawing style"
          description="The circle size represents how long has it been alive."
          link="pages/generative_art_001.html?art_mode=0&population_size=1000&mutation_rate=0.01&single_gene=0&mode=default&field_size=1000" />
        <ArtworkCard imagePath={undefined} title="ALife Core Typescript implementation"
          description=""
          link="pages/ts.html" />
        <ArtworkCard imagePath={undefined} title="CSS Test Page"
          description=""
          link="pages/gallery_demo.html" />
        <ArtworkCard imagePath={undefined} title="Notebook Demo Page"
          description=""
          link="pages/notebooks/notebook_demo.html?size=830" />
      </ArtworkRow>
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById("root"))
