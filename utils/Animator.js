export class Animator {
  constructor(element, frameCount, frameWidth, fps = 8) {
    this.element = element;
    this.frameCount = frameCount;
    this.frameWidth = frameWidth;
    this.fps = fps;
    this.currentFrame = 0;
    this.intervalId = null;
  }

  play() {
    this.intervalId = setInterval(() => {
      const offset = -(this.currentFrame * this.frameWidth);
      this.element.style.backgroundPosition = `${offset}px 0px`;

      this.currentFrame = (this.currentFrame + 1) % this.frameCount;
    }, 1000 / this.fps);
  }

  stop() {
    clearInterval(this.intervalId);
  }
}
