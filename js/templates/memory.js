/* 翻牌记忆模板 - 翻牌配对、记忆闪现等 */
class Template_memory extends GameEngine {
    init() {
        this.cards = [];
        this.flipped = [];
        this.matched = 0;
        this.totalPairs = this.config.pairs || 6;
        this.moves = 0;
        this.flashMode = this.config.flash || false;
    }

    nextRound() {
        if (this.flashMode) {
            this.flashRound();
        } else {
            this.matchRound();
        }
    }

    matchRound() {
        const pairs = this.config.data.slice(0, this.totalPairs);
        const cards = this.shuffle([...pairs, ...pairs]);
        this.cards = cards;
        this.flipped = [];
        this.matched = 0;
        this.moves = 0;

        const cols = cards.length <= 12 ? 4 : (cards.length <= 20 ? 5 : 6);
        this.container.innerHTML = `
            <div class="game-progress"><div class="game-progress-bar" style="width:0%"></div></div>
            <div class="memory-grid" style="grid-template-columns:repeat(${cols},1fr)">
                ${cards.map((c, i) => `<div class="memory-card" data-idx="${i}" onclick="window.currentGame.flipCard(${i})">?</div>`).join('')}
            </div>
            <div class="game-hint">翻牌找出配对！已配对：0/${this.totalPairs}</div>
        `;
    }

    flipCard(idx) {
        if (this.finished || this.paused) return;
        const card = this.container.querySelectorAll('.memory-card')[idx];
        if (!card || card.classList.contains('flipped') || card.classList.contains('matched')) return;
        if (this.flipped.length >= 2) return;

        card.classList.add('flipped');
        card.textContent = this.cards[idx];
        AudioManager.flip();
        this.flipped.push(idx);

        if (this.flipped.length === 2) {
            this.moves++;
            const [a, b] = this.flipped;
            if (this.cards[a] === this.cards[b]) {
                const cards = this.container.querySelectorAll('.memory-card');
                setTimeout(() => {
                    cards[a].classList.add('matched');
                    cards[b].classList.add('matched');
                    AudioManager.match();
                    this.matched++;
                    this.score += Math.max(5, 15 - this.moves);
                    this.updateScore();
                    const pct = (this.matched / this.totalPairs) * 100;
                    this.container.querySelector('.game-progress-bar').style.width = pct + '%';
                    this.container.querySelector('.game-hint').textContent = `已配对：${this.matched}/${this.totalPairs}`;
                    this.flipped = [];
                    if (this.matched >= this.totalPairs) {
                        this.round++;
                        setTimeout(() => this.end(), 500);
                    }
                }, 300);
            } else {
                const cards = this.container.querySelectorAll('.memory-card');
                setTimeout(() => {
                    cards[a].classList.remove('flipped');
                    cards[a].textContent = '?';
                    cards[b].classList.remove('flipped');
                    cards[b].textContent = '?';
                    this.flipped = [];
                }, 800);
            }
        }
    }

    flashRound() {
        // 记忆闪现模式：展示一组序列，然后让用户回忆
        const items = this.config.data;
        const seq = [];
        const seqLen = Math.min(3 + this.round, 8);
        for (let i = 0; i < seqLen; i++) {
            seq.push(items[this.rand(0, items.length - 1)]);
        }

        this.container.innerHTML = `
            <div class="game-progress"><div class="game-progress-bar" style="width:${(this.round/this.totalRounds)*100}%"></div></div>
            <div class="game-question" id="flashDisplay">👀 仔细看！</div>
            <div class="game-options" id="flashOptions" style="display:none">
                ${items.slice(0, 4).map((item, i) => `<button class="game-option" onclick="window.currentGame.flashCheck(${i})">${item}</button>`).join('')}
            </div>
            <div class="game-hint">第 ${this.round + 1} / ${this.totalRounds} 轮</div>
        `;

        // 展示序列
        const display = document.getElementById('flashDisplay');
        let showIdx = 0;
        const showNext = () => {
            if (showIdx < seq.length) {
                display.textContent = seq[showIdx];
                AudioManager.click();
                showIdx++;
                setTimeout(showNext, 800);
            } else {
                display.textContent = '刚才的顺序是？';
                this.container.querySelectorAll('.game-option').forEach(btn => btn.style.display = '');
                document.getElementById('flashOptions').style.display = '';
                // 这里简化为判断第一个元素
                this._flashSeq = seq;
                this._flashTarget = 0;
                const optBtns = this.container.querySelectorAll('.game-option');
                const items4 = this.shuffle(items).slice(0, 4);
                if (!items4.includes(seq[0])) items4[0] = seq[0];
                items4.forEach((item, i) => {
                    optBtns[i].textContent = item;
                    optBtns[i].onclick = () => this.flashCheckExt(item);
                });
            }
        };
        setTimeout(showNext, 500);
    }

    flashCheckExt(answer) {
        if (this.finished) return;
        if (answer === this._flashSeq[this._flashTarget]) {
            this.onCorrect();
        } else {
            this.onWrong();
        }
    }
}
window.Template_memory = Template_memory;
