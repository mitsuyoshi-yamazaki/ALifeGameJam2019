var LifeKlass = Life;
bool droppingsEnabled = true;
bool mutatingSizeEnabled = true;
float _backgroundTransparency = null;

void setup() {
	defaultSetup(droppingsEnabled, mutatingSizeEnabled, _backgroundTransparency);
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
