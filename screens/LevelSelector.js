import { GameScene1 } from "./GameScene1.js";
import { GameScene2 } from "./GameScene2.js";
import { GameScene3 } from "./GameScene3.js";

export class LevelSelector {
  constructor(containerId = "app") {
    this.container = document.getElementById(containerId);
    this.battlefield = document.getElementById("battlefield");
  }

  start() {
    this._hideBattlefield();
    this._renderLevelSelection();
    this._setupEventListeners();
  }

  _hideBattlefield() {
    if (this.battlefield) {
      this.battlefield.style.display = "none";
    }
  }

  _renderLevelSelection() {
    this.container.style.display = "block";
    this.container.innerHTML = `
      <div id="level-map" style="
        position: relative;
        width: 1000px;
        height: 500px;
        margin: 50px auto;
        background-color: #000;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        overflow: hidden;
      ">
        <div class="level-node" style="top: 50px;" data-level="3">
          <img src="assets/ui/numbelayout3.png" alt="Level 3" />
        </div>
        <div class="connector" style="top: 130px;"></div>
        <div class="level-node" style="top: 180px;" data-level="2">
          <img src="assets/ui/numbelayout2.png" alt="Level 2" />
        </div>
        <div class="connector" style="top: 260px;"></div>
        <div class="level-node" style="top: 310px;" data-level="1">
          <img src="assets/ui/numbelayout1.png" alt="Level 1" />
        </div>
      </div>
    `;
  }

  _setupEventListeners() {
    const nodes = this.container.querySelectorAll(".level-node");
    nodes.forEach((node) => {
      node.addEventListener("click", () => {
        const level = parseInt(node.getAttribute("data-level"));
        this._startGameScene(level);
      });
    });
  }

  _startGameScene(level) {
    console.log(`[LevelSelector] Memulai GameScene level ${level}`);

    this.container.style.display = "none";
    if (this.battlefield) {
      this.battlefield.style.display = "block";
    }

    let GameClass;
    switch (level) {
      case 1:
        GameClass = GameScene1;
        break;
      case 2:
        GameClass = GameScene2;
        break;
      case 3:
        GameClass = GameScene3;
        break;
      default:
        alert(`Lantai ${level} belum tersedia.`);
        return;
    }

    const game = new GameClass(this.container, {
      onExit: () => this.start() // Kembali ke LevelSelector setelah menang
    });
    game.start();
  }
}
