export class battleui {
  constructor(heroParty, boss) {
    this.heroParty = heroParty;
    this.boss = boss;
    this.uiElement = document.getElementById("ui");
    this.commandPanel = document.getElementById("commandPanel");
    this.skillMenuElement = document.getElementById("skillMenu");
    this._skillMenuActive = false;
  }

  render(currentName) {
    if (this._skillMenuActive) return;

    this.uiElement.innerHTML = `<h2>Giliran: ${currentName}</h2>`;
    this.commandPanel.innerHTML = '';
    this.skillMenuElement.innerHTML = '';

    const current = this.heroParty.getAliveMembers().find(h => h.name === currentName);
    if (!current || currentName === this.boss.name) return;

    const actions = ["Attack", "Skill", "Defend", "Run"];
    actions.forEach((action, idx) => {
      const item = document.createElement("div");
      item.className = "command-item";
      item.innerText = action;
      item.tabIndex = 0;

      item.onclick = () => this.handleAction(current, action);
      item.onmouseenter = () => {
        this.commandPanel.querySelectorAll('.command-item').forEach(e => e.classList.remove('selected'));
        item.classList.add('selected');
      };

      if (idx === 0) item.classList.add('selected');
      this.commandPanel.appendChild(item);
    });
  }

  handleAction(hero, action) {
    if (action === "Skill") {
      this.showSkillMenu(hero);
    } else {
      document.dispatchEvent(new CustomEvent("playerActionSelected", {
        detail: { hero, action }
      }));
      this.commandPanel.innerHTML = '';
    }
  }

  showSkillMenu(hero) {
    this._skillMenuActive = true;

    this.uiElement.innerHTML = `<h2>Giliran: ${hero.name}</h2>`;

    this.skillMenuElement.style.display = 'block';
    this.skillMenuElement.innerHTML = `
      <div style="display: flex; gap: 12px;">
        <div id="skillMenuList" class="skill-menu-list" style="flex:1;"></div>
        <div id="skillDesc" class="skill-desc" style="flex:1; border-left: 1px solid #444; padding-left: 10px;"></div>
      </div>
      <div style="text-align:right;margin-top:4px;">
        <button id="cancelSkillMenu">Batal</button>
      </div>
    `;

    const menuList = document.getElementById("skillMenuList");
    const descBox = document.getElementById("skillDesc");

    hero.skills.forEach((skill, idx) => {
      const skillBtn = document.createElement("div");
      skillBtn.className = "command-item";
      skillBtn.tabIndex = 0;
      skillBtn.innerHTML = `
        <span class="skill-name">${skill.name}</span>
        <span class="skill-cost">${skill.cost ?? ""}</span>
      `;

      skillBtn.onmouseenter = skillBtn.onfocus = () => {
        descBox.innerHTML = `
          <b>${skill.name}</b><br>
          ${skill.description ?? "-"}<br>
          <i>Power: ${skill.power ?? "-"}, Type: ${skill.type ?? "-"}</i>
        `;
        menuList.querySelectorAll('.command-item').forEach(e => e.classList.remove('selected'));
        skillBtn.classList.add('selected');
      };

      skillBtn.onclick = () => {
        this._skillMenuActive = false;
        this.skillMenuElement.innerHTML = '';
        this.skillMenuElement.style.display = 'none';

        document.dispatchEvent(new CustomEvent("playerSkillSelected", {
          detail: { hero, skill }
        }));
      };

      if (idx === 0) skillBtn.classList.add('selected');
      menuList.appendChild(skillBtn);
    });

    if (menuList.firstChild) menuList.firstChild.onmouseenter();

    document.getElementById("cancelSkillMenu").onclick = () => {
      this._skillMenuActive = false;
      this.skillMenuElement.innerHTML = '';
      this.skillMenuElement.style.display = 'none';
      this.render(hero.name);
    };
  }

  // ===================== TAMBAHAN BARU =====================

    createHPBarUI() {
    const ui = document.createElement("div");
    ui.id = "hp-bar-ui";
    ui.style.position = "absolute";
    ui.style.top = "50px";
    ui.style.right = "150px"; // 🟡 pojok kanan atas
    ui.style.zIndex = "999";
    ui.style.color = "white";
ui.style.textShadow = `
  -1px -1px 0 black,
   1px -1px 0 black,
  -1px  1px 0 black,
   1px  1px 0 black
`;

    ui.style.display = "flex";
    ui.style.flexDirection = "column";
    ui.style.alignItems = "flex-end";
    document.body.appendChild(ui);

    // === Hero UI ===
    this.heroParty.getAllMembers().forEach((member, i) => {
      const container = document.createElement("div");
      container.className = "hero-hp-container";
      container.style.display = "flex";
      container.style.alignItems = "center";
      container.style.marginBottom = "6px";
      container.style.gap = "8px";
      container.style.position = "relative";
      container.style.right = "825px";  // geser ke kanan
      container.style.top = "200px";   // geser ke bawah


      const nameHp = document.createElement("div");
      nameHp.innerHTML = `
        <div><b>${member.name}</b></div>
        <progress id="hp-bar-${i}" value="${member.currentHp}" max="${member.maxHp}" style="width:120px;"></progress>
        <div id="hp-text-${i}">${member.currentHp}/${member.maxHp}</div>
      `;

      const avatar = document.createElement("img");
      avatar.src = member.avatar;
      avatar.style.width = "36px";
      avatar.style.height = "36px";
      avatar.style.borderRadius = "6px";

      container.appendChild(avatar);
      container.appendChild(nameHp);
    
      ui.appendChild(container);
    });

    // === Boss UI ===
    const bossContainer = document.createElement("div");
    bossContainer.id = "boss-hp-container";
    bossContainer.style.marginTop = "200px";
    bossContainer.style.textAlign = "right";
    bossContainer.innerHTML = `
      <div><b>${this.boss.name}</b></div>
      <progress id="boss-hp-bar" value="${this.boss.currentHp}" max="${this.boss.maxHp}" style="width:180px;"></progress>
      <div id="boss-hp-text">${this.boss.currentHp}/${this.boss.maxHp}</div>
    `;
    ui.appendChild(bossContainer);
  }

  updateHPBars() {
    this.heroParty.getAllMembers().forEach((member, i) => {
      const bar = document.getElementById(`hp-bar-${i}`);
      const text = document.getElementById(`hp-text-${i}`);
      if (bar && text) {
        bar.value = member.currentHp;
        bar.max = member.maxHp;
        text.textContent = `${member.currentHp}/${member.maxHp}`;
      }
    });

    const bossBar = document.getElementById("boss-hp-bar");
    const bossText = document.getElementById("boss-hp-text");
    if (bossBar && bossText) {
      bossBar.value = this.boss.currentHp;
      bossBar.max = this.boss.maxHp;
      bossText.textContent = `${this.boss.currentHp}/${this.boss.maxHp}`;
    }
  }
}
