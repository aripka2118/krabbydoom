'use strict';
// ---------------------------------------------------------------------------
// Input
// ---------------------------------------------------------------------------
const keys = {};
let mouseDX = 0, mouseDown = false;
const locked = () => document.pointerLockElement === cv;
function lock() { try { const p = cv.requestPointerLock(); if (p && p.catch) p.catch(() => {}); } catch (e) {} }
function begin() { reset(); state = 'play'; say('Feed every hungry fish!', 3); }
addEventListener('keydown', e => {
  keys[e.code] = true;
  if (e.code === 'KeyM') showMap = !showMap;
  if ((e.code === 'Enter' || e.code === 'KeyR') && state !== 'play') { initAudio(); begin(); }
  if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) e.preventDefault();
});
addEventListener('keyup', e => { keys[e.code] = false; });
addEventListener('blur', () => { for (const k in keys) keys[k] = false; mouseDown = false; });
cv.addEventListener('mousedown', e => {
  initAudio();
  if (state !== 'play') { begin(); lock(); return; }
  if (!locked()) lock();
  if (e.button === 0) mouseDown = true;
});
addEventListener('mouseup', () => { mouseDown = false; });
addEventListener('mousemove', e => { if (locked()) mouseDX += e.movementX; });
