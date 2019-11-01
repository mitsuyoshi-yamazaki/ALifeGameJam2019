let world;
function setup() {
    const worldSize = 200;
    createCanvas(worldSize, worldSize);
    world = new VanillaWorld(createVector(worldSize, worldSize));
    const walls = wallsAround(worldSize, worldSize, worldSize * 0.02);
    world.addObjects(walls);
    const lives = [
        new Life(createVector(random(worldSize), random(worldSize))),
    ];
    world.addLives(lives);
}
function draw() {
    world.next();
    world.draw();
}
function wallsAround(width, height, wallWidth) {
    return [
        new Wall(createVector(0, 0), width, wallWidth),
        new Wall(createVector(width - wallWidth, wallWidth), wallWidth, height - wallWidth * 2),
        new Wall(createVector(0, height - wallWidth), width, wallWidth),
        new Wall(createVector(0, wallWidth), wallWidth, height - wallWidth * 2),
    ];
}
class VanillaWorld {
    constructor(size) {
        this._t = 0;
        this._objects = [];
        this._lives = [];
        this._size = size;
    }
    get size() {
        return this._size;
    }
    get t() {
        return this._t;
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
            life.next();
        });
    }
    draw() {
        background(220);
        this._objects.forEach(obj => {
            obj.draw();
        });
        this._lives.forEach(life => {
            life.draw();
        });
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
        fill(255, 0, 0);
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
        const force = new Force(vx, vy);
        const friction = 0.5;
        const acceleration = force.accelerationTo(this.mass);
        this.position = p5.Vector.add(this.position, this.velocity);
        this.velocity = p5.Vector.add(p5.Vector.mult(this.velocity, friction), acceleration);
    }
    draw() {
        super.draw(); // TODO: implement
    }
}
Life.collisionPriority = 100;
/// Other
class Force {
    constructor(vx, vy) {
        this.magnitude = createVector(vx, vy);
    }
    accelerationTo(mass) {
        return this.magnitude.div(mass);
    }
}
/// Utility
//# sourceMappingURL=main.js.map