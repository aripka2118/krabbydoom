'use strict';
// ---------------------------------------------------------------------------
// Input
// ---------------------------------------------------------------------------
const keys = {};
let mouseDX = 0, mouseDown = false;
const locked = () => document.pointerLockElement === cv;
function lock() { try { const p = cv.requestPointerLock(); if (p && p.catch) p.catch(() => {}); } catch (e) {} }
function begin(key) {
  loadLevel(key); reset(); state = 'play';
  for (const k in keys) keys[k] = false;
  mouseDown = false;
  say(LEVELS[key].intro, 3);
}
addEventListener('keydown', e => {
  keys[e.code] = true;
  if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) e.preventDefault();
  if (state !== 'play') { if (!e.repeat) menuKey(e.code); return; }
  if (e.code === 'KeyM') showMap = !showMap;
  if (e.code === 'Escape') setScreen('paused');
});
addEventListener('keyup', e => { keys[e.code] = false; });
addEventListener('blur', () => { for (const k in keys) keys[k] = false; mouseDown = false; });
// Esc while the mouse is captured releases it without a keydown, so pause on release too
document.addEventListener('pointerlockchange', () => { if (!locked() && state === 'play') setScreen('paused'); });
cv.addEventListener('mousedown', e => {
  initAudio();
  if (state !== 'play') { const i = menuHit(e); if (i >= 0) menuItems()[i].go(); return; }
  if (!locked()) lock();
  if (e.button === 0) mouseDown = true;
});
addEventListener('mouseup', () => { mouseDown = false; });
addEventListener('mousemove', e => {
  if (locked()) mouseDX += e.movementX;
  else if (state !== 'play') { const i = menuHit(e); if (i >= 0) menuSel = i; }
});
