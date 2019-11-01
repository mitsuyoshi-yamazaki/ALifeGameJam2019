let world;
function setup() {
    const size = 200;
    const worldSize = createVector(size, size);
    createCanvas(size, size);
    world = new VanillaWorld(worldSize, new VanillaTerrain(worldSize, size * 0.1));
    const lives = randomLives(80, size);
    world.addLives(lives);
}
function draw() {
    world.next();
    world.draw();
}
function randomLives(numberOfLives, positionSpace) {
    return [...new Array(numberOfLives).keys()].map(_ => {
        return new Life(createVector(random(positionSpace), random(positionSpace)));
    });
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
        return new Force(createVector(vx, vy));
    }
    draw() {
        super.draw(); // TODO: implement
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