let fieldWidth = 400;
let fieldHeight = 400;

function setup(): void {
	size(fieldWidth, fieldHeight);
	background(0xff);
}

function draw(): void {
	let radius = 100
	stroke(0, 0, 0)
	ellipse(fieldWidth / 2, fieldHeight / 2, radius, radius)
}
