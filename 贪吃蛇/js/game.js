/* 萌萌汉字贪吃蛇 · 游戏主逻辑 */
(() => {
  'use strict';

  // ============ 常量 ============
  const COLS = 20;          // 列数
  const ROWS = 15;          // 行数
  const CELL = 32;          // 单元格像素
  const FOOD_COUNT = 5;     // 同时显示的食物数量
  const TICK_BASE = 140;    // 基础移动间隔 (ms)
  const TICK_MIN = 70;      // 最快速度
  const STORAGE_KEY = 'snake-chars-v1';
  const BEST_KEY = 'snake-best-v1';

  // 食物配色（粉/绿/黄/紫/青/红/橙）
  const FOOD_COLORS = [
    { bg: '#7ed957', border: '#3a8a25', text: '#fff' }, // 绿
    { bg: '#ff7a8a', border: '#c93a52', text: '#fff' }, // 粉
    { bg: '#ffc857', border: '#c48a1a', text: '#fff' }, // 黄
    { bg: '#a78bfa', border: '#5b3dc4', text: '#fff' }, // 紫
    { bg: '#5fd5d5', border: '#1c8a8a', text: '#fff' }, // 青
    { bg: '#ff8a5b', border: '#c45a1a', text: '#fff' }, // 橙
    { bg: '#f25f7c', border: '#a8252a', text: '#fff' }, // 红
  ];

  // 默认字库
  const DEFAULT_CHARS = (
    '的一是不了在人有我他这中大来上国个到说们为子和你地出' +
    '道也时年得就那要下看生会自着去之过家学对可她里后小' +
    '么心多天而能好都然没日于起还发成事只作当想看文无' +
    '开手十用主行方又如前所本见经头面公同民已结定样' +
    '数理化语英文字词句段篇春夏秋冬天地人和山水火风云' +
    '一二三四五六七八九十百千万'
  ).split('');

  // 词包预设
  const PRESETS = {
    '数字': '一二三四五六七八九十百千万零壹贰叁肆伍陆柒捌玖拾',
    '天气': '春夏秋冬雨雪云风雷电晴阴雾霜暖寒冷热',
    '水果': '苹果香蕉葡萄西瓜桃子梨子橙子草莓柠檬菠萝',
    '动物': '猫狗兔马牛羊猪鸡鸭鹅鱼鸟虎狼熊鹿蛇龙',
    '古诗': '床前明月光疑是地上霜举头望明月低头思故乡春眠不觉晓处处闻啼鸟夜来风雨声花落知多少',
  };

  // ============ DOM ============
  const canvas = document.getElementById('board');
  const ctx = canvas.getContext('2d');
  const scoreEl = document.getElementById('score');
  const bestEl = document.getElementById('best');
  const overlay = document.getElementById('overlay');
  const overlaySub = document.getElementById('overlaySub');
  const overlayBtn = document.getElementById('overlayBtn');
  const btnStart = document.getElementById('btnStart');
  const btnStartLabel = document.getElementById('btnStartLabel');
  const btnPause = document.getElementById('btnPause');
  const btnUpload = document.getElementById('btnUpload');
  const uploadModal = document.getElementById('uploadModal');
  const uploadClose = document.getElementById('uploadClose');
  const charInput = document.getElementById('charInput');
  const charFile = document.getElementById('charFile');
  const charSave = document.getElementById('charSave');

  // ============ 状态 ============
  let charPool = [];            // 字符池
  let charString = '';          // 当前展示的字符（最近吃到的）
  let snake = [];               // 蛇身 [{x,y,ch}]
  let dir = { x: 1, y: 0 };     // 当前方向
  let nextDir = { x: 1, y: 0 }; // 缓冲方向（避免同 tick 内连续 180°）
  let foods = [];               // 食物 [{x,y,ch,colorIdx}]
  let score = 0;
  let best = Number(localStorage.getItem(BEST_KEY) || 0);
  let tickMs = TICK_BASE;
  let lastTick = 0;
  let rafId = null;
  let state = 'idle';           // idle | playing | paused | gameover
  let pausedBeforeHide = false;
  let touchStart = null;

  // ============ 工具 ============
  const W = COLS * CELL;
  const H = ROWS * CELL;
  canvas.width = W;
  canvas.height = H;

  function setOverlay(html, btnText) {
    overlay.classList.remove('hide');
    overlaySub.innerHTML = html;
    overlayBtn.textContent = btnText;
  }

  function hideOverlay() {
    overlay.classList.add('hide');
  }

  function setStartLabel(text) {
    btnStartLabel.textContent = text;
  }

  function updateScore() {
    scoreEl.textContent = String(score);
    if (score > best) {
      best = score;
      localStorage.setItem(BEST_KEY, String(best));
    }
    bestEl.textContent = String(best);
  }

  function randInt(n) { return Math.floor(Math.random() * n); }

  function pickChar() {
    if (!charPool.length) return '字';
    // 加点变化：偶尔返回一个 2 字词
    if (charPool.length > 1 && Math.random() < 0.18) {
      return charPool[randInt(charPool.length)] + charPool[randInt(charPool.length)];
    }
    return charPool[randInt(charPool.length)];
  }

  function freeCell(exclude) {
    const occupied = new Set();
    snake.forEach(s => occupied.add(s.x + ',' + s.y));
    foods.forEach(f => occupied.add(f.x + ',' + f.y));
    if (exclude) exclude.forEach(c => occupied.add(c.x + ',' + c.y));
    const free = [];
    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        if (!occupied.has(x + ',' + y)) free.push({ x, y });
      }
    }
    if (!free.length) return null;
    return free[randInt(free.length)];
  }

  function spawnFood() {
    while (foods.length < FOOD_COUNT) {
      const cell = freeCell();
      if (!cell) break;
      const ch = pickChar();
      const colorIdx = randInt(FOOD_COLORS.length);
      foods.push({ x: cell.x, y: cell.y, ch, colorIdx });
    }
  }

  function reset() {
    snake = [
      { x: 6, y: 7, ch: '萌' },
      { x: 5, y: 7, ch: '萌' },
      { x: 4, y: 7, ch: '萌' },
    ];
    dir = { x: 1, y: 0 };
    nextDir = { x: 1, y: 0 };
    foods = [];
    score = 0;
    tickMs = TICK_BASE;
    charString = '萌';
    spawnFood();
    updateScore();
  }

  function setDir(nx, ny) {
    // 禁止直接掉头
    if (snake.length > 1 && nx === -dir.x && ny === -dir.y) return;
    nextDir = { x: nx, y: ny };
  }

  // ============ 绘制 ============
  function drawBackground() {
    // 网格底
    ctx.fillStyle = '#fafbff';
    ctx.fillRect(0, 0, W, H);

    // 极淡的格子
    ctx.strokeStyle = 'rgba(180, 130, 40, 0.06)';
    ctx.lineWidth = 1;
    for (let x = 0; x <= COLS; x++) {
      ctx.beginPath();
      ctx.moveTo(x * CELL + 0.5, 0);
      ctx.lineTo(x * CELL + 0.5, H);
      ctx.stroke();
    }
    for (let y = 0; y <= ROWS; y++) {
      ctx.beginPath();
      ctx.moveTo(0, y * CELL + 0.5);
      ctx.lineTo(W, y * CELL + 0.5);
      ctx.stroke();
    }
  }

  function drawFood(food) {
    const cx = food.x * CELL + CELL / 2;
    const cy = food.y * CELL + CELL / 2;
    const r = CELL / 2 - 3;
    const c = FOOD_COLORS[food.colorIdx];

    // 阴影
    ctx.fillStyle = 'rgba(0,0,0,0.10)';
    ctx.beginPath();
    ctx.ellipse(cx, cy + r - 2, r * 0.8, 3, 0, 0, Math.PI * 2);
    ctx.fill();

    // 球体
    const grad = ctx.createRadialGradient(cx - r * 0.4, cy - r * 0.4, r * 0.2, cx, cy, r);
    grad.addColorStop(0, lighten(c.bg, 0.35));
    grad.addColorStop(1, c.bg);
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();

    // 边框
    ctx.strokeStyle = c.border;
    ctx.lineWidth = 2;
    ctx.stroke();

    // 高光
    ctx.fillStyle = 'rgba(255,255,255,0.45)';
    ctx.beginPath();
    ctx.ellipse(cx - r * 0.4, cy - r * 0.5, r * 0.25, r * 0.15, -0.6, 0, Math.PI * 2);
    ctx.fill();

    // 文字
    ctx.fillStyle = c.text;
    ctx.font = `bold ${food.ch.length > 1 ? 16 : 22}px "ZCOOL KuaiLe","Ma Shan Zheng","Noto Sans SC",sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(food.ch, cx, cy + 1);
  }

  function drawSnake() {
    // 身体
    for (let i = snake.length - 1; i >= 0; i--) {
      const seg = snake[i];
      const isHead = i === 0;
      const cx = seg.x * CELL + CELL / 2;
      const cy = seg.y * CELL + CELL / 2;
      const r = CELL / 2 - 2;

      if (isHead) {
        // 头：浅蓝发光球
        const grad = ctx.createRadialGradient(cx - 4, cy - 4, 4, cx, cy, r + 2);
        grad.addColorStop(0, '#ffffff');
        grad.addColorStop(0.4, '#bce0ff');
        grad.addColorStop(1, '#74b9ff');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(cx, cy, r + 1, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#3b94d0';
        ctx.lineWidth = 2;
        ctx.stroke();

        // 眼睛：根据方向
        drawEyes(cx, cy, r, dir);
      } else {
        // 身体：浅蓝半透明球 + 字符
        const fade = Math.max(0.45, 1 - i * 0.03);
        ctx.fillStyle = `rgba(188, 224, 255, ${fade})`;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = `rgba(116, 185, 255, ${fade})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // 字符
        ctx.fillStyle = `rgba(45, 110, 176, ${Math.min(1, fade + 0.1)})`;
        ctx.font = `bold 18px "ZCOOL KuaiLe","Ma Shan Zheng","Noto Sans SC",sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(seg.ch, cx, cy);
      }
    }
  }

  function drawEyes(cx, cy, r, d) {
    const eyeR = 2.6;
    const offR = r * 0.45;
    let ex1, ey1, ex2, ey2;
    if (d.x === 1) {        // →
      ex1 = cx + offR * 0.5; ey1 = cy - offR * 0.5;
      ex2 = cx + offR * 0.5; ey2 = cy + offR * 0.5;
    } else if (d.x === -1) { // ←
      ex1 = cx - offR * 0.5; ey1 = cy - offR * 0.5;
      ex2 = cx - offR * 0.5; ey2 = cy + offR * 0.5;
    } else if (d.y === -1) { // ↑
      ex1 = cx - offR * 0.5; ey1 = cy - offR * 0.5;
      ex2 = cx + offR * 0.5; ey2 = cy - offR * 0.5;
    } else {                 // ↓
      ex1 = cx - offR * 0.5; ey1 = cy + offR * 0.5;
      ex2 = cx + offR * 0.5; ey2 = cy + offR * 0.5;
    }
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(ex1, ey1, eyeR, 0, Math.PI * 2);
    ctx.arc(ex2, ey2, eyeR, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#1f4e87';
    ctx.beginPath();
    ctx.arc(ex1 + d.x * 0.8, ey1 + d.y * 0.8, 1.4, 0, Math.PI * 2);
    ctx.arc(ex2 + d.x * 0.8, ey2 + d.y * 0.8, 1.4, 0, Math.PI * 2);
    ctx.fill();
  }

  function lighten(hex, amt) {
    const c = hex.replace('#', '');
    const r = parseInt(c.substring(0, 2), 16);
    const g = parseInt(c.substring(2, 4), 16);
    const b = parseInt(c.substring(4, 6), 16);
    const lr = Math.min(255, Math.round(r + (255 - r) * amt));
    const lg = Math.min(255, Math.round(g + (255 - g) * amt));
    const lb = Math.min(255, Math.round(b + (255 - b) * amt));
    return `rgb(${lr},${lg},${lb})`;
  }

  function render() {
    drawBackground();
    foods.forEach(drawFood);
    drawSnake();
  }

  // ============ 游戏循环 ============
  function step() {
    dir = nextDir;
    const head = snake[0];
    const nx = head.x + dir.x;
    const ny = head.y + dir.y;

    // 撞墙
    if (nx < 0 || nx >= COLS || ny < 0 || ny >= ROWS) {
      return gameOver('撞到墙啦！');
    }
    // 撞自己
    for (let i = 0; i < snake.length; i++) {
      if (snake[i].x === nx && snake[i].y === ny) {
        return gameOver('咬到自己啦！');
      }
    }

    // 吃食物
    const foodIdx = foods.findIndex(f => f.x === nx && f.y === ny);
    let ate = null;
    if (foodIdx >= 0) {
      ate = foods[foodIdx];
      foods.splice(foodIdx, 1);
    }

    // 推入新头
    const headCh = ate ? ate.ch : (snake[0].ch || '字');
    snake.unshift({ x: nx, y: ny, ch: headCh });
    charString = headCh;

    if (ate) {
      score += 10;
      updateScore();
      spawnFood();
      // 越久越快
      tickMs = Math.max(TICK_MIN, TICK_BASE - Math.floor(score / 30) * 6);
    } else {
      snake.pop();
    }
  }

  function loop(ts) {
    // 每一帧都先把 rafId 置空：表示"当前没有挂起的帧"
    rafId = null;
    if (state !== 'playing') return;     // 非 playing 直接停掉循环

    if (!lastTick) lastTick = ts;
    const elapsed = ts - lastTick;
    if (elapsed >= tickMs) {
      lastTick = ts;
      step();
      if (state !== 'playing') {
        // step() 里发生了 gameOver / pause
        render();
        return;
      }
    }
    render();
    rafId = requestAnimationFrame(loop);
  }

  // 显式启停 rAF 循环，避免多帧叠加
  function startLoop() {
    if (rafId !== null) return;
    lastTick = 0;
    rafId = requestAnimationFrame(loop);
  }
  function stopLoop() {
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  }

  // ============ 状态切换 ============
  function startGame() {
    // 安全：先停掉可能挂着的旧循环
    stopLoop();
    reset();
    state = 'playing';
    hideOverlay();
    setStartLabel('重新开始');
    btnPause.disabled = false;
    btnPause.innerHTML = '<span class="btn-emoji">⏸</span>暂停';
    // 立即画一帧（不等下一次 tick），让画面马上更新
    render();
    startLoop();
  }

  function pauseGame() {
    if (state !== 'playing') return;
    state = 'paused';
    stopLoop();
    setOverlay(
      '⏸ <strong>游戏已暂停</strong><br>按 <kbd>空格</kbd> 或点击"继续"恢复',
      '继续游戏'
    );
    btnPause.disabled = false;
    btnPause.innerHTML = '<span class="btn-emoji">▶</span>继续';
  }

  function resumeGame() {
    if (state !== 'paused') return;
    state = 'playing';
    hideOverlay();
    btnPause.innerHTML = '<span class="btn-emoji">⏸</span>暂停';
    // 必须重置 lastTick，否则暂停期间累积的 elapsed 会让蛇瞬间暴走好几格
    startLoop();
  }

  function gameOver(reason) {
    state = 'gameover';
    stopLoop();
    setOverlay(
      `💥 <strong>${reason}</strong><br>` +
      `本次得分：<strong style="color:#ff5a5a">${score}</strong> · ` +
      `历史最高：<strong style="color:#5f3dc4">${best}</strong><br>` +
      `蛇身汉字：<strong style="color:#3b9b1f">${snake.map(s => s.ch).slice(0, 12).join('')}${snake.length > 12 ? '…' : ''}</strong>`,
      '再来一局'
    );
    btnPause.disabled = true;
    btnPause.innerHTML = '<span class="btn-emoji">⏸</span>暂停';
  }

  // ============ 输入 ============
  window.addEventListener('keydown', e => {
    if (overlay.classList.contains('hide') === false && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      overlayBtn.click();
      return;
    }
    if (e.key === ' ' || e.code === 'Space') {
      e.preventDefault();
      if (state === 'playing') pauseGame();
      else if (state === 'paused') resumeGame();
      else if (state === 'idle' || state === 'gameover') startGame();
      return;
    }
    if (state !== 'playing') return;
    switch (e.key) {
      case 'ArrowUp':    case 'w': case 'W': setDir(0, -1); break;
      case 'ArrowDown':  case 's': case 'S': setDir(0,  1); break;
      case 'ArrowLeft':  case 'a': case 'A': setDir(-1, 0); break;
      case 'ArrowRight': case 'd': case 'D': setDir( 1, 0); break;
    }
  });

  // 触屏滑动
  canvas.addEventListener('touchstart', e => {
    const t = e.touches[0];
    touchStart = { x: t.clientX, y: t.clientY };
  }, { passive: true });

  canvas.addEventListener('touchend', e => {
    if (!touchStart) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touchStart.x;
    const dy = t.clientY - touchStart.y;
    if (Math.abs(dx) < 16 && Math.abs(dy) < 16) {
      touchStart = null;
      return;
    }
    if (Math.abs(dx) > Math.abs(dy)) setDir(dx > 0 ? 1 : -1, 0);
    else setDir(0, dy > 0 ? 1 : -1);
    touchStart = null;
  }, { passive: true });

  // 防止页面整体滚动
  document.addEventListener('keydown', e => {
    if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' '].includes(e.key)) {
      e.preventDefault();
    }
  });

  // ============ 字符库持久化 ============
  function loadCharPool() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      charPool = saved.split('').filter(c => c.trim());
    }
    if (!charPool.length) {
      charPool = DEFAULT_CHARS.slice();
      localStorage.setItem(STORAGE_KEY, charPool.join(''));
    }
    charInput.value = charPool.join('');
  }

  function saveCharPool() {
    const text = (charInput.value || '').replace(/\s+/g, '');
    if (!text) {
      alert('请输入至少一个汉字！');
      return;
    }
    charPool = text.split('').filter(c => c.trim());
    localStorage.setItem(STORAGE_KEY, charPool.join(''));
    closeModal();
    if (state === 'playing' || state === 'paused' || state === 'gameover') {
      // 重新生成食物
      foods = [];
      spawnFood();
      render();
    }
    flashTip('✅ 汉字库已更新');
  }

  // ============ 弹窗 ============
  function openModal() {
    uploadModal.classList.add('show');
    uploadModal.setAttribute('aria-hidden', 'false');
    if (state === 'playing') {
      pausedBeforeHide = true;
      pauseGame();
    }
  }
  function closeModal() {
    uploadModal.classList.remove('show');
    uploadModal.setAttribute('aria-hidden', 'true');
  }
  uploadModal.addEventListener('click', e => {
    if (e.target === uploadModal) closeModal();
  });

  // 提示小气泡
  function flashTip(msg) {
    const tip = document.createElement('div');
    tip.textContent = msg;
    Object.assign(tip.style, {
      position: 'fixed',
      left: '50%',
      top: '20%',
      transform: 'translateX(-50%)',
      padding: '10px 20px',
      background: 'rgba(45, 110, 30, 0.92)',
      color: '#fff',
      borderRadius: '999px',
      fontWeight: '700',
      fontSize: '15px',
      boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
      zIndex: 9999,
      pointerEvents: 'none',
      transition: 'opacity 0.4s, transform 0.4s',
    });
    document.body.appendChild(tip);
    setTimeout(() => {
      tip.style.opacity = '0';
      tip.style.transform = 'translateX(-50%) translateY(-10px)';
    }, 1100);
    setTimeout(() => tip.remove(), 1700);
  }

  // ============ 事件绑定 ============
  btnStart.addEventListener('click', () => {
    startGame();
  });
  btnPause.addEventListener('click', () => {
    if (state === 'playing') pauseGame();
    else if (state === 'paused') resumeGame();
  });
  btnUpload.addEventListener('click', openModal);
  uploadClose.addEventListener('click', closeModal);
  charSave.addEventListener('click', saveCharPool);

  charFile.addEventListener('change', e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      charInput.value = String(ev.target.result || '').replace(/[^一-龥a-zA-Z0-9]/g, '');
    };
    reader.readAsText(file, 'utf-8');
  });

  document.querySelectorAll('.chip[data-preset]').forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.preset;
      if (PRESETS[key]) {
        charInput.value = (charInput.value + PRESETS[key]).slice(0, 400);
        charInput.focus();
      }
    });
  });

  overlayBtn.addEventListener('click', () => {
    if (state === 'paused') resumeGame();
    else startGame();
  });

  // 切到后台自动暂停
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && state === 'playing') pauseGame();
  });

  // ============ 启动 ============
  loadCharPool();
  reset();
  render();
  // 初始不启动 loop，等用户点"开始游戏"再 startLoop()。
  // 状态机：idle（浮层显示）→ playing（startGame）→ paused/gameover
  rafId = null;

  // 暴露一个调试入口（方便排查）
  window.__snake = {
    get state() { return state; },
    get score() { return score; },
    get rafId() { return rafId; },
    snake, foods,
    start: startGame, pause: pauseGame, resume: resumeGame,
  };
})();
