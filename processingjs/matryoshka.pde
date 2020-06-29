// -- Parameters

// System
bool DEBUG = false;

// Parameters
bool artMode = false;
int populationSize = 1000;
float mutationRate = 0.01;
float fieldWidth = 1000;
float fieldHeight = 500;
int screenshotInterval = 1000;
bool screenshotEnabled = false;

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
if (parameters['field_size'] != null) {
  fieldWidth = int(parameters['field_size']);
  fieldHeight = Math.floor(fieldWidth * 0.6);
}
if (parameters['screenshot_interval'] != null) {
  screenshotInterval = int(parameters['screenshot_interval']);
		screenshotEnabled = true;
}


// Timestamp
int t = 0;
String launchTime = '' + Math.floor((new Date()).getTime() / 1000);

// Population
Life[] lifes;
int initialResourceSize = 1000;
int resourceGrowth = 4.01;
int maxResourceSize = 10000;
// Inspector
int[] populationPerSpecies = [];
float graphSize = 0.4;
float graphHeight = 400;
bool graphEnabled = true;
if (artMode) {
	graphEnabled = false;
}
if (!graphEnabled) {
 graphHeight = 0;
}

// Field
float initialPopulationFieldSize = 600; // 起動時に生まれるLifeの置かれる場所の大きさ

float appFieldWidth = fieldWidth;
float appFieldHeight = fieldHeight + graphHeight;

bool clickResource = false;

// Color
float backgroundTransparency = 0xff;
bool enableEatColor = false;
bool disableResourceColor = false;

// Life Parameter
float lifeRadius = 7;
float resourceSize = lifeRadius * 0.3;
float defaultEnergy = 50;
float energyConsumptionRate= 1 / (lifeRadius * lifeRadius * 40);
float defaultMoveDistance = lifeRadius / 2;
float visualSizeCoeff = 1;

bool enableMeaningfulSize =false;
bool enableReproduction=true;
bool droppingsEnabled = false;
bool mutatingSizeEnabled = false;

// Gene Parameter
int geneLength = 4;
int geneMaxValue = Math.pow(2, geneLength) - 1;
int wholeLength = geneLength*2;
int wholeMax = Math.pow(2, wholeLength) - 1;

// Fight
float eatProbability = 0.9;

// Evolution
bool isScavenger = true;


// Artistics Mode
if (artMode) {
  backgroundTransparency = 0;
  enableEatColor = false;
  disableResourceColor = true;
}

// Detailed View
bool detailedView = false;
if(detailedView){
  //enableMeaningfulSize = true;
  visualSizeCoeff = 4;
  populationSize = 3;
  initialResourceSize = 400;
  mutationRate = 0.03;
  enableReproduction = true;
  resourceGrowth = 1 + 2.1;
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
  int droppingsGene;
  float size = lifeRadius * 0.4;
  Color geneColor;

  Gene(int _predatorGene, int _preyGene, int _droppingsGene) {
    predatorGene = _predatorGene % (Math.pow(2, geneLength));
    preyGene = _preyGene % (Math.pow(2, geneLength));
    droppingsGene = _droppingsGene ;

    var shiftInt = (function(shiftee, shiftLength) { //負の数のとき逆向きになる<<
      if(shiftLength > 0){
        return (shiftee << shiftLength);
        }
      else{
        return (shiftee >> (-shiftLength));
        }
      });

    geneColor = new Color(shiftInt(predatorGene, 8-geneLength), shiftInt(preyGene, 8-geneLength) , 0xff);
  }

  static Gene randomGene() {
    return new Gene(Math.round(random(0, geneMaxValue)), Math.round(random(0, geneMaxValue)), Math.round(random(0, geneMaxValue)));
  }

  Gene mutantGene(){
    int mutation = (1 << (random(0, wholeLength)));
    int childwholegene = (this.getWholeGene()) ^ mutation;
    return fromWholeGene(childwholegene);
  }
  float sizeRate = 1;
  Gene childGene(){
    if (mutationRate > random(0.0, 1.0)){
      Gene g = mutantGene();
      g.size = max(2,sizeRate - random(0,sizeRate*2) + size);
      return g;
    } else {
      Gene g = new Gene(predatorGene, preyGene, droppingsGene);
      g.size = max(2,sizeRate/2 - random(0,sizeRate) + size);
      return g;
    }
  }
  string showBinary(){
    String str = "";
    for(int i=0; i!=wholeLength;i++){
//      console.log(((getWholeGene() >> i) & 0x01));
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
    Gene g = new Gene(good_w >> geneLength, good_w & (wholeMax >> geneLength), Math.round(random(0, geneMaxValue)));
    g.setWholeGene(good_w);
    return g;
  }

  float canEat(Gene other) {
    int diff = 0;
    if(size + 2 < other.size) {
      return 0;
    }

    for (int i = 0; i < geneLength; i++) {
      if (((predatorGene >> i) & 0x01) == ((other.preyGene >> i) & 0x01)) {
        diff += 1;
      }
    }
    return float(diff) / float(geneLength)
  }

  String description() {
    return '' + predatorGene + ' | ' + preyGene + ' | ' + droppingsGene + ' | ' + round(size)
  }
}

var makeTimer = (function(){
  var t = 0;
  return (function(){
    t++;
    return t;
    });
});

class Life {

  PVector position;
  float v, r;
  float size;
  float bodyEnergy;
  bool isEaten = false;
  Gene gene;
  float energy;
  float previousEnergy; // 分裂前のエネルギー
  String type = 'Life';

  Life(float x, float y, float _size, float _energy, Gene _gene){
    position = new PVector(x, y);
				if (mutatingSizeEnabled) {
     size = _gene.size;
				} else {
     size = _size;
				}
    energy=_energy;
    gene = _gene;
    bodyEnergy = size * size;

    v = 0.0;
    r = 0.0;
  }

  static Life makeResource(float x, float y, float size, Gene gene) {
    gene.size = resourceSize;
    Life resource = new Life(x, y, resourceSize, 0, gene);
    resource.bodyEnergy *= 100;
    resource.type = 'Resource';

    return resource;
  }
  /*static Life randomPlace(Gene gene){
    return (new Life(random(paddingWidth,fieldWidth - paddingWidth),
                    random(paddingHeight, fieldHeight - paddingHeight),
                    lifeRadius,
                    defaultEnergy,
                    gene));
  }*/

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
    other.previousEnergy = other.energy;
    other.energy = 0;
    other.bodyEnergy = 0;
    other.eaten();
  }
  void leftDroppings(float e){
			 if (droppingsEnabled == false) {
     return;
				}
    if(populationOfResource > maxResourceSize) {
     return;
    }
    if(random(0,1)<=0.0001){

//      for (int i = 0; i < 2; i++) {
        float vx = random(-defaultMoveDistance, defaultMoveDistance);
        float vy = random(-defaultMoveDistance, defaultMoveDistance);
        float positionx = position.x + vx;
        float positiony = position.y + vy;
        positionx = min(positionx, fieldWidth-10);
        positionx = max(positionx, 10);
        positiony = min(positiony, fieldHeight-10);
        positiony = max(positiony, 10);
        Gene g = new Gene(gene.droppingsGene,gene.droppingsGene,0);
        g.size = resourceSize;
        Life res = Life.makeResource(positionx, positiony, resourceSize * 0.3, g);
        res.bodyEnergy = e * 10000;
        lifes[lifes.length] = res;
//     }
    }
  }

  void eaten() {
    isEaten = true;
  }

  void move(){
    // v += 2;
    // v *= customizedRandom(-5, 5);
    // r += customizedRandom(-6, 6);
    // float vx = Math.cos(r) * v;
    // float vy = Math.sin(r) * v;
    float sizeRatio = size / lifeRadius;
    float moveDistance = defaultMoveDistance * sizeRatio;
    float vx = random(-moveDistance, moveDistance);
    float vy = random(-moveDistance, moveDistance);
    position.x += vx;
    position.y += vy;

    float energyConsumption = (new PVector(vx, vy)).mag() * size * size * energyConsumptionRate ;

    position.x = min(position.x, fieldWidth);
    position.x = max(position.x, 0);
    position.y = min(position.y, fieldHeight);
    position.y = max(position.y, 0);

    leftDroppings(energyConsumption/2);
    energy -= energyConsumption;
  }
  void draw(){
    int size = this.size * visualSizeCoeff;
    if (type == 'Life') {
     if (enableEatColor && isEaten) {
      if(enableMeaningfulSize){
        stroke(gene.geneColor.r, gene.geneColor.g, gene.geneColor.b,256);
        fill(gene.geneColor.r, gene.geneColor.g, gene.geneColor.b,128);
        ellipse(position.x, position.y, size+size*sqrt(previousEnergy)/4, size+size*sqrt(previousEnergy)/4);

        stroke(255, 0, 0,128);
        fill(255, 0, 0, 100);
        ellipse(position.x, position.y, size+size*sqrt(previousEnergy)/4, size+size*sqrt(previousEnergy)/4);
      } else {
        //stroke(gene.geneColor.r, gene.geneColor.g, gene.geneColor.b,256);
        fill(gene.geneColor.r, gene.geneColor.g, gene.geneColor.b,128);
        ellipse(position.x, position.y, size, size);

        //stroke(255, 0, 0,128);
        fill(255, 0, 0, 100);
        ellipse(position.x, position.y, size, size);
      }
     } else {
       if(enableMeaningfulSize){
       stroke(gene.geneColor.r, gene.geneColor.g, gene.geneColor.b,256);
       fill(gene.geneColor.r, gene.geneColor.g, gene.geneColor.b,128);
       } else{
       noStroke();
       fill(gene.geneColor.r, gene.geneColor.g, gene.geneColor.b);
       }
     }

      if (alive()) {
        if(enableMeaningfulSize){
          if(previousEnergy == 0)
          {
            ellipse(position.x, position.y, size+size*sqrt(energy)/4, size+size*sqrt(energy)/4);
          } else if (previousEnergy <= energy) {
            previousEnergy = 0;
            ellipse(position.x, position.y, size+size*sqrt(energy)/4, size+size*sqrt(energy)/4);
          } else if (previousEnergy > energy){
            previousEnergy-=previousEnergy/2;
            ellipse(position.x, position.y, size+size*sqrt(previousEnergy)/4, size+size*sqrt(previousEnergy)/4);
          }

          stroke(gene.geneColor.r-50, gene.geneColor.g-50, gene.geneColor.b-50,128);
          fill(gene.geneColor.r, gene.geneColor.g, gene.geneColor.b,60);
          ellipse(position.x, position.y, size, size);

        } else {
          ellipse(position.x, position.y, size, size);
        }
      } else {
        if (disableResourceColor) return;
        rect(position.x, position.y, size*sqrt(energy)/4, size*sqrt(energy)/4);
      }

    } else {
      if (disableResourceColor) return;

      if (enableEatColor && isEaten) {
        noStroke();
        fill(255, 0, 0);
      } else {
        // Alive
        noStroke();
        //fill(81, 145, 198);
        fill(gene.geneColor.r, gene.geneColor.g, gene.geneColor.b);
      }
      rect(position.x, position.y, size, size);
    }
  }
  Life replicate(int x, int y, int size, int energy, Gene g){
    return (new Life(x, y, size, energy, g))
  }

  Life[] reproduce(){
    float birthEnergy = size * size;

    if(!enableReproduction) return [];
    if (energy > birthEnergy * 2) {
      float energyAfterBirth = (energy - birthEnergy) / 2;
      float radian = random(0, 2.0 * PI);

      float x = position.x + sin(radian) * size * 3.0;
      float y = position.y + cos(radian) * size * 3.0;

      Gene newGene = gene.childGene();

      Life child = replicate(x, y, size, energyAfterBirth, newGene);

      previousEnergy = energy;
      energy = energyAfterBirth;

      return [child];
    }
    return [];
  }

  Life[] update(){
    if (!alive()) return[];

    Life[] childs = reproduce();
    if(childs.length != 0) return childs;
    move();
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
  int paddingWidth =  max(fieldWidth - (initialPopulationFieldSize), 20) / 2;
  int paddingHeight =  max(fieldHeight - (initialPopulationFieldSize / 4), 20) / 2;

  Gene[] initialGenesArray = [new Gene(0, 0, 0)]; //[Gene.randomGene()];
  for(int i=0; i < populationSize;i++){
    lifes[lifes.length]=new Life(random(paddingWidth,fieldWidth - paddingWidth),random(paddingHeight, fieldHeight - paddingHeight),lifeRadius,defaultEnergy,Gene.randomGene());
  }
  for (int i = 0; i < initialResourceSize; i++) {
    Gene g1 = new Gene(0, 0, 0);
    g1.size = resourceSize;
    lifes[lifes.length] = Life.makeResource(random(10,fieldWidth - 10), random(10,fieldHeight - 10), resourceSize, Gene.randomGene());
  }
}

int populationOfResource = 0;
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
  int nextPopulationOfResource = 0;

  for (int i = 0; i < lifes.length; i++){
    Life focus = lifes[i];

    if (lifes[i].type == "Resource"){
      nextPopulationOfResource += 1;
    }
    if(lifes[i].alive()){
      born = born.concat(lifes[i].update());
      populationPerSpecies[focus.gene.getWholeGene()] += 1;

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
          if(!isScavenger){ // スカベンジャーオプションがオフの場合
            if(compareTo[j].type == "Life" && !compareTo[j].alive()) continue;// もし死体なら食べない
          }
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
  populationOfResource = nextPopulationOfResource;

  lifes = lifes.filter( function( el ) { //死
    return killed.indexOf( el ) < 0;
  } );

  lifes = lifes.concat(born); //生

  addResources();

// Draw Graph
		if (graphEnabled) {
  	drawGraph();
		}

  //console.log("frameRate: " + frameRate);

		setTimestamp(t);	// see screenshot.js
		if (screenshotEnabled && (t % screenshotInterval == 0)) {
			saveScreenshot();
		}
		t += 1;
}

void drawGraph(){
  strokeWeight(2);
  var t;
  var unit;

  t= timer();
  unit = t/2;
  populationPerSpecies.forEach(function(int pop, int gene){
    Gene g = Gene.fromWholeGene(gene);
    stroke(g.geneColor.r, g.geneColor.g, g.geneColor.b);
    point(unit%appFieldWidth, appFieldHeight-(pop * graphSize));
  });

  stroke(0xff, 0xff, 0);
  point(unit%appFieldWidth, appFieldHeight-(populationOfResource * graphSize));

  if((Math.floor(unit))%fieldWidth < 4) {
    clearGraph();
  }
}

void clearGraph(){
  fill(0xff);
  rect(0,fieldHeight,appFieldWidth,graphHeight);
}

var timer = makeTimer();

void addResources() {
  if(populationOfResource > maxResourceSize) {
    return
  }
  int numberOfResources = int(random(0, resourceGrowth));
//  Gene g = new Gene(0, 0, 0);
  Gene g = Gene.randomGene();
  for (int i = 0; i < numberOfResources; i++) {
    lifes[lifes.length] = Life.makeResource(random(10,fieldWidth - 10), random(10,fieldHeight - 10), resourceSize, Gene.randomGene());
  }
}
