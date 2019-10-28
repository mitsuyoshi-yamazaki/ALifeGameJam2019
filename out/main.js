let world;
function setup() {
    const worldSize = 200;
    world = new VanillaWorld(createVector(worldSize, worldSize));
    const objects = [
        [new SimpleLife(), createVector(50, 100)],
    ];
    world.addObjects(objects);
}
function draw() {
    world.next();
    world.draw();
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
        // TODO: implement here
    }
    draw() {
        background(220);
        noStroke();
        fill(0, 255, 0);
        const radius = 10;
        this._objects.forEach(obj => {
            ellipse(obj[1].x, obj[1].y, radius, radius);
        });
    }
}
class SimpleLife {
}
//# sourceMappingURL=main.js.map