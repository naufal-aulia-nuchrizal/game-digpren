import RevivePopup from "../ui/revivepopup.js";
import VictoryPopup from "../ui/victorypopup.js"; // ✅ benar

export class battlecontroller {
  constructor(heroParty, boss, ui, options = {}) {
    this.heroParty = heroParty;
    this.boss = boss;
    this.turnIndex = 0;
    this.ui = ui;

    this.getDiamondCount = options.getDiamondCount || (() => 0);
    this.spendDiamond = options.spendDiamond || (() => {});
    this.onGameOver = options.onGameOver || (() => {});
    this.onVictory = options.onVictory || (() => {}); // opsional jika butuh callback
  }

  getCurrentActor() {
    return this.turnIndex < this.heroParty.length
      ? this.heroParty.getMember(this.turnIndex)
      : this.boss;
  }

  nextTurn() {
    this.turnIndex++;
    if (this.turnIndex > this.heroParty.length) {
      this.turnIndex = 0;
    }

    while (
      this.turnIndex < this.heroParty.length &&
      !this.heroParty.getMember(this.turnIndex).isAlive()
    ) {
      this.turnIndex++;
    }

    const allHeroesDead = this.heroParty.getAliveMembers().length === 0;
    const bossDead = !this.boss.isAlive();

    if (bossDead && !allHeroesDead) {
      console.log("🎉 Semua musuh dikalahkan!");
      this.showVictoryPopup();
      return;
    }

    if (allHeroesDead) {
      this.handlePartyDefeated();
      return;
    }

    const actor = this.getCurrentActor();
    if (actor && actor.name && this.ui?.render) {
      this.ui.render(actor.name);
    }

    if (actor === this.boss && this.boss.isAlive()) {
      setTimeout(() => this.executeTurn(), 600);
    }
  }

  showVictoryPopup() {
    new VictoryPopup(() => {
      console.log("✅ Pemain menang! Lanjut ke scene berikutnya...");
      this.onVictory();
    });
  }

  handlePartyDefeated() {
    console.log("💀 Semua hero mati! Memunculkan opsi revive...");

    new RevivePopup(
      () => {
        console.log("▶️ Revive berhasil.");
        this.heroParty.reviveAll();

        this.heroParty.getAliveMembers().forEach(hero => {
          hero.animationState = "idle";
          hero.spriteAnimator?.play("idle", true);
        });

        this.turnIndex = 0;
        this.ui?.render(this.heroParty.getAliveMembers()[0]?.name || "");
      },
      () => {
        console.log("❌ Pemain menyerah. Game Over.");
        this.onGameOver();
      },
      () => this.getDiamondCount(),
      (n) => this.spendDiamond(n)
    );
  }

  executeTurn() {
    const actor = this.getCurrentActor();

    if (this.turnIndex < this.heroParty.length) {
      if (!actor.isAlive()) {
        console.log(`${actor.name} sudah mati, lewati.`);
        this.nextTurn();
        return;
      }

      if (!actor.isDead) actor.animationState = "idle";
      this.ui?.render?.(actor.name);
      return;
    }

    if (!this.boss.isAlive()) {
      console.log("Boss sudah mati, tidak bisa menyerang.");
      return;
    }

    const target = this.heroParty.getAliveMembers()[0];
    this.boss.animationState = "atk1";

    setTimeout(() => {
      const damage = this.boss.atk;
      target.takeDamage(damage);
      console.log(`Boss menyerang ${target.name} sebesar ${damage}`);

      setTimeout(() => {
        if (!this.boss.isDead) this.boss.animationState = "idle";
        this.nextTurn();
      }, 600);
    }, 600);
  }

  executeHeroAttack(hero) {
    const atk1 = hero.skills.find(s => s.key === "atk1");

    if (!atk1 || hero.isDead) {
      console.warn(`${hero.name} tidak bisa menyerang.`);
      this.nextTurn();
      return;
    }

    hero.animationState = "atk1";

    setTimeout(() => {
      const result = atk1.use(hero, this.boss);
      console.log(result);

      this.boss.animationState = "take_hit";

      setTimeout(() => {
        if (!hero.isDead) hero.animationState = "idle";
        if (!this.boss.isDead) this.boss.animationState = "idle";

        this.nextTurn();
      }, 600);
    }, 600);
  }

  executeHeroSkill(hero, skill) {
    if (!skill || hero.isDead) {
      console.warn(`${hero.name} tidak bisa menggunakan skill.`);
      this.nextTurn();
      return;
    }

    hero.animationState = skill.key;

    setTimeout(() => {
      const result = skill.use(hero, this.boss);
      console.log(result);

      this.boss.animationState = "take_hit";

      setTimeout(() => {
        if (!hero.isDead) hero.animationState = "idle";
        if (!this.boss.isDead) this.boss.animationState = "idle";

        this.nextTurn();
      }, 600);
    }, 600);
  }
}
