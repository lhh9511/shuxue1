/* 连线配对模板 - 近义词、反义词、中英文等 */
class Template_matching extends GameEngine {
    init() {
        this.selectedLeft = null;
        this.pairs = this.shuffle(this.config.data).slice(0, this.totalRounds);
        this.currentPairs = [];
    }

    nextRound() {
        if (this.round >= this.pairs.length) { this.end(); return; }
        // 每轮展示4对，选其中1对作为当前题
        const p = this.pairs[this.round];
        const allPairs = this.shuffle(this.config.data).slice(0, 4);
        if (!allPairs.find(x => x[0] === p[0])) allPairs[0] = p;

        const left = this.shuffle(allPairs.map(x => x[0]));
        const right = this.shuffle(allPairs.map(x => x[1]));

        this.container.innerHTML = `
            <div class="game-progress"><div class="game-progress-bar" style="width:${(this.round/this.totalRounds)*100}%"></div></div>
            <div class="game-question">${this.config.prompt || '找出正确的配对'}</div>
            <div class="match-container">
                <div class="match-column" id="leftCol">
                    ${left.map((l, i) => `<div class="match-item" data-val="${l}" data-side="left" onclick="window.currentGame.selectItem(this,'left')">${l}</div>`).join('')}
                </div>
                <div class="match-column" id="rightCol">
                    ${right.map((r, i) => `<div class="match-item" data-val="${r}" data-side="right" onclick="window.currentGame.selectItem(this,'right')">${r}</div>`).join('')}
                </div>
            </div>
            <div class="game-hint">第 ${this.round + 1} / ${this.totalRounds} 题 · 先点左边再点右边</div>
        `;
        this._currentPairs = allPairs;
        this.selectedLeft = null;
    }

    selectItem(el, side) {
        if (this.finished) return;
        AudioManager.click();

        if (side === 'left') {
            document.querySelectorAll('#leftCol .match-item').forEach(e => e.classList.remove('selected'));
            el.classList.add('selected');
            this.selectedLeft = el.dataset.val;
        } else if (side === 'right' && this.selectedLeft) {
            const rightVal = el.dataset.val;
            const pair = this._currentPairs.find(p => p[0] === this.selectedLeft && p[1] === rightVal);
            if (pair) {
                el.classList.add('matched');
                const leftEl = document.querySelector('#leftCol .match-item.selected');
                leftEl.classList.remove('selected');
                leftEl.classList.add('matched');
                this.onCorrect();
            } else {
                el.classList.add('wrong');
                setTimeout(() => el.classList.remove('wrong'), 500);
                const leftEl = document.querySelector('#leftCol .match-item.selected');
                leftEl.classList.add('wrong');
                setTimeout(() => leftEl.classList.remove('wrong', 'selected'), 500);
                this.onWrong();
            }
            this.selectedLeft = null;
        }
    }
}
window.Template_matching = Template_matching;
