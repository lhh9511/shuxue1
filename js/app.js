/* 主页逻辑 - 游戏列表、分类、搜索 */
(function() {
    let currentCat = 'all';
    let showFavOnly = false;

    function init() {
        renderGames();
        bindEvents();
        loadRecent();
        checkSoundPref();
    }

    function renderGames(filter) {
        const grid = document.getElementById('gameGrid');
        const empty = document.getElementById('emptyState');
        const search = (document.getElementById('searchInput').value || '').trim().toLowerCase();
        let games = Object.values(GAMES);

        if (currentCat !== 'all') {
            games = games.filter(g => g.category === currentCat);
        }

        if (search) {
            games = games.filter(g =>
                g.name.toLowerCase().includes(search) ||
                g.description.toLowerCase().includes(search)
            );
        }

        if (showFavOnly) {
            const favs = getFavorites();
            games = games.filter(g => favs.includes(g.id));
        }

        if (games.length === 0) {
            grid.innerHTML = '';
            empty.style.display = 'block';
            return;
        }

        empty.style.display = 'none';
        grid.innerHTML = games.map((g, i) => {
            const favs = getFavorites();
            const isFav = favs.includes(g.id);
            return `<div class="game-card" data-cat="${g.category}" data-id="${g.id}"
                         onclick="playGame('${g.id}')" style="animation-delay:${i * 30}ms">
                <span class="card-fav ${isFav ? 'active' : ''}"
                      onclick="event.stopPropagation();toggleFav('${g.id}',this)">⭐</span>
                <span class="card-icon">${g.icon}</span>
                <div class="card-name">${g.name}</div>
                <span class="card-cat">${getCatName(g.category)}</span>
            </div>`;
        }).join('');
    }

    function bindEvents() {
        // 分类按钮
        document.getElementById('categoryBar').addEventListener('click', e => {
            const btn = e.target.closest('.cat-btn');
            if (!btn) return;
            document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentCat = btn.dataset.cat;
            renderGames();
            AudioManager.init();
            AudioManager.click();
        });

        // 搜索
        const input = document.getElementById('searchInput');
        const clearBtn = document.getElementById('clearSearch');
        input.addEventListener('input', () => {
            clearBtn.style.display = input.value ? 'block' : 'none';
            renderGames();
        });

        clearBtn.addEventListener('click', () => {
            input.value = '';
            clearBtn.style.display = 'none';
            renderGames();
        });

        // 音效开关
        document.getElementById('soundToggle').addEventListener('click', () => {
            AudioManager.init();
            const on = AudioManager.toggle();
            document.getElementById('soundToggle').textContent = on ? '🔊' : '🔇';
            localStorage.setItem('soundEnabled', on);
        });

        // 收藏开关
        document.getElementById('favToggle').addEventListener('click', () => {
            showFavOnly = !showFavOnly;
            document.getElementById('favToggle').textContent = showFavOnly ? '💝' : '⭐';
            renderGames();
        });
    }

    function loadRecent() {
        try {
            const records = JSON.parse(localStorage.getItem('gameRecords') || '{}');
            const sorted = Object.entries(records)
                .filter(([id]) => GAMES[id])
                .sort((a, b) => b[1].time - a[1].time)
                .slice(0, 8);

            if (sorted.length === 0) return;

            const section = document.getElementById('recentSection');
            const grid = document.getElementById('recentGrid');
            section.style.display = 'block';
            grid.innerHTML = sorted.map(([id, r]) => {
                const g = GAMES[id];
                return `<div class="recent-card" onclick="playGame('${id}')">
                    <span>${g.icon}</span>
                    <span>${g.name}</span>
                    <span>${'⭐'.repeat(r.stars)}</span>
                </div>`;
            }).join('');
        } catch(e) {}
    }

    function checkSoundPref() {
        const pref = localStorage.getItem('soundEnabled');
        if (pref === 'false') {
            AudioManager.enabled = false;
            document.getElementById('soundToggle').textContent = '🔇';
        }
    }

    // 全局方法
    window.playGame = function(id) {
        try { AudioManager.init(); AudioManager.resume(); AudioManager.click(); } catch(e) {}
        window.location.href = 'game.html?id=' + id;
    };

    window.toggleFav = function(id, el) {
        const favs = getFavorites();
        const idx = favs.indexOf(id);
        if (idx >= 0) {
            favs.splice(idx, 1);
            el.classList.remove('active');
        } else {
            favs.push(id);
            el.classList.add('active');
        }
        localStorage.setItem('favorites', JSON.stringify(favs));
        AudioManager.init();
        AudioManager.click();
    };

    window.resetFilter = function() {
        currentCat = 'all';
        document.getElementById('searchInput').value = '';
        document.getElementById('clearSearch').style.display = 'none';
        document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
        document.querySelector('.cat-btn[data-cat="all"]').classList.add('active');
        renderGames();
    };

    function getFavorites() {
        try { return JSON.parse(localStorage.getItem('favorites') || '[]'); }
        catch(e) { return []; }
    }

    function getCatName(cat) {
        const names = {
            puzzle: '益智', memory: '记忆', reaction: '反应',
            math: '数学', chinese: '语文', music: '音乐',
            english: '英语', fun: '趣味'
        };
        return names[cat] || cat;
    }

    document.addEventListener('DOMContentLoaded', init);
})();
