// 绫月乃萝 Fan Site — main.js

// ===== 侧边导航 =====
const navToggle = document.getElementById('navToggle');
const sideNav = document.getElementById('sideNav');

navToggle.addEventListener('click', () => {
    sideNav.classList.toggle('open');
});

// 点击导航链接后关闭菜单
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        sideNav.classList.remove('open');
    });
});

// 点击外部关闭
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
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// 导航高亮
const sections = document.querySelectorAll('section');
const navItems = document.querySelectorAll('.nav-menu a');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (scrollY >= sectionTop - 300) {
            current = section.getAttribute('id');
        }
    });
    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href') === '#' + current) {
            item.classList.add('active');
        }
    });
});

// ===== 滚动动画 =====
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            // 交错延迟
            const delay = Array.from(entry.target.parentNode.children).indexOf(entry.target) * 100;
            setTimeout(() => {
                entry.target.classList.add('visible');
            }, Math.min(delay, 600));
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.masonry-item, .video-card, .game-card, .profile-content').forEach(el => {
    observer.observe(el);
});

// ===== Lightbox (点击放大) =====
const lightbox = document.createElement('div');
lightbox.className = 'lightbox';
lightbox.innerHTML = '<img src="" alt=""><button class="lightbox-close">&times;</button>';
document.body.appendChild(lightbox);

const lightboxStyle = document.createElement('style');
lightboxStyle.textContent = `
    .lightbox {
        display: none;
        position: fixed;
        inset: 0;
        z-index: 1000;
        background: rgba(0,0,0,0.95);
        align-items: center;
        justify-content: center;
        cursor: zoom-out;
    }
    .lightbox.active { display: flex; }
    .lightbox img {
        max-width: 90vw;
        max-height: 90vh;
        object-fit: contain;
        border-radius: 4px;
    }
    .lightbox-close {
        position: absolute;
        top: 20px;
        right: 30px;
        background: none;
        border: none;
        color: white;
        font-size: 2rem;
        cursor: pointer;
        opacity: 0.5;
        transition: opacity 0.3s;
    }
    .lightbox-close:hover { opacity: 1; }
`;
document.head.appendChild(lightboxStyle);

document.querySelectorAll('.masonry-item img').forEach(img => {
    img.addEventListener('click', () => {
        lightbox.querySelector('img').src = img.src;
        lightbox.classList.add('active');
    });
});

lightbox.addEventListener('click', () => {
    lightbox.classList.remove('active');
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') lightbox.classList.remove('active');
});

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
    const container = document.getElementById('gameContainer');
    container.classList.remove('active');
    currentGame = null;
}

// ===== 记忆翻牌游戏 =====
function initMemoryGame(container) {
    currentGame = 'memory';
    const cards = ['🎨','🎨','🖌️','🖌️','✨','✨','🌙','🌙','⭐','⭐','💖','💖','🎀','🎀','🌸','🌸'];
    for (let i = cards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cards[i], cards[j]] = [cards[j], cards[i]];
    }
    container.innerHTML = `
        <div class="game-header">
            <h3>MEMORY</h3>
            <div style="color:var(--text-dim);font-family:var(--font-en);font-size:0.85rem">Score: <span id="score">0</span> | Moves: <span id="moves">0</span></div>
            <button class="close-game" onclick="closeGame()">×</button>
        </div>
        <div id="memoryGame" style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;max-width:400px;margin:20px auto;"></div>
    `;
    const game = document.getElementById('memoryGame');
    let flippedCards = [], matchedPairs = 0, moves = 0, canFlip = true;
    cards.forEach((emoji, index) => {
        const card = document.createElement('div');
        card.dataset.emoji = emoji;
        card.dataset.index = index;
        card.innerHTML = `<div style="aspect-ratio:1;background:linear-gradient(135deg,rgba(200,162,232,0.2),rgba(255,126,179,0.2));border:1px solid var(--border);border-radius:8px;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:1.5rem;transition:all 0.4s;transform-style:preserve-3d;">${emoji}</div>`;
        card.querySelector('div').style.color = 'transparent';
        card.addEventListener('click', () => flipCard(card));
        game.appendChild(card);
    });
    function flipCard(card) {
        if (!canFlip || flippedCards.includes(card) || card.dataset.matched) return;
        const inner = card.querySelector('div');
        inner.style.color = 'var(--text)';
        inner.style.background = 'rgba(200,162,232,0.1)';
        card.dataset.flipped = 'true';
        flippedCards.push(card);
        if (flippedCards.length === 2) {
            moves++;
            document.getElementById('moves').textContent = moves;
            checkMatch();
        }
    }
    function checkMatch() {
        canFlip = false;
        const [c1, c2] = flippedCards;
        if (c1.dataset.emoji === c2.dataset.emoji) {
            matchedPairs++;
            document.getElementById('score').textContent = matchedPairs * 10;
            c1.dataset.matched = '1';
            c2.dataset.matched = '1';
            flippedCards = [];
            canFlip = true;
            if (matchedPairs === cards.length / 2) {
                setTimeout(() => alert('🎉 通关！ ' + moves + ' 步'), 300);
            }
        } else {
            setTimeout(() => {
                [c1, c2].forEach(c => {
                    const inner = c.querySelector('div');
                    inner.style.color = 'transparent';
                    inner.style.background = 'linear-gradient(135deg,rgba(200,162,232,0.2),rgba(255,126,179,0.2))';
                    delete c.dataset.flipped;
                });
                flippedCards = [];
                canFlip = true;
            }, 800);
        }
    }
}

// ===== 接星星游戏 =====
function initCatchGame(container) {
    currentGame = 'catch';
    container.innerHTML = `
        <div class="game-header">
            <h3>CATCH</h3>
            <div style="color:var(--text-dim);font-family:var(--font-en);font-size:0.85rem">Score: <span id="catchScore">0</span></div>
            <button class="close-game" onclick="closeGame()">×</button>
        </div>
        <canvas id="gameCanvas" width="480" height="360" style="display:block;margin:0 auto;border-radius:8px;border:1px solid var(--border);"></canvas>
        <p style="text-align:center;color:var(--text-dim);font-size:0.8rem;margin-top:10px">← → 键移动</p>
    `;
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    let score = 0, frameCount = 0;
    const player = { x: 215, y: 310, width: 50, height: 50 };
    let stars = [], keys = {};
    document.addEventListener('keydown', e => keys[e.key] = true);
    document.addEventListener('keyup', e => keys[e.key] = false);
    function gameLoop() {
        if (!currentGame || currentGame !== 'catch') return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#0a0a0f';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        if (keys['ArrowLeft'] && player.x > 0) player.x -= 6;
        if (keys['ArrowRight'] && player.x < canvas.width - player.width) player.x += 6;
        ctx.font = '36px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('🎨', player.x + 25, player.y + 35);
        if (frameCount % 35 === 0) {
            stars.push({ x: Math.random() * (canvas.width - 30), y: 0, speed: 2 + Math.random() * 2.5 });
        }
        stars.forEach((star, i) => {
            star.y += star.speed;
            ctx.font = '24px Arial';
            ctx.fillText('⭐', star.x + 15, star.y + 20);
            if (star.y + 20 > player.y && star.y < player.y + player.height && star.x + 15 > player.x && star.x < player.x + player.width) {
                stars.splice(i, 1);
                score++;
                document.getElementById('catchScore').textContent = score;
            }
            if (star.y > canvas.height) stars.splice(i, 1);
        });
        frameCount++;
        if (currentGame === 'catch') requestAnimationFrame(gameLoop);
    }
    gameLoop();
}

// ===== 问答游戏 =====
function initQuizGame(container) {
    currentGame = 'quiz';
    const questions = [
        { q: '乃萝的B站UID是？', a: ['86471108', '12345678', '99999999'], correct: 0 },
        { q: '乃萝的Twitter ID是？', a: ['@nora_vtuber', '@Ayatsuki_Nora', '@nora_draw'], correct: 1 },
        { q: '乃萝的职业是？', a: ['纯画师', '纯主播', '兼职画师和主播'], correct: 2 },
        { q: '乃萝的Pixiv ID是？', a: ['36966416', '12345678', '99999999'], correct: 0 },
    ];
    let currentQuestion = 0, score = 0;
    container.innerHTML = `
        <div class="game-header">
            <h3>QUIZ</h3>
            <div style="color:var(--text-dim);font-family:var(--font-en);font-size:0.85rem">Score: <span id="quizScore">0</span> | <span id="qNum">1</span>/${questions.length}</div>
            <button class="close-game" onclick="closeGame()">×</button>
        </div>
        <div id="quizContent" style="text-align:center;padding:20px;max-width:500px;margin:0 auto;"></div>
    `;
    showQuestion();
    function showQuestion() {
        const content = document.getElementById('quizContent');
        if (currentQuestion >= questions.length) {
            content.innerHTML = `<h3 style="margin-bottom:20px;color:var(--accent)">完成！</h3>
                <p style="font-size:1.3rem;margin-bottom:30px">${score} / ${questions.length}</p>
                <button onclick="initQuizGame(document.getElementById('gameContainer'))" style="padding:12px 30px;background:transparent;border:1px solid var(--accent);border-radius:50px;color:var(--accent);cursor:pointer;font-family:var(--font-en)">RETRY</button>`;
            return;
        }
        document.getElementById('qNum').textContent = currentQuestion + 1;
        const q = questions[currentQuestion];
        let buttons = q.a.map((answer, i) =>
            `<button onclick="checkAnswer(${i})" style="display:block;width:100%;max-width:300px;margin:10px auto;padding:12px;background:var(--card-bg);border:1px solid var(--border);border-radius:8px;color:var(--text);font-size:0.95rem;cursor:pointer;transition:all 0.3s;">${answer}</button>`
        ).join('');
        content.innerHTML = `<h3 style="margin-bottom:25px;font-size:1.1rem;font-weight:400">${q.q}</h3>${buttons}`;
    }
    window.checkAnswer = function(index) {
        if (index === questions[currentQuestion].correct) {
            score++;
            document.getElementById('quizScore').textContent = score;
        }
        currentQuestion++;
        showQuestion();
    };
}

// ===== 页面加载 =====
document.addEventListener('DOMContentLoaded', () => {
    console.log('🌙 绫月乃萝 Fan Site loaded');
});
