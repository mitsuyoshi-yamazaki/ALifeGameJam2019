var LifeKlass = Life;
bool droppingsEnabled = true;
bool mutatingSizeEnabled = true;
float _backgroundTransparency = null;

void setup() {
  setLandscapeEnabled();
	defaultSetup(droppingsEnabled, mutatingSizeEnabled, _backgroundTransparency);
}

void draw() {
	defaultDraw();
}
