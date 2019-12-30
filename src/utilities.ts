import * as p5 from "p5"

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

  public p5(p: p5): p5.Color {
    return p.color(this.r, this.g, this.b)
  }
}

export function parsedQueries(): object {
  const rawQuery = document.location.search
  const queries = rawQuery
    .slice(rawQuery.indexOf("?") + 1)
    .split("&")
  const parameters = { }

  for (const query of queries) {
    const pair = query.split("=")
    parameters[pair[0]] = pair[1]
  }
  console.log(parameters)

  return parameters
}
