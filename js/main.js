// 绫月乃萝粉丝站 - 主脚本

// ===== 导航 =====
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
            navLinks.classList.remove('active');
        }
    });
});

// 导航高亮
const sections = document.querySelectorAll('section');
const navItems = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (scrollY >= sectionTop - 200) {
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

// ===== 轮播 Slider =====
let slideIndex = 0;
const slider = document.getElementById('slider');
const slides = document.querySelectorAll('.slide');
const dotsContainer = document.getElementById('dots');

if (slides.length > 0) {
    // 创建 dots
    slides.forEach((_, i) => {
        const dot = document.createElement('span');
        dot.className = 'dot' + (i === 0 ? ' active' : '');
        dot.onclick = () => goToSlide(i);
        dotsContainer.appendChild(dot);
    });
}

function updateSlider() {
    if (!slider) return;
    slider.style.transform = `translateX(-${slideIndex * 100}%)`;
    document.querySelectorAll('.dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === slideIndex);
    });
}

function nextSlide() {
    slideIndex = (slideIndex + 1) % slides.length;
    updateSlider();
}

function prevSlide() {
    slideIndex = (slideIndex - 1 + slides.length) % slides.length;
    updateSlider();
}

function goToSlide(index) {
    slideIndex = index;
    updateSlider();
}

// 自动播放
let autoPlay = setInterval(nextSlide, 4000);

// 鼠标悬停暂停
const sliderEl = document.querySelector('.works-slider');
if (sliderEl) {
    sliderEl.addEventListener('mouseenter', () => clearInterval(autoPlay));
    sliderEl.addEventListener('mouseleave', () => {
        autoPlay = setInterval(nextSlide, 4000);
    });
}

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
            <h3>🃏 记忆翻牌</h3>
            <div class="score">得分: <span id="score">0</span> | 步数: <span id="moves">0</span></div>
            <button class="close-game" onclick="closeGame()">×</button>
        </div>
        <div class="memory-game" id="memoryGame"></div>
    `;
    const game = document.getElementById('memoryGame');
    game.style.cssText = 'display:grid;grid-template-columns:repeat(4,1fr);gap:10px;max-width:400px;margin:20px auto;';
    let flippedCards = [], matchedPairs = 0, moves = 0, canFlip = true;
    cards.forEach((emoji, index) => {
        const card = document.createElement('div');
        card.className = 'memory-card';
        card.dataset.emoji = emoji;
        card.dataset.index = index;
        card.innerHTML = '<div class="card-front">?</div><div class="card-back">' + emoji + '</div>';
        card.style.cssText = 'aspect-ratio:1;background:linear-gradient(135deg,#9b59b6,#ff69b4);border-radius:10px;cursor:pointer;position:relative;transform-style:preserve-3d;transition:transform 0.5s;';
        card.addEventListener('click', () => flipCard(card));
        game.appendChild(card);
    });
    function flipCard(card) {
        if (!canFlip || flippedCards.includes(card) || card.classList.contains('flipped')) return;
        card.style.transform = 'rotateY(180deg)';
        card.classList.add('flipped');
        flippedCards.push(card);
        if (flippedCards.length === 2) {
            moves++;
            document.getElementById('moves').textContent = moves;
            checkMatch();
        }
    }
    function checkMatch() {
        canFlip = false;
        const [card1, card2] = flippedCards;
        if (card1.dataset.emoji === card2.dataset.emoji) {
            matchedPairs++;
            document.getElementById('score').textContent = matchedPairs * 10;
            flippedCards = [];
            canFlip = true;
            if (matchedPairs === cards.length / 2) {
                setTimeout(() => alert('🎉 恭喜通关！用时 ' + moves + ' 步'), 300);
            }
        } else {
            setTimeout(() => {
                card1.style.transform = 'rotateY(0)';
                card2.style.transform = 'rotateY(0)';
                card1.classList.remove('flipped');
                card2.classList.remove('flipped');
                flippedCards = [];
                canFlip = true;
            }, 1000);
        }
    }
}

// ===== 接星星游戏 =====
function initCatchGame(container) {
    currentGame = 'catch';
    container.innerHTML = `
        <div class="game-header">
            <h3>⭐ 接星星</h3>
            <div class="score">得分: <span id="catchScore">0</span></div>
            <button class="close-game" onclick="closeGame()">×</button>
        </div>
        <canvas id="gameCanvas" width="500" height="400"></canvas>
    `;
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    let score = 0, frameCount = 0;
    const player = { x: 225, y: 350, width: 50, height: 50, emoji: '🎨' };
    let stars = [], keys = {};
    document.addEventListener('keydown', e => keys[e.key] = true);
    document.addEventListener('keyup', e => keys[e.key] = false);
    function gameLoop() {
        if (!currentGame || currentGame !== 'catch') return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#1a1a2e';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        if (keys['ArrowLeft'] && player.x > 0) player.x -= 7;
        if (keys['ArrowRight'] && player.x < canvas.width - player.width) player.x += 7;
        ctx.font = '40px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(player.emoji, player.x + player.width/2, player.y + 35);
        if (frameCount % 40 === 0) {
            stars.push({ x: Math.random() * (canvas.width - 30), y: 0, speed: 2 + Math.random() * 3, emoji: '⭐' });
        }
        stars.forEach((star, index) => {
            star.y += star.speed;
            ctx.font = '30px Arial';
            ctx.fillText(star.emoji, star.x + 15, star.y + 25);
            if (star.y + 25 > player.y && star.y < player.y + player.height && star.x + 15 > player.x && star.x < player.x + player.width) {
                stars.splice(index, 1);
                score++;
                document.getElementById('catchScore').textContent = score;
            }
            if (star.y > canvas.height) stars.splice(index, 1);
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
        { q: '乃萝的粉丝称呼是？', a: ['月民', '猫猫', '画家'], correct: 0 },
    ];
    let currentQuestion = 0, score = 0;
    container.innerHTML = `
        <div class="game-header">
            <h3>❓ 乃萝问答</h3>
            <div class="score">得分: <span id="quizScore">0</span> | 第 <span id="qNum">1</span> 题</div>
            <button class="close-game" onclick="closeGame()">×</button>
        </div>
        <div id="quizContent" style="text-align:center;padding:20px;"></div>
    `;
    showQuestion();
    function showQuestion() {
        const content = document.getElementById('quizContent');
        if (currentQuestion >= questions.length) {
            content.innerHTML = `<h2 style="color:#ffb6c1;margin-bottom:20px;">🎉 答题完成！</h2>
                <p style="font-size:1.5rem;margin-bottom:30px;">最终得分: ${score} / ${questions.length}</p>
                <button onclick="initQuizGame(document.getElementById('gameContainer'))" style="padding:15px 30px;background:linear-gradient(135deg,#ffb6c1,#9b59b6);border:none;border-radius:25px;color:white;font-size:1rem;cursor:pointer;">再玩一次</button>`;
            return;
        }
        document.getElementById('qNum').textContent = currentQuestion + 1;
        const q = questions[currentQuestion];
        let buttons = q.a.map((answer, i) =>
            `<button onclick="checkAnswer(${i})" style="display:block;width:100%;max-width:300px;margin:10px auto;padding:15px;background:rgba(255,255,255,0.1);border:2px solid #9b59b6;border-radius:10px;color:white;font-size:1rem;cursor:pointer;">${answer}</button>`
        ).join('');
        content.innerHTML = `<h3 style="margin-bottom:30px;font-size:1.3rem;">${q.q}</h3>${buttons}`;
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

// 页面加载
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎨 绫月乃萝粉丝站已加载');
});
