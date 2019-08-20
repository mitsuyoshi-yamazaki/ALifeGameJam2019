// -- Parameters

float fieldWidth = 1200;
float fieldHeight = 800;

float lifeRadius = 2;
float defaultEnergy = 100;
float energyConsumptionRate = 0.1;

boolean DEBUG = false;

// -- 

void log(string data) {
  if (DEBUG == false) return;
  println(data);
}

void log(int data) {
  if (DEBUG == false) return;
  println(data);
}

class Life{

  PVector position;
  float size;
  float energy;

  Life(float x, float y, float _size, float _energy){
    position = new PVector(x, y);
    size=_size;
    energy=_energy;
  }

  bool alive() {
    return energy > 0.0;
  }

  void draw(){
    if (alive() == false) {
      stroke(150)
    }

    noFill();
    ellipse(position.x, position.y, size, size);
  }

  void update(){
    if (!alive()) return;

    float dx = random(-1, 1);
    float dy = random(-1, 1);
    float energyConsumption = (new PVector(dx, dy)).mag() * size * size * energyConsumptionRate

    position.x += dx;
    position.y += dy;

    position.x = min(position.x, fieldWidth)
    position.x = max(position.x, 0)
    position.y = min(position.y, fieldHeight)
    position.y = max(position.y, 0)

    energy -= energyConsumption;
  }
}

//壁に衝突も
bool isCollision(Life l1, Life l2){
  float distance = (PVector.sub(l1.position, l2.position)).mag();
  return (abs(distance) <= (l1.size + l2.size)/2);
}

Life[] lifes;

void setup()
{
  size(fieldWidth,fieldHeight);
  background(0xff);

  //noLoop();
  PFont fontA = loadFont("courier");
  textFont(fontA, 14);
  println("Hello, ErrorLog!");
  lifes = [new Life(40,50,lifeRadius,defaultEnergy), new Life(120, 120,lifeRadius,defaultEnergy)];
}


void draw(){

  background(0xff);

  for (int i = 0; i < lifes.length; i++){
    lifes[i].update();
    stroke(0, 0, 0);
    for (int j = 0; j < lifes.length; j++){
      if(i==j) continue;

      if(isCollision(lifes[i], lifes[j])){
        stroke(255, 0, 0);
        break;
      }
    }
    lifes[i].draw();
  }
}

void mouseClicked(){
  lifes[lifes.length] = new Life(mouseX, mouseY, lifeRadius, defaultEnergy);
}
