(function () {
  const STORAGE_KEY = "math-grade5-progress";

  const state = {
    stars: 0,
    completed: new Set(),
    currentPage: "home",
  };

  function loadProgress() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const data = JSON.parse(raw);
      state.stars = data.stars || 0;
      state.completed = new Set(data.completed || []);
    } catch (_) {}
  }

  function saveProgress() {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ stars: state.stars, completed: [...state.completed] })
    );
    document.getElementById("totalStars").textContent = state.stars;
  }

  function addStars(n) {
    state.stars += n;
    saveProgress();
    showToast(`太棒了！+${n} ⭐`);
    burstConfetti();
  }

  function markComplete(id) {
    if (!state.completed.has(id)) {
      state.completed.add(id);
      saveProgress();
      renderNav();
    }
  }

  function showToast(msg) {
    const el = document.getElementById("toast");
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => el.classList.remove("show"), 2200);
  }

  function burstConfetti() {
    const box = document.getElementById("confetti");
    const colors = ["#e17055", "#fdcb6e", "#ff7675", "#a29bfe", "#74b9ff"];
    for (let i = 0; i < 40; i++) {
      const p = document.createElement("div");
      p.className = "confetti-piece";
      p.style.left = Math.random() * 100 + "%";
      p.style.top = "-10px";
      p.style.background = colors[Math.floor(Math.random() * colors.length)];
      p.style.borderRadius = Math.random() > 0.5 ? "50%" : "2px";
      p.style.animationDelay = Math.random() * 0.5 + "s";
      box.appendChild(p);
      setTimeout(() => p.remove(), 2600);
    }
  }

  function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function pick(arr, n) {
    const copy = [...arr];
    const out = [];
    for (let i = 0; i < n && copy.length; i++) {
      const idx = randInt(0, copy.length - 1);
      out.push(copy.splice(idx, 1)[0]);
    }
    return out;
  }

  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = randInt(0, i);
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function gcd(a, b) { return b === 0 ? a : gcd(b, a % b); }
  function lcm(a, b) { return (a * b) / gcd(a, b); }
  function isPrime(n) {
    if (n < 2) return false;
    if (n === 2) return true;
    if (n % 2 === 0) return false;
    for (let i = 3; i * i <= n; i += 2) if (n % i === 0) return false;
    return true;
  }

  function renderNav() {
    const nav = document.getElementById("nav");
    nav.innerHTML = LESSONS.map(
      (l) => `
      <button type="button" class="nav-item ${state.currentPage === l.id ? "active" : ""} ${state.completed.has(l.id) ? "done" : ""}"
        data-go="${l.id}">
        <span class="emoji">${l.emoji}</span>
        ${l.title}
      </button>`
    ).join("");
    nav.innerHTML +=
      '<button type="button" class="nav-item" data-go="home"><span class="emoji">🏠</span>首页</button>';
  }

  function renderHomeCards() {
    const grid = document.getElementById("homeCards");
    grid.innerHTML = LESSONS.map(
      (l) => `
      <article class="topic-card" data-go="${l.id}">
        <span class="icon">${l.emoji}</span>
        <h3>${l.title}</h3>
        <p>${l.desc}</p>
      </article>`
    ).join("");
  }

  function goTo(pageId) {
    state.currentPage = pageId;
    document.querySelectorAll(".page").forEach((p) => p.classList.remove("active"));
    const home = document.getElementById("page-home");
    const existing = document.getElementById("page-" + pageId);
    if (pageId === "home") {
      home.classList.add("active");
    } else {
      home.classList.remove("active");
      if (existing) existing.remove();
      const page = document.createElement("section");
      page.className = "page active";
      page.id = "page-" + pageId;
      document.getElementById("main").appendChild(page);
      renderLesson(pageId, page);
    }
    renderNav();
    closeSidebar();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function closeSidebar() {
    document.getElementById("sidebar").classList.remove("open");
    const ov = document.querySelector(".overlay");
    if (ov) ov.classList.remove("show");
  }

  function lessonShell(lesson) {
    return `
      <div class="lesson-header">
        <h2>${lesson.emoji} ${lesson.title}</h2>
        <p>${lesson.desc}</p>
        <p style="margin-top:12px;font-size:15px;color:#636e72">💡 ${lesson.tip}</p>
      </div>
    `;
  }

  function feedbackEl(id) { return `<div class="feedback" id="${id}"></div>`; }

  function showFeedback(id, ok, text) {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = text;
    el.className = "feedback show " + (ok ? "success" : "error");
  }

  function approxEqual(a, b, eps = 0.005) {
    return Math.abs(a - b) < eps;
  }

  function renderLesson(id, container) {
    const lesson = LESSONS.find((l) => l.id === id);
    if (!lesson) return;
    const renderers = {
      decMul: renderDecMul,
      decDiv: renderDecDiv,
      position: renderPosition,
      equation: renderEquation,
      polyArea: renderPolyArea,
      tree: renderTree,
      chance5: renderChance5,
      factor: renderFactor,
      divFeat: renderDivFeat,
      prime: renderPrime,
      volume: renderVolume,
      fracMean: renderFracMean,
      reduceCommon: renderReduceCommon,
      fracAddSub: renderFracAddSub,
      lineChart5: renderLineChart5,
      defective: renderDefective,
    };
    renderers[id]?.(lesson, container);
  }

  /* --- 小数乘法 --- */
  function renderDecMul(lesson, container) {
    let score = 0;
    const total = 8;
    let current = null;

    function gen() {
      const a10 = randInt(11, 99); // 0.11~9.9
      const b10 = randInt(11, 99);
      const a = a10 / 10;
      const b = b10 / 10;
      const prod = +(a * b).toFixed(2);
      return { text: `${a.toFixed(1)} × ${b.toFixed(1)}`, ans: prod };
    }

    function draw() {
      current = gen();
      const pct = (score / total) * 100;
      container.innerHTML =
        lessonShell(lesson) +
        `<div class="panel">
          <h3>小数乘法 (${score}/${total})</h3>
          <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
          <div class="quiz-display">${current.text} = ?</div>
          <p style="text-align:center;color:#636e72;font-size:14px">两个因数共有 2 位小数，积也保留 2 位小数（末尾 0 可省略）</p>
          <input type="number" step="0.01" class="answer-input" id="ansDm" inputmode="decimal" placeholder="?" />
          <div class="btn-group" style="justify-content:center">
            <button type="button" class="btn btn-primary" id="btnDm">提交</button>
          </div>
          ${feedbackEl("fb-dm")}
        </div>`;
      const input = document.getElementById("ansDm");
      input.focus();
      function submit() {
        const val = parseFloat(input.value);
        if (approxEqual(val, current.ans)) {
          score++;
          showFeedback("fb-dm", true, "正确！");
          if (score >= total) {
            addStars(3);
            markComplete("decMul");
            return;
          }
          setTimeout(draw, 800);
        } else {
          showFeedback("fb-dm", false, `${current.text} = ${current.ans}`);
        }
      }
      document.getElementById("btnDm").onclick = submit;
      input.onkeydown = (e) => { if (e.key === "Enter") submit(); };
    }
    draw();
  }

  /* --- 小数除法 --- */
  function renderDecDiv(lesson, container) {
    let score = 0;
    const total = 6;
    let current = null;

    function gen() {
      // 小数 ÷ 小数：a/b 整除
      const q10 = randInt(20, 90); // 商 2.0~9.0 (×0.1)
      const b10 = randInt(2, 9); // 除数 0.2~0.9
      const a = +((q10 / 10) * (b10 / 10)).toFixed(2);
      const b = b10 / 10;
      const q = q10 / 10;
      return { text: `${a} ÷ ${b}`, ans: +q.toFixed(2), a, b, q };
    }

    function draw() {
      current = gen();
      const pct = (score / total) * 100;
      container.innerHTML =
        lessonShell(lesson) +
        `<div class="panel">
          <h3>小数除法 (${score}/${total})</h3>
          <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
          <div class="quiz-display">${current.text} = ?</div>
          <p style="text-align:center;color:#636e72;font-size:14px">除数小数点向右移到整数，被除数同样移动；不够位用 0 补</p>
          <input type="number" step="0.01" class="answer-input" id="ansDd" inputmode="decimal" placeholder="?" />
          <div class="btn-group" style="justify-content:center">
            <button type="button" class="btn btn-primary" id="btnDd">提交</button>
          </div>
          ${feedbackEl("fb-dd")}
        </div>`;
      const input = document.getElementById("ansDd");
      input.focus();
      function submit() {
        const val = parseFloat(input.value);
        if (approxEqual(val, current.ans)) {
          score++;
          showFeedback("fb-dd", true, "正确！");
          if (score >= total) {
            addStars(3);
            markComplete("decDiv");
            return;
          }
          setTimeout(draw, 800);
        } else {
          showFeedback("fb-dd", false, `${current.text} = ${current.ans}`);
        }
      }
      document.getElementById("btnDd").onclick = submit;
      input.onkeydown = (e) => { if (e.key === "Enter") submit(); };
    }
    draw();
  }

  /* --- 位置（数对） --- */
  function renderPosition(lesson, container) {
    let round = 0;
    const total = 6;

    function newRound() {
      const mode = randInt(0, 1);
      const col = randInt(1, 6);
      const row = randInt(1, 6);
      const pct = (round / total) * 100;

      // Build SVG grid 7×7 with one mark
      const size = 36;
      const w = size * 7;
      const h = size * 7;
      let grid = `<svg class="coord-svg" width="${w + 30}" height="${h + 30}" viewBox="0 0 ${w + 30} ${h + 30}">`;
      // gridlines
      for (let i = 0; i <= 6; i++) {
        grid += `<line x1="${20 + i * size}" y1="20" x2="${20 + i * size}" y2="${20 + h}" stroke="#f1e3da" stroke-width="1" />`;
        grid += `<line x1="20" y1="${20 + i * size}" x2="${20 + w}" y2="${20 + i * size}" stroke="#f1e3da" stroke-width="1" />`;
      }
      // labels (列从1开始向右，行从1开始向下)
      for (let i = 1; i <= 6; i++) {
        grid += `<text x="${20 + i * size}" y="${h + 25}" text-anchor="middle" font-size="12" fill="#636e72">${i}</text>`;
        grid += `<text x="14" y="${20 + (7 - i) * size + 4}" text-anchor="end" font-size="12" fill="#636e72">${i}</text>`;
      }
      // mark (col, row) — row counted from bottom
      const cx = 20 + col * size;
      const cy = 20 + (7 - row) * size;
      grid += `<circle cx="${cx}" cy="${cy}" r="10" fill="#e17055" />`;
      grid += `<text x="${cx}" y="${cy + 5}" text-anchor="middle" font-family="ZCOOL KuaiLe" font-size="14" fill="#fff">★</text>`;
      grid += "</svg>";

      if (mode === 0) {
        // 看图写数对
        container.innerHTML =
          lessonShell(lesson) +
          `<div class="panel">
            <h3>看图写数对 (${round}/${total})</h3>
            <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
            <p style="text-align:center;color:#636e72">★ 点的位置可以用数对（列，行）表示</p>
            ${grid}
            <div class="dual-input">
              <label>列 <input type="number" class="answer-input answer-input--sm" id="posC" inputmode="numeric" /></label>
              <label>行 <input type="number" class="answer-input answer-input--sm" id="posR" inputmode="numeric" /></label>
            </div>
            <div class="btn-group" style="justify-content:center">
              <button type="button" class="btn btn-primary" id="btnPos">提交</button>
            </div>
            ${feedbackEl("fb-pos")}
          </div>`;
        document.getElementById("posC").focus();
        document.getElementById("btnPos").onclick = () => {
          const c = parseInt(document.getElementById("posC").value, 10);
          const r = parseInt(document.getElementById("posR").value, 10);
          if (c === col && r === row) {
            showFeedback("fb-pos", true, `对了！数对是 (${col}, ${row})。`);
            round++;
            if (round >= total) { addStars(2); markComplete("position"); return; }
            setTimeout(newRound, 1200);
          } else {
            showFeedback("fb-pos", false, `先看列（${col}），再看行（${row}）。`);
          }
        };
      } else {
        // 给数对找位置 — 改成给数对求横纵坐标
        const targetCol = randInt(1, 6);
        const targetRow = randInt(1, 6);
        // recreate grid without mark, then mark target via SVG
        let g2 = `<svg class="coord-svg" width="${w + 30}" height="${h + 30}" viewBox="0 0 ${w + 30} ${h + 30}">`;
        for (let i = 0; i <= 6; i++) {
          g2 += `<line x1="${20 + i * size}" y1="20" x2="${20 + i * size}" y2="${20 + h}" stroke="#f1e3da" stroke-width="1" />`;
          g2 += `<line x1="20" y1="${20 + i * size}" x2="${20 + w}" y2="${20 + i * size}" stroke="#f1e3da" stroke-width="1" />`;
        }
        for (let i = 1; i <= 6; i++) {
          g2 += `<text x="${20 + i * size}" y="${h + 25}" text-anchor="middle" font-size="12" fill="#636e72">${i}</text>`;
          g2 += `<text x="14" y="${20 + (7 - i) * size + 4}" text-anchor="end" font-size="12" fill="#636e72">${i}</text>`;
        }
        // Multiple marks: target + 3 distractors
        const positions = [{ c: targetCol, r: targetRow, label: "A", correct: true }];
        const used = new Set([`${targetCol},${targetRow}`]);
        while (positions.length < 4) {
          const c = randInt(1, 6);
          const r = randInt(1, 6);
          if (used.has(`${c},${r}`)) continue;
          used.add(`${c},${r}`);
          positions.push({ c, r, label: ["B", "C", "D"][positions.length - 1], correct: false });
        }
        const colors = { A: "#e17055", B: "#74b9ff", C: "#00b894", D: "#a29bfe" };
        positions.forEach((p) => {
          const px = 20 + p.c * size;
          const py = 20 + (7 - p.r) * size;
          g2 += `<circle cx="${px}" cy="${py}" r="11" fill="${colors[p.label]}" />`;
          g2 += `<text x="${px}" y="${py + 5}" text-anchor="middle" font-family="ZCOOL KuaiLe" font-size="14" fill="#fff">${p.label}</text>`;
        });
        g2 += "</svg>";
        container.innerHTML =
          lessonShell(lesson) +
          `<div class="panel">
            <h3>哪个点的数对是 (${targetCol}, ${targetRow})？(${round}/${total})</h3>
            <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
            ${g2}
            <div class="pattern-options" id="posOpts"></div>
            ${feedbackEl("fb-pos")}
          </div>`;
        shuffle(positions.map((p) => p.label)).forEach((lb) => {
          const btn = document.createElement("button");
          btn.type = "button";
          btn.className = "pattern-opt";
          btn.textContent = lb;
          btn.onclick = () => {
            const p = positions.find((x) => x.label === lb);
            if (p.correct) {
              btn.classList.add("correct");
              showFeedback("fb-pos", true, `对了！${lb} 的数对是 (${targetCol}, ${targetRow})。`);
              round++;
              if (round >= total) { addStars(2); markComplete("position"); return; }
              setTimeout(newRound, 1200);
            } else {
              btn.classList.add("wrong");
              showFeedback("fb-pos", false, "列在下面横轴，行在左侧纵轴。");
            }
          };
          document.getElementById("posOpts").appendChild(btn);
        });
      }
    }
    newRound();
  }

  /* --- 简易方程 --- */
  function renderEquation(lesson, container) {
    let score = 0;
    const total = 6;
    let current = null;

    function gen() {
      const type = randInt(0, 3);
      let display, ans;
      if (type === 0) {
        // x + a = b
        const x = randInt(2, 20);
        const a = randInt(1, 30);
        display = `x + ${a} = ${x + a}`;
        ans = x;
      } else if (type === 1) {
        // x - a = b
        const a = randInt(1, 20);
        const x = randInt(a + 1, a + 30);
        display = `x − ${a} = ${x - a}`;
        ans = x;
      } else if (type === 2) {
        // a*x = b
        const a = randInt(2, 9);
        const x = randInt(2, 12);
        display = `${a}x = ${a * x}`;
        ans = x;
      } else {
        // x / a = b
        const a = randInt(2, 9);
        const x = a * randInt(2, 12);
        display = `x ÷ ${a} = ${x / a}`;
        ans = x;
      }
      return { display, ans };
    }

    function draw() {
      current = gen();
      const pct = (score / total) * 100;
      container.innerHTML =
        lessonShell(lesson) +
        `<div class="panel">
          <h3>解方程 (${score}/${total})</h3>
          <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
          <div class="eq-form">${current.display}</div>
          <p style="text-align:center;color:#636e72;font-size:14px">利用等式性质两边同时做同一种运算</p>
          <div class="eq-form"><span class="ans-x">x = <input type="number" id="ansEq" inputmode="numeric" /></span></div>
          <div class="btn-group" style="justify-content:center">
            <button type="button" class="btn btn-primary" id="btnEq">提交</button>
          </div>
          ${feedbackEl("fb-eq")}
        </div>`;
      const input = document.getElementById("ansEq");
      input.focus();
      function submit() {
        const val = parseInt(input.value, 10);
        if (val === current.ans) {
          score++;
          showFeedback("fb-eq", true, `对了！x = ${current.ans}`);
          if (score >= total) { addStars(3); markComplete("equation"); return; }
          setTimeout(draw, 900);
        } else {
          showFeedback("fb-eq", false, `把 x 单独留在等号左边，答案 x = ${current.ans}。`);
        }
      }
      document.getElementById("btnEq").onclick = submit;
      input.onkeydown = (e) => { if (e.key === "Enter") submit(); };
    }
    draw();
  }

  /* --- 多边形面积 --- */
  function renderPolyArea(lesson, container) {
    let round = 0;
    const total = 6;

    function newRound() {
      const types = ["par", "tri", "tra"];
      const t = types[randInt(0, 2)];
      const pct = (round / total) * 100;
      let svg, formula, ans, label;
      const scale = 16;

      if (t === "par") {
        const base = randInt(5, 12);
        const height = randInt(3, 8);
        const skew = randInt(2, 5);
        ans = base * height;
        formula = `${base} × ${height} = ${ans}`;
        label = "平行四边形";
        const sw = (base + skew) * scale;
        const sh = height * scale;
        svg = `<svg class="shape-canvas" width="${sw + 60}" height="${sh + 60}" viewBox="0 0 ${sw + 60} ${sh + 60}">
          <polygon points="${30 + skew * scale},20 ${30 + (base + skew) * scale},20 ${30 + base * scale},${20 + sh} 30,${20 + sh}" fill="#fff5d6" stroke="#e17055" stroke-width="3" />
          <line x1="${30 + (skew + base / 2) * scale}" y1="20" x2="${30 + (skew + base / 2) * scale}" y2="${20 + sh}" stroke="#a29bfe" stroke-width="2" stroke-dasharray="4 3" />
          <text x="${30 + base / 2 * scale + skew * scale / 2}" y="${20 + sh + 14}" text-anchor="middle" font-family="ZCOOL KuaiLe" font-size="14" fill="#2d3436">底 = ${base}</text>
          <text x="${30 + (skew + base / 2) * scale + 6}" y="${20 + sh / 2}" font-family="ZCOOL KuaiLe" font-size="14" fill="#a29bfe">高 = ${height}</text>
        </svg>`;
      } else if (t === "tri") {
        const base = randInt(4, 12);
        const height = randInt(3, 8);
        ans = (base * height) / 2;
        if (!Number.isInteger(ans)) return newRound();
        formula = `${base} × ${height} ÷ 2 = ${ans}`;
        label = "三角形";
        const sw = base * scale;
        const sh = height * scale;
        const apexX = 30 + (base / 2) * scale;
        svg = `<svg class="shape-canvas" width="${sw + 60}" height="${sh + 60}" viewBox="0 0 ${sw + 60} ${sh + 60}">
          <polygon points="30,${20 + sh} ${30 + sw},${20 + sh} ${apexX},20" fill="#fff5d6" stroke="#e17055" stroke-width="3" />
          <line x1="${apexX}" y1="20" x2="${apexX}" y2="${20 + sh}" stroke="#a29bfe" stroke-width="2" stroke-dasharray="4 3" />
          <text x="${30 + sw / 2}" y="${20 + sh + 14}" text-anchor="middle" font-family="ZCOOL KuaiLe" font-size="14" fill="#2d3436">底 = ${base}</text>
          <text x="${apexX + 6}" y="${20 + sh / 2}" font-family="ZCOOL KuaiLe" font-size="14" fill="#a29bfe">高 = ${height}</text>
        </svg>`;
      } else {
        const top = randInt(3, 8);
        const bot = randInt(top + 2, 14);
        const height = randInt(3, 7);
        ans = ((top + bot) * height) / 2;
        if (!Number.isInteger(ans)) return newRound();
        formula = `(${top} + ${bot}) × ${height} ÷ 2 = ${ans}`;
        label = "梯形";
        const sw = bot * scale;
        const sh = height * scale;
        const offset = (bot - top) / 2 * scale;
        svg = `<svg class="shape-canvas" width="${sw + 60}" height="${sh + 60}" viewBox="0 0 ${sw + 60} ${sh + 60}">
          <polygon points="${30 + offset},20 ${30 + offset + top * scale},20 ${30 + sw},${20 + sh} 30,${20 + sh}" fill="#fff5d6" stroke="#e17055" stroke-width="3" />
          <line x1="${30 + sw / 2}" y1="20" x2="${30 + sw / 2}" y2="${20 + sh}" stroke="#a29bfe" stroke-width="2" stroke-dasharray="4 3" />
          <text x="${30 + offset + top * scale / 2}" y="14" text-anchor="middle" font-family="ZCOOL KuaiLe" font-size="13" fill="#2d3436">上 = ${top}</text>
          <text x="${30 + sw / 2}" y="${20 + sh + 14}" text-anchor="middle" font-family="ZCOOL KuaiLe" font-size="13" fill="#2d3436">下 = ${bot}</text>
          <text x="${30 + sw / 2 + 6}" y="${20 + sh / 2}" font-family="ZCOOL KuaiLe" font-size="13" fill="#a29bfe">高 = ${height}</text>
        </svg>`;
      }

      container.innerHTML =
        lessonShell(lesson) +
        `<div class="panel">
          <h3>${label}面积 (${round}/${total})</h3>
          <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
          <p style="text-align:center;color:#636e72">面积单位：平方厘米</p>
          ${svg}
          <input type="number" class="answer-input" id="ansPa" inputmode="numeric" placeholder="面积?" />
          <div class="btn-group" style="justify-content:center">
            <button type="button" class="btn btn-primary" id="btnPa">提交</button>
          </div>
          ${feedbackEl("fb-pa")}
        </div>`;
      const input = document.getElementById("ansPa");
      input.focus();
      function submit() {
        const val = parseInt(input.value, 10);
        if (val === ans) {
          showFeedback("fb-pa", true, `对了！${formula}`);
          round++;
          if (round >= total) { addStars(3); markComplete("polyArea"); return; }
          setTimeout(newRound, 1200);
        } else {
          showFeedback("fb-pa", false, `提示：${formula}`);
        }
      }
      document.getElementById("btnPa").onclick = submit;
      input.onkeydown = (e) => { if (e.key === "Enter") submit(); };
    }
    newRound();
  }

  /* --- 植树问题 --- */
  function renderTree(lesson, container) {
    let round = 0;
    const total = 5;

    function newRound() {
      const length = randInt(6, 18); // 米
      const space = randInt(2, 3); // 米
      const segs = length / space;
      if (!Number.isInteger(segs)) return newRound();
      const type = randInt(0, 2); // 0=两端栽, 1=一端栽, 2=两端都不栽
      let trees, label, hint;
      if (type === 0) {
        trees = segs + 1;
        label = "两端都栽";
        hint = `${segs} + 1 = ${trees}`;
      } else if (type === 1) {
        trees = segs;
        label = "一端栽";
        hint = `段数 = 棵数 = ${trees}`;
      } else {
        trees = segs - 1;
        label = "两端都不栽";
        hint = `${segs} − 1 = ${trees}`;
        if (trees < 1) return newRound();
      }
      const pct = (round / total) * 100;

      // Visual tree line
      let line = '';
      for (let i = 0; i <= segs; i++) {
        const isTree = (type === 0) || (type === 1 && i < segs) || (type === 2 && i > 0 && i < segs);
        line += `<span>${isTree ? "🌳" : "·"}</span>`;
        if (i < segs) line += `<span class="seg">⎯${space}m⎯</span>`;
      }

      container.innerHTML =
        lessonShell(lesson) +
        `<div class="panel">
          <h3>植树问题 (${round}/${total})</h3>
          <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
          <p style="text-align:center;line-height:1.8">在一条 <b>${length} 米</b> 的小路一侧种树，每隔 <b>${space} 米</b> 种一棵，<br><b style="color:var(--primary)">${label}</b>，共种几棵？</p>
          <div class="tree-line">${line}</div>
          <p style="text-align:center;color:#636e72;font-size:14px">段数 = 总长 ÷ 间距 = ${segs}</p>
          <input type="number" class="answer-input answer-input--sm" id="ansTree" inputmode="numeric" placeholder="棵数?" />
          <div class="btn-group" style="justify-content:center">
            <button type="button" class="btn btn-primary" id="btnTree">提交</button>
          </div>
          ${feedbackEl("fb-tree")}
        </div>`;
      const input = document.getElementById("ansTree");
      input.focus();
      function submit() {
        const val = parseInt(input.value, 10);
        if (val === trees) {
          showFeedback("fb-tree", true, `对了！${hint}`);
          round++;
          if (round >= total) { addStars(3); markComplete("tree"); return; }
          setTimeout(newRound, 1300);
        } else {
          showFeedback("fb-tree", false, `${label}：${hint}`);
        }
      }
      document.getElementById("btnTree").onclick = submit;
      input.onkeydown = (e) => { if (e.key === "Enter") submit(); };
    }
    newRound();
  }

  /* --- 可能性 --- */
  function renderChance5(lesson, container) {
    let round = 0;
    const total = 5;

    function newRound() {
      const red = randInt(1, 6);
      const yellow = randInt(1, 6);
      const blue = randInt(1, 6);
      const balls = "🔴".repeat(red) + "🟡".repeat(yellow) + "🔵".repeat(blue);
      const counts = { "🔴": red, "🟡": yellow, "🔵": blue };
      const maxKey = Object.keys(counts).reduce((a, b) => counts[a] >= counts[b] ? a : b);
      const askEqual = red === yellow && red === blue;
      const pct = (round / total) * 100;

      let question, correct;
      if (askEqual) {
        question = "摸到哪种球的可能性最大？";
        correct = "都一样";
      } else {
        question = "摸到哪种球的可能性最大？";
        correct = maxKey;
      }

      const opts = askEqual ? shuffle(["🔴", "🟡", "🔵", "都一样"]) : shuffle(["🔴", "🟡", "🔵"]);
      container.innerHTML =
        lessonShell(lesson) +
        `<div class="panel">
          <h3>谁的可能性大？(${round}/${total})</h3>
          <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
          <p style="text-align:center">袋子里：🔴×${red} 🟡×${yellow} 🔵×${blue}</p>
          <div class="bag-display">🎒 ${balls}</div>
          <p style="text-align:center">${question}</p>
          <div class="pattern-options" id="chOpts"></div>
          ${feedbackEl("fb-ch")}
        </div>`;
      opts.forEach((opt) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "pattern-opt";
        btn.textContent = opt;
        btn.onclick = () => {
          if (opt === correct) {
            btn.classList.add("correct");
            showFeedback("fb-ch", true, askEqual ? "对了！数量相等，可能性也相等。" : `对了！${correct} 数量最多。`);
            round++;
            if (round >= total) { addStars(2); markComplete("chance5"); return; }
            setTimeout(newRound, 1200);
          } else {
            btn.classList.add("wrong");
            showFeedback("fb-ch", false, "数量多的可能性就大。");
          }
        };
        document.getElementById("chOpts").appendChild(btn);
      });
    }
    newRound();
  }

  /* --- 因数与倍数 --- */
  function renderFactor(lesson, container) {
    let round = 0;
    const total = 6;

    function newRound() {
      const mode = randInt(0, 1);
      const pct = (round / total) * 100;
      if (mode === 0) {
        // 找因数
        const targets = [12, 18, 24, 30, 36];
        const n = targets[randInt(0, targets.length - 1)];
        const factors = [];
        for (let i = 1; i <= n; i++) if (n % i === 0) factors.push(i);
        const all = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15, 18, 20, 24, 30, 36];
        const nonFactors = all.filter((x) => !factors.includes(x));
        const opts = shuffle([...pick(factors, 3), ...pick(nonFactors, 3)]);
        container.innerHTML =
          lessonShell(lesson) +
          `<div class="panel">
            <h3>选出 ${n} 的因数（多选） (${round}/${total})</h3>
            <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
            <p style="text-align:center;color:#636e72">能被 ${n} 整除的数都是 ${n} 的因数</p>
            <div class="pattern-options" id="facOpts"></div>
            <div class="btn-group" style="justify-content:center">
              <button type="button" class="btn btn-primary" id="btnFac">提交</button>
            </div>
            ${feedbackEl("fb-fac")}
          </div>`;
        const selected = new Set();
        const buttons = {};
        opts.forEach((opt) => {
          const btn = document.createElement("button");
          btn.type = "button";
          btn.className = "pattern-opt";
          btn.textContent = opt;
          btn.onclick = () => {
            if (selected.has(opt)) {
              selected.delete(opt);
              btn.classList.remove("correct");
            } else {
              selected.add(opt);
              btn.classList.add("correct");
            }
          };
          buttons[opt] = btn;
          document.getElementById("facOpts").appendChild(btn);
        });
        document.getElementById("btnFac").onclick = () => {
          const want = new Set(opts.filter((x) => factors.includes(x)));
          const same = selected.size === want.size && [...selected].every((x) => want.has(x));
          if (same) {
            showFeedback("fb-fac", true, `对了！${n} 的因数有：${[...want].sort((a, b) => a - b).join("、")}`);
            round++;
            if (round >= total) { addStars(2); markComplete("factor"); return; }
            setTimeout(newRound, 1300);
          } else {
            showFeedback("fb-fac", false, "再检查每个数能否被 " + n + " 整除？");
          }
        };
      } else {
        // 找倍数
        const base = [2, 3, 4, 5, 6, 7][randInt(0, 5)];
        const all = [];
        for (let i = 1; i <= 40; i++) all.push(i);
        const multiples = all.filter((x) => x % base === 0);
        const nonMul = all.filter((x) => x % base !== 0);
        const opts = shuffle([...pick(multiples, 3), ...pick(nonMul, 3)]);
        container.innerHTML =
          lessonShell(lesson) +
          `<div class="panel">
            <h3>选出 ${base} 的倍数（多选） (${round}/${total})</h3>
            <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
            <p style="text-align:center;color:#636e72">能被 ${base} 整除的数都是 ${base} 的倍数</p>
            <div class="pattern-options" id="mulOpts"></div>
            <div class="btn-group" style="justify-content:center">
              <button type="button" class="btn btn-primary" id="btnMul">提交</button>
            </div>
            ${feedbackEl("fb-fac")}
          </div>`;
        const selected = new Set();
        opts.forEach((opt) => {
          const btn = document.createElement("button");
          btn.type = "button";
          btn.className = "pattern-opt";
          btn.textContent = opt;
          btn.onclick = () => {
            if (selected.has(opt)) {
              selected.delete(opt);
              btn.classList.remove("correct");
            } else {
              selected.add(opt);
              btn.classList.add("correct");
            }
          };
          document.getElementById("mulOpts").appendChild(btn);
        });
        document.getElementById("btnMul").onclick = () => {
          const want = new Set(opts.filter((x) => x % base === 0));
          const same = selected.size === want.size && [...selected].every((x) => want.has(x));
          if (same) {
            showFeedback("fb-fac", true, `对了！${[...want].sort((a, b) => a - b).join("、")} 都是 ${base} 的倍数。`);
            round++;
            if (round >= total) { addStars(2); markComplete("factor"); return; }
            setTimeout(newRound, 1300);
          } else {
            showFeedback("fb-fac", false, "检查每个数除以 " + base + " 有没有余数。");
          }
        };
      }
    }
    newRound();
  }

  /* --- 2、3、5 的倍数特征 --- */
  function renderDivFeat(lesson, container) {
    let round = 0;
    const total = 6;

    function newRound() {
      const bases = [2, 3, 5];
      const base = bases[randInt(0, 2)];
      // generate a 2~3-digit number
      const n = randInt(10, 999);
      const isMul = n % base === 0;
      const pct = (round / total) * 100;
      let hint;
      if (base === 2) hint = "末位是偶数（0,2,4,6,8）就是 2 的倍数";
      else if (base === 5) hint = "末位是 0 或 5 就是 5 的倍数";
      else hint = `各位数字之和 = ${n.toString().split("").reduce((s, c) => s + +c, 0)}，能被 3 整除就是 3 的倍数`;

      container.innerHTML =
        lessonShell(lesson) +
        `<div class="panel">
          <h3>${n} 是 ${base} 的倍数吗？(${round}/${total})</h3>
          <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
          <p style="text-align:center;color:#636e72">${hint}</p>
          <div class="pattern-options">
            <button type="button" class="pattern-opt" data-y="1">是</button>
            <button type="button" class="pattern-opt" data-y="0">不是</button>
          </div>
          ${feedbackEl("fb-df")}
        </div>`;
      document.querySelectorAll(".pattern-opt").forEach((btn) => {
        btn.onclick = () => {
          const ans = btn.dataset.y === "1";
          if (ans === isMul) {
            btn.classList.add("correct");
            showFeedback("fb-df", true, `对了！${n} ÷ ${base} = ${(n / base).toFixed(2).replace(/\.00$/, "")}，${isMul ? "整除" : "不能整除"}。`);
            round++;
            if (round >= total) { addStars(2); markComplete("divFeat"); return; }
            setTimeout(newRound, 1300);
          } else {
            btn.classList.add("wrong");
            showFeedback("fb-df", false, hint);
          }
        };
      });
    }
    newRound();
  }

  /* --- 质数与合数 --- */
  function renderPrime(lesson, container) {
    let round = 0;
    const total = 6;

    function newRound() {
      const n = randInt(2, 49);
      const prime = isPrime(n);
      const isOne = n === 1;
      const pct = (round / total) * 100;
      const correctLabel = isOne ? "都不是" : prime ? "质数" : "合数";

      container.innerHTML =
        lessonShell(lesson) +
        `<div class="panel">
          <h3>${n} 是质数还是合数？(${round}/${total})</h3>
          <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
          <p style="text-align:center;color:#636e72">只有 1 和它本身两个因数 = 质数；除此还有别的因数 = 合数。<br>1 既不是质数也不是合数。</p>
          <div class="pattern-options">
            <button type="button" class="pattern-opt" data-a="质数">质数</button>
            <button type="button" class="pattern-opt" data-a="合数">合数</button>
            <button type="button" class="pattern-opt" data-a="都不是">都不是</button>
          </div>
          ${feedbackEl("fb-pr")}
        </div>`;
      document.querySelectorAll(".pattern-opt").forEach((btn) => {
        btn.onclick = () => {
          if (btn.dataset.a === correctLabel) {
            btn.classList.add("correct");
            const factors = [];
            for (let i = 1; i <= n; i++) if (n % i === 0) factors.push(i);
            showFeedback("fb-pr", true, `对了！${n} 的因数：${factors.join("、")}，所以是${correctLabel}。`);
            round++;
            if (round >= total) { addStars(2); markComplete("prime"); return; }
            setTimeout(newRound, 1300);
          } else {
            btn.classList.add("wrong");
            showFeedback("fb-pr", false, "想想这个数除了 1 和自己还有别的因数吗？");
          }
        };
      });
    }
    newRound();
  }

  /* --- 长方体与正方体体积 --- */
  function renderVolume(lesson, container) {
    let round = 0;
    const total = 6;

    function newRound() {
      const isSquare = Math.random() > 0.5;
      const pct = (round / total) * 100;
      let l, w, h, vol, formula, label;
      if (isSquare) {
        const a = randInt(2, 9);
        l = w = h = a;
        vol = a * a * a;
        formula = `${a} × ${a} × ${a} = ${vol}`;
        label = "正方体";
      } else {
        l = randInt(3, 10);
        w = randInt(2, 8);
        h = randInt(2, 6);
        vol = l * w * h;
        formula = `${l} × ${w} × ${h} = ${vol}`;
        label = "长方体";
      }
      // SVG cuboid
      const sx = 30, sy = 30;
      const sw = l * 14, sh = h * 14, sd = w * 8;
      const svg = `<svg class="cube-svg" width="${sw + sd + 80}" height="${sh + sd + 60}" viewBox="0 0 ${sw + sd + 80} ${sh + sd + 60}">
        <polygon points="${sx},${sy + sd} ${sx + sw},${sy + sd} ${sx + sw},${sy + sd + sh} ${sx},${sy + sd + sh}" fill="#fff5d6" stroke="#e17055" stroke-width="3" />
        <polygon points="${sx},${sy + sd} ${sx + sd},${sy} ${sx + sw + sd},${sy} ${sx + sw},${sy + sd}" fill="#ffe4cc" stroke="#e17055" stroke-width="3" />
        <polygon points="${sx + sw},${sy + sd} ${sx + sw + sd},${sy} ${sx + sw + sd},${sy + sh} ${sx + sw},${sy + sd + sh}" fill="#ffd6b6" stroke="#e17055" stroke-width="3" />
        <text x="${sx + sw / 2}" y="${sy + sd + sh + 16}" text-anchor="middle" font-family="ZCOOL KuaiLe" font-size="14" fill="#2d3436">${isSquare ? "棱长 " + l : "长 " + l}</text>
        <text x="${sx - 6}" y="${sy + sd + sh / 2 + 4}" text-anchor="end" font-family="ZCOOL KuaiLe" font-size="14" fill="#2d3436">${isSquare ? "棱长 " + h : "高 " + h}</text>
        ${!isSquare ? `<text x="${sx + sw + sd / 2 + 6}" y="${sy + sd / 2}" font-family="ZCOOL KuaiLe" font-size="13" fill="#2d3436">宽 ${w}</text>` : ""}
      </svg>`;

      container.innerHTML =
        lessonShell(lesson) +
        `<div class="panel">
          <h3>${label}体积 (${round}/${total})</h3>
          <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
          <p style="text-align:center;color:#636e72">体积单位：立方厘米（cm³）</p>
          ${svg}
          <input type="number" class="answer-input" id="ansVol" inputmode="numeric" placeholder="体积?" />
          <div class="btn-group" style="justify-content:center">
            <button type="button" class="btn btn-primary" id="btnVol">提交</button>
          </div>
          ${feedbackEl("fb-vol")}
        </div>`;
      const input = document.getElementById("ansVol");
      input.focus();
      function submit() {
        const val = parseInt(input.value, 10);
        if (val === vol) {
          showFeedback("fb-vol", true, `对了！${formula}`);
          round++;
          if (round >= total) { addStars(3); markComplete("volume"); return; }
          setTimeout(newRound, 1200);
        } else {
          showFeedback("fb-vol", false, `提示：${formula}`);
        }
      }
      document.getElementById("btnVol").onclick = submit;
      input.onkeydown = (e) => { if (e.key === "Enter") submit(); };
    }
    newRound();
  }

  /* --- 分数的意义 --- */
  function renderFracMean(lesson, container) {
    let round = 0;
    const total = 6;

    function newRound() {
      const types = ["真分数", "假分数", "等于 1"];
      const target = types[randInt(0, 2)];
      let num, den;
      if (target === "真分数") {
        den = randInt(3, 9);
        num = randInt(1, den - 1);
      } else if (target === "假分数") {
        den = randInt(3, 8);
        num = randInt(den + 1, den * 2);
      } else {
        den = randInt(3, 9);
        num = den;
      }
      const pct = (round / total) * 100;
      container.innerHTML =
        lessonShell(lesson) +
        `<div class="panel">
          <h3>判断分数类型 (${round}/${total})</h3>
          <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
          <div class="quiz-display">
            <span class="fraction-inline"><span class="num">${num}</span><span class="den">${den}</span></span>
          </div>
          <p style="text-align:center;color:#636e72;font-size:14px">真分数：分子<分母；假分数：分子≥分母</p>
          <div class="pattern-options">
            <button type="button" class="pattern-opt" data-a="真分数">真分数</button>
            <button type="button" class="pattern-opt" data-a="假分数">假分数</button>
            <button type="button" class="pattern-opt" data-a="等于 1">等于 1</button>
          </div>
          ${feedbackEl("fb-fm")}
        </div>`;
      document.querySelectorAll(".pattern-opt").forEach((btn) => {
        btn.onclick = () => {
          if (btn.dataset.a === target) {
            btn.classList.add("correct");
            showFeedback("fb-fm", true, `对了！${num}/${den} 是${target}。`);
            round++;
            if (round >= total) { addStars(2); markComplete("fracMean"); return; }
            setTimeout(newRound, 1200);
          } else {
            btn.classList.add("wrong");
            showFeedback("fb-fm", false, "比较分子和分母的大小。");
          }
        };
      });
    }
    newRound();
  }

  /* --- 约分与通分 --- */
  function renderReduceCommon(lesson, container) {
    let round = 0;
    const total = 6;

    function newRound() {
      const mode = randInt(0, 1);
      const pct = (round / total) * 100;
      if (mode === 0) {
        // 约分
        const den0 = randInt(2, 9);
        const num0 = randInt(1, den0 - 1);
        const k = randInt(2, 5);
        const num = num0 * k;
        const den = den0 * k;
        container.innerHTML =
          lessonShell(lesson) +
          `<div class="panel">
            <h3>把 <span class="fraction-inline"><span class="num">${num}</span><span class="den">${den}</span></span> 约成最简分数 (${round}/${total})</h3>
            <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
            <p style="text-align:center;color:#636e72;font-size:14px">用分子和分母的最大公因数来约</p>
            <div class="dual-input">
              <label>分子 <input type="number" class="answer-input answer-input--sm" id="rN" inputmode="numeric" /></label>
              <label>分母 <input type="number" class="answer-input answer-input--sm" id="rD" inputmode="numeric" /></label>
            </div>
            <div class="btn-group" style="justify-content:center">
              <button type="button" class="btn btn-primary" id="btnR">提交</button>
            </div>
            ${feedbackEl("fb-rc")}
          </div>`;
        document.getElementById("rN").focus();
        document.getElementById("btnR").onclick = () => {
          const n = parseInt(document.getElementById("rN").value, 10);
          const d = parseInt(document.getElementById("rD").value, 10);
          if (n === num0 && d === den0) {
            showFeedback("fb-rc", true, `对了！${num}/${den} = ${num0}/${den0}（最大公因数 ${k}）`);
            round++;
            if (round >= total) { addStars(2); markComplete("reduceCommon"); return; }
            setTimeout(newRound, 1300);
          } else {
            showFeedback("fb-rc", false, `最大公因数是 ${k}，结果应是 ${num0}/${den0}`);
          }
        };
      } else {
        // 通分：两个分数 a/b 与 c/d，给出公分母
        const den1 = randInt(2, 6);
        let den2 = randInt(2, 6);
        while (den2 === den1) den2 = randInt(2, 6);
        const num1 = randInt(1, den1 - 1);
        const num2 = randInt(1, den2 - 1);
        const lcmV = lcm(den1, den2);
        container.innerHTML =
          lessonShell(lesson) +
          `<div class="panel">
            <h3>通分公分母 (${round}/${total})</h3>
            <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
            <p style="text-align:center">把 <span class="fraction-inline"><span class="num">${num1}</span><span class="den">${den1}</span></span>
              和 <span class="fraction-inline"><span class="num">${num2}</span><span class="den">${den2}</span></span> 通分，
              公分母 = ?</p>
            <p style="text-align:center;color:#636e72;font-size:14px">公分母 = 两个分母的最小公倍数</p>
            <input type="number" class="answer-input answer-input--sm" id="ansLcm" inputmode="numeric" placeholder="?" />
            <div class="btn-group" style="justify-content:center">
              <button type="button" class="btn btn-primary" id="btnLcm">提交</button>
            </div>
            ${feedbackEl("fb-rc")}
          </div>`;
        const input = document.getElementById("ansLcm");
        input.focus();
        function submit() {
          const val = parseInt(input.value, 10);
          if (val === lcmV) {
            showFeedback("fb-rc", true, `对了！${den1} 和 ${den2} 的最小公倍数是 ${lcmV}。`);
            round++;
            if (round >= total) { addStars(2); markComplete("reduceCommon"); return; }
            setTimeout(newRound, 1300);
          } else {
            showFeedback("fb-rc", false, `${den1} 与 ${den2} 的最小公倍数是 ${lcmV}。`);
          }
        }
        document.getElementById("btnLcm").onclick = submit;
        input.onkeydown = (e) => { if (e.key === "Enter") submit(); };
      }
    }
    newRound();
  }

  /* --- 分数加减法 --- */
  function renderFracAddSub(lesson, container) {
    let score = 0;
    const total = 6;
    let current = null;

    function gen() {
      const sameDen = Math.random() > 0.5;
      const isAdd = Math.random() > 0.5;
      let den1, den2, num1, num2;
      if (sameDen) {
        den1 = den2 = randInt(3, 9);
        num1 = randInt(1, den1 - 1);
        num2 = randInt(1, den1 - num1);
        if (!isAdd && num1 < num2) [num1, num2] = [num2, num1];
      } else {
        den1 = randInt(2, 6);
        den2 = randInt(2, 6);
        while (den2 === den1) den2 = randInt(2, 6);
        num1 = randInt(1, den1 - 1);
        num2 = randInt(1, den2 - 1);
        if (!isAdd) {
          const v1 = num1 / den1, v2 = num2 / den2;
          if (v1 < v2) { [num1, num2] = [num2, num1]; [den1, den2] = [den2, den1]; }
        }
      }
      const L = lcm(den1, den2);
      const a = num1 * (L / den1);
      const b = num2 * (L / den2);
      let resNum = isAdd ? a + b : a - b;
      let resDen = L;
      const g = gcd(Math.abs(resNum), resDen);
      resNum /= g;
      resDen /= g;
      return {
        text: `<span class="fraction-inline"><span class="num">${num1}</span><span class="den">${den1}</span></span> ${isAdd ? "+" : "−"} <span class="fraction-inline"><span class="num">${num2}</span><span class="den">${den2}</span></span>`,
        ansNum: resNum,
        ansDen: resDen,
        hint: sameDen ? "同分母直接加减分子" : `先通分到 ${L}：${a}/${L} ${isAdd ? "+" : "−"} ${b}/${L}`,
      };
    }

    function draw() {
      current = gen();
      const pct = (score / total) * 100;
      container.innerHTML =
        lessonShell(lesson) +
        `<div class="panel">
          <h3>分数加减法 (${score}/${total})</h3>
          <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
          <p style="text-align:center;font-size:1.4rem;line-height:2">${current.text} = ?</p>
          <p style="text-align:center;color:#636e72;font-size:14px">结果要约成最简分数。${current.hint}</p>
          <div class="dual-input">
            <label>分子 <input type="number" class="answer-input answer-input--sm" id="fN" inputmode="numeric" /></label>
            <label>分母 <input type="number" class="answer-input answer-input--sm" id="fD" inputmode="numeric" /></label>
          </div>
          <div class="btn-group" style="justify-content:center">
            <button type="button" class="btn btn-primary" id="btnF">提交</button>
          </div>
          ${feedbackEl("fb-f")}
        </div>`;
      document.getElementById("fN").focus();
      document.getElementById("btnF").onclick = () => {
        const n = parseInt(document.getElementById("fN").value, 10);
        const d = parseInt(document.getElementById("fD").value, 10);
        if (isNaN(n) || isNaN(d)) {
          showFeedback("fb-f", false, "请填写分子和分母。");
          return;
        }
        // Accept if equivalent
        const g = gcd(Math.abs(n), d);
        const sn = n / g;
        const sd = d / g;
        if (sn === current.ansNum && sd === current.ansDen) {
          score++;
          showFeedback("fb-f", true, `对了！等于 ${current.ansNum}/${current.ansDen}。`);
          if (score >= total) { addStars(3); markComplete("fracAddSub"); return; }
          setTimeout(draw, 1000);
        } else {
          showFeedback("fb-f", false, `结果是 ${current.ansNum}/${current.ansDen}，记得约分。`);
        }
      };
    }
    draw();
  }

  /* --- 折线统计图 --- */
  function renderLineChart5(lesson, container) {
    let round = 0;
    const total = 5;

    function newRound() {
      const days = ["一月", "二月", "三月", "四月", "五月", "六月"];
      const valsA = days.map(() => randInt(10, 50));
      const valsB = days.map(() => randInt(10, 50));
      const askIdx = randInt(0, days.length - 1);
      const askType = randInt(0, 2); // 0: A该月数值, 1: A最大月份, 2: A 比 B 多多少（某月）
      const pct = (round / total) * 100;

      let question, correct;
      if (askType === 0) {
        question = `🔴 A 班在 <b>${days[askIdx]}</b> 的数值是多少？`;
        correct = valsA[askIdx];
      } else if (askType === 1) {
        const maxIdx = valsA.indexOf(Math.max(...valsA));
        question = `🔴 A 班数值最高的是几月？`;
        correct = days[maxIdx];
      } else {
        const diff = valsA[askIdx] - valsB[askIdx];
        question = `<b>${days[askIdx]}</b>，A 班比 B 班多多少？`;
        correct = diff;
      }

      const w = 360, h = 200;
      const stepX = w / (days.length + 1);
      const allMax = Math.max(...valsA, ...valsB);
      function poly(vals, color, label) {
        let pts = "";
        let dots = "";
        let nums = "";
        vals.forEach((v, i) => {
          const x = stepX * (i + 1);
          const y = h - 40 - (v / (allMax + 5)) * (h - 70);
          pts += `${x},${y} `;
          dots += `<circle cx="${x}" cy="${y}" r="4" fill="${color}" stroke="#fff" stroke-width="2" />`;
          nums += `<text x="${x}" y="${y - 8}" text-anchor="middle" font-size="11" font-family="ZCOOL KuaiLe" fill="${color}">${v}</text>`;
        });
        return `<polyline points="${pts}" fill="none" stroke="${color}" stroke-width="3" stroke-linejoin="round" />${dots}${nums}`;
      }
      let svgLabels = "";
      days.forEach((d, i) => {
        const x = stepX * (i + 1);
        svgLabels += `<text x="${x}" y="${h - 20}" text-anchor="middle" font-size="12" fill="#636e72">${d}</text>`;
      });

      container.innerHTML =
        lessonShell(lesson) +
        `<div class="panel">
          <h3>读折线图 (${round}/${total})</h3>
          <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
          <svg class="chart-svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
            <line x1="30" y1="${h - 40}" x2="${w - 10}" y2="${h - 40}" stroke="#dfe6e9" stroke-width="2" />
            ${poly(valsA, "#e17055", "A")}
            ${poly(valsB, "#74b9ff", "B")}
            ${svgLabels}
            <rect x="${w - 100}" y="6" width="14" height="3" fill="#e17055" />
            <text x="${w - 82}" y="12" font-size="11" fill="#2d3436">A 班</text>
            <rect x="${w - 60}" y="6" width="14" height="3" fill="#74b9ff" />
            <text x="${w - 42}" y="12" font-size="11" fill="#2d3436">B 班</text>
          </svg>
          <p style="text-align:center;line-height:1.7">${question}</p>
          ${askType === 1
            ? '<div class="pattern-options" id="chartOpts"></div>'
            : `<input type="number" class="answer-input answer-input--sm" id="ansChart" inputmode="numeric" placeholder="?" />
               <div class="btn-group" style="justify-content:center">
                 <button type="button" class="btn btn-primary" id="btnChart">提交</button>
               </div>`}
          ${feedbackEl("fb-chart")}
        </div>`;

      if (askType === 1) {
        shuffle(days).forEach((d) => {
          const btn = document.createElement("button");
          btn.type = "button";
          btn.className = "pattern-opt";
          btn.textContent = d;
          btn.onclick = () => {
            if (d === correct) {
              btn.classList.add("correct");
              showFeedback("fb-chart", true, `对了！${correct} 时数值最高。`);
              round++;
              if (round >= total) { addStars(2); markComplete("lineChart5"); return; }
              setTimeout(newRound, 1200);
            } else {
              btn.classList.add("wrong");
              showFeedback("fb-chart", false, "找折线的最高点。");
            }
          };
          document.getElementById("chartOpts").appendChild(btn);
        });
      } else {
        const input = document.getElementById("ansChart");
        input.focus();
        function submit() {
          const val = parseInt(input.value, 10);
          if (val === correct) {
            showFeedback("fb-chart", true, `对了！答案是 ${correct}。`);
            round++;
            if (round >= total) { addStars(2); markComplete("lineChart5"); return; }
            setTimeout(newRound, 1200);
          } else {
            showFeedback("fb-chart", false, `读图答案：${correct}`);
          }
        }
        document.getElementById("btnChart").onclick = submit;
        input.onkeydown = (e) => { if (e.key === "Enter") submit(); };
      }
    }
    newRound();
  }

  /* --- 找次品 --- */
  function renderDefective(lesson, container) {
    let round = 0;
    const total = 4;

    function newRound() {
      // 1: n=3 ans=1, n=4-9 ans=2, n=10-27 ans=3
      const options = [3, 5, 8, 9, 12, 21, 25, 27];
      const n = options[randInt(0, options.length - 1)];
      const ans = Math.ceil(Math.log(n) / Math.log(3));
      const pct = (round / total) * 100;
      const choices = shuffle([ans, ans + 1, ans - 1, ans + 2].filter((x) => x >= 1));

      container.innerHTML =
        lessonShell(lesson) +
        `<div class="panel">
          <h3>找次品 (${round}/${total})</h3>
          <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
          <p style="text-align:center;line-height:1.7">有 <b style="color:var(--primary)">${n}</b> 个外形相同的零件，其中 <b>1 个是次品</b>（比正品稍轻）。<br>用天平至少称几次<b>一定</b>能找出次品？</p>
          <p style="text-align:center;color:#636e72;font-size:14px">每次把物品<b>三等分</b>（或尽量均分）放天平两端，最少称量次数 = ⌈log₃(${n})⌉</p>
          <div class="pattern-options" id="defOpts"></div>
          ${feedbackEl("fb-def")}
        </div>`;
      [...new Set(choices)].slice(0, 4).forEach((c) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "pattern-opt";
        btn.textContent = c + " 次";
        btn.onclick = () => {
          if (c === ans) {
            btn.classList.add("correct");
            showFeedback("fb-def", true, `对了！${n} 个零件至少称 ${ans} 次能保证找到。`);
            round++;
            if (round >= total) { addStars(3); markComplete("defective"); return; }
            setTimeout(newRound, 1400);
          } else {
            btn.classList.add("wrong");
            showFeedback("fb-def", false, `平均分 3 堆，每次最坏剩下 ⅓，至少 ${ans} 次。`);
          }
        };
        document.getElementById("defOpts").appendChild(btn);
      });
    }
    newRound();
  }

  function init() {
    loadProgress();
    document.getElementById("totalStars").textContent = state.stars;
    renderNav();
    renderHomeCards();

    document.body.addEventListener("click", (e) => {
      const go = e.target.closest("[data-go]");
      if (go) goTo(go.dataset.go);
    });

    const menuBtn = document.getElementById("menuBtn");
    const sidebar = document.getElementById("sidebar");
    let overlay = document.querySelector(".overlay");
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.className = "overlay";
      document.body.appendChild(overlay);
    }
    menuBtn.onclick = () => {
      sidebar.classList.toggle("open");
      overlay.classList.toggle("show");
    };
    overlay.onclick = closeSidebar;
  }

  window.startApp = function startApp() {
    if (window._appStarted) return;
    window._appStarted = true;
    init();
  };
})();
