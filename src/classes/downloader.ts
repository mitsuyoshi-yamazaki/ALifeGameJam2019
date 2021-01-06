export class Screenshot {
  public static link: HTMLElement
  public static canvas: HTMLCanvasElement
  public static launchTime = Math.floor((new Date()).getTime() / 1000)

  public static saveScreenshot() {
    Screenshot.setup()
    const num = Math.floor((new Date()).getTime() / 1000) - Screenshot.launchTime
    const numStr = num.toString()
      .padStart(8, "0")
    const filename = `${Screenshot.launchTime}__${numStr}.png`
    Screenshot.link.setAttribute("download", filename)
    Screenshot.link.setAttribute("href", Screenshot.canvas.toDataURL("image/png")
      .replace("image/png", "image/octet-stream"))
    Screenshot.link.click()
    console.log(`Saved: ${filename}`)
  }

  public static setup() {
    // tslint:disable-next-line:no-non-null-assertion
    Screenshot.link = document.getElementById("link")!
    // tslint:disable-next-line:no-non-null-assertion
    Screenshot.canvas = document.getElementById("canvas") as HTMLCanvasElement
    console.log(`screenshot set ${String(Screenshot.canvas)}`)
  }
}
