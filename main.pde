// -- Parameters

// System
boolean DEBUG = false;

// Population
Life[] lifes;
int populationSize = 200;
int initialResourceSize = 600;
int resourceGrowth = 4;

// Field
float fieldWidth = 1200;
float fieldHeight = 800;
float initialPopulationFieldSize = 400; // 起動時に生まれるLifeの置かれる場所の大きさ

// Color
float backgroundTransparency = 0x00;

// Life Parameter
float lifeRadius = 6;
float resourceSize = lifeRadius * 0.3;
float defaultEnergy = 100;
float energyConsumptionRate= 1 / (lifeRadius * lifeRadius * 60);
float defaultMoveDistance = lifeRadius / 2;

// Gene Parameter
int geneLength = 4;
int geneMaxValue = Math.pow(2, geneLength) + 1;
int wholeLength = geneLength*2;
int wholeMax = Math.pow(2, wholeLength) - 1;

// Fight
float eatProbability = 0.5;

float mutationRate = 0.01;

// --

void log(String data) {
  if (DEBUG == false) return;
  console.log(data);
}

class Color {
  int r;
  int g;
  int b;

  Color(int _r, int _g, int _b) {
    r = _r;
    g = _g;
    b = _b;
  }
}

class Gene {
  int predatorGene;
  int preyGene;
  Color geneColor;

  Gene(int _predatorGene, int _preyGene) {
    predatorGene = _predatorGene;
    preyGene = _preyGene;

    geneColor = new Color(predatorGene << 4, preyGene << 4, 0xff);
  }

  static Gene randomGene() {
    return new Gene(int(random(0, geneMaxValue)), int(random(0, geneMaxValue)));
  }

  Gene mutantGene(){
    int mutation = (1 << (random(0, wholeLength)));
    int childwholegene = (this.getWholeGene()) ^ mutation;
    return fromWholeGene(childwholegene);
  }
  Gene childGene(){
    if (mutationRate > random(0.0, 1.0)){
      return mutantGene();
    } else {
      return new Gene(predatorGene, preyGene);
    }
  }
  string showBinary(){
    String str = "";
    for(int i=0; i!=wholeLength;i++){
      console.log(((getWholeGene() >> i) & 0x01));
      str+=((getWholeGene() >> i) & 0x01);
    }
    return str;
  }
  int getWholeGene(){
    return ((predatorGene << geneLength) | (preyGene));
  }
  int setWholeGene(int w){
    this.predatorGene = w >> geneLength;
    this.preyGene = w & (wholeMax >> geneLength);
  }
  static Gene fromWholeGene(int w){
    Gene g = new Gene(w >> geneLength, w & (wholeMax >> geneLength));
    g.setWholeGene(w);
    return g;
  }

  float canEat(Gene other) {
    int diff = 0;

    for (int i = 0; i < geneLength; i++) {
      if (((predatorGene >> i) & 0x01) == ((other.preyGene >> i) & 0x01)) {
        diff += 1;
      }
    }
    return float(diff) / float(geneLength)
  }

  String description() {
    return '' + predatorGene + ' | ' + preyGene
  }
}

class Life {

  PVector position;
  float size;
  float bodyEnergy;
  bool isEaten = false;
  Gene gene;
  float energy;
  String type = 'Life';

  Life(float x, float y, float _size, float _energy, Gene _gene){
    position = new PVector(x, y);
    size=_size;
    energy=_energy;
    gene = _gene;
    bodyEnergy = size * size;
  }

  static Life makeResource(float x, float y, float size, Gene gene) {
    Life resource = new Life(x, y, size, 0, gene);
    resource.bodyEnergy *= 20;
    resource.type = 'Resource';

    return resource;
  }

  String show(){
    String s = ("size: " + size + ".   \n")
               +("energy: "+ energy + ".   \n")
               +("position_x: "+ position.x + ".  \n")
               +("position_y: "+ position.y + ".  \n")
               +("gene(predator|prey): "+ gene.description() + ".  \n")
               +("gene(binary)" + gene.showBinary() +".   \n")
               +("Type:" + this.type +".   \n")
               ;
    return s;
  }

  bool alive() {
    return energy > 0.0;
  }

  void eat(Life other) {
    energy += other.energy + other.bodyEnergy;
    other.energy = 0;
    other.bodyEnergy = 0;
    other.eaten();
  }

  void eaten() {
    isEaten = true;
  }

  void draw(){
    if (type == 'Life') {
     if (isEaten) {
        noStroke();
        fill(255, 0, 0);
        ellipse(position.x, position.y, size, size);

      } else {  
        noStroke();
        fill(gene.geneColor.r, gene.geneColor.g, gene.geneColor.b);
    
        if (alive()) {
          ellipse(position.x, position.y, size, size);
        } else {
          rect(position.x, position.y, size * 0.5, size * 0.5);
        }
      }

    } else {
      if (isEaten) {
        noStroke();
        fill(255, 0, 0);

      } else {  
        // Alive
        noStroke();
        fill(81, 145, 198);
      }
      rect(position.x, position.y, size, size);
    }
  }

  Life[] update(){
    if (!alive()) return[];

    float birthEnergy = size * size;

    if (energy > birthEnergy) {
      float energyAfterBirth = (energy - birthEnergy) / 2;
      float radian = random(0, 2.0 * PI);

      float x = position.x + sin(radian) * size * 3.0;
      float y = position.y + cos(radian) * size * 3.0;

      Gene newGene = gene.childGene();

      Life child = new Life(x, y, size, energyAfterBirth, newGene);

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

void setup()
{
  size(fieldWidth,fieldHeight);
  background(0xff);

  //noLoop();
  PFont fontA = loadFont("courier");
  textFont(fontA, 14);
  println("Hello, ErrorLog!");
  lifes = [];
  int paddingWidth = max(fieldWidth - (initialPopulationFieldSize * 2), 20) / 2;
  int paddingHeight = max(fieldHeight - (initialPopulationFieldSize / 4), 20) / 2;

  Gene initialGene = Gene.randomGene();

  for(int i=0; i < populationSize;i++){
    lifes[i]=new Life(random(paddingWidth,fieldWidth - paddingWidth),random(paddingHeight, fieldHeight - paddingHeight),lifeRadius,defaultEnergy,initialGene);
  }
  for (int i = 0; i < initialResourceSize; i++) {
    lifes[lifes.length] = Life.makeResource(random(paddingWidth,fieldWidth - paddingWidth),random(paddingHeight, fieldHeight - paddingHeight), resourceSize, Gene.randomGene());
  }
  Gene g = Gene.fromWholeGene(0xff);
  Gene g2 = g.childGene();
  console.log("getWhole:" + g.getWholeGene());
  console.log("desc:" + g.description());
  console.log("binary:" + g.showBinary());
  console.log("getWhole g2:" + g2.getWholeGene());
  console.log("desc:" + g2.description());
  console.log("binary:" + g2.showBinary());
}




int[] populationPerSpecies = [];
void draw(){
  fill(0xff, backgroundTransparency);
  rect(0,0,fieldWidth,fieldHeight); // background() だと動作しない

  strokeWeight(3);
  for(int i=0; i!=populationPerSpecies.length; i++){
    Gene g = Gene.fromWholeGene(i);
    stroke(g.geneColor.r, g.geneColor.g, 0xff);
    point(millis()/100, fieldHeight-(populationPerSpecies[i]/5));
  }
  Lifes[] lifes_sorted_by_x = lifes.sort(function(l1, l2){
    if(l1.position.x < l2.position.x){
      return -1;
    }
    else if(l2.position.x < l1.position.x){
      return 1;
    }
    else{
      return 0;
      }
    });

  Lifes[] lifes_sorted_by_y = lifes.sort(function(l1,l2){
    if(l1.position.y < l2.position.y){
      return (-1);
    }
    else if(l2.position.y < l1.position.y){
      return 1;
    }
    else{return 0;}
    });


  Life[] killed = [];
  Life[] born = [];

  populationPerSpecies = populationPerSpecies.map(function(){return 0});

  for (int i = 0; i < lifes.length; i++){
    Life focus = lifes[i];
    var neighbors_in_x = lifes.filter(function(Life l){
      return (abs(l.position.x - focus.position.x) < focus.size/2);
      });
    var neighbors_in_y = lifes.filter(function(Life l){
      return (abs(l.position.y - focus.position.y) < focus.size/2);
      });

    if(lifes[i].alive()){
      populationPerSpecies[focus.gene.getWholeGene()] += 1;
      born = born.concat(lifes[i].update());

      var eating_process = (function(neighbors_in_){
        for(int j=0; j!=neighbors_in_.length;j++){
          if(lifes[i]==neighbors_in_[j]) continue;
          if(isCollision(lifes[i], neighbors_in_[j])) {
            Life predator, prey;
            float threshold = random(eatProbability, 1.0);
            if (lifes[i].gene.canEat(neighbors_in_[j].gene) > threshold) {
              predator = lifes[i];
              prey = neighbors_in_[j];
            } else {
              continue;
            }

            predator.eat(prey);
            killed[killed.length] = prey;
            break;
          }
        }
      });

      eating_process(neighbors_in_x);
      eating_process(neighbors_in_y);
    }
    lifes[i].draw();
  }

  lifes = lifes.filter( function( el ) {
    return killed.indexOf( el ) < 0;
  } );

  lifes = lifes.concat(born);

  addResources();
}

void addResources() {
  int numberOfResources = int(random(0, resourceGrowth));

  for (int i = 0; i < numberOfResources; i++) {
    lifes[lifes.length] = Life.makeResource(random(10,fieldWidth - 10),random(10, fieldHeight - 10), resourceSize, Gene.randomGene());
  }
}

void mouseClicked(){
  PVector m_pos = new PVector(mouseX, mouseY);
  Life found = lifes.find(function(l){
    return ((PVector.sub(m_pos, l.position)).mag() <= l.size)
    });
  if(found != undefined){
    console.log(found.show());
  }
  else{
    //lifes[lifes.length] = new Life(mouseX, mouseY, lifeRadius, defaultEnergy, Gene.randomGene());
    for(int i=0; i!=10;i++){
     lifes[lifes.length] = Life.makeResource(mouseX+random(-lifeRadius, lifeRadius), mouseY+random(-lifeRadius, lifeRadius), resourceSize*10, Gene.randomGene());
    }
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
  console.log(populationPerSpecies);
  if(key == 32){
    noLoop();
  }
}
void keyReleased (){
  if(key == 32){
    loop();
  }
}
