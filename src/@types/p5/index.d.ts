declare function createCanvas(width: number, height: number)
declare function background(color: number): void
declare function background(r: number, g: number, b: number): void
declare function noFill(): void
declare function noStroke(): void
declare function fill(r: number, g: number, b: number): void
declare function stroke(r: number, g: number, b: number): void
declare function ellipse(x: number, y: number, width: number, height: number): void
declare function createVector(x: number, y: number): p5.Vector

declare namespace p5 {
	class Vector {
		static random2D(): Vector
		static mult(v: Vector, n: number): Vector
		x: number
		y: number
		z: number
	}
}