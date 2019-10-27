let world: World

function setup(): void {
	world = new VanillaWorld(200, 200)
}

function draw(): void {
	world.next()
	world.draw()
}

// TODO: ファイルを分割する
interface World {
	t: number
	next(): void
	draw(): void	// TODO: 世界は描画系とは独立して存在するので、描画処理は外部に出して、 World.state を読み込み描画するようにする
}

class VanillaWorld implements World {
	private _t: number = 0
	get t(): number {
		return this._t
	}

	constructor(readonly width: number, readonly height: number) {
	}

	next(): void {
		this._t += 1
		// TODO: implement here
	}

	draw(): void {
		// TODO: implement here
		stroke(255, 0, 0)
		ellipse(50, 50, 80, 80);
	}
}
