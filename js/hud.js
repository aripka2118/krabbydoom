'use strict';
// ---------------------------------------------------------------------------
// HUD, viewmodel hand & overlays
// ---------------------------------------------------------------------------
function txt(s, x, y, size, col, align = 'center') {
  ctx.font = `bold ${size}px "Trebuchet MS", Verdana, sans-serif`;
  ctx.textAlign = align;
  ctx.fillStyle = '#000'; ctx.fillText(s, x + 1, y + 1);
  ctx.fillStyle = col; ctx.fillText(s, x, y);
}
function ell(x, y, rx, ry, fill, stroke, rot = 0) {
  ctx.beginPath(); ctx.ellipse(x, y, Math.max(.1, rx), Math.max(.1, ry), rot, 0, 7);
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (stroke) { ctx.strokeStyle = stroke; ctx.stroke(); }
}

function drawHand() {
  const ph = P.throwT > 0 ? 1 - P.throwT : 0;
  const push = Math.sin(ph * Math.PI);
  const bx = Math.cos(P.bob) * 5, by = Math.abs(Math.sin(P.bob)) * 5;
  const hx = W * .64 + bx - push * 46, hy = H - 92 + by - push * 34, sc = 1 - push * .25;
  const hold = (ph > 0 && ph < .15) || (P.ammo > 0 && (ph === 0 || ph > .85));
  ctx.lineCap = 'round';
  // arm
  ctx.beginPath(); ctx.moveTo(W * .64 + 58 + bx * .5, H - 30); ctx.lineTo(hx + 6, hy + 18);
  ctx.strokeStyle = '#a89418'; ctx.lineWidth = 11 * sc; ctx.stroke();
  ctx.strokeStyle = '#f6e23c'; ctx.lineWidth = 7.5 * sc; ctx.stroke();
  // shirt sleeve
  ctx.lineWidth = 1.5;
  ell(W * .64 + 58 + bx * .5, H - 40 + by * .3, 20, 12, '#fbfbf5', '#9a9a90', -.4);
  // palm
  ell(hx, hy + 13, 15 * sc, 12 * sc, '#f6e23c', '#a89418');
  ctx.fillStyle = '#c9b61e';
  for (const [ox, oy, r] of [[-6, 16, 2], [5, 19, 1.5], [7, 9, 1.8], [-2, 21, 1.2]]) { ctx.beginPath(); ctx.arc(hx + ox * sc, hy + oy * sc, r * sc, 0, 7); ctx.fill(); }
  if (hold) ctx.drawImage(TEX.patty.cv, hx - 22 * sc, hy - 24 * sc, 44 * sc, 44 * sc);
  // fingers
  for (let i = 0; i < 4; i++) {
    const fx_ = hx - 13 * sc + i * 8 * sc;
    if (hold) ell(fx_, hy + 7 * sc, 3.2 * sc, 4.5 * sc, '#f6e23c', '#a89418');
    else ell(fx_ - (1.5 - i) * 2, hy - 2 * sc, 3.2 * sc, 8 * sc, '#f6e23c', '#a89418', (i - 1.5) * .25);
  }
  ell(hx - 16 * sc, hy + 10 * sc, 4 * sc, 7 * sc, '#f6e23c', '#a89418', .6);
}

function drawFace(x, y) {
  const s = 26, hurt = P.hurt > .2 || P.hp < 25, happy = P.grin > 0;
  ctx.fillStyle = '#f4e04a'; ctx.fillRect(x, y, s, s + 2);
  ctx.fillStyle = '#bfae25';
  for (const [a, b, r] of [[3, 4, 1.5], [22, 22, 2], [4, 23, 1.2], [23, 4, 1.2], [13, 26, 1]]) { ctx.beginPath(); ctx.arc(x + a, y + b, r, 0, 7); ctx.fill(); }
  const look = hurt ? 0 : Math.sin(time * .8) * 1.2;
  for (const ex of [8, 18]) {
    ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(x + ex, y + 8, hurt ? 4 : 5, 0, 7); ctx.fill();
    ctx.fillStyle = '#3d8de0'; ctx.beginPath(); ctx.arc(x + ex + look, y + 8, 2.5, 0, 7); ctx.fill();
    ctx.fillStyle = '#000'; ctx.beginPath(); ctx.arc(x + ex + look, y + 8, 1.1, 0, 7); ctx.fill();
  }
  ctx.fillStyle = '#e8cf30'; ctx.beginPath(); ctx.ellipse(x + 13, y + 13, 2.2, 1.6, 0, 0, 7); ctx.fill();
  ctx.fillStyle = 'rgba(240,110,110,.8)';
  ctx.beginPath(); ctx.arc(x + 3, y + 16, 2, 0, 7); ctx.fill();
  ctx.beginPath(); ctx.arc(x + 23, y + 16, 2, 0, 7); ctx.fill();
  if (hurt) {
    ctx.strokeStyle = '#7a1010'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(x + 13, y + 24, 5, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke();
  } else {
    const r = happy ? 8 : 7;
    ctx.fillStyle = '#8a1a1a'; ctx.beginPath(); ctx.arc(x + 13, y + 14, r, .15 * Math.PI, .85 * Math.PI); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#fff'; ctx.fillRect(x + 10, y + 17, 2.5, 3); ctx.fillRect(x + 13.5, y + 17, 2.5, 3);
  }
  ctx.strokeStyle = '#8a7a10'; ctx.lineWidth = 1; ctx.strokeRect(x + .5, y + .5, s, s + 2);
}

function drawMap() {
  const cs = 4, ox = W - MW * cs - 6, oy = 6;
  ctx.fillStyle = 'rgba(0,0,0,.55)'; ctx.fillRect(ox - 2, oy - 2, MW * cs + 4, MH * cs + 4);
  const col = { '#': '#b8577f', P: '#e9921f', W: '#8b5a2b', K: '#5d7186' };
  for (let y = 0; y < MH; y++) for (let x = 0; x < MW; x++) {
    const c = col[MAP[y][x]];
    if (c) { ctx.fillStyle = c; ctx.fillRect(ox + x * cs, oy + y * cs, cs, cs); }
  }
  for (const it of items) if (!it.taken) { ctx.fillStyle = it.kind === 'ammo' ? '#ffd23a' : '#7fd4f5'; ctx.fillRect(ox + it.x * cs - 1, oy + it.y * cs - 1, 2, 2); }
  for (const f of fish) { ctx.fillStyle = f.fed ? '#5f5' : '#f44'; ctx.fillRect(ox + f.x * cs - 1.5, oy + f.y * cs - 1.5, 3, 3); }
  ctx.strokeStyle = '#fff'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(ox + P.x * cs, oy + P.y * cs); ctx.lineTo(ox + (P.x + Math.cos(P.a) * 1.5) * cs, oy + (P.y + Math.sin(P.a) * 1.5) * cs); ctx.stroke();
  ctx.fillStyle = '#ffe94a'; ctx.fillRect(ox + P.x * cs - 1.5, oy + P.y * cs - 1.5, 3, 3);
}

function drawHUD() {
  if (P.hurt > 0) { ctx.fillStyle = `rgba(255,70,40,${P.hurt * .45})`; ctx.fillRect(0, 0, W, H); }
  if (P.glow > 0) { ctx.fillStyle = `rgba(255,230,120,${P.glow * .35})`; ctx.fillRect(0, 0, W, H); }
  drawHand();
  // crosshair
  ctx.fillStyle = 'rgba(255,255,255,.85)';
  ctx.fillRect(W / 2 - 1, HZ - 5, 2, 3); ctx.fillRect(W / 2 - 1, HZ + 2, 2, 3);
  ctx.fillRect(W / 2 - 5, HZ - 1, 3, 2); ctx.fillRect(W / 2 + 2, HZ - 1, 3, 2);
  // status bar
  ctx.fillStyle = '#0d2a44'; ctx.fillRect(0, H - 34, W, 34);
  ctx.fillStyle = '#ffd84a'; ctx.fillRect(0, H - 34, W, 2);
  drawFace(8, H - 31);
  txt('MOISTURE', 42, H - 20, 9, '#9fe3ff', 'left');
  txt(Math.ceil(P.hp) + '%', 42, H - 6, 14, P.hp < 30 ? '#ff6a5a' : '#fff', 'left');
  ctx.fillStyle = '#123'; ctx.fillRect(100, H - 16, 60, 6);
  ctx.fillStyle = P.hp < 30 ? '#ff6a5a' : '#5cc6f2'; ctx.fillRect(100, H - 16, 60 * P.hp / 100, 6);
  ctx.drawImage(TEX.patty.cv, W / 2 - 42, H - 32, 30, 30);
  txt('PATTIES', W / 2 - 8, H - 20, 9, '#ffd23a', 'left');
  txt('' + P.ammo, W / 2 - 8, H - 6, 14, P.ammo ? '#fff' : '#ff6a5a', 'left');
  txt('FISH FED', W - 10, H - 20, 9, '#ffd84a', 'right');
  txt(fedCount + ' / ' + fish.length, W - 10, H - 6, 14, '#fff', 'right');
  if (msgT > 0) txt(message, W / 2, 22, 12, '#fff6b0');
  if (showMap) drawMap();
  if (!locked()) txt('Click to capture mouse  (or use arrows / Q E to turn)', W / 2, H - 42, 9, 'rgba(255,255,255,.8)');
}

function overlay(title, col, lines, prompt) {
  ctx.fillStyle = 'rgba(0,18,36,.68)'; ctx.fillRect(0, 0, W, H);
  txt(title, W / 2, 62, 34, col);
  lines.forEach((l, i) => txt(l, W / 2, 96 + i * 17, 11, '#e8f6ff'));
  if (Math.floor(time * 2) % 2 === 0) txt(prompt, W / 2, 232, 15, '#ffd84a');
}

function render() {
  renderWorld();
  if (state === 'play') { drawHUD(); return; }
  if (state === 'title') {
    overlay('KRABBY DOOM', '#ffd84a', [
      'The fish of Bikini Bottom are HUNGRY. Feed them all!',
      'Hungry fish nibble you and dry you out. Patties make them happy.',
      'WASD / Arrows - move     Mouse or Q / E - turn     Shift - run',
      'Click / Space - throw Krabby Patty     M - map',
      'Bubble Bass: slow, hits hard, needs 5.   Fred: throws his leg! Needs 3.',
    ], 'CLICK TO START');
    ctx.drawImage(TEX.patty.cv, W / 2 - 24, 186, 48, 48);
  } else if (state === 'win') {
    overlay('ORDER UP!', '#7dff8a', ['Every fish in Bikini Bottom is full and happy.', 'Moisture left: ' + Math.ceil(P.hp) + '%     Patties left: ' + P.ammo], 'CLICK OR PRESS R TO PLAY AGAIN');
  } else {
    overlay('YOU DRIED OUT!', '#ff7a5a', ['Too many nibbles... you need more water!', 'Fish fed: ' + fedCount + ' / ' + fish.length], 'CLICK OR PRESS R TO TRY AGAIN');
  }
}
