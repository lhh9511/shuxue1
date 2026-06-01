(function () {
  const STORAGE_KEY = "math-grade3-progress";

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
    } catch (_) {
      /* ignore */
    }
  }

  function saveProgress() {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        stars: state.stars,
        completed: [...state.completed],
      })
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
    const colors = ["#00b894", "#fdcb6e", "#ff7675", "#a29bfe", "#74b9ff"];
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
      if (existing) {
        existing.remove();
      }
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

  function gcd(a, b) {
    return b === 0 ? a : gcd(b, a % b);
  }

  function renderLesson(id, container) {
    const lesson = LESSONS.find((l) => l.id === id);
    if (!lesson) return;

    const renderers = {
      bigAddSub: renderBigAddSub,
      mulOne: renderMulOne,
      divOne: renderDivOne,
      multiple: renderMultiple,
      perimeter: renderPerimeter,
      areaG3: renderAreaG3,
      fraction: renderFraction,
      decimal: renderDecimal,
      timeUnit: renderTimeUnit,
      kmTon: renderKmTon,
      measure: renderMeasure,
      ymd: renderYmd,
      clock24: renderClock24,
      direction: renderDirection,
      chance: renderChance,
      venn: renderVenn,
    };
    renderers[id]?.(lesson, container);
  }

  /* --- 万以内加减法 --- */
  function renderBigAddSub(lesson, container) {
    let score = 0;
    const total = 8;
    let current = null;

    function genProblem() {
      const isAdd = Math.random() > 0.5;
      if (isAdd) {
        const a = randInt(100, 4999);
        const b = randInt(100, 4999);
        return { text: `${a} + ${b}`, ans: a + b, op: "+" };
      }
      const a = randInt(500, 9999);
      const b = randInt(100, a - 1);
      return { text: `${a} − ${b}`, ans: a - b, op: "−" };
    }

    function draw() {
      current = genProblem();
      const pct = (score / total) * 100;
      const parts = current.text.split(/\s[+−]\s/);
      const a = parts[0];
      const b = parts[1];
      container.innerHTML =
        lessonShell(lesson) +
        `<div class="panel">
          <h3>万以内加减法 (${score}/${total})</h3>
          <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
          <div class="calc-wrap">
            <div class="vertical-calc">
              <div>&nbsp;&nbsp;${a}</div>
              <div><span class="op">${current.op}</span>${b}</div>
              <div class="line">&nbsp;</div>
            </div>
          </div>
          <input type="number" class="answer-input" id="ansBig" inputmode="numeric" placeholder="?" />
          <div class="btn-group" style="justify-content:center">
            <button type="button" class="btn btn-primary" id="btnBig">提交答案</button>
          </div>
          ${feedbackEl("fb-big")}
        </div>`;

      const input = document.getElementById("ansBig");
      input.focus();
      function submit() {
        const val = parseInt(input.value, 10);
        if (isNaN(val)) {
          showFeedback("fb-big", false, "请输入数字哦！");
          return;
        }
        if (val === current.ans) {
          score++;
          showFeedback("fb-big", true, "正确！");
          if (score >= total) {
            addStars(3);
            markComplete("bigAddSub");
            return;
          }
          setTimeout(draw, 800);
        } else {
          showFeedback("fb-big", false, `想想 ${current.text}，答案是 ${current.ans}。`);
        }
      }
      document.getElementById("btnBig").onclick = submit;
      input.onkeydown = (e) => {
        if (e.key === "Enter") submit();
      };
    }
    draw();
  }

  /* --- 多位数乘一位数 --- */
  function renderMulOne(lesson, container) {
    let score = 0;
    const total = 8;
    let current = null;

    function genProblem() {
      const digits = Math.random() > 0.4 ? 2 : 3;
      const min = digits === 2 ? 11 : 100;
      const max = digits === 2 ? 99 : 499;
      const a = randInt(min, max);
      const b = randInt(2, 9);
      return { text: `${a} × ${b}`, ans: a * b };
    }

    function draw() {
      current = genProblem();
      const pct = (score / total) * 100;
      container.innerHTML =
        lessonShell(lesson) +
        `<div class="panel">
          <h3>多位数 × 一位数 (${score}/${total})</h3>
          <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
          <div class="quiz-display">${current.text} = ?</div>
          <p style="text-align:center;color:#636e72;font-size:14px">从个位乘起，逢十进一</p>
          <input type="number" class="answer-input" id="ansMul" inputmode="numeric" placeholder="?" />
          <div class="btn-group" style="justify-content:center">
            <button type="button" class="btn btn-primary" id="btnMul">提交答案</button>
          </div>
          ${feedbackEl("fb-mul")}
        </div>`;

      const input = document.getElementById("ansMul");
      input.focus();
      function submit() {
        const val = parseInt(input.value, 10);
        if (isNaN(val)) {
          showFeedback("fb-mul", false, "请输入数字哦！");
          return;
        }
        if (val === current.ans) {
          score++;
          showFeedback("fb-mul", true, "正确！");
          if (score >= total) {
            addStars(3);
            markComplete("mulOne");
            return;
          }
          setTimeout(draw, 800);
        } else {
          showFeedback("fb-mul", false, `再算算，${current.text} = ${current.ans}。`);
        }
      }
      document.getElementById("btnMul").onclick = submit;
      input.onkeydown = (e) => {
        if (e.key === "Enter") submit();
      };
    }
    draw();
  }

  /* --- 除数是一位数的除法 --- */
  function renderDivOne(lesson, container) {
    let round = 0;
    const total = 6;
    let current = null;

    function genProblem() {
      const b = randInt(2, 9);
      const q = randInt(11, 99);
      const r = Math.random() > 0.5 ? 0 : randInt(1, b - 1);
      const a = b * q + r;
      return { text: `${a} ÷ ${b}`, q, r, a, b };
    }

    function draw() {
      current = genProblem();
      const pct = (round / total) * 100;
      const hasRem = current.r > 0;
      container.innerHTML =
        lessonShell(lesson) +
        `<div class="panel">
          <h3>除法 (${round}/${total})</h3>
          <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
          <div class="quiz-display">${current.text} = ? ${hasRem ? "…… ?" : ""}</div>
          <p style="text-align:center;color:#636e72;font-size:14px">${hasRem ? "填写商和余数（余数比除数小）" : "填写商"}</p>
          <div class="time-row">
            <label>商 <input type="number" class="answer-input answer-input--sm" id="divQ" inputmode="numeric" /></label>
            ${hasRem ? '<label>余数 <input type="number" class="answer-input answer-input--sm" id="divR" inputmode="numeric" /></label>' : ""}
          </div>
          <div class="btn-group" style="justify-content:center">
            <button type="button" class="btn btn-primary" id="btnDiv">提交</button>
          </div>
          ${feedbackEl("fb-div")}
        </div>`;

      const qInput = document.getElementById("divQ");
      qInput.focus();
      document.getElementById("btnDiv").onclick = () => {
        const q = parseInt(qInput.value, 10);
        const r = hasRem ? parseInt(document.getElementById("divR").value, 10) : 0;
        if (isNaN(q) || (hasRem && isNaN(r))) {
          showFeedback("fb-div", false, "请填写答案。");
          return;
        }
        if (q === current.q && r === current.r) {
          showFeedback("fb-div", true, `对了！${current.a}÷${current.b}=${current.q}${hasRem ? "……" + current.r : ""}`);
          round++;
          if (round >= total) {
            addStars(3);
            markComplete("divOne");
            return;
          }
          setTimeout(draw, 1000);
        } else {
          showFeedback("fb-div", false, `想想：${current.b} × 几 接近 ${current.a}？`);
        }
      };
    }
    draw();
  }

  /* --- 倍的认识 --- */
  function renderMultiple(lesson, container) {
    let round = 0;
    const total = 5;

    function newRound() {
      const base = randInt(2, 6);
      const times = randInt(2, 5);
      const target = base * times;
      const askWhat = randInt(0, 2); // 0=求多少倍, 1=求是几, 2=求基础
      const pct = (round / total) * 100;

      let question, answer, hint;
      if (askWhat === 0) {
        question = `小蓝有 <b>${base}</b> 个 🟦，小绿有 <b>${target}</b> 个 🟩，小绿是小蓝的几倍？`;
        answer = times;
        hint = `${target} ÷ ${base} = ${times}`;
      } else if (askWhat === 1) {
        question = `小蓝有 <b>${base}</b> 个 🟦，小绿是小蓝的 <b>${times}</b> 倍，小绿有几个？`;
        answer = target;
        hint = `${base} × ${times} = ${target}`;
      } else {
        question = `小绿有 <b>${target}</b> 个 🟩，是小蓝的 <b>${times}</b> 倍，小蓝有几个？`;
        answer = base;
        hint = `${target} ÷ ${times} = ${base}`;
      }

      container.innerHTML =
        lessonShell(lesson) +
        `<div class="panel">
          <h3>倍的认识 (${round}/${total})</h3>
          <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
          <p style="text-align:center;font-size:1.1rem;line-height:1.8">${question}</p>
          <div class="times-bar">
            <div class="times-row target">
              <span class="label">小蓝 🟦</span>
              <div class="bar">${Array(base).fill('<span class="unit"></span>').join("")}</div>
            </div>
            <div class="times-row compare">
              <span class="label">小绿 🟩</span>
              <div class="bar">${Array(target).fill('<span class="unit"></span>').join("")}</div>
            </div>
          </div>
          <input type="number" class="answer-input" id="ansMul3" inputmode="numeric" placeholder="?" />
          <div class="btn-group" style="justify-content:center">
            <button type="button" class="btn btn-primary" id="btnMul3">提交</button>
          </div>
          ${feedbackEl("fb-mul3")}
        </div>`;

      const input = document.getElementById("ansMul3");
      input.focus();
      function submit() {
        const val = parseInt(input.value, 10);
        if (isNaN(val)) {
          showFeedback("fb-mul3", false, "请输入数字。");
          return;
        }
        if (val === answer) {
          showFeedback("fb-mul3", true, `对了！${hint}`);
          round++;
          if (round >= total) {
            addStars(2);
            markComplete("multiple");
            return;
          }
          setTimeout(newRound, 1100);
        } else {
          showFeedback("fb-mul3", false, `想一想：${hint.replace(/=.*/, "= ?")}`);
        }
      }
      document.getElementById("btnMul3").onclick = submit;
      input.onkeydown = (e) => {
        if (e.key === "Enter") submit();
      };
    }
    newRound();
  }

  /* --- 周长 --- */
  function renderPerimeter(lesson, container) {
    let round = 0;
    const total = 5;

    function newRound() {
      const isSquare = Math.random() > 0.5;
      const pct = (round / total) * 100;
      let w, h, peri, hint, svg;
      if (isSquare) {
        w = h = randInt(3, 12);
        peri = 4 * w;
        hint = `边长 × 4 = ${w} × 4 = ${peri}`;
      } else {
        w = randInt(4, 15);
        h = randInt(2, 10);
        if (h === w) h = w + 1;
        peri = 2 * (w + h);
        hint = `(${w} + ${h}) × 2 = ${peri}`;
      }
      const scale = 14;
      const sw = w * scale;
      const sh = h * scale;
      svg = `
        <svg class="shape-canvas" width="${sw + 80}" height="${sh + 60}" viewBox="0 0 ${sw + 80} ${sh + 60}">
          <rect x="40" y="20" width="${sw}" height="${sh}" fill="#d4f5e3" stroke="#00b894" stroke-width="3" />
          <text x="${40 + sw / 2}" y="14" text-anchor="middle" font-family="ZCOOL KuaiLe" font-size="14" fill="#2d3436">${w} 厘米</text>
          ${!isSquare ? `<text x="${30}" y="${20 + sh / 2}" text-anchor="end" font-family="ZCOOL KuaiLe" font-size="14" fill="#2d3436">${h} 厘米</text>` : ""}
        </svg>`;

      container.innerHTML =
        lessonShell(lesson) +
        `<div class="panel">
          <h3>${isSquare ? "正方形" : "长方形"}周长 (${round}/${total})</h3>
          <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
          <p style="text-align:center;color:#636e72">求图形的周长（单位：厘米）</p>
          ${svg}
          <input type="number" class="answer-input" id="ansPeri" inputmode="numeric" placeholder="周长?" />
          <div class="btn-group" style="justify-content:center">
            <button type="button" class="btn btn-primary" id="btnPeri">提交</button>
          </div>
          ${feedbackEl("fb-peri")}
        </div>`;

      const input = document.getElementById("ansPeri");
      input.focus();
      function submit() {
        const val = parseInt(input.value, 10);
        if (isNaN(val)) {
          showFeedback("fb-peri", false, "请输入数字。");
          return;
        }
        if (val === peri) {
          showFeedback("fb-peri", true, `对了！${hint} 厘米`);
          round++;
          if (round >= total) {
            addStars(2);
            markComplete("perimeter");
            return;
          }
          setTimeout(newRound, 1200);
        } else {
          showFeedback("fb-peri", false, `想想公式：${isSquare ? "边长 × 4" : "(长 + 宽) × 2"}`);
        }
      }
      document.getElementById("btnPeri").onclick = submit;
      input.onkeydown = (e) => {
        if (e.key === "Enter") submit();
      };
    }
    newRound();
  }

  /* --- 面积 --- */
  function renderAreaG3(lesson, container) {
    let round = 0;
    const total = 6;

    function newRound() {
      const mode = randInt(0, 2); // 0=area calc, 1=unit choice, 2=count squares
      const pct = (round / total) * 100;

      if (mode === 0) {
        // 计算面积
        const isSquare = Math.random() > 0.5;
        let w, h, area, hint, svg;
        if (isSquare) {
          w = h = randInt(3, 9);
          area = w * w;
          hint = `边长 × 边长 = ${w} × ${w} = ${area}`;
        } else {
          w = randInt(4, 12);
          h = randInt(2, 8);
          if (h === w) h = w + 1;
          area = w * h;
          hint = `长 × 宽 = ${w} × ${h} = ${area}`;
        }
        const scale = 16;
        const sw = w * scale;
        const sh = h * scale;
        svg = `
          <svg class="shape-canvas" width="${sw + 80}" height="${sh + 50}" viewBox="0 0 ${sw + 80} ${sh + 50}">
            <rect x="40" y="20" width="${sw}" height="${sh}" fill="#fff5d6" stroke="#fdcb6e" stroke-width="3" />
            <text x="${40 + sw / 2}" y="14" text-anchor="middle" font-family="ZCOOL KuaiLe" font-size="14" fill="#2d3436">${w} 米</text>
            <text x="${30}" y="${20 + sh / 2}" text-anchor="end" font-family="ZCOOL KuaiLe" font-size="14" fill="#2d3436">${h} 米</text>
          </svg>`;
        container.innerHTML =
          lessonShell(lesson) +
          `<div class="panel">
            <h3>${isSquare ? "正方形" : "长方形"}面积 (${round}/${total})</h3>
            <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
            <p style="text-align:center;color:#636e72">求面积（单位：平方米）</p>
            ${svg}
            <input type="number" class="answer-input" id="ansArea" inputmode="numeric" placeholder="面积?" />
            <div class="btn-group" style="justify-content:center">
              <button type="button" class="btn btn-primary" id="btnArea">提交</button>
            </div>
            ${feedbackEl("fb-area")}
          </div>`;
        const input = document.getElementById("ansArea");
        input.focus();
        function submit() {
          const val = parseInt(input.value, 10);
          if (val === area) {
            showFeedback("fb-area", true, `对了！${hint} 平方米`);
            round++;
            if (round >= total) {
              addStars(3);
              markComplete("areaG3");
              return;
            }
            setTimeout(newRound, 1200);
          } else {
            showFeedback("fb-area", false, `想想：${isSquare ? "边长 × 边长" : "长 × 宽"}`);
          }
        }
        document.getElementById("btnArea").onclick = submit;
        input.onkeydown = (e) => {
          if (e.key === "Enter") submit();
        };
      } else if (mode === 1) {
        // 单位选择
        const items = [
          { name: "邮票", unit: "cm²", emoji: "✉️" },
          { name: "数学书封面", unit: "cm²", emoji: "📘" },
          { name: "教室地面", unit: "m²", emoji: "🏫" },
          { name: "操场", unit: "m²", emoji: "⚽" },
          { name: "课桌面", unit: "cm²", emoji: "🪑" },
          { name: "黑板", unit: "m²", emoji: "🟫" },
        ];
        const item = items[randInt(0, items.length - 1)];
        container.innerHTML =
          lessonShell(lesson) +
          `<div class="panel">
            <h3>选合适的面积单位 (${round}/${total})</h3>
            <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
            <div class="length-item">
              <span class="length-emoji">${item.emoji}</span>
              <p>${item.name}的面积大约是 ?</p>
            </div>
            <div class="unit-pad">
              <button type="button" class="unit-btn" data-u="cm²">平方厘米 cm²</button>
              <button type="button" class="unit-btn" data-u="m²">平方米 m²</button>
            </div>
            ${feedbackEl("fb-area")}
          </div>`;
        document.querySelectorAll(".unit-btn").forEach((btn) => {
          btn.onclick = () => {
            if (btn.dataset.u === item.unit) {
              btn.classList.add("correct");
              showFeedback("fb-area", true, `对了！${item.name}用${item.unit === "cm²" ? "平方厘米" : "平方米"}。`);
              round++;
              if (round >= total) {
                addStars(3);
                markComplete("areaG3");
                return;
              }
              setTimeout(newRound, 1100);
            } else {
              btn.classList.add("wrong");
              showFeedback("fb-area", false, "想想物体是大还是小？");
            }
          };
        });
      } else {
        // 数格子
        const w = randInt(3, 6);
        const h = randInt(3, 6);
        const filled = w * h;
        const correct = filled;
        const scale = 32;
        let svg = `<svg class="shape-canvas" width="${w * scale + 20}" height="${h * scale + 20}">`;
        for (let yi = 0; yi < h; yi++) {
          for (let xi = 0; xi < w; xi++) {
            svg += `<rect x="${10 + xi * scale}" y="${10 + yi * scale}" width="${scale}" height="${scale}" fill="#d4f5e3" stroke="#00b894" stroke-width="2" />`;
          }
        }
        svg += "</svg>";
        container.innerHTML =
          lessonShell(lesson) +
          `<div class="panel">
            <h3>数格子算面积 (${round}/${total})</h3>
            <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
            <p style="text-align:center;color:#636e72">每个小方格是 1 平方厘米，图形的面积是？</p>
            ${svg}
            <input type="number" class="answer-input" id="ansCount" inputmode="numeric" placeholder="格子数?" />
            <div class="btn-group" style="justify-content:center">
              <button type="button" class="btn btn-primary" id="btnCount">提交</button>
            </div>
            ${feedbackEl("fb-area")}
          </div>`;
        const input = document.getElementById("ansCount");
        input.focus();
        function submit() {
          const val = parseInt(input.value, 10);
          if (val === correct) {
            showFeedback("fb-area", true, `对了！${w} × ${h} = ${correct} 平方厘米`);
            round++;
            if (round >= total) {
              addStars(3);
              markComplete("areaG3");
              return;
            }
            setTimeout(newRound, 1100);
          } else {
            showFeedback("fb-area", false, `一行有 ${w} 个，共 ${h} 行。`);
          }
        }
        document.getElementById("btnCount").onclick = submit;
        input.onkeydown = (e) => {
          if (e.key === "Enter") submit();
        };
      }
    }
    newRound();
  }

  /* --- 分数初步 --- */
  function renderFraction(lesson, container) {
    let round = 0;
    const total = 6;

    function pieSvg(parts, filled) {
      const r = 80;
      const cx = 100;
      const cy = 100;
      let svg = `<svg class="fraction-pie" width="200" height="200" viewBox="0 0 200 200">`;
      svg += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#fff5d6" stroke="#fdcb6e" stroke-width="3" />`;
      for (let i = 0; i < parts; i++) {
        const startAng = (i * 360) / parts - 90;
        const endAng = ((i + 1) * 360) / parts - 90;
        const s = (startAng * Math.PI) / 180;
        const e = (endAng * Math.PI) / 180;
        const x1 = cx + r * Math.cos(s);
        const y1 = cy + r * Math.sin(s);
        const x2 = cx + r * Math.cos(e);
        const y2 = cy + r * Math.sin(e);
        const large = endAng - startAng > 180 ? 1 : 0;
        const fill = i < filled ? "#00b894" : "#fff5d6";
        svg += `<path d="M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z" fill="${fill}" stroke="#00b894" stroke-width="2" />`;
      }
      svg += "</svg>";
      return svg;
    }

    function newRound() {
      const mode = randInt(0, 1);
      const pct = (round / total) * 100;

      if (mode === 0) {
        // 看图写分数
        const den = randInt(2, 8);
        const num = randInt(1, den);
        const opts = shuffle([
          { n: num, d: den },
          { n: den - num + 1, d: den },
          { n: num, d: den + 1 },
          { n: num + 1, d: den },
        ]);
        container.innerHTML =
          lessonShell(lesson) +
          `<div class="panel">
            <h3>看图写分数 (${round}/${total})</h3>
            <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
            <p style="text-align:center;color:#636e72">绿色部分占整个圆的几分之几？</p>
            ${pieSvg(den, num)}
            <div class="pattern-options" id="fracOpts"></div>
            ${feedbackEl("fb-frac")}
          </div>`;

        opts.forEach((opt) => {
          const btn = document.createElement("button");
          btn.type = "button";
          btn.className = "pattern-opt";
          btn.innerHTML = `<span class="fraction-inline"><span class="num">${opt.n}</span><span class="den">${opt.d}</span></span>`;
          btn.onclick = () => {
            if (opt.n === num && opt.d === den) {
              btn.classList.add("correct");
              showFeedback("fb-frac", true, `对了！平均分 ${den} 份，取 ${num} 份。`);
              round++;
              if (round >= total) {
                addStars(3);
                markComplete("fraction");
                return;
              }
              setTimeout(newRound, 1200);
            } else {
              btn.classList.add("wrong");
              showFeedback("fb-frac", false, "分母看一共几份，分子看染色几份。");
            }
          };
          document.getElementById("fracOpts").appendChild(btn);
        });
      } else {
        // 比大小
        const den = randInt(3, 8);
        let n1 = randInt(1, den - 1);
        let n2 = randInt(1, den - 1);
        while (n2 === n1) n2 = randInt(1, den - 1);
        const correct = n1 > n2 ? ">" : n1 < n2 ? "<" : "=";
        container.innerHTML =
          lessonShell(lesson) +
          `<div class="panel">
            <h3>同分母分数比大小 (${round}/${total})</h3>
            <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
            <p style="text-align:center;color:#636e72">分母相同，分子大的就大</p>
            <div class="quiz-display">
              <span class="fraction-inline"><span class="num">${n1}</span><span class="den">${den}</span></span>
              &nbsp;?&nbsp;
              <span class="fraction-inline"><span class="num">${n2}</span><span class="den">${den}</span></span>
            </div>
            <div class="pattern-options">
              <button type="button" class="pattern-opt" data-sym=">">&gt;</button>
              <button type="button" class="pattern-opt" data-sym="<">&lt;</button>
              <button type="button" class="pattern-opt" data-sym="=">=</button>
            </div>
            ${feedbackEl("fb-frac")}
          </div>`;
        document.querySelectorAll(".pattern-opt").forEach((btn) => {
          btn.onclick = () => {
            if (btn.dataset.sym === correct) {
              btn.classList.add("correct");
              showFeedback("fb-frac", true, "对了！");
              round++;
              if (round >= total) {
                addStars(3);
                markComplete("fraction");
                return;
              }
              setTimeout(newRound, 1100);
            } else {
              btn.classList.add("wrong");
              showFeedback("fb-frac", false, "分母相同看分子大小哦。");
            }
          };
        });
      }
    }
    newRound();
  }

  /* --- 小数初步 --- */
  function renderDecimal(lesson, container) {
    let round = 0;
    const total = 5;

    function newRound() {
      const n = randInt(1, 9);
      const pct = (round / total) * 100;
      const cells = Array.from({ length: 10 }, (_, i) => `<div class="decimal-cell ${i < n ? "fill" : ""}"></div>`).join("");
      const ans = `0.${n}`;
      const opts = shuffle([ans, `0.${(10 - n) % 10 || 5}`, `${n}.0`, `0.0${n}`]);
      const uniq = [...new Set(opts)].slice(0, 4);

      container.innerHTML =
        lessonShell(lesson) +
        `<div class="panel">
          <h3>看图写小数 (${round}/${total})</h3>
          <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
          <p style="text-align:center;color:#636e72">把 1 平均分成 10 份，涂了几份就是十分之几（也是 0.几）</p>
          <div class="decimal-bar">${cells}</div>
          <p style="text-align:center;font-family:var(--font-display);color:var(--text-muted)">涂色 ${n} 份 = 十分之${n}</p>
          <div class="pattern-options" id="decOpts"></div>
          ${feedbackEl("fb-dec")}
        </div>`;
      uniq.forEach((opt) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "pattern-opt";
        btn.textContent = opt;
        btn.onclick = () => {
          if (opt === ans) {
            btn.classList.add("correct");
            showFeedback("fb-dec", true, `对了！十分之${n} = ${ans}`);
            round++;
            if (round >= total) {
              addStars(2);
              markComplete("decimal");
              return;
            }
            setTimeout(newRound, 1100);
          } else {
            btn.classList.add("wrong");
            showFeedback("fb-dec", false, "小数点后第一位是十分位。");
          }
        };
        document.getElementById("decOpts").appendChild(btn);
      });
    }
    newRound();
  }

  /* --- 时分秒 --- */
  function renderTimeUnit(lesson, container) {
    let round = 0;
    const total = 6;

    function newRound() {
      const mode = randInt(0, 2);
      const pct = (round / total) * 100;
      let q, ans, hint;
      if (mode === 0) {
        const min = randInt(2, 9);
        q = `${min} 分 = ? 秒`;
        ans = min * 60;
        hint = `1 分 = 60 秒，${min} × 60 = ${ans}`;
      } else if (mode === 1) {
        const sec = [60, 120, 180, 240, 300][randInt(0, 4)];
        q = `${sec} 秒 = ? 分`;
        ans = sec / 60;
        hint = `${sec} ÷ 60 = ${ans}`;
      } else {
        const hr = randInt(1, 5);
        q = `${hr} 时 = ? 分`;
        ans = hr * 60;
        hint = `1 时 = 60 分，${hr} × 60 = ${ans}`;
      }

      container.innerHTML =
        lessonShell(lesson) +
        `<div class="panel">
          <h3>时间单位换算 (${round}/${total})</h3>
          <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
          <div class="quiz-display">${q}</div>
          <input type="number" class="answer-input" id="ansTu" inputmode="numeric" placeholder="?" />
          <div class="btn-group" style="justify-content:center">
            <button type="button" class="btn btn-primary" id="btnTu">提交</button>
          </div>
          ${feedbackEl("fb-tu")}
        </div>`;
      const input = document.getElementById("ansTu");
      input.focus();
      function submit() {
        const val = parseInt(input.value, 10);
        if (isNaN(val)) {
          showFeedback("fb-tu", false, "请输入数字。");
          return;
        }
        if (val === ans) {
          showFeedback("fb-tu", true, `对了！${hint}`);
          round++;
          if (round >= total) {
            addStars(2);
            markComplete("timeUnit");
            return;
          }
          setTimeout(newRound, 1100);
        } else {
          showFeedback("fb-tu", false, `提示：${hint}`);
        }
      }
      document.getElementById("btnTu").onclick = submit;
      input.onkeydown = (e) => {
        if (e.key === "Enter") submit();
      };
    }
    newRound();
  }

  /* --- 千米与吨 --- */
  function renderKmTon(lesson, container) {
    let round = 0;
    const total = 6;

    function newRound() {
      const mode = randInt(0, 3);
      const pct = (round / total) * 100;
      let q, ans, hint;
      if (mode === 0) {
        const km = randInt(2, 9);
        q = `${km} 千米 = ? 米`;
        ans = km * 1000;
        hint = `1 千米 = 1000 米，${km} × 1000 = ${ans}`;
      } else if (mode === 1) {
        const m = [1000, 2000, 3000, 5000, 8000][randInt(0, 4)];
        q = `${m} 米 = ? 千米`;
        ans = m / 1000;
        hint = `${m} ÷ 1000 = ${ans}`;
      } else if (mode === 2) {
        const t = randInt(2, 8);
        q = `${t} 吨 = ? 千克`;
        ans = t * 1000;
        hint = `1 吨 = 1000 千克，${t} × 1000 = ${ans}`;
      } else {
        const kg = [1000, 2000, 3000, 6000][randInt(0, 3)];
        q = `${kg} 千克 = ? 吨`;
        ans = kg / 1000;
        hint = `${kg} ÷ 1000 = ${ans}`;
      }

      container.innerHTML =
        lessonShell(lesson) +
        `<div class="panel">
          <h3>千米与吨换算 (${round}/${total})</h3>
          <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
          <div class="quiz-display">${q}</div>
          <input type="number" class="answer-input" id="ansKt" inputmode="numeric" placeholder="?" />
          <div class="btn-group" style="justify-content:center">
            <button type="button" class="btn btn-primary" id="btnKt">提交</button>
          </div>
          ${feedbackEl("fb-kt")}
        </div>`;
      const input = document.getElementById("ansKt");
      input.focus();
      function submit() {
        const val = parseInt(input.value, 10);
        if (isNaN(val)) {
          showFeedback("fb-kt", false, "请输入数字。");
          return;
        }
        if (val === ans) {
          showFeedback("fb-kt", true, `对了！${hint}`);
          round++;
          if (round >= total) {
            addStars(2);
            markComplete("kmTon");
            return;
          }
          setTimeout(newRound, 1100);
        } else {
          showFeedback("fb-kt", false, `提示：${hint}`);
        }
      }
      document.getElementById("btnKt").onclick = submit;
      input.onkeydown = (e) => {
        if (e.key === "Enter") submit();
      };
    }
    newRound();
  }

  /* --- 毫米与分米（长度单位） --- */
  function renderMeasure(lesson, container) {
    let round = 0;
    const total = 6;

    function newRound() {
      const items = [
        { name: "蚂蚁身长", unit: "mm", val: 5, emoji: "🐜" },
        { name: "回形针", unit: "mm", val: 30, emoji: "📎" },
        { name: "课桌高度", unit: "dm", val: 8, emoji: "🪑" },
        { name: "铅笔长", unit: "cm", val: 18, emoji: "✏️" },
        { name: "成人身高", unit: "m", val: 175, emoji: "🧑" },
        { name: "小指厚", unit: "mm", val: 10, emoji: "🤏" },
      ];
      const mode = randInt(0, 1);
      const pct = (round / total) * 100;

      if (mode === 0) {
        // 单位换算
        const conv = [
          { q: "1 厘米 = ? 毫米", a: 10, h: "1 厘米 = 10 毫米" },
          { q: "1 分米 = ? 厘米", a: 10, h: "1 分米 = 10 厘米" },
          { q: "1 米 = ? 分米", a: 10, h: "1 米 = 10 分米" },
          { q: "1 米 = ? 厘米", a: 100, h: "1 米 = 100 厘米" },
          { q: "5 厘米 = ? 毫米", a: 50, h: "5 × 10 = 50" },
          { q: "3 分米 = ? 厘米", a: 30, h: "3 × 10 = 30" },
          { q: "20 毫米 = ? 厘米", a: 2, h: "20 ÷ 10 = 2" },
          { q: "40 厘米 = ? 分米", a: 4, h: "40 ÷ 10 = 4" },
        ];
        const c = conv[randInt(0, conv.length - 1)];
        container.innerHTML =
          lessonShell(lesson) +
          `<div class="panel">
            <h3>长度单位换算 (${round}/${total})</h3>
            <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
            <div class="quiz-display">${c.q}</div>
            <p style="text-align:center;color:#636e72;font-size:14px">毫米 → 厘米 → 分米 → 米，每级差 10 倍</p>
            <input type="number" class="answer-input" id="ansMeas" inputmode="numeric" placeholder="?" />
            <div class="btn-group" style="justify-content:center">
              <button type="button" class="btn btn-primary" id="btnMeas">提交</button>
            </div>
            ${feedbackEl("fb-meas")}
          </div>`;
        const input = document.getElementById("ansMeas");
        input.focus();
        function submit() {
          const val = parseInt(input.value, 10);
          if (val === c.a) {
            showFeedback("fb-meas", true, `对了！${c.h}`);
            round++;
            if (round >= total) {
              addStars(2);
              markComplete("measure");
              return;
            }
            setTimeout(newRound, 1100);
          } else {
            showFeedback("fb-meas", false, `提示：${c.h}`);
          }
        }
        document.getElementById("btnMeas").onclick = submit;
        input.onkeydown = (e) => {
          if (e.key === "Enter") submit();
        };
      } else {
        // 单位选择
        const item = items[randInt(0, items.length - 1)];
        const units = ["mm", "cm", "dm", "m"];
        container.innerHTML =
          lessonShell(lesson) +
          `<div class="panel">
            <h3>选合适的长度单位 (${round}/${total})</h3>
            <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
            <div class="length-item">
              <span class="length-emoji">${item.emoji}</span>
              <p>${item.name}大约 ${item.val} (?)</p>
            </div>
            <div class="unit-pad">
              <button type="button" class="unit-btn" data-u="mm">毫米</button>
              <button type="button" class="unit-btn" data-u="cm">厘米</button>
              <button type="button" class="unit-btn" data-u="dm">分米</button>
              <button type="button" class="unit-btn" data-u="m">米</button>
            </div>
            ${feedbackEl("fb-meas")}
          </div>`;
        document.querySelectorAll(".unit-btn").forEach((btn) => {
          btn.onclick = () => {
            if (btn.dataset.u === item.unit) {
              btn.classList.add("correct");
              const cn = { mm: "毫米", cm: "厘米", dm: "分米", m: "米" }[item.unit];
              showFeedback("fb-meas", true, `对了！${item.name} 用${cn}。`);
              round++;
              if (round >= total) {
                addStars(2);
                markComplete("measure");
                return;
              }
              setTimeout(newRound, 1100);
            } else {
              btn.classList.add("wrong");
              showFeedback("fb-meas", false, "想想物体的长短。");
              setTimeout(() => btn.classList.remove("wrong"), 700);
            }
          };
        });
      }
    }
    newRound();
  }

  /* --- 年月日 --- */
  function renderYmd(lesson, container) {
    let round = 0;
    const total = 6;

    const big = [1, 3, 5, 7, 8, 10, 12];
    const small = [4, 6, 9, 11];
    const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

    function isLeap(y) {
      return (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
    }

    function newRound() {
      const mode = randInt(0, 2);
      const pct = (round / total) * 100;

      if (mode === 0) {
        // 选大月
        container.innerHTML =
          lessonShell(lesson) +
          `<div class="panel">
            <h3>点出所有大月（31 天）(${round}/${total})</h3>
            <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
            <p style="text-align:center;color:#636e72">点击月份选中，再次点击取消。点完后提交。</p>
            <div class="month-grid" id="monthGrid"></div>
            <div class="btn-group" style="justify-content:center">
              <button type="button" class="btn btn-primary" id="btnYmd">提交</button>
            </div>
            ${feedbackEl("fb-ymd")}
          </div>`;
        const grid = document.getElementById("monthGrid");
        const selected = new Set();
        months.forEach((m) => {
          const cell = document.createElement("button");
          cell.type = "button";
          cell.className = "month-cell";
          cell.textContent = m + " 月";
          cell.onclick = () => {
            if (selected.has(m)) {
              selected.delete(m);
              cell.classList.remove("selected");
            } else {
              selected.add(m);
              cell.classList.add("selected");
            }
          };
          grid.appendChild(cell);
        });
        document.getElementById("btnYmd").onclick = () => {
          const want = new Set(big);
          const same = selected.size === want.size && [...selected].every((m) => want.has(m));
          if (same) {
            showFeedback("fb-ymd", true, "对了！大月：1,3,5,7,8,10,12 月（口诀：一三五七八十腊）。");
            round++;
            if (round >= total) {
              addStars(3);
              markComplete("ymd");
              return;
            }
            setTimeout(newRound, 1400);
          } else {
            showFeedback("fb-ymd", false, "口诀：一三五七八十腊，三十一天永不差。");
          }
        };
      } else if (mode === 1) {
        // 月份天数
        const m = months[randInt(0, 11)];
        const isLeapYear = Math.random() > 0.5;
        const ans = m === 2 ? (isLeapYear ? 29 : 28) : big.includes(m) ? 31 : 30;
        const yearTag = m === 2 ? `（${isLeapYear ? "闰" : "平"}年）` : "";
        container.innerHTML =
          lessonShell(lesson) +
          `<div class="panel">
            <h3>这个月有多少天？(${round}/${total})</h3>
            <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
            <div class="quiz-display">${m} 月${yearTag} = ? 天</div>
            <div class="pattern-options" id="dayOpts"></div>
            ${feedbackEl("fb-ymd")}
          </div>`;
        const opts = shuffle([28, 29, 30, 31]);
        opts.forEach((opt) => {
          const btn = document.createElement("button");
          btn.type = "button";
          btn.className = "pattern-opt";
          btn.textContent = opt + " 天";
          btn.onclick = () => {
            if (opt === ans) {
              btn.classList.add("correct");
              showFeedback("fb-ymd", true, `对了！${m} 月${yearTag} 有 ${ans} 天。`);
              round++;
              if (round >= total) {
                addStars(3);
                markComplete("ymd");
                return;
              }
              setTimeout(newRound, 1200);
            } else {
              btn.classList.add("wrong");
              showFeedback("fb-ymd", false, "大月 31 天，小月 30 天；2 月平年 28、闰年 29。");
            }
          };
          document.getElementById("dayOpts").appendChild(btn);
        });
      } else {
        // 判断闰年
        const year = randInt(1990, 2030);
        const leap = isLeap(year);
        container.innerHTML =
          lessonShell(lesson) +
          `<div class="panel">
            <h3>${year} 年是闰年吗？(${round}/${total})</h3>
            <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
            <p style="text-align:center;color:#636e72">年份能被 4 整除的就是闰年（整百年要能被 400 整除）</p>
            <div class="pattern-options">
              <button type="button" class="pattern-opt" data-leap="1">闰年</button>
              <button type="button" class="pattern-opt" data-leap="0">平年</button>
            </div>
            ${feedbackEl("fb-ymd")}
          </div>`;
        document.querySelectorAll(".pattern-opt").forEach((btn) => {
          btn.onclick = () => {
            const ans = btn.dataset.leap === "1";
            if (ans === leap) {
              btn.classList.add("correct");
              showFeedback("fb-ymd", true, `对了！${year} ÷ 4 = ${year / 4}，${leap ? "能" : "不能"}整除。`);
              round++;
              if (round >= total) {
                addStars(3);
                markComplete("ymd");
                return;
              }
              setTimeout(newRound, 1300);
            } else {
              btn.classList.add("wrong");
              showFeedback("fb-ymd", false, `${year} ÷ 4 = ${(year / 4).toFixed(2)}，看能不能整除。`);
            }
          };
        });
      }
    }
    newRound();
  }

  /* --- 24时计时法 --- */
  function renderClock24(lesson, container) {
    let round = 0;
    const total = 6;

    function newRound() {
      const mode = randInt(0, 1);
      const pct = (round / total) * 100;
      if (mode === 0) {
        // 普通 → 24时
        const isPm = Math.random() > 0.4;
        const h = isPm ? randInt(1, 11) : randInt(1, 11);
        const ans = isPm ? h + 12 : h;
        const txt = `${isPm ? "下午" : "上午"} ${h} 时`;
        container.innerHTML =
          lessonShell(lesson) +
          `<div class="panel">
            <h3>普通计时 → 24 时 (${round}/${total})</h3>
            <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
            <div class="quiz-display">${txt} = ? 时</div>
            <input type="number" class="answer-input" id="ans24" inputmode="numeric" placeholder="?" />
            <div class="btn-group" style="justify-content:center">
              <button type="button" class="btn btn-primary" id="btn24">提交</button>
            </div>
            ${feedbackEl("fb-24")}
          </div>`;
        const input = document.getElementById("ans24");
        input.focus();
        function submit() {
          const val = parseInt(input.value, 10);
          if (val === ans) {
            showFeedback("fb-24", true, `对了！${txt} = ${ans} 时`);
            round++;
            if (round >= total) {
              addStars(2);
              markComplete("clock24");
              return;
            }
            setTimeout(newRound, 1100);
          } else {
            showFeedback("fb-24", false, `${isPm ? "下午时刻 + 12 就是 24 时计时。" : "上午时刻不变。"}`);
          }
        }
        document.getElementById("btn24").onclick = submit;
        input.onkeydown = (e) => {
          if (e.key === "Enter") submit();
        };
      } else {
        // 24时 → 普通
        const h24 = randInt(1, 23);
        const isPm = h24 >= 13;
        const ansH = isPm ? h24 - 12 : h24;
        const ansLabel = isPm ? "下午" : h24 === 12 ? "中午" : "上午";
        container.innerHTML =
          lessonShell(lesson) +
          `<div class="panel">
            <h3>24 时 → 普通计时 (${round}/${total})</h3>
            <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
            <div class="quiz-display">${h24} 时 = ?</div>
            <div class="time-row">
              <label>上下午
                <select id="ampm" class="answer-input answer-input--sm" style="font-size:1rem">
                  <option value="上午">上午</option>
                  <option value="中午">中午</option>
                  <option value="下午">下午</option>
                </select>
              </label>
              <label>时
                <input type="number" class="answer-input answer-input--sm" id="hr" inputmode="numeric" />
              </label>
            </div>
            <div class="btn-group" style="justify-content:center">
              <button type="button" class="btn btn-primary" id="btn24b">提交</button>
            </div>
            ${feedbackEl("fb-24")}
          </div>`;
        document.getElementById("btn24b").onclick = () => {
          const ap = document.getElementById("ampm").value;
          const hr = parseInt(document.getElementById("hr").value, 10);
          if (isNaN(hr)) {
            showFeedback("fb-24", false, "请填写小时。");
            return;
          }
          if (ap === ansLabel && hr === ansH) {
            showFeedback("fb-24", true, `对了！${h24} 时 = ${ansLabel} ${ansH} 时`);
            round++;
            if (round >= total) {
              addStars(2);
              markComplete("clock24");
              return;
            }
            setTimeout(newRound, 1200);
          } else {
            showFeedback("fb-24", false, "13~23 时是下午（减 12），12 时是中午。");
          }
        };
      }
    }
    newRound();
  }

  /* --- 位置与方向 --- */
  function renderDirection(lesson, container) {
    let round = 0;
    const total = 5;

    const dirs = [
      { id: "N", label: "北", opp: "S" },
      { id: "S", label: "南", opp: "N" },
      { id: "E", label: "东", opp: "W" },
      { id: "W", label: "西", opp: "E" },
    ];

    function newRound() {
      const facing = dirs[randInt(0, 3)];
      const askWhat = randInt(0, 2);
      // 0=背后, 1=左边, 2=右边
      const facingMap = {
        N: { back: "S", left: "W", right: "E" },
        S: { back: "N", left: "E", right: "W" },
        E: { back: "W", left: "N", right: "S" },
        W: { back: "E", left: "S", right: "N" },
      };
      const ansId = askWhat === 0 ? facingMap[facing.id].back : askWhat === 1 ? facingMap[facing.id].left : facingMap[facing.id].right;
      const ansLabel = dirs.find((d) => d.id === ansId).label;
      const askLabel = askWhat === 0 ? "背后" : askWhat === 1 ? "左边" : "右边";
      const pct = (round / total) * 100;

      const arrow = { N: "⬆️", S: "⬇️", E: "➡️", W: "⬅️" }[facing.id];

      container.innerHTML =
        lessonShell(lesson) +
        `<div class="panel">
          <h3>方向辨认 (${round}/${total})</h3>
          <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
          <p style="text-align:center">小明面向 <b style="color:var(--primary)">${facing.label}</b>方，他的<b style="color:var(--accent)">${askLabel}</b>是哪个方向？</p>
          <div class="compass">
            <span class="compass-dir N">北</span>
            <span class="compass-dir S">南</span>
            <span class="compass-dir E">东</span>
            <span class="compass-dir W">西</span>
            <span class="compass-center">${arrow}</span>
          </div>
          <div class="pattern-options" id="dirOpts"></div>
          ${feedbackEl("fb-dir")}
        </div>`;

      shuffle(dirs).forEach((d) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "pattern-opt";
        btn.textContent = d.label;
        btn.onclick = () => {
          if (d.id === ansId) {
            btn.classList.add("correct");
            showFeedback("fb-dir", true, `对了！面向${facing.label}时，${askLabel}是${ansLabel}。`);
            round++;
            if (round >= total) {
              addStars(2);
              markComplete("direction");
              return;
            }
            setTimeout(newRound, 1200);
          } else {
            btn.classList.add("wrong");
            showFeedback("fb-dir", false, "想象一下面向不同方向时四方的关系。");
          }
        };
        document.getElementById("dirOpts").appendChild(btn);
      });
    }
    newRound();
  }

  /* --- 可能性 --- */
  function renderChance(lesson, container) {
    let round = 0;
    const total = 5;

    function newRound() {
      const mode = randInt(0, 2); // 0=一定, 1=不可能, 2=可能
      let red, yellow, ask, ansLabel, hint;
      if (mode === 0) {
        red = randInt(3, 6);
        yellow = 0;
        ask = "🔴";
        ansLabel = "一定";
        hint = "全是红球，所以一定摸到红球。";
      } else if (mode === 1) {
        red = randInt(3, 6);
        yellow = 0;
        ask = "🟡";
        ansLabel = "不可能";
        hint = "里面没有黄球，所以不可能摸到。";
      } else {
        red = randInt(2, 4);
        yellow = randInt(2, 4);
        ask = Math.random() > 0.5 ? "🔴" : "🟡";
        ansLabel = "可能";
        hint = `里面既有红球又有黄球，摸到 ${ask} 是可能的。`;
      }
      const balls = "🔴".repeat(red) + "🟡".repeat(yellow);
      const pct = (round / total) * 100;
      container.innerHTML =
        lessonShell(lesson) +
        `<div class="panel">
          <h3>摸球游戏 (${round}/${total})</h3>
          <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
          <p style="text-align:center;color:#636e72">袋子里有这些球，从中任意摸一个，摸到 ${ask} 是？</p>
          <div class="bag-display">🎒 ${balls}</div>
          <div class="pattern-options" id="chanceOpts"></div>
          ${feedbackEl("fb-ch")}
        </div>`;
      shuffle(["一定", "可能", "不可能"]).forEach((opt) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "pattern-opt";
        btn.textContent = opt;
        btn.onclick = () => {
          if (opt === ansLabel) {
            btn.classList.add("correct");
            showFeedback("fb-ch", true, hint);
            round++;
            if (round >= total) {
              addStars(2);
              markComplete("chance");
              return;
            }
            setTimeout(newRound, 1300);
          } else {
            btn.classList.add("wrong");
            showFeedback("fb-ch", false, "想想里面有没有这种球，是不是只有这种球。");
          }
        };
        document.getElementById("chanceOpts").appendChild(btn);
      });
    }
    newRound();
  }

  /* --- 数学广角：集合 --- */
  function renderVenn(lesson, container) {
    let round = 0;
    const total = 4;

    function newRound() {
      const a = randInt(6, 12); // 参加 A 的人数
      const b = randInt(5, 10); // 参加 B 的人数
      const both = randInt(1, Math.min(a, b) - 1); // 同时参加
      const total_unique = a + b - both;
      const pct = (round / total) * 100;
      const activities = [
        ["跑步 🏃", "跳绳 🤸"],
        ["语文 📕", "数学 📘"],
        ["唱歌 🎤", "跳舞 💃"],
        ["足球 ⚽", "篮球 🏀"],
      ];
      const [aName, bName] = activities[randInt(0, activities.length - 1)];

      container.innerHTML =
        lessonShell(lesson) +
        `<div class="panel">
          <h3>韦恩图：重叠问题 (${round}/${total})</h3>
          <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
          <p style="text-align:center;line-height:1.7">参加${aName}的有 <b>${a}</b> 人，参加${bName}的有 <b>${b}</b> 人，<br>两项都参加的有 <b>${both}</b> 人。一共有多少人？</p>
          <div class="venn-wrap">
            <svg class="venn-svg" width="320" height="200" viewBox="0 0 320 200">
              <circle cx="120" cy="100" r="80" fill="#00b894" fill-opacity="0.4" stroke="#00b894" stroke-width="3" />
              <circle cx="200" cy="100" r="80" fill="#fdcb6e" fill-opacity="0.5" stroke="#fdcb6e" stroke-width="3" />
              <text x="70" y="100" text-anchor="middle" font-family="ZCOOL KuaiLe" font-size="22" fill="#2d3436">${a - both}</text>
              <text x="160" y="100" text-anchor="middle" font-family="ZCOOL KuaiLe" font-size="22" fill="#2d3436">${both}</text>
              <text x="250" y="100" text-anchor="middle" font-family="ZCOOL KuaiLe" font-size="22" fill="#2d3436">${b - both}</text>
              <text x="100" y="30" text-anchor="middle" font-family="ZCOOL KuaiLe" font-size="14" fill="#2d3436">${aName}</text>
              <text x="220" y="30" text-anchor="middle" font-family="ZCOOL KuaiLe" font-size="14" fill="#2d3436">${bName}</text>
            </svg>
          </div>
          <p style="text-align:center;color:#636e72;font-size:14px">一共 = ${a} + ${b} − ${both}</p>
          <input type="number" class="answer-input" id="ansVenn" inputmode="numeric" placeholder="一共?人" />
          <div class="btn-group" style="justify-content:center">
            <button type="button" class="btn btn-primary" id="btnVenn">提交</button>
          </div>
          ${feedbackEl("fb-venn")}
        </div>`;
      const input = document.getElementById("ansVenn");
      input.focus();
      function submit() {
        const val = parseInt(input.value, 10);
        if (val === total_unique) {
          showFeedback("fb-venn", true, `对了！${a} + ${b} − ${both} = ${total_unique} 人`);
          round++;
          if (round >= total) {
            addStars(3);
            markComplete("venn");
            return;
          }
          setTimeout(newRound, 1300);
        } else {
          showFeedback("fb-venn", false, `重叠部分要减去一次：${a} + ${b} − ${both} = ?`);
        }
      }
      document.getElementById("btnVenn").onclick = submit;
      input.onkeydown = (e) => {
        if (e.key === "Enter") submit();
      };
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
