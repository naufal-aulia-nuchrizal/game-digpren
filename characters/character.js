export class character {
  constructor(name, maxHp, atk, spritepath = "", skills = [],avatar = "") {
    this.name = name;
    this.maxHp = maxHp;
    this.currentHp = maxHp;
    this.atk = atk;
    this.spritepath = spritepath;
    this.skills = skills;
    this.isDead = false;
    this.hasPlayedDead = false;
    this.animationState = "idle";
    this.animator = null;
    this.avatar = avatar || `assets/characters/${spritepath}/${spritepath}.png`;

  }

  isAlive() {
    return this.currentHp > 0;
  }

  takeDamage(amount) {
    this.currentHp -= amount;
    if (this.currentHp < 0) this.currentHp = 0;

    const diedNow = this.currentHp === 0 && !this.isDead;

    this.animationState = "take_hit";

    if (this.animator) {
      this.animator.play("take_hit", false, () => {
        if (diedNow) {
          this.playDeath();
        } else {
          this.playIdle();
        }
      });
    } else {
      if (diedNow) {
        this.playDeath();
      }
    }
  }

  playIdle() {
    if (this.animator && !this.isDead) {
      this.animationState = "idle";
      this.animator.play("idle");
    }
  }

  playDeath() {
    if (this.animator && !this.hasPlayedDead) {
      this.animationState = "dead";
      this.isDead = true;
      this.hasPlayedDead = true;
      this.animator.play("dead", false, () => {
        console.log(`${this.name} mati dengan animasi DEAD ✅`);
      });
    }
  }

  heal(amount) {
    if (this.isDead) return;

    this.currentHp += amount;
    if (this.currentHp > this.maxHp) this.currentHp = this.maxHp;

    this.animationState = "heal";

    if (this.animator && this.skills.some(s => s.name.toLowerCase().includes("heal"))) {
      this.animator.play("heal", false, () => {
        this.playIdle();
      });
    }
  }

  attack(target) {
    if (this.isDead) return 0;

    const damage = this.atk;
    this.animationState = "atk1";

    if (this.animator) {
      this.animator.play("atk1", false, () => {
        target.takeDamage(damage);
        this.playIdle();
      });
    } else {
      target.takeDamage(damage);
    }

    return damage;
  }

  setAnimator(animator) {
    this.animator = animator;
  }

  resetAnimation() {
    this.playIdle();
  }

  
}
