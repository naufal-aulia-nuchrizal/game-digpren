import { GameScene1 } from '../screens/GameScene1.js';
import { GameScene2 } from '../screens/GameScene2.js';
import { GameScene3 } from '../screens/GameScene3.js';

const scenes = [GameScene1, GameScene2, GameScene3];

class LevelManager {
  constructor() {
    this.currentLevel = 0;
  }

  getCurrentSceneClass() {
  if (this.currentLevel >= scenes.length) {
    console.log("[LEVELMANAGER] Semua level selesai");
    return null;
  }
  return scenes[this.currentLevel];
}


  goToNextScene() {
    this.currentLevel++;
    console.log('[LEVELMANAGER] goToNextScene:', this.currentLevel);
    // Tidak perlu loadCurrentScene di sini
  }

  setLevel(levelIndex) {
    if (levelIndex >= 1 && levelIndex <= scenes.length) {
      this.currentLevel = levelIndex - 1;
    }
  }

  reset() {
    this.currentLevel = 0;
    console.log('[LEVELMANAGER] reset');
  }
}

export const levelManager = new LevelManager();