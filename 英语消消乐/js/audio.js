/* =====================================================================
 * 音效模块 AudioFX
 * - 用 Web Audio API 现场合成音效（答对/答错/胜利/点击/倒计时滴答/游戏结束）
 *   无需任何外部音频文件，离线也能用。
 * - 用浏览器内置 speechSynthesis 朗读英文单词。
 * ===================================================================== */
(function (global) {
  'use strict';

  const AudioFX = {
    ctx: null,
    enabled: true,        // 音效总开关
    speakEnabled: true,   // 朗读总开关
    voices: [],
    enVoice: null,

    /** 懒加载 AudioContext（必须在用户首次交互后，否则浏览器会拦截） */
    ensure() {
      if (!this.ctx) {
        try {
          const AC = global.AudioContext || global.webkitAudioContext;
          if (AC) this.ctx = new AC();
        } catch (e) { this.ctx = null; }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(function () {});
      }
      return this.ctx;
    },

    setEnabled(v) { this.enabled = !!v; },
    setSpeakEnabled(v) { this.speakEnabled = !!v; },

    /** 载入英文语音（女声优先） */
    initVoices() {
      if (!('speechSynthesis' in global)) return;
      const load = () => {
        this.voices = global.speechSynthesis.getVoices() || [];
        // 优先选英文女声
        const en = this.voices.filter(v => /en(-|_)?(US|GB)/i.test(v.lang) || /^en/i.test(v.lang));
        this.enVoice =
          en.find(v => /female|samantha|google us|zira|aria/i.test(v.name)) ||
          en.find(v => /US/i.test(v.lang)) ||
          en[0] || null;
      };
      load();
      if (global.speechSynthesis.onvoiceschanged !== undefined) {
        global.speechSynthesis.onvoiceschanged = load;
      }
    },

    /** 朗读英文单词 */
    speak(text, opts) {
      opts = opts || {};
      if (!this.speakEnabled) return;
      if (!('speechSynthesis' in global) || !text) return;
      try {
        global.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(String(text));
        u.lang = 'en-US';
        u.rate = opts.rate || 0.85;   // 稍慢，便于学生听清
        u.pitch = opts.pitch || 1.05;
        if (this.enVoice) u.voice = this.enVoice;
        global.speechSynthesis.speak(u);
      } catch (e) { /* 忽略 */ }
    },

    /** 单个音符 */
    _tone(freq, startAt, dur, type, gainPeak) {
      const ctx = this.ctx;
      if (!ctx) return;
      const t0 = ctx.currentTime + startAt;
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = type || 'sine';
      osc.frequency.setValueAtTime(freq, t0);
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.exponentialRampToValueAtTime(gainPeak || 0.25, t0 + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
      osc.connect(g).connect(ctx.destination);
      osc.start(t0);
      osc.stop(t0 + dur + 0.05);
    },

    /** 答对：上行三音叮咚~ */
    playCorrect() {
      if (!this.enabled) return;
      const ctx = this.ensure(); if (!ctx) return;
      this._tone(660, 0, 0.14, 'triangle', 0.3);
      this._tone(880, 0.10, 0.14, 'triangle', 0.3);
      this._tone(1175, 0.20, 0.22, 'triangle', 0.32);
    },

    /** 答错：下行短促嗡嗡 */
    playWrong() {
      if (!this.enabled) return;
      const ctx = this.ensure(); if (!ctx) return;
      this._tone(311, 0, 0.16, 'sawtooth', 0.22);
      this._tone(233, 0.12, 0.22, 'sawtooth', 0.22);
    },

    /** 点击：轻柔咔哒 */
    playClick() {
      if (!this.enabled) return;
      const ctx = this.ensure(); if (!ctx) return;
      this._tone(520, 0, 0.06, 'sine', 0.16);
    },

    /** 倒计时滴答（最后 5 秒更急促） */
    playTick(urgent) {
      if (!this.enabled) return;
      const ctx = this.ensure(); if (!ctx) return;
      this._tone(urgent ? 880 : 560, 0, 0.05, 'square', urgent ? 0.18 : 0.10);
    },

    /** 胜利：欢快小旋律 */
    playWin() {
      if (!this.enabled) return;
      const ctx = this.ensure(); if (!ctx) return;
      const notes = [523, 659, 784, 1047, 784, 1047];
      notes.forEach((f, i) => this._tone(f, i * 0.14, 0.20, 'triangle', 0.3));
    },

    /** 时间到 / 游戏结束：低沉两下 */
    playOver() {
      if (!this.enabled) return;
      const ctx = this.ensure(); if (!ctx) return;
      this._tone(440, 0, 0.18, 'sine', 0.25);
      this._tone(330, 0.18, 0.18, 'sine', 0.25);
      this._tone(220, 0.36, 0.40, 'sine', 0.28);
    }
  };

  global.AudioFX = AudioFX;
})(window);
