/* 答题模板 - 用于各种选择题、判断题 */
class Template_quiz extends GameEngine {
    init() {
        this.questions = this.shuffle(this.config.data).slice(0, this.totalRounds);
    }

    nextRound() {
        if (this.round >= this.questions.length) { this.end(); return; }
        const q = this.questions[this.round];
        this.container.innerHTML = `
            <div class="game-progress"><div class="game-progress-bar" style="width:${(this.round/this.totalRounds)*100}%"></div></div>
            <div class="game-question">${q.question}</div>
            <div class="game-options">
                ${q.options.map((o, i) => `<button class="game-option" data-idx="${i}" onclick="window.currentGame.checkAnswer(${i},${q.answer})">${o}</button>`).join('')}
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
window.Template_quiz = Template_quiz;
