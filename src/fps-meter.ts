export class FPSMeter {
  private element: HTMLElement;
  private lastTime: number = performance.now();
  private frameCount: number = 0;

  constructor() {
    this.element = this.createElement();
  }

  update() {
    const now = performance.now();
    const elapsedTime = now - this.lastTime;
    this.frameCount = this.frameCount + 1;

    if (elapsedTime >= 1_000) {
      const fps = Math.round((this.frameCount / elapsedTime) * 1_000);
      this.element.textContent = `FPS: ${fps}`;

      this.frameCount = 0;
      this.lastTime = now;
    }
  }

  private createElement() {
    const element = document.createElement("div");
    element.style.position = "fixed";
    element.style.top = "0";
    element.style.right = "0";
    element.style.backgroundColor = "black";
    element.style.color = "white";
    element.style.padding = "5px";
    element.style.fontFamily = "monospace";
    element.style.fontSize = "14px";
    document.body.appendChild(element);

    return element;
  }
}
