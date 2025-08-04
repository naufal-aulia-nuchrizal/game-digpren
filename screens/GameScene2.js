import { character } from '../characters/character.js';
import { party } from '../characters/party.js';
import { battlecontroller } from '../battle/battlecontroller.js';
import { battleui } from '../ui/battleui.js';
import { skilldatabase } from '../skills/skilldatabase.js';
import { getRandomCityBackgroundPath } from '../utils/BackgroundSelector.js';
import { SpriteAnimator } from '../engine/SpriteAnimator.js';
import { HERO_ANIMATIONS } from '../engine/HeroConfig.js';

export class GameScene2 {
  constructor(container = document.body, { onExit } = {}) {
  this.container = container;
  this.onExit = onExit;

  if (typeof this.onExit !== "function") {
    console.warn("[GameScene1] DIPANGGIL TANPA onExit yang valid!");
    console.trace();
  }

  this._playerActionHandler = null;
  this._playerSkillHandler = null;
  this._animFrameId = null;
}

  start() {
    const battlefield = document.getElementById('battlefield');
    if (!battlefield) throw new Error("#battlefield element tidak ditemukan");

    battlefield.style.display = 'block';
    this.container.innerHTML = '';
    document.getElementById("background").src = getRandomCityBackgroundPath();

    // 🧱 Hero & Boss Setup
    const hero1 = new character("Warrior", 100, 15, "assets/characters/ground_monk/monk_spritesheet.png", [
      skilldatabase["Slash"], skilldatabase["Double"], skilldatabase["Triple"], skilldatabase["Ultimate"]
    ], "assets/characters/ground_monk/ground_monk.png");

    const hero2 = new character("Mage", 70, 25, "assets/characters/metal_bladekeeper/metal_spritesheet.png", [
      skilldatabase["Fireball"], skilldatabase["Ice"], skilldatabase["Thunder"], skilldatabase["Meteor"]
    ], "assets/characters/metal_bladekeeper/metal_bladekeeper.png");

    const hero3 = new character("Guardian", 120, 10, "assets/characters/crystal_mauler/crystal_spritesheet.png", [
      skilldatabase["Shield"], skilldatabase["Wind"], skilldatabase["Storm"], skilldatabase["Tornado"]
    ], "assets/characters/Crystal_Mauler/crystal_mauler.png");

    const boss = new character("Demon Lord", 199, 100, "assets/characters/frost_guardian/frost_spritesheet.png", []);

    boss.hp = boss.maxHp;
boss.hasPlayedDead = false;
boss.animationState = "idle";
    const heroParty = new party([hero1, hero2, hero3]);
    const ui = new battleui(heroParty, boss);
    const battle = new battlecontroller(heroParty, boss, ui, {
      getDiamondCount: () => parseInt(localStorage.getItem("diamond") || "0"),
      spendDiamond: (amount) => {
        const current = parseInt(localStorage.getItem("diamond") || "0");
        localStorage.setItem("diamond", current - amount);
      },
      onGameOver: () => {
        alert("Kamu kalah. Kembali ke menu utama?");
        window.location.href = "/screens/MainMenu.js";
      },
      onVictory: () => {
  console.log("[GameScene1] onVictory triggered!");
  this.cleanup(); // Ini penting untuk bersih-bersih elemen GameScene

  if (typeof this.onExit === "function") {
    this.onExit(); // Kembali ke LevelSelector
  } else {
    console.warn("[GameScene1] onExit is not a function or undefined!");
  }
}

    });

    // 🧠 Inisialisasi UI Status Bar HP
    ui.createHPBarUI();
    this.startHPLoop(ui);

    ui.render(battle.getCurrentActor().name);

    // Reset background-image jika ada sisa
    ["hero1", "hero2", "hero3", "boss"].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.style.backgroundImage = '';
    });

    const heroEls = ["hero1", "hero2", "hero3", "boss"].map(id => document.getElementById(id));

    // 🔄 Load sprite & animasi
    Promise.all([
      this.loadImage(hero1.spritepath),
      this.loadImage(hero2.spritepath),
      this.loadImage(hero3.spritepath),
      this.loadImage(boss.spritepath)
    ]).then(([img1, img2, img3, imgBoss]) => {
      hero1.setAnimator(new SpriteAnimator(img1, HERO_ANIMATIONS.ground_monk, 3));
      hero2.setAnimator(new SpriteAnimator(img2, HERO_ANIMATIONS.metal_bladekeeper, 3));
      hero3.setAnimator(new SpriteAnimator(img3, HERO_ANIMATIONS.cristal_mauler, 3));
      boss.setAnimator(new SpriteAnimator(imgBoss, HERO_ANIMATIONS.frost_guardian, 3));

      this.animate([hero1, hero2, hero3, boss], heroEls);
    });

    // ⚔️ Handler: Action
    this._playerActionHandler = (e) => {
      const { hero, action } = e.detail;
      ui.commandPanel && (ui.commandPanel.innerHTML = '');

      if (action === "Attack") {
        battle.executeHeroAttack(hero);
      } else if (action === "Defend") {
        hero.animationState = "defend";
        setTimeout(() => {
          hero.animationState = "idle";
          battle.nextTurn();
        }, 800);
      } else if (action === "Run") {
        alert(`${hero.name} mencoba kabur... Gagal!`);
        ui.render(battle.getCurrentActor().name);
      }
    };
    document.addEventListener("playerActionSelected", this._playerActionHandler);

    // ✨ Handler: Skill
    this._playerSkillHandler = (e) => {
      const { hero, skill } = e.detail;
      ui.skillMenuElement && (ui.skillMenuElement.innerHTML = '');
      ui.commandPanel && (ui.commandPanel.innerHTML = '');
      battle.executeHeroSkill(hero, skill);
    };
    document.addEventListener("playerSkillSelected", this._playerSkillHandler);
  }

  // 🔁 Loop untuk update HP UI setiap frame
  startHPLoop(ui) {
    const hpLoop = () => {
      ui.updateHPBars();
      requestAnimationFrame(hpLoop);
    };
    hpLoop();
  }

  loadImage(path) {
    return new Promise(resolve => {
      const img = new Image();
      img.src = path;
      img.onload = () => resolve(img);
    });
  }

  animate(characters, elements) {
    const loop = () => {
      characters.forEach((char, i) => {
        const animator = char.animator;
        const el = elements[i];

        if (
          animator &&
          (
            (char.animationState === "dead" && !char.hasPlayedDead) ||
            (char.animationState !== "dead" && animator.currentAnim !== char.animationState)
          )
        ) {
          if (char.animationState === "dead") {
            animator.play("dead", false);
            char.hasPlayedDead = true;
          } else {
            const loopAnim = char.animationState === "idle";
            animator.play(char.animationState, loopAnim);
          }
        }

        animator?.updateAndDraw(el);
      });

      this._animFrameId = requestAnimationFrame(loop);
    };
    loop();
  }

  cleanup() {
  // Bersihkan semua child dari container
  while (this.container.firstChild) {
    this.container.removeChild(this.container.firstChild);
  }

  // Hentikan animasi kalau ada
  if (this._animFrameId) {
    cancelAnimationFrame(this._animFrameId);
  }
  // Hapus event listener
if (this._playerActionHandler) {
  document.removeEventListener("playerActionSelected", this._playerActionHandler);
}
if (this._playerSkillHandler) {
  document.removeEventListener("playerSkillSelected", this._playerSkillHandler);
}

// Bersihkan anim frame
if (this._animFrameId) {
  cancelAnimationFrame(this._animFrameId);
}

// Hapus HP UI


  // Reset handler
  this._playerActionHandler = null;
  this._playerSkillHandler = null;

  console.log("[GameScene1] cleanup selesai!");
  const hpUI = document.getElementById("hp-bar-ui");
if (hpUI) {
  hpUI.remove(); // ini akan menghapus seluruh elemen HP bar
}

}
  
}
