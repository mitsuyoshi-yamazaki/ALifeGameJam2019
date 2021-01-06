function getLink(): HTMLElement | null {
  return document.getElementById("link")
}

export class Screenshot {
  private static launchTime = Math.floor((new Date()).getTime() / 1000)

  public static saveScreenshot() {
    const link = getLink()
    const canvas = Screenshot.getCanvas()
    if (link == undefined || canvas == undefined) {
      console.log(`link or canvas missing: ${String(link)}, ${String(canvas)}`)

      return
    }

    const num = Math.floor((new Date()).getTime() / 1000) - Screenshot.launchTime
    const numStr = num.toString()
      .padStart(8, "0")
    const filename = `${Screenshot.launchTime}__${numStr}.png`
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
