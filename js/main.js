// 绫月乃萝 Fan Site — main.js (三主题 + 可视化编辑 + Emoji瀑布)

// ===== EMOJI FILES =====
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

// ===== CONFIG =====
const DEFAULT_CONFIG = {
    homeMode: 'art', theme: 'dark', heroImage: 'images/pixiv_hd_1.jpg',
    emojiDir: 'vertical', emojiCols: 12, emojiSpeed: 30, emojiOpacity: 0.6,
    galleryCols: 3, galleryGap: 16,
};

let CONFIG = { ...DEFAULT_CONFIG, ...(JSON.parse(localStorage.getItem('nora_config') || '{}')) };

function saveConfig() { localStorage.setItem('nora_config', JSON.stringify(CONFIG)); }

// ===== INIT =====
// Apply theme
document.body.setAttribute('data-theme', CONFIG.theme);

// Apply hero image
const heroBg = document.getElementById('heroBg');
if (heroBg) heroBg.style.backgroundImage = `url('${CONFIG.heroImage}')`;

// Apply home mode
applyHomeMode(CONFIG.homeMode);

// Apply gallery
const masonryGrid = document.getElementById('masonryGrid');
if (masonryGrid) { masonryGrid.style.columns = CONFIG.galleryCols; masonryGrid.style.columnGap = CONFIG.galleryGap + 'px'; }

// Update settings panel values
function syncSettingsUI() {
    document.querySelectorAll('.sp-mode-btn').forEach(b => b.classList.toggle('active', b.dataset.mode === CONFIG.homeMode));
    document.querySelectorAll('.sp-theme-btn').forEach(b => b.classList.toggle('active', b.dataset.theme === CONFIG.theme));
    document.querySelectorAll('.sp-dir-btn').forEach(b => b.classList.toggle('active', b.dataset.dir === CONFIG.emojiDir));
    const colsSlider = document.getElementById('spGalleryCols');
    const speedSlider = document.getElementById('spEmojiSpeed');
    const opSlider = document.getElementById('spEmojiOpacity');
    if (colsSlider) { colsSlider.value = CONFIG.galleryCols; document.getElementById('spGalleryColsVal').textContent = CONFIG.galleryCols; }
    if (speedSlider) { speedSlider.value = CONFIG.emojiSpeed; document.getElementById('spEmojiSpeedVal').textContent = CONFIG.emojiSpeed + 's'; }
    if (opSlider) { opSlider.value = Math.round(CONFIG.emojiOpacity * 10); document.getElementById('spEmojiOpacityVal').textContent = CONFIG.emojiOpacity; }
}

// ===== SIDEBAR NAV =====
const navToggle = document.getElementById('navToggle');
const sideNav = document.getElementById('sideNav');
navToggle.addEventListener('click', () => sideNav.classList.toggle('open'));
document.querySelectorAll('.nav-menu a').forEach(link => link.addEventListener('click', () => sideNav.classList.remove('open')));
document.addEventListener('click', (e) => { if (sideNav.classList.contains('open') && !sideNav.contains(e.target)) sideNav.classList.remove('open'); });

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
});

// Nav highlight
window.addEventListener('scroll', () => {
    let current = '';
    document.querySelectorAll('section').forEach(s => { if (scrollY >= s.offsetTop - 300) current = s.id; });
    document.querySelectorAll('.nav-menu a').forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });
});

// ===== HOME MODE =====
function applyHomeMode(mode) {
    const art = document.getElementById('heroModeArt');
    const emoji = document.getElementById('heroModeEmoji');
    if (mode === 'emoji') {
        art.style.display = 'none'; emoji.style.display = 'block';
        buildEmojiWaterfall();
    } else {
        art.style.display = 'block'; emoji.style.display = 'none';
    }
}

function setHomeMode(mode) {
    CONFIG.homeMode = mode; saveConfig(); applyHomeMode(mode); syncSettingsUI();
}

// ===== THEME =====
function setTheme(theme) {
    CONFIG.theme = theme; saveConfig();
    document.body.setAttribute('data-theme', theme); syncSettingsUI();
}

// ===== EMOJI WATERFALL (修复跳帧) =====
let emojiAnimId = null;

function buildEmojiWaterfall() {
    const container = document.getElementById('emojiWaterfall');
    if (!container) return;
    container.innerHTML = '';
    container.className = 'emoji-waterfall ' + CONFIG.emojiDir;

    const columnCount = CONFIG.emojiCols || 12;
    const baseSpeed = CONFIG.emojiSpeed || 30;
    const imgOpacity = CONFIG.emojiOpacity || 0.6;
    container.style.setProperty('--emoji-opacity', imgOpacity);

    for (let col = 0; col < columnCount; col++) {
        const colEl = document.createElement('div');
        colEl.className = 'emoji-column' + (col % 2 === 1 ? ' reverse' : '');
        const duration = baseSpeed + (Math.random() - 0.5) * 10;
        colEl.style.setProperty('--scroll-duration', duration + 's');

        const shuffled = shuffleArray(EMOJI_FILES);
        // 重复3次确保内容足够，无缝滚动
        const tripled = [...shuffled, ...shuffled, ...shuffled];
        tripled.forEach(file => {
            const img = document.createElement('img');
            img.src = EMOJI_DIR + file; img.alt = ''; img.loading = 'lazy';
            colEl.appendChild(img);
        });
        container.appendChild(colEl);
    }
}

function setEmojiDir(dir) {
    CONFIG.emojiDir = dir; saveConfig();
    const container = document.getElementById('emojiWaterfall');
    if (container) { container.className = 'emoji-waterfall ' + dir; }
    syncSettingsUI();
}

function setEmojiSpeed(val) {
    CONFIG.emojiSpeed = parseInt(val); saveConfig();
    document.getElementById('spEmojiSpeedVal').textContent = val + 's';
    buildEmojiWaterfall();
}

function setEmojiOpacity(val) {
    CONFIG.emojiOpacity = parseInt(val) / 10; saveConfig();
    document.getElementById('spEmojiOpacityVal').textContent = CONFIG.emojiOpacity;
    document.getElementById('emojiWaterfall').style.setProperty('--emoji-opacity', CONFIG.emojiOpacity);
}

function setGalleryCols(val) {
    CONFIG.galleryCols = parseInt(val); saveConfig();
    document.getElementById('spGalleryColsVal').textContent = val;
    if (masonryGrid) masonryGrid.style.columns = val;
}

// ===== SETTINGS PANEL =====
function toggleSettingsPanel() {
    const panel = document.getElementById('settingsPanel');
    const visible = panel.style.display !== 'none';
    panel.style.display = visible ? 'none' : 'block';
    if (!visible) syncSettingsUI();
}

// ===== VISUAL EDIT MODE =====
let editMode = false;
const editPopup = document.createElement('div');
editPopup.className = 'edit-popup';
editPopup.innerHTML = `
    <div id="editPopupContent"></div>
    <div class="edit-popup-btns">
        <button class="confirm" onclick="confirmEdit()">✓</button>
        <button class="cancel" onclick="cancelEdit()">✕</button>
    </div>
`;
document.body.appendChild(editPopup);

let currentEditTarget = null;
let currentEditType = null;

function enterEditMode() {
    editMode = true;
    document.body.classList.add('edit-mode');
    document.getElementById('editOverlay').style.display = 'block';
    document.getElementById('settingsPanel').style.display = 'none';
    // Disable scroll
    document.body.style.overflow = 'auto';
}

function toggleEditMode() {
    if (editMode) {
        editMode = false;
        document.body.classList.remove('edit-mode');
        document.getElementById('editOverlay').style.display = 'none';
        cancelEdit();
    } else {
        enterEditMode();
    }
}

function saveEdits() {
    saveConfig();
    editMode = false;
    document.body.classList.remove('edit-mode');
    document.getElementById('editOverlay').style.display = 'none';
    cancelEdit();
    showToast('✓ 已保存');
}

// Click handler for editable elements
document.addEventListener('click', (e) => {
    if (!editMode) return;
    e.preventDefault(); e.stopPropagation();

    const editable = e.target.closest('[data-editable]');
    const editableImg = e.target.closest('[data-editable-img]');
    const editableLink = e.target.closest('[data-editable-link]');

    if (editable) {
        showEditPopup(e, 'text', editable);
    } else if (editableImg) {
        const imgEl = editableImg.tagName === 'IMG' ? editableImg : editableImg.querySelector('img');
        showEditPopup(e, 'img', imgEl);
    } else if (editableLink) {
        showEditPopup(e, 'link', editableLink);
    }
});

function showEditPopup(e, type, target) {
    currentEditTarget = target;
    currentEditType = type;
    const popup = editPopup;
    const content = document.getElementById('editPopupContent');
    const rect = e.target.getBoundingClientRect();
    const px = Math.min(rect.right + 10, window.innerWidth - 280);
    const py = Math.max(rect.top - 10, 10);

    popup.style.left = px + 'px';
    popup.style.top = py + 'px';

    if (type === 'text') {
        content.innerHTML = `<label>编辑文字</label><input type="text" id="editInput" value="${target.textContent.trim()}">`;
    } else if (type === 'img') {
        const src = target.tagName === 'DIV' ? target.style.backgroundImage.replace(/url\(['"]?|['"]?\)/g, '') : target.src;
        content.innerHTML = `<label>图片路径</label><input type="text" id="editInput" value="${src}">`;
    } else if (type === 'link') {
        content.innerHTML = `<label>链接地址</label><input type="text" id="editInput" value="${target.href}">`;
    }

    popup.classList.add('active');
    setTimeout(() => document.getElementById('editInput').focus(), 50);
}

function confirmEdit() {
    const val = document.getElementById('editInput').value;
    if (currentEditType === 'text') {
        currentEditTarget.textContent = val;
    } else if (currentEditType === 'img') {
        if (currentEditTarget.tagName === 'DIV') {
            currentEditTarget.style.backgroundImage = `url('${val}')`;
            if (currentEditTarget.id === 'heroBg') CONFIG.heroImage = val;
        } else {
            currentEditTarget.src = val;
        }
    } else if (currentEditType === 'link') {
        currentEditTarget.href = val;
    }
    editPopup.classList.remove('active');
    currentEditTarget = null;
}

function cancelEdit() {
    editPopup.classList.remove('active');
    currentEditTarget = null;
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        cancelEdit();
        if (editMode) toggleEditMode();
        lightbox.classList.remove('active');
    }
    if (e.key === 'Enter' && editPopup.classList.contains('active')) confirmEdit();
});

// ===== TOAST =====
function showToast(msg) {
    let toast = document.getElementById('toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast';
        toast.style.cssText = 'position:fixed;bottom:30px;left:50%;transform:translateX(-50%) translateY(80px);background:var(--accent);color:white;padding:12px 30px;border-radius:50px;font-size:0.85rem;transition:transform 0.4s;z-index:1000;pointer-events:none;';
        document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.style.transform = 'translateX(-50%) translateY(0)';
    setTimeout(() => { toast.style.transform = 'translateX(-50%) translateY(80px)'; }, 2000);
}

function resetAll() {
    if (confirm('确定恢复默认？')) {
        localStorage.removeItem('nora_config');
        location.reload();
    }
}

// ===== SCROLL ANIMATION =====
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const delay = Array.from(entry.target.parentNode.children).indexOf(entry.target) * 80;
            setTimeout(() => entry.target.classList.add('visible'), Math.min(delay, 500));
        }
    });
}, { threshold: 0.1 });
document.querySelectorAll('.masonry-item, .video-card, .game-card, .profile-content').forEach(el => observer.observe(el));

// ===== LIGHTBOX =====
const lightbox = document.createElement('div');
lightbox.className = 'lightbox';
lightbox.innerHTML = '<img src="" alt=""><button class="lightbox-close">&times;</button>';
document.body.appendChild(lightbox);
lightbox.addEventListener('click', () => lightbox.classList.remove('active'));

document.querySelectorAll('.masonry-item img').forEach(img => {
    img.addEventListener('click', () => {
        if (editMode) return;
        lightbox.querySelector('img').src = img.src;
        lightbox.classList.add('active');
    });
});

// ===== GAMES =====
let currentGame = null;
function loadGame(name) {
    const c = document.getElementById('gameContainer'); c.classList.add('active'); c.scrollIntoView({ behavior: 'smooth' });
    if (name === 'memory') initMemoryGame(c); else if (name === 'catch') initCatchGame(c); else if (name === 'quiz') initQuizGame(c);
}
function closeGame() { document.getElementById('gameContainer').classList.remove('active'); currentGame = null; }

function initMemoryGame(c) {
    currentGame = 'memory';
    const cards = ['🎨','🎨','🖌️','🖌️','✨','✨','🌙','🌙','⭐','⭐','💖','💖','🎀','🎀','🌸','🌸'];
    for (let i = cards.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [cards[i], cards[j]] = [cards[j], cards[i]]; }
    c.innerHTML = `<div class="game-header"><h3>MEMORY</h3><div style="color:var(--text-dim);font-family:'Montserrat';font-size:.85rem">Score: <span id="score">0</span> | Moves: <span id="moves">0</span></div><button class="close-game" onclick="closeGame()">×</button></div><div id="memoryGame" style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;max-width:400px;margin:20px auto"></div>`;
    const game = document.getElementById('memoryGame');
    let flipped = [], matched = 0, moves = 0, canFlip = true;
    cards.forEach(emoji => {
        const card = document.createElement('div'); card.dataset.emoji = emoji;
        const inner = document.createElement('div');
        inner.style.cssText = "aspect-ratio:1;background:linear-gradient(135deg,rgba(200,162,232,.2),rgba(255,126,179,.2));border:1px solid var(--border);border-radius:8px;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:1.5rem;transition:all .4s;color:transparent;";
        inner.textContent = emoji; card.appendChild(inner);
        card.addEventListener('click', () => {
            if (!canFlip || flipped.includes(card) || card.dataset.matched) return;
            inner.style.color = 'var(--text)'; inner.style.background = 'rgba(200,162,232,.1)'; flipped.push(card);
            if (flipped.length === 2) { moves++; document.getElementById('moves').textContent = moves; check(); }
        });
        game.appendChild(card);
    });
    function check() {
        canFlip = false; const [a, b] = flipped;
        if (a.dataset.emoji === b.dataset.emoji) {
            matched++; document.getElementById('score').textContent = matched * 10; a.dataset.matched = b.dataset.matched = '1'; flipped = []; canFlip = true;
            if (matched === cards.length / 2) setTimeout(() => alert('🎉 通关！' + moves + '步'), 300);
        } else {
            setTimeout(() => { [a, b].forEach(c => { const i = c.querySelector('div'); i.style.color = 'transparent'; i.style.background = 'linear-gradient(135deg,rgba(200,162,232,.2),rgba(255,126,179,.2))'; }); flipped = []; canFlip = true; }, 800);
        }
    }
}

function initCatchGame(c) {
    currentGame = 'catch';
    c.innerHTML = `<div class="game-header"><h3>CATCH</h3><div style="color:var(--text-dim);font-family:'Montserrat';font-size:.85rem">Score: <span id="catchScore">0</span></div><button class="close-game" onclick="closeGame()">×</button></div><canvas id="gameCanvas" width="480" height="360" style="display:block;margin:0 auto;border-radius:8px;border:1px solid var(--border)"></canvas><p style="text-align:center;color:var(--text-dim);font-size:.8rem;margin-top:10px">← → 移动</p>`;
    const canvas = document.getElementById('gameCanvas'), ctx = canvas.getContext('2d');
    let score = 0, frame = 0, player = {x:215,y:310,w:50,h:50}, stars = [], keys = {};
    document.addEventListener('keydown', e => keys[e.key] = true); document.addEventListener('keyup', e => keys[e.key] = false);
    (function loop() {
        if (!currentGame || currentGame !== 'catch') return;
        ctx.clearRect(0,0,480,360); ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--bg'); ctx.fillRect(0,0,480,360);
        if (keys['ArrowLeft'] && player.x > 0) player.x -= 6; if (keys['ArrowRight'] && player.x < 430) player.x += 6;
        ctx.font = '36px Arial'; ctx.textAlign = 'center'; ctx.fillText('🎨', player.x+25, player.y+35);
        if (frame % 35 === 0) stars.push({x: Math.random()*440, y: 0, s: 2+Math.random()*2.5});
        stars.forEach((s,i) => { s.y += s.s; ctx.font = '24px Arial'; ctx.fillText('⭐', s.x+15, s.y+20);
            if (s.y+20>player.y && s.y<player.y+50 && s.x+15>player.x && s.x<player.x+50) { stars.splice(i,1); score++; document.getElementById('catchScore').textContent = score; }
            if (s.y > 360) stars.splice(i,1); });
        frame++; if (currentGame === 'catch') requestAnimationFrame(loop);
    })();
}

function initQuizGame(c) {
    currentGame = 'quiz';
    const qs = [
        {q:'乃萝的B站UID是？',a:['86471108','12345678','99999999'],c:0},
        {q:'乃萝的Twitter ID是？',a:['@nora_vtuber','@Ayatsuki_Nora','@nora_draw'],c:1},
        {q:'乃萝的职业是？',a:['纯画师','纯主播','兼职画师和主播'],c:2},
        {q:'乃萝的Pixiv ID是？',a:['36966416','12345678','99999999'],c:0},
    ];
    let qi = 0, score = 0;
    c.innerHTML = `<div class="game-header"><h3>QUIZ</h3><div style="color:var(--text-dim);font-family:'Montserrat';font-size:.85rem">Score: <span id="quizScore">0</span> | <span id="qNum">1</span>/${qs.length}</div><button class="close-game" onclick="closeGame()">×</button></div><div id="quizContent" style="text-align:center;padding:20px;max-width:500px;margin:0 auto"></div>`;
    showQ();
    function showQ() {
        const el = document.getElementById('quizContent');
        if (qi >= qs.length) { el.innerHTML = `<h3 style="margin-bottom:20px;color:var(--accent)">完成！</h3><p style="font-size:1.3rem;margin-bottom:30px">${score}/${qs.length}</p><button onclick="initQuizGame(document.getElementById('gameContainer'))" style="padding:12px 30px;background:transparent;border:1px solid var(--accent);border-radius:50px;color:var(--accent);cursor:pointer;font-family:'Montserrat'">RETRY</button>`; return; }
        document.getElementById('qNum').textContent = qi + 1;
        el.innerHTML = `<h3 style="margin-bottom:25px;font-size:1.1rem;font-weight:400">${qs[qi].q}</h3>${qs[qi].a.map((a,i)=>`<button onclick="checkAns(${i})" style="display:block;width:100%;max-width:300px;margin:10px auto;padding:12px;background:var(--card-bg);border:1px solid var(--border);border-radius:8px;color:var(--text);font-size:.95rem;cursor:pointer">${a}</button>`).join('')}`;
    }
    window.checkAns = function(i) { if (i === qs[qi].c) { score++; document.getElementById('quizScore').textContent = score; } qi++; showQ(); };
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => { syncSettingsUI(); console.log('🌙 绫月乃萝 Fan Site loaded'); });
