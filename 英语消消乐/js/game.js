/* =====================================================================
 * 消消乐核心引擎 Game
 * 玩法：英文卡 ↔ 中文卡成对配对消除，配对即"消除"，全部消除通关。
 * 依赖：AudioFX（音效/朗读）、App（统计/错题回调，由 app.js 提供）
 * ===================================================================== */
(function (global) {
  'use strict';

  const $ = (id) => document.getElementById(id);

  const Game = {
    unit: null,        // 当前单元 { id, title, words:[{en,zh,phon?}] }
    grade: null,       // 所属年级 id（用于配色 g3/g4/g5/g6）
    tiles: [],         // 当前牌堆 [{id, wordKey, side:'en'|'zh', en, zh, phon, matched, el}]
    selected: null,    // 当前选中的 tile
    matched: 0,
    total: 0,
    score: 0,
    wrong: 0,
    attempts: 0,       // 总配对尝试次数
    wrongWordKeys: new Set(), // 本关错过的 wordKey 集合
    timeLeft: 0,
    totalTime: 0,
    timerId: null,
    running: false,
    paused: false,
    startedAt: 0,
    settings: { sound: true, speak: true, autoSpeak: true, hintAfter: 2, timeLimit: 90 },
    busy: false,       // 配对判定中（避免连点）

    // 由 app.js 注入的回调
    onMatch: null,     // (wordKey) 配对成功
    onWrong: null,     // (enTile, zhTile) 配对失败
    onWin: null,       // (summary) 通关
    onTimeUp: null,    // () 时间到

    /** 开始一关 */
    start(unit, gradeId, settings) {
      this.unit = unit;
      this.grade = gradeId;
      this.settings = Object.assign(this.settings, settings || {});
      this.tiles = [];
      this.selected = null;
      this.matched = 0;
      this.score = 0;
      this.wrong = 0;
      this.attempts = 0;
      this.wrongWordKeys = new Set();
      this.total = unit.words.length;
      this.busy = false;
      this.paused = false;
      this.running = true;

      // 构建牌：每个单词一张 en + 一张 zh
      let n = 0;
      unit.words.forEach((w) => {
        const key = w.en;
        this.tiles.push({ id: ++n, wordKey: key, side: 'en', en: w.en, zh: w.zh, phon: w.phon || '', matched: false, el: null });
        this.tiles.push({ id: ++n, wordKey: key, side: 'zh', en: w.en, zh: w.zh, phon: w.phon || '', matched: false, el: null });
      });
      shuffle(this.tiles);

      this.renderHeader();
      this.renderBoard();
      this.updateStatus();

      // 倒计时
      this.timeLeft = this.settings.timeLimit || 0;
      this.totalTime = this.timeLeft;
      this.startedAt = Date.now();
      this.startTimer();
      hideOverlay();
    },

    renderHeader() {
      $('ubTitle').textContent = this.unit.title;
      $('ubTip').textContent = '主题：' + (this.unit.topic || '单词配对') + ' · 共 ' + this.total + ' 对';
    },

    renderBoard() {
      const board = $('board');
      board.innerHTML = '';
      // 列数：按牌数自适应，尽量接近正方形
      const count = this.tiles.length;
      let cols = Math.ceil(Math.sqrt(count));
      cols = Math.max(3, Math.min(6, cols));
      board.style.setProperty('--cols', cols);

      this.tiles.forEach((t) => {
        const el = document.createElement('button');
        el.type = 'button';
        el.className = 'tile ' + this.grade + (t.side === 'zh' ? ' t-zh' : '');
        el.setAttribute('aria-label', t.side === 'en' ? '英文卡' : '中文卡');

        if (t.side === 'en') {
          el.innerHTML =
            '<span class="t-main">' + esc(t.en) + '</span>' +
            (t.phon ? '<span class="t-phon">/' + esc(t.phon) + '/</span>' : '') +
            '<span class="t-speak" title="朗读">🔊</span>';
        } else {
          el.innerHTML = '<span class="t-main">' + esc(t.zh) + '</span>';
        }
        el.addEventListener('click', (e) => {
          if (e.target.classList.contains('t-speak')) {
            e.stopPropagation();
            AudioFX.speak(t.en);
            return;
          }
          this.onTileClick(t);
        });
        board.appendChild(el);
        t.el = el;
        // 入场小动画延迟
        el.style.animation = 'pop .3s ease both';
        el.style.animationDelay = (this.tiles.indexOf(t) * 0.02) + 's';
      });
    },

    onTileClick(t) {
      if (!this.running || this.paused || this.busy) return;
      if (t.matched) return;
      if (this.selected === t) { // 取消选择
        t.el.classList.remove('selected');
        this.selected = null;
        AudioFX.playClick();
        return;
      }
      if (!this.selected) {
        this.select(t);
        return;
      }
      // 已有选中：必须不同 side 才尝试配对
      if (this.selected.side === t.side) {
        this.selected.el.classList.remove('selected');
        this.select(t);
        return;
      }
      // 配对判定
      this.attempts++;
      const a = this.selected, b = t;
      this.busy = true;
      a.el.classList.remove('selected');

      if (a.wordKey === b.wordKey) {
        this.handleMatch(a, b);
      } else {
        this.handleWrong(a, b);
      }
    },

    select(t) {
      this.selected = t;
      t.el.classList.add('selected');
      AudioFX.playClick();
      if (t.side === 'en' && this.settings.speak) {
        // 点到英文卡时朗读一次，帮助记忆
        AudioFX.speak(t.en);
      }
    },

    handleMatch(a, b) {
      a.matched = b.matched = true;
      this.matched++;
      this.score += 10;
      AudioFX.playCorrect();
      if (this.settings.autoSpeak) AudioFX.speak(a.en);
      a.el.classList.add('matched');
      b.el.classList.add('matched');
      this.selected = null;
      this.busy = false;
      floatFeedback(a.el, '+10', true);
      this.updateStatus();
      if (this.onMatch) this.onMatch(a.wordKey);
      if (this.matched >= this.total) this.finishWin();
    },

    handleWrong(a, b) {
      this.wrong++;
      this.score = Math.max(0, this.score - 2);
      AudioFX.playWrong();
      a.el.classList.add('wrong');
      b.el.classList.add('wrong');
      this.wrongWordKeys.add(a.wordKey);
      this.wrongWordKeys.add(b.wordKey);
      floatFeedback(b.el, '✗', false);
      // 记录错题（以两张牌各自对应的"应配中文/英文"形式）
      if (this.onWrong) {
        this.onWrong({
          en: a.en, zh: a.zh, phon: a.phon,
          pickedEn: a.side === 'en' ? a.en : b.en,
          pickedZh: a.side === 'zh' ? a.zh : b.zh
        });
      }
      this.updateStatus();
      // 0.5s 后复位
      setTimeout(() => {
        a.el.classList.remove('wrong');
        b.el.classList.remove('wrong');
        this.selected = null;
        this.busy = false;
        // 达到提示阈值且开启提示：自动闪一下正确配对
        if (this.settings.hintAfter && this.wrong % this.settings.hintAfter === 0) {
          this.flashHint(false);
        }
      }, 520);
    },

    /** 闪一下某一对未配对的牌 */
    flashHint(announce) {
      // 找第一对未消除的 en+zh
      const enT = this.tiles.find(t => !t.matched && t.side === 'en');
      const zhT = enT && this.tiles.find(t => !t.matched && t.side === 'zh' && t.wordKey === enT.wordKey);
      if (!enT || !zhT) return;
      if (this.selected) this.selected.el.classList.remove('selected'), (this.selected = null);
      enT.el.classList.add('hint'); zhT.el.classList.add('hint');
      setTimeout(() => { enT.el.classList.remove('hint'); zhT.el.classList.remove('hint'); }, 1100);
      if (announce) showToast('💡 已为你高亮一对～', 'ok');
    },

    updateStatus() {
      $('scoreText').textContent = this.score;
      $('wrongText').textContent = this.wrong;
      const pct = this.total ? (this.matched / this.total) * 100 : 0;
      $('progressBar').style.width = pct + '%';
      $('progressText').textContent = this.matched + ' / ' + this.total;
    },

    /* ----- 倒计时 ----- */
    startTimer() {
      this.stopTimer();
      if (!this.settings.timeLimit) { $('timeText').textContent = '∞'; return; }
      this.updateTimer();
      this.timerId = setInterval(() => {
        if (this.paused) return;
        this.timeLeft--;
        const urgent = this.timeLeft <= 5;
        if (urgent && this.timeLeft > 0) AudioFX.playTick(true);
        else if (this.timeLeft > 0 && this.timeLeft % 15 === 0) AudioFX.playTick(false);
        this.updateTimer();
        if (this.timeLeft <= 0) {
          this.stopTimer();
          this.finishTimeUp();
        }
      }, 1000);
    },
    updateTimer() {
      const el = $('timeText');
      const pill = $('pillTime');
      if (!this.settings.timeLimit) { el.textContent = '∞'; pill.classList.remove('warn'); return; }
      el.textContent = this.timeLeft;
      pill.classList.toggle('warn', this.timeLeft <= 10);
    },
    stopTimer() { if (this.timerId) clearInterval(this.timerId); this.timerId = null; },

    pause() {
      if (!this.running || this.matched >= this.total) return;
      this.paused = true;
      showOverlay(renderPauseCard());
    },
    resume() {
      this.paused = false;
      hideOverlay();
    },

    finishWin() {
      this.running = false;
      this.stopTimer();
      AudioFX.playWin();
      fireConfetti();
      const used = Math.round((Date.now() - this.startedAt) / 1000);
      const acc = this.attempts ? Math.round((this.matched / this.attempts) * 100) : 100;
      const summary = {
        result: 'win', unit: this.unit.title, total: this.total,
        matched: this.matched, wrong: this.wrong, attempts: this.attempts,
        score: this.score, accuracy: acc, timeUsed: used, wrongWords: [...this.wrongWordKeys]
      };
      if (this.onWin) this.onWin(summary);
      showOverlay(renderResultCard(summary, true));
    },

    finishTimeUp() {
      this.running = false;
      AudioFX.playOver();
      const used = this.totalTime;
      const acc = this.attempts ? Math.round((this.matched / this.attempts) * 100) : 0;
      const summary = {
        result: 'timeup', unit: this.unit.title, total: this.total,
        matched: this.matched, wrong: this.wrong, attempts: this.attempts,
        score: this.score, accuracy: acc, timeUsed: used, wrongWords: [...this.wrongWordKeys]
      };
      if (this.onTimeUp) this.onTimeUp(summary);
      showOverlay(renderResultCard(summary, false));
    },

    abort() { this.stopTimer(); this.running = false; }
  };

  /* ---------- 辅助：DOM/动画 ---------- */
  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function showOverlay(html) {
    if (html !== undefined) $('overlayCard').innerHTML = html;
    $('overlay').classList.add('show');
  }
  function hideOverlay() { $('overlay').classList.remove('show'); }

  function floatFeedback(anchor, text, ok) {
    const f = document.createElement('div');
    f.className = 'float-feedback ' + (ok ? 'ok' : 'bad');
    f.textContent = text;
    const r = anchor.getBoundingClientRect();
    const pr = $('screenGame').getBoundingClientRect();
    f.style.left = (r.left - pr.left + r.width / 2 - 10) + 'px';
    f.style.top = (r.top - pr.top + 6) + 'px';
    $('screenGame').appendChild(f);
    setTimeout(() => f.remove(), 820);
  }

  function fireConfetti() {
    const colors = ['#ff8fab', '#ffd56b', '#6ee7b7', '#7bc6ff', '#b794f6', '#ffa07a'];
    const box = document.createElement('div');
    box.className = 'confetti';
    for (let i = 0; i < 80; i++) {
      const c = document.createElement('i');
      c.style.left = Math.random() * 100 + 'vw';
      c.style.background = colors[i % colors.length];
      c.style.animationDuration = (1.6 + Math.random() * 1.6) + 's';
      c.style.animationDelay = (Math.random() * 0.6) + 's';
      c.style.transform = 'rotate(' + (Math.random() * 360) + 'deg)';
      box.appendChild(c);
    }
    document.body.appendChild(box);
    setTimeout(() => box.remove(), 4200);
  }

  function showToast(msg, kind) {
    const t = $('toast'); t.textContent = msg;
    t.className = 'toast show ' + (kind || '');
    clearTimeout(t._tid);
    t._tid = setTimeout(() => t.classList.remove('show'), 1600);
  }

  /* ---------- 浮层卡片 HTML（开始/暂停/结算） ---------- */
  function renderResultCard(s, win) {
    const star = (on) => '<span class="' + (on ? 's-on' : 's-off') + '">⭐</span>';
    const stars = win
      ? (s.accuracy >= 90 ? 3 : s.accuracy >= 70 ? 2 : 1)
      : (s.matched >= s.total / 2 ? 1 : 0);
    const head = win ? ('🎉 通关啦！') : ('⏰ 时间到！');
    const sub = win ? ('太棒了，' + s.unit + ' 全部消除！') : ('还差 ' + (s.total - s.matched) + ' 对，再试一次吧～');
    return '' +
      '<div class="oc-emoji">' + (win ? '🏆' : '⏰') + '</div>' +
      '<div class="oc-title">' + head + '</div>' +
      '<div class="oc-sub">' + esc(sub) + '</div>' +
      '<div class="stars">' + star(stars >= 1) + star(stars >= 2) + star(stars >= 3) + '</div>' +
      '<div class="stat-grid">' +
        sb('ok', s.matched, '已配对') +
        sb('bad', s.wrong, '配错次数') +
        sb('info', s.accuracy + '%', '正确率') +
        sb('purple', s.score, '得分') +
      '</div>' +
      '<div class="oc-sub">用时 ' + s.timeUsed + ' 秒 · 共 ' + s.total + ' 对</div>' +
      '<div class="oc-actions">' +
        '<button class="btn btn-pink" onclick="App.restart()">🔄 再来一关</button>' +
        '<button class="btn btn-ghost" onclick="App.gotoHome()">🏠 换一关</button>' +
        '<button class="btn btn-blue btn-sm" onclick="App.openStats()">📊 看统计</button>' +
      '</div>';
  }
  function renderPauseCard() {
    return '' +
      '<div class="oc-emoji">⏸️</div>' +
      '<div class="oc-title">已暂停</div>' +
      '<div class="oc-sub">休息一下，准备好就继续～</div>' +
      '<div class="oc-actions">' +
        '<button class="btn btn-mint" onclick="Game.resume()">▶️ 继续游戏</button>' +
        '<button class="btn btn-ghost" onclick="App.restart()">🔄 重新开始</button>' +
        '<button class="btn btn-ghost btn-sm" onclick="App.gotoHome()">🏠 返回</button>' +
      '</div>';
  }
  function sb(cls, num, lab) {
    return '<div class="stat-box ' + cls + '"><div class="sb-num">' + num + '</div><div class="sb-lab">' + lab + '</div></div>';
  }

  // 暴露
  global.Game = Game;
  global._gameHelpers = { showOverlay, hideOverlay, showToast, esc };
})(window);
