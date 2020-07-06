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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/entry_points/evo_devo.ts");
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
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Vector\", function() { return Vector; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Force\", function() { return Force; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"calculateOrbitalSpeed\", function() { return calculateOrbitalSpeed; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"calculateOrbitalVelocity\", function() { return calculateOrbitalVelocity; });\n/* harmony import */ var _utilities__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utilities */ \"./src/utilities.ts\");\n\nvar Vector = /** @class */ (function () {\n    function Vector(x, y) {\n        this.x = x;\n        this.y = y;\n    }\n    Object.defineProperty(Vector.prototype, \"transposed\", {\n        get: function () {\n            return new Vector(this.y, this.x);\n        },\n        enumerable: true,\n        configurable: true\n    });\n    Object.defineProperty(Vector.prototype, \"size\", {\n        get: function () {\n            return Math.sqrt(this.x * this.x + this.y * this.y);\n        },\n        enumerable: true,\n        configurable: true\n    });\n    Vector.zero = function () {\n        return new Vector(0, 0);\n    };\n    Vector.random = function (max, min) {\n        return new Vector(Object(_utilities__WEBPACK_IMPORTED_MODULE_0__[\"random\"])(max, min), Object(_utilities__WEBPACK_IMPORTED_MODULE_0__[\"random\"])(max, min));\n    };\n    Vector.prototype.toString = function () {\n        return \"(\" + this.x.toFixed(2) + \", \" + this.y.toFixed(2) + \")\";\n    };\n    Vector.prototype.add = function (other) {\n        return new Vector(this.x + other.x, this.y + other.y);\n    };\n    Vector.prototype.sub = function (other) {\n        return new Vector(this.x - other.x, this.y - other.y);\n    };\n    Vector.prototype.mult = function (n) {\n        return new Vector(this.x * n, this.y * n);\n    };\n    Vector.prototype.div = function (n) {\n        return new Vector(this.x / n, this.y / n);\n    };\n    Vector.prototype.dist = function (other) {\n        return Math.sqrt(Math.pow(this.x - other.x, 2) + Math.pow(this.y - other.y, 2));\n    };\n    Vector.prototype.sized = function (size) {\n        var mul = size / this.size;\n        return this.mult(mul);\n    };\n    Vector.prototype.rotated = function (radian) {\n        var x = this.x * Math.cos(radian) - this.y * Math.sin(radian);\n        var y = this.x * Math.sin(radian) + this.y * Math.cos(radian);\n        return new Vector(x, y);\n    };\n    Vector.prototype.randomized = function () {\n        return new Vector(Object(_utilities__WEBPACK_IMPORTED_MODULE_0__[\"random\"])(this.x), Object(_utilities__WEBPACK_IMPORTED_MODULE_0__[\"random\"])(this.y));\n    };\n    Vector.prototype.moved = function (radian, length) {\n        var x = this.x + Math.cos(radian) * length;\n        var y = this.y + Math.sin(radian) * length;\n        return new Vector(x, y);\n    };\n    return Vector;\n}());\n\nvar Force = /** @class */ (function () {\n    function Force(magnitude) {\n        this.magnitude = magnitude;\n    }\n    Force.zero = function () {\n        return new Force(new Vector(0, 0));\n    };\n    Force.prototype.accelerationTo = function (mass) {\n        return this.magnitude.div(mass);\n    };\n    Force.prototype.consumedEnergyWith = function (mass) {\n        return this.magnitude.size * mass;\n    };\n    Force.prototype.add = function (other) {\n        var vector = this.magnitude.add(other.magnitude);\n        return new Force(vector);\n    };\n    return Force;\n}());\n\nfunction calculateOrbitalSpeed(position, gravityCenter, gravity) {\n    var distance = position.dist(gravityCenter);\n    return Math.sqrt(gravity / distance);\n}\nfunction calculateOrbitalVelocity(position, gravityCenter, gravity) {\n    var orbitalSpeed = calculateOrbitalSpeed(position, gravityCenter, gravity);\n    var tangentVector = position.sub(gravityCenter)\n        .rotated(Math.PI / 2);\n    return tangentVector.sized(orbitalSpeed);\n}\n\n\n//# sourceURL=webpack:///./src/classes/physics.ts?");

/***/ }),

/***/ "./src/entry_points/evo_devo.ts":
/*!**************************************!*\
  !*** ./src/entry_points/evo_devo.ts ***!
  \**************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var p5__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! p5 */ \"./node_modules/p5/lib/p5.js\");\n/* harmony import */ var p5__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(p5__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _classes_physics__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../classes/physics */ \"./src/classes/physics.ts\");\n/* harmony import */ var _utilities__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utilities */ \"./src/utilities.ts\");\nvar __values = (undefined && undefined.__values) || function(o) {\n    var s = typeof Symbol === \"function\" && Symbol.iterator, m = s && o[s], i = 0;\n    if (m) return m.call(o);\n    if (o && typeof o.length === \"number\") return {\n        next: function () {\n            if (o && i >= o.length) o = void 0;\n            return { value: o && o[i++], done: !o };\n        }\n    };\n    throw new TypeError(s ? \"Object is not iterable.\" : \"Symbol.iterator is not defined.\");\n};\n\n\n\n/**\n * TODO:\n * \"Dynamic L-System\"\n * Cellular Automata の処理を実装する\n * 一定 depth を超えると停止するようにする\n * 適当なGAを実装する\n * LSystemのルール適用時にランダムで適当な状態になるようにしたら\"奇形\"ができる\n * http://0.0.0.0:8000/pages/evo_devo.html?debug=1&speed=100&limit=6&position=0.5,0.5&rules=A:-A++B,B:A&constants=+:20,-:-20\n */\nvar parameter = new _utilities__WEBPACK_IMPORTED_MODULE_2__[\"URLParameter\"]();\nvar DEBUG = parameter.boolean(\"debug\", false);\nvar size = parameter.int(\"size\", 1000);\nvar rawPosition = parameter.string(\"position\", \"0.5,0.5\");\nvar speed = parameter.int(\"speed\", 1000);\nvar unitLength = parameter.int(\"length\", 100);\nvar limit = parameter.int(\"limit\", 6);\nvar initialState = \"A\";\nvar rawRules = \"A:aAbB,B:A\";\nvar rawConstants = \"a:20,b:-40\";\nvar staticStates = [\"U\", \"V\", \"W\", \"X\", \"Y\", \"Z\"];\nvar canvasSize = new _classes_physics__WEBPACK_IMPORTED_MODULE_1__[\"Vector\"](size, size);\nvar node;\nvar t = 0;\nfunction log(message) {\n    if (DEBUG === false) {\n        return;\n    }\n    console.log(message);\n}\nvar main = function (p) {\n    p.setup = function () {\n        var canvas = p.createCanvas(canvasSize.x, canvasSize.y);\n        canvas.id(\"canvas\");\n        canvas.parent(\"canvas-parent\");\n        var system = new LSystem(parseRules(rawRules), parseConstants(rawConstants));\n        var position = parsePosition();\n        log(\"position: \" + String(position));\n        node = new Node(system, undefined, initialState, position, -90);\n    };\n    p.draw = function () {\n        if (t % speed === 0) {\n            log(\"t: \" + Math.floor(t / speed));\n            step();\n        }\n        p.background(0);\n        node.draw(p);\n        t += 1;\n        setTimestamp(t);\n        if (Math.floor(t / speed) === 15) {\n            log(\"POP!!\");\n            node.children[0].children[0].children.splice(0, 1);\n            node.children.splice(1, 1);\n        }\n    };\n};\nfunction parseRules(raw) {\n    var map = new Map();\n    if (raw == undefined) {\n        log(\"No rule specified\");\n        map.set(\"A\", \"-A++A\");\n        return map;\n    }\n    var rawRuleSet = raw.split(\",\");\n    rawRuleSet.forEach(function (line) {\n        var keyValue = line.split(\":\");\n        if (keyValue.length !== 2) {\n            log(\"[Warning] Parameter \\\"rules\\\" line \\\"\" + line + \"\\\" should be \\\"<character>:<string>\\\"\");\n            return;\n        }\n        map.set(keyValue[0], keyValue[1]);\n    });\n    return map;\n}\nfunction parseConstants(raw) {\n    var map = new Map();\n    if (raw == undefined) {\n        log(\"No constant specified\");\n        map.set(\"+\", 20);\n        map.set(\"-\", -20);\n        return map;\n    }\n    var rawRuleSet = raw.split(\",\");\n    rawRuleSet.forEach(function (line) {\n        var keyValue = line.split(\":\");\n        if (keyValue.length !== 2) {\n            log(\"[Warning] Parameter \\\"constants\\\" line \\\"\" + line + \"\\\" should be \\\"<character>:<number>\\\"\");\n            return;\n        }\n        var angle = parseInt(keyValue[1], 10);\n        if (angle === undefined) {\n            log(\"[Warning] Parameter \\\"constants\\\" line \\\"\" + line + \"\\\" should be \\\"<character>:<number>\\\"\");\n            return;\n        }\n        map.set(keyValue[0], angle);\n    });\n    return map;\n}\nfunction parsePosition() {\n    var defaultPosition = new _classes_physics__WEBPACK_IMPORTED_MODULE_1__[\"Vector\"](canvasSize.x * 0.5, canvasSize.y * 0.9);\n    if (rawPosition == undefined) {\n        return defaultPosition;\n    }\n    var components = rawPosition.split(\",\");\n    if (components.length !== 2) {\n        return defaultPosition;\n    }\n    var x = parseFloat(components[0]);\n    var y = parseFloat(components[1]);\n    log(\"raw position: \" + x + \", \" + y);\n    if (x == undefined || y == undefined) {\n        return defaultPosition;\n    }\n    return new _classes_physics__WEBPACK_IMPORTED_MODULE_1__[\"Vector\"](canvasSize.x * Math.min(Math.max(x, 0), 1), canvasSize.y * Math.min(Math.max(y, 0), 1));\n}\nfunction step() {\n    log(node.fullState());\n    node.step();\n}\nvar LSystem = /** @class */ (function () {\n    function LSystem(rules, constants) {\n        this.rules = rules;\n        this.constants = constants;\n    }\n    return LSystem;\n}());\nvar Node = /** @class */ (function () {\n    function Node(system, parent, state, position, direction) {\n        this.system = system;\n        this.parent = parent;\n        this.position = position;\n        this.children = [];\n        this.caStates = new Map();\n        this._age = 0;\n        this._currentState = state;\n        this._nextState = state;\n        this._direction = direction;\n        this._depth = this.history.length;\n    }\n    Object.defineProperty(Node.prototype, \"currentState\", {\n        get: function () {\n            return this._currentState;\n        },\n        enumerable: true,\n        configurable: true\n    });\n    Object.defineProperty(Node.prototype, \"nextState\", {\n        get: function () {\n            return this._nextState;\n        },\n        enumerable: true,\n        configurable: true\n    });\n    Object.defineProperty(Node.prototype, \"direction\", {\n        get: function () {\n            return this._direction;\n        },\n        enumerable: true,\n        configurable: true\n    });\n    Object.defineProperty(Node.prototype, \"history\", {\n        get: function () {\n            if (this.parent == undefined) {\n                return \"\";\n            }\n            return this.parent.history + this.currentState;\n        },\n        enumerable: true,\n        configurable: true\n    });\n    Object.defineProperty(Node.prototype, \"age\", {\n        get: function () {\n            return this._age;\n        },\n        enumerable: true,\n        configurable: true\n    });\n    Object.defineProperty(Node.prototype, \"depth\", {\n        get: function () {\n            return this._depth;\n        },\n        enumerable: true,\n        configurable: true\n    });\n    Object.defineProperty(Node.prototype, \"isLeaf\", {\n        get: function () {\n            return this.children.length === 0;\n        },\n        enumerable: true,\n        configurable: true\n    });\n    Node.prototype.fullState = function () {\n        var result = \"\";\n        this.children.forEach(function (child) {\n            result += child.fullState();\n        });\n        return this.currentState + result;\n    };\n    Node.prototype.step = function () {\n        this._age += 1;\n        this.stepLsystem();\n        // this.stepCellularAutomata()\n        this._currentState = this._nextState;\n    };\n    Node.prototype.draw = function (p) {\n        if (this.parent) {\n            var weight = Math.max(Math.min(this.age / 1, (10 - (this.depth + 1) + 2)), 1);\n            // log(`weight: ${weight}, age: ${this.age}`)\n            p.strokeWeight(weight);\n            p.noFill();\n            // tslint:disable-next-line: strict-boolean-expressions\n            var c = this.caStates.get(\"C\") || 0;\n            var color = 255 - ((100 / limit) * c);\n            p.stroke(color, 0xFF, color, 0xA0);\n            p.line(this.parent.position.x, this.parent.position.y, this.position.x, this.position.y);\n        }\n        this.children.forEach(function (childNode) {\n            childNode.draw(p);\n        });\n    };\n    Node.prototype.neighbourhood = function () {\n        var result = [].concat(this.children);\n        if (this.parent != undefined) {\n            result.push(this.parent);\n        }\n        return result;\n    };\n    Node.prototype.neighbourhoodStates = function () {\n        var result = new Map();\n        this.neighbourhood()\n            .forEach(function (neighbour) {\n            neighbour.caStates.forEach(function (value, state) {\n                // tslint:disable-next-line: strict-boolean-expressions\n                var currentValue = result.get(state) || 0;\n                if (currentValue > value) {\n                    if (currentValue <= 1) {\n                        result.delete(state);\n                    }\n                    else {\n                        result.set(state, currentValue - 1);\n                    }\n                }\n                else {\n                    if (value <= 1) {\n                        result.delete(state);\n                    }\n                    else {\n                        result.set(state, value - 1);\n                    }\n                }\n            });\n        });\n        return result;\n    };\n    Node.prototype.nearbyChildren = function (state, depth) {\n        var e_1, _a;\n        if (this.currentState === state) {\n            return true;\n        }\n        if (depth <= 0) {\n            return false;\n        }\n        try {\n            for (var _b = __values(this.children), _c = _b.next(); !_c.done; _c = _b.next()) {\n                var child = _c.value;\n                if (child.nearbyChildren(state, depth - 1) === true) {\n                    return true;\n                }\n            }\n        }\n        catch (e_1_1) { e_1 = { error: e_1_1 }; }\n        finally {\n            try {\n                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);\n            }\n            finally { if (e_1) throw e_1.error; }\n        }\n        return false;\n    };\n    Node.prototype.nearbyParent = function (state, depth, from) {\n        var e_2, _a;\n        if (this.currentState === state) {\n            return true;\n        }\n        if (depth <= 0) {\n            return false;\n        }\n        if ((this.parent != undefined) && (this.parent.nearbyParent(state, depth - 1, this) === true)) {\n            return true;\n        }\n        try {\n            for (var _b = __values(this.children), _c = _b.next(); !_c.done; _c = _b.next()) {\n                var child = _c.value;\n                if (child === from) {\n                    continue;\n                }\n                if (child.nearbyChildren(state, depth - 1) === true) {\n                    return true;\n                }\n            }\n        }\n        catch (e_2_1) { e_2 = { error: e_2_1 }; }\n        finally {\n            try {\n                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);\n            }\n            finally { if (e_2) throw e_2.error; }\n        }\n        return false;\n    };\n    Node.prototype.stepLsystem = function () {\n        var e_3, _a;\n        this.children.forEach(function (child) {\n            child.step();\n        });\n        if (this.depth > limit) {\n            return;\n        }\n        if (this.currentState === \"B\") {\n            if (this.parent != undefined) {\n                if (this.nearbyParent(\"A\", limit / 2, this) === true) {\n                    return;\n                }\n                if (this.nearbyParent(\"Y\", 4, this) === true) {\n                    return;\n                }\n            }\n        }\n        var nextCondition = this.system.rules.get(this.currentState);\n        if (nextCondition != undefined) {\n            // const length = (1 / (this.depth + 1)) * unitLength\n            var length_1 = unitLength - (this.depth * 2);\n            try {\n                for (var nextCondition_1 = __values(nextCondition), nextCondition_1_1 = nextCondition_1.next(); !nextCondition_1_1.done; nextCondition_1_1 = nextCondition_1.next()) {\n                    var c = nextCondition_1_1.value;\n                    var directionChange = this.system.constants.get(c);\n                    if (directionChange != undefined) {\n                        this._direction += directionChange;\n                        continue;\n                    }\n                    var radian = this.direction * (Math.PI / 180);\n                    var nextPosition = this.position.moved(radian, length_1);\n                    this.children.push(new Node(this.system, this, c, nextPosition, this.direction));\n                }\n            }\n            catch (e_3_1) { e_3 = { error: e_3_1 }; }\n            finally {\n                try {\n                    if (nextCondition_1_1 && !nextCondition_1_1.done && (_a = nextCondition_1.return)) _a.call(nextCondition_1);\n                }\n                finally { if (e_3) throw e_3.error; }\n            }\n        }\n        if (this.currentState === \"A\") {\n            this._nextState = \"X\";\n        }\n        else if (this.currentState === \"B\") {\n            this._nextState = \"Y\";\n        }\n    };\n    Node.prototype.stepCellularAutomata = function () {\n        if (this.currentState === \"C\") {\n            this._nextState = \"A\";\n            this.caStates.set(\"C\", limit);\n            return;\n        }\n        var neighbourhoodStates = this.neighbourhoodStates();\n        // tslint:disable-next-line: strict-boolean-expressions\n        var cValue = (neighbourhoodStates.get(\"C\") || 0);\n        if (cValue <= 0) {\n            this._nextState = \"C\";\n            return;\n        }\n        else {\n            this.caStates.set(\"C\", cValue - 1);\n        }\n        // const neighbourhoodStates = this.neighbourhoodStates()\n        // // tslint:disable-next-line: strict-boolean-expressions\n        // if ((neighbourhoodStates.get(\"Z\") || 0) <= 1) {\n        //   const historyStates = new Map<string, number>()\n        //   for (const c of this.history) {\n        //     const n = historyStates.get(c) | 0\n        //     historyStates.set(c, n + 1)\n        //   }\n        //   log(`[$ { this.history }], $ { historyStates.get(\"Z\") } `)\n        //   // tslint:disable-next-line: strict-boolean-expressions\n        //   if ((historyStates.get(\"Z\") || 0) > 2) {\n        //     return\n        //   }\n        //   if (this.state === \"X\") {\n        //     this._state = \"A\"\n        //     return\n        //   }\n        //   if (this.state === \"Y\") {\n        //     this._state = \"B\"\n        //     return\n        //   }\n        // }\n    };\n    return Node;\n}());\nvar sketch = new p5__WEBPACK_IMPORTED_MODULE_0__(main);\n\n\n//# sourceURL=webpack:///./src/entry_points/evo_devo.ts?");

/***/ }),

/***/ "./src/utilities.ts":
/*!**************************!*\
  !*** ./src/utilities.ts ***!
  \**************************/
/*! exports provided: random, Color, URLParameter */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"random\", function() { return random; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Color\", function() { return Color; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"URLParameter\", function() { return URLParameter; });\nvar __values = (undefined && undefined.__values) || function(o) {\n    var s = typeof Symbol === \"function\" && Symbol.iterator, m = s && o[s], i = 0;\n    if (m) return m.call(o);\n    if (o && typeof o.length === \"number\") return {\n        next: function () {\n            if (o && i >= o.length) o = void 0;\n            return { value: o && o[i++], done: !o };\n        }\n    };\n    throw new TypeError(s ? \"Object is not iterable.\" : \"Symbol.iterator is not defined.\");\n};\n// export function random(max: number): number\t// not working: raises \"Expected 1 arguments, but got 2.\"\nfunction random(max, min) {\n    if (min == undefined) {\n        return Math.random() * max;\n    }\n    var range = max - min;\n    return Math.random() * range + min;\n}\nvar Color = /** @class */ (function () {\n    function Color(r, g, b) {\n        this.r = r;\n        this.g = g;\n        this.b = b;\n    }\n    Color.prototype.p5 = function (p) {\n        return p.color(this.r, this.g, this.b);\n    };\n    return Color;\n}());\n\nvar URLParameter = /** @class */ (function () {\n    function URLParameter() {\n        var e_1, _a;\n        this.parameters = new Map();\n        var rawQuery = document.location.search;\n        var pairs = rawQuery\n            .slice(rawQuery.indexOf(\"?\") + 1)\n            .split(\"&\");\n        // tslint:disable-next-line:no-any\n        var rawParameters = {};\n        try {\n            for (var pairs_1 = __values(pairs), pairs_1_1 = pairs_1.next(); !pairs_1_1.done; pairs_1_1 = pairs_1.next()) {\n                var query = pairs_1_1.value;\n                var pair = query.split(\"=\");\n                rawParameters[pair[0]] = pair[1];\n                this.parameters.set(pair[0], pair[1]);\n            }\n        }\n        catch (e_1_1) { e_1 = { error: e_1_1 }; }\n        finally {\n            try {\n                if (pairs_1_1 && !pairs_1_1.done && (_a = pairs_1.return)) _a.call(pairs_1);\n            }\n            finally { if (e_1) throw e_1.error; }\n        }\n        console.log(rawParameters);\n    }\n    URLParameter.prototype.int = function (key, defaultValue) {\n        var rawValue = this.parameters.get(key);\n        if (rawValue == undefined) {\n            return defaultValue;\n        }\n        var parsedValue = parseInt(rawValue, 10);\n        if (isNaN(parsedValue)) {\n            return defaultValue;\n        }\n        return parsedValue;\n    };\n    URLParameter.prototype.float = function (key, defaultValue) {\n        var rawValue = this.parameters.get(key);\n        if (rawValue == undefined) {\n            return defaultValue;\n        }\n        var parsedValue = parseFloat(rawValue);\n        if (isNaN(parsedValue)) {\n            return defaultValue;\n        }\n        return parsedValue;\n    };\n    URLParameter.prototype.boolean = function (key, defaultValue) {\n        var rawValue = this.parameters.get(key);\n        if (rawValue == undefined) {\n            return defaultValue;\n        }\n        var parsedValue = parseInt(rawValue, 10);\n        if (isNaN(parsedValue)) {\n            return defaultValue;\n        }\n        return parsedValue > 0;\n    };\n    URLParameter.prototype.string = function (key, defaultValue) {\n        var rawValue = this.parameters.get(key);\n        if (rawValue == undefined) {\n            return defaultValue;\n        }\n        return rawValue;\n    };\n    return URLParameter;\n}());\n\n\n\n//# sourceURL=webpack:///./src/utilities.ts?");

/***/ })

/******/ });