// -- Parameters

float fieldWidth = 1200;
float fieldHeight = 800;

float lifeRadius = 10;
float defaultEnergy = 100;
float energyConsumptionRate= 1 / (lifeRadius * lifeRadius * 4);
float defaultMoveDistance = lifeRadius / 2;

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

  Life[] update(){
    if (!alive()) return[];

    float birthEnergy = size * size;

    if (energy > birthEnergy) {
      float energyAfterBirth = (energy - birthEnergy) / 2;

      Life child = new Life(position.x + size * 5.0, position.y + size, size, energyAfterBirth);

      energy = energyAfterBirth;

      return [child];
    }

    float dx = random(-defaultMoveDistance, defaultMoveDistance);
    float dy = random(-defaultMoveDistance, defaultMoveDistance);
    float energyConsumption = (new PVector(dx, dy)).mag() * size * size * energyConsumptionRate

    position.x += dx;
    position.y += dy;

    position.x = min(position.x, fieldWidth)
    position.x = max(position.x, 0)
    position.y = min(position.y, fieldHeight)
    position.y = max(position.y, 0)

    energy -= energyConsumption;

    return [];
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
  Life[] killed = [];
  Life[] born = [];

  for (int i = 0; i < lifes.length; i++){
    stroke(255, 0, 0);
    if(lifes[i].alive()){
      born = born.concat(lifes[i].update());

      for (int j = 0; j < lifes.length; j++){
        if(i==j) continue;
        if(isCollision(lifes[i], lifes[j])){
          Life pray = lifes[j];
          lifes[i].energy += pray.energy + pray.size * pray.size;
          pray.energy = 0;
          killed[killed.length] = pray;
          break;
        }
      }
    }
    lifes[i].draw();
  }

  lifes = lifes.filter( function( el ) {
    return killed.indexOf( el ) < 0;
  } );

  lifes = lifes.concat(born);
}

void mouseClicked(){
  lifes[lifes.length] = new Life(mouseX, mouseY, lifeRadius, defaultEnergy);
}
