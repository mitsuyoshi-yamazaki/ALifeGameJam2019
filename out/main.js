let world;
function setup() {
    world = new VanillaWorld(200, 200);
}
function draw() {
    world.next();
    world.draw();
}
class VanillaWorld {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this._t = 0;
    }
    get t() {
        return this._t;
    }
    next() {
        this._t += 1;
        // TODO: implement here
    }
    draw() {
        // TODO: implement here
        stroke(255, 0, 0);
        ellipse(50, 50, 80, 80);
    }
}
//# sourceMappingURL=main.js.map