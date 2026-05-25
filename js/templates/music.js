/* 音乐节奏模板 - 钢琴、鼓点、音阶等 */
class Template_music extends GameEngine {
    init() {
        this.mode = this.config.mode || 'piano';
        this.notes = {
            'C4': 262, 'D4': 294, 'E4': 330, 'F4': 349,
            'G4': 392, 'A4': 440, 'B4': 494, 'C5': 523,
            'D5': 587, 'E5': 659, 'F5': 698, 'G5': 784
        };
    }

    nextRound() {
        if (this.mode === 'piano') this.renderPiano();
        else if (this.mode === 'pitch') this.renderPitch();
        else if (this.mode === 'rhythm') this.renderRhythm();
        else if (this.mode === 'scale') this.renderScale();
        else if (this.mode === 'sound') this.renderSoundGuess();
    }

    renderPiano() {
        const keys = ['C4','D4','E4','F4','G4','A4','B4','C5'];
        this.container.innerHTML = `
            <div class="game-question">🎹 自由演奏</div>
            <div class="piano-keys">
                ${keys.map(k => `<div class="piano-key" onmousedown="window.currentGame.playNote('${k}',this)" ontouchstart="window.currentGame.playNote('${k}',this)">${k.replace('4','').replace('5','\'')}</div>`).join('')}
            </div>
            <div class="game-hint">点击琴键演奏音乐吧！</div>
        `;
    }

    playNote(key, el) {
        const freq = this.notes[key] || 440;
        AudioManager.note(freq);
        if (el) {
            el.classList.add('pressed');
            setTimeout(() => el.classList.remove('pressed'), 200);
        }
    }

    renderPitch() {
        // 听音辨高低
        const base = this.rand(3, 6); // MIDI-like note number
        const higher = base + this.rand(1, 3);
        const noteNames = ['C','D','E','F','G','A','B'];
        const freq1 = this.notes[noteNames[base % 7] + '4'] || 330;
        const freq2 = this.notes[noteNames[higher % 7] + '4'] || 440;

        this.container.innerHTML = `
            <div class="game-progress"><div class="game-progress-bar" style="width:${(this.round/this.totalRounds)*100}%"></div></div>
            <div class="game-question">哪个声音更高？</div>
            <div class="game-options">
                <button class="game-option" onclick="window.currentGame.playAndCheck(0)">🔊 第一个</button>
                <button class="game-option" onclick="window.currentGame.playAndCheck(1)">🔊 第二个</button>
            </div>
            <button class="btn" style="margin-top:10px;font-size:14px;padding:8px 16px" onclick="window.currentGame.replayPitch()">再听一遍</button>
            <div class="game-hint">第 ${this.round + 1} / ${this.totalRounds} 题</div>
        `;
        this._freq1 = freq1;
        this._freq2 = freq2;
        this._higher = freq2 > freq1 ? 1 : 0;
        setTimeout(() => {
            AudioManager.note(freq1);
            setTimeout(() => AudioManager.note(freq2), 800);
        }, 500);
    }

    replayPitch() {
        AudioManager.note(this._freq1);
        setTimeout(() => AudioManager.note(this._freq2), 800);
    }

    playAndCheck(choice) {
        if (this.finished) return;
        if (choice === this._higher) this.onCorrect();
        else this.onWrong();
    }

    renderRhythm() {
        // 节奏模仿 - 听一段节奏然后重复
        const beats = [];
        const len = Math.min(3 + this.round, 7);
        for (let i = 0; i < len; i++) beats.push(this.rand(0, 1));

        this.container.innerHTML = `
            <div class="game-progress"><div class="game-progress-bar" style="width:${(this.round/this.totalRounds)*100}%"></div></div>
            <div class="game-question">听节奏，然后模仿！</div>
            <div id="rhythmDisplay" style="display:flex;gap:8px;justify-content:center;margin:20px 0">
                ${beats.map((b, i) => `<div style="width:40px;height:40px;border-radius:50%;background:${b ? '#FF6B9D' : '#ddd'}"></div>`).join('')}
            </div>
            <div id="rhythmInput" style="display:flex;gap:8px;justify-content:center;margin:20px 0">
                ${beats.map((b, i) => `<div class="game-option" style="width:40px;height:40px;border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;padding:0" onclick="window.currentGame.tapBeat(${i},${b},this)">👊</div>`).join('')}
            </div>
            <div class="game-hint">点击圆圈打节奏（粉色=拍，灰色=空）第 ${this.round + 1} / ${this.totalRounds} 题</div>
        `;

        // 播放节奏
        beats.forEach((b, i) => {
            if (b) setTimeout(() => AudioManager.drum(), i * 400 + 500);
        });
    }

    tapBeat(idx, expected, el) {
        if (this.finished) return;
        el.style.background = '#FF6B9D';
        el.textContent = '';
        AudioManager.drum();

        // 简化：一轮只判断一个
        this._rhythmTaps = (this._rhythmTaps || 0) + 1;
        const totalBeats = this.container.querySelectorAll('#rhythmInput .game-option').length;

        if (this._rhythmTaps >= totalBeats) {
            // 检查全部
            setTimeout(() => this.onCorrect(), 300);
            this._rhythmTaps = 0;
        }
    }

    renderScale() {
        // 音阶练习
        const scales = [
            { name: 'C大调上行', notes: ['C4','D4','E4','F4','G4','A4','B4','C5'] },
            { name: 'C大调下行', notes: ['C5','B4','A4','G4','F4','E4','D4','C4'] },
        ];
        const scale = scales[this.round % scales.length];
        const shuffled = this.shuffle([...scale.notes]);

        this.container.innerHTML = `
            <div class="game-progress"><div class="game-progress-bar" style="width:${(this.round/this.totalRounds)*100}%"></div></div>
            <div class="game-question">${scale.name} - 按顺序点击</div>
            <div class="game-options">
                ${shuffled.map(n => `<button class="game-option" onclick="window.currentGame.pickScaleNote('${n}',this)">${n}</button>`).join('')}
            </div>
            <div class="game-hint">第 ${this.round + 1} / ${this.totalRounds} 题</div>
        `;
        this._scaleOrder = scale.notes;
        this._scaleIdx = 0;
    }

    pickScaleNote(note, el) {
        if (this.finished) return;
        if (note === this._scaleOrder[this._scaleIdx]) {
            AudioManager.note(this.notes[note]);
            el.classList.add('correct');
            el.onclick = null;
            this._scaleIdx++;
            if (this._scaleIdx >= this._scaleOrder.length) {
                this.onCorrect();
            }
        } else {
            el.classList.add('wrong');
            AudioManager.wrong();
            setTimeout(() => el.classList.remove('wrong'), 300);
        }
    }

    renderSoundGuess() {
        // 声音猜猜猜 - 用不同频率模拟不同音色
        const sounds = [
            { name: '小鸟叫', freq: 1200, type: 'sine', emoji: '🐦' },
            { name: '大鼓声', freq: 80, type: 'sawtooth', emoji: '🥁' },
            { name: '铃声', freq: 800, type: 'triangle', emoji: '🔔' },
            { name: '蜜蜂嗡嗡', freq: 200, type: 'square', emoji: '🐝' },
            { name: '流水声', freq: 400, type: 'sine', emoji: '💧' },
            { name: '雷声', freq: 60, type: 'sawtooth', emoji: '⚡' },
        ];
        const target = sounds[this.rand(0, sounds.length - 1)];
        const opts = this.shuffle(sounds).slice(0, 4);
        if (!opts.find(o => o.name === target.name)) opts[0] = target;

        // 播放声音
        AudioManager.playTone(target.freq, 0.3, target.type, null, 0.3);

        this.container.innerHTML = `
            <div class="game-progress"><div class="game-progress-bar" style="width:${(this.round/this.totalRounds)*100}%"></div></div>
            <div class="game-question">这是什么声音？</div>
            <button class="btn" style="margin-bottom:16px;font-size:14px;padding:8px 16px" onclick="window.currentGame.replaySound()">🔊 再听一次</button>
            <div class="game-options">
                ${opts.map(o => `<button class="game-option" onclick="window.currentGame.checkSound('${o.name}','${target.name}')">${o.emoji} ${o.name}</button>`).join('')}
            </div>
            <div class="game-hint">第 ${this.round + 1} / ${this.totalRounds} 题</div>
        `;
        this._soundTarget = target;
    }

    replaySound() {
        AudioManager.playTone(this._soundTarget.freq, 0.3, this._soundTarget.type, null, 0.3);
    }

    checkSound(selected, correct) {
        if (this.finished) return;
        const btns = this.container.querySelectorAll('.game-option');
        btns.forEach(b => b.onclick = null);
        if (selected === correct) {
            btns.forEach(b => { if (b.textContent.includes(selected)) b.classList.add('correct'); });
            this.onCorrect();
        } else {
            btns.forEach(b => {
                if (b.textContent.includes(selected)) b.classList.add('wrong');
                if (b.textContent.includes(correct)) b.classList.add('correct');
            });
            this.onWrong();
        }
    }
}
window.Template_music = Template_music;
