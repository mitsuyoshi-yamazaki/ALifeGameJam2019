let drawer;
let world;
function setup() {
    drawer = new P5Drawer();
    const worldSize = 200;
    createCanvas(worldSize, worldSize);
    world = new VanillaWorld(createVector(worldSize, worldSize));
    const objects = [
        [new SimpleObject(), createVector(50, 50)],
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
        // TODO: implement here
    }
}
class SimpleObject {
    next() {
        return;
    }
}
class P5Drawer {
    draw(objects) {
        background(220);
        noStroke();
        fill(255, 0, 0);
        const radius = 10;
        objects.forEach(value => {
            const position = value[1];
            ellipse(position.x, position.y, radius, radius);
        });
    }
}
//# sourceMappingURL=main.js.map