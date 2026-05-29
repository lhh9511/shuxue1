(function () {
  const STORAGE_KEY = "math-grade2-progress";

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
    const colors = ["#6c5ce7", "#00cec9", "#fdcb6e", "#e17055", "#74b9ff"];
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
        existing.classList.add("active");
      } else {
        const page = document.createElement("section");
        page.className = "page active";
        page.id = "page-" + pageId;
        document.getElementById("main").appendChild(page);
        renderLesson(pageId, page);
      }
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
      hundred: renderHundred,
      compare100: renderCompare100,
      multiply: renderMultiply,
      divide: renderDivide,
      mixed: renderMixed,
      money: renderMoney,
      length: renderLength,
      clock2: renderClock2,
      pattern2: renderPattern2,
    };
    renderers[id]?.(lesson, container);
  }

  /* --- 100以内的数 --- */
  function renderHundred(lesson, container) {
    let round = 0;

    function draw() {
      const tens = randInt(1, 9);
      const ones = randInt(0, 9);
      const num = tens * 10 + ones;
      const blocks = Array(tens).fill("🟦").join("") + Array(ones).fill("🟩").join("");

      container.innerHTML =
        lessonShell(lesson) +
        `<div class="panel">
          <h3>第 ${round + 1} 关：看图写数</h3>
          <p style="text-align:center;color:#636e72;margin-bottom:12px">🟦 = 1 个十 &nbsp; 🟩 = 1 个一</p>
          <div class="place-value-display">${blocks || "🟩"}</div>
          <p style="text-align:center;font-family:var(--font-display);font-size:1.2rem;color:var(--text-muted)">
            十位 ${tens} 个，个位 ${ones} 个
          </p>
          <div class="number-pad" id="numPadHundred"></div>
          ${feedbackEl("fb-hundred")}
        </div>`;

      const options = shuffle(
        [num, ...pick([11, 22, 33, 44, 55, 66, 77, 88, 99, num + 10, num - 10, num + 1, num - 1].filter((x) => x >= 10 && x <= 99 && x !== num), 4)].slice(0, 5)
      );

      const pad = document.getElementById("numPadHundred");
      options.forEach((n) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "num-btn";
        btn.textContent = n;
        btn.onclick = () => {
          if (n === num) {
            btn.classList.add("correct");
            showFeedback("fb-hundred", true, `正确！这就是 ${num}。`);
            round++;
            if (round >= 5) {
              addStars(2);
              markComplete("hundred");
            }
            setTimeout(draw, 1000);
          } else {
            btn.classList.add("wrong");
            showFeedback("fb-hundred", false, "再看看十位和个位各有多少。");
          }
        };
        pad.appendChild(btn);
      });
    }

    draw();
  }

  /* --- 比大小 --- */
  function renderCompare100(lesson, container) {
    let round = 0;

    function newRound() {
      let a = randInt(10, 99);
      let b = randInt(10, 99);
      while (b === a) b = randInt(10, 99);

      container.innerHTML =
        lessonShell(lesson) +
        `<div class="panel">
          <h3>第 ${round + 1} 关：在 ○ 里填 &gt;、&lt; 或 =</h3>
          <div class="compare-expr">
            <span class="compare-num">${a}</span>
            <button type="button" class="compare-fill" id="symBtn">?</button>
            <span class="compare-num">${b}</span>
          </div>
          <div class="symbol-pad" id="symPad">
            <button type="button" class="sym-btn" data-sym=">">&gt;</button>
            <button type="button" class="sym-btn" data-sym="<">&lt;</button>
            <button type="button" class="sym-btn" data-sym="=">=</button>
          </div>
          ${feedbackEl("fb-compare100")}
        </div>`;

      const correct = a > b ? ">" : a < b ? "<" : "=";
      document.querySelectorAll(".sym-btn").forEach((btn) => {
        btn.onclick = () => {
          const sym = btn.dataset.sym;
          document.getElementById("symBtn").textContent = sym;
          if (sym === correct) {
            btn.classList.add("correct");
            showFeedback("fb-compare100", true, "答对了！");
            round++;
            if (round >= 5) {
              addStars(2);
              markComplete("compare100");
            }
            setTimeout(newRound, 1200);
          } else {
            btn.classList.add("wrong");
            showFeedback("fb-compare100", false, "先比十位，再比个位哦！");
            setTimeout(() => btn.classList.remove("wrong"), 800);
          }
        };
      });
    }

    newRound();
  }

  /* --- 表内乘法 --- */
  function renderMultiply(lesson, container) {
    let score = 0;
    const total = 10;
    let current = null;

    function genProblem() {
      const a = randInt(2, 9);
      const b = randInt(2, 9);
      return { text: `${a} × ${b} = ?`, ans: a * b };
    }

    function draw() {
      current = genProblem();
      const pct = (score / total) * 100;
      container.innerHTML =
        lessonShell(lesson) +
        `<div class="panel">
          <h3>乘法口诀 (${score}/${total})</h3>
          <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
          <div class="quiz-display">${current.text}</div>
          <div class="multiply-hint">想口诀：${current.text.replace("?", "").trim()}</div>
          <input type="number" class="answer-input" id="ansMul" min="0" max="81" inputmode="numeric" />
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
          showFeedback("fb-mul", true, "正确！口诀真熟练！");
          if (score >= total) {
            addStars(3);
            markComplete("multiply");
            showFeedback("fb-mul", true, "全部完成！乘法小能手！");
            return;
          }
          setTimeout(draw, 800);
        } else {
          showFeedback("fb-mul", false, `再想想，${current.text.replace("?", current.ans)}`);
        }
      }

      document.getElementById("btnMul").onclick = submit;
      input.onkeydown = (e) => {
        if (e.key === "Enter") submit();
      };
    }

    draw();
  }

  /* --- 表内除法 --- */
  function renderDivide(lesson, container) {
    let round = 0;

    function newRound() {
      const b = randInt(2, 9);
      const ans = randInt(2, 9);
      const a = b * ans;

      container.innerHTML =
        lessonShell(lesson) +
        `<div class="panel">
          <h3>第 ${round + 1} 关：平均分</h3>
          <p style="text-align:center;color:#636e72">${a} 个 ${FRUITS[randInt(0, FRUITS.length - 1)]} 平均分给 ${b} 人，每人几个？</p>
          <div class="divide-visual" id="divideVisual"></div>
          <div class="quiz-display">${a} ÷ ${b} = ?</div>
          <div class="number-pad" id="divPad"></div>
          ${feedbackEl("fb-div")}
        </div>`;

      const visual = document.getElementById("divideVisual");
      for (let i = 0; i < b; i++) {
        const group = document.createElement("div");
        group.className = "divide-group";
        group.innerHTML = `<span class="divide-label">第 ${i + 1} 人</span><div class="divide-items">${"🍎".repeat(ans)}</div>`;
        visual.appendChild(group);
      }

      const options = shuffle([ans, ans + 1, ans - 1, b, a - b].filter((x) => x > 0 && x <= 9));
      const pad = document.getElementById("divPad");
      [...new Set(options)].slice(0, 5).forEach((n) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "num-btn";
        btn.textContent = n;
        btn.onclick = () => {
          if (n === ans) {
            btn.classList.add("correct");
            showFeedback("fb-div", true, `对了！${a} ÷ ${b} = ${ans}`);
            round++;
            if (round >= 5) {
              addStars(2);
              markComplete("divide");
            }
            setTimeout(newRound, 1200);
          } else {
            btn.classList.add("wrong");
            showFeedback("fb-div", false, "想乘法口诀：几 × " + b + " = " + a + "？");
          }
        };
        pad.appendChild(btn);
      });
    }

    newRound();
  }

  /* --- 加减混合 --- */
  function renderMixed(lesson, container) {
    let score = 0;
    const total = 10;
    let current = null;

    function genProblem() {
      const types = ["add", "sub", "mixed"];
      const type = types[randInt(0, types.length - 1)];
      if (type === "add") {
        const a = randInt(10, 50);
        const b = randInt(10, 49);
        if (a + b > 99) return genProblem();
        return { text: `${a} + ${b} = ?`, ans: a + b };
      }
      if (type === "sub") {
        const a = randInt(30, 99);
        const b = randInt(10, a - 1);
        return { text: `${a} − ${b} = ?`, ans: a - b };
      }
      const a = randInt(20, 60);
      const b = randInt(5, 20);
      const c = randInt(5, 20);
      if (a + b - c < 0 || a + b - c > 99) return genProblem();
      return { text: `${a} + ${b} − ${c} = ?`, ans: a + b - c };
    }

    function draw() {
      current = genProblem();
      const pct = (score / total) * 100;
      container.innerHTML =
        lessonShell(lesson) +
        `<div class="panel">
          <h3>100 以内口算 (${score}/${total})</h3>
          <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
          <div class="quiz-display">${current.text}</div>
          <input type="number" class="answer-input" id="ansMixed" min="0" max="99" inputmode="numeric" />
          <div class="btn-group" style="justify-content:center">
            <button type="button" class="btn btn-primary" id="btnMixed">提交答案</button>
          </div>
          ${feedbackEl("fb-mixed")}
        </div>`;

      const input = document.getElementById("ansMixed");
      input.focus();

      function submit() {
        const val = parseInt(input.value, 10);
        if (isNaN(val)) {
          showFeedback("fb-mixed", false, "请输入数字哦！");
          return;
        }
        if (val === current.ans) {
          score++;
          showFeedback("fb-mixed", true, "正确！");
          if (score >= total) {
            addStars(3);
            markComplete("mixed");
            return;
          }
          setTimeout(draw, 800);
        } else {
          showFeedback("fb-mixed", false, `答案是 ${current.ans}，再算一遍。`);
        }
      }

      document.getElementById("btnMixed").onclick = submit;
      input.onkeydown = (e) => {
        if (e.key === "Enter") submit();
      };
    }

    draw();
  }

  /* --- 认识人民币 --- */
  function renderMoney(lesson, container) {
    let round = 0;

    function newRound() {
      const yuan = randInt(1, 9);
      const jiao = [0, 5][randInt(0, 1)];
      const totalFen = yuan * 100 + jiao * 10;
      const display = jiao ? `${yuan} 元 ${jiao} 角` : `${yuan} 元`;

      container.innerHTML =
        lessonShell(lesson) +
        `<div class="panel">
          <h3>第 ${round + 1} 关：一共多少钱？</h3>
          <div class="money-items">
            <span class="money-bill">💵 ${yuan} 元</span>
            ${jiao ? `<span class="money-coin">🪙 ${jiao} 角</span>` : ""}
          </div>
          <p style="text-align:center;font-family:var(--font-display);font-size:1.3rem;margin:16px 0">合计 = ? 角</p>
          <input type="number" class="answer-input" id="ansMoney" min="0" max="999" inputmode="numeric" />
          <div class="btn-group" style="justify-content:center">
            <button type="button" class="btn btn-primary" id="btnMoney">提交</button>
          </div>
          <p style="text-align:center;font-size:14px;color:#636e72;margin-top:8px">提示：1 元 = 10 角，${display}</p>
          ${feedbackEl("fb-money")}
        </div>`;

      document.getElementById("btnMoney").onclick = () => {
        const val = parseInt(document.getElementById("ansMoney").value, 10);
        const ansJiao = yuan * 10 + jiao;
        if (isNaN(val)) {
          showFeedback("fb-money", false, "请输入多少角。");
          return;
        }
        if (val === ansJiao) {
          showFeedback("fb-money", true, `正确！${display} = ${ansJiao} 角`);
          round++;
          if (round >= 4) {
            addStars(2);
            markComplete("money");
          }
          setTimeout(newRound, 1200);
        } else {
          showFeedback("fb-money", false, `想想：${yuan} 元 = ${yuan * 10} 角，再加上 ${jiao} 角。`);
        }
      };
    }

    newRound();
  }

  /* --- 长度单位 --- */
  function renderLength(lesson, container) {
    const items = [
      { name: "铅笔", len: 15, unit: "cm", emoji: "✏️" },
      { name: "课桌", len: 1, unit: "m", emoji: "🪑" },
      { name: "橡皮", len: 3, unit: "cm", emoji: "🧽" },
      { name: "教室", len: 8, unit: "m", emoji: "🏫" },
      { name: "数学书", len: 21, unit: "cm", emoji: "📖" },
    ];
    let round = 0;

    function newRound() {
      const item = items[randInt(0, items.length - 1)];
      const wrongUnit = item.unit === "cm" ? "m" : "cm";

      container.innerHTML =
        lessonShell(lesson) +
        `<div class="panel">
          <h3>第 ${round + 1} 关：选择合适的单位</h3>
          <div class="length-item">
            <span class="length-emoji">${item.emoji}</span>
            <p>${item.name} 大约 ${item.len} （ ？ ）</p>
          </div>
          <div class="unit-pad">
            <button type="button" class="unit-btn" data-u="cm">厘米 cm</button>
            <button type="button" class="unit-btn" data-u="m">米 m</button>
          </div>
          ${feedbackEl("fb-length")}
        </div>`;

      document.querySelectorAll(".unit-btn").forEach((btn) => {
        btn.onclick = () => {
          if (btn.dataset.u === item.unit) {
            btn.classList.add("correct");
            showFeedback("fb-length", true, `对了！${item.name} 用 ${item.unit === "cm" ? "厘米" : "米"} 更合适。`);
            round++;
            if (round >= 5) {
              addStars(2);
              markComplete("length");
            }
            setTimeout(newRound, 1200);
          } else {
            btn.classList.add("wrong");
            showFeedback("fb-length", false, `${item.name} 应该用 ${wrongUnit === item.unit ? "厘米" : "米"} 吗？再想想长短。`);
          }
        };
      });
    }

    newRound();
  }

  /* --- 认识时间（整点+半点）--- */
  function renderClock2(lesson, container) {
    let round = 0;

    function hourAngle(h, half) {
      return (h % 12) * 30 + (half ? 15 : 0);
    }

    function minuteAngle(half) {
      return half ? 180 : 0;
    }

    function newRound() {
      const hour = randInt(1, 12);
      const isHalf = Math.random() > 0.5;
      const targetText = isHalf ? `${hour} 点半` : `${hour} 点整`;

      container.innerHTML =
        lessonShell(lesson) +
        `<div class="panel">
          <h3>第 ${round + 1} 关：拨到 ${targetText}</h3>
          <div class="clock-face" id="clockFace2">
            <div class="clock-hand clock-hour" id="hourHand2"></div>
            <div class="clock-hand clock-minute" id="minuteHand2"></div>
            <div class="clock-center"></div>
          </div>
          <div class="clock-controls">
            <label>时针
              <input type="range" id="hourRange2" min="1" max="12" value="${hour}" />
              <span id="hourVal2">${hour}</span> 时
            </label>
            <label>分针
              <select id="minuteSelect2">
                <option value="0" ${!isHalf ? "selected" : ""}>指向 12（整点）</option>
                <option value="30" ${isHalf ? "selected" : ""}>指向 6（半点）</option>
              </select>
            </label>
          </div>
          ${feedbackEl("fb-clock2")}
          <div class="btn-group" style="justify-content:center">
            <button type="button" class="btn btn-primary" id="btnClock2">确认时刻</button>
          </div>
        </div>`;

      placeClockLabels("clockFace2");

      const hourRange = document.getElementById("hourRange2");
      const hourHand = document.getElementById("hourHand2");
      const minuteHand = document.getElementById("minuteHand2");
      const minuteSelect = document.getElementById("minuteSelect2");

      function updateHands() {
        const h = +hourRange.value;
        const half = +minuteSelect.value === 30;
        document.getElementById("hourVal2").textContent = h;
        hourHand.style.transform = `translateX(-50%) rotate(${hourAngle(h, half)}deg)`;
        minuteHand.style.transform = `translateX(-50%) rotate(${minuteAngle(half)}deg)`;
      }

      hourRange.oninput = updateHands;
      minuteSelect.onchange = updateHands;
      updateHands();

      document.getElementById("btnClock2").onclick = () => {
        const h = +hourRange.value;
        const half = +minuteSelect.value === 30;
        if (h === hour && half === isHalf) {
          showFeedback("fb-clock2", true, `正确！现在是 ${targetText}。`);
          round++;
          if (round >= 4) {
            addStars(2);
            markComplete("clock2");
          }
          setTimeout(newRound, 1200);
        } else {
          showFeedback("fb-clock2", false, `请拨到 ${targetText}。`);
        }
      };
    }

    function placeClockLabels(faceId) {
      const face = document.getElementById(faceId);
      for (let i = 1; i <= 12; i++) {
        const ang = ((i - 3) * 30 * Math.PI) / 180;
        const lbl = document.createElement("span");
        lbl.className = "clock-label";
        lbl.textContent = i;
        lbl.style.left = 50 + 38 * Math.cos(ang) + "%";
        lbl.style.top = 50 + 38 * Math.sin(ang) + "%";
        lbl.style.transform = "translate(-50%, -50%)";
        face.appendChild(lbl);
      }
    }

    newRound();
  }

  /* --- 找规律 --- */
  function renderPattern2(lesson, container) {
    const patterns = [
      { seq: [2, 4, 6, 8], answer: 10, step: "+2" },
      { seq: [5, 10, 15, 20], answer: 25, step: "+5" },
      { seq: [30, 27, 24, 21], answer: 18, step: "−3" },
      { seq: [1, 3, 5, 7], answer: 9, step: "+2" },
      { seq: [10, 20, 30, 40], answer: 50, step: "+10" },
    ];
    let round = 0;

    function newRound() {
      const p = patterns[randInt(0, patterns.length - 1)];
      const options = shuffle([p.answer, p.answer + 2, p.answer - 2, p.answer + 5, p.answer - 5].filter((x) => x > 0 && x <= 99));
      const uniqueOpts = [...new Set(options)].slice(0, 4);

      container.innerHTML =
        lessonShell(lesson) +
        `<div class="panel">
          <h3>第 ${round + 1} 关：找规律填数</h3>
          <div class="pattern-row pattern-row--nums" id="patternRow2"></div>
          <p style="text-align:center;color:#636e72;font-size:14px">每次 ${p.step}</p>
          <div class="pattern-options" id="patternOpts2"></div>
          ${feedbackEl("fb-pattern2")}
        </div>`;

      const row = document.getElementById("patternRow2");
      p.seq.forEach((n) => {
        const span = document.createElement("span");
        span.className = "pattern-num";
        span.textContent = n;
        row.appendChild(span);
      });
      const slot = document.createElement("div");
      slot.className = "pattern-slot";
      slot.textContent = "?";
      row.appendChild(slot);

      const opts = document.getElementById("patternOpts2");
      uniqueOpts.forEach((opt) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "pattern-opt pattern-opt--num";
        btn.textContent = opt;
        btn.onclick = () => {
          if (opt === p.answer) {
            slot.textContent = opt;
            showFeedback("fb-pattern2", true, "规律找对了！");
            round++;
            if (round >= 5) {
              addStars(2);
              markComplete("pattern2");
            }
            setTimeout(newRound, 1200);
          } else {
            showFeedback("fb-pattern2", false, "看看相邻两个数相差多少？");
          }
        };
        opts.appendChild(btn);
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
