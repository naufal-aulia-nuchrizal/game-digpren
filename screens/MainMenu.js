export class MainMenu {
  constructor(container, onStartClicked, onShopClicked) {
    this.container = container;
    this.onStartClicked = onStartClicked; // Fungsi untuk buka LevelSelector
    this.onShopClicked = onShopClicked;   // Fungsi untuk buka Shop
  }

  show() {
    // Sembunyikan elemen-elemen game agar tidak tumpang tindih
    const battlefield = document.getElementById("battlefield");
    const ui = document.getElementById("ui");
    const skillMenu = document.getElementById("skillMenu");
    const title = document.querySelector("h1");

    if (battlefield) battlefield.style.display = "none";
    if (ui) ui.style.display = "none";
    if (skillMenu) skillMenu.style.display = "none";
    if (title) title.style.display = "none";

    // Tampilkan elemen Main Menu
    this.container.innerHTML = `
  <div id="main-menu" style="
    width: 1000px;
    height: 500px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: black;
    overflow: hidden;
    
    margin: 50px auto;
    position: relative;
    transition: transform 0.8s ease-in-out;
  ">
    <!-- Background -->
    <img src="assets/ui/background1.jpg" 
         class="moving-bg" 
         style="position: absolute; width: 100%; height: 100%; object-fit: cover; z-index: 0;" />

    <!-- Logo -->
    <img src="assets/ui/nama_logo.png" 
         alt="Logo Game"
         class="logo-animated"
         style="z-index: 1; max-width: 350px; margin-bottom: -150px;" />

    <!-- Tombol Start -->
    <img id="start-btn" 
         src="assets/ui/start.png" 
         alt="Start"
         class="menu-button"
         style="z-index: 1; max-width: 100px; margin: 100px 0 20px 0; cursor: pointer;" />

    <!-- Tombol Toko -->
    <img id="shop-btn" 
         src="assets/ui/toko.png" 
         alt="Toko"
         class="menu-button"
         style="z-index: 1; max-width: 100px; margin-top: -50px; cursor: pointer;" />
  </div>
`;


    document.getElementById("start-btn").onclick = () => {
  const menu = document.getElementById("main-menu");
  menu.classList.add("slide-left");

  setTimeout(() => {
    this.hide();
    if (typeof this.onStartClicked === "function") this.onStartClicked();
  }, 800); // tunggu animasi selesai
};

document.getElementById("shop-btn").onclick = () => {
  alert("Toko masih dalam pengembangan.");
  const menu = document.getElementById("main-menu");
  menu.classList.add("slide-left");

  setTimeout(() => {
    this.hide();
    if (typeof this.onShopClicked === "function") this.onShopClicked();
  }, 800);
};
  }

  hide() {
    this.container.innerHTML = '';
  }
}
