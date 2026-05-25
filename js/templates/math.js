/* 数学计算模板 - 加减乘除、比大小等 */
class Template_math extends GameEngine {
    init() {
        this.generator = this.config.generator || 'add';
    }

    nextRound() {
        const q = this.generateQuestion();
        if (this.config.mode === 'compare') {
            this.renderCompare(q);
        } else if (this.config.mode === 'fill') {
            this.renderFill(q);
        } else {
            this.renderCalc(q);
        }
    }

    generateQuestion() {
        const g = this.generator;
        const max = this.config.maxNum || 20;
        let a, b, op, answer;

        if (g === 'add') {
            a = this.rand(1, max); b = this.rand(1, max);
            op = '+'; answer = a + b;
        } else if (g === 'sub') {
            a = this.rand(1, max); b = this.rand(1, a);
            op = '-'; answer = a - b;
        } else if (g === 'mul') {
            a = this.rand(1, 9); b = this.rand(1, 9);
            op = '×'; answer = a * b;
        } else if (g === 'div') {
            b = this.rand(1, 9); answer = this.rand(1, 9);
            a = b * answer; op = '÷';
        } else if (g === 'mix') {
            const ops = ['add', 'sub', 'mul'];
            this.generator = ops[this.rand(0, 2)];
            const q = this.generateQuestion();
            this.generator = 'mix';
            return q;
        } else if (g === 'compare') {
            a = this.rand(1, max); b = this.rand(1, max);
            return { a, b, answer: a > b ? '>' : (a < b ? '<' : '=') };
        } else if (g === 'ten') {
            a = this.rand(1, 9); b = 10 - a;
            return { a, b: '?', answer: b, display: `${a} + ? = 10` };
        } else if (g === 'money') {
            const items = [
                {q:'1元2角 + 5角 = ?', a:'1元7角', opts:['1元5角','1元7角','2元','1元2角']},
                {q:'3元 - 1元5角 = ?', a:'1元5角', opts:['1元5角','2元5角','1元','2元']},
                {q:'5角 + 5角 = ?', a:'1元', opts:['1元','10角','5角','1元5角']},
                {q:'2元 - 8角 = ?', a:'1元2角', opts:['1元2角','1元8角','2元8角','8角']},
                {q:'1元 - 3角 = ?', a:'7角', opts:['7角','3角','1元3角','8角']},
            ];
            const item = items[this.rand(0, items.length - 1)];
            return item;
        } else if (g === 'clock') {
            const h = this.rand(1, 12);
            const m = [0, 15, 30, 45][this.rand(0, 3)];
            const mStr = m === 0 ? '00' : String(m);
            const answer = `${h}:${mStr}`;
            const opts = [];
            opts.push(answer);
            while (opts.length < 4) {
                const rh = this.rand(1, 12);
                const rm = [0, 15, 30, 45][this.rand(0, 3)];
                const rmStr = rm === 0 ? '00' : String(rm);
                const t = `${rh}:${rmStr}`;
                if (!opts.includes(t)) opts.push(t);
            }
            return { display: `🕐 时钟显示 ${h}点${m === 0 ? '整' : m + '分'}`, answer, options: this.shuffle(opts) };
        } else if (g === 'fraction') {
            // 分数比大小 - 简化为图示
            const n1 = this.rand(1, 5), d1 = this.rand(n1 + 1, 8);
            const n2 = this.rand(1, 5), d2 = this.rand(n2 + 1, 8);
            const v1 = n1 / d1, v2 = n2 / d2;
            return { a: `${n1}/${d1}`, b: `${n2}/${d2}`, answer: v1 > v2 ? '>' : (v1 < v2 ? '<' : '=') };
        } else if (g === 'shape') {
            // 图形计数
            const shapes = ['○', '□', '△', '☆', '◇'];
            const counts = shapes.map(() => this.rand(1, 5));
            const total = counts.reduce((a, b) => a + b, 0);
            const targetIdx = this.rand(0, 4);
            const display = shapes.map((s, i) => s.repeat(counts[i])).join(' ');
            return { display: `数一数有几个 ${shapes[targetIdx]}：${display}`, answer: counts[targetIdx],
                options: this.shuffle([counts[targetIdx], counts[targetIdx]+1, counts[targetIdx]-1 || 1, this.rand(1,6)].filter((v,i,a) => a.indexOf(v)===i).slice(0,4)) };
        }

        return { display: `${a} ${op} ${b}`, answer, options: this.generateOptions(answer) };
    }

    generateOptions(answer) {
        const opts = new Set([answer]);
        while (opts.size < 4) {
            const offset = this.rand(1, Math.max(3, Math.floor(answer * 0.3)));
            opts.add(answer + (Math.random() > 0.5 ? offset : -offset));
        }
        return this.shuffle([...opts].map(String));
    }

    renderCalc(q) {
        if (q.q) { // 应用题/特殊题
            this.container.innerHTML = `
                <div class="game-progress"><div class="game-progress-bar" style="width:${(this.round/this.totalRounds)*100}%"></div></div>
                <div class="game-question">${q.q}</div>
                <div class="game-options">
                    ${q.opts.map((o, i) => `<button class="game-option" onclick="window.currentGame.checkAnswer('${o}','${q.a}')">${o}</button>`).join('')}
                </div>
                <div class="game-hint">第 ${this.round + 1} / ${this.totalRounds} 题</div>
            `;
            return;
        }
        if (q.options) {
            this.container.innerHTML = `
                <div class="game-progress"><div class="game-progress-bar" style="width:${(this.round/this.totalRounds)*100}%"></div></div>
                <div class="game-question">${q.display}</div>
                <div class="game-options">
                    ${q.options.map(o => `<button class="game-option" onclick="window.currentGame.checkAnswer('${o}','${q.answer}')">${o}</button>`).join('')}
                </div>
                <div class="game-hint">第 ${this.round + 1} / ${this.totalRounds} 题</div>
            `;
            return;
        }
        const answer = q.answer;
        this.container.innerHTML = `
            <div class="game-progress"><div class="game-progress-bar" style="width:${(this.round/this.totalRounds)*100}%"></div></div>
            <div class="math-display">${q.display} = ?</div>
            <div class="game-options">
                ${q.options.map(o => `<button class="game-option" onclick="window.currentGame.checkAnswer('${o}','${answer}')">${o}</button>`).join('')}
            </div>
            <div class="game-hint">第 ${this.round + 1} / ${this.totalRounds} 题</div>
        `;
    }

    renderCompare(q) {
        this.container.innerHTML = `
            <div class="game-progress"><div class="game-progress-bar" style="width:${(this.round/this.totalRounds)*100}%"></div></div>
            <div class="math-display">${q.a} <span style="color:var(--pink)">？</span> ${q.b}</div>
            <div class="game-options">
                ${['>', '<', '='].map(o => `<button class="game-option" onclick="window.currentGame.checkAnswer('${o}','${q.answer}')">${o}</button>`).join('')}
            </div>
            <div class="game-hint">第 ${this.round + 1} / ${this.totalRounds} 题</div>
        `;
    }

    renderFill(q) {
        this.container.innerHTML = `
            <div class="game-progress"><div class="game-progress-bar" style="width:${(this.round/this.totalRounds)*100}%"></div></div>
            <div class="math-display">${q.display}</div>
            <div class="game-options">
                ${q.options.map(o => `<button class="game-option" onclick="window.currentGame.checkAnswer('${o}','${String(q.answer)}')">${o}</button>`).join('')}
            </div>
            <div class="game-hint">第 ${this.round + 1} / ${this.totalRounds} 题</div>
        `;
    }

    checkAnswer(selected, correct) {
        if (this.finished) return;
        const btns = this.container.querySelectorAll('.game-option');
        btns.forEach(b => b.onclick = null);
        if (selected === correct) {
            btns.forEach(b => { if (b.textContent === selected) b.classList.add('correct'); });
            this.onCorrect();
        } else {
            btns.forEach(b => {
                if (b.textContent === selected) b.classList.add('wrong');
                if (b.textContent === correct) b.classList.add('correct');
            });
            this.onWrong();
        }
    }
}
window.Template_math = Template_math;
