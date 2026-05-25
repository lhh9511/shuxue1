/* 点击反应模板 - 打地鼠、接水果等 */
class Template_click extends GameEngine {
    init() {
        this.hits = 0;
        this.misses = 0;
        this.targetCount = this.config.targetCount || 20;
    }

    nextRound() {
        this.hits = 0;
        this.misses = 0;
        this.container.innerHTML = `
            <div class="game-progress"><div class="game-progress-bar" style="width:0%"></div></div>
            <div class="reaction-area" id="reactionArea">
                <div style="display:flex;align-items:center;justify-content:center;height:100%;color:#ccc;font-size:18px">准备中...</div>
            </div>
            <div class="game-hint" id="clickHint">点击 ${this.config.targetEmoji || '🎯'} 得分！目标：${this.targetCount}个</div>
        `;
        setTimeout(() => this.spawnTarget(), 1000);
    }

    spawnTarget() {
        if (this.finished || this.paused) return;
        if (this.hits >= this.targetCount) {
            this.end();
            return;
        }

        const area = document.getElementById('reactionArea');
        if (!area) return;
        area.innerHTML = '';

        const emoji = this.config.targetEmoji || '🐹';
        const count = this.rand(1, 3);
        const decoys = this.config.decoyEmojis || ['🌿', '🌸', '🍄'];

        for (let i = 0; i < count; i++) {
            const target = document.createElement('div');
            target.className = 'reaction-target';
            target.textContent = emoji;
            target.style.left = this.rand(10, 80) + '%';
            target.style.top = this.rand(10, 80) + '%';
            target.onclick = () => {
                this.hits++;
                this.score += 10;
                this.updateScore();
                AudioManager.hit();
                target.remove();
                const pct = (this.hits / this.targetCount) * 100;
                const bar = this.container.querySelector('.game-progress-bar');
                if (bar) bar.style.width = pct + '%';
                const hint = document.getElementById('clickHint');
                if (hint) hint.textContent = `已点击：${this.hits}/${this.targetCount}`;
                setTimeout(() => this.spawnTarget(), 300);
            };
            area.appendChild(target);
        }

        // 添加干扰项
        if (this.config.decoyEmojis) {
            for (let i = 0; i < 2; i++) {
                const decoy = document.createElement('div');
                decoy.className = 'reaction-target';
                decoy.textContent = decoys[this.rand(0, decoys.length - 1)];
                decoy.style.left = this.rand(10, 80) + '%';
                decoy.style.top = this.rand(10, 80) + '%';
                decoy.onclick = () => {
                    this.misses++;
                    this.score = Math.max(0, this.score - 5);
                    this.updateScore();
                    AudioManager.wrong();
                    decoy.remove();
                };
                area.appendChild(decoy);
            }
        }

        // 目标自动消失
        setTimeout(() => {
            if (!this.finished) {
                area.querySelectorAll('.reaction-target').forEach(t => {
                    if (t.textContent === (this.config.targetEmoji || '🐹')) {
                        // 未点击的目标消失
                    }
                });
                this.spawnTarget();
            }
        }, 2500);
    }
}
window.Template_click = Template_click;
