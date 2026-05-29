(function () {
  const STORAGE_KEY = "math-grade1-progress";

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
    const colors = ["#ff6b6b", "#4ecdc4", "#ffe66d", "#a29bfe", "#fd79a8"];
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

  /* ---------- Navigation ---------- */
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

  /* ---------- Lesson renderers ---------- */
  function renderLesson(id, container) {
    const lesson = LESSONS.find((l) => l.id === id);
    if (!lesson) return;

    switch (id) {
      case "counting":
        renderCounting(lesson, container);
        break;
      case "compare":
        renderCompare(lesson, container);
        break;
      case "sort":
        renderSort(lesson, container);
        break;
      case "position":
        renderPosition(lesson, container);
        break;
      case "numbers":
        renderNumbers(lesson, container);
        break;
      case "shapes":
        renderShapes(lesson, container);
        break;
      case "clock":
        renderClock(lesson, container);
        break;
      case "addsub":
        renderAddSub(lesson, container);
        break;
      case "pattern":
        renderPattern(lesson, container);
        break;
    }
  }

  /* --- 数一数 --- */
  function renderCounting(lesson, container) {
    let target = randInt(3, 10);
    let emoji = FRUITS[randInt(0, FRUITS.length - 1)];
    let round = 0;

    function draw() {
      container.innerHTML =
        lessonShell(lesson) +
        `<div class="panel">
          <h3>第 ${round + 1} 关：数一数有几个？</h3>
          <div class="count-row" id="countDisplay"></div>
          <div class="number-pad" id="numPad"></div>
          ${feedbackEl("fb-count")}
          <div class="btn-group">
            <button type="button" class="btn btn-outline" id="btnRecount">再数一遍</button>
          </div>
        </div>`;

      const display = document.getElementById("countDisplay");
      for (let i = 0; i < target; i++) {
        const span = document.createElement("span");
        span.className = "count-item";
        span.textContent = emoji;
        span.style.animationDelay = i * 0.05 + "s";
        span.addEventListener("click", () => {
          span.style.transform = "scale(1.3)";
          setTimeout(() => (span.style.transform = ""), 200);
        });
        display.appendChild(span);
      }

      const pad = document.getElementById("numPad");
      for (let n = 1; n <= 10; n++) {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "num-btn";
        btn.textContent = n;
        btn.addEventListener("click", () => checkAnswer(n, btn));
        pad.appendChild(btn);
      }

      document.getElementById("btnRecount").onclick = () => draw();
    }

    function checkAnswer(n, btn) {
      document.querySelectorAll("#numPad .num-btn").forEach((b) => (b.disabled = true));
      if (n === target) {
        btn.classList.add("correct");
        showFeedback("fb-count", true, "答对啦！你真会数数！");
        round++;
        if (round >= 3) {
          addStars(2);
          markComplete("counting");
        }
        setTimeout(() => {
          target = randInt(3, 10);
          emoji = FRUITS[randInt(0, FRUITS.length - 1)];
          draw();
        }, 1200);
      } else {
        btn.classList.add("wrong");
        showFeedback("fb-count", false, `再试试，一共有几个 ${emoji}？`);
        setTimeout(() => {
          document.querySelectorAll("#numPad .num-btn").forEach((b) => {
            b.disabled = false;
            b.classList.remove("wrong", "correct");
          });
          document.getElementById("fb-count").className = "feedback";
        }, 1000);
      }
    }

    draw();
  }

  /* --- 比一比 --- */
  function renderCompare(lesson, container) {
    let round = 0;

    function newRound() {
      const a = randInt(1, 9);
      let b = randInt(1, 9);
      while (b === a) b = randInt(1, 9);
      const leftEmoji = ANIMALS[randInt(0, ANIMALS.length - 1)];
      const rightEmoji = ANIMALS[randInt(0, ANIMALS.length - 1)];

      container.innerHTML =
        lessonShell(lesson) +
        `<div class="panel">
          <h3>哪边更多？点一点</h3>
          <div class="compare-zone">
            <div class="compare-box" data-side="left" id="boxLeft">
              ${Array(a).fill(leftEmoji).join(" ")}
            </div>
            <span class="compare-symbol" id="sym">?</span>
            <div class="compare-box" data-side="right" id="boxRight">
              ${Array(b).fill(rightEmoji).join(" ")}
            </div>
          </div>
          <p style="text-align:center;color:#636e72">左边 ${a} 个，右边 ${b} 个</p>
          ${feedbackEl("fb-compare")}
        </div>`;

      const sym = document.getElementById("sym");
      const fb = "fb-compare";

      function pickSide(side) {
        const correct =
          (side === "left" && a > b) ||
          (side === "right" && b > a) ||
          (a === b && side === "left");
        if (a === b) {
          sym.textContent = "=";
          showFeedback(fb, true, "两边一样多！");
          addStars(1);
          next();
          return;
        }
        if (correct) {
          sym.textContent = side === "left" ? ">" : "<";
          document.getElementById(side === "left" ? "boxLeft" : "boxRight").classList.add("selected");
          showFeedback(fb, true, "答对了！");
          round++;
          if (round >= 3) {
            addStars(2);
            markComplete("compare");
          }
          next();
        } else {
          showFeedback(fb, false, "再比一比，哪边更多？");
        }
      }

      document.getElementById("boxLeft").onclick = () => pickSide("left");
      document.getElementById("boxRight").onclick = () => pickSide("right");
    }

    function next() {
      setTimeout(newRound, 1400);
    }

    newRound();
  }

  /* --- 分一分 --- */
  function renderSort(lesson, container) {
    const red = ["🍎", "🍓", "🍉", "🍒"];
    const yellow = ["🍌", "🍋", "🌽", "⭐"];
    const items = shuffle([...pick(red, 3), ...pick(yellow, 3)]);

    container.innerHTML =
      lessonShell(lesson) +
      `<div class="panel">
        <h3>把水果拖到正确的筐里</h3>
        <p style="text-align:center;color:#636e72;margin-bottom:16px">红色水果 🧺 | 黄色水果 🧺</p>
        <div class="sort-bins">
          <div class="sort-bin" data-bin="red"><h4>🔴 红色</h4></div>
          <div class="sort-bin" data-bin="yellow"><h4>🟡 黄色</h4></div>
        </div>
        <div class="sort-items" id="sortPool"></div>
        ${feedbackEl("fb-sort")}
        <div class="btn-group" style="justify-content:center">
          <button type="button" class="btn btn-primary" id="btnCheckSort">检查答案</button>
        </div>
      </div>`;

    const pool = document.getElementById("sortPool");
    items.forEach((em) => {
      const chip = document.createElement("span");
      chip.className = "sort-chip";
      chip.textContent = em;
      chip.draggable = true;
      chip.dataset.emoji = em;
      pool.appendChild(chip);
    });

    setupDragDrop();
    let sorted = 0;

    document.getElementById("btnCheckSort").onclick = () => {
      const bins = document.querySelectorAll(".sort-bin");
      let ok = true;
      bins.forEach((bin) => {
        const type = bin.dataset.bin;
        bin.querySelectorAll(".sort-chip").forEach((chip) => {
          const em = chip.dataset.emoji;
          const isRed = red.includes(em);
          if ((type === "red" && !isRed) || (type === "yellow" && isRed)) ok = false;
        });
      });
      const totalInBins = document.querySelectorAll(".sort-bin .sort-chip").length;
      if (totalInBins < 6) {
        showFeedback("fb-sort", false, "还有水果没分完哦！");
        return;
      }
      if (ok) {
        showFeedback("fb-sort", true, "分类正确！你真棒！");
        sorted++;
        if (sorted >= 1) {
          addStars(2);
          markComplete("sort");
        }
      } else {
        showFeedback("fb-sort", false, "有的放错筐了，再想想颜色！");
      }
    };
  }

  function setupDragDrop() {
    let dragged = null;

    document.addEventListener("dragstart", (e) => {
      if (!e.target.classList.contains("sort-chip")) return;
      dragged = e.target;
      e.target.classList.add("dragging");
    });

    document.addEventListener("dragend", (e) => {
      if (e.target.classList) e.target.classList.remove("dragging");
      dragged = null;
    });

    document.querySelectorAll(".sort-bin, #sortPool").forEach((zone) => {
      zone.addEventListener("dragover", (e) => {
        e.preventDefault();
      });
      zone.addEventListener("drop", (e) => {
        e.preventDefault();
        if (dragged) zone.appendChild(dragged);
      });
    });

    document.querySelectorAll(".sort-chip").forEach((chip) => {
      chip.addEventListener("click", () => {
        const bins = document.querySelectorAll(".sort-bin");
        const pool = document.getElementById("sortPool");
        const inPool = pool.contains(chip);
        if (inPool) bins[0].appendChild(chip);
        else if (chip.parentElement === bins[0]) bins[1].appendChild(chip);
        else pool.appendChild(chip);
      });
    });
  }

  /* --- 认位置 --- */
  function renderPosition(lesson, container) {
    const labels = [
      { pos: [0, 1], word: "上" },
      { pos: [2, 1], word: "下" },
      { pos: [1, 0], word: "左" },
      { pos: [1, 2], word: "右" },
    ];
    let round = 0;

    function newRound() {
      const q = labels[randInt(0, labels.length - 1)];
      const star = [randInt(0, 2), randInt(0, 2)];
      if (star[0] === q.pos[0] && star[1] === q.pos[1]) {
        newRound();
        return;
      }

      container.innerHTML =
        lessonShell(lesson) +
        `<div class="panel">
          <h3>星星在苹果的哪边？点正确的格子</h3>
          <p style="text-align:center;font-family:var(--font-display);font-size:1.5rem;margin-bottom:16px">
            星星在苹果的 <strong style="color:var(--primary)">${q.word}边</strong>
          </p>
          <div class="pos-grid" id="posGrid"></div>
          ${feedbackEl("fb-pos")}
        </div>`;

      const grid = document.getElementById("posGrid");
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
          const cell = document.createElement("button");
          cell.type = "button";
          cell.className = "pos-cell";
          if (r === 1 && c === 1) {
            cell.textContent = "🍎";
            cell.disabled = true;
          } else if (r === star[0] && c === star[1]) {
            cell.textContent = "⭐";
            cell.dataset.star = "1";
          }
          cell.dataset.r = r;
          cell.dataset.c = c;
          if (r === q.pos[0] && c === q.pos[1]) cell.classList.add("target");
          cell.addEventListener("click", () => {
            if (r === q.pos[0] && c === q.pos[1]) {
              cell.classList.add("correct");
              showFeedback("fb-pos", true, `对了！星星在苹果的${q.word}边。`);
              round++;
              if (round >= 4) {
                addStars(2);
                markComplete("position");
              }
              setTimeout(newRound, 1200);
            } else {
              cell.classList.add("wrong");
              showFeedback("fb-pos", false, "再想想方位哦！");
            }
          });
          grid.appendChild(cell);
        }
      }
    }

    newRound();
  }

  /* --- 10以内的数 --- */
  function renderNumbers(lesson, container) {
    let n = randInt(1, 10);
    let round = 0;

    function draw() {
      const dots = Array(n).fill("●").join(" ");
      container.innerHTML =
        lessonShell(lesson) +
        `<div class="panel">
          <h3>有几个圆点？选出正确的数字</h3>
          <div style="font-size:2rem;text-align:center;letter-spacing:8px;color:var(--secondary);padding:20px">${dots}</div>
          <div class="number-pad" id="numPad2"></div>
          ${feedbackEl("fb-num")}
        </div>`;

      const pad = document.getElementById("numPad2");
      const options = shuffle(
        [n, ...pick([1, 2, 3, 4, 5, 6, 7, 8, 9, 10].filter((x) => x !== n), 4)].slice(0, 5)
      );
      options.forEach((num) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "num-btn";
        btn.textContent = num;
        btn.onclick = () => {
          if (num === n) {
            btn.classList.add("correct");
            showFeedback("fb-num", true, `正确！这就是数字 ${n}。`);
            round++;
            if (round >= 5) {
              addStars(2);
              markComplete("numbers");
            }
            setTimeout(() => {
              n = randInt(1, 10);
              draw();
            }, 1000);
          } else {
            btn.classList.add("wrong");
            showFeedback("fb-num", false, "再数一数圆点。");
          }
        };
        pad.appendChild(btn);
      });
    }

    draw();
  }

  /* --- 认识图形 --- */
  function shapeSvg(type, color) {
    const svgs = {
      circle: `<svg class="shape-svg" viewBox="0 0 80 80"><circle cx="40" cy="40" r="32" fill="${color}"/></svg>`,
      square: `<svg class="shape-svg" viewBox="0 0 80 80"><rect x="14" y="14" width="52" height="52" fill="${color}"/></svg>`,
      triangle: `<svg class="shape-svg" viewBox="0 0 80 80"><polygon points="40,10 70,70 10,70" fill="${color}"/></svg>`,
      rect: `<svg class="shape-svg" viewBox="0 0 80 80"><rect x="8" y="22" width="64" height="36" fill="${color}"/></svg>`,
    };
    return svgs[type];
  }

  function renderShapes(lesson, container) {
    let target = SHAPES[randInt(0, SHAPES.length - 1)];
    let round = 0;

    function draw() {
      container.innerHTML =
        lessonShell(lesson) +
        `<div class="panel">
          <h3>找出所有的「${target.name}」</h3>
          <div class="shape-grid" id="shapeGrid"></div>
          ${feedbackEl("fb-shape")}
          <div class="btn-group" style="justify-content:center">
            <button type="button" class="btn btn-primary" id="btnShapeDone">我找完了</button>
          </div>
        </div>`;

      const grid = document.getElementById("shapeGrid");
      const mixed = shuffle([
        ...Array(2).fill(target),
        ...pick(
          SHAPES.filter((s) => s.type !== target.type),
          4
        ),
      ]);

      mixed.forEach((s) => {
        const card = document.createElement("div");
        card.className = "shape-card";
        card.innerHTML = shapeSvg(s.type, s.color) + `<div>${s.name}</div>`;
        card.dataset.type = s.type;
        card.addEventListener("click", () => card.classList.toggle("highlight"));
        grid.appendChild(card);
      });

      document.getElementById("btnShapeDone").onclick = () => {
        const selected = [...grid.querySelectorAll(".shape-card.highlight")];
        const correct =
          selected.length > 0 && selected.every((c) => c.dataset.type === target.type);
        if (correct && selected.length >= 2) {
          showFeedback("fb-shape", true, "太厉害了，都找对了！");
          round++;
          if (round >= 3) {
            addStars(2);
            markComplete("shapes");
          }
          target = SHAPES[randInt(0, SHAPES.length - 1)];
          setTimeout(draw, 1200);
        } else {
          showFeedback("fb-shape", false, `请选出所有的「${target.name}」并点击「我找完了」。`);
        }
      };
    }

    draw();
  }

  /* --- 认识钟表 --- */
  function renderClock(lesson, container) {
    let hour = randInt(1, 12);
    let round = 0;

    function hourAngle(h) {
      return (h % 12) * 30;
    }

    function draw() {
      container.innerHTML =
        lessonShell(lesson) +
        `<div class="panel">
          <h3>拨动短针，让它指向 ${hour} 点（整点）</h3>
          <div class="clock-face" id="clockFace">
            <div class="clock-hand clock-hour" id="hourHand" style="transform:translateX(-50%) rotate(${hourAngle(hour)}deg)"></div>
            <div class="clock-hand clock-minute" style="transform:translateX(-50%) rotate(0deg)"></div>
            <div class="clock-center"></div>
          </div>
          <div class="clock-controls">
            <label>时针（短针）
              <input type="range" id="hourRange" min="1" max="12" value="${hour}" />
              <span id="hourVal">${hour}</span> 时
            </label>
          </div>
          ${feedbackEl("fb-clock")}
          <div class="btn-group" style="justify-content:center">
            <button type="button" class="btn btn-primary" id="btnClockOk">确认时刻</button>
          </div>
        </div>`;

      placeClockLabels();

      const range = document.getElementById("hourRange");
      const hand = document.getElementById("hourHand");
      range.oninput = () => {
        const v = +range.value;
        document.getElementById("hourVal").textContent = v;
        hand.style.transform = `translateX(-50%) rotate(${hourAngle(v)}deg)`;
      };

      document.getElementById("btnClockOk").onclick = () => {
        const v = +range.value;
        if (v === hour) {
          showFeedback("fb-clock", true, `正确！现在是 ${hour} 点整。`);
          round++;
          if (round >= 3) {
            addStars(2);
            markComplete("clock");
          }
          hour = randInt(1, 12);
          setTimeout(draw, 1200);
        } else {
          showFeedback("fb-clock", false, `短针应该指向 ${hour}，长针指向 12。`);
        }
      };
    }

    function placeClockLabels() {
      const face = document.getElementById("clockFace");
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

    draw();
  }

  /* --- 加减法 --- */
  function renderAddSub(lesson, container) {
    let score = 0;
    let total = 10;
    let current = null;

    function genProblem() {
      const isAdd = Math.random() > 0.5;
      let a, b, ans;
      if (isAdd) {
        a = randInt(1, 10);
        b = randInt(1, 10);
        if (a + b > 20) {
          b = 20 - a;
        }
        ans = a + b;
        return { text: `${a} + ${b} = ?`, ans };
      }
      a = randInt(2, 18);
      b = randInt(1, a);
      ans = a - b;
      return { text: `${a} − ${b} = ?`, ans };
    }

    function draw() {
      current = genProblem();
      const pct = (score / total) * 100;
      container.innerHTML =
        lessonShell(lesson) +
        `<div class="panel">
          <h3>口算练习 (${score}/${total})</h3>
          <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
          <div class="quiz-display">${current.text}</div>
          <input type="number" class="answer-input" id="ansInput" min="0" max="20" inputmode="numeric" />
          <div class="btn-group" style="justify-content:center">
            <button type="button" class="btn btn-primary" id="btnSubmit">提交答案</button>
          </div>
          ${feedbackEl("fb-quiz")}
        </div>`;

      const input = document.getElementById("ansInput");
      input.focus();

      function submit() {
        const val = parseInt(input.value, 10);
        if (isNaN(val)) {
          showFeedback("fb-quiz", false, "请输入数字哦！");
          return;
        }
        if (val === current.ans) {
          score++;
          showFeedback("fb-quiz", true, "正确！");
          if (score >= total) {
            addStars(3);
            markComplete("addsub");
            showFeedback("fb-quiz", true, "全部完成！你是口算小能手！");
            return;
          }
          setTimeout(draw, 800);
        } else {
          showFeedback("fb-quiz", false, `再想想，答案是 ${current.ans}`);
        }
      }

      document.getElementById("btnSubmit").onclick = submit;
      input.onkeydown = (e) => {
        if (e.key === "Enter") submit();
      };
    }

    draw();
  }

  /* --- 找规律 --- */
  function renderPattern(lesson, container) {
    const patterns = [
      { seq: ["🔴", "🔵", "🔴", "🔵", "🔴"], answer: "🔵", options: ["🔴", "🔵", "🟢"] },
      { seq: ["⭐", "⭐", "🌙", "⭐", "⭐"], answer: "🌙", options: ["⭐", "🌙", "☀️"] },
      { seq: ["1", "2", "3", "1", "2"], answer: "3", options: ["1", "2", "3"] },
      { seq: ["🍎", "🍎", "🍊", "🍎", "🍎"], answer: "🍊", options: ["🍎", "🍊", "🍌"] },
    ];
    let round = 0;

    function newRound() {
      const p = patterns[randInt(0, patterns.length - 1)];
      container.innerHTML =
        lessonShell(lesson) +
        `<div class="panel">
          <h3>想一想，横线上应该填什么？</h3>
          <div class="pattern-row" id="patternRow"></div>
          <div class="pattern-options" id="patternOpts"></div>
          ${feedbackEl("fb-pattern")}
        </div>`;

      const row = document.getElementById("patternRow");
      p.seq.forEach((item) => {
        const span = document.createElement("span");
        span.textContent = item;
        span.style.fontSize = "2.5rem";
        row.appendChild(span);
      });
      const slot = document.createElement("div");
      slot.className = "pattern-slot";
      slot.textContent = "?";
      row.appendChild(slot);

      const opts = document.getElementById("patternOpts");
      shuffle(p.options).forEach((opt) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "pattern-opt";
        btn.textContent = opt;
        btn.onclick = () => {
          if (opt === p.answer) {
            slot.textContent = opt;
            showFeedback("fb-pattern", true, "规律找对了！");
            round++;
            if (round >= 4) {
              addStars(2);
              markComplete("pattern");
            }
            setTimeout(newRound, 1200);
          } else {
            showFeedback("fb-pattern", false, "看看重复的模式，再试一次。");
          }
        };
        opts.appendChild(btn);
      });
    }

    newRound();
  }

  /* ---------- Init ---------- */
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
