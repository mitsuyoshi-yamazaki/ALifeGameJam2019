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

  public p5(p: p5, alpha: number): p5.Color {
    return p.color(this.r, this.g, this.b, alpha)
  }
}

export class URLParameter {
  public readonly parameters = new Map<string, string>()
  private readonly usedKeys: string[] = []

  public constructor() {
    const rawQuery = document.location.search
    const pairs = rawQuery
      .slice(rawQuery.indexOf("?") + 1)
      .split("&")
    // tslint:disable-next-line:no-any
    const rawParameters = {} as any

    for (const query of pairs) {
      if (query === "") {
        continue
      }
      const pair = query.split("=")
      rawParameters[pair[0]] = pair[1]
      this.parameters.set(pair[0], pair[1])
    }
    console.log(`parameters: ${rawParameters.toString()}`)
  }

  public hasKey(key: string, shortKey?: string): boolean {
    if ((shortKey != undefined) && (this.parameters.get(shortKey) != undefined)) {
      return true
    }

    return this.parameters.get(key) != undefined
  }

  public int(key: string, defaultValue: number, shortKey?: string): number {
    let rawValue: string | undefined
    if (shortKey != undefined) {
      this.usedKeys.push(shortKey)
      rawValue = this.parameters.get(shortKey)
    }
    this.usedKeys.push(key)
    if (rawValue == undefined) {
      rawValue = this.parameters.get(key)
    }
    if (rawValue == undefined) {
      return defaultValue
    }
    const parsedValue = parseInt(rawValue, 10)
    if (isNaN(parsedValue)) {
      return defaultValue
    }

    return parsedValue
  }

  public float(key: string, defaultValue: number, shortKey?: string): number {
    let rawValue: string | undefined
    if (shortKey != undefined) {
      this.usedKeys.push(shortKey)
      rawValue = this.parameters.get(shortKey)
    }
    this.usedKeys.push(key)
    if (rawValue == undefined) {
      rawValue = this.parameters.get(key)
    }
    if (rawValue == undefined) {
      return defaultValue
    }
    const parsedValue = parseFloat(rawValue)
    if (isNaN(parsedValue)) {
      return defaultValue
    }

    return parsedValue
  }

  public boolean(key: string, defaultValue: boolean, shortKey?: string): boolean {
    let rawValue: string | undefined
    if (shortKey != undefined) {
      this.usedKeys.push(shortKey)
      rawValue = this.parameters.get(shortKey)
    }
    this.usedKeys.push(key)
    if (rawValue == undefined) {
      rawValue = this.parameters.get(key)
    }
    if (rawValue == undefined) {
      return defaultValue
    }
    const parsedValue = parseInt(rawValue, 10)
    if (isNaN(parsedValue)) {
      return defaultValue
    }

    return parsedValue > 0
  }

  public string(key: string, defaultValue: string, shortKey?: string): string {
    let rawValue: string | undefined
    if (shortKey != undefined) {
      this.usedKeys.push(shortKey)
      rawValue = this.parameters.get(shortKey)
    }
    this.usedKeys.push(key)
    if (rawValue == undefined) {
      rawValue = this.parameters.get(key)
    }
    if (rawValue == undefined) {
      return defaultValue
    }

    return rawValue
  }

  public unusedKeys(): string[] {
    const allKeys = Array.from(this.parameters.keys())

    return allKeys.filter(k => this.usedKeys.indexOf(k) === -1)
  }

  public toURLString(): string {
    let str = "?"
    this.parameters.forEach((value, key) => {
      str = `${str}&${key}=${value}`
    })

    return str
  }

  public getBoolean(key: string, defaultValue: boolean): boolean {
    const value = this.parameters.get(key)
    if (value === undefined) {
      return defaultValue
    }

    return value === "1"
  }

  public setBoolean(key: string, value: boolean) {
    this.parameters.set(key, (value ? "1" : "0"))
  }

  public getString(key: string, defaultValue: string): string {
    const maybeString = this.parameters.get(key)

    return maybeString ? maybeString : defaultValue
  }

  public setString(key: string, value: string) {
    this.parameters.set(key, value)
  }

  public getNumber(key: string, defaultValue: number): number {
    const value = this.parameters.get(key)
    if (value === undefined) {
      return defaultValue
    }

    return Number(this.parameters.get(key))
  }

  public setNumber(key: string, value: number) {
    this.parameters.set(key, value.toString())
  }
}
