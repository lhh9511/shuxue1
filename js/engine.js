/* 游戏引擎基类 - 所有游戏模板继承此类 */
class GameEngine {
    constructor(config, container) {
        this.config = config;
        this.container = container;
        this.score = 0;
        this.round = 0;
        this.totalRounds = config.rounds || 10;
        this.paused = false;
        this.finished = false;
        this.timer = 0;
        this.timerInterval = null;
        this.timeLimit = config.timeLimit || 0; // 0 = 无限
    }

    /* 开始游戏 */
    start() {
        this.init();
        document.getElementById('startScreen').style.display = 'none';
        document.getElementById('gameContent').style.display = 'flex';
        document.getElementById('endScreen').style.display = 'none';
        AudioManager.init();
        AudioManager.resume();
        AudioManager.startBGM();
        this.startTimer();
        this.nextRound();
    }

    /* 子类可覆盖的初始化 */
    init() {}

    /* 开始计时 */
    startTimer() {
        this.timer = 0;
        if (this.timeLimit > 0) {
            this.timer = this.timeLimit;
            this.timerInterval = setInterval(() => {
                if (this.paused) return;
                this.timer--;
                this.updateTimerDisplay();
                if (this.timer <= 5 && this.timer > 0) AudioManager.tick();
                if (this.timer <= 0) this.timeUp();
            }, 1000);
        } else {
            this.timerInterval = setInterval(() => {
                if (this.paused) return;
                this.timer++;
                this.updateTimerDisplay();
            }, 1000);
        }
    }

    /* 更新计时显示 */
    updateTimerDisplay() {
        const el = document.getElementById('timerDisplay');
        const m = Math.floor(this.timer / 60);
        const s = this.timer % 60;
        el.textContent = `⏱️ ${m}:${s.toString().padStart(2, '0')}`;
    }

    /* 更新分数显示 */
    updateScore() {
        document.getElementById('scoreDisplay').textContent = `⭐ ${this.score}`;
    }

    /* 下一轮 - 子类必须覆盖 */
    nextRound() {}

    /* 回答正确 */
    onCorrect(points) {
        this.score += (points || 10);
        this.updateScore();
        AudioManager.correct();
        this.round++;
        if (this.round >= this.totalRounds) {
            this.end();
        } else {
            setTimeout(() => this.nextRound(), 500);
        }
    }

    /* 回答错误 */
    onWrong() {
        AudioManager.wrong();
        this.round++;
        if (this.round >= this.totalRounds) {
            this.end();
        } else {
            setTimeout(() => this.nextRound(), 800);
        }
    }

    /* 时间到 */
    timeUp() {
        this.end();
    }

    /* 结束游戏 */
    end() {
        this.finished = true;
        this.stopTimer();
        AudioManager.stopBGM();

        const stars = this.getStars();
        const endScreen = document.getElementById('endScreen');
        const endEmoji = document.getElementById('endEmoji');
        const endTitle = document.getElementById('endTitle');
        const endScore = document.getElementById('endScore');
        const endStars = document.getElementById('endStars');

        if (stars >= 3) {
            endEmoji.textContent = '🏆';
            endTitle.textContent = '太棒了！';
            AudioManager.complete();
        } else if (stars >= 2) {
            endEmoji.textContent = '🎉';
            endTitle.textContent = '做得不错！';
            AudioManager.complete();
        } else {
            endEmoji.textContent = '💪';
            endTitle.textContent = '继续加油！';
            AudioManager.fail();
        }

        endScore.textContent = this.score + '分';
        endStars.textContent = '⭐'.repeat(stars) + '☆'.repeat(3 - stars);

        document.getElementById('gameContent').style.display = 'none';
        endScreen.style.display = 'flex';

        // 保存游玩记录
        this.saveRecord(stars);
    }

    /* 计算星级 */
    getStars() {
        const max = this.totalRounds * 10;
        const pct = this.score / max;
        if (pct >= 0.8) return 3;
        if (pct >= 0.5) return 2;
        return 1;
    }

    /* 暂停/继续 */
    togglePause() {
        this.paused = !this.paused;
        const overlay = document.getElementById('pauseOverlay');
        overlay.style.display = this.paused ? 'flex' : 'none';
    }

    /* 重新开始 */
    restart() {
        this.stopTimer();
        this.score = 0;
        this.round = 0;
        this.timer = 0;
        this.paused = false;
        this.finished = false;
        this.container.innerHTML = '';
        this.updateScore();
        document.getElementById('endScreen').style.display = 'none';
        document.getElementById('pauseOverlay').style.display = 'none';
        document.getElementById('startScreen').style.display = 'flex';
        document.getElementById('gameContent').style.display = 'none';
        AudioManager.stopBGM();
    }

    /* 停止计时 */
    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    /* 保存游玩记录 */
    saveRecord(stars) {
        try {
            const records = JSON.parse(localStorage.getItem('gameRecords') || '{}');
            records[this.config.id] = {
                score: this.score,
                stars: stars,
                time: Date.now()
            };
            localStorage.setItem('gameRecords', JSON.stringify(records));
        } catch(e) {}
    }

    /* 洗牌 */
    shuffle(arr) {
        const a = [...arr];
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }

    /* 随机整数 */
    rand(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    /* 显示提示 */
    showHint(text) {
        const hint = document.createElement('div');
        hint.className = 'game-hint';
        hint.textContent = text;
        this.container.appendChild(hint);
    }
}
window.GameEngine = GameEngine;
