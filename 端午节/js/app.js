(function () {
  /* ============== Shared utilities ============== */
  const STORAGE_KEY = "duanwu-progress-v2";
  const state = {
    stars: 0,
    screen: "splash",
  };

  function loadProgress() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const d = JSON.parse(raw);
      state.stars = d.stars || 0;
    } catch (_) {}
  }
  function saveProgress() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ stars: state.stars }));
    document.getElementById("totalStars").textContent = state.stars;
  }
  function addStars(n) {
    state.stars += n;
    saveProgress();
    showToast(`+${n} ⭐`);
  }

  function showToast(msg) {
    const el = document.getElementById("toast");
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => el.classList.remove("show"), 1700);
  }
  function burstConfetti(intensity = 1) {
    const box = document.getElementById("confetti");
    const colors = ["#c0392b", "#27ae60", "#f39c12", "#d4ac0d", "#74b9ff", "#fd79a8"];
    const count = 40 * intensity;
    for (let i = 0; i < count; i++) {
      const p = document.createElement("div");
      p.className = "confetti-piece";
      p.style.left = Math.random() * 100 + "%";
      p.style.top = "-12px";
      p.style.background = colors[Math.floor(Math.random() * colors.length)];
      p.style.borderRadius = Math.random() > 0.5 ? "50%" : "2px";
      p.style.animationDelay = Math.random() * 0.6 + "s";
      box.appendChild(p);
      setTimeout(() => p.remove(), 2800);
    }
  }
  function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = randInt(0, i);
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  /* ============== Navigation ============== */
  function goTo(screen) {
    state.screen = screen;
    document.querySelectorAll(".screen").forEach((el) => el.classList.remove("active"));
    const target = document.getElementById("screen-" + screen);
    if (target) target.classList.add("active");
    window.scrollTo({ top: 0, behavior: "smooth" });

    if (screen === "zongzi") resetZongziGame();
    if (screen === "race") resetRace();
  }

  /* ============== SVG INGREDIENT ICONS ==============
     Each icon is a small 0..40 viewBox SVG that visually resembles the real food. */
  function svg(content, view = "0 0 40 40") {
    return `<svg viewBox="${view}" xmlns="http://www.w3.org/2000/svg" class="ing-svg">${content}</svg>`;
  }

  const INGREDIENT_ICONS = {
    // 糯米：scattered white grains
    rice: () => svg(`
      <defs><radialGradient id="g1"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#f4e9c5"/></radialGradient></defs>
      <ellipse cx="20" cy="22" rx="16" ry="14" fill="url(#g1)" stroke="#d8c896" stroke-width="1"/>
      ${[[12,18],[18,14],[24,17],[15,24],[22,26],[28,22],[10,26],[26,12]].map(([x,y]) =>
        `<ellipse cx="${x}" cy="${y}" rx="2.2" ry="1.4" fill="#fff" stroke="#bca673" stroke-width="0.4"/>`
      ).join("")}
    `),
    // 红枣：dark red wrinkly oval
    date: () => svg(`
      <defs><radialGradient id="gdate" cx="0.4" cy="0.3"><stop offset="0" stop-color="#a73224"/><stop offset="1" stop-color="#5e1810"/></radialGradient></defs>
      <ellipse cx="20" cy="22" rx="10" ry="14" fill="url(#gdate)" stroke="#3d100a" stroke-width="0.8"/>
      <path d="M 14 18 Q 20 22 26 18" stroke="#3d100a" stroke-width="0.7" fill="none" opacity="0.5"/>
      <path d="M 13 24 Q 20 28 27 24" stroke="#3d100a" stroke-width="0.7" fill="none" opacity="0.5"/>
      <line x1="20" y1="6" x2="20" y2="9" stroke="#5e3a0c" stroke-width="1.5"/>
    `),
    // 豆沙：smooth brown round
    bean: () => svg(`
      <defs><radialGradient id="gbean" cx="0.4" cy="0.35"><stop offset="0" stop-color="#a06a3f"/><stop offset="1" stop-color="#5b3819"/></radialGradient></defs>
      <circle cx="20" cy="22" r="13" fill="url(#gbean)" stroke="#3a2511" stroke-width="0.8"/>
      <ellipse cx="16" cy="17" rx="3" ry="2" fill="#bd8959" opacity="0.6"/>
    `),
    // 鲜肉：pink slab with marbling
    meat: () => svg(`
      <defs><linearGradient id="gmeat" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ef9a9e"/><stop offset="1" stop-color="#c45561"/></linearGradient></defs>
      <rect x="8" y="12" width="24" height="18" rx="4" fill="url(#gmeat)" stroke="#8e2b34" stroke-width="0.8"/>
      <path d="M 12 17 Q 20 20 28 16" stroke="#fff" stroke-width="1.5" fill="none" opacity="0.7"/>
      <path d="M 11 24 Q 18 22 30 26" stroke="#fff" stroke-width="1.2" fill="none" opacity="0.6"/>
    `),
    // 咸蛋黄：orange-yellow circle with deep yolk look
    yolk: () => svg(`
      <defs><radialGradient id="gyolk" cx="0.35" cy="0.3"><stop offset="0" stop-color="#ffdc73"/><stop offset="0.5" stop-color="#f7b500"/><stop offset="1" stop-color="#c97c00"/></radialGradient></defs>
      <circle cx="20" cy="22" r="12" fill="url(#gyolk)" stroke="#a36100" stroke-width="0.8"/>
      <ellipse cx="15" cy="17" rx="3.5" ry="2.2" fill="#ffefb0" opacity="0.7"/>
    `),
    // 蜜枣：glossy red-brown oval
    hdate: () => svg(`
      <defs><radialGradient id="ghd" cx="0.4" cy="0.25"><stop offset="0" stop-color="#d96a3f"/><stop offset="1" stop-color="#7a2b14"/></radialGradient></defs>
      <ellipse cx="20" cy="22" rx="10" ry="14" fill="url(#ghd)" stroke="#5e1a0a" stroke-width="0.8"/>
      <ellipse cx="16" cy="14" rx="3" ry="2" fill="#ffbf80" opacity="0.7"/>
      <line x1="20" y1="6" x2="20" y2="9" stroke="#5e3a0c" stroke-width="1.5"/>
    `),
    // 花生：peanut shape (two bumps)
    peanut: () => svg(`
      <defs><linearGradient id="gpea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e7c891"/><stop offset="1" stop-color="#b48a4c"/></linearGradient></defs>
      <path d="M 14 8 Q 8 14 12 18 Q 8 22 12 28 Q 14 34 20 34 Q 26 34 28 28 Q 32 22 28 18 Q 32 14 26 8 Q 20 6 14 8 Z"
            fill="url(#gpea)" stroke="#7d5a25" stroke-width="0.8"/>
      <ellipse cx="20" cy="18" rx="6" ry="1.5" fill="#7d5a25" opacity="0.4"/>
      <circle cx="16" cy="13" r="1" fill="#7d5a25" opacity="0.5"/>
      <circle cx="24" cy="13" r="1" fill="#7d5a25" opacity="0.5"/>
      <circle cx="16" cy="25" r="1" fill="#7d5a25" opacity="0.5"/>
      <circle cx="24" cy="25" r="1" fill="#7d5a25" opacity="0.5"/>
    `),
    // 红豆：small red beans clustered
    rbean: () => svg(`
      <defs><radialGradient id="grb" cx="0.4" cy="0.3"><stop offset="0" stop-color="#c8482b"/><stop offset="1" stop-color="#7a1a0c"/></radialGradient></defs>
      ${[[12,15,5,3],[22,12,5,3.2],[28,20,5,3],[14,26,5,3],[24,28,5,3],[20,21,5.5,3.5]]
        .map(([x,y,rx,ry]) =>
          `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="url(#grb)" stroke="#4a0d04" stroke-width="0.5" transform="rotate(${randInt(-30,30)} ${x} ${y})"/>`
        ).join("")}
    `),
    // 莲子：cream oval with dark center
    lotus: () => svg(`
      <defs><radialGradient id="glot" cx="0.4" cy="0.3"><stop offset="0" stop-color="#f3e9c8"/><stop offset="1" stop-color="#c2a76d"/></radialGradient></defs>
      <ellipse cx="20" cy="22" rx="11" ry="13" fill="url(#glot)" stroke="#8a6c2a" stroke-width="0.8"/>
      <ellipse cx="20" cy="22" rx="3.5" ry="2.6" fill="#5b3a14"/>
      <line x1="20" y1="22" x2="20" y2="9" stroke="#5b3a14" stroke-width="0.6"/>
    `),
    // 板栗：chestnut shape
    chest: () => svg(`
      <defs><radialGradient id="gch" cx="0.35" cy="0.3"><stop offset="0" stop-color="#a06632"/><stop offset="1" stop-color="#4a1f08"/></radialGradient></defs>
      <path d="M 8 28 Q 4 18 12 10 Q 20 4 28 10 Q 36 18 32 28 Q 28 32 20 32 Q 12 32 8 28 Z"
            fill="url(#gch)" stroke="#321405" stroke-width="0.8"/>
      <line x1="20" y1="6" x2="20" y2="11" stroke="#fff" stroke-width="1" opacity="0.7"/>
      <ellipse cx="14" cy="14" rx="3" ry="2" fill="#d1934e" opacity="0.5"/>
    `),
    // 葡萄干：dark wrinkly oval
    raisin: () => svg(`
      <defs><radialGradient id="grai" cx="0.4" cy="0.3"><stop offset="0" stop-color="#5a2b46"/><stop offset="1" stop-color="#2d1421"/></radialGradient></defs>
      <ellipse cx="20" cy="22" rx="9" ry="12" fill="url(#grai)" stroke="#1a0c14" stroke-width="0.8"/>
      <path d="M 13 18 Q 20 22 27 18" stroke="#0e0509" stroke-width="0.7" fill="none" opacity="0.6"/>
      <path d="M 13 26 Q 20 30 27 26" stroke="#0e0509" stroke-width="0.7" fill="none" opacity="0.6"/>
    `),
    // 火腿：pink/orange rectangle slice
    ham: () => svg(`
      <defs><linearGradient id="gham" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f7afa6"/><stop offset="1" stop-color="#c95d5a"/></linearGradient></defs>
      <rect x="6" y="14" width="28" height="14" rx="3" fill="url(#gham)" stroke="#86322f" stroke-width="0.8"/>
      <rect x="6" y="14" width="28" height="4" rx="2" fill="#f8c2a4" stroke="#86322f" stroke-width="0.6"/>
      <circle cx="13" cy="22" r="1.5" fill="#fff" opacity="0.7"/>
      <circle cx="27" cy="24" r="1.2" fill="#fff" opacity="0.6"/>
    `),
    // 白糖：sugar cube with sparkle
    sugar: () => svg(`
      <rect x="10" y="12" width="20" height="18" fill="#ffffff" stroke="#c8c0a8" stroke-width="1.2"/>
      <line x1="10" y1="16" x2="30" y2="16" stroke="#e6dfca" stroke-width="0.6"/>
      <line x1="10" y1="22" x2="30" y2="22" stroke="#e6dfca" stroke-width="0.6"/>
      <line x1="16" y1="12" x2="16" y2="30" stroke="#e6dfca" stroke-width="0.6"/>
      <line x1="24" y1="12" x2="24" y2="30" stroke="#e6dfca" stroke-width="0.6"/>
      <text x="11" y="11" font-size="6" fill="#f39c12">✦</text>
    `),
    // 巧克力：square chocolate piece
    choco: () => svg(`
      <defs><linearGradient id="gcho" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6e4126"/><stop offset="1" stop-color="#3a2010"/></linearGradient></defs>
      <rect x="8" y="10" width="24" height="22" rx="2" fill="url(#gcho)" stroke="#221007" stroke-width="0.8"/>
      <line x1="20" y1="10" x2="20" y2="32" stroke="#221007" stroke-width="1.2"/>
      <line x1="8" y1="21" x2="32" y2="21" stroke="#221007" stroke-width="1.2"/>
    `),
    // 辣椒：red chili pepper
    chili: () => svg(`
      <defs><linearGradient id="gch2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e74c3c"/><stop offset="1" stop-color="#8b1a10"/></linearGradient></defs>
      <path d="M 14 8 Q 16 5 19 6 L 18 10 Q 27 12 31 22 Q 33 32 22 33 Q 12 30 12 18 Q 13 12 14 8 Z"
            fill="url(#gch2)" stroke="#5a0d05" stroke-width="0.8"/>
      <path d="M 14 8 Q 18 6 22 8 L 22 11 Q 18 11 16 11 Z" fill="#27ae60" stroke="#1e8449" stroke-width="0.6"/>
    `),
  };

  /* ============== Ingredient catalog ============== */
  const INGREDIENTS = [
    { id: "rice",   name: "糯米",    tag: "主料",   tags: { rice: 1 } },
    { id: "date",   name: "红枣",    tag: "甜",     tags: { sweet: 2, classic: 1 } },
    { id: "bean",   name: "豆沙",    tag: "甜",     tags: { sweet: 2 } },
    { id: "hdate",  name: "蜜枣",    tag: "甜",     tags: { sweet: 2 } },
    { id: "peanut", name: "花生",    tag: "香",     tags: { nut: 2 } },
    { id: "rbean",  name: "红豆",    tag: "甜",     tags: { sweet: 1 } },
    { id: "lotus",  name: "莲子",    tag: "甜",     tags: { sweet: 1, nut: 1 } },
    { id: "chest",  name: "板栗",    tag: "香",     tags: { nut: 2 } },
    { id: "raisin", name: "葡萄干",  tag: "甜",     tags: { sweet: 1 } },
    { id: "meat",   name: "鲜肉",    tag: "咸",     tags: { savory: 2, meat: 2 } },
    { id: "yolk",   name: "咸蛋黄",  tag: "咸",     tags: { savory: 2, yolk: 1 } },
    { id: "ham",    name: "火腿",    tag: "咸",     tags: { savory: 1, meat: 1 } },
    { id: "sugar",  name: "白糖",    tag: "调味",   tags: { sweet: 1, bonus: 1 } },
    { id: "choco",  name: "巧克力",  tag: "创意",   tags: { quirky: 2 } },
    { id: "chili",  name: "辣椒",    tag: "重口",   tags: { quirky: 2, savory: 1 } },
  ];

  /* ============== Leaf shapes (3 variants) ============== */
  const SHAPES = [
    {
      id: "tri", name: "三角粽", desc: "最经典的三角形粽子，江南江北都流行。",
      // leaf in zg fill stage (240 viewBox)
      leaf: `<defs><linearGradient id="leafA" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#84c95e"/><stop offset="1" stop-color="#2c5e1f"/></linearGradient></defs>
        <polygon points="120,18 218,200 22,200" fill="url(#leafA)" stroke="#1c3a14" stroke-width="3"/>
        <polygon points="120,42 195,188 45,188" fill="rgba(255,255,255,0.1)"/>
        <line x1="120" y1="22" x2="120" y2="196" stroke="#1c3a14" stroke-width="1.4" opacity="0.4"/>`,
      // finished shape svg (used in pot + done)
      cooked(palette) {
        return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="cl1" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7ac15c"/><stop offset="1" stop-color="#2c5e1f"/></linearGradient>
          </defs>
          <polygon points="100,20 180,170 20,170" fill="url(#cl1)" stroke="#1c3a14" stroke-width="3"/>
          <polygon points="100,42 162,158 38,158" fill="rgba(255,255,255,0.06)"/>
          <!-- ropes wrapping -->
          <path d="M 35 100 Q 100 80 165 100" stroke="#8d5524" stroke-width="3.5" fill="none"/>
          <path d="M 50 135 Q 100 115 150 135" stroke="#8d5524" stroke-width="3.5" fill="none"/>
          <path d="M 100 24 Q 100 100 100 168" stroke="#8d5524" stroke-width="3.5" fill="none"/>
          <!-- inner glow showing filling color -->
          <ellipse cx="100" cy="120" rx="36" ry="18" fill="${palette}" opacity="0.45"/>
        </svg>`;
      }
    },
    {
      id: "long", name: "长粽", desc: "细长圆柱形，咬一口能吃好几下。",
      leaf: `<defs><linearGradient id="leafB" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#84c95e"/><stop offset="1" stop-color="#2c5e1f"/></linearGradient></defs>
        <rect x="36" y="14" width="168" height="212" rx="48" fill="url(#leafB)" stroke="#1c3a14" stroke-width="3"/>
        <rect x="50" y="32" width="140" height="178" rx="38" fill="rgba(255,255,255,0.1)"/>`,
      cooked(palette) {
        return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <defs><linearGradient id="cl2" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7ac15c"/><stop offset="1" stop-color="#2c5e1f"/></linearGradient></defs>
          <rect x="55" y="22" width="90" height="160" rx="34" fill="url(#cl2)" stroke="#1c3a14" stroke-width="3"/>
          <rect x="62" y="34" width="76" height="138" rx="28" fill="rgba(255,255,255,0.07)"/>
          <line x1="55" y1="60" x2="145" y2="60" stroke="#8d5524" stroke-width="3.5"/>
          <line x1="55" y1="100" x2="145" y2="100" stroke="#8d5524" stroke-width="3.5"/>
          <line x1="55" y1="140" x2="145" y2="140" stroke="#8d5524" stroke-width="3.5"/>
          <ellipse cx="100" cy="100" rx="22" ry="40" fill="${palette}" opacity="0.45"/>
        </svg>`;
      }
    },
    {
      id: "horn", name: "牛角粽", desc: "形如牛角，南方常见，软糯香润。",
      leaf: `<defs><linearGradient id="leafC" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#84c95e"/><stop offset="1" stop-color="#2c5e1f"/></linearGradient></defs>
        <path d="M 40 30 Q 80 12 130 30 Q 210 50 200 130 Q 175 220 100 220 Q 30 200 28 130 Q 25 60 40 30 Z" fill="url(#leafC)" stroke="#1c3a14" stroke-width="3"/>
        <path d="M 60 50 Q 110 38 160 60 Q 190 85 184 130 Q 165 200 110 200 Q 50 185 50 130 Q 50 80 60 50 Z" fill="rgba(255,255,255,0.1)"/>`,
      cooked(palette) {
        return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <defs><linearGradient id="cl3" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7ac15c"/><stop offset="1" stop-color="#2c5e1f"/></linearGradient></defs>
          <path d="M 36 36 Q 78 18 132 36 Q 184 60 174 122 Q 152 188 96 188 Q 38 168 32 122 Q 24 68 36 36 Z" fill="url(#cl3)" stroke="#1c3a14" stroke-width="3"/>
          <path d="M 36 36 Q 90 36 130 60 Q 168 90 162 130 Q 152 180 100 184" stroke="#8d5524" stroke-width="3.5" fill="none"/>
          <path d="M 50 88 Q 100 70 150 96" stroke="#8d5524" stroke-width="3.5" fill="none"/>
          <path d="M 56 140 Q 100 124 148 140" stroke="#8d5524" stroke-width="3.5" fill="none"/>
          <ellipse cx="98" cy="112" rx="34" ry="22" fill="${palette}" opacity="0.45"/>
        </svg>`;
      }
    },
  ];

  /* ============== Zongzi game state ============== */
  let zgShape = null;       // selected SHAPE
  let zgCounts = {};        // id -> count
  let zgLog = [];           // ordered list of additions (for display)

  function resetZongziGame() {
    zgShape = null;
    zgCounts = {};
    zgLog = [];
    document.getElementById("zg-shape").classList.remove("zg-step--hidden");
    document.getElementById("zg-fill").classList.add("zg-step--hidden");
    document.getElementById("zg-wrap").classList.add("zg-step--hidden");
    document.getElementById("zg-cook").classList.add("zg-step--hidden");
    document.getElementById("zg-done").classList.add("zg-step--hidden");
    renderShapeGrid();
  }

  function renderShapeGrid() {
    const grid = document.getElementById("shapeGrid");
    grid.innerHTML = "";
    SHAPES.forEach((s) => {
      const card = document.createElement("button");
      card.type = "button";
      card.className = "shape-card";
      card.innerHTML = `
        <svg viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg">${s.leaf}</svg>
        <span class="sname">${s.name}</span>
        <span class="sdesc">${s.desc}</span>
      `;
      card.onclick = () => pickShape(s);
      grid.appendChild(card);
    });
  }

  function pickShape(shape) {
    zgShape = shape;
    zgCounts = {};
    zgLog = [];
    document.getElementById("zg-shape").classList.add("zg-step--hidden");
    document.getElementById("zg-fill").classList.remove("zg-step--hidden");
    document.getElementById("leafShape").innerHTML = shape.leaf;
    renderBuffet();
    renderLeafInside();
    updateTally();
  }

  function renderBuffet() {
    const box = document.getElementById("buffet");
    box.innerHTML = "";
    INGREDIENTS.forEach((ing) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "ingredient";
      btn.dataset.id = ing.id;
      btn.innerHTML = `
        ${INGREDIENT_ICONS[ing.id]()}
        <span class="ing-name">${ing.name}</span>
        <span class="ing-tag">${ing.tag}</span>
      `;
      btn.onclick = () => addIngredient(ing);
      box.appendChild(btn);
    });
  }

  function refreshBadges() {
    document.querySelectorAll("#buffet .ingredient").forEach((btn) => {
      const id = btn.dataset.id;
      const cnt = zgCounts[id] || 0;
      let badge = btn.querySelector(".badge");
      if (cnt > 0) {
        if (!badge) {
          badge = document.createElement("span");
          badge.className = "badge";
          btn.appendChild(badge);
        }
        badge.textContent = "×" + cnt;
      } else if (badge) {
        badge.remove();
      }
    });
  }

  function addIngredient(ing) {
    zgCounts[ing.id] = (zgCounts[ing.id] || 0) + 1;
    zgLog.push(ing.id);
    renderLeafInside(true);
    refreshBadges();
    updateTally();
  }

  function renderLeafInside(animateLast) {
    const inside = document.getElementById("leafInside");
    inside.innerHTML = "";
    // Cap visible items to avoid overflow — show last 60
    const slice = zgLog.slice(-60);
    slice.forEach((id, idx) => {
      const span = document.createElement("span");
      span.className = "item";
      // Only animate the last one when freshly added
      if (!animateLast || idx !== slice.length - 1) span.style.animation = "none";
      span.innerHTML = INGREDIENT_ICONS[id]();
      inside.appendChild(span);
    });
  }

  function updateTally() {
    const tally = document.getElementById("leafTally");
    const types = Object.keys(zgCounts).length;
    const total = Object.values(zgCounts).reduce((a, b) => a + b, 0);
    const hasRice = (zgCounts.rice || 0) > 0;
    const btnWrap = document.getElementById("btnWrap");
    if (total === 0) {
      tally.textContent = "粽叶是空的…放点食材吧～";
    } else if (!hasRice) {
      tally.innerHTML = `已放 <b>${total}</b> 件 · ${types} 种，但<b style="color:#c0392b">还没放糯米</b>哦！`;
    } else {
      const names = Object.entries(zgCounts).map(([id, n]) => {
        const ing = INGREDIENTS.find((x) => x.id === id);
        return `${ing.name}×${n}`;
      }).join("、");
      tally.innerHTML = `已放 <b>${total}</b> 件 · ${types} 种：${names}`;
    }
    btnWrap.disabled = !hasRice;
    btnWrap.textContent = hasRice ? "🪢 包好 → 下锅" : "🪢 包好（先放糯米）";
  }

  function bindZongziButtons() {
    document.getElementById("btnReset").onclick = () => {
      zgCounts = {};
      zgLog = [];
      renderLeafInside();
      refreshBadges();
      updateTally();
      showToast("🗑️ 倒掉，从头再来！");
    };
    document.getElementById("btnWrap").onclick = startWrap;
    document.getElementById("btnAnother").onclick = resetZongziGame;
  }

  /* ============== Wrap animation ============== */
  function startWrap() {
    document.getElementById("zg-fill").classList.add("zg-step--hidden");
    document.getElementById("zg-wrap").classList.remove("zg-step--hidden");

    const svgEl = document.getElementById("wrapSvg");
    // Use shape's cooked SVG without ropes, then animate ropes drawing
    const palette = inferPalette();
    // Hack: render the leaf + the rope paths separately so we can animate the ropes
    const shapeId = zgShape.id;
    let leafMarkup = "", ropePaths = [];
    if (shapeId === "tri") {
      leafMarkup = `
        <defs><linearGradient id="cl1" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7ac15c"/><stop offset="1" stop-color="#2c5e1f"/></linearGradient></defs>
        <polygon points="150,30 270,250 30,250" fill="url(#cl1)" stroke="#1c3a14" stroke-width="3"/>
        <polygon points="150,60 240,232 60,232" fill="rgba(255,255,255,0.06)"/>
        <ellipse cx="150" cy="190" rx="54" ry="26" fill="${palette}" opacity="0.45"/>`;
      ropePaths = [
        "M 50 150 Q 150 130 250 150",
        "M 70 200 Q 150 180 230 200",
        "M 150 36 Q 150 140 150 250",
      ];
    } else if (shapeId === "long") {
      leafMarkup = `
        <defs><linearGradient id="cl2" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7ac15c"/><stop offset="1" stop-color="#2c5e1f"/></linearGradient></defs>
        <rect x="80" y="30" width="140" height="240" rx="50" fill="url(#cl2)" stroke="#1c3a14" stroke-width="3"/>
        <rect x="92" y="52" width="116" height="200" rx="40" fill="rgba(255,255,255,0.07)"/>
        <ellipse cx="150" cy="150" rx="32" ry="60" fill="${palette}" opacity="0.45"/>`;
      ropePaths = [
        "M 80 80 L 220 80",
        "M 80 150 L 220 150",
        "M 80 220 L 220 220",
      ];
    } else {
      leafMarkup = `
        <defs><linearGradient id="cl3" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7ac15c"/><stop offset="1" stop-color="#2c5e1f"/></linearGradient></defs>
        <path d="M 54 54 Q 116 24 200 54 Q 280 90 268 184 Q 232 280 144 280 Q 56 256 48 184 Q 36 102 54 54 Z" fill="url(#cl3)" stroke="#1c3a14" stroke-width="3"/>
        <ellipse cx="148" cy="170" rx="50" ry="34" fill="${palette}" opacity="0.45"/>`;
      ropePaths = [
        "M 60 70 Q 140 70 200 96 Q 250 122 244 196 Q 232 268 150 274",
        "M 70 130 Q 150 110 230 144",
        "M 80 210 Q 150 192 220 212",
      ];
    }

    svgEl.innerHTML = leafMarkup +
      ropePaths.map((d, i) => `<path d="${d}" stroke="#8d5524" stroke-width="6" fill="none" stroke-linecap="round" class="rope" id="rope${i}" />`).join("");

    // Animate stroke draw for each rope
    const ropes = svgEl.querySelectorAll(".rope");
    ropes.forEach((rope) => {
      const len = rope.getTotalLength();
      rope.style.strokeDasharray = len;
      rope.style.strokeDashoffset = len;
      rope.style.transition = "stroke-dashoffset 0.6s ease";
    });
    setTimeout(() => {
      ropes.forEach((rope, i) => {
        setTimeout(() => {
          rope.style.strokeDashoffset = "0";
        }, i * 400);
      });
    }, 60);

    const wrapText = document.getElementById("wrapText");
    const wrapTexts = ["麻绳一圈一圈缠上去…", "再绕一圈，捆牢一点", "最后打个结，包好啦！"];
    let i = 0;
    wrapText.textContent = wrapTexts[0];
    const tt = setInterval(() => {
      i++;
      if (i < wrapTexts.length) wrapText.textContent = wrapTexts[i];
      if (i >= wrapTexts.length) {
        clearInterval(tt);
        setTimeout(startCook, 500);
      }
    }, 700);
  }

  function inferPalette() {
    // pick filling color from the most heavily added ingredient
    let bestId = "rice";
    let bestN = 0;
    for (const [id, n] of Object.entries(zgCounts)) {
      if (id === "rice") continue; // rice itself
      if (n > bestN) { bestN = n; bestId = id; }
    }
    if (bestId === "rice") bestId = "rice";
    const palette = {
      rice: "#fff8e7",
      date: "#a73224",
      bean: "#7a5331",
      hdate: "#c97a4a",
      peanut: "#cfa467",
      rbean: "#9c2f1f",
      lotus: "#dcc591",
      chest: "#7a4622",
      raisin: "#3a1e2f",
      meat: "#d4767b",
      yolk: "#f5b921",
      ham: "#e8908a",
      sugar: "#fefcf3",
      choco: "#5b3520",
      chili: "#c0392b",
    };
    return palette[bestId] || "#fff8e7";
  }

  /* ============== Cook animation ============== */
  function startCook() {
    document.getElementById("zg-wrap").classList.add("zg-step--hidden");
    document.getElementById("zg-cook").classList.remove("zg-step--hidden");

    document.getElementById("cookZongzi").innerHTML = zgShape.cooked(inferPalette());

    const ct = document.getElementById("cookText");
    const steps = ["煮 1 分钟…", "煮 10 分钟…", "煮 30 分钟…", "煮 1 小时…", "出锅啦！🎉"];
    ct.textContent = steps[0];
    let i = 1;
    const timer = setInterval(() => {
      ct.textContent = steps[i];
      i++;
      if (i >= steps.length) {
        clearInterval(timer);
        setTimeout(finishCook, 700);
      }
    }, 700);
  }

  /* ============== Naming + result engine ============== */
  function classifyZongzi() {
    // Compute totals per tag
    const tags = { sweet: 0, savory: 0, meat: 0, yolk: 0, nut: 0, quirky: 0, classic: 0, bonus: 0 };
    let totalCount = 0;
    let types = 0;
    for (const [id, n] of Object.entries(zgCounts)) {
      const ing = INGREDIENTS.find((x) => x.id === id);
      if (!ing) continue;
      types++;
      totalCount += n;
      for (const [t, v] of Object.entries(ing.tags || {})) {
        tags[t] = (tags[t] || 0) + v * n;
      }
    }

    let name, desc, badges = [];
    if (zgCounts.choco) {
      name = "创意巧克力粽";
      desc = "你居然敢往粽子里放巧克力！独一无二，朋友圈点赞绝对多。";
      badges.push("脑洞大开 🤯");
    } else if (zgCounts.chili) {
      name = "重口辣味粽";
      desc = "辣椒粽？！这是要去四川开店的节奏！吃一口辣到跳起来。";
      badges.push("勇气可嘉 🌶️");
    } else if (tags.meat >= 2 && tags.yolk >= 1) {
      name = "蛋黄鲜肉粽";
      desc = "南方人最爱的咸口经典：蛋黄油润、咸肉香醇，配 80℃ 茶最佳。";
      badges.push("南派代表 🍙");
    } else if (tags.meat >= 2) {
      name = "鲜肉粽";
      desc = "肉香软糯，咸口的力量，咬一口下饭神器。";
      badges.push("咸口担当 🥩");
    } else if (tags.yolk >= 1 && tags.savory >= 1) {
      name = "蛋黄粽";
      desc = "金灿灿的咸蛋黄一咬流油，馅香味浓。";
      badges.push("流心金黄 🟡");
    } else if (types >= 6 && tags.sweet >= 4) {
      name = "豪华八宝粽";
      desc = "枣、豆、莲、果、栗…样样都有，是端午里最豪华的那一颗。";
      badges.push("料多实在 🍱");
    } else if (tags.sweet >= 6 && tags.nut >= 2) {
      name = "蜜枣花生粽";
      desc = "甜糯软糯，花生香脆，是奶奶最常包的味道。";
      badges.push("奶奶味儿 👵");
    } else if (zgCounts.date && tags.sweet >= 2 && types <= 3) {
      name = "红枣粽";
      desc = "经典中的经典，枣香浓郁，配一杯绿茶刚刚好。";
      badges.push("经典之选 🥮");
    } else if (zgCounts.bean && types <= 3) {
      name = "豆沙粽";
      desc = "细腻豆沙，甜而不腻，是孩子们的最爱。";
      badges.push("童年的味道 🍡");
    } else if (zgCounts.raisin && tags.sweet >= 2) {
      name = "葡萄干甜粽";
      desc = "葡萄干带来酸甜的小惊喜，每一口都不一样。";
      badges.push("酸甜跳跃 🟣");
    } else if (tags.nut >= 3 && tags.sweet >= 1) {
      name = "坚果香粽";
      desc = "板栗、花生、莲子…香味层层叠叠，越嚼越香。";
      badges.push("满口生香 🌰");
    } else if (types === 1 && zgCounts.rice) {
      name = "清水白米粽";
      desc = "只有糯米的最朴素粽子，蘸点白糖也很好吃。";
      badges.push("清淡素雅 🍚");
    } else if (zgCounts.rice && types >= 2) {
      name = "私房创意粽";
      desc = "你这套配方有点意思，世上独一份的味道！";
      badges.push("DIY 大师 ✨");
    } else {
      name = "神秘怪粽";
      desc = "好像哪里不太对…要不再加点料？";
      badges.push("???");
    }

    if (types >= 5) badges.push("料足 +1");
    if (totalCount >= 12) badges.push("分量超大");
    if (zgCounts.sugar) badges.push("加糖更香");

    // Stats: 甜度 / 咸度 / 创意 / 满足感
    const sweetness = Math.min(100, tags.sweet * 14);
    const saltiness = Math.min(100, tags.savory * 18);
    const creativity = Math.min(100, tags.quirky * 25 + Math.max(0, types - 2) * 10);
    const fullness   = Math.min(100, totalCount * 8);

    return { name, desc, badges, stats: { sweetness, saltiness, creativity, fullness }, types, totalCount };
  }

  function finishCook() {
    document.getElementById("zg-cook").classList.add("zg-step--hidden");
    document.getElementById("zg-done").classList.remove("zg-step--hidden");

    const palette = inferPalette();
    document.getElementById("doneZongzi").innerHTML = zgShape.cooked(palette);

    const cls = classifyZongzi();
    document.getElementById("doneName").textContent = `🥟 ${zgShape.name} · ${cls.name}`;
    document.getElementById("doneTags").innerHTML = cls.badges
      .map((b) => `<span class="tag">${b}</span>`).join("");
    document.getElementById("doneDesc").textContent = cls.desc;

    const stats = cls.stats;
    document.getElementById("doneStats").innerHTML = `
      <div class="stat-row">🍯 甜度 <div class="stat-bar"><div class="stat-fill" style="width:${stats.sweetness}%"></div></div></div>
      <div class="stat-row">🧂 咸度 <div class="stat-bar"><div class="stat-fill" style="width:${stats.saltiness}%"></div></div></div>
      <div class="stat-row">✨ 创意 <div class="stat-bar"><div class="stat-fill" style="width:${stats.creativity}%"></div></div></div>
      <div class="stat-row">🍙 满足 <div class="stat-bar"><div class="stat-fill" style="width:${stats.fullness}%"></div></div></div>
    `;

    // Reward stars: 2 baseline, +1 if 5+ types, +1 if quirky
    let stars = 2;
    if (cls.types >= 5) stars++;
    if (zgCounts.choco || zgCounts.chili) stars++;
    addStars(stars);
    burstConfetti();
  }

  /* ============== Race game ============== */
  const QUESTIONS = [
    // 文化
    { q: "端午节是农历几月几日？", opts: ["五月初五", "五月十五", "六月初六", "四月初四"], a: 0, lvl: 1 },
    { q: "端午节主要为了纪念哪位历史人物？", opts: ["岳飞", "屈原", "诸葛亮", "李白"], a: 1, lvl: 1 },
    { q: "端午节的传统食物是？", opts: ["月饼", "汤圆", "粽子", "饺子"], a: 2, lvl: 1 },
    { q: "粽叶常用哪种植物的叶子？", opts: ["竹叶或苇叶", "玉米叶", "桂花叶", "枫叶"], a: 0, lvl: 2 },
    { q: "端午节最具代表性的水上活动？", opts: ["放孔明灯", "划龙舟", "舞狮", "猜灯谜"], a: 1, lvl: 1 },
    { q: "屈原投江的江名是？", opts: ["长江", "汨罗江", "黄河", "钱塘江"], a: 1, lvl: 2 },
    { q: "端午门口常挂的辟邪植物有哪些？", opts: ["柳枝桃枝", "桂花玉兰", "艾草和菖蒲", "竹枝松枝"], a: 2, lvl: 1 },
    { q: "下列哪句诗写的是端午？", opts: ["千门万户曈曈日", "去年元夜时", "节分端午自谁言", "床前明月光"], a: 2, lvl: 2 },
    { q: "端午孩子手上戴的彩色绳叫？", opts: ["平安绳", "五彩绳", "红绳结", "祈福链"], a: 1, lvl: 1 },
    { q: "端午节大约在公历哪个月？", opts: ["3 月", "5 或 6 月", "8 月", "10 月"], a: 1, lvl: 1 },
    { q: "屈原是哪个时代的人？", opts: ["春秋", "战国", "汉朝", "唐朝"], a: 1, lvl: 2 },
    { q: "端午节的英文是？", opts: ["Mid-Autumn", "Spring Festival", "Dragon Boat Festival", "Lantern Festival"], a: 2, lvl: 2 },
    { q: "端午撒雄黄酒主要为了？", opts: ["增添节日气氛", "驱蚊驱蛇虫", "祭祀祖先", "保佑丰收"], a: 1, lvl: 2 },
    { q: "端午节还有哪些别名？", opts: ["端阳节、重五节", "上巳节、寒食节", "元宵节、上元节", "立夏节"], a: 0, lvl: 3 },
    { q: "屈原最著名的诗作是？", opts: ["《离骚》", "《赤壁赋》", "《琵琶行》", "《滕王阁序》"], a: 0, lvl: 3 },
    { q: "古代人投粽入江最初是为了？", opts: ["庆祝丰收", "请鱼虾不要吃屈原身体", "驱除瘟疫", "祭祀河神"], a: 1, lvl: 3 },
    { q: "广东人把划龙舟叫做？", opts: ["龙舟竞渡", "扒龙舟", "撑龙舟", "走龙舟"], a: 1, lvl: 3 },
    { q: "香囊里通常会装？", opts: ["金银财宝", "中草药 / 艾叶", "糖果", "硬币"], a: 1, lvl: 2 },
    // 数学
    { q: "一个粽子 3 元，5 个一共多少元？", opts: ["15", "12", "18", "20"], a: 0, lvl: 1 },
    { q: "一艘龙舟可乘 20 人，3 艘共能乘多少？", opts: ["50", "60", "70", "80"], a: 1, lvl: 1 },
    { q: "妈妈包了 24 个粽子，每盒装 6 个，能装几盒？", opts: ["3", "4", "5", "6"], a: 1, lvl: 1 },
    { q: "龙舟比赛 1500 米，已划 800 米，还剩多少米？", opts: ["500", "600", "700", "800"], a: 2, lvl: 2 },
    { q: "一盘粽子有 8 个，吃了 5 个，还剩几个？", opts: ["2", "3", "4", "5"], a: 1, lvl: 1 },
    { q: "妈妈泡米要 4 小时，下午 1 点开始，几点结束？", opts: ["3 点", "4 点", "5 点", "6 点"], a: 2, lvl: 2 },
    { q: "一艘龙舟桨手 20 名，鼓手 1 名，舵手 1 名，共多少人？", opts: ["20", "21", "22", "24"], a: 2, lvl: 2 },
    { q: "龙舟划 1500 米用 15 分钟，平均每分钟划多少米？", opts: ["50", "100", "150", "200"], a: 1, lvl: 2 },
    { q: "一斤糯米能包 8 个粽子，5 斤一共包多少个？", opts: ["35", "40", "45", "50"], a: 1, lvl: 2 },
    { q: "5 个粽子 32 元 vs 6 个粽子 36 元，哪个更便宜？", opts: ["5 个的", "6 个的", "一样", "无法判断"], a: 1, lvl: 3 },
    { q: "一艘龙舟载 22 人，要让 110 人坐满龙舟需要几艘？", opts: ["3", "4", "5", "6"], a: 2, lvl: 2 },
    { q: "比赛 7:30 开始 9:15 结束，比赛用了多少分钟？", opts: ["95", "100", "105", "115"], a: 2, lvl: 3 },
  ];

  const DIFF = {
    easy: { goal: 10, time: 25, cpuBase: 0.50, cpuStep: 0.02, lvls: [1, 2] },
    mid:  { goal: 12, time: 15, cpuBase: 0.55, cpuStep: 0.03, lvls: [1, 2, 3] },
    hard: { goal: 15, time: 10, cpuBase: 0.62, cpuStep: 0.04, lvls: [2, 3] },
  };

  let raceState = null;

  function resetRace() {
    document.getElementById("rc-pick").classList.remove("race-step--hidden");
    document.getElementById("rc-race").classList.add("race-step--hidden");
    document.getElementById("rc-result").classList.add("race-step--hidden");
  }

  function bindRace() {
    document.querySelectorAll("#rc-pick .diff-card").forEach((card) => {
      card.onclick = () => startRace(card.dataset.diff);
    });
    document.getElementById("btnRaceAgain").onclick = resetRace;
  }

  function startRace(diffKey) {
    const cfg = DIFF[diffKey];
    raceState = {
      diff: diffKey,
      cfg,
      pos: 0, cpu: 0, goal: cfg.goal,
      qIdx: 0,
      correctCount: 0,
      wrongCount: 0,
      streak: 0,
      cpuRate: cfg.cpuBase,
      timerId: null,
      timeLeft: cfg.time,
      finished: false,
      pool: shuffle(QUESTIONS.filter((q) => cfg.lvls.includes(q.lvl))),
    };
    document.getElementById("rc-pick").classList.add("race-step--hidden");
    document.getElementById("rc-result").classList.add("race-step--hidden");
    document.getElementById("rc-race").classList.remove("race-step--hidden");

    const titleMap = { easy: "新手村", mid: "进阶赛", hard: "大师赛" };
    document.getElementById("raceStatus").textContent = `当前难度：${titleMap[diffKey]} · 终点 ${cfg.goal} 格 · 每题 ${cfg.time} 秒`;

    renderTracks();
    nextQuestion();
  }

  function renderTracks() {
    const goal = raceState.goal;
    const tp = document.getElementById("trackPlayer");
    const tc = document.getElementById("trackCpu");
    tp.innerHTML = ""; tc.innerHTML = "";
    tp.style.gridTemplateColumns = `repeat(${goal + 1}, 1fr)`;
    tc.style.gridTemplateColumns = `repeat(${goal + 1}, 1fr)`;
    for (let i = 0; i <= goal; i++) {
      const cellP = document.createElement("div");
      cellP.className = "lane-cell" + (i === goal ? " finish" : "");
      cellP.textContent = i === goal ? "🏁" : (i === 0 ? "起" : "");
      tp.appendChild(cellP);

      const cellC = document.createElement("div");
      cellC.className = "lane-cell" + (i === goal ? " finish" : "");
      cellC.textContent = i === goal ? "🏁" : (i === 0 ? "起" : "");
      tc.appendChild(cellC);
    }
    const pBoat = document.createElement("div");
    pBoat.className = "lane-boat";
    pBoat.id = "playerBoat";
    pBoat.textContent = "🛶";
    tp.appendChild(pBoat);

    const cBoat = document.createElement("div");
    cBoat.className = "lane-boat";
    cBoat.id = "cpuBoat";
    cBoat.textContent = "🛶";
    tc.appendChild(cBoat);

    updateBoats();
  }

  function updateBoats() {
    const pct = (n) => `calc(${(n / raceState.goal) * 100}% - 1.1rem)`;
    const pb = document.getElementById("playerBoat");
    const cb = document.getElementById("cpuBoat");
    if (pb) pb.style.left = pct(raceState.pos);
    if (cb) cb.style.left = pct(raceState.cpu);
  }

  function nextQuestion() {
    if (raceState.finished) return;
    if (raceState.qIdx >= raceState.pool.length) {
      raceState.pool = raceState.pool.concat(shuffle(QUESTIONS.filter((q) => raceState.cfg.lvls.includes(q.lvl))));
    }
    const q = raceState.pool[raceState.qIdx];
    document.getElementById("quizProgress").textContent =
      `第 ${raceState.qIdx + 1} 题 · 你 ${raceState.pos}/${raceState.goal} · 对手 ${raceState.cpu}/${raceState.goal}`;
    document.getElementById("quizStreak").textContent =
      raceState.streak >= 2 ? `🔥 连对 ${raceState.streak}！` : "";
    document.getElementById("quizQuestion").textContent = q.q;
    document.getElementById("quizFeedback").textContent = "";
    document.getElementById("quizFeedback").className = "quiz-feedback";

    const box = document.getElementById("quizOptions");
    box.innerHTML = "";
    q.opts.forEach((text, idx) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "quiz-opt";
      btn.textContent = text;
      btn.onclick = () => handleAnswer(idx === q.a, btn);
      box.appendChild(btn);
    });

    // Start timer
    raceState.timeLeft = raceState.cfg.time;
    const fill = document.getElementById("timerFill");
    fill.style.width = "100%";
    fill.classList.remove("urgent");
    updateTimerDisplay();
    clearInterval(raceState.timerId);
    raceState.timerId = setInterval(tickTimer, 100);
  }

  function tickTimer() {
    raceState.timeLeft -= 0.1;
    if (raceState.timeLeft <= 0) {
      raceState.timeLeft = 0;
      clearInterval(raceState.timerId);
      onTimeout();
      return;
    }
    updateTimerDisplay();
  }

  function updTimerVisual() {
    const fill = document.getElementById("timerFill");
    const pct = (raceState.timeLeft / raceState.cfg.time) * 100;
    fill.style.width = pct + "%";
    if (pct < 30) fill.classList.add("urgent"); else fill.classList.remove("urgent");
  }
  function updateTimerDisplay() {
    document.getElementById("quizTimer").textContent = "⏱️ " + Math.max(0, raceState.timeLeft).toFixed(1).replace(/\.0$/, "");
    updTimerVisual();
  }

  function onTimeout() {
    document.querySelectorAll("#quizOptions .quiz-opt").forEach((b) => (b.disabled = true));
    const q = raceState.pool[raceState.qIdx];
    document.querySelectorAll("#quizOptions .quiz-opt")[q.a].classList.add("correct");
    const fb = document.getElementById("quizFeedback");
    fb.textContent = "⏰ 超时！原地等待，下一题加油~";
    fb.classList.add("bad");
    raceState.streak = 0;
    raceState.wrongCount++;
    cpuTurn();
    raceState.qIdx++;
    setTimeout(advanceRound, 1100);
  }

  function handleAnswer(correct, btn) {
    clearInterval(raceState.timerId);
    document.querySelectorAll("#quizOptions .quiz-opt").forEach((b) => (b.disabled = true));
    const fb = document.getElementById("quizFeedback");
    if (correct) {
      btn.classList.add("correct");
      raceState.correctCount++;
      raceState.streak++;
      raceState.cpuRate = Math.min(0.95, raceState.cpuRate + raceState.cfg.cpuStep);
      let step = 1;
      if (raceState.streak >= 3) {
        step = 2;
        raceState.streak = 0; // reset to require new streak for next boost
        fb.textContent = `🚀 连对加速！前进 2 格！`;
        const pb = document.getElementById("playerBoat");
        pb.classList.add("boost");
        setTimeout(() => pb.classList.remove("boost"), 600);
      } else {
        fb.textContent = "🎯 答对了！前进一步～";
      }
      fb.classList.add("ok");
      raceState.pos = Math.min(raceState.goal, raceState.pos + step);
    } else {
      btn.classList.add("wrong");
      const q = raceState.pool[raceState.qIdx];
      document.querySelectorAll("#quizOptions .quiz-opt")[q.a].classList.add("correct");
      raceState.wrongCount++;
      raceState.streak = 0;
      raceState.cpuRate = Math.max(raceState.cfg.cpuBase, raceState.cpuRate - raceState.cfg.cpuStep / 2);
      fb.textContent = "❌ 答错了，看看正确答案。";
      fb.classList.add("bad");
    }
    cpuTurn();
    updateBoats();
    raceState.qIdx++;
    setTimeout(advanceRound, 1100);
  }

  function cpuTurn() {
    if (Math.random() < raceState.cpuRate) {
      raceState.cpu = Math.min(raceState.goal, raceState.cpu + 1);
      const cb = document.getElementById("cpuBoat");
      cb.classList.add("boost");
      setTimeout(() => cb.classList.remove("boost"), 600);
    }
  }

  function advanceRound() {
    updateBoats();
    if (raceState.pos >= raceState.goal || raceState.cpu >= raceState.goal) {
      finishRace();
    } else {
      nextQuestion();
    }
  }

  function finishRace() {
    raceState.finished = true;
    clearInterval(raceState.timerId);
    document.getElementById("rc-race").classList.add("race-step--hidden");
    document.getElementById("rc-result").classList.remove("race-step--hidden");

    const icon = document.getElementById("resultIcon");
    const title = document.getElementById("resultTitle");
    const text = document.getElementById("resultText");
    const stats = document.getElementById("resultStats");

    const playerWin = raceState.pos >= raceState.goal;
    const cpuWin = raceState.cpu >= raceState.goal;

    let stars = 0;
    if (playerWin && cpuWin) {
      icon.textContent = "🏆🚩";
      title.textContent = "并驾齐驱！平局～";
      text.textContent = "两支龙舟同时冲过终点，平分秋色！";
      stars = 2;
    } else if (playerWin) {
      icon.textContent = "🏆";
      title.textContent = "夺冠啦！🎉";
      text.textContent = `难度「${ {easy:"新手村",mid:"进阶赛",hard:"大师赛"}[raceState.diff] }」夺冠，奖你一座金杯！`;
      stars = raceState.diff === "hard" ? 5 : raceState.diff === "mid" ? 3 : 2;
      burstConfetti(2);
    } else {
      icon.textContent = "🚩";
      title.textContent = "对手率先冲线，再加油！";
      text.textContent = "送你一面 🚩 安慰旗，下次一定夺冠！";
      stars = 1;
    }
    addStars(stars);

    stats.innerHTML = `
      <div class="item">已答 <b>${raceState.qIdx}</b></div>
      <div class="item">答对 <b style="color:#27ae60">${raceState.correctCount}</b></div>
      <div class="item">答错/超时 <b style="color:#c0392b">${raceState.wrongCount}</b></div>
      <div class="item">你 <b>${raceState.pos}</b>/${raceState.goal}</div>
      <div class="item">对手 <b>${raceState.cpu}</b>/${raceState.goal}</div>
    `;
  }

  /* ============== Init ============== */
  function init() {
    loadProgress();
    document.getElementById("totalStars").textContent = state.stars;
    document.body.addEventListener("click", (e) => {
      const go = e.target.closest("[data-go]");
      if (go) goTo(go.dataset.go);
    });
    bindZongziButtons();
    bindRace();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
