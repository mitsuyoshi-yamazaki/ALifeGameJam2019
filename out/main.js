let drawer;
let world;
function setup() {
    drawer = new P5Drawer();
    const worldSize = 200;
    createCanvas(worldSize, worldSize);
    world = new VanillaWorld(createVector(worldSize, worldSize));
    const objects = [
        new ObjectWrapper(new SimpleLife(), createVector(50, 50), createVector(0, 0)),
    ];
    world.addObjects(objects);
}
function draw() {
    world.next();
    drawer.draw(world.objects);
}
class VanillaWorld {
    constructor(size) {
        this._t = 0;
        this._objects = [];
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
    addObjects(objects) {
        this._objects = this._objects.concat(objects);
    }
    next() {
        this._t += 1;
        this._objects.forEach(wrapper => {
            this.nextObject(wrapper);
        });
    }
    nextObject(wrapper) {
        const force = wrapper.obj.next();
        if (force == undefined) {
            // Console.log(`no force`)
            return;
        }
        const mass = 1;
        const friction = 0.5;
        const acceleration = force.accelerationTo(mass);
        // wrapper.position = force.magnitude// P5.Vector.add(wrapper.position, acceleration)
        wrapper.position = p5.Vector.add(wrapper.position, wrapper.velocity);
        wrapper.velocity = p5.Vector.add(p5.Vector.mult(wrapper.velocity, friction), acceleration);
    }
}
class ObjectWrapper {
    constructor(obj, position, velocity) {
        this.obj = obj;
        this.position = position;
        this.velocity = velocity;
    }
}
class SimpleObject {
    next() {
        return;
    }
}
class SimpleLife {
    next() {
        const max = 3;
        const vx = random(-max, max);
        const vy = random(-max, max);
        return new Force(vx, vy);
    }
}
/// Other
class Force {
    constructor(vx, vy) {
        this.magnitude = createVector(vx, vy);
    }
    accelerationTo(mass) {
        return this.magnitude.div(mass);
    }
}
class P5Drawer {
    draw(objects) {
        background(220);
        noStroke();
        fill(255, 0, 0);
        const radius = 10;
        objects.forEach(wrapper => {
            // Console.log(`hoge ${String(wrapper.position)}`)
            ellipse(wrapper.position.x, wrapper.position.y, radius, radius);
        });
    }
}
//# sourceMappingURL=main.js.map