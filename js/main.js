// 绫月乃萝 Fan Site — main.js

// ===== 侧边导航 =====
const navToggle = document.getElementById('navToggle');
const sideNav = document.getElementById('sideNav');

navToggle.addEventListener('click', () => {
    sideNav.classList.toggle('open');
});

document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => sideNav.classList.remove('open'));
});

document.addEventListener('click', (e) => {
    if (sideNav.classList.contains('open') && !sideNav.contains(e.target)) {
        sideNav.classList.remove('open');
    }
});

// 平滑滚动
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
});

// 导航高亮
const sections = document.querySelectorAll('section');
const navItems = document.querySelectorAll('.nav-menu a');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        if (scrollY >= section.offsetTop - 300) {
            current = section.getAttribute('id');
        }
    });
    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href') === '#' + current) item.classList.add('active');
    });
});

// ===== Emoji Waterfall =====
const EMOJI_DIR = 'noraemoji/';
const EMOJI_FILES = [
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
    '7321DDF46647F6E565C3CBE710DAD2FB.jpg','7B0246E719DAF65CC6C2B334219C034F.jpg',
    '7B0E6A1F357A048FF8A744BDD79884EC.jpg','7C2D5EEE8D60E9C2B09755A09293FAE9.jpg',
    '86751FE53B6E5734B20D0BFE468E12E8.jpg','8F1331569D8C711F618580D05A210714.jpg',
    '907F06D73D75F0177E52D97FC37A7571.jpg','99CC4147FF0CA2761A9AC2346369597D.jpg',
    'A44384A7AA6EBEE761561F8DE1CA95A4.jpg','A5439738BD7D52A21907409E59C90F0F.jpg',
    'A8A6BD04E64BDE9CFA7D0CCF37804389.jpg','AC301E79D05800CE094C58189DE28275.jpg',
    'B1704E07EA0BD483A73CB0FFAC14071D.jpg','B7112E141715BAEB0AF840AE5341DB73.jpg',
    'C380DC4C6500C82000BB495E8F653624.jpg','C645616D70BB67D6004F096A04A41895.jpg',
    'CA6A33D75FB2A13B08C39D60702DAA2F.jpg','CCC4C94D8FEA55DE4ADEEA13CC9ABD15.jpg',
    'CEE031871574F54C2E4401F92B94D119.jpg','D48A501A06871E855B6CFD8907BA0DFA.jpg',
    'D740DB85DE836F76E9B23C87AD7B9CC0.jpg','DC1F94F6B48C88A959D5D758F9FB2756.jpg',
    'F2F2AEDAC29BB574C4D2D6E0BF260680.jpg','F33F42F8FD8165AF97B050C8697ED258.jpg',
    'F3DDF126C91C40BF7CE11A6E9FCD7F45.jpg','F45E5201D77E5BBED661E72D8C2C2E16.jpg',
    'F52E085E18A76C7D6A6D81D357433B39.jpg','F74B5D8E04C0B3251FB996FDFD422CE0.jpg',
    'FA5BFF90D9E0B4D0247CDF53C5AA1859.jpg','FCB253DE0E1A1E9ADD9DF087A1139AAB.jpg',
];

function shuffleArray(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function buildEmojiWaterfall() {
    const container = document.getElementById('emojiWaterfall');
    if (!container) return;
    container.innerHTML = '';

    const settings = JSON.parse(localStorage.getItem('nora_settings') || '{}');
    const emojiSettings = settings.emoji || {};
    const columnCount = parseInt(emojiSettings.cols) || (window.innerWidth < 600 ? 6 : window.innerWidth < 1000 ? 8 : 12);
    const baseSpeed = parseInt(emojiSettings.speed) || 30;
    const imgOpacity = parseFloat(emojiSettings.opacity) || 0.6;

    for (let col = 0; col < columnCount; col++) {
        const colEl = document.createElement('div');
        colEl.className = 'emoji-column' + (col % 2 === 1 ? ' reverse' : '');
        const duration = baseSpeed + (Math.random() - 0.5) * 15;
        colEl.style.setProperty('--scroll-duration', duration + 's');

        const shuffled = shuffleArray(EMOJI_FILES);
        const doubled = [...shuffled, ...shuffled];
        doubled.forEach(file => {
            const img = document.createElement('img');
            img.src = EMOJI_DIR + file;
            img.alt = '';
            img.loading = 'lazy';
            img.style.opacity = imgOpacity;
            colEl.appendChild(img);
        });
        container.appendChild(colEl);
    }
}

// ===== 首页模式切换 =====
function applyHomeMode(mode) {
    const artMode = document.querySelector('.hero-mode-art');
    const emojiMode = document.querySelector('.hero-mode-emoji');
    if (mode === 'emoji') {
        artMode.style.display = 'none';
        emojiMode.style.display = 'block';
        buildEmojiWaterfall();
    } else {
        artMode.style.display = 'block';
        emojiMode.style.display = 'none';
    }
    localStorage.setItem('nora_home_mode', mode);
}

// 读取保存的模式和设置
const savedSettings = JSON.parse(localStorage.getItem('nora_settings') || '{}');
const savedMode = localStorage.getItem('nora_home_mode') || 'art';
const savedHeroImage = localStorage.getItem('nora_hero_image') || 'images/pixiv_hd_1.jpg';

// 应用Hero背景图
if (savedHeroImage && document.getElementById('heroBg')) {
    document.getElementById('heroBg').style.backgroundImage = `url('${savedHeroImage}')`;
}

applyHomeMode(savedMode);

// ===== 滚动动画 =====
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            const delay = Array.from(entry.target.parentNode.children).indexOf(entry.target) * 80;
            setTimeout(() => {
                entry.target.classList.add('visible');
            }, Math.min(delay, 500));
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.masonry-item, .video-card, .game-card, .profile-content').forEach(el => {
    observer.observe(el);
});

// ===== Lightbox =====
const lightbox = document.createElement('div');
lightbox.className = 'lightbox';
lightbox.innerHTML = '<img src="" alt=""><button class="lightbox-close">&times;</button>';
document.body.appendChild(lightbox);

const lbStyle = document.createElement('style');
lbStyle.textContent = `
    .lightbox { display:none; position:fixed; inset:0; z-index:1000; background:rgba(0,0,0,0.95); align-items:center; justify-content:center; cursor:zoom-out; }
    .lightbox.active { display:flex; }
    .lightbox img { max-width:90vw; max-height:90vh; object-fit:contain; border-radius:4px; }
    .lightbox-close { position:absolute; top:20px; right:30px; background:none; border:none; color:white; font-size:2rem; cursor:pointer; opacity:0.5; transition:opacity 0.3s; }
    .lightbox-close:hover { opacity:1; }
`;
document.head.appendChild(lbStyle);

document.querySelectorAll('.masonry-item img').forEach(img => {
    img.addEventListener('click', () => {
        lightbox.querySelector('img').src = img.src;
        lightbox.classList.add('active');
    });
});

lightbox.addEventListener('click', () => lightbox.classList.remove('active'));
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') lightbox.classList.remove('active'); });

// ===== 游戏系统 =====
let currentGame = null;

function loadGame(gameName) {
    const container = document.getElementById('gameContainer');
    container.classList.add('active');
    container.scrollIntoView({ behavior: 'smooth' });
    switch(gameName) {
        case 'memory': initMemoryGame(container); break;
        case 'catch': initCatchGame(container); break;
        case 'quiz': initQuizGame(container); break;
    }
}

function closeGame() {
    document.getElementById('gameContainer').classList.remove('active');
    currentGame = null;
}

function initMemoryGame(container) {
    currentGame = 'memory';
    const cards = ['🎨','🎨','🖌️','🖌️','✨','✨','🌙','🌙','⭐','⭐','💖','💖','🎀','🎀','🌸','🌸'];
    for (let i = cards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cards[i], cards[j]] = [cards[j], cards[i]];
    }
    container.innerHTML = `
        <div class="game-header"><h3>MEMORY</h3>
            <div style="color:var(--text-dim);font-family:var(--font-en);font-size:0.85rem">Score: <span id="score">0</span> | Moves: <span id="moves">0</span></div>
            <button class="close-game" onclick="closeGame()">×</button></div>
        <div id="memoryGame" style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;max-width:400px;margin:20px auto;"></div>`;
    const game = document.getElementById('memoryGame');
    let flippedCards = [], matchedPairs = 0, moves = 0, canFlip = true;
    cards.forEach(emoji => {
        const card = document.createElement('div');
        card.dataset.emoji = emoji;
        const inner = document.createElement('div');
        inner.style.cssText = 'aspect-ratio:1;background:linear-gradient(135deg,rgba(200,162,232,0.2),rgba(255,126,179,0.2));border:1px solid var(--border);border-radius:8px;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:1.5rem;transition:all 0.4s;color:transparent;';
        inner.textContent = emoji;
        card.appendChild(inner);
        card.addEventListener('click', () => flipCard(card));
        game.appendChild(card);
    });
    function flipCard(card) {
        if (!canFlip || flippedCards.includes(card) || card.dataset.matched) return;
        const inner = card.querySelector('div');
        inner.style.color = 'var(--text)';
        inner.style.background = 'rgba(200,162,232,0.1)';
        flippedCards.push(card);
        if (flippedCards.length === 2) { moves++; document.getElementById('moves').textContent = moves; checkMatch(); }
    }
    function checkMatch() {
        canFlip = false;
        const [c1, c2] = flippedCards;
        if (c1.dataset.emoji === c2.dataset.emoji) {
            matchedPairs++;
            document.getElementById('score').textContent = matchedPairs * 10;
            c1.dataset.matched = '1'; c2.dataset.matched = '1';
            flippedCards = []; canFlip = true;
            if (matchedPairs === cards.length / 2) setTimeout(() => alert('🎉 通关！ ' + moves + ' 步'), 300);
        } else {
            setTimeout(() => {
                [c1, c2].forEach(c => { const i = c.querySelector('div'); i.style.color = 'transparent'; i.style.background = 'linear-gradient(135deg,rgba(200,162,232,0.2),rgba(255,126,179,0.2))'; });
                flippedCards = []; canFlip = true;
            }, 800);
        }
    }
}

function initCatchGame(container) {
    currentGame = 'catch';
    container.innerHTML = `
        <div class="game-header"><h3>CATCH</h3>
            <div style="color:var(--text-dim);font-family:var(--font-en);font-size:0.85rem">Score: <span id="catchScore">0</span></div>
            <button class="close-game" onclick="closeGame()">×</button></div>
        <canvas id="gameCanvas" width="480" height="360" style="display:block;margin:0 auto;border-radius:8px;border:1px solid var(--border);"></canvas>
        <p style="text-align:center;color:var(--text-dim);font-size:0.8rem;margin-top:10px">← → 移动</p>`;
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    let score = 0, frameCount = 0;
    const player = { x: 215, y: 310, width: 50, height: 50 };
    let stars = [], keys = {};
    const onKey = (e, v) => { keys[e.key] = v; };
    document.addEventListener('keydown', e => onKey(e, true));
    document.addEventListener('keyup', e => onKey(e, false));
    function gameLoop() {
        if (!currentGame || currentGame !== 'catch') return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#0a0a0f'; ctx.fillRect(0, 0, canvas.width, canvas.height);
        if (keys['ArrowLeft'] && player.x > 0) player.x -= 6;
        if (keys['ArrowRight'] && player.x < canvas.width - player.width) player.x += 6;
        ctx.font = '36px Arial'; ctx.textAlign = 'center'; ctx.fillText('🎨', player.x + 25, player.y + 35);
        if (frameCount % 35 === 0) stars.push({ x: Math.random() * (canvas.width - 30), y: 0, speed: 2 + Math.random() * 2.5 });
        stars.forEach((s, i) => {
            s.y += s.speed; ctx.font = '24px Arial'; ctx.fillText('⭐', s.x + 15, s.y + 20);
            if (s.y + 20 > player.y && s.y < player.y + player.height && s.x + 15 > player.x && s.x < player.x + player.width) { stars.splice(i, 1); score++; document.getElementById('catchScore').textContent = score; }
            if (s.y > canvas.height) stars.splice(i, 1);
        });
        frameCount++;
        if (currentGame === 'catch') requestAnimationFrame(gameLoop);
    }
    gameLoop();
}

function initQuizGame(container) {
    currentGame = 'quiz';
    const questions = [
        { q: '乃萝的B站UID是？', a: ['86471108', '12345678', '99999999'], correct: 0 },
        { q: '乃萝的Twitter ID是？', a: ['@nora_vtuber', '@Ayatsuki_Nora', '@nora_draw'], correct: 1 },
        { q: '乃萝的职业是？', a: ['纯画师', '纯主播', '兼职画师和主播'], correct: 2 },
        { q: '乃萝的Pixiv ID是？', a: ['36966416', '12345678', '99999999'], correct: 0 },
    ];
    let qIdx = 0, score = 0;
    container.innerHTML = `
        <div class="game-header"><h3>QUIZ</h3>
            <div style="color:var(--text-dim);font-family:var(--font-en);font-size:0.85rem">Score: <span id="quizScore">0</span> | <span id="qNum">1</span>/${questions.length}</div>
            <button class="close-game" onclick="closeGame()">×</button></div>
        <div id="quizContent" style="text-align:center;padding:20px;max-width:500px;margin:0 auto;"></div>`;
    showQ();
    function showQ() {
        const el = document.getElementById('quizContent');
        if (qIdx >= questions.length) {
            el.innerHTML = `<h3 style="margin-bottom:20px;color:var(--accent)">完成！</h3><p style="font-size:1.3rem;margin-bottom:30px">${score}/${questions.length}</p><button onclick="initQuizGame(document.getElementById('gameContainer'))" style="padding:12px 30px;background:transparent;border:1px solid var(--accent);border-radius:50px;color:var(--accent);cursor:pointer;font-family:var(--font-en)">RETRY</button>`;
            return;
        }
        document.getElementById('qNum').textContent = qIdx + 1;
        const q = questions[qIdx];
        el.innerHTML = `<h3 style="margin-bottom:25px;font-size:1.1rem;font-weight:400">${q.q}</h3>${q.a.map((a, i) => `<button onclick="checkAns(${i})" style="display:block;width:100%;max-width:300px;margin:10px auto;padding:12px;background:var(--card-bg);border:1px solid var(--border);border-radius:8px;color:var(--text);font-size:0.95rem;cursor:pointer;">${a}</button>`).join('')}`;
    }
    window.checkAns = function(i) {
        if (i === questions[qIdx].correct) { score++; document.getElementById('quizScore').textContent = score; }
        qIdx++; showQ();
    };
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('🌙 绫月乃萝 Fan Site loaded');
    
    // 应用设置页的画廊配置
    const settings = JSON.parse(localStorage.getItem('nora_settings') || '{}');
    if (settings.gallery) {
        const grid = document.getElementById('masonryGrid');
        if (grid && settings.gallery.cols) {
            grid.style.columns = settings.gallery.cols;
        }
        if (grid && settings.gallery.gap) {
            grid.style.columnGap = settings.gallery.gap + 'px';
        }
    }
});
