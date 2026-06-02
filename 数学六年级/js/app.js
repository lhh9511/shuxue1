(function () {
  const STORAGE_KEY = "math-grade6-progress";

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
    const colors = ["#5f3dc4", "#00cec9", "#fd79a8", "#fdcb6e", "#74b9ff"];
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

  function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
  function pick(arr, n) {
    const copy = [...arr]; const out = [];
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
  function approx(a, b, eps = 0.01) { return Math.abs(a - b) < eps; }

  function renderLesson(id, container) {
    const lesson = LESSONS.find((l) => l.id === id);
    if (!lesson) return;
    const renderers = {
      fracMul: renderFracMul,
      fracDiv: renderFracDiv,
      ratio: renderRatio,
      circlePeri: renderCirclePeri,
      circleArea: renderCircleArea,
      percentConv: renderPercentConv,
      discount: renderDiscount,
      interest: renderInterest,
      negative: renderNegative,
      cylinderSurf: renderCylinderSurf,
      cylinderVol: renderCylinderVol,
      coneVol: renderConeVol,
      proportion: renderProportion,
      solveProp: renderSolveProp,
      pieChart: renderPieChart,
      pigeon: renderPigeon,
    };
    renderers[id]?.(lesson, container);
  }

  /* --- 分数乘法 --- */
  function renderFracMul(lesson, container) {
    let score = 0;
    const total = 6;
    let current = null;

    function gen() {
      const isFracFrac = Math.random() > 0.4;
      if (isFracFrac) {
        const a1 = randInt(1, 5);
        const b1 = randInt(a1 + 1, 8);
        const a2 = randInt(1, 5);
        const b2 = randInt(a2 + 1, 8);
        let n = a1 * a2, d = b1 * b2;
        const g = gcd(n, d);
        n /= g; d /= g;
        return {
          text: `<span class="fraction-inline"><span class="num">${a1}</span><span class="den">${b1}</span></span> × <span class="fraction-inline"><span class="num">${a2}</span><span class="den">${b2}</span></span>`,
          ansN: n, ansD: d,
        };
      } else {
        const k = randInt(2, 9);
        const a = randInt(1, 7);
        const b = randInt(a + 1, 10);
        let n = a * k, d = b;
        const g = gcd(n, d);
        n /= g; d /= g;
        return {
          text: `<span class="fraction-inline"><span class="num">${a}</span><span class="den">${b}</span></span> × ${k}`,
          ansN: n, ansD: d,
        };
      }
    }

    function draw() {
      current = gen();
      const pct = (score / total) * 100;
      container.innerHTML =
        lessonShell(lesson) +
        `<div class="panel">
          <h3>分数乘法 (${score}/${total})</h3>
          <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
          <p style="text-align:center;font-size:1.6rem;line-height:2.2">${current.text} = ?</p>
          <p style="text-align:center;color:#636e72;font-size:14px">结果约分至最简（整数请填入分子并令分母 = 1）</p>
          <div class="dual-input">
            <label>分子 <input type="number" class="answer-input answer-input--sm" id="fmN" inputmode="numeric" /></label>
            <label>分母 <input type="number" class="answer-input answer-input--sm" id="fmD" inputmode="numeric" /></label>
          </div>
          <div class="btn-group" style="justify-content:center">
            <button type="button" class="btn btn-primary" id="btnFm">提交</button>
          </div>
          ${feedbackEl("fb-fm")}
        </div>`;
      document.getElementById("fmN").focus();
      document.getElementById("btnFm").onclick = () => {
        const n = parseInt(document.getElementById("fmN").value, 10);
        const d = parseInt(document.getElementById("fmD").value, 10);
        if (isNaN(n) || isNaN(d) || d === 0) {
          showFeedback("fb-fm", false, "请填写分子和分母。");
          return;
        }
        const g = gcd(Math.abs(n), d);
        if (n / g === current.ansN && d / g === current.ansD) {
          score++;
          showFeedback("fb-fm", true, `对了！= ${current.ansN}/${current.ansD}`);
          if (score >= total) { addStars(3); markComplete("fracMul"); return; }
          setTimeout(draw, 900);
        } else {
          showFeedback("fb-fm", false, `结果应该是 ${current.ansN}/${current.ansD}，约分到最简。`);
        }
      };
    }
    draw();
  }

  /* --- 分数除法 --- */
  function renderFracDiv(lesson, container) {
    let score = 0;
    const total = 6;
    let current = null;

    function gen() {
      const a = randInt(1, 6);
      const b = randInt(a + 1, 9);
      const c = randInt(1, 6);
      const d = randInt(c + 1, 9);
      // a/b ÷ c/d = a/b × d/c = ad/(bc)
      let n = a * d, dd = b * c;
      const g = gcd(n, dd);
      n /= g; dd /= g;
      return {
        text: `<span class="fraction-inline"><span class="num">${a}</span><span class="den">${b}</span></span> ÷ <span class="fraction-inline"><span class="num">${c}</span><span class="den">${d}</span></span>`,
        ansN: n, ansD: dd,
        hint: `= ${a}/${b} × ${d}/${c}`,
      };
    }

    function draw() {
      current = gen();
      const pct = (score / total) * 100;
      container.innerHTML =
        lessonShell(lesson) +
        `<div class="panel">
          <h3>分数除法 (${score}/${total})</h3>
          <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
          <p style="text-align:center;font-size:1.6rem;line-height:2.2">${current.text} = ?</p>
          <p style="text-align:center;color:#636e72;font-size:14px">除以一个数 = 乘它的倒数；${current.hint}</p>
          <div class="dual-input">
            <label>分子 <input type="number" class="answer-input answer-input--sm" id="fdN" inputmode="numeric" /></label>
            <label>分母 <input type="number" class="answer-input answer-input--sm" id="fdD" inputmode="numeric" /></label>
          </div>
          <div class="btn-group" style="justify-content:center">
            <button type="button" class="btn btn-primary" id="btnFd">提交</button>
          </div>
          ${feedbackEl("fb-fd")}
        </div>`;
      document.getElementById("fdN").focus();
      document.getElementById("btnFd").onclick = () => {
        const n = parseInt(document.getElementById("fdN").value, 10);
        const d = parseInt(document.getElementById("fdD").value, 10);
        if (isNaN(n) || isNaN(d) || d === 0) {
          showFeedback("fb-fd", false, "请填写分子和分母。");
          return;
        }
        const g = gcd(Math.abs(n), d);
        if (n / g === current.ansN && d / g === current.ansD) {
          score++;
          showFeedback("fb-fd", true, `对了！= ${current.ansN}/${current.ansD}`);
          if (score >= total) { addStars(3); markComplete("fracDiv"); return; }
          setTimeout(draw, 900);
        } else {
          showFeedback("fb-fd", false, `应该是 ${current.ansN}/${current.ansD}（${current.hint}）`);
        }
      };
    }
    draw();
  }

  /* --- 比 --- */
  function renderRatio(lesson, container) {
    let round = 0;
    const total = 6;

    function newRound() {
      const mode = randInt(0, 1);
      const pct = (round / total) * 100;
      if (mode === 0) {
        // 化简比
        const k = randInt(2, 9);
        const a = randInt(2, 9);
        const b = randInt(2, 9);
        if (a === b) return newRound();
        const A = a * k, B = b * k;
        // simplify A:B
        const g0 = gcd(A, B);
        const sa = A / g0, sb = B / g0;
        container.innerHTML =
          lessonShell(lesson) +
          `<div class="panel">
            <h3>化简最简整数比 (${round}/${total})</h3>
            <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
            <div class="quiz-display">${A} : ${B} = ? : ?</div>
            <p style="text-align:center;color:#636e72;font-size:14px">前后项同时除以最大公因数 ${g0}</p>
            <div class="dual-input">
              <label>前项 <input type="number" class="answer-input answer-input--sm" id="raA" inputmode="numeric" /></label>
              <label>后项 <input type="number" class="answer-input answer-input--sm" id="raB" inputmode="numeric" /></label>
            </div>
            <div class="btn-group" style="justify-content:center">
              <button type="button" class="btn btn-primary" id="btnRa">提交</button>
            </div>
            ${feedbackEl("fb-ra")}
          </div>`;
        document.getElementById("raA").focus();
        document.getElementById("btnRa").onclick = () => {
          const x = parseInt(document.getElementById("raA").value, 10);
          const y = parseInt(document.getElementById("raB").value, 10);
          if (x === sa && y === sb) {
            showFeedback("fb-ra", true, `对了！最简比 ${sa} : ${sb}`);
            round++;
            if (round >= total) { addStars(2); markComplete("ratio"); return; }
            setTimeout(newRound, 1200);
          } else {
            showFeedback("fb-ra", false, `最简比是 ${sa} : ${sb}（同除以 ${g0}）`);
          }
        };
      } else {
        // 求比值
        const a = randInt(1, 9);
        const b = randInt(1, 9);
        if (a === b) return newRound();
        const g0 = gcd(a, b);
        const sa = a / g0, sb = b / g0;
        container.innerHTML =
          lessonShell(lesson) +
          `<div class="panel">
            <h3>求比值 (${round}/${total})</h3>
            <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
            <div class="quiz-display">${a} : ${b} 的比值 = ?</div>
            <p style="text-align:center;color:#636e72;font-size:14px">比值 = 前项 ÷ 后项 = ${a}/${b}，化简成最简分数</p>
            <div class="dual-input">
              <label>分子 <input type="number" class="answer-input answer-input--sm" id="rvN" inputmode="numeric" /></label>
              <label>分母 <input type="number" class="answer-input answer-input--sm" id="rvD" inputmode="numeric" /></label>
            </div>
            <div class="btn-group" style="justify-content:center">
              <button type="button" class="btn btn-primary" id="btnRv">提交</button>
            </div>
            ${feedbackEl("fb-ra")}
          </div>`;
        document.getElementById("rvN").focus();
        document.getElementById("btnRv").onclick = () => {
          const x = parseInt(document.getElementById("rvN").value, 10);
          const y = parseInt(document.getElementById("rvD").value, 10);
          if (x === sa && y === sb) {
            showFeedback("fb-ra", true, `对了！比值 = ${sa}/${sb}`);
            round++;
            if (round >= total) { addStars(2); markComplete("ratio"); return; }
            setTimeout(newRound, 1200);
          } else {
            showFeedback("fb-ra", false, `比值 = ${sa}/${sb}`);
          }
        };
      }
    }
    newRound();
  }

  /* --- 圆的周长 --- */
  function renderCirclePeri(lesson, container) {
    let round = 0;
    const total = 5;

    function newRound() {
      const radius = randInt(2, 10);
      const useDiameter = Math.random() > 0.5;
      const value = useDiameter ? radius * 2 : radius;
      const peri = +(2 * 3.14 * radius).toFixed(2);
      const pct = (round / total) * 100;

      const svgR = Math.min(radius * 6, 80);
      container.innerHTML =
        lessonShell(lesson) +
        `<div class="panel">
          <h3>圆的周长 (${round}/${total})</h3>
          <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
          <p style="text-align:center;color:#636e72">π 取 3.14，单位：厘米</p>
          <svg class="shape-canvas" width="220" height="180" viewBox="0 0 220 180">
            <circle cx="110" cy="90" r="${svgR}" fill="#f4f1ff" stroke="#5f3dc4" stroke-width="3" />
            <line x1="110" y1="90" x2="${110 + svgR}" y2="90" stroke="#fd79a8" stroke-width="2" stroke-dasharray="3 3" />
            <text x="${110 + svgR / 2}" y="86" text-anchor="middle" font-family="ZCOOL KuaiLe" font-size="14" fill="#fd79a8">${useDiameter ? "d" : "r"} = ${value}</text>
          </svg>
          <p style="text-align:center;font-family:var(--font-display);font-size:1.4rem;color:var(--primary)">${useDiameter ? `d = ${value}` : `r = ${value}`}，求 C = ?</p>
          <input type="number" step="0.01" class="answer-input" id="ansCp" inputmode="decimal" placeholder="?" />
          <div class="btn-group" style="justify-content:center">
            <button type="button" class="btn btn-primary" id="btnCp">提交</button>
          </div>
          ${feedbackEl("fb-cp")}
        </div>`;
      const input = document.getElementById("ansCp");
      input.focus();
      function submit() {
        const val = parseFloat(input.value);
        if (approx(val, peri)) {
          showFeedback("fb-cp", true, `对了！C = ${useDiameter ? `π × d = 3.14 × ${value}` : `2π × r = 2 × 3.14 × ${value}`} = ${peri}`);
          round++;
          if (round >= total) { addStars(3); markComplete("circlePeri"); return; }
          setTimeout(newRound, 1300);
        } else {
          showFeedback("fb-cp", false, `周长 = ${peri}（${useDiameter ? "3.14 × d" : "2 × 3.14 × r"}）`);
        }
      }
      document.getElementById("btnCp").onclick = submit;
      input.onkeydown = (e) => { if (e.key === "Enter") submit(); };
    }
    newRound();
  }

  /* --- 圆的面积 --- */
  function renderCircleArea(lesson, container) {
    let round = 0;
    const total = 5;

    function newRound() {
      const radius = randInt(2, 8);
      const useDiameter = Math.random() > 0.5;
      const value = useDiameter ? radius * 2 : radius;
      const area = +(3.14 * radius * radius).toFixed(2);
      const pct = (round / total) * 100;
      const svgR = Math.min(radius * 8, 80);

      container.innerHTML =
        lessonShell(lesson) +
        `<div class="panel">
          <h3>圆的面积 (${round}/${total})</h3>
          <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
          <p style="text-align:center;color:#636e72">π 取 3.14，单位：平方厘米</p>
          <svg class="shape-canvas" width="220" height="180" viewBox="0 0 220 180">
            <circle cx="110" cy="90" r="${svgR}" fill="#d1fdfa" stroke="#5f3dc4" stroke-width="3" />
            <line x1="110" y1="90" x2="${110 + svgR}" y2="90" stroke="#fd79a8" stroke-width="2" stroke-dasharray="3 3" />
            <text x="${110 + svgR / 2}" y="86" text-anchor="middle" font-family="ZCOOL KuaiLe" font-size="14" fill="#fd79a8">${useDiameter ? "d" : "r"} = ${value}</text>
          </svg>
          <p style="text-align:center;font-family:var(--font-display);font-size:1.4rem;color:var(--primary)">${useDiameter ? `d = ${value}` : `r = ${value}`}，求 S = ?</p>
          <input type="number" step="0.01" class="answer-input" id="ansCa" inputmode="decimal" placeholder="?" />
          <div class="btn-group" style="justify-content:center">
            <button type="button" class="btn btn-primary" id="btnCa">提交</button>
          </div>
          ${feedbackEl("fb-ca")}
        </div>`;
      const input = document.getElementById("ansCa");
      input.focus();
      function submit() {
        const val = parseFloat(input.value);
        if (approx(val, area)) {
          showFeedback("fb-ca", true, `对了！S = 3.14 × ${radius}² = ${area}`);
          round++;
          if (round >= total) { addStars(3); markComplete("circleArea"); return; }
          setTimeout(newRound, 1300);
        } else {
          showFeedback("fb-ca", false, `S = π × r² = 3.14 × ${radius} × ${radius} = ${area}${useDiameter ? "（半径 = d ÷ 2）" : ""}`);
        }
      }
      document.getElementById("btnCa").onclick = submit;
      input.onkeydown = (e) => { if (e.key === "Enter") submit(); };
    }
    newRound();
  }

  /* --- 百分数互化 --- */
  function renderPercentConv(lesson, container) {
    let round = 0;
    const total = 6;

    function newRound() {
      const mode = randInt(0, 2);
      const pct = (round / total) * 100;
      let q, ans, hint;
      if (mode === 0) {
        // 小数 → 百分数
        const v = randInt(1, 95) / 100;
        q = `把 <b>${v}</b> 化成百分数 = ? %`;
        ans = Math.round(v * 100);
        hint = `小数点右移 2 位：${v} → ${ans}%`;
      } else if (mode === 1) {
        // 百分数 → 小数
        const p = randInt(5, 99);
        q = `<b>${p}%</b> 化成小数 = ?`;
        ans = p / 100;
        hint = `去掉 %，小数点左移 2 位：${p}% → ${ans}`;
      } else {
        // 分数 → 百分数
        const dens = [4, 5, 10, 20, 25, 50];
        const d = dens[randInt(0, dens.length - 1)];
        const n = randInt(1, d - 1);
        const decimal = n / d;
        q = `把分数 <span class="fraction-inline"><span class="num">${n}</span><span class="den">${d}</span></span> 化成百分数 = ? %`;
        ans = decimal * 100;
        if (!Number.isInteger(ans)) return newRound();
        hint = `${n} ÷ ${d} = ${decimal}，再 × 100 = ${ans}%`;
      }

      container.innerHTML =
        lessonShell(lesson) +
        `<div class="panel">
          <h3>百分数互化 (${round}/${total})</h3>
          <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
          <p style="text-align:center;font-size:1.4rem;line-height:1.8">${q}</p>
          <input type="number" step="0.01" class="answer-input" id="ansPc" inputmode="decimal" placeholder="?" />
          <div class="btn-group" style="justify-content:center">
            <button type="button" class="btn btn-primary" id="btnPc">提交</button>
          </div>
          ${feedbackEl("fb-pc")}
        </div>`;
      const input = document.getElementById("ansPc");
      input.focus();
      function submit() {
        const val = parseFloat(input.value);
        if (approx(val, ans, 0.005)) {
          showFeedback("fb-pc", true, `对了！${hint}`);
          round++;
          if (round >= total) { addStars(2); markComplete("percentConv"); return; }
          setTimeout(newRound, 1300);
        } else {
          showFeedback("fb-pc", false, hint);
        }
      }
      document.getElementById("btnPc").onclick = submit;
      input.onkeydown = (e) => { if (e.key === "Enter") submit(); };
    }
    newRound();
  }

  /* --- 折扣与成数 --- */
  function renderDiscount(lesson, container) {
    let round = 0;
    const total = 5;

    function newRound() {
      const orig = [80, 100, 120, 150, 200, 250, 300, 400, 500][randInt(0, 8)];
      const discount10 = randInt(5, 9); // 5折-9折
      const isCheng = Math.random() > 0.5; // 二/三/...成 即 20%/30%
      const pct = (round / total) * 100;
      let q, ans, hint;
      if (!isCheng) {
        ans = +(orig * (discount10 / 10)).toFixed(2);
        q = `一件衣服原价 <b>${orig}</b> 元，<b>${discount10}</b> 折出售，现价多少元？`;
        hint = `${discount10} 折 = ${discount10 * 10}%，现价 = ${orig} × ${discount10 * 10}% = ${ans}`;
      } else {
        const chengs = [["二", 20], ["三", 30], ["四", 40], ["五", 50]];
        const pair = chengs[randInt(0, 3)];
        ans = +(orig * (pair[1] / 100)).toFixed(2);
        q = `今年水稻产量比去年增产 <b>${pair[0]}成</b>。去年产量 ${orig} 吨，增产了多少吨？`;
        hint = `${pair[0]}成 = ${pair[1]}%，${orig} × ${pair[1]}% = ${ans}`;
      }

      container.innerHTML =
        lessonShell(lesson) +
        `<div class="panel">
          <h3>折扣与成数 (${round}/${total})</h3>
          <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
          <p style="text-align:center;line-height:1.8">${q}</p>
          <p style="text-align:center;color:#636e72;font-size:14px">${isCheng ? "几成 = 几乘 10%" : "几折 = 几乘 10%"}</p>
          <input type="number" step="0.01" class="answer-input" id="ansDc" inputmode="decimal" placeholder="?" />
          <div class="btn-group" style="justify-content:center">
            <button type="button" class="btn btn-primary" id="btnDc">提交</button>
          </div>
          ${feedbackEl("fb-dc")}
        </div>`;
      const input = document.getElementById("ansDc");
      input.focus();
      function submit() {
        const val = parseFloat(input.value);
        if (approx(val, ans, 0.005)) {
          showFeedback("fb-dc", true, `对了！${hint}`);
          round++;
          if (round >= total) { addStars(2); markComplete("discount"); return; }
          setTimeout(newRound, 1300);
        } else {
          showFeedback("fb-dc", false, hint);
        }
      }
      document.getElementById("btnDc").onclick = submit;
      input.onkeydown = (e) => { if (e.key === "Enter") submit(); };
    }
    newRound();
  }

  /* --- 利率 --- */
  function renderInterest(lesson, container) {
    let round = 0;
    const total = 5;

    function newRound() {
      const principal = [1000, 2000, 5000, 8000, 10000][randInt(0, 4)];
      const rates = [2.25, 2.5, 3, 3.5, 4]; // annual %
      const rate = rates[randInt(0, 4)];
      const years = randInt(1, 5);
      const interest = +((principal * rate / 100) * years).toFixed(2);
      const pct = (round / total) * 100;

      container.innerHTML =
        lessonShell(lesson) +
        `<div class="panel">
          <h3>利息计算 (${round}/${total})</h3>
          <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
          <p style="text-align:center;line-height:1.8">爸爸把 <b>${principal}</b> 元存入银行，年利率 <b>${rate}%</b>，存了 <b>${years} 年</b>，到期可得多少利息？</p>
          <p style="text-align:center;color:#636e72;font-size:14px">利息 = 本金 × 年利率 × 年数 = ${principal} × ${rate}% × ${years}</p>
          <input type="number" step="0.01" class="answer-input answer-input--lg" id="ansIn" inputmode="decimal" placeholder="?" />
          <div class="btn-group" style="justify-content:center">
            <button type="button" class="btn btn-primary" id="btnIn">提交</button>
          </div>
          ${feedbackEl("fb-in")}
        </div>`;
      const input = document.getElementById("ansIn");
      input.focus();
      function submit() {
        const val = parseFloat(input.value);
        if (approx(val, interest, 0.5)) {
          showFeedback("fb-in", true, `对了！利息 = ${principal} × ${rate}% × ${years} = ${interest} 元`);
          round++;
          if (round >= total) { addStars(2); markComplete("interest"); return; }
          setTimeout(newRound, 1400);
        } else {
          showFeedback("fb-in", false, `${principal} × ${rate}% × ${years} = ${interest}`);
        }
      }
      document.getElementById("btnIn").onclick = submit;
      input.onkeydown = (e) => { if (e.key === "Enter") submit(); };
    }
    newRound();
  }

  /* --- 负数 --- */
  function renderNegative(lesson, container) {
    let round = 0;
    const total = 6;

    function newRound() {
      const mode = randInt(0, 1);
      const pct = (round / total) * 100;
      if (mode === 0) {
        // 比较两个数大小
        const pool = [];
        for (let i = -8; i <= 8; i++) pool.push(i);
        const a = pool[randInt(0, pool.length - 1)];
        let b = pool[randInt(0, pool.length - 1)];
        while (b === a) b = pool[randInt(0, pool.length - 1)];
        const correct = a > b ? ">" : "<";
        // number line svg
        const w = 320, h = 80;
        let line = `<svg class="numline-svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
          <line x1="20" y1="40" x2="${w - 20}" y2="40" stroke="#5f3dc4" stroke-width="2" />
          <polygon points="${w - 20},40 ${w - 30},34 ${w - 30},46" fill="#5f3dc4" />`;
        for (let i = -8; i <= 8; i++) {
          const x = 20 + ((i + 8) / 16) * (w - 40);
          line += `<line x1="${x}" y1="34" x2="${x}" y2="46" stroke="#5f3dc4" stroke-width="1" />
                   <text x="${x}" y="60" text-anchor="middle" font-size="10" fill="#636e72">${i}</text>`;
          if (i === 0) line += `<text x="${x}" y="26" text-anchor="middle" font-size="11" fill="#fd79a8">0</text>`;
        }
        const xa = 20 + ((a + 8) / 16) * (w - 40);
        const xb = 20 + ((b + 8) / 16) * (w - 40);
        line += `<circle cx="${xa}" cy="40" r="6" fill="#5f3dc4" /><text x="${xa}" y="24" text-anchor="middle" font-size="11" font-family="ZCOOL KuaiLe" fill="#5f3dc4">A=${a}</text>`;
        line += `<circle cx="${xb}" cy="40" r="6" fill="#fd79a8" /><text x="${xb}" y="78" text-anchor="middle" font-size="11" font-family="ZCOOL KuaiLe" fill="#fd79a8">B=${b}</text>`;
        line += "</svg>";

        container.innerHTML =
          lessonShell(lesson) +
          `<div class="panel">
            <h3>比较两个数 (${round}/${total})</h3>
            <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
            ${line}
            <div class="quiz-display">${a} ? ${b}</div>
            <p style="text-align:center;color:#636e72;font-size:14px">在数轴上越向右越大</p>
            <div class="pattern-options">
              <button type="button" class="pattern-opt" data-s=">">&gt;</button>
              <button type="button" class="pattern-opt" data-s="<">&lt;</button>
            </div>
            ${feedbackEl("fb-ng")}
          </div>`;
        document.querySelectorAll(".pattern-opt").forEach((btn) => {
          btn.onclick = () => {
            if (btn.dataset.s === correct) {
              btn.classList.add("correct");
              showFeedback("fb-ng", true, `对了！${a} ${correct} ${b}`);
              round++;
              if (round >= total) { addStars(2); markComplete("negative"); return; }
              setTimeout(newRound, 1100);
            } else {
              btn.classList.add("wrong");
              showFeedback("fb-ng", false, "数轴上越靠右越大；负数中绝对值越大反而越小。");
            }
          };
        });
      } else {
        // 温度/海拔等的相反意义
        const items = [
          { up: "零上 8℃", down: "零下 5℃", ansUp: "+8", ansDown: "−5" },
          { up: "盈利 200 元", down: "亏损 150 元", ansUp: "+200", ansDown: "−150" },
          { up: "海拔 1500 米", down: "海拔 −200 米（低于海平面）", ansUp: "+1500", ansDown: "−200" },
          { up: "向东 30 米", down: "向西 20 米", ansUp: "+30", ansDown: "−20" },
        ];
        const it = items[randInt(0, items.length - 1)];
        const askDown = Math.random() > 0.5;
        const ans = askDown ? it.ansDown : it.ansUp;
        const askText = askDown ? it.down : it.up;
        container.innerHTML =
          lessonShell(lesson) +
          `<div class="panel">
            <h3>用正/负数表示 (${round}/${total})</h3>
            <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
            <p style="text-align:center;line-height:1.8">${it.up} 记作 <b>${it.ansUp}</b>，那么 <b>${askText}</b> 记作 ?</p>
            <p style="text-align:center;color:#636e72;font-size:14px">填写时正数前面带 + 号，负数前面带 − 号</p>
            <input type="text" class="answer-input answer-input--sm" id="ansNg" placeholder="?" style="font-size:1.5rem" />
            <div class="btn-group" style="justify-content:center">
              <button type="button" class="btn btn-primary" id="btnNg">提交</button>
            </div>
            ${feedbackEl("fb-ng")}
          </div>`;
        const input = document.getElementById("ansNg");
        input.focus();
        function submit() {
          const v = (input.value || "").trim().replace(/^\+/, "+").replace(/^-/, "−");
          if (v === ans || v === ans.replace("−", "-") || v === ans.replace("+", "")) {
            showFeedback("fb-ng", true, `对了！${askText} 记作 ${ans}`);
            round++;
            if (round >= total) { addStars(2); markComplete("negative"); return; }
            setTimeout(newRound, 1300);
          } else {
            showFeedback("fb-ng", false, `答案是 ${ans}（记得加上 + 或 −）`);
          }
        }
        document.getElementById("btnNg").onclick = submit;
        input.onkeydown = (e) => { if (e.key === "Enter") submit(); };
      }
    }
    newRound();
  }

  /* --- 圆柱表面积 --- */
  function renderCylinderSurf(lesson, container) {
    let round = 0;
    const total = 4;

    function newRound() {
      const r = randInt(2, 6);
      const h = randInt(4, 15);
      const side = +(2 * 3.14 * r * h).toFixed(2);
      const base = +(3.14 * r * r).toFixed(2);
      const surf = +(side + 2 * base).toFixed(2);
      const pct = (round / total) * 100;

      const sx = 110, sy = 50, sr = r * 8, sh = h * 6;
      container.innerHTML =
        lessonShell(lesson) +
        `<div class="panel">
          <h3>圆柱表面积 (${round}/${total})</h3>
          <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
          <p style="text-align:center;color:#636e72">π = 3.14，单位：平方厘米</p>
          <svg class="solid-svg" width="240" height="${sh + 100}" viewBox="0 0 240 ${sh + 100}">
            <ellipse cx="${sx}" cy="${sy}" rx="${sr}" ry="${sr * 0.3}" fill="#d1fdfa" stroke="#5f3dc4" stroke-width="2" />
            <line x1="${sx - sr}" y1="${sy}" x2="${sx - sr}" y2="${sy + sh}" stroke="#5f3dc4" stroke-width="2" />
            <line x1="${sx + sr}" y1="${sy}" x2="${sx + sr}" y2="${sy + sh}" stroke="#5f3dc4" stroke-width="2" />
            <ellipse cx="${sx}" cy="${sy + sh}" rx="${sr}" ry="${sr * 0.3}" fill="#f4f1ff" stroke="#5f3dc4" stroke-width="2" />
            <text x="${sx + sr + 8}" y="${sy + sh / 2 + 4}" font-family="ZCOOL KuaiLe" font-size="14" fill="#fd79a8">h = ${h}</text>
            <text x="${sx}" y="${sy + sh + 24}" text-anchor="middle" font-family="ZCOOL KuaiLe" font-size="14" fill="#fd79a8">r = ${r}</text>
          </svg>
          <p style="text-align:center;color:#636e72;font-size:14px">表面积 = 侧面积 + 2 × 底面积 = 2πr × h + 2πr²</p>
          <input type="number" step="0.01" class="answer-input answer-input--lg" id="ansCs" inputmode="decimal" placeholder="?" />
          <div class="btn-group" style="justify-content:center">
            <button type="button" class="btn btn-primary" id="btnCs">提交</button>
          </div>
          ${feedbackEl("fb-cs")}
        </div>`;
      const input = document.getElementById("ansCs");
      input.focus();
      function submit() {
        const val = parseFloat(input.value);
        if (approx(val, surf, 0.5)) {
          showFeedback("fb-cs", true, `对了！侧 ${side} + 双底 ${(base * 2).toFixed(2)} = ${surf}`);
          round++;
          if (round >= total) { addStars(3); markComplete("cylinderSurf"); return; }
          setTimeout(newRound, 1400);
        } else {
          showFeedback("fb-cs", false, `侧 2π·r·h = ${side}；底 πr² = ${base}；总 = ${surf}`);
        }
      }
      document.getElementById("btnCs").onclick = submit;
      input.onkeydown = (e) => { if (e.key === "Enter") submit(); };
    }
    newRound();
  }

  /* --- 圆柱体积 --- */
  function renderCylinderVol(lesson, container) {
    let round = 0;
    const total = 4;

    function newRound() {
      const r = randInt(2, 7);
      const h = randInt(3, 14);
      const v = +(3.14 * r * r * h).toFixed(2);
      const pct = (round / total) * 100;
      const sx = 110, sy = 50, sr = r * 8, sh = h * 6;
      container.innerHTML =
        lessonShell(lesson) +
        `<div class="panel">
          <h3>圆柱体积 (${round}/${total})</h3>
          <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
          <p style="text-align:center;color:#636e72">π = 3.14，单位：立方厘米</p>
          <svg class="solid-svg" width="240" height="${sh + 100}" viewBox="0 0 240 ${sh + 100}">
            <ellipse cx="${sx}" cy="${sy}" rx="${sr}" ry="${sr * 0.3}" fill="#d1fdfa" stroke="#5f3dc4" stroke-width="2" />
            <line x1="${sx - sr}" y1="${sy}" x2="${sx - sr}" y2="${sy + sh}" stroke="#5f3dc4" stroke-width="2" />
            <line x1="${sx + sr}" y1="${sy}" x2="${sx + sr}" y2="${sy + sh}" stroke="#5f3dc4" stroke-width="2" />
            <ellipse cx="${sx}" cy="${sy + sh}" rx="${sr}" ry="${sr * 0.3}" fill="#f4f1ff" stroke="#5f3dc4" stroke-width="2" />
            <text x="${sx + sr + 8}" y="${sy + sh / 2 + 4}" font-family="ZCOOL KuaiLe" font-size="14" fill="#fd79a8">h = ${h}</text>
            <text x="${sx}" y="${sy + sh + 24}" text-anchor="middle" font-family="ZCOOL KuaiLe" font-size="14" fill="#fd79a8">r = ${r}</text>
          </svg>
          <p style="text-align:center;color:#636e72;font-size:14px">V = πr² × h = 3.14 × ${r}² × ${h}</p>
          <input type="number" step="0.01" class="answer-input answer-input--lg" id="ansCv" inputmode="decimal" placeholder="?" />
          <div class="btn-group" style="justify-content:center">
            <button type="button" class="btn btn-primary" id="btnCv">提交</button>
          </div>
          ${feedbackEl("fb-cv")}
        </div>`;
      const input = document.getElementById("ansCv");
      input.focus();
      function submit() {
        const val = parseFloat(input.value);
        if (approx(val, v, 0.5)) {
          showFeedback("fb-cv", true, `对了！V = ${v}`);
          round++;
          if (round >= total) { addStars(3); markComplete("cylinderVol"); return; }
          setTimeout(newRound, 1300);
        } else {
          showFeedback("fb-cv", false, `V = 3.14 × ${r} × ${r} × ${h} = ${v}`);
        }
      }
      document.getElementById("btnCv").onclick = submit;
      input.onkeydown = (e) => { if (e.key === "Enter") submit(); };
    }
    newRound();
  }

  /* --- 圆锥体积 --- */
  function renderConeVol(lesson, container) {
    let round = 0;
    const total = 4;

    function newRound() {
      const r = randInt(2, 7);
      // 让体积是整数
      let h = randInt(3, 15);
      while ((3.14 * r * r * h / 3) % 1 !== 0 && (3.14 * r * r * h / 3).toFixed(2).endsWith("00")) h++;
      const v = +(3.14 * r * r * h / 3).toFixed(2);
      const pct = (round / total) * 100;
      const sx = 110, sy = 40, sr = r * 8, sh = h * 6;
      container.innerHTML =
        lessonShell(lesson) +
        `<div class="panel">
          <h3>圆锥体积 (${round}/${total})</h3>
          <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
          <p style="text-align:center;color:#636e72">π = 3.14，单位：立方厘米</p>
          <svg class="solid-svg" width="240" height="${sh + 100}" viewBox="0 0 240 ${sh + 100}">
            <polygon points="${sx},${sy} ${sx - sr},${sy + sh} ${sx + sr},${sy + sh}" fill="#f4f1ff" stroke="#5f3dc4" stroke-width="2" />
            <ellipse cx="${sx}" cy="${sy + sh}" rx="${sr}" ry="${sr * 0.3}" fill="#d1fdfa" stroke="#5f3dc4" stroke-width="2" />
            <line x1="${sx}" y1="${sy}" x2="${sx}" y2="${sy + sh}" stroke="#fd79a8" stroke-width="2" stroke-dasharray="3 3" />
            <text x="${sx + 6}" y="${sy + sh / 2 + 4}" font-family="ZCOOL KuaiLe" font-size="14" fill="#fd79a8">h = ${h}</text>
            <text x="${sx}" y="${sy + sh + 24}" text-anchor="middle" font-family="ZCOOL KuaiLe" font-size="14" fill="#fd79a8">r = ${r}</text>
          </svg>
          <p style="text-align:center;color:#636e72;font-size:14px">V = ⅓ × πr² × h</p>
          <input type="number" step="0.01" class="answer-input answer-input--lg" id="ansCoV" inputmode="decimal" placeholder="?" />
          <div class="btn-group" style="justify-content:center">
            <button type="button" class="btn btn-primary" id="btnCoV">提交</button>
          </div>
          ${feedbackEl("fb-co")}
        </div>`;
      const input = document.getElementById("ansCoV");
      input.focus();
      function submit() {
        const val = parseFloat(input.value);
        if (approx(val, v, 0.5)) {
          showFeedback("fb-co", true, `对了！V = ${v}`);
          round++;
          if (round >= total) { addStars(3); markComplete("coneVol"); return; }
          setTimeout(newRound, 1300);
        } else {
          showFeedback("fb-co", false, `V = (1/3) × 3.14 × ${r}² × ${h} = ${v}`);
        }
      }
      document.getElementById("btnCoV").onclick = submit;
      input.onkeydown = (e) => { if (e.key === "Enter") submit(); };
    }
    newRound();
  }

  /* --- 正反比例 --- */
  function renderProportion(lesson, container) {
    let round = 0;
    const total = 5;

    function newRound() {
      const cases = [
        { text: "买苹果的总价和数量（单价不变）", ans: "正比例", reason: "总价 / 数量 = 单价（不变）" },
        { text: "工程总量一定，工作效率与所需时间", ans: "反比例", reason: "效率 × 时间 = 工程量（不变）" },
        { text: "圆的周长和它的半径", ans: "正比例", reason: "C / r = 2π（不变）" },
        { text: "汽车行驶速度一定时，时间和路程", ans: "正比例", reason: "路程 / 时间 = 速度（不变）" },
        { text: "长方形面积一定，长和宽", ans: "反比例", reason: "长 × 宽 = 面积（不变）" },
        { text: "人的年龄和体重", ans: "都不是", reason: "比值与乘积都不固定" },
        { text: "正方形的边长和周长", ans: "正比例", reason: "周长 / 边长 = 4（不变）" },
        { text: "圆柱体积一定，底面积和高", ans: "反比例", reason: "底面积 × 高 = 体积（不变）" },
      ];
      const c = cases[randInt(0, cases.length - 1)];
      const pct = (round / total) * 100;
      container.innerHTML =
        lessonShell(lesson) +
        `<div class="panel">
          <h3>正比例还是反比例？(${round}/${total})</h3>
          <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
          <p style="text-align:center;line-height:1.8">${c.text}</p>
          <p style="text-align:center;color:#636e72;font-size:14px">比值不变 = 正比例；乘积不变 = 反比例</p>
          <div class="pattern-options">
            <button type="button" class="pattern-opt" data-a="正比例">正比例</button>
            <button type="button" class="pattern-opt" data-a="反比例">反比例</button>
            <button type="button" class="pattern-opt" data-a="都不是">都不是</button>
          </div>
          ${feedbackEl("fb-pr")}
        </div>`;
      document.querySelectorAll(".pattern-opt").forEach((btn) => {
        btn.onclick = () => {
          if (btn.dataset.a === c.ans) {
            btn.classList.add("correct");
            showFeedback("fb-pr", true, `对了！${c.reason}`);
            round++;
            if (round >= total) { addStars(2); markComplete("proportion"); return; }
            setTimeout(newRound, 1400);
          } else {
            btn.classList.add("wrong");
            showFeedback("fb-pr", false, `提示：${c.reason}`);
          }
        };
      });
    }
    newRound();
  }

  /* --- 解比例 --- */
  function renderSolveProp(lesson, container) {
    let score = 0;
    const total = 6;
    let current = null;

    function gen() {
      // a : b = c : x => x = bc/a
      const k = randInt(2, 7);
      const a = randInt(2, 9);
      const b = randInt(2, 9);
      const c = a * k;
      const x = b * k;
      // 随机放 x 的位置
      const pos = randInt(0, 3);
      let display, ans;
      if (pos === 0) { display = `x : ${b} = ${c} : ${x}`; ans = a; }
      else if (pos === 1) { display = `${a} : x = ${c} : ${x}`; ans = b; }
      else if (pos === 2) { display = `${a} : ${b} = x : ${x}`; ans = c; }
      else { display = `${a} : ${b} = ${c} : x`; ans = x; }
      return { display, ans };
    }

    function draw() {
      current = gen();
      const pct = (score / total) * 100;
      container.innerHTML =
        lessonShell(lesson) +
        `<div class="panel">
          <h3>解比例 (${score}/${total})</h3>
          <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
          <div class="quiz-display">${current.display}</div>
          <p style="text-align:center;color:#636e72;font-size:14px">两个内项之积 = 两个外项之积</p>
          <p style="text-align:center;font-family:var(--font-display);font-size:1.6rem;color:var(--primary)">x = <input type="number" class="answer-input answer-input--sm" id="ansSp" inputmode="numeric" placeholder="?" style="display:inline-block;margin:0 8px" /></p>
          <div class="btn-group" style="justify-content:center">
            <button type="button" class="btn btn-primary" id="btnSp">提交</button>
          </div>
          ${feedbackEl("fb-sp")}
        </div>`;
      const input = document.getElementById("ansSp");
      input.focus();
      function submit() {
        const val = parseInt(input.value, 10);
        if (val === current.ans) {
          score++;
          showFeedback("fb-sp", true, `对了！x = ${current.ans}`);
          if (score >= total) { addStars(3); markComplete("solveProp"); return; }
          setTimeout(draw, 1000);
        } else {
          showFeedback("fb-sp", false, `x = ${current.ans}（内项之积 = 外项之积）`);
        }
      }
      document.getElementById("btnSp").onclick = submit;
      input.onkeydown = (e) => { if (e.key === "Enter") submit(); };
    }
    draw();
  }

  /* --- 扇形统计图 --- */
  function renderPieChart(lesson, container) {
    let round = 0;
    const total = 5;

    function newRound() {
      // 生成 3~4 类，百分比和为 100
      const cats = pick(["语文 📘", "数学 📕", "英语 📗", "体育 ⚽", "美术 🎨", "音乐 🎵"], 4);
      let parts = [];
      let remaining = 100;
      for (let i = 0; i < 3; i++) {
        const v = randInt(10, Math.min(40, remaining - 10 * (3 - i)));
        parts.push(v); remaining -= v;
      }
      parts.push(remaining);
      parts = shuffle(parts);
      const data = cats.map((c, i) => ({ label: c, pct: parts[i] }));

      // SVG pie
      const cx = 110, cy = 110, R = 80;
      let angle = -90;
      const colors = ["#5f3dc4", "#00cec9", "#fd79a8", "#fdcb6e"];
      let svg = `<svg class="pie-svg" width="240" height="240" viewBox="0 0 240 240">`;
      data.forEach((d, i) => {
        const sweep = (d.pct / 100) * 360;
        const startA = (angle * Math.PI) / 180;
        const endA = ((angle + sweep) * Math.PI) / 180;
        const x1 = cx + R * Math.cos(startA);
        const y1 = cy + R * Math.sin(startA);
        const x2 = cx + R * Math.cos(endA);
        const y2 = cy + R * Math.sin(endA);
        const large = sweep > 180 ? 1 : 0;
        svg += `<path d="M ${cx} ${cy} L ${x1} ${y1} A ${R} ${R} 0 ${large} 1 ${x2} ${y2} Z" fill="${colors[i % colors.length]}" stroke="#fff" stroke-width="2" />`;
        // label
        const midA = ((angle + sweep / 2) * Math.PI) / 180;
        const tx = cx + (R + 14) * Math.cos(midA);
        const ty = cy + (R + 14) * Math.sin(midA);
        svg += `<text x="${tx}" y="${ty + 4}" text-anchor="middle" font-family="ZCOOL KuaiLe" font-size="13" fill="#2d3436">${d.pct}%</text>`;
        angle += sweep;
      });
      svg += "</svg>";

      // Question modes
      const mode = randInt(0, 1);
      const pct = (round / total) * 100;

      if (mode === 0) {
        // 找最大类
        const max = data.reduce((a, b) => a.pct >= b.pct ? a : b);
        container.innerHTML =
          lessonShell(lesson) +
          `<div class="panel">
            <h3>读扇形统计图 (${round}/${total})</h3>
            <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
            ${svg}
            <ul style="display:grid;grid-template-columns:repeat(2,1fr);gap:6px;max-width:380px;margin:0 auto;list-style:none;padding:0">
              ${data.map((d, i) => `<li style="font-size:14px"><span style="display:inline-block;width:14px;height:14px;background:${colors[i % colors.length]};vertical-align:middle;border-radius:3px;margin-right:6px"></span>${d.label} ${d.pct}%</li>`).join("")}
            </ul>
            <p style="text-align:center;line-height:1.7;margin-top:14px">哪一类占比最大？</p>
            <div class="pattern-options" id="pieOpts"></div>
            ${feedbackEl("fb-pie")}
          </div>`;
        shuffle(data.map((x) => x.label)).forEach((lb) => {
          const btn = document.createElement("button");
          btn.type = "button";
          btn.className = "pattern-opt";
          btn.textContent = lb;
          btn.onclick = () => {
            if (lb === max.label) {
              btn.classList.add("correct");
              showFeedback("fb-pie", true, `对了！${max.label} 占 ${max.pct}%，最大。`);
              round++;
              if (round >= total) { addStars(2); markComplete("pieChart"); return; }
              setTimeout(newRound, 1300);
            } else {
              btn.classList.add("wrong");
              showFeedback("fb-pie", false, "找百分数最大的那一类。");
            }
          };
          document.getElementById("pieOpts").appendChild(btn);
        });
      } else {
        // 给总人数，求某类人数
        const totals = [100, 200, 400, 500, 800, 1000];
        const t = totals[randInt(0, totals.length - 1)];
        const askIdx = randInt(0, data.length - 1);
        const askData = data[askIdx];
        const ans = +(t * askData.pct / 100).toFixed(2);
        if (!Number.isInteger(ans)) return newRound();
        container.innerHTML =
          lessonShell(lesson) +
          `<div class="panel">
            <h3>扇形图计算 (${round}/${total})</h3>
            <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
            ${svg}
            <ul style="display:grid;grid-template-columns:repeat(2,1fr);gap:6px;max-width:380px;margin:0 auto;list-style:none;padding:0">
              ${data.map((d, i) => `<li style="font-size:14px"><span style="display:inline-block;width:14px;height:14px;background:${colors[i % colors.length]};vertical-align:middle;border-radius:3px;margin-right:6px"></span>${d.label} ${d.pct}%</li>`).join("")}
            </ul>
            <p style="text-align:center;line-height:1.7;margin-top:14px">学校一共 <b>${t}</b> 人参与问卷，<b>${askData.label}</b> 占 ${askData.pct}%，有多少人？</p>
            <input type="number" class="answer-input answer-input--sm" id="ansPie" inputmode="numeric" placeholder="?" />
            <div class="btn-group" style="justify-content:center">
              <button type="button" class="btn btn-primary" id="btnPie">提交</button>
            </div>
            ${feedbackEl("fb-pie")}
          </div>`;
        const input = document.getElementById("ansPie");
        input.focus();
        function submit() {
          const val = parseInt(input.value, 10);
          if (val === ans) {
            showFeedback("fb-pie", true, `对了！${t} × ${askData.pct}% = ${ans}`);
            round++;
            if (round >= total) { addStars(2); markComplete("pieChart"); return; }
            setTimeout(newRound, 1300);
          } else {
            showFeedback("fb-pie", false, `${t} × ${askData.pct}% = ${ans}`);
          }
        }
        document.getElementById("btnPie").onclick = submit;
        input.onkeydown = (e) => { if (e.key === "Enter") submit(); };
      }
    }
    newRound();
  }

  /* --- 鸽巢问题 --- */
  function renderPigeon(lesson, container) {
    let round = 0;
    const total = 4;

    function newRound() {
      const drawers = randInt(3, 6);
      const items = drawers * randInt(2, 4) + randInt(1, drawers); // ensure overcrowded
      const ans = Math.ceil(items / drawers);
      const pct = (round / total) * 100;
      const choices = shuffle([ans, ans - 1, ans + 1, ans + 2].filter((x) => x >= 1));

      // Visual
      const items_visual = "🟦".repeat(items);
      let drawerVis = '<div class="pigeon-grid">';
      for (let i = 0; i < drawers; i++) {
        drawerVis += `<div class="pigeon-box"><span style="font-size:1.6rem">📦</span><span class="label">抽屉 ${i + 1}</span></div>`;
      }
      drawerVis += "</div>";

      container.innerHTML =
        lessonShell(lesson) +
        `<div class="panel">
          <h3>鸽巢问题 (${round}/${total})</h3>
          <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
          <p style="text-align:center;line-height:1.8">把 <b style="color:var(--primary)">${items}</b> 个物品 ${items_visual.length > 20 ? "" : items_visual} <br>放进 <b style="color:var(--primary)">${drawers}</b> 个抽屉里。</p>
          ${drawerVis}
          <p style="text-align:center;line-height:1.7">无论怎么放，至少有 <b>1</b> 个抽屉里有 <b>至少几个</b>？</p>
          <p style="text-align:center;color:#636e72;font-size:14px">⌈ ${items} ÷ ${drawers} ⌉ = ?</p>
          <div class="pattern-options" id="pgOpts"></div>
          ${feedbackEl("fb-pg")}
        </div>`;
      [...new Set(choices)].slice(0, 4).forEach((c) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "pattern-opt";
        btn.textContent = c + " 个";
        btn.onclick = () => {
          if (c === ans) {
            btn.classList.add("correct");
            showFeedback("fb-pg", true, `对了！${items} ÷ ${drawers} = ${Math.floor(items / drawers)} 余 ${items % drawers}，至少 ${ans} 个。`);
            round++;
            if (round >= total) { addStars(3); markComplete("pigeon"); return; }
            setTimeout(newRound, 1400);
          } else {
            btn.classList.add("wrong");
            showFeedback("fb-pg", false, `先尽量平均分，有余数就 +1：⌈ ${items}/${drawers} ⌉ = ${ans}`);
          }
        };
        document.getElementById("pgOpts").appendChild(btn);
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
