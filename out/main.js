var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var world;
function setup() {
    var size = 800;
    var worldSize = createVector(size, size);
    createCanvas(size, size);
    var terrains = [
        new GravitationalTerrain(worldSize, p5.Vector.mult(worldSize, 0.33), 2),
        new GravitationalTerrain(worldSize, p5.Vector.mult(worldSize, 0.66), 2),
    ];
    world = new VanillaWorld(worldSize, terrains);
    var lives = randomLives(80, size, 1);
    world.addLives(lives);
}
function draw() {
    world.next();
    world.draw();
}
function randomLives(numberOfLives, positionSpace, velocity) {
    var lives = [];
    for (var i = 0; i < numberOfLives; i += 1) {
        lives.push(new Life(createVector(random(positionSpace), random(positionSpace))));
    }
    if (velocity != undefined) {
        lives.forEach(function (life) {
            life.velocity = createVector(random(-velocity, velocity), random(-velocity, velocity));
        });
    }
    return lives;
}
var VanillaWorld = /** @class */ (function () {
    function VanillaWorld(size, terrains) {
        this._t = 0;
        this._objects = [];
        this._lives = [];
        this._size = size;
        this._terrains = terrains;
    }
    Object.defineProperty(VanillaWorld.prototype, "size", {
        get: function () {
            return this._size;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VanillaWorld.prototype, "t", {
        get: function () {
            return this._t;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VanillaWorld.prototype, "terrains", {
        get: function () {
            return this._terrains;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VanillaWorld.prototype, "objects", {
        get: function () {
            return this._objects;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VanillaWorld.prototype, "lives", {
        get: function () {
            return this._lives;
        },
        enumerable: true,
        configurable: true
    });
    VanillaWorld.prototype.addObjects = function (objects) {
        this._objects = this._objects.concat(objects);
    };
    VanillaWorld.prototype.addLives = function (lives) {
        this._lives = this._lives.concat(lives);
    };
    VanillaWorld.prototype.next = function () {
        var _this = this;
        this._t += 1;
        this._lives.forEach(function (life) {
            var forces = _this.terrains.map(function (terrain) {
                return terrain.forceAt(life.position);
            });
            var fieldForce = forces.reduce(function (result, value) {
                return result.add(value);
            }, Force.zero());
            var force = life.next()
                .add(fieldForce);
            var frictions = _this.terrains.map(function (terrain) {
                return terrain.frictionAt(life.position);
            });
            var friction = frictions.reduce(function (sum, value) {
                return sum + value;
            }, 1) / (frictions.length + 1);
            var acceleration = force.accelerationTo(life.mass);
            var nextPosition = p5.Vector.add(life.position, life.velocity);
            var x = Math.max(Math.min(nextPosition.x, _this.size.x), 0);
            var y = Math.max(Math.min(nextPosition.y, _this.size.y), 0);
            life.position = createVector(x, y);
            life.velocity = p5.Vector.add(p5.Vector.mult(life.velocity, friction), acceleration);
        });
    };
    VanillaWorld.prototype.draw = function () {
        background(220);
        this.terrains.forEach(function (terrain) {
            terrain.draw();
        });
        this._objects.forEach(function (obj) {
            obj.draw();
        });
        this._lives.forEach(function (life) {
            life.draw();
        });
    };
    return VanillaWorld;
}());
// その場所に存在する力やプロパティを格納する
var Terrain = /** @class */ (function () {
    function Terrain(size) {
        this.size = size;
    }
    Terrain.prototype.frictionAt = function (position) {
        return 1; // 0(停止) ~ 1(摩擦なし)
    };
    Terrain.prototype.forceAt = function (position) {
        return Force.zero();
    };
    Terrain.prototype.draw = function () {
        return;
    };
    return Terrain;
}());
var VanillaTerrain = /** @class */ (function (_super) {
    __extends(VanillaTerrain, _super);
    function VanillaTerrain(size, immobilizedWidth) {
        var _this = _super.call(this, size) || this;
        _this.size = size;
        _this.immobilizedWidth = immobilizedWidth;
        return _this;
    }
    VanillaTerrain.prototype.frictionAt = function (position) {
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
    };
    VanillaTerrain.prototype.forceAt = function (position) {
        return Force.zero();
    };
    VanillaTerrain.prototype.draw = function () {
        stroke(207, 196, 251);
        strokeWeight(this.immobilizedWidth);
        noFill();
        rect(0, 0, this.size.x, this.size.y);
    };
    return VanillaTerrain;
}(Terrain));
var GravitationalTerrain = /** @class */ (function (_super) {
    __extends(GravitationalTerrain, _super);
    function GravitationalTerrain(size, center, gravity) {
        var _this = _super.call(this, size) || this;
        _this.size = size;
        _this.center = center;
        _this.gravity = gravity;
        return _this;
    }
    GravitationalTerrain.prototype.frictionAt = function (position) {
        // // 大気圏
        // const distance = Math.max(this.center.dist(position), 0.1)
        // if (distance > 10) {
        //   return 1
        // }
        // return (distance / 10)
        return 1;
    };
    GravitationalTerrain.prototype.forceAt = function (position) {
        var distance = Math.max(this.center.dist(position), 0.1); // ブラックホールは法律で禁止されている
        var magnitude = (1 / (distance * distance)) * this.gravity;
        var vector = p5.Vector.sub(this.center, position);
        return new Force(p5.Vector.mult(vector, magnitude));
    };
    GravitationalTerrain.prototype.draw = function () {
        noStroke();
        fill(80);
        var size = 20;
        ellipse(this.center.x, this.center.y, size, size);
    };
    return GravitationalTerrain;
}(Terrain));
/// Objects
var WorldObject = /** @class */ (function () {
    function WorldObject(position) {
        this.position = position;
        this.velocity = createVector(0, 0);
        this.mass = 1;
    }
    WorldObject.prototype.collideWith = function (other) {
        // TODO: implement
        // ここで何かが起きるのは物理法則の何かを発動するということ
        return;
    };
    WorldObject.prototype.draw = function () {
        noStroke();
        fill(255, 0, 0);
        var radius = 1;
        var diameter = radius * 2;
        ellipse(this.position.x - radius, this.position.y - radius, diameter, diameter);
    };
    WorldObject.collisionPriority = 0;
    return WorldObject;
}());
var Wall = /** @class */ (function (_super) {
    __extends(Wall, _super);
    function Wall(position, width, height) {
        var _this = _super.call(this, position) || this;
        _this.position = position;
        _this.width = width;
        _this.height = height;
        return _this;
    }
    Wall.prototype.draw = function () {
        noStroke();
        fill(207, 196, 251);
        rect(this.position.x, this.position.y, this.width, this.height);
    };
    Wall.collisionPriority = 1;
    return Wall;
}(WorldObject));
var DeadBody = /** @class */ (function (_super) {
    __extends(DeadBody, _super);
    function DeadBody() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(DeadBody.prototype, "velocity", {
        get: function () {
            return createVector(0, 0);
        },
        enumerable: true,
        configurable: true
    });
    DeadBody.prototype.draw = function () {
        _super.prototype.draw.call(this); // TODO: implement
    };
    DeadBody.collisionPriority = 101;
    return DeadBody;
}(WorldObject));
/// Lives
var Life = /** @class */ (function (_super) {
    __extends(Life, _super);
    function Life(position) {
        var _this = _super.call(this, position) || this;
        _this.position = position;
        _this.mass = 3;
        return _this;
    }
    Life.prototype.next = function () {
        var max = 3;
        var vx = random(-max, max);
        var vy = random(-max, max);
        // return new Force(createVector(vx, vy))
        return Force.zero();
    };
    Life.prototype.draw = function () {
        noFill();
        stroke(86, 51, 245);
        this.drawCircles(6, this.position.x, this.position.y, 20);
    };
    Life.prototype.drawCircles = function (numberOfCircles, x, y, diameter) {
        if (numberOfCircles <= 0) {
            return;
        }
        circle(x, y, diameter);
        this.drawCircles(numberOfCircles - 1, x - this.velocity.x * 2.5, y - this.velocity.y * 2.5, diameter * 0.6);
    };
    Life.collisionPriority = 100;
    return Life;
}(WorldObject));
/// Other
var Force = /** @class */ (function () {
    function Force(magnitude) {
        this.magnitude = magnitude;
    }
    Force.zero = function () {
        return new Force(createVector(0, 0));
    };
    Force.prototype.accelerationTo = function (mass) {
        return this.magnitude.div(mass);
    };
    Force.prototype.add = function (other) {
        var vector = p5.Vector.add(this.magnitude, other.magnitude);
        return new Force(vector);
    };
    return Force;
}());
/// Utility
//# sourceMappingURL=main.js.map