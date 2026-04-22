// 绫月奶萝粉丝站 - 主脚本

// 导航栏滚动效果
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// 移动端导航菜单
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// 平滑滚动
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
        const sectionHeight = section.clientHeight;
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

// ===== 游戏系统 =====

let currentGame = null;

// 加载游戏
function loadGame(gameName) {
    const container = document.getElementById('gameContainer');
    container.classList.add('active');
    
    // 滚动到游戏区域
    container.scrollIntoView({ behavior: 'smooth' });
    
    switch(gameName) {
        case 'memory':
            initMemoryGame(container);
            break;
        case 'catch':
            initCatchGame(container);
            break;
        case 'quiz':
            initQuizGame(container);
            break;
    }
}

// 关闭游戏
function closeGame() {
    const container = document.getElementById('gameContainer');
    container.classList.remove('active');
    currentGame = null;
}

// ===== 记忆翻牌游戏 =====
function initMemoryGame(container) {
    currentGame = 'memory';
    
    const cards = [
        '🎨', '🎨', '🖌️', '🖌️', '✨', '✨',
        '🌙', '🌙', '⭐', '⭐', '💖', '💖',
        '🎀', '🎀', '🌸', '🌸'
    ];
    
    // 洗牌
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
    
    let flippedCards = [];
    let matchedPairs = 0;
    let moves = 0;
    let canFlip = true;
    
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
    
    // 游戏状态
    let score = 0;
    let gameRunning = true;
    let frameCount = 0;
    
    // 玩家（奶萝）
    const player = {
        x: 225,
        y: 350,
        width: 50,
        height: 50,
        emoji: '🎨'
    };
    
    // 星星数组
    let stars = [];
    
    // 键盘控制
    let keys = {};
    document.addEventListener('keydown', e => keys[e.key] = true);
    document.addEventListener('keyup', e => keys[e.key] = false);
    
    function gameLoop() {
        if (!currentGame || currentGame !== 'catch') return;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // 绘制背景
        ctx.fillStyle = '#1a1a2e';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // 移动玩家
        if (keys['ArrowLeft'] && player.x > 0) player.x -= 7;
        if (keys['ArrowRight'] && player.x < canvas.width - player.width) player.x += 7;
        
        // 绘制玩家
        ctx.font = '40px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(player.emoji, player.x + player.width/2, player.y + 35);
        
        // 生成星星
        if (frameCount % 40 === 0) {
            stars.push({
                x: Math.random() * (canvas.width - 30),
                y: 0,
                speed: 2 + Math.random() * 3,
                emoji: '⭐'
            });
        }
        
        // 更新和绘制星星
        stars.forEach((star, index) => {
            star.y += star.speed;
            
            ctx.font = '30px Arial';
            ctx.fillText(star.emoji, star.x + 15, star.y + 25);
            
            // 碰撞检测
            if (star.y + 25 > player.y && star.y < player.y + player.height &&
                star.x + 15 > player.x && star.x < player.x + player.width) {
                stars.splice(index, 1);
                score++;
                document.getElementById('catchScore').textContent = score;
            }
            
            // 超出屏幕
            if (star.y > canvas.height) {
                stars.splice(index, 1);
            }
        });
        
        frameCount++;
        
        if (currentGame === 'catch') {
            requestAnimationFrame(gameLoop);
        }
    }
    
    gameLoop();
}

// ===== 奶萝问答游戏 =====
function initQuizGame(container) {
    currentGame = 'quiz';
    
    const questions = [
        { q: '奶萝的生日是？', a: ['3月15日', '5月20日', '7月7日'], correct: 0 },
        { q: '奶萝的种族是？', a: ['龙族', '月之精灵', '狐妖'], correct: 1 },
        { q: '奶萝的左眼有什么？', a: ['星星', '月之印记', '爱心'], correct: 1 },
        { q: '奶萝的爱好是？', a: ['画画、直播、摸鱼', '唱歌、跳舞', '打游戏'], correct: 0 },
        { q: '奶萝的身份是？', a: ['纯画师', '纯主播', '兼职画师和主播'], correct: 2 }
    ];
    
    let currentQuestion = 0;
    let score = 0;
    
    container.innerHTML = `
        <div class="game-header">
            <h3>❓ 奶萝问答</h3>
            <div class="score">得分: <span id="quizScore">0</span> | 第 <span id="qNum">1</span> 题</div>
            <button class="close-game" onclick="closeGame()">×</button>
        </div>
        <div id="quizContent" style="text-align:center;padding:20px;"></div>
    `;
    
    showQuestion();
    
    function showQuestion() {
        const q = questions[currentQuestion];
        const content = document.getElementById('quizContent');
        
        if (currentQuestion >= questions.length) {
            content.innerHTML = `
                <h2 style="color:#ffb6c1;margin-bottom:20px;">🎉 答题完成！</h2>
                <p style="font-size:1.5rem;margin-bottom:30px;">最终得分: ${score} / ${questions.length}</p>
                <button onclick="initQuizGame(document.getElementById('gameContainer'))" 
                        style="padding:15px 30px;background:linear-gradient(135deg,#ffb6c1,#9b59b6);border:none;border-radius:25px;color:white;font-size:1rem;cursor:pointer;">
                    再玩一次
                </button>
            `;
            return;
        }
        
        document.getElementById('qNum').textContent = currentQuestion + 1;
        
        let buttons = q.a.map((answer, index) => 
            `<button onclick="checkAnswer(${index})" 
                    style="display:block;width:100%;max-width:300px;margin:10px auto;padding:15px;
                           background:rgba(255,255,255,0.1);border:2px solid #9b59b6;border-radius:10px;
                           color:white;font-size:1rem;cursor:pointer;transition:all 0.3s;">
                ${answer}
            </button>`
        ).join('');
        
        content.innerHTML = `
            <h3 style="margin-bottom:30px;font-size:1.3rem;">${q.q}</h3>
            ${buttons}
        `;
    }
    
    window.checkAnswer = function(index) {
        const q = questions[currentQuestion];
        if (index === q.correct) {
            score++;
            document.getElementById('quizScore').textContent = score;
        }
        currentQuestion++;
        showQuestion();
    };
}

// 页面加载完成
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎨 绫月奶萝粉丝站已加载');
});