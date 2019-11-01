// https://p5js.org/reference/

declare function createCanvas(width: number, height: number)
declare function background(color: number): void
declare function background(r: number, g: number, b: number): void
declare function noFill(): void
declare function noStroke(): void
declare function fill(r: number, g: number, b: number): void
declare function stroke(r: number, g: number, b: number): void
declare function ellipse(x: number, y: number, width: number, height: number): void
declare function rect(x: number, y: number, width: number, height: number): void
declare function createVector(x: number, y: number): p5.Vector
declare function random(n: number): number
declare function random(min: number, max: number): number
declare function random<T>(values: T[]): T

declare namespace p5 {
	class Vector {
		static random2D(): Vector
		static add(lhs: Vector, rhs: Vector): Vector
		static mult(v: Vector, n: number): Vector
		x: number
		y: number
		z: number
		div(n: number): Vector
	}
}