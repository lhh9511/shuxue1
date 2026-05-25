/* Web Audio API 音效系统 - 程序化生成所有声音 */
const AudioManager = {
    ctx: null,
    enabled: true,
    bgmGain: null,
    sfxGain: null,
    bgmOsc: null,
    bgmPlaying: false,

    init() {
        if (this.ctx) return;
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        this.masterGain = this.ctx.createGain();
        this.masterGain.connect(this.ctx.destination);
        this.masterGain.gain.value = 0.5;

        this.bgmGain = this.ctx.createGain();
        this.bgmGain.connect(this.masterGain);
        this.bgmGain.gain.value = 0.15;

        this.sfxGain = this.ctx.createGain();
        this.sfxGain.connect(this.masterGain);
        this.sfxGain.gain.value = 0.6;
    },

    resume() {
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    },

    toggle() {
        this.enabled = !this.enabled;
        if (!this.enabled && this.bgmPlaying) {
            this.stopBGM();
        }
        return this.enabled;
    },

    playTone(freq, duration, type, gainNode, volume) {
        if (!this.enabled) return;
        this.init();
        this.resume();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type || 'sine';
        osc.frequency.value = freq;
        gain.gain.value = volume || 0.3;
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
        osc.connect(gain);
        gain.connect(gainNode || this.sfxGain);
        osc.start();
        osc.stop(this.ctx.currentTime + duration);
    },

    /* 正确音效 - 上行三音 */
    correct() {
        this.playTone(523, 0.12, 'sine', null, 0.3);
        setTimeout(() => this.playTone(659, 0.12, 'sine', null, 0.3), 80);
        setTimeout(() => this.playTone(784, 0.2, 'sine', null, 0.3), 160);
    },

    /* 错误音效 - 低沉两音 */
    wrong() {
        this.playTone(220, 0.15, 'sawtooth', null, 0.15);
        setTimeout(() => this.playTone(180, 0.25, 'sawtooth', null, 0.15), 120);
    },

    /* 点击音效 */
    click() {
        this.playTone(800, 0.06, 'sine', null, 0.15);
    },

    /* 倒计时滴答 */
    tick() {
        this.playTone(1000, 0.05, 'square', null, 0.1);
    },

    /* 游戏完成 - 欢快旋律 */
    complete() {
        const notes = [523, 587, 659, 784, 880, 1047];
        notes.forEach((n, i) => {
            setTimeout(() => this.playTone(n, 0.15, 'sine', null, 0.25), i * 100);
        });
    },

    /* 游戏失败 */
    fail() {
        const notes = [440, 415, 392, 349];
        notes.forEach((n, i) => {
            setTimeout(() => this.playTone(n, 0.2, 'triangle', null, 0.2), i * 150);
        });
    },

    /* 翻牌音效 */
    flip() {
        this.playTone(600, 0.08, 'sine', null, 0.2);
    },

    /* 配对成功 */
    match() {
        this.playTone(660, 0.1, 'sine', null, 0.25);
        setTimeout(() => this.playTone(880, 0.15, 'sine', null, 0.25), 100);
    },

    /* 按键音 (钢琴等) */
    note(freq) {
        this.playTone(freq, 0.5, 'sine', null, 0.35);
    },

    /* 打击音 */
    hit() {
        this.playTone(150, 0.1, 'square', null, 0.2);
        this.playTone(80, 0.15, 'sawtooth', null, 0.15);
    },

    /* 背景音乐 - 简单旋律循环 */
    startBGM() {
        if (!this.enabled || this.bgmPlaying) return;
        this.init();
        this.resume();
        this.bgmPlaying = true;
        this._playBGMLoop();
    },

    _playBGMLoop() {
        if (!this.bgmPlaying || !this.enabled) return;
        // C大调简单旋律
        const melody = [
            262, 294, 330, 262, 330, 349, 392, 0,
            392, 440, 392, 349, 330, 262, 0, 0,
            262, 294, 330, 262, 330, 349, 392, 0,
            392, 440, 523, 440, 392, 349, 330, 0
        ];
        const beatDur = 0.2;
        let t = this.ctx.currentTime;
        melody.forEach(freq => {
            if (freq > 0 && this.bgmPlaying) {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = 'sine';
                osc.frequency.value = freq;
                gain.gain.setValueAtTime(0.08, t);
                gain.gain.exponentialRampToValueAtTime(0.001, t + beatDur * 0.9);
                osc.connect(gain);
                gain.connect(this.bgmGain);
                osc.start(t);
                osc.stop(t + beatDur);
            }
            t += beatDur;
        });
        // 循环
        const loopDur = melody.length * beatDur * 1000;
        this._bgmTimer = setTimeout(() => this._playBGMLoop(), loopDur - 100);
    },

    stopBGM() {
        this.bgmPlaying = false;
        if (this._bgmTimer) {
            clearTimeout(this._bgmTimer);
            this._bgmTimer = null;
        }
    },

    /* 鼓声 */
    drum() {
        if (!this.enabled) return;
        this.init();
        this.resume();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.frequency.value = 100;
        osc.frequency.exponentialRampToValueAtTime(30, this.ctx.currentTime + 0.1);
        gain.gain.value = 0.4;
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);
        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.15);
    }
};
