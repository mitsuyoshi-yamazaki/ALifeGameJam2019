let world;
function setup() {
    const size = 800;
    const worldSize = createVector(size, size);
    createCanvas(size, size);
    world = new VanillaWorld(worldSize, new GravitationalTerrain(worldSize, 1));
    const lives = randomLives(80, size, 1);
    world.addLives(lives);
}
function draw() {
    world.next();
    world.draw();
}
function randomLives(numberOfLives, positionSpace, velocity) {
    const lives = [...new Array(numberOfLives).keys()].map(_ => {
        return new Life(createVector(random(positionSpace), random(positionSpace)));
    });
    if (velocity != undefined) {
        lives.forEach(life => {
            life.velocity = createVector(random(-velocity, velocity), random(-velocity, velocity));
        });
    }
    return lives;
}
class VanillaWorld {
    constructor(size, terrain) {
        this._t = 0;
        this._objects = [];
        this._lives = [];
        this._size = size;
        this._terrain = terrain;
    }
    get size() {
        return this._size;
    }
    get t() {
        return this._t;
    }
    get terrain() {
        return this._terrain;
    }
    get objects() {
        return this._objects;
    }
    get lives() {
        return this._lives;
    }
    addObjects(objects) {
        this._objects = this._objects.concat(objects);
    }
    addLives(lives) {
        this._lives = this._lives.concat(lives);
    }
    next() {
        this._t += 1;
        this._lives.forEach(life => {
            const fieldForce = this.terrain.forceAt(life.position);
            const force = life.next()
                .add(fieldForce);
            const friction = this.terrain.frictionAt(life.position);
            const acceleration = force.accelerationTo(life.mass);
            const nextPosition = p5.Vector.add(life.position, life.velocity);
            const x = Math.max(Math.min(nextPosition.x, this.size.x), 0);
            const y = Math.max(Math.min(nextPosition.y, this.size.y), 0);
            life.position = createVector(x, y);
            life.velocity = p5.Vector.add(p5.Vector.mult(life.velocity, friction), acceleration);
        });
    }
    draw() {
        background(220);
        this.terrain.draw();
        this._objects.forEach(obj => {
            obj.draw();
        });
        this._lives.forEach(life => {
            life.draw();
        });
    }
}
// その場所に存在する力やプロパティを格納する
class Terrain {
    constructor(size) {
        this.size = size;
    }
    frictionAt(position) {
        return 1; // 0(停止) ~ 1(摩擦なし)
    }
    forceAt(position) {
        return Force.zero();
    }
    draw() {
        return;
    }
}
class VanillaTerrain extends Terrain {
    constructor(size, immobilizedWidth) {
        super(size);
        this.size = size;
        this.immobilizedWidth = immobilizedWidth;
    }
    frictionAt(position) {
        if (position.x < this.immobilizedWidth) {
            return (position.x / this.immobilizedWidth);
        }
        if (position.x > (this.size.x - this.immobilizedWidth)) {
            return (this.size.x - position.x) / this.immobilizedWidth;
        }
        if (position.y < this.immobilizedWidth) {
            return (position.y / this.immobilizedWidth);
        }
        if (position.y > (this.size.y - this.immobilizedWidth)) {
            return (this.size.y - position.y) / this.immobilizedWidth;
        }
        return 1;
    }
    forceAt(position) {
        return Force.zero();
    }
    draw() {
        stroke(207, 196, 251);
        strokeWeight(this.immobilizedWidth);
        noFill();
        rect(0, 0, this.size.x, this.size.y);
    }
}
class GravitationalTerrain extends Terrain {
    constructor(size, gravity) {
        super(size);
        this.size = size;
        this.gravity = gravity;
        this.center = p5.Vector.mult(size, 0.5);
    }
    frictionAt(position) {
        // // 大気圏
        // const distance = Math.max(this.center.dist(position), 0.1)
        // if (distance > 10) {
        //   return 1
        // }
        // return (distance / 10)
        return 1;
    }
    forceAt(position) {
        const distance = Math.max(this.center.dist(position), 0.1); // ブラックホールは法律で禁止されている
        const magnitude = (1 / (distance * distance)) * this.gravity;
        const vector = p5.Vector.sub(this.center, position);
        return new Force(p5.Vector.mult(vector, magnitude));
    }
    draw() {
        noStroke();
        fill(80);
        const size = 20;
        ellipse((this.size.x - 0) / 2, (this.size.y - 0) / 2, size, size);
    }
}
/// Objects
class WorldObject {
    constructor(position) {
        this.position = position;
        this.velocity = createVector(0, 0);
        this.mass = 1;
    }
    collideWith(other) {
        // TODO: implement
        // ここで何かが起きるのは物理法則の何かを発動するということ
        return;
    }
    draw() {
        noStroke();
        fill(255, 0, 0);
        const radius = 1;
        const diameter = radius * 2;
        ellipse(this.position.x - radius, this.position.y - radius, diameter, diameter);
    }
}
WorldObject.collisionPriority = 0;
class Wall extends WorldObject {
    constructor(position, width, height) {
        super(position);
        this.position = position;
        this.width = width;
        this.height = height;
    }
    draw() {
        noStroke();
        fill(207, 196, 251);
        rect(this.position.x, this.position.y, this.width, this.height);
    }
}
Wall.collisionPriority = 1;
class DeadBody extends WorldObject {
    get velocity() {
        return createVector(0, 0);
    }
    draw() {
        super.draw(); // TODO: implement
    }
}
DeadBody.collisionPriority = 101;
/// Lives
class Life extends WorldObject {
    constructor(position) {
        super(position);
        this.position = position;
        this.mass = 3;
    }
    next() {
        const max = 3;
        const vx = random(-max, max);
        const vy = random(-max, max);
        // return new Force(createVector(vx, vy))
        return Force.zero();
    }
    draw() {
        noFill();
        stroke(86, 51, 245);
        this.drawCircles(5, this.position.x, this.position.y, 20);
    }
    drawCircles(numberOfCircles, x, y, diameter) {
        if (numberOfCircles <= 0) {
            return;
        }
        circle(x, y, diameter);
        this.drawCircles(numberOfCircles - 1, x - this.velocity.x * 2.5, y - this.velocity.y * 2.5, diameter * 0.6);
    }
}
Life.collisionPriority = 100;
/// Other
class Force {
    constructor(magnitude) {
        this.magnitude = magnitude;
    }
    static zero() {
        return new Force(createVector(0, 0));
    }
    accelerationTo(mass) {
        return this.magnitude.div(mass);
    }
    add(other) {
        const vector = p5.Vector.add(this.magnitude, other.magnitude);
        return new Force(vector);
    }
}
/// Utility
//# sourceMappingURL=main.js.map