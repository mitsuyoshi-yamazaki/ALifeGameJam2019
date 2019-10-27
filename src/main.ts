let world: World<WorldObject>

function setup(): void {
	const worldSize = 200
	world = new VanillaWorld(createVector(worldSize, worldSize))

	const objects: [SimpleLife, p5.Vector][] = [
		[new SimpleLife(), createVector(50, 100)]
	]
	world.addObjects(objects)
}

function draw(): void {
	world.next()
	world.draw()
}

// TODO: ファイルを分割する
// Worlds
interface World<ObjectType> {
	size: p5.Vector
	t: number
	objects: [ObjectType, p5.Vector][]

	addObjects(objects: [ObjectType, p5.Vector][]): void
	next(): void

	// TODO: 世界は描画系とは独立して存在するので、描画処理は外部に出して、 World.state を読み込み描画するようにする
	draw(): void
}

class VanillaWorld<ObjectType> implements World<ObjectType> {
	private _size: p5.Vector
	get size(): p5.Vector {
		return this._size
	}

	private _t: number = 0
	get t(): number {
		return this._t
	}

	private _objects: [ObjectType, p5.Vector][] = []
	get objects(): [ObjectType, p5.Vector][] {
		return this._objects
	}

	constructor(size: p5.Vector) {
		this._size = size
	}

	addObjects(objects: [ObjectType, p5.Vector][]): void {
		this._objects = this._objects.concat(objects)
	}

	next(): void {
		this._t += 1
		// TODO: implement here
	}

	draw(): void {
		background(220)
		noStroke()
		fill(0, 255, 0)
		const radius = 10
		this._objects.forEach(obj => {
			ellipse(obj[1].x, obj[1].y, radius, radius)
		})
	}
}

// Objects
interface WorldObject {
}

class SimpleLife implements WorldObject {
}
