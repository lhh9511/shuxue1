/* 拼图解谜模板 - 迷宫、数独、拼图等 */
class Template_puzzle extends GameEngine {
    init() {
        this.mode = this.config.mode || 'sudoku';
    }

    nextRound() {
        if (this.mode === 'sudoku') this.renderSudoku();
        else if (this.mode === 'maze') this.renderMaze();
        else if (this.mode === 'pattern') this.renderPattern();
        else if (this.mode === 'finddiff') this.renderFindDiff();
        else if (this.mode === 'tangram') this.renderTangram();
        else if (this.mode === 'maze_run') this.renderMazeRun();
    }

    renderSudoku() {
        const size = this.config.size || 4;
        // 生成简化数独
        const board = this.generateSudoku(size);
        const puzzle = board.map(row => row.map(v => Math.random() > 0.4 ? v : 0));

        this.container.innerHTML = `
            <div class="game-question">${size}×${size} 数独</div>
            <div id="sudokuBoard" style="display:grid;grid-template-columns:repeat(${size},1fr);gap:2px;max-width:${size*60}px;margin:0 auto">
                ${puzzle.flat().map((v, i) => {
                    if (v === 0) {
                        return `<input type="number" min="1" max="${size}" style="width:50px;height:50px;text-align:center;font-size:20px;border:2px solid #eee;border-radius:8px" data-solution="${board[Math.floor(i/size)][i%size]}">`;
                    }
                    return `<div style="width:50px;height:50px;display:flex;align-items:center;justify-content:center;font-size:20px;font-weight:700;background:#FFF0F3;border-radius:8px">${v}</div>`;
                }).join('')}
            </div>
            <button class="btn" style="margin-top:12px" onclick="window.currentGame.checkSudoku()">检查答案 ✓</button>
        `;
    }

    generateSudoku(size) {
        const board = [];
        for (let i = 0; i < size; i++) {
            const row = [];
            for (let j = 0; j < size; j++) {
                row.push((i * 1 + j) % size + 1);
            }
            board.push(row);
        }
        return board;
    }

    checkSudoku() {
        const inputs = this.container.querySelectorAll('input');
        let allCorrect = true;
        inputs.forEach(input => {
            if (parseInt(input.value) === parseInt(input.dataset.solution)) {
                input.style.borderColor = '#6BCB77';
                input.style.background = '#D4EDDA';
            } else {
                input.style.borderColor = '#FF6B6B';
                input.style.background = '#F8D7DA';
                allCorrect = false;
            }
        });
        if (allCorrect) this.onCorrect(20);
        else this.onWrong();
    }

    renderMaze() {
        // 简化迷宫 - 方向选择
        const paths = [
            { scene: '🏔️ 山脚下', choices: ['走左边小路 🌿', '走右边大路 🛤️', '过小桥 🌉'], correct: 2, result: '你找到了一条清澈的小溪！' },
            { scene: '🌲 森林里', choices: ['跟着蝴蝶 🦋', '跟着脚印 🐾', '往高处走 ⬆️'], correct: 0, result: '蝴蝶带你找到了花丛！' },
            { scene: '🏠 小屋前', choices: ['敲门 🚪', '绕到后面 🔄', '找窗户看 🪟'], correct: 0, result: '友善的爷爷给了你地图！' },
            { scene: '🌊 河边', choices: ['游泳过去 🏊', '找石头跳 🪨', '沿着河走 🚶'], correct: 2, result: '你发现了过河的桥！' },
            { scene: '🌟 山顶', choices: ['看风景 👀', '找宝藏 💎', '喊朋友 📢'], correct: 1, result: '你找到了传说中的宝藏！' },
        ];

        const mazeStep = this.round % paths.length;
        const p = paths[mazeStep];

        this.container.innerHTML = `
            <div class="game-progress"><div class="game-progress-bar" style="width:${(this.round/this.totalRounds)*100}%"></div></div>
            <div class="game-question">${p.scene}</div>
            <div class="game-options">
                ${p.choices.map((c, i) => `<button class="game-option" onclick="window.currentGame.mazeChoice(${i},${p.correct})">${c}</button>`).join('')}
            </div>
            <div class="game-hint">第 ${this.round + 1} / ${this.totalRounds} 步</div>
        `;
    }

    mazeChoice(selected, correct) {
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

    renderPattern() {
        // 图形规律推理
        const patterns = [
            { seq: ['🔴','🔵','🔴','🔵','🔴','?'], answer: '🔵', opts: ['🔴','🔵','🟢','🟡'] },
            { seq: ['⬆️','➡️','⬇️','⬅️','⬆️','?'], answer: '➡️', opts: ['⬆️','➡️','⬇️','⬅️'] },
            { seq: ['1️⃣','2️⃣','4️⃣','8️⃣','?'], answer: '1️⃣6️⃣', opts: ['1️⃣0️⃣','1️⃣2️⃣','1️⃣6️⃣','2️⃣0️⃣'] },
            { seq: ['🌙','⭐','🌙','⭐','🌙','?'], answer: '⭐', opts: ['🌙','⭐','☀️','🌈'] },
            { seq: ['1','1','2','3','5','?'], answer: '8', opts: ['6','7','8','9'] },
            { seq: ['🍎','🍊','🍎','🍊','🍎','?'], answer: '🍊', opts: ['🍎','🍊','🍋','🍇'] },
            { seq: ['△','○','△','○','△','?'], answer: '○', opts: ['△','○','□','☆'] },
            { seq: ['2','4','6','8','?'], answer: '10', opts: ['9','10','11','12'] },
        ];
        const p = patterns[this.round % patterns.length];
        this.container.innerHTML = `
            <div class="game-progress"><div class="game-progress-bar" style="width:${(this.round/this.totalRounds)*100}%"></div></div>
            <div class="game-question">找出规律，?是什么？</div>
            <div class="math-display" style="font-size:28px">${p.seq.join(' ')}</div>
            <div class="game-options">
                ${p.opts.map(o => `<button class="game-option" onclick="window.currentGame.checkPattern('${o}','${p.answer}')">${o}</button>`).join('')}
            </div>
        `;
    }

    checkPattern(selected, correct) {
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

    renderFindDiff() {
        // 找不同 - 展示两组emoji，找出不同的那个
        const emojis = ['🐶','🐱','🐰','🐻','🐼','🐨','🦊','🐸','🐵','🦁'];
        const base = this.rand(0, emojis.length - 1);
        const baseEmoji = emojis[base];
        const diffEmoji = emojis[(base + this.rand(1, 5)) % emojis.length];
        const diffPos = this.rand(0, 5);

        const row1 = Array(6).fill(baseEmoji);
        const row2 = [...row1];
        row2[diffPos] = diffEmoji;

        this.container.innerHTML = `
            <div class="game-progress"><div class="game-progress-bar" style="width:${(this.round/this.totalRounds)*100}%"></div></div>
            <div class="game-question">找不同！哪个位置不一样？</div>
            <div style="margin:16px 0">
                <div style="display:flex;gap:8px;justify-content:center;font-size:36px">
                    ${row1.map(e => `<span>${e}</span>`).join('')}
                </div>
                <div style="display:flex;gap:8px;justify-content:center;font-size:36px;margin-top:8px">
                    ${row2.map((e, i) => `<span class="game-option" style="width:50px;height:50px;display:flex;align-items:center;justify-content:center;font-size:32px;padding:0;cursor:pointer" onclick="window.currentGame.checkDiff(${i},${diffPos})">${e}</span>`).join('')}
                </div>
            </div>
            <div class="game-hint">第 ${this.round + 1} / ${this.totalRounds} 题</div>
        `;
    }

    checkDiff(selected, correct) {
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

    renderTangram() {
        // 简化七巧板 - 选择正确拼法
        const pieces = [
            { shape: '三角形 △', options: ['拼成正方形 □','拼成三角形 △','拼成圆形 ○','拼成菱形 ◇'], correct: 1 },
            { shape: '正方形 □ + 三角形 △', options: ['拼成房子 🏠','拼成船 ⛵','拼成树 🌲','拼成人 🧑'], correct: 0 },
            { shape: '两个三角形 △△', options: ['拼成正方形 □','拼成圆形 ○','拼成长方形 ▭','拼成星形 ☆'], correct: 0 },
        ];
        const p = pieces[this.round % pieces.length];
        this.container.innerHTML = `
            <div class="game-progress"><div class="game-progress-bar" style="width:${(this.round/this.totalRounds)*100}%"></div></div>
            <div class="game-question">用 ${p.shape} 可以拼成什么？</div>
            <div class="game-options">
                ${p.options.map((o, i) => `<button class="game-option" onclick="window.currentGame.mazeChoice(${i},${p.correct})">${o}</button>`).join('')}
            </div>
        `;
    }

    renderMazeRun() {
        // 简化华容道 - 滑块拼图 (3x3)
        const goal = [1,2,3,4,5,6,7,8,0];
        let board = [...goal];
        // 打乱
        for (let i = 0; i < 50; i++) {
            const emptyIdx = board.indexOf(0);
            const neighbors = [];
            if (emptyIdx % 3 > 0) neighbors.push(emptyIdx - 1);
            if (emptyIdx % 3 < 2) neighbors.push(emptyIdx + 1);
            if (emptyIdx > 2) neighbors.push(emptyIdx - 3);
            if (emptyIdx < 6) neighbors.push(emptyIdx + 3);
            const swap = neighbors[this.rand(0, neighbors.length - 1)];
            [board[emptyIdx], board[swap]] = [board[swap], board[emptyIdx]];
        }
        this._mazeBoard = board;
        this._mazeMoves = 0;

        this.renderMazeBoard();
    }

    renderMazeBoard() {
        const board = this._mazeBoard;
        this.container.innerHTML = `
            <div class="game-question">华容道 - 滑动数字到正确位置</div>
            <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:4px;max-width:200px;margin:0 auto">
                ${board.map((v, i) => {
                    if (v === 0) return `<div style="width:60px;height:60px;border-radius:10px;background:#eee"></div>`;
                    return `<button class="game-option" style="width:60px;height:60px;font-size:24px;padding:0" onclick="window.currentGame.slideTile(${i})">${v}</button>`;
                }).join('')}
            </div>
            <div class="game-hint">移动次数：${this._mazeMoves}</div>
        `;
    }

    slideTile(idx) {
        const board = this._mazeBoard;
        const emptyIdx = board.indexOf(0);
        const neighbors = [];
        if (emptyIdx % 3 > 0) neighbors.push(emptyIdx - 1);
        if (emptyIdx % 3 < 2) neighbors.push(emptyIdx + 1);
        if (emptyIdx > 2) neighbors.push(emptyIdx - 3);
        if (emptyIdx < 6) neighbors.push(emptyIdx + 3);

        if (neighbors.includes(idx)) {
            [board[emptyIdx], board[idx]] = [board[idx], board[emptyIdx]];
            this._mazeMoves++;
            AudioManager.click();
            this.renderMazeBoard();

            // 检查是否完成
            const goal = [1,2,3,4,5,6,7,8,0];
            if (board.every((v, i) => v === goal[i])) {
                this.onCorrect(20);
            }
        }
    }
}
window.Template_puzzle = Template_puzzle;
