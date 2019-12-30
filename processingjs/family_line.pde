var LifeKlass = NoDrawingLife;
bool droppingsEnabled = false;
bool mutatingSizeEnabled = false;
float _backgroundTransparency = 0x00;
bool grayscaled = false;

void setup() {
	String rawQuery = document.location.search;
 String queries = rawQuery.slice(rawQuery.indexOf('?') + 1).split('&');
 Object parameters = {};
 for (int i = 0; i < queries.length; i++) {
  String[] pair = queries[i].split('=');
  parameters[pair[0]] = pair[1];
 }

 if (parameters['grayscale'] != null) {
  grayscaled = int(parameters['grayscale']) == 1;
 }

	defaultSetup(droppingsEnabled, mutatingSizeEnabled, _backgroundTransparency);
}

void draw() {
	defaultDraw();
}

class NoDrawingLife extends Life {
  NoDrawingLife parent = null;

	NoDrawingLife(float x, float y, float _size, float _energy, Gene _gene){
    super(x, y, _size, _energy, _gene);
  }

	void draw() {
    if ((this.parent == null) || (this.parent.alive() == false)) {
      return;
    }
    strokeWeight(0.5);
    if (grayscaled) {
					 float gray = gene.geneColor.r * 0.2126 + gene.geneColor.g * 0.7152 + gene.geneColor.b * 0.0722;
      stroke(gray);
    } else {
      stroke(gene.geneColor.r, gene.geneColor.g, gene.geneColor.b);
    }
    line(this.position.x, this.position.y, this.parent.position.x, this.parent.position.y);
  }

  Life[] reproduce(){
    Life[] lives = super.reproduce();
		for (int i = 0; i < lives.length; i++) {
      Life life = lives[i];
      if (life.gene.getWholeGene() == this.gene.getWholeGene()) {
        life.parent = this;
      }
    }

    return lives;
  }
}
