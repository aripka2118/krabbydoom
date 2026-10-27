'use strict';
// ---------------------------------------------------------------------------
// Menus: main menu, extras (test arenas), pause and win/lose screens
// ---------------------------------------------------------------------------
let menuSel = 0;
const BTN_W = 170, BTN_H = 20, BTN_GAP = 6;

function startGame(key) { initAudio(); begin(key); lock(); }
function toMenu() { loadLevel('main'); reset(); state = 'menu'; menuSel = 0; }
function setScreen(s) { state = s; menuSel = 0; }

function menuItems() {
  switch (state) {
    case 'menu': return [
      { label: 'PLAY', go: () => startGame('main') },
      { label: 'EXTRAS', go: () => setScreen('extras') },
    ];
    case 'extras': return [
      { label: 'ANCHOVY ARENA', go: () => startGame('anchovy') },
      { label: 'BUBBLE BASS ARENA', go: () => startGame('bass') },
      { label: 'FRED ARENA', go: () => startGame('fred') },
      { label: 'BACK', go: () => setScreen('menu') },
    ];
    case 'paused': return [
      { label: 'RESUME', go: () => { state = 'play'; lock(); } },
      { label: 'MAIN MENU', go: toMenu },
    ];
    case 'win': case 'dead': return [
      { label: 'PLAY AGAIN', go: () => startGame(currentLevel) },
      { label: 'MAIN MENU', go: toMenu },
    ];
  }
  return [];
}
const menuTop = () => ({ menu: 120, extras: 86, paused: 110 }[state] || 150);
function menuRect(i) { return { x: (W - BTN_W) / 2, y: menuTop() + i * (BTN_H + BTN_GAP), w: BTN_W, h: BTN_H }; }

// Which button is under a mouse event (canvas is letterboxed by object-fit: contain)
function menuHit(e) {
  const r = cv.getBoundingClientRect(), s = Math.min(r.width / W, r.height / H);
  const x = (e.clientX - r.left - (r.width - W * s) / 2) / s, y = (e.clientY - r.top - (r.height - H * s) / 2) / s;
  return menuItems().findIndex((_, i) => { const b = menuRect(i); return x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h; });
}
function menuKey(code) {
  const items = menuItems(), n = items.length;
  if (!n) return;
  if (code === 'ArrowUp' || code === 'KeyW') menuSel = (menuSel + n - 1) % n;
  else if (code === 'ArrowDown' || code === 'KeyS') menuSel = (menuSel + 1) % n;
  else if (code === 'Enter' || code === 'Space') items[Math.min(menuSel, n - 1)].go();
  else if (code === 'Escape' && state === 'extras') setScreen('menu');
  else if (code === 'KeyR' && (state === 'win' || state === 'dead')) items[0].go();
}

function drawMenu() {
  ctx.fillStyle = 'rgba(0,18,36,.7)'; ctx.fillRect(0, 0, W, H);
  if (state === 'menu') {
    ctx.drawImage(TEX.patty.cv, W / 2 - 172, 26, 40, 40);
    ctx.drawImage(TEX.patty.cv, W / 2 + 132, 26, 40, 40);
    txt('KRABBY DOOM', W / 2, 60, 34, '#ffd84a');
    txt('The fish of Bikini Bottom are HUNGRY. Feed them all!', W / 2, 88, 11, '#e8f6ff');
    txt('WASD / Arrows - move    Mouse or Q / E - turn    Shift - run', W / 2, 206, 10, '#bfe6ff');
    txt('Click / Space - throw Krabby Patty    M - map    Esc - pause', W / 2, 221, 10, '#bfe6ff');
  } else if (state === 'extras') {
    txt('EXTRAS', W / 2, 46, 28, '#ffd84a');
    txt('Test arenas: one fish each', W / 2, 68, 11, '#e8f6ff');
    const notes = ['Anchovy: fast runner, 1 patty', 'Bubble Bass: slow, hits hard, 5 patties', 'Fred: throws his leg, 3 patties'];
    if (menuSel < 3) txt(notes[menuSel], W / 2, 210, 11, '#bfe6ff');
  } else if (state === 'paused') {
    txt('PAUSED', W / 2, 70, 30, '#ffd84a');
    txt(LEVELS[currentLevel].name + '   -   Fish fed: ' + fedCount + ' / ' + fish.length, W / 2, 92, 11, '#e8f6ff');
  } else if (state === 'win') {
    txt('ORDER UP!', W / 2, 70, 34, '#7dff8a');
    txt('Every fish in ' + LEVELS[currentLevel].name + ' is full and happy.', W / 2, 100, 11, '#e8f6ff');
    txt('Moisture left: ' + Math.ceil(P.hp) + '%     Patties left: ' + P.ammo, W / 2, 117, 11, '#e8f6ff');
  } else if (state === 'dead') {
    txt('YOU DRIED OUT!', W / 2, 70, 34, '#ff7a5a');
    txt('Too many nibbles... you need more water!', W / 2, 100, 11, '#e8f6ff');
    txt('Fish fed: ' + fedCount + ' / ' + fish.length, W / 2, 117, 11, '#e8f6ff');
  }
  menuItems().forEach((it, i) => {
    const b = menuRect(i), on = i === menuSel;
    ctx.fillStyle = on ? '#ffd84a' : 'rgba(10,40,70,.9)'; ctx.fillRect(b.x, b.y, b.w, b.h);
    ctx.strokeStyle = '#ffd84a'; ctx.lineWidth = 1; ctx.strokeRect(b.x + .5, b.y + .5, b.w - 1, b.h - 1);
    ctx.font = 'bold 12px "Trebuchet MS", Verdana, sans-serif'; ctx.textAlign = 'center';
    ctx.fillStyle = on ? '#3a2400' : '#fff'; ctx.fillText(it.label, W / 2, b.y + 14.5);
  });
}
