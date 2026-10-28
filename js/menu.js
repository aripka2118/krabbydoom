'use strict';
// ---------------------------------------------------------------------------
// Menus: main menu, world + level select, extras (test arenas), pause and win/lose screens
// ---------------------------------------------------------------------------
let menuSel = 0, menuWorld = 0;
const BTN_W = 210, BTN_H = 20, BTN_GAP = 6;
const MENU_SCREENS = ['menu', 'worlds', 'levels', 'extras'];

function startGame(key) { initAudio(); begin(key); lock(); }
function toMenu(s = 'menu') { loadLevel(MENU_LEVEL); reset(); state = s; menuSel = 0; }
function setScreen(s) { state = s; menuSel = 0; }
function toLevels(w) { menuWorld = w; setScreen('levels'); }
const lvlTitle = k => LEVELS[k].title || LEVELS[k].name;

function menuItems() {
  const lvl = LEVELS[currentLevel], inWorld = lvl.world != null;
  const levelSelect = { label: 'LEVEL SELECT', go: () => { toMenu('levels'); menuWorld = lvl.world; } };
  switch (state) {
    case 'menu': return [
      { label: 'PLAY', go: () => setScreen('worlds') },
      { label: 'MAP TEST', bad: !LEVELS.test || LEVELS.test.problems.length > 0,
        go: () => { if (LEVELS.test && !LEVELS.test.problems.length) startGame('test'); } },
      { label: 'EXTRAS', go: () => setScreen('extras') },
    ];
    case 'worlds': return [
      ...WORLDS.map((w, i) => ({ label: 'WORLD ' + (i + 1) + ': ' + w.name.toUpperCase(), go: () => toLevels(i) })),
      { label: 'BACK', go: () => setScreen('menu') },
    ];
    case 'levels': return [
      ...WORLDS[menuWorld].keys.map((k, i) => ({
        label: 'LEVEL ' + (i + 1) + ': ' + LEVELS[k].name.toUpperCase(),
        bad: LEVELS[k].problems.length > 0,
        go: () => { if (!LEVELS[k].problems.length) startGame(k); },
      })),
      { label: 'BACK', go: () => setScreen('worlds') },
    ];
    case 'extras': return [
      { label: 'ANCHOVY ARENA', go: () => startGame('anchovy') },
      { label: 'BUBBLE BASS ARENA', go: () => startGame('bass') },
      { label: 'FRED ARENA', go: () => startGame('fred') },
      { label: 'DOOR & KEY TEST', go: () => startGame('doors') },
      { label: 'HOUSE TEST', go: () => startGame('house') },
      { label: 'BACK', go: () => setScreen('menu') },
    ];
    case 'paused': return [
      { label: 'RESUME', go: () => { state = 'play'; lock(); } },
      { label: 'RESTART', go: () => startGame(currentLevel) },
      ...(inWorld ? [levelSelect] : []),
      { label: 'MAIN MENU', go: () => toMenu() },
    ];
    case 'win': case 'dead': {
      const next = state === 'win' && nextLevel(currentLevel);
      return [
        ...(next ? [{ label: 'NEXT LEVEL', go: () => startGame(next) }] : []),
        { label: state === 'win' ? 'PLAY AGAIN' : 'TRY AGAIN', go: () => startGame(currentLevel) },
        ...(inWorld ? [levelSelect] : []),
        { label: 'MAIN MENU', go: () => toMenu() },
      ];
    }
  }
  return [];
}
const menuTop = () => ({ menu: 120, worlds: 90, levels: 70, extras: 78, paused: 104, win: 140 }[state] || 150);
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
  else if (code === 'Escape' && (state === 'extras' || state === 'worlds')) setScreen('menu');
  else if (code === 'Escape' && state === 'levels') setScreen('worlds');
  else if (code === 'KeyR' && (state === 'win' || state === 'dead')) startGame(currentLevel);
}

function drawMenu() {
  ctx.fillStyle = 'rgba(0,18,36,.7)'; ctx.fillRect(0, 0, W, H);
  const items = menuItems();
  if (state === 'menu') {
    ctx.drawImage(TEX.patty.cv, W / 2 - 172, 26, 40, 40);
    ctx.drawImage(TEX.patty.cv, W / 2 + 132, 26, 40, 40);
    txt('KRABBY DOOM', W / 2, 60, 34, '#ffd84a');
    txt('The fish of Bikini Bottom are HUNGRY. Feed them all!', W / 2, 88, 11, '#e8f6ff');
    if (menuSel === 1) {
      const t = LEVELS.test;
      if (!t) txt('js/worlds/testmap.js is missing', W / 2, 212, 10, '#ff7a5a');
      else if (t.problems.length) txt('Map problem: ' + t.problems[0], W / 2, 212, 10, '#ff7a5a');
      else txt('Walk around js/worlds/testmap.js (refresh the page after saving it)', W / 2, 212, 10, '#7dff8a');
    }
    txt('WASD / Arrows - move    Mouse or Q / E - turn    Shift - run', W / 2, 232, 10, '#bfe6ff');
    txt('Click / Space - throw Krabby Patty    M - map    Esc - pause', W / 2, 247, 10, '#bfe6ff');
  } else if (state === 'worlds') {
    txt('SELECT WORLD', W / 2, 50, 28, '#ffd84a');
    txt('More worlds coming soon!', W / 2, 72, 11, '#e8f6ff');
  } else if (state === 'levels') {
    txt('WORLD ' + (menuWorld + 1), W / 2, 38, 26, '#ffd84a');
    txt(WORLDS[menuWorld].name, W / 2, 58, 11, '#e8f6ff');
    const k = WORLDS[menuWorld].keys[menuSel];
    if (k && LEVELS[k].problems.length) txt('Map problem: ' + LEVELS[k].problems[0], W / 2, 240, 10, '#ff7a5a');
    else if (k) txt(LEVELS[k].intro, W / 2, 240, 11, '#bfe6ff');
  } else if (state === 'extras') {
    txt('EXTRAS', W / 2, 40, 28, '#ffd84a');
    txt('Test arenas for each fish and mechanic', W / 2, 62, 11, '#e8f6ff');
    const notes = ['Anchovy: fast runner, 1 patty', 'Bubble Bass: slow, hits hard, 5 patties', 'Fred: throws his leg, 3 patties',
      'Red, yellow and blue keys open their doors', "SpongeBob's house: walls, furniture and Gary"];
    if (menuSel < notes.length) txt(notes[menuSel], W / 2, 250, 11, '#bfe6ff');
  } else if (state === 'paused') {
    txt('PAUSED', W / 2, 70, 30, '#ffd84a');
    txt(lvlTitle(currentLevel) + '   -   Fish fed: ' + fedCount + ' / ' + fish.length, W / 2, 92, 11, '#e8f6ff');
  } else if (state === 'win') {
    const l = LEVELS[currentLevel], worldDone = l.world != null && !nextLevel(currentLevel);
    txt(worldDone ? 'WORLD COMPLETE!' : 'ORDER UP!', W / 2, 62, 34, '#7dff8a');
    txt('Every fish in ' + l.name + ' is full and happy.', W / 2, 92, 11, '#e8f6ff');
    txt('Moisture left: ' + Math.ceil(P.hp) + '%     Patties left: ' + P.ammo, W / 2, 109, 11, '#e8f6ff');
  } else if (state === 'dead') {
    txt('YOU DRIED OUT!', W / 2, 70, 34, '#ff7a5a');
    txt('Too many nibbles... you need more water!', W / 2, 100, 11, '#e8f6ff');
    txt('Fish fed: ' + fedCount + ' / ' + fish.length, W / 2, 117, 11, '#e8f6ff');
  }
  items.forEach((it, i) => {
    const b = menuRect(i), on = i === menuSel;
    ctx.fillStyle = on ? (it.bad ? '#ff7a5a' : '#ffd84a') : 'rgba(10,40,70,.9)'; ctx.fillRect(b.x, b.y, b.w, b.h);
    ctx.strokeStyle = it.bad ? '#ff7a5a' : '#ffd84a'; ctx.lineWidth = 1; ctx.strokeRect(b.x + .5, b.y + .5, b.w - 1, b.h - 1);
    ctx.font = 'bold 12px "Trebuchet MS", Verdana, sans-serif'; ctx.textAlign = 'center';
    ctx.fillStyle = on ? '#3a2400' : it.bad ? '#ff9a80' : '#fff'; ctx.fillText(it.label, W / 2, b.y + 14.5);
  });
}
