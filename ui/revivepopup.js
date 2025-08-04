// revivepopup.js
export default class RevivePopup {
  constructor(onRevive, onGiveUp, getDiamondCount, spendDiamond) {
    this.onRevive = onRevive;
    this.onGiveUp = onGiveUp;
    this.getDiamondCount = getDiamondCount;
    this.spendDiamond = spendDiamond;
    this.countdown = 10;
    this.interval = null;

    this.createPopup();
    this.startCountdown();
  }

  createPopup() {
    // Tambahkan animasi style ke <head>
    const style = document.createElement('style');
    style.textContent = `
      @keyframes popupFade {
        from { opacity: 0; transform: scale(0.8); }
        to { opacity: 1; transform: scale(1); }
      }
    `;
    document.head.appendChild(style);

    // Overlay background
    this.overlay = document.createElement('div');
    this.overlay.style = `
      position: fixed;
      top: 0; left: 0;
      width: 100%; height: 100%;
      background: rgba(0,0,0,0.7);
      display: flex; align-items: center; justify-content: center;
      z-index: 9999;
    `;

    // Popup box
    this.popup = document.createElement('div');
    this.popup.style = `
      background: #1e1e2f;
      padding: 24px;
      border-radius: 16px;
      text-align: center;
      font-family: 'Segoe UI', sans-serif;
      width: 320px;
      color: white;
      box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
      transform: scale(0.95);
      animation: popupFade 0.3s ease forwards;
    `;

    // Judul
    this.title = document.createElement('h2');
    this.title.textContent = '🔥 Semua Hero Mati! 🔥';

    // Deskripsi
    this.desc = document.createElement('p');
    this.desc.textContent = 'Gunakan 2 💎 Diamond untuk melanjutkan?';

    // Timer
    this.timer = document.createElement('p');
    this.timer.textContent = `Sisa waktu: ${this.countdown} detik`;

    // Tombol revive
    this.reviveBtn = document.createElement('button');
    this.reviveBtn.textContent = 'Gunakan Diamond (2)';
    this.reviveBtn.onclick = () => this.tryRevive();

    // Tombol give up
    this.giveUpBtn = document.createElement('button');
    this.giveUpBtn.textContent = `Menyerah (${this.countdown})`;
    this.giveUpBtn.onclick = () => this.giveUp();

    // Styling tombol
    const buttonStyle = `
      padding: 10px 20px;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-size: 16px;
      margin: 8px;
      transition: background 0.3s;
    `;
    this.reviveBtn.style = buttonStyle + `
      background-color: #4caf50;
      color: white;
    `;
    this.giveUpBtn.style = buttonStyle + `
      background-color: #f44336;
      color: white;
    `;

    // Tambahkan elemen ke dalam popup
    this.popup.appendChild(this.title);
    this.popup.appendChild(this.desc);
    this.popup.appendChild(this.timer);
    this.popup.appendChild(this.reviveBtn);
    this.popup.appendChild(this.giveUpBtn);

    // Tambahkan ke overlay dan ke body
    this.overlay.appendChild(this.popup);
    document.body.appendChild(this.overlay);
  }

  startCountdown() {
    this.interval = setInterval(() => {
      this.countdown--;
      this.timer.textContent = `Sisa waktu: ${this.countdown} detik`;
      this.giveUpBtn.textContent = `Menyerah (${this.countdown})`;
      if (this.countdown <= 0) {
        this.giveUp();
      }
    }, 1000);
  }

  tryRevive() {
    if (this.getDiamondCount() >= 2) {
      this.spendDiamond(2);
      this.cleanup();
      this.onRevive();
    } else {
      alert('💎 Diamond tidak cukup!');
    }
  }

  giveUp() {
    this.cleanup();
    this.onGiveUp();
  }

  cleanup() {
    clearInterval(this.interval);
    this.overlay.remove();
  }
}
