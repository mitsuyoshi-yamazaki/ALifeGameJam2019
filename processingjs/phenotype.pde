var LifeKlass = PhenotypeLife;

void draw() {
	defaultDraw();
}

class PhenotypeLife extends Life {
  PhenotypeLife(float x, float y, float _size, float _energy, Gene _gene){
    super(x, y, _size, _energy, _gene);
  }
  void move(){}
}

class GenotypeGene extends Gene {

}

void setup()
{
  size(appFieldWidth, appFieldHeight);
  background(0xff);

  PFont fontA = loadFont("courier");
  textFont(fontA, 14);

  lifes = [];
  int paddingWidth =  max(fieldWidth - (initialPopulationFieldSize), 20) / 2;
  int paddingHeight =  max(fieldHeight - (initialPopulationFieldSize / 4), 20) / 2;

  Gene[] initialGenesArray = [new GenotypeGene(0, 0, 0)];
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
            lifes[lifes.length] = new LifeKlass(random(paddingWidth,fieldWidth - paddingWidth),random(paddingHeight, fieldHeight - paddingHeight),lifeRadius,defaultEnergy, initialGenesArray[g_i]);
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
        lifes[lifes.length]=new LifeKlass(random(paddingWidth,fieldWidth - paddingWidth),random(paddingHeight, fieldHeight - paddingHeight),lifeRadius,defaultEnergy,Gene.randomGene());
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
						PVector position;
						while (true) {
							bool contained = false;
							position = new PVector(random(10,fieldWidth - 10),random(10, fieldHeight - 10));
							for (int j = 0; j < walls.length; j++) {
								if (walls[j].contains(position)) {
									contained = true;
									break;
								}
							}
							if (contained == false) {
								break;
							}
						}
      lifes[lifes.length] = Life.makeResource(position.x, position.y, resourceSize, Gene.randomGene());
    } if(isTorusMode){
    }
  }
}