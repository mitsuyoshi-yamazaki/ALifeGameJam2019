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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/entry_points/open_ended_game.ts");
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
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Vector\", function() { return Vector; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Force\", function() { return Force; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"calculateOrbitalSpeed\", function() { return calculateOrbitalSpeed; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"calculateOrbitalVelocity\", function() { return calculateOrbitalVelocity; });\n/* harmony import */ var _utilities__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utilities */ \"./src/utilities.ts\");\n\nclass Vector {\n    constructor(x, y) {\n        this.x = x;\n        this.y = y;\n    }\n    get transposed() {\n        return new Vector(this.y, this.x);\n    }\n    get size() {\n        return Math.sqrt(this.x * this.x + this.y * this.y);\n    }\n    static zero() {\n        return new Vector(0, 0);\n    }\n    static random(max, min) {\n        return new Vector(Object(_utilities__WEBPACK_IMPORTED_MODULE_0__[\"random\"])(max, min), Object(_utilities__WEBPACK_IMPORTED_MODULE_0__[\"random\"])(max, min));\n    }\n    toString() {\n        return `(${this.x.toFixed(2)}, ${this.y.toFixed(2)})`;\n    }\n    add(other) {\n        return new Vector(this.x + other.x, this.y + other.y);\n    }\n    sub(other) {\n        return new Vector(this.x - other.x, this.y - other.y);\n    }\n    mult(n) {\n        return new Vector(this.x * n, this.y * n);\n    }\n    div(n) {\n        return new Vector(this.x / n, this.y / n);\n    }\n    dist(other) {\n        return Math.sqrt(Math.pow(this.x - other.x, 2) + Math.pow(this.y - other.y, 2));\n    }\n    sized(size) {\n        const mul = size / this.size;\n        return this.mult(mul);\n    }\n    rotated(radian) {\n        const x = this.x * Math.cos(radian) - this.y * Math.sin(radian);\n        const y = this.x * Math.sin(radian) + this.y * Math.cos(radian);\n        return new Vector(x, y);\n    }\n    randomized() {\n        return new Vector(Object(_utilities__WEBPACK_IMPORTED_MODULE_0__[\"random\"])(this.x), Object(_utilities__WEBPACK_IMPORTED_MODULE_0__[\"random\"])(this.y));\n    }\n    moved(radian, length) {\n        const x = this.x + Math.cos(radian) * length;\n        const y = this.y + Math.sin(radian) * length;\n        return new Vector(x, y);\n    }\n}\nclass Force {\n    constructor(magnitude) {\n        this.magnitude = magnitude;\n    }\n    static zero() {\n        return new Force(new Vector(0, 0));\n    }\n    accelerationTo(mass) {\n        return this.magnitude.div(mass);\n    }\n    consumedEnergyWith(mass) {\n        return this.magnitude.size * mass;\n    }\n    add(other) {\n        const vector = this.magnitude.add(other.magnitude);\n        return new Force(vector);\n    }\n}\nfunction calculateOrbitalSpeed(position, gravityCenter, gravity) {\n    const distance = position.dist(gravityCenter);\n    return Math.sqrt(gravity / distance);\n}\nfunction calculateOrbitalVelocity(position, gravityCenter, gravity) {\n    const orbitalSpeed = calculateOrbitalSpeed(position, gravityCenter, gravity);\n    const tangentVector = position.sub(gravityCenter)\n        .rotated(Math.PI / 2);\n    return tangentVector.sized(orbitalSpeed);\n}\n\n\n//# sourceURL=webpack:///./src/classes/physics.ts?");

/***/ }),

/***/ "./src/entry_points/open_ended_game.ts":
/*!*********************************************!*\
  !*** ./src/entry_points/open_ended_game.ts ***!
  \*********************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var p5__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! p5 */ \"./node_modules/p5/lib/p5.js\");\n/* harmony import */ var p5__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(p5__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _classes_physics__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../classes/physics */ \"./src/classes/physics.ts\");\n/* harmony import */ var _utilities__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utilities */ \"./src/utilities.ts\");\n\n\n\nconst parameters = new _utilities__WEBPACK_IMPORTED_MODULE_2__[\"URLParameter\"]();\nconst DEBUG = parameters.boolean(\"debug\", true, \"d\"); // デバッグフラグ\nfunction log(message) {\n    if (DEBUG) {\n        console.log(message);\n    }\n}\nconst gridSize = parameters.int(\"grid_size\", 100, \"g\");\nconst fieldSize = parameters.int(\"field_size\", 1000, \"s\");\nlet t = 0;\nconst grids = [];\nconst objects = [];\nconst main = (p) => {\n    p.setup = () => {\n        const canvas = p.createCanvas(fieldSize, fieldSize);\n        canvas.id(\"canvas\");\n        canvas.parent(\"canvas-parent\");\n        setupWorld();\n        setupObjects();\n    };\n    p.draw = () => {\n        p.background(0xFF);\n        objects.forEach(o => {\n            o.attributes.forEach(attribute => {\n                // attribute.execute()  // TODO:\n            });\n        });\n        objects.forEach(o => {\n            o.draw(p);\n        });\n        t += 1;\n    };\n};\nconst sketch = new p5__WEBPACK_IMPORTED_MODULE_0__(main);\n/// Setup\nfunction setupWorld() {\n}\nfunction setupObjects() {\n    const halfGridSize = gridSize / 2;\n    const gridMax = fieldSize / gridSize;\n    const objectSize = gridSize * 0.6;\n    const burnableAttribute = new Burnable(100, 10);\n    const burnableRate = 0.5;\n    for (let y = 0; y < gridMax; y += 1) {\n        for (let x = 0; x < gridMax; x += 1) {\n            const position = new _classes_physics__WEBPACK_IMPORTED_MODULE_1__[\"Vector\"](x * gridSize + halfGridSize, y * gridSize + halfGridSize);\n            const attributes = (Object(_utilities__WEBPACK_IMPORTED_MODULE_2__[\"random\"])(1) < burnableRate) ? [burnableAttribute] : [];\n            const obj = new Obj(position, objectSize, attributes);\n            objects.push(obj);\n        }\n    }\n    log(`${objects.length} objects`);\n}\n/// World\nclass Grid {\n    constructor(position) {\n        this.position = position;\n    }\n    get properties() {\n        return this._properties;\n    }\n}\n/// Objects\nclass AI {\n    constructor() {\n    }\n}\nclass Burnable {\n    constructor(combustionTemperature, combustionDuration) {\n        this.combustionTemperature = combustionTemperature;\n        this.combustionDuration = combustionDuration;\n        this.isBurning = false;\n        this.duration = 0;\n    }\n    execute(properties) {\n        if (properties.temperature < this.combustionTemperature) {\n            this.duration = Math.max(this.duration - 1, 0);\n            return;\n        }\n        this.duration += 1;\n        if (this.duration >= this.combustionDuration) {\n            // on fire\n        }\n    }\n    draw(p, position, size) {\n        if (this.isBurning === false) {\n            return;\n        }\n        p.noStroke();\n        p.fill(0xFF, 0, 0, 0x40);\n        p.circle(position.x, position.y, size * 1.4);\n    }\n}\nclass Obj {\n    constructor(position, size, attributes) {\n        this.position = position;\n        this.size = size;\n        this.attributes = attributes;\n    }\n    draw(p) {\n        // FixMe: 仮実装\n        const isBurnable = this.attributes.length > 0;\n        if (isBurnable) {\n            p.fill(0, 0x80);\n        }\n        else {\n            p.fill(0xFF, 0x80);\n        }\n        p.noStroke();\n        const radius = this.size / 2;\n        p.rect(this.position.x - radius, this.position.y - radius, this.size, this.size);\n        this.attributes.forEach(attribute => {\n            attribute.draw(p, this.position, this.size);\n        });\n    }\n}\nclass Agent extends Obj {\n    constructor(position, size, attributes, ai) {\n        super(position, size, attributes);\n        this.ai = ai;\n    }\n    draw(p) {\n        // TODO:\n    }\n}\n\n\n//# sourceURL=webpack:///./src/entry_points/open_ended_game.ts?");

/***/ }),

/***/ "./src/utilities.ts":
/*!**************************!*\
  !*** ./src/utilities.ts ***!
  \**************************/
/*! exports provided: random, Color, URLParameter */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"random\", function() { return random; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Color\", function() { return Color; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"URLParameter\", function() { return URLParameter; });\n// export function random(max: number): number\t// not working: raises \"Expected 1 arguments, but got 2.\"\nfunction random(max, min) {\n    if (min == undefined) {\n        return Math.random() * max;\n    }\n    const range = max - min;\n    return Math.random() * range + min;\n}\nclass Color {\n    constructor(r, g, b) {\n        this.r = r;\n        this.g = g;\n        this.b = b;\n    }\n    p5(p, alpha) {\n        return p.color(this.r, this.g, this.b, alpha);\n    }\n}\nclass URLParameter {\n    constructor() {\n        this.parameters = new Map();\n        this.usedKeys = [];\n        const rawQuery = document.location.search;\n        const pairs = rawQuery\n            .slice(rawQuery.indexOf(\"?\") + 1)\n            .split(\"&\");\n        // tslint:disable-next-line:no-any\n        const rawParameters = {};\n        for (const query of pairs) {\n            if (query === \"\") {\n                continue;\n            }\n            const pair = query.split(\"=\");\n            rawParameters[pair[0]] = pair[1];\n            this.parameters.set(pair[0], pair[1]);\n        }\n        console.log(`parameters: ${rawParameters.toString()}`);\n    }\n    hasKey(key, shortKey) {\n        if ((shortKey != undefined) && (this.parameters.get(shortKey) != undefined)) {\n            return true;\n        }\n        return this.parameters.get(key) != undefined;\n    }\n    int(key, defaultValue, shortKey) {\n        let rawValue;\n        if (shortKey != undefined) {\n            this.usedKeys.push(shortKey);\n            rawValue = this.parameters.get(shortKey);\n        }\n        this.usedKeys.push(key);\n        if (rawValue == undefined) {\n            rawValue = this.parameters.get(key);\n        }\n        if (rawValue == undefined) {\n            return defaultValue;\n        }\n        const parsedValue = parseInt(rawValue, 10);\n        if (isNaN(parsedValue)) {\n            return defaultValue;\n        }\n        return parsedValue;\n    }\n    float(key, defaultValue, shortKey) {\n        let rawValue;\n        if (shortKey != undefined) {\n            this.usedKeys.push(shortKey);\n            rawValue = this.parameters.get(shortKey);\n        }\n        this.usedKeys.push(key);\n        if (rawValue == undefined) {\n            rawValue = this.parameters.get(key);\n        }\n        if (rawValue == undefined) {\n            return defaultValue;\n        }\n        const parsedValue = parseFloat(rawValue);\n        if (isNaN(parsedValue)) {\n            return defaultValue;\n        }\n        return parsedValue;\n    }\n    boolean(key, defaultValue, shortKey) {\n        let rawValue;\n        if (shortKey != undefined) {\n            this.usedKeys.push(shortKey);\n            rawValue = this.parameters.get(shortKey);\n        }\n        this.usedKeys.push(key);\n        if (rawValue == undefined) {\n            rawValue = this.parameters.get(key);\n        }\n        if (rawValue == undefined) {\n            return defaultValue;\n        }\n        const parsedValue = parseInt(rawValue, 10);\n        if (isNaN(parsedValue)) {\n            return defaultValue;\n        }\n        return parsedValue > 0;\n    }\n    string(key, defaultValue, shortKey) {\n        let rawValue;\n        if (shortKey != undefined) {\n            this.usedKeys.push(shortKey);\n            rawValue = this.parameters.get(shortKey);\n        }\n        this.usedKeys.push(key);\n        if (rawValue == undefined) {\n            rawValue = this.parameters.get(key);\n        }\n        if (rawValue == undefined) {\n            return defaultValue;\n        }\n        return rawValue;\n    }\n    unusedKeys() {\n        const allKeys = Array.from(this.parameters.keys());\n        return allKeys.filter(k => this.usedKeys.indexOf(k) === -1);\n    }\n    toURLString() {\n        let str = \"?\";\n        this.parameters.forEach((value, key) => {\n            str = `${str}&${key}=${value}`;\n        });\n        return str;\n    }\n    getBoolean(key, defaultValue) {\n        const value = this.parameters.get(key);\n        if (value === undefined) {\n            return defaultValue;\n        }\n        return value === \"1\";\n    }\n    setBoolean(key, value) {\n        this.parameters.set(key, (value ? \"1\" : \"0\"));\n    }\n    getString(key, defaultValue) {\n        const maybeString = this.parameters.get(key);\n        return maybeString ? maybeString : defaultValue;\n    }\n    setString(key, value) {\n        this.parameters.set(key, value);\n    }\n    getNumber(key, defaultValue) {\n        const value = this.parameters.get(key);\n        if (value === undefined) {\n            return defaultValue;\n        }\n        return Number(this.parameters.get(key));\n    }\n    setNumber(key, value) {\n        this.parameters.set(key, value.toString());\n    }\n}\n\n\n//# sourceURL=webpack:///./src/utilities.ts?");

/***/ })

/******/ });