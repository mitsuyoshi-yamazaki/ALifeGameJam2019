/* TODO: ドット絵から逆生成
 乱数の種をURLで設定できたら再現しやすくなる
 */

// -- Parameters

// System
bool DEBUG = false;
bool artMode = false;

// Population
Life[] lifes;
int populationSize = 4000;
int initialResourceSize = 1000;
int resourceGrowth = 4.01;
int maxResourceSize = 5000;
// Inspector
int[] populationPerSpecies = [];
float graphSize = 0.4;
float graphHeight = 400;

// Field
float fieldWidth = 1000;
float fieldHeight = 500;
float initialPopulationFieldSize = 600; // 起動時に生まれるLifeの置かれる場所の大きさ
bool useSingleGene = true;

float appFieldWidth = fieldWidth;
float appFieldHeight = fieldHeight + graphHeight;

bool isLinearMode=false;
bool isTorusMode=false;
bool isCircumMode=false;
bool isNormalMode=true;
bool isRotateMode=false;


bool clickResource = false;

// Walls
int wallWidth = 40;
int space = fieldHeight / 10;
Wall[] walls = [];

if (isNormalMode) {
	walls = [
		new Wall((fieldWidth - wallWidth) / 2, 0, wallWidth, (fieldHeight - space) / 2),
		new Wall((fieldWidth - wallWidth) / 2, (fieldHeight + space) / 2, wallWidth, (fieldHeight - space) / 2),
	]
}

// Color
float backgroundTransparency = 0xff;
bool enableEatColor = true;
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

// Gene Parameter
int geneLength = 3;
int geneMaxValue = Math.pow(2, geneLength) - 1;
int wholeLength = geneLength*2;
int wholeMax = Math.pow(2, wholeLength) - 1;

// Fight
float eatProbability = 0.9;

// Evolution
float mutationRate = 0.03;
bool isScavenger = true;

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

class Wall {
	float x;
	float maxX;
	float y;
	float maxY;
	float width;
	float height;

	Wall(float _x, float _y, float _width, float _height) {
		x = _x;
		y = _y;
		width = _width;
		height = _height;
		maxX = x + width;
		maxY = y + height;
	}

	bool contains(PVector position) {
		return position.x > x && position.x < maxX && position.y > y && position.y < maxY;
	}
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
  int uncoGene;
  float size = lifeRadius;
  Color geneColor;

  Gene(int _predatorGene, int _preyGene, int _uncoGene) {
    predatorGene = _predatorGene % (Math.pow(2, geneLength));
    preyGene = _preyGene % (Math.pow(2, geneLength));
    uncoGene = _uncoGene % (Math.pow(2, geneLength));

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
      Gene g = new Gene(predatorGene, preyGene, uncoGene);
      g.size = max(2,sizeRate/2 - random(0,sizeRate) + size);
      return g;
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
    Gene g = new Gene(good_w >> geneLength, good_w & (wholeMax >> geneLength), Math.round(random(0, geneMaxValue)));
    g.setWholeGene(good_w);
    return g;
  }

  float canEat(Gene other) {
    int diff = 0;
    if(size + 3 < other.size) {
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
    return '' + predatorGene + ' | ' + preyGene + ' | ' + uncoGene + ' | ' + round(size)
  }
}

var makeTimer = (function(){
  var t = 0;
  return (function(){
    t++;
    return t;
    });
});

class RotateLife extends Life{
  PVector velocity;
  RotateLife(float x, float y, float _size, float _energy, Gene _gene){
    super(x, y, _size, _energy, _gene);
    velocity = new PVector(random(-1, 1), random(0,1));
  }
  static Life makeResource(float x, float y, float size, Gene gene) {
    Life resource = new RotateLife(x, y, size, 0, gene);
    resource.bodyEnergy *= 20;
    resource.type = 'Resource';

    return resource;
  }
  static float outerCircle = 700;
  static  float innerCircle = 0;
  static   float middleCircle = (outerCircle + innerCircle)/2;
  void move(){
    velocity.add(new PVector(customizedRandom(-1, 1), customizedRandom(-1,1)));
    PVector center = new PVector (fieldWidth/2, fieldHeight/2);
    float fromCenter = PVector.sub(position, center);
    float distanceFromCenter = fromCenter.mag();


    if(distanceFromCenter < outerCircle && distanceFromCenter > innerCircle){
      velocity.x += - sin (fromCenter.heading()) * 0.1;
      velocity.y += cos (fromCenter.heading()) * 0.1;
      // プラスかマイナスかに応じて時計周りと反時計周りを変えられる

      PVector donutCenter = PVector.add(center, PVector.mult(PVector.normalize(fromCenter), middleCircle));
      PVector fromDonutCenterToPos = PVector.sub(position,donutCenter);
      velocity = PVector.sub(velocity, PVector.normalize(fromDonutCenterToPos));
    }

    vx = velocity.x;
    vy = velocity.y;

    position.x += vx;
    position.y += vy;

    float energyConsumption = (new PVector(vx, vy)).mag() * size * size * energyConsumptionRate;
    if(position.x <= 0 || position.x >= fieldWidth){
      velocity.x = - velocity.x;
      //energy = 0;
    }
    if(position.y <= 0 || position.y+lifeRadius >= fieldHeight){
      velocity.y = - velocity.y;
      //energy = 0;
    }
    position.x = min(position.x, fieldWidth);
    position.x = max(position.x, 0);
    position.y = min(position.y, fieldHeight);
    position.y = max(position.y, 0);

    energy -= energyConsumption;

  }
  Life replicate(int x, int y, int size, int energy, Gene g){
    Life newLife = (new RotateLife(x, y, size, energy, g));
    //newLife.velocity = new PVector(velocity.x, velocity.y);
    return newLife;
  }
}


class TorusLife extends Life{
  PVector velocity;
  TorusLife(float x, float y, float _size, float _energy, Gene _gene){
    super(x, y, _size, _energy, _gene);
    velocity = new PVector(random(-1, 1), random(0,1));
  }
  static Life makeResource(float x, float y, float size, Gene gene) {
    Life resource = new TorusLife(x, y, size, 0, gene);
    resource.bodyEnergy *= 20;
    resource.type = 'Resource';

    return resource;
  }
  void move(){
    velocity.add(new PVector(customizedRandom(-1, 1), customizedRandom(-1,1)));
    PVector center = new PVector (fieldWidth/2, fieldHeight/2);

    vx = velocity.x;
    vy = velocity.y;

    position.x += vx;
    position.y += vy;

    float energyConsumption = (new PVector(vx, vy)).mag() * size * size * energyConsumptionRate
    function mod(i, j) {
      return (i % j) < 0 ? (i % j) + 0 + (j < 0 ? -j : j) : (i % j + 0);
    }
    position.x = mod(position.x, fieldWidth)
    position.y = mod(position.y, fieldHeight)

    energy -= energyConsumption;

  }
  void drawTriangle(int x, int y, int r, float rot) {
    pushMatrix();
    translate(x, y);  // 中心となる座標
    //console.log(degrees(rot));
    rotate(rot - PI/2);

    // 円を均等に3分割する点を結び、三角形をつくる
    beginShape();
      vertex(r*cos(PI/2), r*sin(PI/2));
      vertex(r*cos(0)/2, rot/4);
      vertex(r*cos(PI)/2, rot/4);
    endShape(CLOSE);
    beginShape();
      vertex(0, 0);
      vertex(r*cos(3*PI/2), r*sin(3*PI/2));
    endShape(CLOSE);


    popMatrix();
  }
  /*
  void draw(){
    if(alive()){
      stroke(gene.geneColor.r, gene.geneColor.g, gene.geneColor.b);
      drawTriangle(position.x, position.y, size/3, velocity.heading());
    } else {
      super.draw();
      }
  }
  */
  Life replicate(int x, int y, int size, int energy, Gene g){
    Life newLife = (new TorusLife(x, y, size, energy, g));
    newLife.velocity = new PVector(velocity.x, velocity.y);
    return newLife;
  }
}


class LinearLife extends Life{
  static float constant_y(){return fieldHeight/2;}
  LinearLife(float x, float _size, float _energy, Gene _gene){
    super(x, constant_y(), _size, _energy, _gene);
    position = new PVector(x, constant_y());
  }
  static Life makeResource(float x, float y, float size, Gene gene) {
    Life resource = new LinearLife(x, size, 0, gene);
    resource.bodyEnergy *= 20;
    resource.type = 'Resource';

    return resource;
  }
  void move(){
    float vx = random(0, 1)<0.5 ? 1*sqrt(defaultMoveDistance) : 1*(-sqrt(defaultMoveDistance));

    position.x += vx;

    float energyConsumption = (new PVector(vx)).mag() * size * size * energyConsumptionRate
    position.x = min(position.x, fieldWidth)
    position.x = max(position.x, 0)
    position.y = constant_y();

    energy -= energyConsumption;
  }


  Life[] reproduce(){
    float birthEnergy = size * size;

    if (energy > birthEnergy) {
      float energyAfterBirth = (energy - birthEnergy) / 2;
      float radian =  random(0, 1)<0.5 ? 1 : (-1);

      float x = position.x + radian * size * 3.0;
      float y = position.y;

      Gene newGene = gene.childGene();

      Life child = new LinearLife(x, size, energyAfterBirth, newGene);

      energy = energyAfterBirth;

      return [child];
    }
    return [];
  }
}

class CircumLife extends Life{
  static Vector constant_center(){return new PVector(fieldWidth/2,fieldHeight/2);}
  static float constant_radius(){return 250;}

  // angle :: radian
  CircumLife(float angle, float _size, float _energy, Gene _gene){
    super(constant_center().x + constant_radius() * Math.cos(angle),
          constant_center().y + constant_radius() * Math.sin(angle),
          _size, _energy, _gene)
    position.x = constant_center().x + constant_radius() * Math.cos(angle);
    position.y = constant_center().y + constant_radius() * Math.sin(angle);
  }
  static Life makeResource(float angle, float size, Gene gene) {
    Life resource = new CircumLife(angle, size, 0, gene);
    resource.bodyEnergy *= 20;
    resource.type = 'Resource';

    return resource;
  }
  float getAngle(){
    PVector v = PVector.sub(position, constant_center());
    //AB = OB - OA
    //OA : (0,0)→中心
    //OB : (0,0)→現在
    //AB : 中心→現在
    return Math.atan2(v.y,v.x);
  }
  void move(){
    float currentAngle = getAngle();
    float vangle = random(-0.01, 0.1);

    position.x = constant_center().x + constant_radius() * Math.cos(currentAngle+ vangle);
    position.y = constant_center().y + constant_radius() * Math.sin(currentAngle+vangle);

    float energyConsumption = vangle * size * size * energyConsumptionRate;
    //position.x = min(position.x, fieldWidth)
    //position.x = max(position.x, 0)

    energy -= energyConsumption;
  }

  Life[] reproduce(){
    float birthEnergy = size * size;

    if (energy > birthEnergy) {
      float energyAfterBirth = (energy - birthEnergy) / 2;
      float radian =  random(0, 1)<0.5 ? 1 : (-1);

      float currentAngle = getAngle();
      float vangle = random(0, 0.01);

      Gene newGene = gene.childGene();

      Life child = new CircumLife(currentAngle+vangle, size, energyAfterBirth, newGene);

      energy = energyAfterBirth;

      return [child];
    }
    return [];
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
  float previousEnergy; // 分裂前のエネルギー
  String type = 'Life';

  Life(float x, float y, float _size, float _energy, Gene _gene){
    position = new PVector(x, y);
    size = _gene.size;
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
  void unco(float e){
    if(populationOfResource > maxResourceSize) {
     return;
    }
    if(random(0,1)<=0.01){

//      for (int i = 0; i < 2; i++) {
        float vx = random(-defaultMoveDistance, defaultMoveDistance);
        float vy = random(-defaultMoveDistance, defaultMoveDistance);
        float positionx = position.x + vx;
        float positiony = position.y + vy;
        positionx = min(positionx, fieldWidth-10);
        positionx = max(positionx, 10);
        positiony = min(positiony, fieldHeight-10);
        positiony = max(positiony, 10);

        Gene g = new Gene(gene.uncoGene,gene.uncoGene,0);
        g.size = resourceSize;
        Life res = Life.makeResource(positionx, positiony, resourceSize * 0.3, g);
        res.bodyEnergy = e * 100;

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
    float moveDistance = defaultMoveDistance * sizeRatio * sizeRatio;
    float vx = random(-moveDistance, moveDistance);
    float vy = random(-moveDistance, moveDistance);
    position.x += vx;
    position.y += vy;

    float energyConsumption = (new PVector(vx, vy)).mag() * size * size * energyConsumptionRate ;

    position.x = min(position.x, fieldWidth);
    position.x = max(position.x, 0);
    position.y = min(position.y, fieldHeight);
    position.y = max(position.y, 0);

    unco(energyConsumption/2);
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
    if (useSingleGene) {
      float dice;
      dice = Math.floor(random(0, initialGenesArray.length));
      for(int g_i = 0; g_i != initialGenesArray.length;g_i++){
        if(dice == g_i)
        {
          if(isLinearMode){
            lifes[lifes.length] = new LinearLife(random(paddingWidth,fieldWidth - paddingWidth),lifeRadius,defaultEnergy, initialGenesArray[g_i]);
          } if(isCircumMode){
            lifes[lifes.length] = new CircumLife(random(0, Math.PI*2),
                                      lifeRadius,
                                      defaultEnergy,
                                      initialGenesArray[g_i]);
          } if(isNormalMode) {
            lifes[lifes.length] = new Life(random(paddingWidth,fieldWidth - paddingWidth),random(paddingHeight, fieldHeight - paddingHeight),lifeRadius,defaultEnergy, initialGenesArray[g_i]);
          } if(isTorusMode){
            lifes[lifes.length] = new TorusLife(random(paddingWidth,fieldWidth - paddingWidth),random(paddingHeight, fieldHeight - paddingHeight),lifeRadius,defaultEnergy, initialGenesArray[g_i]);
          } if(isRotateMode){
            lifes[lifes.length] = new RotateLife(random(paddingWidth,fieldWidth - paddingWidth),random(paddingHeight, fieldHeight - paddingHeight),lifeRadius,defaultEnergy, initialGenesArray[g_i]);
          }
        }
      }
    }
    else {
      if(isLinearMode){
        lifes[lifes.length]=new LinearLife(random(paddingWidth,fieldWidth - paddingWidth),lifeRadius,defaultEnergy,Gene.randomGene());
      } if(isCircumMode){
        lifes[lifes.length]=new CircumLife(random(0, Math.PI*2),
                                       lifeRadius,
                                       defaultEnergy,
                                       Gene.randomGene());
      }if(isNormalMode){
        lifes[lifes.length]=new Life(random(paddingWidth,fieldWidth - paddingWidth),random(paddingHeight, fieldHeight - paddingHeight),lifeRadius,defaultEnergy,Gene.randomGene());
      }if(isTorusMode){
        lifes[lifes.length]=new TorusLife(random(paddingWidth,fieldWidth - paddingWidth),random(paddingHeight, fieldHeight - paddingHeight),lifeRadius,defaultEnergy,Gene.randomGene());
      } if(isRotateMode){
        lifes[lifes.length]=new RotateLife(random(paddingWidth,fieldWidth - paddingWidth),random(paddingHeight, fieldHeight - paddingHeight),lifeRadius,defaultEnergy,Gene.randomGene());
      }
    }
  }
  for (int i = 0; i < initialResourceSize; i++) {
    Gene g1 = new Gene(0, 0, 0);
    g1.size = resourceSize;
    if(isLinearMode){
      lifes[lifes.length] = LinearLife.makeResource(random(paddingWidth,fieldWidth - paddingWidth),resourceSize, Gene.randomGene());
    }
    if (isCircumMode){
      lifes[lifes.length] = CircumLife.makeResource(random(0, 2 * Math.PI), resourceSize, Gene.randomGene());
    } if(isNormalMode || isTorusMode || isRotateMode){
      lifes[lifes.length] = Life.makeResource(random(paddingWidth,fieldWidth - paddingWidth),random(paddingHeight, fieldHeight - paddingHeight), resourceSize, Gene.randomGene());
    } if(isTorusMode){
    }
  }
}

int populationOfResource = 0;
void draw(){
  // Refresh Game Field
  fill(0xff, backgroundTransparency);
  /*if(second()%30==0){
    fill(0xff, 0xff);
  }*/
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

		for (int ii = 0; ii < walls.length; ii++) {
			Wall wall = walls[ii]
			stroke(255)
			fill(80)
			rect(wall.x, wall.y, wall.width, wall.height)
		}

  if(isRotateMode && !artMode){
    PVector center = new PVector (fieldWidth/2, fieldHeight/2);
    fill(255, 0, 0, 40);
    ellipse (center.x, center.y, RotateLife.outerCircle*2,RotateLife.outerCircle*2);
    fill(255, 255, 255);
    ellipse (center.x, center.y, RotateLife.innerCircle*2,RotateLife.innerCircle*2);
  }

  for (int i = 0; i < lifes.length; i++){
    Life focus = lifes[i];

    if (lifes[i].type == "Resource"){
      nextPopulationOfResource += 1;
    }
    if(lifes[i].alive()){
      born = born.concat(lifes[i].update());
      populationPerSpecies[focus.gene.getWholeGene()] += 1;

      Life life = lifes[i];
						bool isDead = false;
						for (int ii = 0; ii < walls.length; ii++) {
							Wall wall = walls[ii];
							if (wall.contains(life.position)) {
								isDead = true
								break;
							}
						}
						if (isDead) {
							life.energy = 0.0;
							killed[killed.length] = life;
							continue;
						}

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
  drawGraph();

  //console.log("frameRate: " + frameRate);
}

void drawGraph(){
  strokeWeight(3);
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
    if(isLinearMode){
      lifes[lifes.length] = LinearLife.makeResource(random(10,fieldWidth - 10),random(10, fieldHeight - 10), resourceSize, Gene.randomGene());
    } if (isCircumMode){
      lifes[lifes.length] = CircumLife.makeResource(random(0, 2*Math.PI), resourceSize, Gene.randomGene());
    } if(isNormalMode || isRotateMode || isTorusMode){
      lifes[lifes.length] = Life.makeResource(random(10,fieldWidth - 10),random(10, fieldHeight - 10), resourceSize, g);
    }
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
  if(clickResource){
      for(int i=0; i!=10;i++){
      lifes[lifes.length] = Life.makeResource(mouseX+random(-lifeRadius, lifeRadius), mouseY+random(-lifeRadius, lifeRadius), resourceSize*10, Gene.randomGene());
      //TODO:クリック後、その場所に継続的にエサを与え続ける
      }
    }
  }
}

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
