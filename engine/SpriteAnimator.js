export class SpriteAnimator {
  constructor(image, config, scale = 2.5) {
    this.image = image;
    this.config = config;
    this.scale = scale;

    this.currentAnim = 'idle';
    this.currentFrame = 0;
    this.frameTimer = 0;
    this.frameSpeed = 6;

    this.loop = true;
    this.onComplete = null;
    this.targetRef = null;

    this.hasFinishedDead = false;
  }

  play(name, loop = true, onComplete = null, targetRef = null) {
    const anim = this.config.animations[name];
    if (!anim) return;

    this.currentAnim = name;
    this.currentFrame = 0;
    this.frameTimer = 0;
    this.loop = loop;
    this.onComplete = onComplete;
    this.targetRef = targetRef;
    this.frameSpeed = anim.frameSpeed || 6;

    if (name === "dead") {
      this.hasFinishedDead = false; // reset flag saat replay animasi mati
    }
  }

  updateAndDraw(divElement) {
    const { frameWidth, frameHeight, animations } = this.config;
    const anim = animations[this.currentAnim];
    if (!anim || anim.frames === 0) return;

    // ⏹ Apply visual frame
    const cropX = this.currentFrame * frameWidth;
    const cropY = anim.row * frameHeight;
    const offsetY = anim.yOffset || 0;
    const offsetX = anim.xOffset || 0;

    divElement.style.backgroundImage = `url('${this.image.src}')`;
    divElement.style.backgroundPosition = `-${cropX}px -${cropY}px`;
    divElement.style.backgroundSize = `${this.image.width}px ${this.image.height}px`;
    divElement.style.width = `${frameWidth}px`;
    divElement.style.height = `${frameHeight}px`;
    divElement.style.imageRendering = 'pixelated';
    divElement.style.overflow = 'hidden';
    divElement.style.backgroundRepeat = 'no-repeat';
    divElement.style.position = 'absolute';

    const mirror = this.config.mirror ? -1 : 1;
    divElement.style.transform = `scale(${this.scale * mirror}, ${this.scale}) translateY(${offsetY}px) translateX(${offsetX}px)`;
    divElement.style.transformOrigin = 'bottom left';

    // 🕒 Update frame
    this.frameTimer++;
    if (this.frameTimer >= this.frameSpeed) {
      this.frameTimer = 0;

      if (this.loop) {
        this.currentFrame = (this.currentFrame + 1) % anim.frames;
      } else {
        if (this.currentFrame < anim.frames - 1) {
          this.currentFrame++;
        } else {
          // 🚩 Hanya sekali panggil onComplete saat frame terakhir
          if (this.onComplete) {
            this.onComplete();
            this.onComplete = null;
          }

          if (this.targetRef && typeof this.targetRef._onAnimComplete === "function") {
            this.targetRef._onAnimComplete();
            this.targetRef._onAnimComplete = null;
          }

          if (this.currentAnim === "dead") {
            this.hasFinishedDead = true;
            // ✅ STOP: diam di frame terakhir
            return;
          }

          // 🎬 Kembali ke idle setelah animasi non-dead selesai
          this.play('idle', true);
        }
      }
    }
  }
}
