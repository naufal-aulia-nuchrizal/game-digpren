export default class VictoryPopup {
  constructor(onNextLevel) {
    if (typeof onNextLevel !== 'function') {
      console.warn('VictoryPopup: onNextLevel bukan fungsi.');
      return;
    }

    this.onNextLevel = onNextLevel;
    this.createPopup();
  }

  createPopup() {
    // Overlay latar belakang gelap
    this.overlay = document.createElement('div');
    this.overlay.style = `
      position: fixed;
      top: 0; left: 0;
      width: 100%; height: 100%;
      background: rgba(0, 0, 0, 0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
    `;

    // Popup container utama
    this.popup = document.createElement('div');
    this.popup.style = `
      background: linear-gradient(to bottom right, #ffffff, #ffeaa7);
      padding: 30px;
      border: 4px solid gold;
      border-radius: 20px;
      box-shadow: 0 0 25px rgba(255, 215, 0, 0.8);
      text-align: center;
      font-family: 'Trebuchet MS', sans-serif;
      color: #2d3436;
      width: 350px;
      animation: popup-fadein 0.5s ease-out;
    `;

    // Judul
    const title = document.createElement('h2');
    title.textContent = '🏆 KEMENANGAN!';
    title.style = `
      font-size: 28px;
      color: #d35400;
      margin-bottom: 10px;
      text-shadow: 1px 1px 0 #fff;
    `;

    // Deskripsi
    const desc = document.createElement('p');
    desc.textContent = 'Semua musuh telah dikalahkan. Kalian luar biasa!';
    desc.style = `
      font-size: 16px;
      margin-bottom: 20px;
    `;

    // Tombol "Lanjut"
    const nextBtn = document.createElement('button');
    nextBtn.textContent = '▶️ Lanjut Level Berikutnya';
    nextBtn.style = `
      padding: 12px 20px;
      font-size: 16px;
      border: none;
      border-radius: 10px;
      background: linear-gradient(to right, #0984e3, #74b9ff);
      color: white;
      font-weight: bold;
      cursor: pointer;
      transition: background 0.3s ease;
    `;

    nextBtn.onmouseover = () => {
      nextBtn.style.background = '#6c5ce7';
    };
    nextBtn.onmouseleave = () => {
      nextBtn.style.background = 'linear-gradient(to right, #0984e3, #74b9ff)';
    };

    nextBtn.onclick = () => {
      this.cleanup();
      this.onNextLevel();
    };

    // Susun elemen
    this.popup.appendChild(title);
    this.popup.appendChild(desc);
    this.popup.appendChild(nextBtn);
    this.overlay.appendChild(this.popup);
    document.body.appendChild(this.overlay);

    // Animasi (disisipkan ke <head>)
    this.injectStyle();
  }

  injectStyle() {
    if (!document.getElementById('victory-popup-style')) {
      const style = document.createElement('style');
      style.id = 'victory-popup-style';
      style.textContent = `
        @keyframes popup-fadein {
          from { transform: scale(0.7); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `;
      document.head.appendChild(style);
    }
  }

  cleanup() {
    if (this.overlay && this.overlay.parentNode) {
      this.overlay.remove();
    }
  }
}
