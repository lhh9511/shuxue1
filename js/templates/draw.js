/* 涂色绘画模板 - 画板、涂色等 */
class Template_draw extends GameEngine {
    init() {
        this.mode = this.config.mode || 'free';
        this.colors = ['#FF6B6B','#FF8C42','#FFD93D','#6BCB77','#4ECDC4','#5B86E5','#A78BFA','#FF6B9D','#2D3436','#FFFFFF'];
    }

    nextRound() {
        if (this.mode === 'free') this.renderFreeDraw();
        else if (this.mode === 'coloring') this.renderColoring();
    }

    renderFreeDraw() {
        this.container.innerHTML = `
            <div class="game-question">🎨 自由画板</div>
            <canvas id="drawCanvas" class="draw-area" width="360" height="300"></canvas>
            <div class="color-palette">
                ${this.colors.map(c => `<div class="color-btn ${c === '#2D3436' ? 'active' : ''}" style="background:${c}" onclick="window.currentGame.setColor('${c}',this)"></div>`).join('')}
            </div>
            <div style="display:flex;gap:8px;margin-top:10px">
                <button class="btn btn-secondary" style="font-size:13px;padding:6px 14px" onclick="window.currentGame.clearCanvas()">清空</button>
                <select onchange="window.currentGame.setBrush(this.value)" style="padding:6px;border-radius:8px;border:2px solid #eee">
                    <option value="3">细笔</option>
                    <option value="6" selected>中笔</option>
                    <option value="12">粗笔</option>
                    <option value="20">超粗</option>
                </select>
            </div>
        `;

        const canvas = document.getElementById('drawCanvas');
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        this._ctx = ctx;
        this._drawing = false;
        this._color = '#2D3436';
        this._brushSize = 6;

        canvas.addEventListener('pointerdown', e => this.startDraw(e));
        canvas.addEventListener('pointermove', e => this.draw(e));
        canvas.addEventListener('pointerup', () => this._drawing = false);
        canvas.addEventListener('pointerleave', () => this._drawing = false);
    }

    startDraw(e) {
        this._drawing = true;
        const rect = e.target.getBoundingClientRect();
        this._ctx.beginPath();
        this._ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    }

    draw(e) {
        if (!this._drawing) return;
        const rect = e.target.getBoundingClientRect();
        this._ctx.lineWidth = this._brushSize;
        this._ctx.lineCap = 'round';
        this._ctx.strokeStyle = this._color;
        this._ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
        this._ctx.stroke();
    }

    setColor(color, el) {
        this._color = color;
        this.container.querySelectorAll('.color-btn').forEach(b => b.classList.remove('active'));
        el.classList.add('active');
        AudioManager.click();
    }

    setBrush(size) {
        this._brushSize = parseInt(size);
    }

    clearCanvas() {
        this._ctx.fillStyle = '#FFFFFF';
        this._ctx.fillRect(0, 0, 360, 300);
        AudioManager.click();
    }

    renderColoring() {
        // 简化涂色：选择区域填色
        const shapes = [
            { name: '太阳', emoji: '☀️' },
            { name: '花朵', emoji: '🌸' },
            { name: '房子', emoji: '🏠' },
            { name: '小猫', emoji: '🐱' },
        ];
        this.container.innerHTML = `
            <div class="game-question">🎨 选择颜色涂色</div>
            <div style="font-size:120px;text-align:center" id="coloringTarget">${this.config.targetEmoji || shapes[this.rand(0,3)].emoji}</div>
            <div class="color-palette">
                ${this.colors.map(c => `<div class="color-btn" style="background:${c}" onclick="window.currentGame.paintEmoji('${c}')"></div>`).join('')}
            </div>
            <div class="game-hint">选择颜色给图案上色</div>
        `;
    }

    paintEmoji(color) {
        AudioManager.click();
        const target = document.getElementById('coloringTarget');
        if (target) {
            target.style.filter = `hue-rotate(${Math.random() * 360}deg) saturate(2)`;
            target.style.textShadow = `0 0 20px ${color}, 0 0 40px ${color}`;
        }
    }
}
window.Template_draw = Template_draw;
