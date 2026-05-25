/* 排序分类模板 - 句子排序、字母排序等 */
class Template_sorting extends GameEngine {
    init() {
        this.items = this.shuffle(this.config.data).slice(0, this.totalRounds);
    }

    nextRound() {
        if (this.round >= this.items.length) { this.end(); return; }
        const item = this.items[this.round];
        const shuffled = this.shuffle([...item.items]);
        this._correct = item.items;
        this._userOrder = [];

        this.container.innerHTML = `
            <div class="game-progress"><div class="game-progress-bar" style="width:${(this.round/this.totalRounds)*100}%"></div></div>
            <div class="game-question">${item.question || item.prompt || '按正确顺序点击'}</div>
            <div class="sort-container" id="sortList">
                ${shuffled.map((s, i) => `<div class="sort-item" data-val="${s}" onclick="window.currentGame.selectSort(this)">${s}</div>`).join('')}
            </div>
            <div class="game-hint">第 ${this.round + 1} / ${this.totalRounds} 题 · 按顺序点击</div>
        `;
    }

    selectSort(el) {
        if (this.finished) return;
        AudioManager.click();
        el.style.opacity = '0.5';
        el.onclick = null;
        this._userOrder.push(el.dataset.val);

        if (this._userOrder.length === this._correct.length) {
            const correct = this._userOrder.every((v, i) => v === this._correct[i]);
            if (correct) {
                this.container.querySelectorAll('.sort-item').forEach(e => e.style.background = '#D4EDDA');
                this.onCorrect();
            } else {
                this.container.querySelectorAll('.sort-item').forEach(e => e.style.background = '#F8D7DA');
                this.onWrong();
            }
        }
    }
}
window.Template_sorting = Template_sorting;
