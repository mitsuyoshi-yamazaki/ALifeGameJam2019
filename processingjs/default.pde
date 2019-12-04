var LifeKlass = Life;

void setup() {
	defaultSetup();
}

void draw() {
	defaultDraw();
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
     lifes[lifes.length] = Life.makeResource(mouseX+random(-lifeRadius, lifeRadius), mouseY+random(-lifeRadius, lifeRadius), resourceSize*10, Gene.randomGene());
     //TODO:クリック後、その場所に継続的にエサを与え続ける
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
