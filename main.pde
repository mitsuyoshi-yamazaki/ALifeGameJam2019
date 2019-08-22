// -- Parameters
// TODO: ドット絵から逆生成

// System
bool DEBUG = false;
bool artMode = true;

// Population
Life[] lifes;
int populationSize = 1000;
int initialResourceSize = 600;
int resourceGrowth = 4;

// Inspector
int[] populationPerSpecies = [];
float graphSize = 0.4;
float graphHeight = 400;

// Field
float fieldWidth = 1600;
float fieldHeight = 700;
float initialPopulationFieldSize = 600; // 起動時に生まれるLifeの置かれる場所の大きさ
bool useSingleGene = true;

float appFieldWidth = fieldWidth;
float appFieldHeight = fieldHeight + graphHeight;

// Color
float backgroundTransparency = 0xff;
bool enableEatColor = true;
bool disableResourceColor = false;

// Life Parameter
float lifeRadius = 6;
float resourceSize = lifeRadius * 0.3;
float defaultEnergy = 50;
float energyConsumptionRate= 1 / (lifeRadius * lifeRadius * 40);
float defaultMoveDistance = lifeRadius / 2;

// Gene Parameter
int geneLength = 1;
int geneMaxValue = Math.pow(2, geneLength) - 1;

int wholeLength = geneLength*2;
int wholeMax = Math.pow(2, wholeLength) - 1;

// Fight
float eatProbability = 0.9;

// Evolution
float mutationRate = 0.02;

// Parse URL Parameter
String rawQuery = document.location.search;
String queries = rawQuery.slice(rawQuery.indexOf('?') + 1).split('&');
Object parameters = {};
for (int i = 0; i < queries.length; i++) {
  String[] pair = queries[i].split('=');
  parameters[pair[0]] = pair[1];
}
console.log(parameters);

if (parameters['art_mode'] != null) {
  artMode = int(parameters['art_mode']);
}
if (parameters['population_size'] != null) {
  populationSize = int(parameters['population_size']);
}
if (parameters['mutation_rate'] != null) {
  mutationRate = float(parameters['mutation_rate']);
}
if (parameters['single_gene'] != null) {
  useSingleGene = int(parameters['single_gene']);
}

// Artistics Mode
if (artMode) {
  backgroundTransparency = 0;
  enableEatColor = false;
  disableResourceColor = true;
}

// --

void log(String data) {
  if (DEBUG == false) return;
  console.log(data);
}

float customizedRandom(float lower, float upper) {
  return (random(lower, upper), random(lower, upper), random(lower, upper), random(lower, upper), random(lower, upper)) / 5.0;
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
    predatorGene = _predatorGene % (Math.pow(2, geneLength));
    preyGene = _preyGene % (Math.pow(2, geneLength));

    geneColor = new Color((predatorGene << (8-geneLength)), (preyGene << (8-geneLength)), 0xff);
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
    var good_w = w % (Math.pow(2, wholeLength));
    Gene g = new Gene(good_w >> geneLength, good_w & (wholeMax >> geneLength));
    g.setWholeGene(good_w);
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
  float v, r;
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

    v = 0.0;
    r = 0.0;
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
     if (enableEatColor && isEaten) {
        noStroke();
        fill(255, 0, 0);
        ellipse(position.x, position.y, size, size);

      } else {  
        noStroke();
        fill(gene.geneColor.r, gene.geneColor.g, gene.geneColor.b);
    
        if (alive()) {
          ellipse(position.x, position.y, size, size);
        } else {
          if (disableResourceColor) return;
          rect(position.x, position.y, size * 0.5, size * 0.5);
        }
      }

    } else {
      if (disableResourceColor) return;

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

    // v += 2;
    // v *= customizedRandom(-5, 5);
    // r += customizedRandom(-6, 6);
    
    // float vx = Math.cos(r) * v;
    // float vy = Math.sin(r) * v;

    float vx = random(-defaultMoveDistance, defaultMoveDistance);
    float vy = random(-defaultMoveDistance, defaultMoveDistance);

    position.x += vx;
    position.y += vy;

    float energyConsumption = (new PVector(vx, vy)).mag() * size * size * energyConsumptionRate

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
  size(appFieldWidth, appFieldHeight);
  background(0xff);

  //noLoop();
  PFont fontA = loadFont("courier");
  textFont(fontA, 14);

  lifes = [];
  int paddingWidth = max(fieldWidth - (initialPopulationFieldSize), 20) / 2;
  int paddingHeight = max(fieldHeight - (initialPopulationFieldSize / 4), 20) / 2;

  Gene initialGene = new Gene(0x0, 0xf);

  Gene[] initialGenesArray = [new Gene(0x8,0x0), new Gene(0x0,0x8)];
  for(int i=0; i < populationSize;i++){
    if (useSingleGene) {
      float dice;
      dice = Math.floor(random(0, initialGenesArray.length));
      for(int g_i = 0; g_i != initialGenesArray.length;g_i++){
        if(dice == g_i)
        {
        lifes[i] = new Life(random(paddingWidth,fieldWidth - paddingWidth),random(paddingHeight, fieldHeight - paddingHeight),lifeRadius,defaultEnergy, initialGenesArray[g_i]);
        }
      }
    }
    else {
      lifes[i]=new Life(random(paddingWidth,fieldWidth - paddingWidth),random(paddingHeight, fieldHeight - paddingHeight),lifeRadius,defaultEnergy,Gene.randomGene());
    }
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

void draw(){
    // Refresh Game Field
  fill(0xff, backgroundTransparency);
  rect(0,0,fieldWidth,fieldHeight); // background() だと動作しない

  // Draw Lives
  Life[] killed = [];
  Life[] born = [];

  Life[] sortedX = lifes.slice(0, lifes.length);
  sortedX.sort(function(lhs, rhs) {
    return lhs.position.x - rhs.position.x;
  });

  populationPerSpecies = populationPerSpecies.map(function(){return 0});

  for (int i = 0; i < lifes.length; i++){
    Life focus = lifes[i];

    if(lifes[i].alive()){
      populationPerSpecies[focus.gene.getWholeGene()] += 1;
      born = born.concat(lifes[i].update());

      Life life = lifes[i];
      Life[] compareTo = [];

      int xIndex = sortedX.indexOf(life);

      float maxX = life.position.x + life.size / 2;
      float minX = life.position.x - life.size / 2;

      for (int k = xIndex + 1; k < sortedX.length; k++) {
        if (sortedX[k].position.x > maxX) {
          break;
        }
        compareTo[compareTo.length] = sortedX[k];
      }
      for (int k = xIndex - 1; k >= 0; k--) {
        if (sortedX[k].position.x < minX) {
          break;
        }
        compareTo[compareTo.length] = sortedX[k];
      }

      for (int j = 0; j < compareTo.length; j++){
        if(i==j) continue;
        if(isCollision(lifes[i], compareTo[j])) {
          Life predator, prey;
          float threshold = random(eatProbability, 1.0);
          if(compareTo[j].type == "Life" && !compareTo[j].alive()) continue;// もし死体なら食べない
          if (lifes[i].gene.canEat(compareTo[j].gene) > threshold) {
            predator = lifes[i];
            prey = compareTo[j];

          } else {
            continue;
          }

          predator.eat(prey);
          killed[killed.length] = prey;
          break;
        }
      }
    }
    lifes[i].draw();
  }

  lifes = lifes.filter( function( el ) { //死
    return killed.indexOf( el ) < 0;
  } );

  lifes = lifes.concat(born); //生

  addResources();

// Draw Graph
  drawGraph();
}

void drawGraph(){
  strokeWeight(3);
  var t;
  var unit;

  t= timer();
  unit = t;
  populationPerSpecies.forEach(function(int pop, int gene){
    Gene g = Gene.fromWholeGene(gene);
    stroke(g.geneColor.r, g.geneColor.g, g.geneColor.b);
    point(unit%appFieldWidth, appFieldHeight-(pop * graphSize));
  });
  if((Math.floor(unit))%fieldWidth < 4) {
    clearGraph();
  }
}

void clearGraph(){
  fill(0xff);
  rect(0,fieldHeight,appFieldWidth,graphHeight);
}

var timer = (function(){
  var t = 0;
  return (function(){
    t++;
    return t;
    });
})();

void addResources() {
  int numberOfResources = int(random(0, resourceGrowth));
  Gene g = new Gene(0x0, 0x0);
  Gene g2 = new Gene(0x0, 0x0);
  for (int i = 0; i < numberOfResources; i++) {
    lifes[lifes.length] = Life.makeResource(random(10,fieldWidth - 10),random(10, fieldHeight - 10), resourceSize, (random(0, 1) < 0.5) ? g : g2);
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
//    lifes[lifes.length] = new Life(mouseX, mouseY, lifeRadius, defaultEnergy, new Gene(0xf, 0x2));
    for(int i=0; i!=10;i++){
     lifes[lifes.length] = Life.makeResource(mouseX+random(-lifeRadius, lifeRadius), mouseY+random(-lifeRadius, lifeRadius), resourceSize*10, new Gene(0x8, 0x8));
     //TODO:クリック後、その場所に継続的にエサを与え続ける
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
  if(key == 32){
    noLoop();
    fill(0xff);
      console.log("start");
      console.log("length:" + populationPerSpecies.length);
    populationPerSpecies.forEach(function(var e, var key){
      console.log("gene:" + Gene.fromWholeGene(key).showBinary() + " " + key + " " + e);
    });
      console.log("end");
  }
}

void keyReleased (){
  if(key == 32){
    loop();
  }
}
