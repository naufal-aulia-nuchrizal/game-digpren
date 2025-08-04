export class ShopScene {
  constructor(containerId = "app", onBack) {
    this.container = document.getElementById(containerId);
    this.onBack = onBack;
  }

  getDiamond() {
    return parseInt(localStorage.getItem("diamond") || "0");
  }

  addDiamond(amount) {
  const current = this.getDiamond();
  const updated = current + amount;
  localStorage.setItem("diamond", updated);

  const hud = document.getElementById("diamond-count");
  if (hud) hud.textContent = updated;
}

  show() {
    const diamondNow = this.getDiamond();

    this.container.innerHTML = `
      <div id="shop-scene" style="
        width: 1000px;
        height: 500px;
        margin: auto;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: 'Press Start 2P', sans-serif;
        position: relative;
      ">
        <!-- DIAMOND HUD -->
        <div style="
          position: absolute;
          top: 10px;
          right: 20px;
          font-size: 12px;
          color: white;
          background-color: rgba(0,0,0,0.4);
          padding: 8px 12px;
          border: 2px solid #fff;
          border-radius: 8px;
        ">
          <img src="assets/ui/diamond.png" style="width: 16px; vertical-align: middle; margin-right: 4px;" />
          <span id="diamond-count">${diamondNow}</span>
        </div>

        <div style="
          width: 700px;
          background-color: #c98e66;
          border: 4px solid #5e3b29;
          padding: 20px;
          text-align: center;
          box-shadow: 0 0 20px #000;
        ">
          <div style="
            font-size: 20px;
            background-color: #8c4835;
            color: #fff;
            padding: 10px;
            border: 3px solid #5e3b29;
            margin-bottom: 20px;
          ">
            BUY SOMETHING!
          </div>

          <div style="display: flex; justify-content: space-between;">
            ${this.renderPackage("5 💎", "assets/ui/diamond.png", "10 Diamond\nBuat lanjut permainan", 5000, 10)}
            ${this.renderPackage("20 💎", "assets/ui/diamond.png", "50 Diamond\nBuat revive banyak", 15000, 50)}
            ${this.renderPackage("50 💎", "assets/ui/diamond.png", "100 Diamond\nPaket hemat", 30000, 100)}
          </div>

          <button id="back-to-menu" style="
            margin-top: 20px;
            background-color: #8c4835;
            color: white;
            border: 3px solid #5e3b29;
            padding: 10px 20px;
            font-size: 14px;
            cursor: pointer;
          ">EXIT</button>
        </div>
      </div>
    `;

    document.querySelectorAll(".buy-button").forEach(btn => {
  btn.addEventListener("click", () => {
    const labelDiamond = btn.getAttribute("data-diamond"); // untuk tampilan QR
    const price = btn.getAttribute("data-price");
    const realDiamond = btn.getAttribute("data-add"); // jumlah sebenarnya yang akan ditambahkan

    this.showQRCodePopup(labelDiamond, price, parseInt(realDiamond));
  });
});


    document.getElementById("back-to-menu").onclick = () => {
      if (this.onBack) this.onBack();
    };
  }

  renderPackage(label, imageSrc, desc, price, addAmount) {
    const numericLabel = label.replace(/[^\d]/g, '');
    return `
      <div style="
        background-color: #e9b67d;
        width: 200px;
        padding: 15px;
        border: 3px solid #5e3b29;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
      ">
        <img src="${imageSrc}" alt="${label}" style="width: 40px; height: 40px; margin-bottom: 10px;" />
        <div style="font-size: 14px; font-weight: bold; margin-bottom: 10px;">
          <img src="assets/ui/diamond.png" style="width: 16px; vertical-align: middle;" /> ${numericLabel}
        </div>
        <div style="font-size: 10px; margin-bottom: 10px; white-space: pre-line;">${desc}</div>
        <div style="margin-bottom: 10px;">💰 Rp${price.toLocaleString()}</div>
        <button 
          class="buy-button"
          data-diamond="${numericLabel}" 
          data-price="${price}" 
          data-add="${addAmount}"
          style="
            padding: 6px 12px;
            font-size: 12px;
            background-color: #8c4835;
            color: white;
            border: 2px solid #5e3b29;
            cursor: pointer;
          ">
          <img src="assets/ui/diamond.png" style="width: 14px; vertical-align: middle;" /> BELI
        </button>
      </div>
    `;
  }

  async showQRCodePopup(labelDiamond, price, realDiamondAmount) {
  try {
    const response = await fetch("http://localhost:3000/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        diamond: parseInt(labelDiamond),
        price: parseInt(price),
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Gagal membuat order: ${error}`);
    }

    const result = await response.json();
    const orderId = result.orderId;

    if (!orderId) {
      throw new Error("Order ID tidak ditemukan dalam respons backend.");
    }

    // Tampilkan popup QR
    const popup = document.createElement("div");
    popup.style.position = "fixed";
    popup.style.top = 0;
    popup.style.left = 0;
    popup.style.width = "100%";
    popup.style.height = "100%";
    popup.style.background = "rgba(0,0,0,0.8)";
    popup.style.display = "flex";
    popup.style.justifyContent = "center";
    popup.style.alignItems = "center";
    popup.style.zIndex = 9999;

    popup.innerHTML = `
      <div style="background: #222; padding: 20px; border-radius: 10px; text-align: center; color: white;">
        <h3>Transfer Rp${price} untuk ${labelDiamond} 💎</h3>
        <p>Scan barcode di bawah:</p>
        <img src="assets/ui/new_QR.png" style="max-width: 200px; margin: 10px;" />
        <p style="font-size: 12px;">ID Transaksi: <code>${orderId}</code></p>
        <br/>
        <button id="close-popup" style="margin-top: 10px; padding: 5px 10px;">Tutup</button>
      </div>
    `;

    document.body.appendChild(popup);

    document.getElementById("close-popup").onclick = () => {
      document.body.removeChild(popup);
    };

    // Gunakan realDiamondAmount agar jumlah diamond yang ditambahkan sesuai
    this.pollOrderStatus(orderId, realDiamondAmount);

  } catch (err) {
    alert("Terjadi kesalahan saat membuat order:\n" + err.message);
    console.error("Order gagal:", err);
  }
}



async pollOrderStatus(orderId, diamondToAdd) {
  const interval = setInterval(async () => {
    try {
      const res = await fetch(`http://localhost:3000/status/${orderId}`);
      const data = await res.json();

      console.log("Status order:", data);
      const status = data?.status || data?.order?.status;

      if (status === "confirmed") {
        console.log("ORDER CONFIRMED! Menambah diamond...");
        clearInterval(interval);
        this.addDiamond(diamondToAdd);
        alert(`Pembayaran dikonfirmasi! ${diamondToAdd} 💎 telah ditambahkan.`);
        document.getElementById("diamond-count").textContent = this.getDiamond();
      }
    } catch (err) {
      console.error("Gagal cek status:", err);
    }
  }, 3000);
}



}
