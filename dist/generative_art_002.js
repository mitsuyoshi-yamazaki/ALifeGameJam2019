/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/entry_points/generative_art_002.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/p5/lib/p5.js":
/*!***********************************!*\
  !*** ./node_modules/p5/lib/p5.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {


/***/ }),

/***/ "./node_modules/webpack/buildin/global.js":
/*!***********************************!*\
  !*** (webpack)/buildin/global.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("var g;\n\n// This works in non-strict mode\ng = (function() {\n\treturn this;\n})();\n\ntry {\n\t// This works if eval is allowed (see CSP)\n\tg = g || new Function(\"return this\")();\n} catch (e) {\n\t// This works if the window reference is available\n\tif (typeof window === \"object\") g = window;\n}\n\n// g can still be undefined, but nothing to do about it...\n// We return undefined, instead of nothing here, so it's\n// easier to handle this case. if(!global) { ...}\n\nmodule.exports = g;\n\n\n//# sourceURL=webpack:///(webpack)/buildin/global.js?");

/***/ }),

/***/ "./src/classes/physics.ts":
/*!********************************!*\
  !*** ./src/classes/physics.ts ***!
  \********************************/
/*! exports provided: Vector, Force, calculateOrbitalSpeed, calculateOrbitalVelocity */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Vector\", function() { return Vector; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Force\", function() { return Force; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"calculateOrbitalSpeed\", function() { return calculateOrbitalSpeed; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"calculateOrbitalVelocity\", function() { return calculateOrbitalVelocity; });\n/* harmony import */ var _utilities__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utilities */ \"./src/utilities.ts\");\n\nvar Vector = /** @class */ (function () {\n    function Vector(x, y) {\n        this.x = x;\n        this.y = y;\n    }\n    Object.defineProperty(Vector.prototype, \"transposed\", {\n        get: function () {\n            return new Vector(this.y, this.x);\n        },\n        enumerable: true,\n        configurable: true\n    });\n    Object.defineProperty(Vector.prototype, \"size\", {\n        get: function () {\n            return Math.sqrt(this.x * this.x + this.y * this.y);\n        },\n        enumerable: true,\n        configurable: true\n    });\n    Vector.zero = function () {\n        return new Vector(0, 0);\n    };\n    Vector.random = function (max, min) {\n        return new Vector(Object(_utilities__WEBPACK_IMPORTED_MODULE_0__[\"random\"])(max, min), Object(_utilities__WEBPACK_IMPORTED_MODULE_0__[\"random\"])(max, min));\n    };\n    Vector.prototype.toString = function () {\n        return \"(\" + this.x.toFixed(2) + \", \" + this.y.toFixed(2) + \")\";\n    };\n    Vector.prototype.add = function (other) {\n        return new Vector(this.x + other.x, this.y + other.y);\n    };\n    Vector.prototype.sub = function (other) {\n        return new Vector(this.x - other.x, this.y - other.y);\n    };\n    Vector.prototype.mult = function (n) {\n        return new Vector(this.x * n, this.y * n);\n    };\n    Vector.prototype.div = function (n) {\n        return new Vector(this.x / n, this.y / n);\n    };\n    Vector.prototype.dist = function (other) {\n        return Math.sqrt(Math.pow(this.x - other.x, 2) + Math.pow(this.y - other.y, 2));\n    };\n    Vector.prototype.sized = function (size) {\n        var mul = size / this.size;\n        return this.mult(mul);\n    };\n    Vector.prototype.rotated = function (radian) {\n        var x = this.x * Math.cos(radian) - this.y * Math.sin(radian);\n        var y = this.x * Math.sin(radian) + this.y * Math.cos(radian);\n        return new Vector(x, y);\n    };\n    Vector.prototype.randomized = function () {\n        return new Vector(Object(_utilities__WEBPACK_IMPORTED_MODULE_0__[\"random\"])(this.x), Object(_utilities__WEBPACK_IMPORTED_MODULE_0__[\"random\"])(this.y));\n    };\n    return Vector;\n}());\n\nvar Force = /** @class */ (function () {\n    function Force(magnitude) {\n        this.magnitude = magnitude;\n    }\n    Force.zero = function () {\n        return new Force(new Vector(0, 0));\n    };\n    Force.prototype.accelerationTo = function (mass) {\n        return this.magnitude.div(mass);\n    };\n    Force.prototype.consumedEnergyWith = function (mass) {\n        return this.magnitude.size * mass;\n    };\n    Force.prototype.add = function (other) {\n        var vector = this.magnitude.add(other.magnitude);\n        return new Force(vector);\n    };\n    return Force;\n}());\n\nfunction calculateOrbitalSpeed(position, gravityCenter, gravity) {\n    var distance = position.dist(gravityCenter);\n    return Math.sqrt(gravity / distance);\n}\nfunction calculateOrbitalVelocity(position, gravityCenter, gravity) {\n    var orbitalSpeed = calculateOrbitalSpeed(position, gravityCenter, gravity);\n    var tangentVector = position.sub(gravityCenter)\n        .rotated(Math.PI / 2);\n    return tangentVector.sized(orbitalSpeed);\n}\n\n\n//# sourceURL=webpack:///./src/classes/physics.ts?");

/***/ }),

/***/ "./src/entry_points/generative_art_002.ts":
/*!************************************************!*\
  !*** ./src/entry_points/generative_art_002.ts ***!
  \************************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var p5__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! p5 */ \"./node_modules/p5/lib/p5.js\");\n/* harmony import */ var p5__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(p5__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _classes_physics__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../classes/physics */ \"./src/classes/physics.ts\");\n/* harmony import */ var _utilities__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utilities */ \"./src/utilities.ts\");\nvar __values = (undefined && undefined.__values) || function(o) {\n    var s = typeof Symbol === \"function\" && Symbol.iterator, m = s && o[s], i = 0;\n    if (m) return m.call(o);\n    if (o && typeof o.length === \"number\") return {\n        next: function () {\n            if (o && i >= o.length) o = void 0;\n            return { value: o && o[i++], done: !o };\n        }\n    };\n    throw new TypeError(s ? \"Object is not iterable.\" : \"Symbol.iterator is not defined.\");\n};\nvar e_1, _a;\n\n\n\n/*\n* https://vimeo.com/22955812\n*\n* F1: Circle\n* F2: Line  // Not implemented\n*\n* B1: Move in a straight line\n* B2: Constrain to surface\n* B3: Change direction while touching another Element\n* B4: Move away from an overlapping Element\n* B5: Enter from the opposite edge after moving off the surface\n* B6: Orient toward the direction of an Element that is touching  // Not implemented\n* B7: Deviate from the current direction                          // Not implemented\n*\n* E1: F1 + B1 + B2 + B3 + B4\n* E2: F1 + B1 + B5\n* E3: F2 + B1 + B3 + B5\n* E4: F1 + B1 + B2 + B3\n* E5: F2 + B1 + B5 + B6 + B7\n*/\nvar DrawMode;\n(function (DrawMode) {\n    DrawMode[\"Backend\"] = \"backend\";\n    DrawMode[\"Artistic\"] = \"artistic\";\n})(DrawMode || (DrawMode = {}));\nvar Form;\n(function (Form) {\n    Form[Form[\"F1\"] = 0] = \"F1\";\n    Form[Form[\"F2\"] = 1] = \"F2\";\n})(Form || (Form = {}));\nvar Behavior;\n(function (Behavior) {\n    Behavior[Behavior[\"B1\"] = 0] = \"B1\";\n    Behavior[Behavior[\"B2\"] = 1] = \"B2\";\n    Behavior[Behavior[\"B3\"] = 2] = \"B3\";\n    Behavior[Behavior[\"B4\"] = 3] = \"B4\";\n    Behavior[Behavior[\"B5\"] = 4] = \"B5\";\n    Behavior[Behavior[\"B6\"] = 5] = \"B6\";\n    Behavior[Behavior[\"B7\"] = 6] = \"B7\";\n})(Behavior || (Behavior = {}));\nvar Element = /** @class */ (function () {\n    function Element(form, behavior) {\n        this.form = form;\n        this.behavior = behavior;\n    }\n    Object.defineProperty(Element.prototype, \"B1\", {\n        get: function () {\n            return this.behavior.indexOf(Behavior.B1) >= 0;\n        },\n        enumerable: true,\n        configurable: true\n    });\n    Object.defineProperty(Element.prototype, \"B2\", {\n        get: function () {\n            return this.behavior.indexOf(Behavior.B2) >= 0;\n        },\n        enumerable: true,\n        configurable: true\n    });\n    Object.defineProperty(Element.prototype, \"B3\", {\n        get: function () {\n            return this.behavior.indexOf(Behavior.B3) >= 0;\n        },\n        enumerable: true,\n        configurable: true\n    });\n    Object.defineProperty(Element.prototype, \"B4\", {\n        get: function () {\n            return this.behavior.indexOf(Behavior.B4) >= 0;\n        },\n        enumerable: true,\n        configurable: true\n    });\n    Object.defineProperty(Element.prototype, \"B5\", {\n        get: function () {\n            return this.behavior.indexOf(Behavior.B5) >= 0;\n        },\n        enumerable: true,\n        configurable: true\n    });\n    Object.defineProperty(Element.prototype, \"B6\", {\n        get: function () {\n            return this.behavior.indexOf(Behavior.B6) >= 0;\n        },\n        enumerable: true,\n        configurable: true\n    });\n    Object.defineProperty(Element.prototype, \"B7\", {\n        get: function () {\n            return this.behavior.indexOf(Behavior.B7) >= 0;\n        },\n        enumerable: true,\n        configurable: true\n    });\n    return Element;\n}());\nvar rawQuery = document.location.search;\nvar queries = rawQuery\n    .slice(rawQuery.indexOf(\"?\") + 1)\n    .split(\"&\");\nvar parameters = {};\ntry {\n    for (var queries_1 = __values(queries), queries_1_1 = queries_1.next(); !queries_1_1.done; queries_1_1 = queries_1.next()) {\n        var query = queries_1_1.value;\n        var pair = query.split(\"=\");\n        parameters[pair[0]] = pair[1];\n    }\n}\ncatch (e_1_1) { e_1 = { error: e_1_1 }; }\nfinally {\n    try {\n        if (queries_1_1 && !queries_1_1.done && (_a = queries_1.return)) _a.call(queries_1);\n    }\n    finally { if (e_1) throw e_1.error; }\n}\nconsole.log(parameters);\n// tslint:disable: no-string-literal\nvar drawMode = parameters[\"draw_mode\"] ? parameters[\"draw_mode\"] : DrawMode.Artistic;\nvar numberOfObjects = parameters[\"objects\"] ? parameters[\"objects\"] : 50;\nvar behavior = (function () {\n    var given = parameters[\"behavior\"];\n    if (given == undefined) {\n        return [\n            Behavior.B1,\n            Behavior.B2,\n            Behavior.B3,\n            Behavior.B4,\n        ];\n    }\n    return given.split(\",\")\n        .map(function (e) {\n        return Behavior[e];\n    });\n})();\n// const interval = parameters[\"i\"] ? parameters[\"i\"] : 200\n// tslint:enable: no-string-literal\nvar element1 = new Element(Form.F1, behavior);\nvar element = element1;\nvar main = function (p) {\n    var t = 0;\n    var size = 800;\n    var canvasSize = new _classes_physics__WEBPACK_IMPORTED_MODULE_1__[\"Vector\"](size, size * 0.6);\n    var objects = [];\n    var objectMinSize = 60;\n    var objectMaxSize = objectMinSize * 2;\n    p.setup = function () {\n        p.createCanvas(canvasSize.x, canvasSize.y);\n        createObjects();\n        if (drawMode === DrawMode.Artistic) {\n            p.background(0);\n        }\n    };\n    p.draw = function () {\n        t += 1;\n        next();\n        draw(p);\n        // if (t % interval === 0) {\n        //   const objectSize = random(objectMaxSize * 3, objectMinSize * 3)\n        //   const position = canvasSize.randomized()\n        //   const direction = random(Math.PI * 2)\n        //   const obj = new Circle(objectSize, position, direction)\n        //   objects.push(obj)\n        //   console.log(\"add\")\n        // }\n    };\n    function createObjects() {\n        for (var i = 0; i < numberOfObjects; i += 1) {\n            var objectSize = Object(_utilities__WEBPACK_IMPORTED_MODULE_2__[\"random\"])(objectMaxSize, objectMinSize);\n            var position = canvasSize.randomized();\n            var direction = Object(_utilities__WEBPACK_IMPORTED_MODULE_2__[\"random\"])(Math.PI * 2);\n            var obj = new Circle(objectSize, position, direction);\n            objects.push(obj);\n        }\n    }\n    function next() {\n        objects.forEach(function (obj) {\n            obj.next();\n            if (element.B2) {\n                var radius = obj.size / 2;\n                var xMin = radius;\n                var xMax = canvasSize.x - radius;\n                var yMin = radius;\n                var yMax = canvasSize.y - radius;\n                var x = Math.max(Math.min(obj.position.x, xMax), xMin);\n                var y = Math.max(Math.min(obj.position.y, yMax), yMin);\n                obj.position = new _classes_physics__WEBPACK_IMPORTED_MODULE_1__[\"Vector\"](x, y);\n            }\n            else if (element.B5) {\n                var x = obj.position.x;\n                var y = obj.position.y;\n                if (x < 0) {\n                    x += canvasSize.x;\n                }\n                else if (x > canvasSize.x) {\n                    x -= canvasSize.x;\n                }\n                if (y < 0) {\n                    y += canvasSize.y;\n                }\n                else if (y > canvasSize.y) {\n                    y -= canvasSize.y;\n                }\n                obj.position = new _classes_physics__WEBPACK_IMPORTED_MODULE_1__[\"Vector\"](x, y);\n            }\n            //\n            obj.isColliding = false;\n            obj.forces = [];\n        });\n        for (var i = 0; i < objects.length; i += 1) {\n            var obj = objects[i];\n            for (var j = i + 1; j < objects.length; j += 1) {\n                var other = objects[j];\n                var distance = obj.position.dist(other.position);\n                var minDistance = (obj.size + other.size) / 2;\n                var isColliding = distance < minDistance;\n                if (isColliding) {\n                    obj.isColliding = true;\n                    other.isColliding = true;\n                    var normalizedDistance = ((minDistance - distance) / minDistance);\n                    var forceMagnitude = normalizedDistance * 10;\n                    obj.forces.push(obj.position.sub(other.position).sized(forceMagnitude));\n                    other.forces.push(other.position.sub(obj.position).sized(forceMagnitude));\n                    if (drawMode === DrawMode.Artistic) {\n                        p.noFill();\n                        p.stroke(255 * normalizedDistance, 128);\n                        p.strokeWeight(0.5);\n                        p.line(obj.position.x, obj.position.y, other.position.x, other.position.y);\n                    }\n                }\n            }\n            if (element.B3 && obj.isColliding) {\n                obj.direction += Math.PI / 300;\n            }\n        }\n    }\n    function draw(p) {\n        if (drawMode === DrawMode.Backend) {\n            p.background(0);\n            objects.forEach(function (obj) {\n                obj.draw(p);\n            });\n        }\n    }\n};\nvar Circle = /** @class */ (function () {\n    function Circle(size, position, direction) {\n        this.size = size;\n        this.isColliding = false;\n        this.forces = [];\n        this.speed = 1;\n        this.position = position;\n        this.direction = direction;\n    }\n    Circle.prototype.next = function () {\n        var directionalMove = new _classes_physics__WEBPACK_IMPORTED_MODULE_1__[\"Vector\"](Math.cos(this.direction), Math.sin(this.direction)).sized(this.speed);\n        var separationForces = element.B4 ? this.forces : [];\n        var affectedForces = element.B1 ? separationForces.concat(directionalMove) : separationForces;\n        var sumForces = function (result, value) {\n            return result.add(value);\n        };\n        var move = affectedForces.reduce(sumForces, _classes_physics__WEBPACK_IMPORTED_MODULE_1__[\"Vector\"].zero());\n        this.position = this.position.add(move);\n    };\n    Circle.prototype.draw = function (p) {\n        p.noFill();\n        p.stroke(255);\n        p.strokeWeight(1);\n        p.circle(this.position.x, this.position.y, this.size);\n        this.drawDirectionArrow(p);\n        this.drawSeparationArrows(p);\n        if (this.isColliding) {\n            this.drawChangingDirectionArrow(p);\n        }\n    };\n    Circle.prototype.drawDirectionArrow = function (p) {\n        if (!element.B1) {\n            return;\n        }\n        var radius = this.size / 2;\n        var head = (new _classes_physics__WEBPACK_IMPORTED_MODULE_1__[\"Vector\"](Math.cos(this.direction), Math.sin(this.direction)))\n            .sized(radius)\n            .add(this.position);\n        drawArrow(p, this.position, head);\n    };\n    Circle.prototype.drawChangingDirectionArrow = function (p) {\n        if (!element.B3) {\n            return;\n        }\n        var fromRadian = this.direction + Math.PI / 2;\n        var toRadian = this.direction - Math.PI;\n        var arcDiameter = this.size / 2;\n        drawArcArrow(p, this.position, arcDiameter, fromRadian, toRadian);\n    };\n    Circle.prototype.drawSeparationArrows = function (p) {\n        var _this = this;\n        if (!element.B4) {\n            return;\n        }\n        var arrowSize = this.size / 8;\n        this.forces.forEach(function (force) {\n            var head = force\n                .sized(arrowSize)\n                .add(_this.position);\n            drawArrow(p, _this.position, head);\n        });\n    };\n    return Circle;\n}());\nfunction drawArrow(p, from, to) {\n    p.noFill();\n    p.stroke(255);\n    p.strokeWeight(1);\n    p.line(from.x, from.y, to.x, to.y);\n    // TODO:\n}\nfunction drawArcArrow(p, center, radius, fromRadian, toRadian) {\n    p.noFill();\n    p.stroke(255);\n    p.strokeWeight(1);\n    p.arc(center.x, center.y, radius, radius, fromRadian, toRadian);\n    // TODO:\n}\nvar sketch = new p5__WEBPACK_IMPORTED_MODULE_0__(main);\n\n\n//# sourceURL=webpack:///./src/entry_points/generative_art_002.ts?");

/***/ }),

/***/ "./src/utilities.ts":
/*!**************************!*\
  !*** ./src/utilities.ts ***!
  \**************************/
/*! exports provided: random, Color */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"random\", function() { return random; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Color\", function() { return Color; });\n// export function random(max: number): number\t// not working: raises \"Expected 1 arguments, but got 2.\"\nfunction random(max, min) {\n    if (min == undefined) {\n        return Math.random() * max;\n    }\n    var range = max - min;\n    return Math.random() * range + min;\n}\nvar Color = /** @class */ (function () {\n    function Color(r, g, b) {\n        this.r = r;\n        this.g = g;\n        this.b = b;\n    }\n    Color.prototype.p5 = function (p) {\n        return p.color(this.r, this.g, this.b);\n    };\n    return Color;\n}());\n\n\n\n//# sourceURL=webpack:///./src/utilities.ts?");

/***/ })

/******/ });