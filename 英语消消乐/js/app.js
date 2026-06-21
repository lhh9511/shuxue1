/* =====================================================================
 * 应用主控 App
 * 负责：验证码门禁、首页渲染、设置、导航、统计累计、错题本、导出、持久化
 * 依赖：PEP_DATA、AudioFX、Game
 * ===================================================================== */
(function (global) {
  'use strict';

  const $ = (id) => document.getElementById(id);
  const STORE_KEY = 'pep_xxl_v1';

  const App = {
    state: null,           // 持久化状态
    currentUnitId: null,
    currentGradeId: null,
    bookFilter: 'all',

    /* ---------- 初始化 ---------- */
    init() {
      this.loadState();
      AudioFX.initVoices();

      // 注入背景漂浮 emoji
      const fs = $('floaties');
      const emojis = ['🍬','🍓','⭐','🎈','🌸','📚','✏️','🦄','🌈','🍩','🎀'];
      for (let i = 0; i < 12; i++) {
        const s = document.createElement('span');
        s.textContent = emojis[i % emojis.length];
        s.style.left = (Math.random() * 100) + 'vw';
        s.style.top = (Math.random() * 100) + 'vh';
        s.style.fontSize = (18 + Math.random() * 22) + 'px';
        s.style.animationDelay = (Math.random() * 6) + 's';
        s.style.animationDuration = (7 + Math.random() * 6) + 's';
        fs.appendChild(s);
      }

      this.bindGate();
      this.bindUI();
      this.renderHome();
      this.applySettingsToUI();

      // Game 回调
      Game.onMatch = () => {};
      Game.onWrong = (info) => this.addError(info);
      Game.onWin = (s) => this.recordResult(s);
      Game.onTimeUp = (s) => this.recordResult(s);
    },

    /* ---------- 持久化 ---------- */
    defaultState() {
      return {
        title: '英语消消乐',
        stats: {
          sessions: 0,           // 完成局数
          totalMatched: 0,
          totalWrong: 0,
          totalAttempts: 0,
          totalScore: 0,
          totalTime: 0,          // 累计用时（秒）
          perUnit: {},           // { unitId: {played, bestAcc, bestScore} }
          history: []            // [{unit, result, matched, wrong, acc, score, time, at}]
        },
        errors: [],              // [{en,zh,phon,unit,pickedZh,at}]
        settings: { sound: true, speak: true, autoSpeak: true, hintAfter: 2, timeLimit: 90 }
      };
    },
    loadState() {
      try {
        const raw = localStorage.getItem(STORE_KEY);
        this.state = raw ? JSON.parse(raw) : this.defaultState();
      } catch (e) { this.state = this.defaultState(); }
      // 兜底字段
      const d = this.defaultState();
      this.state = Object.assign({}, d, this.state);
      this.state.stats = Object.assign({}, d.stats, this.state.stats || {});
      this.state.stats.perUnit = this.state.stats.perUnit || {};
      this.state.stats.history = this.state.stats.history || [];
      this.state.errors = this.state.errors || [];
      this.state.settings = Object.assign({}, d.settings, this.state.settings || {});
    },
    saveState() {
      try { localStorage.setItem(STORE_KEY, JSON.stringify(this.state)); } catch (e) {}
    },

    /* ---------- 验证码门禁 ---------- */
    captchaCode: '',
    bindGate() {
      this.refreshCaptcha();
      const canvas = $('captchaCanvas');
      canvas.addEventListener('click', () => this.refreshCaptcha());
      $('captchaInput').addEventListener('keydown', (e) => {
        if (e.key === 'Enter') this.verifyGate();
      });
      $('gateBtn').addEventListener('click', () => this.verifyGate());
    },
    refreshCaptcha() {
      this.captchaCode = this.genCode();
      this.drawCaptcha(this.captchaCode);
      $('captchaInput').value = '';
      $('gateHint').textContent = '提示：验证码不区分大小写，点击图片可刷新';
      $('gateHint').className = 'gate-hint';
    },
    genCode() {
      const pool = 'ABCDEFGHJKLMNPQRSTUVWXY3456789'; // 去掉易混的 0O1IL
      let s = '';
      for (let i = 0; i < 4; i++) s += pool[Math.floor(Math.random() * pool.length)];
      return s;
    },
    drawCaptcha(code) {
      const cv = $('captchaCanvas');
      // 适配高分屏
      const dpr = window.devicePixelRatio || 1;
      const W = 160, H = 64;
      cv.width = W * dpr; cv.height = H * dpr;
      const ctx = cv.getContext('2d');
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // 背景渐变
      const g = ctx.createLinearGradient(0, 0, W, H);
      g.addColorStop(0, '#fff0f6'); g.addColorStop(1, '#eef5ff');
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      // 干扰线
      for (let i = 0; i < 6; i++) {
        ctx.strokeStyle = randPastel(); ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(Math.random() * W, Math.random() * H);
        ctx.lineTo(Math.random() * W, Math.random() * H);
        ctx.stroke();
      }
      // 干扰点
      for (let i = 0; i < 40; i++) {
        ctx.fillStyle = randPastel();
        ctx.beginPath();
        ctx.arc(Math.random() * W, Math.random() * H, Math.random() * 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
      // 字符
      const colors = ['#ff5d8f', '#9f7aea', '#4aa8e8', '#34d399', '#e17055'];
      const cw = W / code.length;
      for (let i = 0; i < code.length; i++) {
        ctx.save();
        ctx.font = 'bold ' + (26 + Math.random() * 6) + 'px "ZCOOL KuaiLe", "Comic Sans MS", sans-serif';
        ctx.fillStyle = colors[i % colors.length];
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const x = cw * i + cw / 2;
        const y = H / 2 + (Math.random() * 14 - 7);
        ctx.translate(x, y);
        ctx.rotate((Math.random() - 0.5) * 0.5);
        ctx.fillText(code[i], 0, 0);
        ctx.restore();
      }
    },
    verifyGate() {
      const input = $('captchaInput').value.trim().toUpperCase();
      const hint = $('gateHint');
      AudioFX.ensure();
      AudioFX.playClick();
      if (!input) {
        hint.textContent = '请输入验证码呀～'; hint.className = 'gate-hint bad'; return;
      }
      if (input === this.captchaCode.toUpperCase()) {
        hint.textContent = '✅ 验证成功，正在进入…'; hint.className = 'gate-hint ok';
        AudioFX.playCorrect();
        setTimeout(() => this.enterApp(), 420);
      } else {
        hint.textContent = '❌ 验证码不对哦，已换一张，再试试～'; hint.className = 'gate-hint bad';
        AudioFX.playWrong();
        this.refreshCaptcha();
        const card = document.querySelector('.gate-card');
        card.style.animation = 'none'; void card.offsetWidth; card.style.animation = 'shake .4s';
      }
    },
    enterApp() {
      $('gate').style.display = 'none';
      $('app').hidden = false;
      AudioFX.initVoices();
      this.applySettingsToAudio();
    },

    /* ---------- UI 绑定 ---------- */
    bindUI() {
      // 标题
      const ti = $('titleInput');
      ti.value = this.state.title || '英语消消乐';
      document.title = ti.value + ' · 人教版 PEP';
      ti.addEventListener('input', () => {
        this.state.title = ti.value || '英语消消乐';
        document.title = this.state.title + ' · 人教版 PEP';
        this.saveState();
      });

      // 顶栏按钮
      $('btnHome').addEventListener('click', () => this.gotoHome());
      $('btnErr').addEventListener('click', () => this.openErrors());
      $('btnStats').addEventListener('click', () => this.openStats());
      $('btnSound').addEventListener('click', () => {
        const cb = $('setSound');
        cb.checked = !cb.checked;
        this.onSettingsChange();
        this.toast(cb.checked ? '🔊 音效已开' : '🔇 已静音', cb.checked ? 'ok' : 'bad');
      });

      // 书册切换
      $('bookSwitch').querySelectorAll('button').forEach(b => {
        b.addEventListener('click', () => {
          $('bookSwitch').querySelectorAll('button').forEach(x => x.classList.remove('active'));
          b.classList.add('active');
          this.bookFilter = b.dataset.book;
          this.renderHome();
        });
      });

      // 设置
      ['setTime', 'setHint', 'setSound', 'setSpeak', 'setAutoSpeak'].forEach(id => {
        $(id).addEventListener('change', () => this.onSettingsChange());
      });

      // 游戏内按钮
      $('btnHintNow').addEventListener('click', () => Game.flashHint(true));
      $('btnPause').addEventListener('click', () => {
        if (Game.paused) Game.resume(); else Game.pause();
      });
      $('btnRestart').addEventListener('click', () => this.restart());
      $('btnBack').addEventListener('click', () => this.gotoHome());

      // 模态关闭
      document.querySelectorAll('[data-close]').forEach(b => {
        b.addEventListener('click', () => $(b.dataset.close).classList.remove('show'));
      });
      [$('errModal'), $('statsModal')].forEach(m => {
        m.addEventListener('click', (e) => { if (e.target === m) m.classList.remove('show'); });
      });

      // 错题/统计操作
      $('btnExportErr').addEventListener('click', () => this.exportErrors());
      $('btnClearErr').addEventListener('click', () => this.clearErrors());
      $('btnExportStats').addEventListener('click', () => this.exportStats());
      $('btnResetStats').addEventListener('click', () => this.resetStats());

      // 键盘：Esc 关模态
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          $('errModal').classList.remove('show');
          $('statsModal').classList.remove('show');
        }
      });
    },

    applySettingsToUI() {
      const s = this.state.settings;
      $('setTime').value = String(s.timeLimit);
      $('setHint').value = String(s.hintAfter);
      $('setSound').checked = !!s.sound;
      $('setSpeak').checked = !!s.speak;
      $('setAutoSpeak').checked = !!s.autoSpeak;
      $('btnSound').textContent = s.sound ? '🔊 音效' : '🔇 已静音';
    },
    onSettingsChange() {
      const s = this.state.settings;
      s.timeLimit = parseInt($('setTime').value, 10) || 0;
      s.hintAfter = parseInt($('setHint').value, 10) || 0;
      s.sound = $('setSound').checked;
      s.speak = $('setSpeak').checked;
      s.autoSpeak = $('setAutoSpeak').checked;
      this.applySettingsToAudio();
      $('btnSound').textContent = s.sound ? '🔊 音效' : '🔇 已静音';
      this.saveState();
    },
    applySettingsToAudio() {
      const s = this.state.settings;
      AudioFX.setEnabled(s.sound);
      AudioFX.setSpeakEnabled(s.speak);
    },

    /* ---------- 首页渲染 ---------- */
    renderHome() {
      const grid = $('gradeGrid');
      grid.innerHTML = '';
      PEP_DATA.grades.forEach((g) => {
        // 按书册过滤单元
        const units = [];
        g.books.forEach((b) => {
          if (this.bookFilter === 'all' || this.bookFilter === b.id.slice(-1)) {
            b.units.forEach(u => units.push(Object.assign({ book: b.name }, u)));
          }
        });
        if (!units.length) return;

        const card = document.createElement('div');
        card.className = 'grade-card';
        card.innerHTML =
          '<div class="gc-head"><span class="gc-emoji">' + g.emoji + '</span>' +
          '<span class="gc-name">' + g.name + '</span></div>' +
          '<div class="gc-color" style="background:' + g.color + '"></div>' +
          '<div class="unit-list"></div>';
        const list = card.querySelector('.unit-list');
        units.forEach(u => {
          const it = document.createElement('div');
          it.className = 'unit-item';
          it.innerHTML =
            '<span class="ue">' + (u.emoji || '📘') + '</span>' +
            '<span class="ut">' + esc(u.title) + '<small>' + esc(u.book) + ' · ' + esc(u.topic || '') + '</small></span>' +
            '<span class="uc">' + u.words.length + '词</span>';
          it.addEventListener('click', () => this.startUnit(g.id, u.id));
          list.appendChild(it);
        });
        grid.appendChild(card);
      });
    },

    /* ---------- 开始/导航 ---------- */
    findUnit(gradeId, unitId) {
      for (const g of PEP_DATA.grades) {
        if (g.id !== gradeId) continue;
        for (const b of g.books) {
          for (const u of b.units) {
            if (u.id === unitId) return { grade: g, unit: u };
          }
        }
      }
      return null;
    },
    startUnit(gradeId, unitId) {
      const found = this.findUnit(gradeId, unitId);
      if (!found) return;
      this.currentGradeId = gradeId;
      this.currentUnitId = unitId;
      this.switchScreen('screenGame');
      const s = this.state.settings;
      Game.start(found.unit, gradeId, {
        sound: s.sound, speak: s.speak, autoSpeak: s.autoSpeak,
        hintAfter: s.hintAfter, timeLimit: s.timeLimit
      });
      AudioFX.ensure();
    },
    restart() {
      if (this.currentUnitId) this.startUnit(this.currentGradeId, this.currentUnitId);
      else this.gotoHome();
    },
    gotoHome() {
      Game.abort();
      this.switchScreen('screenHome');
      global._gameHelpers.hideOverlay();
    },
    switchScreen(id) {
      document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
      $(id).classList.add('active');
    },

    /* ---------- 错题 ---------- */
    addError(info) {
      // 同一单词去重（按 en），保留最新一次
      this.state.errors = this.state.errors.filter(e => e.en !== info.en);
      this.state.errors.unshift({
        en: info.en, zh: info.zh, phon: info.phon || '',
        unit: Game.unit ? Game.unit.title : '',
        pickedZh: info.pickedZh || '',
        at: nowStr()
      });
      if (this.state.errors.length > 300) this.state.errors.length = 300;
      this.saveState();
    },
    openErrors() {
      const list = $('errList');
      $('errModalSub').textContent = '共 ' + this.state.errors.length + ' 个错过的单词（点击 🔊 可朗读）';
      list.innerHTML = '';
      if (!this.state.errors.length) {
        list.innerHTML = '<div class="empty-hint">🎉 还没有错题，继续保持！</div>';
      } else {
        this.state.errors.forEach((e, i) => {
          const row = document.createElement('div');
          row.className = 'err-item';
          row.innerHTML =
            '<span class="ee">' + (e.phon ? '🔤' : '📕') + '</span>' +
            '<span class="et"><b>' + esc(e.en) + '</b>' +
              (e.phon ? ' /' + esc(e.phon) + '/' : '') +
              ' → ' + esc(e.zh) +
              (e.pickedZh && e.pickedZh !== e.zh ? '<div class="correct">你选了：' + esc(e.pickedZh) + '</div>' : '') +
              '<div class="correct">' + esc(e.unit || '') + (e.at ? ' · ' + esc(e.at) : '') + '</div>' +
            '</span>' +
            '<span class="es" title="朗读">🔊</span>';
          row.querySelector('.es').addEventListener('click', () => AudioFX.speak(e.en));
          list.appendChild(row);
        });
      }
      $('errModal').classList.add('show');
    },
    clearErrors() {
      if (!this.state.errors.length) { this.toast('错题本已经是空的啦', 'ok'); return; }
      if (!confirm('确定清空全部错题吗？此操作不可撤销。')) return;
      this.state.errors = [];
      this.saveState();
      this.openErrors();
      this.toast('已清空错题本', 'ok');
    },
    exportErrors() {
      if (!this.state.errors.length) { this.toast('没有错题可导出', 'bad'); return; }
      // CSV（带 BOM，Excel 可直接打开中文）
      const head = ['序号', '英文', '音标', '中文', '单元', '错选', '时间'];
      const rows = this.state.errors.map((e, i) => [i + 1, e.en, e.phon || '', e.zh, e.unit || '', e.pickedZh || '', e.at || '']);
      const csv = '﻿' + [head, ...rows].map(r => r.map(csvCell).join(',')).join('\r\n');
      const stamp = fileStamp();
      downloadFile('英语消消乐_错题本_' + stamp + '.csv', csv, 'text/csv;charset=utf-8');
      this.toast('已导出 ' + this.state.errors.length + ' 条错题', 'ok');
    },

    /* ---------- 统计 ---------- */
    recordResult(s) {
      const st = this.state.stats;
      st.sessions += 1;
      st.totalMatched += s.matched;
      st.totalWrong += s.wrong;
      st.totalAttempts += s.attempts;
      st.totalScore += s.score;
      st.totalTime += s.timeUsed;
      const pu = st.perUnit[this.currentUnitId] || { played: 0, bestAcc: 0, bestScore: 0 };
      pu.played += 1;
      pu.bestAcc = Math.max(pu.bestAcc, s.accuracy);
      pu.bestScore = Math.max(pu.bestScore, s.score);
      st.perUnit[this.currentUnitId] = pu;
      st.history.unshift({
        unit: s.unit, result: s.result,
        matched: s.matched, wrong: s.wrong, acc: s.accuracy,
        score: s.score, time: s.timeUsed, at: nowStr()
      });
      if (st.history.length > 200) st.history.length = 200;
      this.saveState();
    },
    openStats() {
      const st = this.state.stats;
      const acc = st.totalAttempts ? Math.round((st.totalMatched / st.totalAttempts) * 100) : 0;
      const unitsPlayed = Object.keys(st.perUnit).length;
      $('statsSub').textContent = '累计完成 ' + st.sessions + ' 局 · 涉及 ' + unitsPlayed + ' 个单元';
      const last = st.history.slice(0, 8);
      const lastHtml = last.length
        ? last.map(h => '<div class="err-item"><span class="ee">' + (h.result === 'win' ? '🏆' : '⏰') + '</span>' +
            '<span class="et"><b>' + esc(h.unit) + '</b>' +
              '<div class="correct">配对 ' + h.matched + ' · 错 ' + h.wrong + ' · 正确率 ' + h.acc + '% · 得分 ' + h.score + ' · ' + esc(h.at) + '</div></span></div>').join('')
        : '<div class="empty-hint">还没有完成任何一关，去玩一局吧～</div>';
      $('statsContent').innerHTML =
        '<div class="stat-grid">' +
          sb('info', st.sessions, '完成局数') +
          sb('ok', st.totalMatched, '累计配对') +
          sb('bad', st.totalWrong, '累计配错') +
          sb('purple', acc + '%', '总正确率') +
          sb('info', st.totalScore, '累计得分') +
          sb('ok', Math.round(st.totalTime / 60) + '分', '累计用时') +
        '</div>' +
        '<div class="modal-head"><h3 style="margin-top:8px;">🕘 最近记录</h3></div>' +
        '<div class="err-list">' + lastHtml + '</div>';
      $('statsModal').classList.add('show');
    },
    resetStats() {
      if (!confirm('确定重置全部统计数据吗？此操作不可撤销（错题本不受影响）。')) return;
      this.state.stats = this.defaultState().stats;
      this.saveState();
      this.openStats();
      this.toast('统计数据已重置', 'ok');
    },
    exportStats() {
      const st = this.state.stats;
      const acc = st.totalAttempts ? Math.round((st.totalMatched / st.totalAttempts) * 100) : 0;
      // 可读 .txt
      const L = [];
      L.push('===== 英语消消乐 · 答题统计 =====');
      L.push('导出时间：' + nowStr());
      L.push('标题：' + (this.state.title || '英语消消乐'));
      L.push('');
      L.push('【总体】');
      L.push('完成局数：' + st.sessions);
      L.push('累计配对成功：' + st.totalMatched);
      L.push('累计配错次数：' + st.totalWrong);
      L.push('总正确率：' + acc + '%');
      L.push('累计得分：' + st.totalScore);
      L.push('累计用时：' + Math.round(st.totalTime / 60) + ' 分 ' + (st.totalTime % 60) + ' 秒');
      L.push('错题本单词数：' + this.state.errors.length);
      L.push('');
      L.push('【各单元最佳成绩】');
      const puKeys = Object.keys(st.perUnit);
      if (puKeys.length) {
        puKeys.forEach(uid => {
          const pu = st.perUnit[uid];
          const name = this.unitName(uid);
          L.push('- ' + name + '：练习 ' + pu.played + ' 次，最高正确率 ' + pu.bestAcc + '%，最高得分 ' + pu.bestScore);
        });
      } else { L.push('（暂无）'); }
      L.push('');
      L.push('【最近 ' + st.history.length + ' 局明细】');
      st.history.forEach((h, i) => {
        L.push((i + 1) + '. [' + (h.result === 'win' ? '通关' : '时间到') + '] ' + h.unit +
          ' | 配对' + h.matched + ' 错' + h.wrong + ' 正确率' + h.acc + '% 得分' + h.score + ' 用时' + h.time + 's | ' + h.at);
      });
      const txt = L.join('\n');
      downloadFile('英语消消乐_答题统计_' + fileStamp() + '.txt', txt, 'text/plain;charset=utf-8');
      this.toast('统计结果已导出', 'ok');
    },
    unitName(uid) {
      for (const g of PEP_DATA.grades) for (const b of g.books) for (const u of b.units)
        if (u.id === uid) return g.name + b.name + ' · ' + u.title;
      return uid;
    },

    /* ---------- 小工具 ---------- */
    toast(msg, kind) { global._gameHelpers.showToast(msg, kind); }
  };

  /* ---------- 工具函数 ---------- */
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function sb(cls, num, lab) {
    return '<div class="stat-box ' + cls + '"><div class="sb-num">' + num + '</div><div class="sb-lab">' + lab + '</div></div>';
  }
  function randPastel() {
    const p = ['#ffd1dc', '#d1e8ff', '#d8ffd1', '#ffe8c1', '#e8d1ff', '#fff0a8'];
    return p[Math.floor(Math.random() * p.length)];
  }
  function nowStr() {
    const d = new Date();
    const p = (n) => String(n).padStart(2, '0');
    return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate()) + ' ' + p(d.getHours()) + ':' + p(d.getMinutes());
  }
  function fileStamp() {
    const d = new Date();
    const p = (n) => String(n).padStart(2, '0');
    return d.getFullYear() + p(d.getMonth() + 1) + p(d.getDate()) + '_' + p(d.getHours()) + p(d.getMinutes());
  }
  function csvCell(v) {
    const s = String(v == null ? '' : v);
    return /[",\n\r]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
  }
  function downloadFile(name, content, mime) {
    const blob = new Blob([content], { type: mime || 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = name;
    document.body.appendChild(a); a.click();
    setTimeout(() => { URL.revokeObjectURL(url); a.remove(); }, 200);
  }

  global.App = App;

  document.addEventListener('DOMContentLoaded', () => App.init());
})(window);
