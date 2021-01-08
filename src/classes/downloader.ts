const launchTime = Math.floor((new Date()).getTime() / 1000)

function getLink(): HTMLElement | null {
  return document.getElementById("link")
}

function createFilename(prefix: string, t: number, extension: string): string {
  const timestamp = Math.floor(t)
    .toString()
    .padStart(8, "0")

  return `${launchTime}__${timestamp}.${extension}`
}

export class Screenshot {
  public static saveScreenshot(t: number) {
    const link = getLink()
    const canvas = Screenshot.getCanvas()
    if (link == undefined || canvas == undefined) {
      console.log(`link or canvas not found: ${String(link)}, ${String(canvas)}`)

      return
    }

    const filename = createFilename("", t, "png")
    link.setAttribute("download", filename)
    link.setAttribute("href", canvas.toDataURL("image/png")
      .replace("image/png", "image/octet-stream"))
    link.click()
    console.log(`Saved: ${filename}`)
  }

  private static getCanvas(): HTMLCanvasElement | null {
    return document.getElementById("canvas") as HTMLCanvasElement
  }
}

export class JSONDownloader {
  public static download(json: object, filenamePrefix: string) {
    const link = getLink()
    if (link == undefined) {
      console.log(`link not found`)

      return
    }
    const data = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(json))}`
    const filename = `${filenamePrefix}.json` // TODO:
    link.setAttribute("href", data)
    link.setAttribute("download", filename)
    link.click()
    console.log(`Saved: ${filename}`)
  }
}
