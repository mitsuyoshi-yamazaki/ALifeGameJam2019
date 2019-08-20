// -- Parameters

float fieldWidth = 1200;
float fieldHeight = 800;

float lifeRadius = 10;
float defaultEnergy = 100;
float energyConsumptionRate= 1 / (lifeRadius * lifeRadius * 4);
float defaultMoveDistance = lifeRadius / 2;

boolean DEBUG = false;

// --

void log(String data) {
  if (DEBUG == false) return;
  println(data);
}

class Gene {
  int predatorGene;
  int preyGene;
  static int max = 0x1 + 1;

  Gene(int _predatorGene, int _preyGene) {
    predatorGene = _predatorGene;
    preyGene = _preyGene;
  }

  static Gene randomGene() {
    return new Gene(int(random(0, Gene.max)), int(random(0, Gene.max)));
  }

  bool isPreyOf(Gene other) {
    return preyGene == other.predatorGene
  }

  bool isPredatorOf(Gene other) {
    return predatorGene == other.preyGene
  }

  String description() {
    return '' + predatorGene + ' | ' + preyGene
  }
}

class Life{

  PVector position;
  float size;
  float energy;
  Gene gene;

  Life(float x, float y, float _size, float _energy, Gene _gene){
    position = new PVector(x, y);
    size=_size;
    energy=_energy;
    gene = _gene;
  }

  String show(){
    String s = ("size: " + size + ".   \n")
               +("energy: "+ energy + ".   \n")
               +("position_x: "+ position.x + ".  \n")
               +("position_y: "+ position.y + ".  \n")
               ;
    return s;
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

      Life child = new Life(position.x + size * 5.0, position.y + size, size, energyAfterBirth, gene);

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

int population_size=30;
void setup()
{
  size(fieldWidth,fieldHeight);
  background(0xff);

  //noLoop();
  PFont fontA = loadFont("courier");
  textFont(fontA, 14);
  println("Hello, ErrorLog!");
  lifes = [];
  for(int i=0; i!=population_size;i++){
    lifes[i]=new Life(random(100,fieldWidth - 100),random(100, fieldHeight - 100),lifeRadius,defaultEnergy,Gene.randomGene())
  }
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
        if(isCollision(lifes[i], lifes[j])) {
          Life predator, prey;
          if (lifes[i].gene.isPredatorOf(lifes[j].gene)) {
            predator = lifes[i];
            prey = lifes[j];

          } else if (lifes[i].gene.isPreyOf(lifes[j].gene)) {
            predator = lifes[j];
            prey = lifes[i];

          } else {
            continue;
          }


          predator.energy += prey.energy + prey.size * prey.size;
          prey.energy = 0;
          killed[killed.length] = prey;
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
  PVector m_pos = new PVector(mouseX, mouseY);
  Life found = lifes.find(function(l){
    return ((PVector.sub(m_pos, l.position)).mag() <= l.size)
    });
  if(found != undefined){
    println(found.show());
  }
  else{
    lifes[lifes.length] = new Life(mouseX, mouseY, lifeRadius, defaultEnergy, Gene.randomGene());
  }
}


/*var keyPressed = (function (){
  var isStopping = false;

  return (function(){
  if(key == 32){
    noLoop();
    if(!isStopping){
      noLoop();
      print("noloop");
    } else {
      loop();
      print("loop");
    }
    isStopping = !isStopping;
  }
  });
})();*/

void keyPressed (){
  if(key == 32){
    noLoop();
  }
}
void keyReleased (){
  if(key == 32){
    loop();
  }
}
