/* 语文文字模板 - 成语填字、古诗词、偏旁归类等 */
class Template_word extends GameEngine {
    init() {
        this.items = this.shuffle(this.config.data).slice(0, this.totalRounds);
    }

    nextRound() {
        if (this.round >= this.items.length) { this.end(); return; }
        const item = this.items[this.round];
        const mode = this.config.mode || 'fill';

        if (mode === 'fill') {
            this.renderFill(item);
        } else if (mode === 'radical') {
            this.renderRadical(item);
        } else if (mode === 'pinyin') {
            this.renderPinyin(item);
        } else if (mode === 'stroke') {
            this.renderStroke(item);
        }
    }

    renderFill(item) {
        // item: { question: "____高水长", options: ["山","水","风","云"], answer: 0 }
        this.container.innerHTML = `
            <div class="game-progress"><div class="game-progress-bar" style="width:${(this.round/this.totalRounds)*100}%"></div></div>
            <div class="game-question">${item.question}</div>
            <div class="game-options">
                ${item.options.map((o, i) => `<button class="game-option" onclick="window.currentGame.checkAnswer(${i},${item.answer})">${o}</button>`).join('')}
            </div>
            <div class="game-hint">第 ${this.round + 1} / ${this.totalRounds} 题</div>
        `;
    }

    renderRadical(item) {
        // 偏旁归类: { radical: "氵", words: ["河","海","江"], decoys: ["林","草"] }
        const all = this.shuffle([...item.words, ...item.decoys]);
        this.container.innerHTML = `
            <div class="game-progress"><div class="game-progress-bar" style="width:${(this.round/this.totalRounds)*100}%"></div></div>
            <div class="game-question">选出偏旁为「<span style="color:var(--pink);font-size:28px">${item.radical}</span>」的字</div>
            <div class="game-options">
                ${all.map((w, i) => {
                    const isCorrect = item.words.includes(w);
                    return `<button class="game-option" data-correct="${isCorrect}" onclick="window.currentGame.checkRadical(this,${isCorrect})">${w}</button>`;
                }).join('')}
            </div>
            <div class="game-hint">第 ${this.round + 1} / ${this.totalRounds} 题</div>
        `;
        this._radicalCorrectCount = item.words.length;
        this._radicalSelected = 0;
    }

    checkRadical(el, isCorrect) {
        if (this.finished) return;
        if (isCorrect) {
            el.classList.add('correct');
            el.onclick = null;
            this._radicalSelected++;
            AudioManager.click();
            if (this._radicalSelected >= this._radicalCorrectCount) {
                this.onCorrect();
            }
        } else {
            el.classList.add('wrong');
            this.onWrong();
        }
    }

    renderPinyin(item) {
        // { word: "你好", pinyin: "nǐ hǎo", options: [...] }
        this.container.innerHTML = `
            <div class="game-progress"><div class="game-progress-bar" style="width:${(this.round/this.totalRounds)*100}%"></div></div>
            <div class="game-question" style="font-size:36px">${item.word}</div>
            <div class="game-options">
                ${item.options.map((o, i) => `<button class="game-option" onclick="window.currentGame.checkAnswer(${i},${item.answer})">${o}</button>`).join('')}
            </div>
            <div class="game-hint">第 ${this.round + 1} / ${this.totalRounds} 题</div>
        `;
    }

    renderStroke(item) {
        // 笔顺: { word: "大", strokes: 3, options: [2,3,4,5], answer: 1 }
        this.container.innerHTML = `
            <div class="game-progress"><div class="game-progress-bar" style="width:${(this.round/this.totalRounds)*100}%"></div></div>
            <div class="game-question" style="font-size:48px">${item.word}</div>
            <div class="game-question" style="font-size:16px;margin-top:-10px">这个字有几画？</div>
            <div class="game-options">
                ${item.options.map((o, i) => `<button class="game-option" onclick="window.currentGame.checkAnswer(${i},${item.answer})">${o}画</button>`).join('')}
            </div>
            <div class="game-hint">第 ${this.round + 1} / ${this.totalRounds} 题</div>
        `;
    }

    checkAnswer(selected, correct) {
        if (this.finished) return;
        const btns = this.container.querySelectorAll('.game-option');
        btns.forEach(b => b.onclick = null);
        if (selected === correct) {
            btns[selected].classList.add('correct');
            this.onCorrect();
        } else {
            btns[selected].classList.add('wrong');
            btns[correct].classList.add('correct');
            this.onWrong();
        }
    }
}
window.Template_word = Template_word;
