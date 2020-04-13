var LifeKlass = GrowLife;
bool droppingsEnabled = false;
bool mutatingSizeEnabled = false;
float _backgroundTransparency = null;
bool grayscaled = true;

void setup() {
	defaultSetup(droppingsEnabled, mutatingSizeEnabled, _backgroundTransparency);
}

void draw() {
	defaultDraw();
}

class GrowLife extends Life {
  int t = 0;

	GrowLife(float x, float y, float _size, float _energy, Gene _gene){
    super(x, y, _size, _energy, _gene);
  }

	void draw() {
		t += 1;

    if ((type != 'Life') || !this.alive()) {
      return;
    }

    noStroke();
    fill(gene.geneColor.r, gene.geneColor.g, gene.geneColor.b);
    
    int size = (this.size * 0.01 * t) + (this.size * 0.5);
    ellipse(position.x, position.y, size, size);
  }
}
