var LifeKlass = NotMovingLife;
bool droppingsEnabled = false;
bool mutatingSizeEnabled = false;
float _backgroundTransparency = null;

void setup() {
	defaultSetup(droppingsEnabled, mutatingSizeEnabled, _backgroundTransparency);
}


void draw() {
	defaultDraw();
}

class NotMovingLife extends Life {
	 // コンストラクタを書かないと以下のエラーが出る
		// Uncaught TypeError: Cannot read property 'x' of null
  NotMovingLife(float x, float y, float _size, float _energy, Gene _gene){
    super(x, y, _size, _energy, _gene);
  }
  void move(){}
}
