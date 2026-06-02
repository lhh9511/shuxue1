(function () {
  /* ============== Shared utilities ============== */
  const STORAGE_KEY = "duanwu-progress";
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
    showToast._t = setTimeout(() => el.classList.remove("show"), 2000);
  }

  function burstConfetti(intensity = 1) {
    const box = document.getElementById("confetti");
    const colors = ["#c0392b", "#27ae60", "#f39c12", "#d4ac0d", "#74b9ff"];
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

  function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = randInt(0, i);
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  function pick(arr, n) {
    return shuffle(arr).slice(0, n);
  }

  /* ============== Navigation ============== */
  function goTo(screen) {
    state.screen = screen;
    document.querySelectorAll(".screen").forEach((el) => el.classList.remove("active"));
    const target = document.getElementById("screen-" + screen);
    if (target) target.classList.add("active");
    window.scrollTo({ top: 0, behavior: "smooth" });

    if (screen === "zongzi") resetZongziGame();
    if (screen === "race") startRace();
  }

  /* ============== ZONGZI GAME ============== */
  const ALL_INGREDIENTS = [
    { id: "rice",    emoji: "🌾", name: "糯米"   },
    { id: "date",    emoji: "🔴", name: "红枣"   },
    { id: "bean",    emoji: "🟤", name: "豆沙"   },
    { id: "meat",    emoji: "🥩", name: "鲜肉"   },
    { id: "yolk",    emoji: "🟡", name: "咸蛋黄" },
    { id: "hdate",   emoji: "🟣", name: "蜜枣"   },
    { id: "peanut",  emoji: "🥜", name: "花生"   },
    { id: "rbean",   emoji: "🫘", name: "红豆"   },
    { id: "lotus",   emoji: "🌰", name: "莲子"   },
    { id: "choco",   emoji: "🍫", name: "巧克力" },
    { id: "chili",   emoji: "🌶️", name: "辣椒"   },
    { id: "sugar",   emoji: "🍬", name: "白糖"   },
  ];

  const FLAVORS = [
    {
      id: "date",  emoji: "🥮", name: "红枣粽", desc: "经典甜口，浓郁枣香",
      need: ["rice", "date"],
      doneDesc: "甜甜的红枣粽出锅！配一杯茶吧～",
    },
    {
      id: "bean", emoji: "🍡", name: "豆沙粽", desc: "细腻豆沙，甜而不腻",
      need: ["rice", "bean"],
      doneDesc: "丝滑豆沙粽，孩子最爱！",
    },
    {
      id: "meatyolk", emoji: "🍙", name: "蛋黄鲜肉粽", desc: "咸香软糯，南方人最爱",
      need: ["rice", "meat", "yolk"],
      doneDesc: "蛋黄流油，肉香扑鼻！👍",
    },
    {
      id: "hdatepea", emoji: "🍘", name: "蜜枣花生粽", desc: "蜜枣+花生，甜糯香脆",
      need: ["rice", "hdate", "peanut"],
      doneDesc: "蜜枣花生粽，咬一口满嘴香！",
    },
    {
      id: "babao",   emoji: "🍱", name: "八宝粽", desc: "红枣豆莲花生大集合",
      need: ["rice", "date", "peanut", "rbean", "lotus"],
      doneDesc: "豪华八宝粽出锅！喜气洋洋～",
    },
  ];

  let currentFlavor = null;
  let zongziPlaced = new Set();
  let zongziLog = [];

  function resetZongziGame() {
    currentFlavor = null;
    zongziPlaced = new Set();
    zongziLog = [];
    document.getElementById("zongzi-pick").classList.remove("zongzi-step--hidden");
    document.getElementById("zongzi-make").classList.add("zongzi-step--hidden");
    document.getElementById("zongzi-cook").classList.add("zongzi-step--hidden");
    document.getElementById("zongzi-done").classList.add("zongzi-step--hidden");
    renderFlavorGrid();
  }

  function renderFlavorGrid() {
    const grid = document.getElementById("flavorGrid");
    grid.innerHTML = "";
    FLAVORS.forEach((f) => {
      const card = document.createElement("button");
      card.type = "button";
      card.className = "flavor-card";
      card.innerHTML = `
        <span class="flavor-emoji">${f.emoji}</span>
        <span class="flavor-name">${f.name}</span>
        <span class="flavor-desc">${f.desc}</span>
      `;
      card.onclick = () => pickFlavor(f);
      grid.appendChild(card);
    });
  }

  function pickFlavor(flavor) {
    currentFlavor = flavor;
    zongziPlaced = new Set();
    zongziLog = [];
    document.getElementById("zongzi-pick").classList.add("zongzi-step--hidden");
    document.getElementById("zongzi-make").classList.remove("zongzi-step--hidden");
    document.getElementById("recipeHint").textContent =
      `你选择了 ${flavor.emoji} ${flavor.name}。把下面的食材点进粽叶里！`;
    renderRecipeList();
    renderBuffet();
    renderLeafInside();
    updateWrapButton();
  }

  function renderRecipeList() {
    const ul = document.getElementById("recipeList");
    ul.innerHTML = "";
    currentFlavor.need.forEach((id) => {
      const ing = ALL_INGREDIENTS.find((x) => x.id === id);
      const li = document.createElement("li");
      const done = zongziPlaced.has(id);
      li.className = done ? "done" : "";
      li.innerHTML = `<span class="check">${done ? "✅" : "⬜"}</span>${ing.emoji} ${ing.name}`;
      ul.appendChild(li);
    });
  }

  function renderBuffet() {
    const box = document.getElementById("buffet");
    box.innerHTML = "";
    ALL_INGREDIENTS.forEach((ing) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "ingredient";
      btn.innerHTML = `<span class="ing-emoji">${ing.emoji}</span><span class="ing-name">${ing.name}</span>`;
      btn.onclick = () => addIngredient(ing);
      box.appendChild(btn);
    });
  }

  function renderLeafInside() {
    const inside = document.getElementById("leafInside");
    inside.innerHTML = "";
    zongziLog.forEach((e, idx) => {
      const span = document.createElement("span");
      span.className = "added";
      span.style.animationDelay = (idx * 0.05) + "s";
      span.textContent = e.emoji;
      inside.appendChild(span);
    });
    const label = document.getElementById("leafLabel");
    if (zongziLog.length === 0) {
      label.textContent = "糯米还没放进来…";
    } else if (zongziPlaced.has("rice")) {
      label.textContent = "粽叶里已经有：" + zongziLog.map((x) => x.emoji).join(" ");
    } else {
      label.textContent = "先放点糯米吧～";
    }
  }

  function addIngredient(ing) {
    if (zongziPlaced.has(ing.id)) {
      showToast(`${ing.emoji} 已经放过 ${ing.name} 啦`);
      return;
    }
    if (!currentFlavor.need.includes(ing.id)) {
      // wrong ingredient — drop it temporarily and remove
      const inside = document.getElementById("leafInside");
      const span = document.createElement("span");
      span.className = "added";
      span.textContent = ing.emoji;
      inside.appendChild(span);
      showToast(`${ing.emoji} ${ing.name} 不在配方里哦～`);
      setTimeout(() => {
        span.style.transition = "opacity 0.4s";
        span.style.opacity = "0";
        setTimeout(() => span.remove(), 400);
      }, 700);
      return;
    }
    zongziPlaced.add(ing.id);
    zongziLog.push(ing);
    renderRecipeList();
    renderLeafInside();
    updateWrapButton();
    showToast(`${ing.emoji} ${ing.name} 加进去了`);
  }

  function updateWrapButton() {
    const btn = document.getElementById("btnWrap");
    const ready = currentFlavor.need.every((id) => zongziPlaced.has(id));
    btn.disabled = !ready;
    btn.textContent = ready ? "🪢 包好 → 下锅！" : `🪢 还差 ${currentFlavor.need.length - zongziPlaced.size} 种食材`;
  }

  function bindZongziButtons() {
    document.getElementById("btnReset").onclick = () => {
      zongziPlaced = new Set();
      zongziLog = [];
      renderRecipeList();
      renderLeafInside();
      updateWrapButton();
      showToast("🗑️ 倒掉粽叶，重新来！");
    };
    document.getElementById("btnWrap").onclick = wrapAndCook;
    document.getElementById("btnAnother").onclick = resetZongziGame;
  }

  function wrapAndCook() {
    document.getElementById("zongzi-make").classList.add("zongzi-step--hidden");
    document.getElementById("zongzi-cook").classList.remove("zongzi-step--hidden");
    const cookingText = document.getElementById("cookingText");
    const cookingZong = document.getElementById("cookingZongzi");
    cookingZong.textContent = currentFlavor.emoji;

    let mins = 0;
    const minutes = ["煮 1 分钟…", "煮 10 分钟…", "煮 30 分钟…", "煮 1 小时…", "出锅啦！🎉"];
    cookingText.textContent = minutes[0];
    let i = 1;
    const timer = setInterval(() => {
      cookingText.textContent = minutes[i];
      i++;
      if (i >= minutes.length) {
        clearInterval(timer);
        setTimeout(finishCooking, 700);
      }
    }, 700);
  }

  function finishCooking() {
    document.getElementById("zongzi-cook").classList.add("zongzi-step--hidden");
    document.getElementById("zongzi-done").classList.remove("zongzi-step--hidden");
    document.getElementById("finishedZongzi").textContent = currentFlavor.emoji;
    document.getElementById("finishedDesc").textContent =
      `🎉 你包了一个 ${currentFlavor.name}：${currentFlavor.doneDesc}`;
    addStars(2);
    burstConfetti();
  }

  /* ============== RACE GAME ============== */
  const QUESTIONS = [
    // 端午文化
    { q: "端午节是农历几月几日？", opts: ["五月初五", "五月十五", "六月初六", "四月初四"], a: 0 },
    { q: "端午节是为了纪念谁？", opts: ["岳飞", "屈原", "诸葛亮", "李白"], a: 1 },
    { q: "端午节的传统食物是？", opts: ["月饼", "汤圆", "粽子", "饺子"], a: 2 },
    { q: "粽叶常用哪种植物的叶子？", opts: ["竹叶或苇叶", "玉米叶", "桂花叶", "枫叶"], a: 0 },
    { q: "端午节的传统活动是？", opts: ["放孔明灯", "划龙舟", "猜灯谜", "舞狮"], a: 1 },
    { q: "屈原投江的江名叫？", opts: ["长江", "汨罗江", "黄河", "钱塘江"], a: 1 },
    { q: "端午节门口常挂的辟邪植物是？", opts: ["柳枝", "桃花", "艾草和菖蒲", "竹子"], a: 2 },
    { q: "下列哪句诗写的是端午？", opts: ["千门万户曈曈日", "去年元夜时", "节分端午自谁言", "床前明月光"], a: 2 },
    { q: "端午节小朋友手腕上系的五彩线叫？", opts: ["平安绳", "五彩绳", "红绳结", "祈福链"], a: 1 },
    { q: "端午节大约在公历哪个月？", opts: ["3 月", "5 或 6 月", "8 月", "10 月"], a: 1 },
    // 数学应用题
    { q: "一个粽子 3 元，5 个一共多少元？", opts: ["15", "12", "18", "20"], a: 0 },
    { q: "一艘龙舟可乘 20 人，3 艘共能乘多少？", opts: ["50", "60", "70", "80"], a: 1 },
    { q: "妈妈包了 24 个粽子，每盒装 6 个，能装几盒？", opts: ["3", "4", "5", "6"], a: 1 },
    { q: "龙舟比赛 1500 米，已划 800 米，还剩多少米？", opts: ["500", "600", "700", "800"], a: 2 },
    { q: "一盘粽子有 8 个，吃了 5 个，还剩几个？", opts: ["2", "3", "4", "5"], a: 1 },
    { q: "妈妈泡糯米要 4 小时，下午 1 点开始，几点结束？", opts: ["3 点", "4 点", "5 点", "6 点"], a: 2 },
  ];

  let raceState = null;

  function startRace() {
    raceState = {
      pos: 0,
      cpu: 0,
      goal: 10,
      qIdx: 0,
      questions: shuffle(QUESTIONS).slice(0, QUESTIONS.length),
      finished: false,
    };
    document.getElementById("raceResult").classList.add("race-result--hidden");
    document.getElementById("quizCard").style.display = "";
    document.getElementById("raceSub").textContent =
      "先到达终点的赢 🏆！每答对一题前进一格。";
    renderTracks();
    renderQuestion();
  }

  function renderTracks() {
    const tp = document.getElementById("trackPlayer");
    const tc = document.getElementById("trackCpu");
    tp.innerHTML = "";
    tc.innerHTML = "";
    for (let i = 0; i <= raceState.goal; i++) {
      const cp = document.createElement("div");
      cp.className = "lane-cell" + (i === raceState.goal ? " finish" : "");
      cp.textContent = i === raceState.goal ? "🏁" : (i === 0 ? "起" : "");
      tp.appendChild(cp);
      const cc = document.createElement("div");
      cc.className = "lane-cell" + (i === raceState.goal ? " finish" : "");
      cc.textContent = i === raceState.goal ? "🏁" : (i === 0 ? "起" : "");
      tc.appendChild(cc);
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

    updateBoatPositions();
  }

  function updateBoatPositions() {
    const cells = raceState.goal + 1; // 0..goal
    const pct = (n) => `calc(${(n / raceState.goal) * 100}% - 1rem)`;
    const pb = document.getElementById("playerBoat");
    const cb = document.getElementById("cpuBoat");
    if (pb) pb.style.left = pct(raceState.pos);
    if (cb) cb.style.left = pct(raceState.cpu);
  }

  function renderQuestion() {
    if (raceState.finished) return;
    if (raceState.qIdx >= raceState.questions.length) {
      // out of questions — refill
      raceState.questions = raceState.questions.concat(shuffle(QUESTIONS));
    }
    const q = raceState.questions[raceState.qIdx];
    document.getElementById("quizProgress").textContent =
      `第 ${raceState.qIdx + 1} 题 · 你 ${raceState.pos}/${raceState.goal} · 对手 ${raceState.cpu}/${raceState.goal}`;
    document.getElementById("quizQuestion").textContent = q.q;
    document.getElementById("quizFeedback").textContent = "";
    document.getElementById("quizFeedback").className = "quiz-feedback";

    const optsBox = document.getElementById("quizOptions");
    optsBox.innerHTML = "";
    q.opts.forEach((text, idx) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "quiz-opt";
      btn.textContent = text;
      btn.onclick = () => handleAnswer(idx === q.a, btn);
      optsBox.appendChild(btn);
    });
  }

  function handleAnswer(correct, btn) {
    // Disable all buttons
    document.querySelectorAll(".quiz-opt").forEach((b) => (b.onclick = null));
    const fb = document.getElementById("quizFeedback");
    if (correct) {
      btn.classList.add("correct");
      fb.textContent = "🎯 答对啦！你的龙舟前进一步！";
      fb.classList.add("ok");
      raceState.pos = Math.min(raceState.goal, raceState.pos + 1);
    } else {
      btn.classList.add("wrong");
      // reveal correct
      const q = raceState.questions[raceState.qIdx];
      document.querySelectorAll(".quiz-opt")[q.a].classList.add("correct");
      fb.textContent = "❌ 答错了，原地等待对手…";
      fb.classList.add("bad");
    }
    // CPU advances 65% chance, but slower than perfect player
    if (Math.random() < 0.65) {
      raceState.cpu = Math.min(raceState.goal, raceState.cpu + 1);
    }
    updateBoatPositions();
    raceState.qIdx++;

    setTimeout(() => {
      if (raceState.pos >= raceState.goal || raceState.cpu >= raceState.goal) {
        finishRace();
      } else {
        renderQuestion();
      }
    }, 1100);
  }

  function finishRace() {
    raceState.finished = true;
    document.getElementById("quizCard").style.display = "none";
    const r = document.getElementById("raceResult");
    r.classList.remove("race-result--hidden");
    const playerWin = raceState.pos >= raceState.goal;
    const cpuWin = raceState.cpu >= raceState.goal;

    const icon = document.getElementById("resultIcon");
    const title = document.getElementById("resultTitle");
    const text = document.getElementById("resultText");

    if (playerWin && cpuWin) {
      icon.textContent = "🏆🚩";
      title.textContent = "并驾齐驱！平局～";
      text.textContent = `两支龙舟同时冲线（你 ${raceState.pos}/${raceState.goal}，对手 ${raceState.cpu}/${raceState.goal}），来一面 🚩 留作纪念！`;
      addStars(2);
      burstConfetti(1);
    } else if (playerWin) {
      icon.textContent = "🏆";
      title.textContent = "夺冠啦！你赢了！";
      text.textContent = `你 ${raceState.pos}/${raceState.goal}，对手 ${raceState.cpu}/${raceState.goal}。奖你一个 🏆！`;
      addStars(3);
      burstConfetti(2);
    } else {
      icon.textContent = "🚩";
      title.textContent = "对手率先冲线，再加油！";
      text.textContent = `你 ${raceState.pos}/${raceState.goal}，对手 ${raceState.cpu}/${raceState.goal}。送你一面 🚩 安慰旗，下次一定！`;
      addStars(1);
    }
  }

  function bindRaceButtons() {
    document.getElementById("btnRaceAgain").onclick = startRace;
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
    bindRaceButtons();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
