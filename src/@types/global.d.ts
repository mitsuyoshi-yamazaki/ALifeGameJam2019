declare function setTimestamp(t: number): void	// in screenshot.js
declare function getTimestamp(): number	// in main.pde
declare function getLives(): object	// in main.pde
declare function saveScreenshot(): void // in screenshot.js

declare interface Document {
  msFullscreenElement: Element | null
  mozFullScreenElement: Element | null
  webkitFullscreenElement: Element | null

  mozCancelFullScreen(): void
  webkitExitFullscreen(): void
  msExitFullscreen(): void
}

declare interface HTMLElement {
  mozRequestFullScreen(): void
  webkitRequestFullscreen(): void
  msRequestFullscreen(): void
}
