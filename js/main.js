// 绫月乃萝 Fan Site — main.js (v0.5)

// Worker 图片代理
var WORKER_URL = 'https://nora-cdn.warmrainday.workers.dev';
var remoteConfig = {};

function proxy(p) {
    if (!p) return '';
    if (p.startsWith('http')) return p;
    if (p.startsWith('noraemoji/')) return p;
    return WORKER_URL + '/image?path=' + encodeURIComponent(p);
}

async function loadRemoteConfig() {
    try {
        var r = await fetch(WORKER_URL + '/config');
        if (r.ok) remoteConfig = await r.json();
    } catch (e) {}
    applyAllConfig();
}

function getCfg(key, def) {
    return remoteConfig[key] !== undefined ? remoteConfig[key] : def;
}

(function initTheme() {
    document.documentElement.setAttribute('data-theme', 'dark');
})();

// ===== 侧边导航 =====
var navToggle = document.getElementById('navToggle');
var sideNav = document.getElementById('sideNav');

if (navToggle) {
    navToggle.addEventListener('click', function() {
        sideNav.classList.toggle('open');
    });
}

document.querySelectorAll('.nav-menu a').forEach(function(link) {
    link.addEventListener('click', function() { sideNav.classList.remove('open'); });
});

document.addEventListener('click', function(e) {
    if (sideNav && sideNav.classList.contains('open') && !sideNav.contains(e.target)) {
        sideNav.classList.remove('open');
    }
});

// 平滑滚动
document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        var target = document.querySelector(this.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
});

// 导航高亮
var sections = document.querySelectorAll('section');
var navItems = document.querySelectorAll('.nav-menu a');

window.addEventListener('scroll', function() {
    var current = '';
    sections.forEach(function(section) {
        if (scrollY >= section.offsetTop - 300) {
            current = section.getAttribute('id');
        }
    });
    navItems.forEach(function(item) {
        item.classList.remove('active');
        if (item.getAttribute('href') === '#' + current) item.classList.add('active');
    });
});

// ===== Emoji Waterfall =====
var EMOJI_DIR = 'noraemoji/';
var EMOJI_FILES = [
    '07A21E208726EF4EB062DF73BAD53FB3.jpg','07F75AAEE5082ECE32FBDE5DF30EBE5C.jpg',
    '09C48661C3A867F93DE50372FC2242E0.jpg','0A93F80FBF07C300E1766F62FB56494E.jpg',
    '0B0B3F4E6903A1405EB14B58BA22E414.jpg','0CEAC306CCC3E7253F2D121CB92C85F6.jpg',
    '15049341992A4951DA6F94B981705031.jpg','18F91503CB792836BB882C503D79BAD8.jpg',
    '1FBCE55906E57B92D24C70E92EDAD4EB.jpg','285DDE3C8FDB8A5CA3CB69FD5C9ED9C6.jpg',
    '2C6B373273A508FFF7D3FE035184A745.jpg','2CC6D39DBAE082B8DC2789EF6F604D12.jpg',
    '30369B89C7858820E17FF1680FC01287.jpg','328EAB471ACA654FFE12C8D3C61FE1B8.jpg',
    '36C458AA09B02DC3D18375A969BBC971.jpg','3884ABF4D6B9C47AB414401B9C1F01D4.jpg',
    '4A36F3A93BE3277227A7CD8E64FF18AB.jpg','4C7A94EFC9E992FC0763D231D0DE6903.jpg',
    '5583906EE5FBE34FA2651FA974DDF725.jpg','5A8269C1DBD72A379C8884B4939EDA19.jpg',
    '5CEBA443AF6DE77454B8C823E48A428A.jpg','5DDA342BA44BDE42020009CF742AF94B.jpg',
    '6163803096E016D09942A68BF511B26D.jpg','629E1AAE50DEECDCC91A5C97A1E39B88.jpg',
    '6466766D95D26720AC74324E14690344.jpg','6944E0073740D2F9CE05E83A4DB26C4D.jpg',
    '6A75F77A0A651EDC9D8C350DA048EE3B.jpg','6D9F83905C4CA64F1765F2DD1858CB02.jpg',
    '6DB1BA122B06DF60251213799E5BFD0C.jpg','6FD31BFCC51043C0BC590001615498E8.jpg',
    '7321DDF46647F6E565C3CBE71AFF0E15.jpg','74C0C3D7DBF2F8BAC2F46CB88FAD6C1B.jpg',
    '7550CCD0B2BF21E0DEBFF66A2D2A1B26.jpg','7B4FFDB0E21E7BAABD1E7ABBF66C3C62.jpg',
    '7D1E1E2B8C2F3D3A4E9F1A2C8D1B1E1D.jpg','7E8FBD2F38F6DA55FDFCB1F4A6B0DE0F.jpg',
    '85AF4EE0D9C5E7F5D4A0B1BE91C0A90E.jpg','8FB96AE6BA9F30F5C5A3F2D6D37CDC8E.jpg',
    '907F06D73D75F0177E52D97FC37A7571.jpg','90FAA9F8FBB3EF8EBD6E8A6E4F7D8B2F.jpg',
    '95B7F4E8FC4CBEBDCD6C48B09B7EEC1B.jpg','9C2CCFB7A4B90AA9FD53E79A0E4F6F21.jpg',
    'A0B3BB26E3A2D7BBD64F2F4AA6D4E2CC.jpg','A43C4E17F2A8A5C1B2C2EFBDA7CD6EF4.jpg',
    'ABAFE3E2C4A8FDACDAB1B78E75CA9DE2.jpg','AD2DED7F4C56E7F2FA7A5F63CB6C7D23.jpg',
    'B2F8C2C16EAD9E07CF9F5B2F0F5E1B9A.jpg','B7C8DEA1C2E2CE3D2B8A0D2E5C8A1B6E.jpg',
    'BD4D4E8A6DC6F4A7A0E7AC0C6AA0C9BE.jpg','C6DF5FD7F6A8D1FCFE8B2CC6B3EA7DBD.jpg',
    'CDBC0F7E2BBCD7D8DAFDFE2CA4E3D4A7.jpg','D4ADEA8BD4F0AB8DE7BCFB7BB5CCF6D5.jpg',
    'DD7FAE4DE4F7A5C2BE5EA0F5EA2C3C8F.jpg','E2E2A3F3EF9F2FB3F4A3FA1C4BCD6D02.jpg',
    'E8CDA8E8C5A2BAFDDC5B0BFF2FEF9CD1.jpg','F0A8C7E0D4C7DDA2D2BC0BCA4DD0FA2C.jpg',
];

function shuffleArray(a) {
    for (var i = a.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
    }
    return a;
}

function buildEmojiWaterfall() {
    var container = document.getElementById('emojiWaterfall');
    if (!container) return;
    container.innerHTML = '';

    var emojiSettings = getCfg('emoji', {});
    var columnCount = parseInt(emojiSettings.cols) || (window.innerWidth < 600 ? 6 : window.innerWidth < 1000 ? 8 : 12);
    var baseSpeed = parseInt(emojiSettings.speed) || 30;
    var imgOpacity = parseFloat(emojiSettings.opacity) || 0.6;
    var direction = emojiSettings.direction || 'vertical';

    for (var col = 0; col < columnCount; col++) {
        var colEl = document.createElement('div');
        colEl.className = 'emoji-column' + (col % 2 === 1 ? ' reverse' : '');
        if (direction === 'diagonal-left') colEl.classList.add('diagonal-left');
        if (direction === 'diagonal-right') colEl.classList.add('diagonal-right');
        var duration = baseSpeed + (Math.random() - 0.5) * 15;
        colEl.style.setProperty('--scroll-duration', duration + 's');

        var shuffled = shuffleArray(EMOJI_FILES.slice());
        var doubled = shuffled.concat(shuffled);
        doubled.forEach(function(file) {
            var img = document.createElement('img');
            img.src = EMOJI_DIR + file;
            img.alt = '';
            img.loading = 'lazy';
            img.style.opacity = imgOpacity;
            colEl.appendChild(img);
        });
        container.appendChild(colEl);
    }

    if (direction === 'diagonal-left' || direction === 'diagonal-right') {
        container.classList.add('diagonal-mode');
    } else {
        container.classList.remove('diagonal-mode');
    }
}

// ===== 应用所有远程配置 =====
function applyAllConfig() {
    // 主题
    var theme = getCfg('theme', 'dark');
    document.documentElement.setAttribute('data-theme', theme);

    // Home Mode
    var mode = getCfg('homeMode', 'art');
    var artMode = document.querySelector('.hero-mode-art');
    var emojiMode = document.querySelector('.hero-mode-emoji');

    if (artMode && emojiMode) {
        if (mode === 'emoji') {
            artMode.style.display = 'none';
            emojiMode.style.display = 'block';
            buildEmojiWaterfall();
        } else {
            artMode.style.display = 'block';
            emojiMode.style.display = 'none';
        }
    }

    // Hero 背景图
    var heroImage = getCfg('heroImage', 'images/pixiv_hd_1.jpg');
    var heroBg = document.getElementById('heroBg');
    if (heroBg && heroImage) {
        heroBg.style.backgroundImage = 'url(\'' + proxy(heroImage) + '\')';
    }

    // 画廊
    renderGallery();

    // 视频
    renderVideos();

    // 周边
    renderGoods();

    // Profile
    renderProfile();

    // Emoji waterfall（如果是 emoji 模式）
    if (mode === 'emoji') {
        buildEmojiWaterfall();
    }
}

// ===== 动态画廊 =====
function renderGallery() {
    var grid = document.getElementById('masonryGrid');
    if (!grid) return;
    var images = getCfg('galleryImages', []);
    if (!images.length) return;
    grid.innerHTML = images.map(function(img) {
        return '<div class="masonry-item' + (img.tall ? ' tall' : '') + '"><img src="' + proxy(img.src) + '" alt="" loading="lazy"></div>';
    }).join('');
}

// ===== 动态视频 =====
function renderVideos() {
    var grid = document.getElementById('videosGrid');
    if (!grid) return;
    var videos = getCfg('videoList', []);
    if (!videos.length) return;
    grid.innerHTML = videos.map(function(v) {
        return '<a href="' + (v.link || '#') + '" target="_blank" class="video-card">' +
            '<div class="video-thumb"><img src="' + proxy(v.cover) + '" alt="">' +
            '<div class="play-overlay"><svg width="48" height="48" viewBox="0 0 24 24" fill="white"><polygon points="5,3 19,12 5,21"/></svg></div>' +
            '</div></a>';
    }).join('');
}

// ===== 动态 Goods =====
function renderGoods() {
    var grid = document.getElementById('goodsGrid');
    if (!grid) return;
    var goods = getCfg('goods', []);
    if (!goods.length) return;
    grid.innerHTML = goods.map(function(g) {
        return '<a href="' + (g.link || '#') + '" target="_blank" class="goods-card">' +
            '<div class="goods-thumb"><img src="' + proxy(g.src) + '" alt=""></div></a>';
    }).join('');
}

// ===== 动态 Profile =====
function renderProfile() {
    var profile = getCfg('profile', {});
    if (!profile) return;

    var p = profile;
    var h3 = document.querySelector('.profile-info h3');
    var sub = document.querySelector('.profile-info .profile-sub');
    var desc = document.querySelector('.profile-info .profile-desc');
    var table = document.querySelector('.profile-table');

    if (h3 && p.name) h3.textContent = p.name;
    if (sub && p.nameEn) sub.textContent = p.nameEn;
    if (desc && p.desc) desc.textContent = p.desc;

    var fieldMap = {
        '生日': p.bday,
        '种族': p.race,
        '特征': p.trait,
        '语言': p.lang,
        '活动': p.activity,
    };

    if (table) {
        table.querySelectorAll('tr').forEach(function(row) {
            var label = row.querySelector('th');
            var value = row.querySelector('td');
            if (label && value && fieldMap[label.textContent.trim()]) {
                value.textContent = fieldMap[label.textContent.trim()];
            }
        });
    }

    // Avatar
    if (p.avatar) {
        var avatarImg = document.querySelector('.profile-avatar img');
        if (avatarImg) avatarImg.src = proxy(p.avatar);
    }

    // 从 profile 对象直接取所有字段（兼容简化格式）
    if (table && p) {
        table.querySelectorAll('tr').forEach(function(row) {
            var th = row.querySelector('th');
            var td = row.querySelector('td');
            if (!th || !td) return;
            var key = th.textContent.trim();
            if (p[key]) td.textContent = p[key];
        });
    }
}

// ===== 首页模式切换（从设置页调用后，更新本地缓存不触发网络请求的场景） =====
function applyHomeMode(mode) {
    var artMode = document.querySelector('.hero-mode-art');
    var emojiMode = document.querySelector('.hero-mode-emoji');
    if (artMode && emojiMode) {
        if (mode === 'emoji') {
            artMode.style.display = 'none';
            emojiMode.style.display = 'block';
            buildEmojiWaterfall();
        } else {
            artMode.style.display = 'block';
            emojiMode.style.display = 'none';
        }
    }
    setCfg('homeMode', mode);
}

function setCfg(key, val) { remoteConfig[key] = val; }

// ===== GAMES =====
// ===== 记忆翻牌游戏 =====
function initMemoryGame(container) {
    container.style.display = 'block';
    var emojis = ['🌙','⭐','🎨','🐱','🌸','💜','🎀','✨'];
    var cards = emojis.concat(emojis);
    cards = shuffleArray(cards);

    var flipped = [];
    var matched = [];
    var lockBoard = false;

    container.innerHTML = '<div class="game-header"><h3>MEMORY</h3>' +
        '<div style="color:var(--text-dim);font-size:0.85rem">找到所有配对!</div>' +
        '<button class="close-game" onclick="closeGame()">×</button></div>' +
        '<div class="memory-grid" id="memoryGrid"></div>';

    var grid = document.getElementById('memoryGrid');
    cards.forEach(function(emoji, idx) {
        var card = document.createElement('div');
        card.className = 'memory-card';
        card.dataset.index = idx;
        card.dataset.emoji = emoji;
        card.innerHTML = '<div class="card-inner"><div class="card-front">?</div><div class="card-back">' + emoji + '</div></div>';
        card.addEventListener('click', function() {
            if (lockBoard) return;
            if (flipped.includes(idx) || matched.includes(idx)) return;
            if (flipped.length === 2) return;

            card.classList.add('flipped');
            flipped.push(idx);

            if (flipped.length === 2) {
                lockBoard = true;
                var idx1 = flipped[0], idx2 = flipped[1];
                if (cards[idx1] === cards[idx2]) {
                    matched.push(idx1, idx2);
                    flipped = [];
                    lockBoard = false;
                    if (matched.length === cards.length) {
                        setTimeout(function() {
                            container.querySelector('h3').textContent = '🎉 CLEAR!';
                        }, 500);
                    }
                } else {
                    setTimeout(function() {
                        document.querySelectorAll('.memory-card')[idx1].classList.remove('flipped');
                        document.querySelectorAll('.memory-card')[idx2].classList.remove('flipped');
                        flipped = [];
                        lockBoard = false;
                    }, 800);
                }
            }
        });
        grid.appendChild(card);
    });
}

// ===== 接萝卜游戏 =====
function initCatchGame(container) {
    container.style.display = 'block';
    var score = 0;
    var misses = 0;
    var maxMiss = 5;

    container.innerHTML = '<div class="game-header"><h3>CATCH RADISH!</h3>' +
        '<div style="color:var(--text-dim);font-size:0.85rem">Score: <span id="catchScore">0</span> | Miss: <span id="catchMiss">0</span>/' + maxMiss + '</div>' +
        '<button class="close-game" onclick="closeGame()">×</button></div>' +
        '<div id="catchArea" style="position:relative;height:400px;background:var(--card-bg);border-radius:12px;overflow:hidden;cursor:pointer;"></div>';

    var area = document.getElementById('catchArea');

    function spawnRadish() {
        if (misses >= maxMiss) {
            area.innerHTML = '<div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);text-align:center">' +
                '<h3 style="color:var(--accent);margin-bottom:10px">GAME OVER</h3>' +
                '<p style="font-size:1.3rem;margin-bottom:20px">Score: ' + score + '</p>' +
                '<button onclick="initCatchGame(document.getElementById(\'gameContainer\'))" style="padding:10px 24px;background:transparent;border:1px solid var(--accent);border-radius:50px;color:var(--accent);cursor:pointer;">RETRY</button></div>';
            return;
        }
        var radish = document.createElement('div');
        radish.style.cssText = 'position:absolute;font-size:2rem;cursor:pointer;transition:transform 0.1s;z-index:1;';
        radish.style.left = Math.random() * 85 + '%';
        radish.style.top = Math.random() * 80 + '%';
        radish.textContent = ['🥕','🥕','🥕','🍀','💣'][Math.floor(Math.random() * 5)];

        var isBomb = radish.textContent === '💣';
        var isClover = radish.textContent === '🍀';

        radish.addEventListener('click', function(e) {
            e.stopPropagation();
            if (isBomb) {
                score = Math.max(0, score - 3);
            } else if (isClover) {
                score += 5;
            } else {
                score++;
            }
            document.getElementById('catchScore').textContent = score;
            radish.remove();
        });

        area.appendChild(radish);

        setTimeout(function() {
            if (radish.parentNode) {
                radish.remove();
                if (!isBomb) {
                    misses++;
                    document.getElementById('catchMiss').textContent = misses;
                }
                if (misses >= maxMiss) spawnRadish();
            }
        }, 2000);

        if (misses < maxMiss) {
            setTimeout(spawnRadish, 800 + Math.random() * 600);
        }
    }

    area.addEventListener('click', function() { /* miss click - no penalty */ });
    spawnRadish();
}

// ===== 问题游戏 =====
var questions = [
    { q: '绫月乃萝的生日是?', a: ['4月21日','4月15日','5月1日','3月21日'], correct: 0 },
    { q: '乃萝在B站的UID是?', a: ['86471108','12345678','87654321','86471109'], correct: 0 },
    { q: '乃萝的Twitter ID是?', a: ['@Ayatsuki_Nora','@Nora_ayatsuki','@Tsukimi_Nora','@Nora_cat'], correct: 0 },
    { q: '乃萝是哪种虚拟主播?', a: ['猫猫画师','狗狗画师','兔兔画师','熊熊画师'], correct: 0 },
];

var qIdx = 0;
var quizScore = 0;

function initQuizGame(container) {
    container.style.display = 'block';
    qIdx = 0;
    quizScore = 0;
    container.innerHTML = '<div class="game-header"><h3>QUIZ</h3>' +
        '<div style="color:var(--text-dim);font-family:var(--font-en);font-size:0.85rem">Score: <span id="quizScore">0</span> | <span id="qNum">1</span>/' + questions.length + '</div>' +
        '<button class="close-game" onclick="closeGame()">×</button></div>' +
        '<div id="quizContent" style="text-align:center;padding:20px;max-width:500px;margin:0 auto;"></div>';
    showQ();
}

function showQ() {
    var el = document.getElementById('quizContent');
    if (qIdx >= questions.length) {
        el.innerHTML = '<h3 style="margin-bottom:20px;color:var(--accent)">完成!</h3>' +
            '<p style="font-size:1.3rem;margin-bottom:30px">' + quizScore + '/' + questions.length + '</p>' +
            '<button onclick="initQuizGame(document.getElementById(\'gameContainer\'))" style="padding:12px 30px;background:transparent;border:1px solid var(--accent);border-radius:50px;color:var(--accent);cursor:pointer;font-family:var(--font-en)">RETRY</button>';
        return;
    }
    document.getElementById('qNum').textContent = qIdx + 1;
    var q = questions[qIdx];
    el.innerHTML = '<h3 style="margin-bottom:25px;font-size:1.1rem;font-weight:400">' + q.q + '</h3>' +
        q.a.map(function(a, i) {
            return '<button onclick="checkAns(' + i + ')" style="display:block;width:100%;max-width:300px;margin:10px auto;padding:12px;background:var(--card-bg);border:1px solid var(--border);border-radius:8px;color:var(--text);font-size:0.95rem;cursor:pointer;">' + a + '</button>';
        }).join('');
}

window.checkAns = function(i) {
    if (i === questions[qIdx].correct) { quizScore++; document.getElementById('quizScore').textContent = quizScore; }
    qIdx++; showQ();
};

window.closeGame = function() {
    var gc = document.getElementById('gameContainer');
    if (gc) { gc.style.display = 'none'; gc.innerHTML = ''; }
};

// ===== Init =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('🌙 绫月乃萝 Fan Site loaded (v0.5)');
    loadRemoteConfig();
});