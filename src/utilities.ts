// export function random(max: number): number	// not working: raises "Expected 1 arguments, but got 2."
export function random(max: number, min?: number): number {
  if (min == undefined) {
    return Math.random() * max
  }
  const range = max - min

  return Math.random() * range + min
}

export class Color {
  public constructor(public readonly r: number, public readonly g: number, public readonly b: number) {
  }
}
