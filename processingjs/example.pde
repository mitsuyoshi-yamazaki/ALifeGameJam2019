var LifeKlass = NotMovingLife;

void setup() {
	defaultSetup();
}

void draw() {
	defaultDraw();
}

class NotMovingLife extends Life {
  NotMovingLife(float x, float y, float _size, float _energy, Gene _gene){
    super(x, y, _size, _energy, _gene);
  }
  void move(){}
}
