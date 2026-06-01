(function () {
  const STORAGE_KEY = "math-grade4-progress";

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
    const colors = ["#6c5ce7", "#74b9ff", "#fd79a8", "#fdcb6e", "#00cec9"];
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

  function feedbackEl(id) {
    return `<div class="feedback" id="${id}"></div>`;
  }

  function showFeedback(id, ok, text) {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = text;
    el.className = "feedback show " + (ok ? "success" : "error");
  }

  function renderLesson(id, container) {
    const lesson = LESSONS.find((l) => l.id === id);
    if (!lesson) return;
    const renderers = {
      bigNumber: renderBigNumber,
      mul2x3: renderMul2x3,
      div2: renderDiv2,
      areaBig: renderAreaBig,
      angle4: renderAngle4,
      parallel: renderParallel,
      ops4: renderOps4,
      lawAdd: renderLawAdd,
      lawMul: renderLawMul,
      decimalMean: renderDecimalMean,
      decimalAddSub: renderDecimalAddSub,
      triangle: renderTriangle,
      view: renderView,
      lineChart: renderLineChart,
      chicken: renderChicken,
      average: renderAverage,
    };
    renderers[id]?.(lesson, container);
  }

  /* --- 大数的认识：读数 / 改写 --- */
  function renderBigNumber(lesson, container) {
    let round = 0;
    const total = 6;

    function digitDisplay(num) {
      const s = num.toString().padStart(12, " ");
      const labels = ["千", "百", "十", "亿", "千", "百", "十", "万", "千", "百", "十", "个"];
      let html = '<div class="digit-grid">';
      labels.forEach((lb) => {
        html += `<div class="digit-cell tag">${lb}</div>`;
      });
      for (let i = 0; i < 12; i++) {
        const ch = s[i];
        const cls = i < 4 ? "hundred-million-grp" : i < 8 ? "ten-thousand-grp" : "";
        html += `<div class="digit-cell ${cls}">${ch === " " ? "·" : ch}</div>`;
      }
      html += "</div>";
      return html;
    }

    function makeNum() {
      // 4~10 digit numbers
      const len = randInt(5, 9);
      let n = randInt(1, 9);
      for (let i = 1; i < len; i++) n = n * 10 + randInt(0, 9);
      return n;
    }

    function format(n) {
      return n.toString().replace(/\B(?=(\d{4})+(?!\d))/g, " ");
    }

    function newRound() {
      const mode = randInt(0, 1);
      const pct = (round / total) * 100;
      if (mode === 0) {
        // 改写成万或亿
        const useYi = Math.random() > 0.5;
        const baseUnit = useYi ? 100000000 : 10000;
        const factor = randInt(2, 99);
        const num = factor * baseUnit;
        const unit = useYi ? "亿" : "万";
        const ansText = `${factor}${unit}`;
        container.innerHTML =
          lessonShell(lesson) +
          `<div class="panel">
            <h3>改写成"用${unit}作单位的数" (${round}/${total})</h3>
            <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
            <p style="text-align:center;color:#636e72">把下面的数改写：</p>
            ${digitDisplay(num)}
            <p style="text-align:center;font-family:var(--font-display);font-size:1.5rem;color:var(--primary)">${format(num)} = ?</p>
            <p style="text-align:center;color:#636e72;font-size:14px">输入纯数字部分（如 25 表示 25${unit}）</p>
            <input type="number" class="answer-input" id="ansBn" inputmode="numeric" placeholder="?" />
            <p style="text-align:center;font-family:var(--font-display);font-size:1.2rem;color:var(--text-muted)">单位：${unit}</p>
            <div class="btn-group" style="justify-content:center">
              <button type="button" class="btn btn-primary" id="btnBn">提交</button>
            </div>
            ${feedbackEl("fb-bn")}
          </div>`;
        const input = document.getElementById("ansBn");
        input.focus();
        document.getElementById("btnBn").onclick = () => {
          const val = parseInt(input.value, 10);
          if (val === factor) {
            showFeedback("fb-bn", true, `对了！${format(num)} = ${ansText}`);
            round++;
            if (round >= total) {
              addStars(3);
              markComplete("bigNumber");
              return;
            }
            setTimeout(newRound, 1300);
          } else {
            showFeedback("fb-bn", false, `${unit}级以下都是 0，所以等于 ${ansText}`);
          }
        };
        input.onkeydown = (e) => { if (e.key === "Enter") document.getElementById("btnBn").click(); };
      } else {
        // 找数位
        const num = makeNum();
        const s = num.toString();
        const idx = randInt(0, s.length - 1);
        const digit = s[idx];
        const placeFromRight = s.length - 1 - idx;
        const places = ["个", "十", "百", "千", "万", "十万", "百万", "千万", "亿", "十亿"];
        const placeName = places[placeFromRight];
        const opts = shuffle(pick(places.slice(0, Math.min(s.length, 10)), 4));
        if (!opts.includes(placeName)) {
          opts[0] = placeName;
          shuffle(opts);
        }
        container.innerHTML =
          lessonShell(lesson) +
          `<div class="panel">
            <h3>数位辨认 (${round}/${total})</h3>
            <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
            ${digitDisplay(num)}
            <p style="text-align:center;font-family:var(--font-display);font-size:1.5rem;color:var(--primary)">${format(num)}</p>
            <p style="text-align:center">数字 <b style="color:var(--accent);font-size:1.4rem">${digit}</b> 在哪一位？</p>
            <div class="pattern-options" id="placeOpts"></div>
            ${feedbackEl("fb-bn")}
          </div>`;
        [...new Set(opts)].slice(0, 4).forEach((opt) => {
          const btn = document.createElement("button");
          btn.type = "button";
          btn.className = "pattern-opt";
          btn.textContent = opt + "位";
          btn.onclick = () => {
            if (opt === placeName) {
              btn.classList.add("correct");
              showFeedback("fb-bn", true, `对了！数字 ${digit} 在${placeName}位上。`);
              round++;
              if (round >= total) {
                addStars(3);
                markComplete("bigNumber");
                return;
              }
              setTimeout(newRound, 1200);
            } else {
              btn.classList.add("wrong");
              showFeedback("fb-bn", false, "从右往左数：个、十、百、千、万…");
            }
          };
          document.getElementById("placeOpts").appendChild(btn);
        });
      }
    }
    newRound();
  }

  /* --- 三位数乘两位数 --- */
  function renderMul2x3(lesson, container) {
    let score = 0;
    const total = 8;
    let current = null;

    function gen() {
      const a = randInt(101, 599);
      const b = randInt(12, 49);
      return { text: `${a} × ${b}`, ans: a * b, a, b };
    }

    function draw() {
      current = gen();
      const pct = (score / total) * 100;
      container.innerHTML =
        lessonShell(lesson) +
        `<div class="panel">
          <h3>三位数乘两位数 (${score}/${total})</h3>
          <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
          <div class="calc-wrap">
            <div class="vertical-calc">
              <div>&nbsp;&nbsp;${current.a}</div>
              <div><span class="op">×</span>${current.b}</div>
              <div class="line">&nbsp;</div>
            </div>
          </div>
          <input type="number" class="answer-input answer-input--lg" id="ansMul" inputmode="numeric" placeholder="?" />
          <div class="btn-group" style="justify-content:center">
            <button type="button" class="btn btn-primary" id="btnMul">提交</button>
          </div>
          ${feedbackEl("fb-mul")}
        </div>`;
      const input = document.getElementById("ansMul");
      input.focus();
      function submit() {
        const val = parseInt(input.value, 10);
        if (isNaN(val)) {
          showFeedback("fb-mul", false, "请输入数字。");
          return;
        }
        if (val === current.ans) {
          score++;
          showFeedback("fb-mul", true, "正确！");
          if (score >= total) {
            addStars(3);
            markComplete("mul2x3");
            return;
          }
          setTimeout(draw, 800);
        } else {
          showFeedback("fb-mul", false, `${current.text} = ${current.ans}`);
        }
      }
      document.getElementById("btnMul").onclick = submit;
      input.onkeydown = (e) => { if (e.key === "Enter") submit(); };
    }
    draw();
  }

  /* --- 除数是两位数的除法 --- */
  function renderDiv2(lesson, container) {
    let round = 0;
    const total = 6;
    let current = null;

    function gen() {
      const b = randInt(12, 49);
      const q = randInt(11, 99);
      const r = Math.random() > 0.4 ? randInt(1, b - 1) : 0;
      const a = b * q + r;
      return { a, b, q, r };
    }

    function draw() {
      current = gen();
      const hasR = current.r > 0;
      const pct = (round / total) * 100;
      container.innerHTML =
        lessonShell(lesson) +
        `<div class="panel">
          <h3>两位数除法 (${round}/${total})</h3>
          <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
          <div class="quiz-display">${current.a} ÷ ${current.b} = ? ${hasR ? "…… ?" : ""}</div>
          <p style="text-align:center;color:#636e72;font-size:14px">把 ${current.b} 看作 ${Math.round(current.b / 10) * 10} 来试商</p>
          <div class="dual-input">
            <label>商 <input type="number" class="answer-input answer-input--sm" id="divQ" inputmode="numeric" /></label>
            ${hasR ? '<label>余数 <input type="number" class="answer-input answer-input--sm" id="divR" inputmode="numeric" /></label>' : ""}
          </div>
          <div class="btn-group" style="justify-content:center">
            <button type="button" class="btn btn-primary" id="btnDiv">提交</button>
          </div>
          ${feedbackEl("fb-div")}
        </div>`;
      document.getElementById("divQ").focus();
      document.getElementById("btnDiv").onclick = () => {
        const q = parseInt(document.getElementById("divQ").value, 10);
        const r = hasR ? parseInt(document.getElementById("divR").value, 10) : 0;
        if (isNaN(q) || (hasR && isNaN(r))) {
          showFeedback("fb-div", false, "请填写完整。");
          return;
        }
        if (q === current.q && r === current.r) {
          showFeedback("fb-div", true, `对了！${current.a}÷${current.b}=${current.q}${hasR ? "……" + current.r : ""}`);
          round++;
          if (round >= total) {
            addStars(3);
            markComplete("div2");
            return;
          }
          setTimeout(draw, 1100);
        } else {
          showFeedback("fb-div", false, `验算：${current.b} × ${current.q}${hasR ? " + " + current.r : ""} = ${current.a}`);
        }
      };
    }
    draw();
  }

  /* --- 公顷与平方千米 --- */
  function renderAreaBig(lesson, container) {
    let round = 0;
    const total = 6;

    function newRound() {
      const conv = [
        { q: "1 公顷 = ? 平方米", a: 10000, h: "1 公顷 = 10000 平方米" },
        { q: "1 平方千米 = ? 公顷", a: 100, h: "1 平方千米 = 100 公顷" },
        { q: "1 平方千米 = ? 平方米", a: 1000000, h: "1 平方千米 = 1000000 平方米" },
        { q: "3 公顷 = ? 平方米", a: 30000, h: "3 × 10000 = 30000" },
        { q: "5 平方千米 = ? 公顷", a: 500, h: "5 × 100 = 500" },
        { q: "50000 平方米 = ? 公顷", a: 5, h: "50000 ÷ 10000 = 5" },
        { q: "200 公顷 = ? 平方千米", a: 2, h: "200 ÷ 100 = 2" },
      ];
      const c = conv[randInt(0, conv.length - 1)];
      const pct = (round / total) * 100;
      container.innerHTML =
        lessonShell(lesson) +
        `<div class="panel">
          <h3>大面积单位换算 (${round}/${total})</h3>
          <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
          <div class="quiz-display">${c.q}</div>
          <p style="text-align:center;color:#636e72;font-size:14px">小→大除以进率，大→小乘以进率</p>
          <input type="number" class="answer-input answer-input--lg" id="ansAb" inputmode="numeric" placeholder="?" />
          <div class="btn-group" style="justify-content:center">
            <button type="button" class="btn btn-primary" id="btnAb">提交</button>
          </div>
          ${feedbackEl("fb-ab")}
        </div>`;
      const input = document.getElementById("ansAb");
      input.focus();
      function submit() {
        const val = parseInt(input.value, 10);
        if (val === c.a) {
          showFeedback("fb-ab", true, `对了！${c.h}`);
          round++;
          if (round >= total) {
            addStars(2);
            markComplete("areaBig");
            return;
          }
          setTimeout(newRound, 1100);
        } else {
          showFeedback("fb-ab", false, c.h);
        }
      }
      document.getElementById("btnAb").onclick = submit;
      input.onkeydown = (e) => { if (e.key === "Enter") submit(); };
    }
    newRound();
  }

  /* --- 角的度量 --- */
  function renderAngle4(lesson, container) {
    let round = 0;
    const total = 6;

    function classify(deg) {
      if (deg === 0) return "零角";
      if (deg < 90) return "锐角";
      if (deg === 90) return "直角";
      if (deg < 180) return "钝角";
      if (deg === 180) return "平角";
      if (deg === 360) return "周角";
      return "钝角";
    }

    function arcPath(deg) {
      const r = 70;
      const cx = 100;
      const cy = 100;
      const rad = (deg * Math.PI) / 180;
      const x2 = cx + r * Math.cos(-rad);
      const y2 = cy + r * Math.sin(-rad);
      const large = deg > 180 ? 1 : 0;
      return `M ${cx} ${cy} L ${cx + r} ${cy} A ${r} ${r} 0 ${large} 0 ${x2} ${y2} Z`;
    }

    function newRound() {
      const presets = [30, 45, 60, 90, 120, 135, 150, 180, 360];
      const deg = presets[randInt(0, presets.length - 1)];
      const label = classify(deg);
      const pct = (round / total) * 100;

      container.innerHTML =
        lessonShell(lesson) +
        `<div class="panel">
          <h3>这是什么角？(${round}/${total})</h3>
          <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
          <svg class="shape-canvas" width="220" height="200" viewBox="0 0 220 200">
            <path d="${arcPath(deg)}" fill="#efeaff" stroke="#6c5ce7" stroke-width="3" />
            <line x1="100" y1="100" x2="180" y2="100" stroke="#6c5ce7" stroke-width="4" stroke-linecap="round" />
            <line x1="100" y1="100" x2="${100 + 80 * Math.cos((-deg * Math.PI) / 180)}" y2="${100 + 80 * Math.sin((-deg * Math.PI) / 180)}" stroke="#fd79a8" stroke-width="4" stroke-linecap="round" />
            <circle cx="100" cy="100" r="4" fill="#2d3436" />
            <text x="110" y="180" font-family="ZCOOL KuaiLe" font-size="18" fill="#6c5ce7">${deg}°</text>
          </svg>
          <div class="pattern-options" id="angOpts"></div>
          ${feedbackEl("fb-ang")}
        </div>`;
      shuffle(["锐角", "直角", "钝角", "平角", "周角"]).forEach((opt) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "pattern-opt";
        btn.textContent = opt;
        btn.onclick = () => {
          if (opt === label) {
            btn.classList.add("correct");
            showFeedback("fb-ang", true, `对了！${deg}° 是${label}。`);
            round++;
            if (round >= total) {
              addStars(2);
              markComplete("angle4");
              return;
            }
            setTimeout(newRound, 1200);
          } else {
            btn.classList.add("wrong");
            showFeedback("fb-ang", false, "和 90°、180°、360° 比一比。");
          }
        };
        document.getElementById("angOpts").appendChild(btn);
      });
    }
    newRound();
  }

  /* --- 平行四边形和梯形 --- */
  function renderParallel(lesson, container) {
    let round = 0;
    const total = 6;

    const shapes = [
      { name: "平行四边形", svg: '<polygon points="40,90 130,90 160,30 70,30" />' },
      { name: "梯形", svg: '<polygon points="30,90 170,90 140,30 60,30" />' },
      { name: "长方形", svg: '<rect x="40" y="30" width="120" height="60" />' },
      { name: "正方形", svg: '<rect x="60" y="30" width="80" height="80" />' },
    ];

    function newRound() {
      const s = shapes[randInt(0, shapes.length - 1)];
      const wrongs = pick(shapes.filter((x) => x.name !== s.name), 2);
      const opts = shuffle([s, ...wrongs]);
      const pct = (round / total) * 100;

      container.innerHTML =
        lessonShell(lesson) +
        `<div class="panel">
          <h3>看图选名称 (${round}/${total})</h3>
          <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
          <svg class="shape-canvas" width="200" height="120" viewBox="0 0 200 120">
            <g fill="#efeaff" stroke="#6c5ce7" stroke-width="3">${s.svg}</g>
          </svg>
          <div class="pattern-options" id="parOpts"></div>
          ${feedbackEl("fb-par")}
        </div>`;
      opts.forEach((opt) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "pattern-opt";
        btn.textContent = opt.name;
        btn.onclick = () => {
          if (opt.name === s.name) {
            btn.classList.add("correct");
            showFeedback("fb-par", true, `对了！这是${s.name}。`);
            round++;
            if (round >= total) {
              addStars(2);
              markComplete("parallel");
              return;
            }
            setTimeout(newRound, 1200);
          } else {
            btn.classList.add("wrong");
            showFeedback("fb-par", false, "看看对边是否平行、是否相等。");
          }
        };
        document.getElementById("parOpts").appendChild(btn);
      });
    }
    newRound();
  }

  /* --- 四则运算顺序 --- */
  function renderOps4(lesson, container) {
    let score = 0;
    const total = 8;
    let current = null;

    function safeEval(expr) {
      // Allow only digits, spaces, + - * / ( )
      if (!/^[0-9+\-*/().\s]+$/.test(expr)) return NaN;
      try { return Function(`"use strict"; return (${expr});`)(); } catch { return NaN; }
    }

    function gen() {
      const types = ["mix", "bracket"];
      const t = types[randInt(0, 1)];
      if (t === "mix") {
        const a = randInt(2, 20);
        const b = randInt(2, 9);
        const c = randInt(2, 20);
        const op1 = ["+", "-"][randInt(0, 1)];
        const op2 = ["*", "/"][randInt(0, 1)];
        const display = `${a} ${op1} ${b} ${op2 === "*" ? "×" : "÷"} ${c}`;
        // For /, force divisibility:
        if (op2 === "/") {
          const q = randInt(2, 9);
          const newB = q * c;
          const display2 = `${a} ${op1} ${newB} ÷ ${c}`;
          const ev = safeEval(`${a} ${op1} ${newB} / ${c}`);
          if (Number.isInteger(ev) && ev > 0) return { display: display2, ans: ev };
        }
        const ev = safeEval(`${a} ${op1} ${b} ${op2} ${c}`);
        if (Number.isInteger(ev) && ev > 0) return { display, ans: ev };
        return gen();
      }
      // bracket
      const a = randInt(10, 40);
      const b = randInt(3, 12);
      const c = randInt(2, 6);
      const op = ["*"][0];
      const display = `(${a} + ${b}) × ${c}`;
      return { display, ans: (a + b) * c };
    }

    function draw() {
      current = gen();
      const pct = (score / total) * 100;
      container.innerHTML =
        lessonShell(lesson) +
        `<div class="panel">
          <h3>按运算顺序计算 (${score}/${total})</h3>
          <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
          <div class="quiz-display">${current.display} = ?</div>
          <p style="text-align:center;color:#636e72;font-size:14px">先括号 → 再乘除 → 后加减</p>
          <input type="number" class="answer-input" id="ansOp" inputmode="numeric" placeholder="?" />
          <div class="btn-group" style="justify-content:center">
            <button type="button" class="btn btn-primary" id="btnOp">提交</button>
          </div>
          ${feedbackEl("fb-op")}
        </div>`;
      const input = document.getElementById("ansOp");
      input.focus();
      function submit() {
        const val = parseInt(input.value, 10);
        if (val === current.ans) {
          score++;
          showFeedback("fb-op", true, "正确！");
          if (score >= total) {
            addStars(3);
            markComplete("ops4");
            return;
          }
          setTimeout(draw, 800);
        } else {
          showFeedback("fb-op", false, `答案是 ${current.ans}，按 括号→乘除→加减 顺序算。`);
        }
      }
      document.getElementById("btnOp").onclick = submit;
      input.onkeydown = (e) => { if (e.key === "Enter") submit(); };
    }
    draw();
  }

  /* --- 加法运算定律 --- */
  function renderLawAdd(lesson, container) {
    let score = 0;
    const total = 6;

    function gen() {
      const t = randInt(0, 1);
      if (t === 0) {
        // 凑整：a + b + c，b+c=整百
        const c100 = [100, 200, 300, 400, 500][randInt(0, 4)];
        const b = randInt(10, c100 - 10);
        const c = c100 - b;
        const a = randInt(20, 200);
        return { text: `${a} + ${b} + ${c}`, ans: a + b + c, hint: `${b}+${c}=${c100}，结合律使计算更快` };
      } else {
        // 交换律：a + b vs b + a
        const a = randInt(100, 900);
        const b = randInt(100, 900);
        return { text: `${a} + ${b}`, ans: a + b, hint: `加法交换律：${a}+${b} = ${b}+${a}` };
      }
    }

    function draw() {
      const cur = gen();
      const pct = (score / total) * 100;
      container.innerHTML =
        lessonShell(lesson) +
        `<div class="panel">
          <h3>简便计算 (${score}/${total})</h3>
          <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
          <div class="quiz-display">${cur.text} = ?</div>
          <p style="text-align:center;color:#636e72;font-size:14px">${cur.hint}</p>
          <input type="number" class="answer-input" id="ansLa" inputmode="numeric" placeholder="?" />
          <div class="btn-group" style="justify-content:center">
            <button type="button" class="btn btn-primary" id="btnLa">提交</button>
          </div>
          ${feedbackEl("fb-la")}
        </div>`;
      const input = document.getElementById("ansLa");
      input.focus();
      function submit() {
        const val = parseInt(input.value, 10);
        if (val === cur.ans) {
          score++;
          showFeedback("fb-la", true, `对了！${cur.text} = ${cur.ans}`);
          if (score >= total) {
            addStars(2);
            markComplete("lawAdd");
            return;
          }
          setTimeout(draw, 900);
        } else {
          showFeedback("fb-la", false, `想想凑整：${cur.text} = ${cur.ans}`);
        }
      }
      document.getElementById("btnLa").onclick = submit;
      input.onkeydown = (e) => { if (e.key === "Enter") submit(); };
    }
    draw();
  }

  /* --- 乘法运算定律（含分配律） --- */
  function renderLawMul(lesson, container) {
    let score = 0;
    const total = 6;

    function gen() {
      const t = randInt(0, 2);
      if (t === 0) {
        // 25×4 / 125×8 凑整
        const pair = [[25, 4], [125, 8], [50, 2], [20, 5]][randInt(0, 3)];
        const k = randInt(3, 12);
        return { text: `${pair[0]} × ${k} × ${pair[1]}`, ans: pair[0] * k * pair[1], hint: `${pair[0]}×${pair[1]} = ${pair[0] * pair[1]}` };
      } else if (t === 1) {
        // 分配律: (a+b)×c
        const a = randInt(20, 80);
        const c = randInt(3, 9);
        const round = [100, 200, 300][randInt(0, 2)];
        const b = round - a;
        return { text: `(${a} + ${b}) × ${c}`, ans: (a + b) * c, hint: `${a}+${b}=${a + b}，乘 ${c} 更简单` };
      } else {
        // 分配律提取: a×c + b×c
        const c = randInt(3, 9);
        const a = randInt(20, 80);
        const round = [100, 200][randInt(0, 1)];
        const b = round - a;
        return { text: `${a} × ${c} + ${b} × ${c}`, ans: (a + b) * c, hint: `提取公因数：(${a}+${b})×${c} = ${a + b}×${c}` };
      }
    }

    function draw() {
      const cur = gen();
      const pct = (score / total) * 100;
      container.innerHTML =
        lessonShell(lesson) +
        `<div class="panel">
          <h3>巧用乘法定律 (${score}/${total})</h3>
          <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
          <div class="quiz-display">${cur.text} = ?</div>
          <p style="text-align:center;color:#636e72;font-size:14px">${cur.hint}</p>
          <input type="number" class="answer-input answer-input--lg" id="ansLm" inputmode="numeric" placeholder="?" />
          <div class="btn-group" style="justify-content:center">
            <button type="button" class="btn btn-primary" id="btnLm">提交</button>
          </div>
          ${feedbackEl("fb-lm")}
        </div>`;
      const input = document.getElementById("ansLm");
      input.focus();
      function submit() {
        const val = parseInt(input.value, 10);
        if (val === cur.ans) {
          score++;
          showFeedback("fb-lm", true, `对了！${cur.text} = ${cur.ans}`);
          if (score >= total) {
            addStars(3);
            markComplete("lawMul");
            return;
          }
          setTimeout(draw, 900);
        } else {
          showFeedback("fb-lm", false, `${cur.hint}，结果是 ${cur.ans}`);
        }
      }
      document.getElementById("btnLm").onclick = submit;
      input.onkeydown = (e) => { if (e.key === "Enter") submit(); };
    }
    draw();
  }

  /* --- 小数的意义和性质 --- */
  function renderDecimalMean(lesson, container) {
    let round = 0;
    const total = 6;

    function newRound() {
      const mode = randInt(0, 2);
      const pct = (round / total) * 100;
      if (mode === 0) {
        // 比大小
        const ints = [randInt(0, 9), randInt(0, 9)];
        const decs = [
          [randInt(0, 9), randInt(0, 9)],
          [randInt(0, 9), randInt(0, 9)],
        ];
        const a = parseFloat(`${ints[0]}.${decs[0][0]}${decs[0][1]}`);
        let b = parseFloat(`${ints[1]}.${decs[1][0]}${decs[1][1]}`);
        if (a === b) b = a + 0.01;
        const correct = a > b ? ">" : a < b ? "<" : "=";
        container.innerHTML =
          lessonShell(lesson) +
          `<div class="panel">
            <h3>小数比大小 (${round}/${total})</h3>
            <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
            <div class="quiz-display">${a.toFixed(2)} &nbsp;?&nbsp; ${b.toFixed(2)}</div>
            <p style="text-align:center;color:#636e72;font-size:14px">先比整数，整数相同再依次比小数位</p>
            <div class="pattern-options">
              <button type="button" class="pattern-opt" data-s=">">&gt;</button>
              <button type="button" class="pattern-opt" data-s="<">&lt;</button>
              <button type="button" class="pattern-opt" data-s="=">=</button>
            </div>
            ${feedbackEl("fb-dm")}
          </div>`;
        document.querySelectorAll(".pattern-opt").forEach((btn) => {
          btn.onclick = () => {
            if (btn.dataset.s === correct) {
              btn.classList.add("correct");
              showFeedback("fb-dm", true, "对了！");
              round++;
              if (round >= total) {
                addStars(2);
                markComplete("decimalMean");
                return;
              }
              setTimeout(newRound, 1100);
            } else {
              btn.classList.add("wrong");
              showFeedback("fb-dm", false, "从最高位比起。");
            }
          };
        });
      } else if (mode === 1) {
        // 数位识别
        const a = `${randInt(0, 9)}.${randInt(0, 9)}${randInt(0, 9)}${randInt(0, 9)}`;
        const idx = randInt(2, 4); // 2=十分位, 3=百分位, 4=千分位
        const places = { 2: "十分位", 3: "百分位", 4: "千分位" };
        const digit = a[idx];
        const correctPlace = places[idx];
        container.innerHTML =
          lessonShell(lesson) +
          `<div class="panel">
            <h3>小数数位 (${round}/${total})</h3>
            <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
            <div class="quiz-display">${a}</div>
            <p style="text-align:center">数字 <b style="color:var(--accent);font-size:1.6rem">${digit}</b> 在哪一位？</p>
            <div class="pattern-options" id="decPlace"></div>
            ${feedbackEl("fb-dm")}
          </div>`;
        shuffle(["十分位", "百分位", "千分位"]).forEach((opt) => {
          const btn = document.createElement("button");
          btn.type = "button";
          btn.className = "pattern-opt";
          btn.textContent = opt;
          btn.onclick = () => {
            if (opt === correctPlace) {
              btn.classList.add("correct");
              showFeedback("fb-dm", true, `对了！小数点后第${idx - 1}位是${correctPlace}。`);
              round++;
              if (round >= total) {
                addStars(2);
                markComplete("decimalMean");
                return;
              }
              setTimeout(newRound, 1100);
            } else {
              btn.classList.add("wrong");
              showFeedback("fb-dm", false, "小数点后依次是十分位、百分位、千分位。");
            }
          };
          document.getElementById("decPlace").appendChild(btn);
        });
      } else {
        // 性质：去 0 等值
        const digits = `${randInt(1, 9)}${randInt(1, 9)}`;
        const a = `0.${digits}`;
        const opts = shuffle([
          a, `0.${digits}0`, `0.${digits}00`, `0.0${digits}`, `${digits}.0`,
        ]);
        const correct = new Set([a, `0.${digits}0`, `0.${digits}00`]);
        container.innerHTML =
          lessonShell(lesson) +
          `<div class="panel">
            <h3>小数的性质 (${round}/${total})</h3>
            <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
            <p style="text-align:center">下面哪个数 <b>等于</b> ${a}？（小数末尾添 0 / 去 0 不变大小）</p>
            <div class="pattern-options" id="propOpts"></div>
            ${feedbackEl("fb-dm")}
          </div>`;
        [...new Set(opts)].forEach((opt) => {
          const btn = document.createElement("button");
          btn.type = "button";
          btn.className = "pattern-opt";
          btn.textContent = opt;
          btn.onclick = () => {
            if (correct.has(opt)) {
              btn.classList.add("correct");
              showFeedback("fb-dm", true, `对了！${opt} = ${a}（末尾添 0 不变大小）`);
              round++;
              if (round >= total) {
                addStars(2);
                markComplete("decimalMean");
                return;
              }
              setTimeout(newRound, 1200);
            } else {
              btn.classList.add("wrong");
              showFeedback("fb-dm", false, "只有末尾添 0 / 去 0 才不变大小。");
            }
          };
          document.getElementById("propOpts").appendChild(btn);
        });
      }
    }
    newRound();
  }

  /* --- 小数加减法 --- */
  function renderDecimalAddSub(lesson, container) {
    let score = 0;
    const total = 8;
    let current = null;

    function gen() {
      const isAdd = Math.random() > 0.5;
      const a = randInt(10, 999) / 10;
      const b = randInt(10, isAdd ? 500 : a * 10 - 1) / 10;
      if (isAdd) return { text: `${a.toFixed(1)} + ${b.toFixed(1)}`, ans: +(a + b).toFixed(1), op: "+" };
      return { text: `${a.toFixed(1)} − ${b.toFixed(1)}`, ans: +(a - b).toFixed(1), op: "−" };
    }

    function draw() {
      current = gen();
      const pct = (score / total) * 100;
      container.innerHTML =
        lessonShell(lesson) +
        `<div class="panel">
          <h3>小数加减法 (${score}/${total})</h3>
          <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
          <div class="quiz-display">${current.text} = ?</div>
          <p style="text-align:center;color:#636e72;font-size:14px">竖式时小数点对齐</p>
          <input type="number" step="0.1" class="answer-input" id="ansDas" inputmode="decimal" placeholder="?" />
          <div class="btn-group" style="justify-content:center">
            <button type="button" class="btn btn-primary" id="btnDas">提交</button>
          </div>
          ${feedbackEl("fb-das")}
        </div>`;
      const input = document.getElementById("ansDas");
      input.focus();
      function submit() {
        const val = parseFloat(input.value);
        if (Math.abs(val - current.ans) < 0.05) {
          score++;
          showFeedback("fb-das", true, "正确！");
          if (score >= total) {
            addStars(3);
            markComplete("decimalAddSub");
            return;
          }
          setTimeout(draw, 800);
        } else {
          showFeedback("fb-das", false, `${current.text} = ${current.ans}`);
        }
      }
      document.getElementById("btnDas").onclick = submit;
      input.onkeydown = (e) => { if (e.key === "Enter") submit(); };
    }
    draw();
  }

  /* --- 三角形 --- */
  function renderTriangle(lesson, container) {
    let round = 0;
    const total = 6;

    function newRound() {
      const mode = randInt(0, 1);
      const pct = (round / total) * 100;
      if (mode === 0) {
        // 求第三个角
        const a = randInt(20, 80);
        const b = randInt(20, 180 - a - 10);
        const c = 180 - a - b;
        container.innerHTML =
          lessonShell(lesson) +
          `<div class="panel">
            <h3>三角形内角和 (${round}/${total})</h3>
            <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
            <svg class="triangle-svg" width="240" height="180" viewBox="0 0 240 180">
              <polygon points="40,160 200,160 120,30" fill="#efeaff" stroke="#6c5ce7" stroke-width="3" />
              <text x="50" y="150" font-family="ZCOOL KuaiLe" font-size="18" fill="#2d3436">${a}°</text>
              <text x="180" y="150" font-family="ZCOOL KuaiLe" font-size="18" fill="#2d3436">${b}°</text>
              <text x="105" y="58" font-family="ZCOOL KuaiLe" font-size="18" fill="#fd79a8">?°</text>
            </svg>
            <p style="text-align:center;color:#636e72;font-size:14px">内角和 = 180°，所以 ? = 180 − ${a} − ${b}</p>
            <input type="number" class="answer-input answer-input--sm" id="ansTri" inputmode="numeric" placeholder="?" />
            <div class="btn-group" style="justify-content:center">
              <button type="button" class="btn btn-primary" id="btnTri">提交</button>
            </div>
            ${feedbackEl("fb-tri")}
          </div>`;
        const input = document.getElementById("ansTri");
        input.focus();
        function submit() {
          const val = parseInt(input.value, 10);
          if (val === c) {
            showFeedback("fb-tri", true, `对了！180 − ${a} − ${b} = ${c}°`);
            round++;
            if (round >= total) {
              addStars(3);
              markComplete("triangle");
              return;
            }
            setTimeout(newRound, 1100);
          } else {
            showFeedback("fb-tri", false, `180 − ${a} − ${b} = ${c}°`);
          }
        }
        document.getElementById("btnTri").onclick = submit;
        input.onkeydown = (e) => { if (e.key === "Enter") submit(); };
      } else {
        // 三角形分类
        const types = [
          { name: "锐角三角形", poly: "60,140 180,140 120,30", desc: "三个角都小于 90°" },
          { name: "直角三角形", poly: "40,140 180,140 40,30", desc: "有一个角是 90°" },
          { name: "钝角三角形", poly: "30,140 200,140 70,40", desc: "有一个角大于 90°" },
        ];
        const t = types[randInt(0, 2)];
        container.innerHTML =
          lessonShell(lesson) +
          `<div class="panel">
            <h3>三角形分类 (${round}/${total})</h3>
            <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
            <svg class="triangle-svg" width="240" height="180" viewBox="0 0 240 180">
              <polygon points="${t.poly}" fill="#efeaff" stroke="#6c5ce7" stroke-width="3" />
            </svg>
            <p style="text-align:center;color:#636e72">${t.desc}</p>
            <div class="pattern-options" id="triOpts"></div>
            ${feedbackEl("fb-tri")}
          </div>`;
        shuffle(types.map((x) => x.name)).forEach((opt) => {
          const btn = document.createElement("button");
          btn.type = "button";
          btn.className = "pattern-opt";
          btn.textContent = opt;
          btn.onclick = () => {
            if (opt === t.name) {
              btn.classList.add("correct");
              showFeedback("fb-tri", true, `对了！${t.name}：${t.desc}`);
              round++;
              if (round >= total) {
                addStars(3);
                markComplete("triangle");
                return;
              }
              setTimeout(newRound, 1200);
            } else {
              btn.classList.add("wrong");
              showFeedback("fb-tri", false, "比一比每个角与 90° 的大小。");
            }
          };
          document.getElementById("triOpts").appendChild(btn);
        });
      }
    }
    newRound();
  }

  /* --- 观察物体 --- */
  function renderView(lesson, container) {
    let round = 0;
    const total = 5;

    function newRound() {
      // 用 4 块小立方体随机摆放：底面 2x2 排列
      const layout = [];
      for (let i = 0; i < 3; i++) {
        layout.push([randInt(1, 2), randInt(1, 2)]);
      }
      // 简化版：让答题者判断"正面看"图形的形状
      const front = layout.map((c) => Math.max(...c));
      const correctSum = front.reduce((s, x) => s + x, 0);
      const pct = (round / total) * 100;

      // SVG: 立体 + 候选正视图
      let stack = "";
      const cubeSz = 40;
      for (let col = 0; col < 3; col++) {
        for (let row = 0; row < layout[col].length; row++) {
          const cnt = layout[col][row];
          for (let h = 0; h < cnt; h++) {
            const x = 30 + col * cubeSz + row * 10;
            const y = 140 - h * cubeSz - row * 10;
            stack += `<rect x="${x}" y="${y}" width="${cubeSz}" height="${cubeSz}" fill="#a29bfe" stroke="#6c5ce7" stroke-width="2" />`;
          }
        }
      }

      const options = [correctSum, correctSum + 1, correctSum - 1, correctSum + 2].filter((x) => x > 0);
      const opts = shuffle([...new Set(options)]);

      container.innerHTML =
        lessonShell(lesson) +
        `<div class="panel">
          <h3>观察物体 (${round}/${total})</h3>
          <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
          <p style="text-align:center;color:#636e72">从<b>正面</b>看，可以看到几个正方形？</p>
          <svg class="view-svg" width="240" height="180" viewBox="0 0 240 180">${stack}</svg>
          <div class="pattern-options" id="viewOpts"></div>
          ${feedbackEl("fb-view")}
        </div>`;
      opts.forEach((opt) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "pattern-opt";
        btn.textContent = opt;
        btn.onclick = () => {
          if (opt === correctSum) {
            btn.classList.add("correct");
            showFeedback("fb-view", true, `对了！正面看到 ${correctSum} 个方格。`);
            round++;
            if (round >= total) {
              addStars(2);
              markComplete("view");
              return;
            }
            setTimeout(newRound, 1200);
          } else {
            btn.classList.add("wrong");
            showFeedback("fb-view", false, "每列从前向后看，只看最高的。");
          }
        };
        document.getElementById("viewOpts").appendChild(btn);
      });
    }
    newRound();
  }

  /* --- 折线统计图 --- */
  function renderLineChart(lesson, container) {
    let round = 0;
    const total = 5;

    function newRound() {
      const days = ["周一", "周二", "周三", "周四", "周五"];
      const vals = days.map(() => randInt(5, 40));
      const maxIdx = vals.indexOf(Math.max(...vals));
      const minIdx = vals.indexOf(Math.min(...vals));
      const askMax = Math.random() > 0.5;
      const ansIdx = askMax ? maxIdx : minIdx;
      const ansLabel = days[ansIdx];
      const pct = (round / total) * 100;

      const w = 320, h = 180;
      const stepX = w / (days.length + 1);
      const maxV = Math.max(...vals);
      let polyline = "";
      let dots = "";
      let labels = "";
      vals.forEach((v, i) => {
        const x = stepX * (i + 1);
        const y = h - 30 - (v / (maxV + 5)) * (h - 60);
        polyline += `${x},${y} `;
        dots += `<circle cx="${x}" cy="${y}" r="5" fill="#fd79a8" stroke="#fff" stroke-width="2" />`;
        labels += `<text x="${x}" y="${h - 10}" text-anchor="middle" font-size="12" fill="#636e72">${days[i]}</text>`;
        labels += `<text x="${x}" y="${y - 10}" text-anchor="middle" font-size="12" font-family="ZCOOL KuaiLe" fill="#6c5ce7">${v}</text>`;
      });

      container.innerHTML =
        lessonShell(lesson) +
        `<div class="panel">
          <h3>读折线图 (${round}/${total})</h3>
          <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
          <svg class="chart-svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
            <line x1="20" y1="${h - 30}" x2="${w - 10}" y2="${h - 30}" stroke="#dfe6e9" stroke-width="2" />
            <polyline points="${polyline}" fill="none" stroke="#6c5ce7" stroke-width="3" stroke-linejoin="round" />
            ${dots}
            ${labels}
          </svg>
          <p style="text-align:center;line-height:1.7">某商店一周冰激凌销量（份）。${askMax ? "<b>哪一天最多</b>" : "<b>哪一天最少</b>"}？</p>
          <div class="pattern-options" id="chartOpts"></div>
          ${feedbackEl("fb-chart")}
        </div>`;

      shuffle(days).forEach((d) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "pattern-opt";
        btn.textContent = d;
        btn.onclick = () => {
          if (d === ansLabel) {
            btn.classList.add("correct");
            showFeedback("fb-chart", true, `对了！${ansLabel}是${askMax ? "最高" : "最低"}点。`);
            round++;
            if (round >= total) {
              addStars(2);
              markComplete("lineChart");
              return;
            }
            setTimeout(newRound, 1200);
          } else {
            btn.classList.add("wrong");
            showFeedback("fb-chart", false, `找折线的${askMax ? "最高点" : "最低点"}。`);
          }
        };
        document.getElementById("chartOpts").appendChild(btn);
      });
    }
    newRound();
  }

  /* --- 鸡兔同笼 --- */
  function renderChicken(lesson, container) {
    let round = 0;
    const total = 5;

    function newRound() {
      const chicken = randInt(2, 10);
      const rabbit = randInt(2, 10);
      const head = chicken + rabbit;
      const feet = chicken * 2 + rabbit * 4;
      const pct = (round / total) * 100;
      container.innerHTML =
        lessonShell(lesson) +
        `<div class="panel">
          <h3>鸡兔同笼 (${round}/${total})</h3>
          <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
          <p style="text-align:center;line-height:1.8">笼子里有鸡和兔共 <b>${head}</b> 只，<br>它们一共有 <b>${feet}</b> 只脚。<br>问：鸡和兔各有几只？</p>
          <p style="text-align:center;color:#636e72;font-size:14px">假设全是鸡：${head}×2=${head * 2}；多出 ${feet - head * 2} 只脚是兔多出的 ÷2</p>
          <div class="dual-input">
            <label>鸡 <input type="number" class="answer-input answer-input--sm" id="cChi" inputmode="numeric" /></label>
            <label>兔 <input type="number" class="answer-input answer-input--sm" id="cRab" inputmode="numeric" /></label>
          </div>
          <div class="btn-group" style="justify-content:center">
            <button type="button" class="btn btn-primary" id="btnChi">提交</button>
          </div>
          ${feedbackEl("fb-chi")}
        </div>`;
      document.getElementById("cChi").focus();
      document.getElementById("btnChi").onclick = () => {
        const c = parseInt(document.getElementById("cChi").value, 10);
        const r = parseInt(document.getElementById("cRab").value, 10);
        if (isNaN(c) || isNaN(r)) {
          showFeedback("fb-chi", false, "请填写鸡和兔的数量。");
          return;
        }
        if (c === chicken && r === rabbit) {
          showFeedback("fb-chi", true, `对了！鸡 ${chicken} 只，兔 ${rabbit} 只。`);
          round++;
          if (round >= total) {
            addStars(3);
            markComplete("chicken");
            return;
          }
          setTimeout(newRound, 1300);
        } else {
          showFeedback("fb-chi", false, `兔 = (${feet} − ${head}×2) ÷ 2 = ${rabbit}，鸡 = ${head} − ${rabbit} = ${chicken}`);
        }
      };
    }
    newRound();
  }

  /* --- 平均数 --- */
  function renderAverage(lesson, container) {
    let round = 0;
    const total = 5;

    function newRound() {
      const n = randInt(3, 5);
      const target = randInt(10, 40);
      const arr = [];
      // 生成 n 个数总和为 target * n
      let sum = target * n;
      for (let i = 0; i < n - 1; i++) {
        const v = randInt(Math.max(1, target - 8), target + 8);
        arr.push(v);
        sum -= v;
      }
      if (sum < 1) sum = 1;
      arr.push(sum);
      const real = arr.reduce((s, x) => s + x, 0);
      const avg = real / n;
      // 调整使其为整数平均
      const finalAvg = Math.round(avg);
      // Recompute avg = floor(sum/n) if not exact, allow exact ones
      const total_sum = arr.reduce((s, x) => s + x, 0);
      const exactAvg = total_sum / n;
      if (!Number.isInteger(exactAvg)) {
        // try again
        return newRound();
      }
      const pct = (round / total) * 100;
      container.innerHTML =
        lessonShell(lesson) +
        `<div class="panel">
          <h3>求平均数 (${round}/${total})</h3>
          <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
          <p style="text-align:center;line-height:1.8">${n} 名同学投篮成绩（个）：<br><b style="font-size:1.3rem;color:var(--primary)">${arr.join("、")}</b><br>他们的平均成绩是？</p>
          <p style="text-align:center;color:#636e72;font-size:14px">平均数 = 总和 ÷ 个数 = ${total_sum} ÷ ${n}</p>
          <input type="number" class="answer-input answer-input--sm" id="ansAvg" inputmode="numeric" placeholder="?" />
          <div class="btn-group" style="justify-content:center">
            <button type="button" class="btn btn-primary" id="btnAvg">提交</button>
          </div>
          ${feedbackEl("fb-avg")}
        </div>`;
      const input = document.getElementById("ansAvg");
      input.focus();
      function submit() {
        const val = parseInt(input.value, 10);
        if (val === exactAvg) {
          showFeedback("fb-avg", true, `对了！${total_sum} ÷ ${n} = ${exactAvg}`);
          round++;
          if (round >= total) {
            addStars(2);
            markComplete("average");
            return;
          }
          setTimeout(newRound, 1200);
        } else {
          showFeedback("fb-avg", false, `${total_sum} ÷ ${n} = ${exactAvg}`);
        }
      }
      document.getElementById("btnAvg").onclick = submit;
      input.onkeydown = (e) => { if (e.key === "Enter") submit(); };
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
