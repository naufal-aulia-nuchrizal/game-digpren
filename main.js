import { MainMenu } from './screens/MainMenu.js';
import { LevelSelector } from './screens/LevelSelector.js';
import { ShopScene } from './screens/ShopScene.js';

// DOM Elements
const gameContainer = document.getElementById('game-container');
const battlefield = document.getElementById('battlefield');
const appContainer = document.getElementById('app');

// Inisialisasi diamond jika belum ada
if (!localStorage.getItem("diamond")) {
  localStorage.setItem("diamond", "10");
}

// Utility: Sembunyikan semua kontainer
function hideContainers(...containers) {
  [gameContainer, battlefield, appContainer].forEach(container => {
    if (container) container.style.display = 'none';
  });
  containers.forEach(container => {
    if (container) container.style.display = 'block';
  });
}

// Transisi ke Main Menu
function showMainMenu() {
  hideContainers(appContainer);
  const mainMenu = new MainMenu(appContainer, showLevelSelector, showShopScene);
  mainMenu.show?.();
}

// Transisi ke Level Selector
function showLevelSelector() {
  hideContainers(appContainer);
  const levelSelector = new LevelSelector("app", showLevelSelector);
  levelSelector.start?.();
}

// Transisi ke Shop Scene
function showShopScene() {
  hideContainers(appContainer);
  const shop = new ShopScene("app", showMainMenu);
  shop.show?.();
}

// Start dari Main Menu
showMainMenu();
