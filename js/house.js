'use strict';
// ---------------------------------------------------------------------------
// SpongeBob's house: interior walls, floors, ceilings and furniture
// ---------------------------------------------------------------------------
function rrect(g, x, y, w, h, r) { g.beginPath(); g.roundRect(x, y, w, h, r); }
function oval(g, x, y, rx, ry, fill, stroke) {
  g.beginPath(); g.ellipse(x, y, rx, ry, 0, 0, 7);
  if (fill) { g.fillStyle = fill; g.fill(); }
  if (stroke) { g.strokeStyle = stroke; g.stroke(); }
}

// ---- walls ----------------------------------------------------------------
TEX.planksBlue = canvasTex(TS, TS, g => {
  const cols = ['#3ea6cc', '#3497bc', '#47b0d6', '#3a9fc4'];
  for (let i = 0; i < 8; i++) {
    const x = i * 8;
    g.fillStyle = cols[i % 4]; g.fillRect(x, 0, 8, TS);
    g.strokeStyle = 'rgba(25,80,110,.45)'; g.lineWidth = 1;
    for (let k = 0; k < 2; k++) {
      const gx = x + 2 + rnd() * 4;
      g.beginPath(); g.moveTo(gx, 0); g.bezierCurveTo(gx + rnd() * 3 - 1.5, 22, gx + rnd() * 3 - 1.5, 42, gx, 64); g.stroke();
    }
    g.fillStyle = '#1b5a78'; g.fillRect(x, 0, 1, TS);
    g.fillStyle = 'rgba(255,255,255,.12)'; g.fillRect(x + 1, 0, 1, TS);
  }
  for (let i = 0; i < 3; i++) oval(g, 4 + rnd() * 56, 8 + rnd() * 48, 1.5, 3, '#245f7a');
});
TEX.tile = canvasTex(TS, TS, g => {
  g.fillStyle = '#7f9fb4'; g.fillRect(0, 0, TS, TS);
  for (let r = 0; r < 4; r++) for (let c = -1; c < 2; c++) {
    const x = c * 32 + (r % 2) * 16, y = r * 16;
    g.fillStyle = ['#c3dcea', '#b2cfe0'][(r + c + 2) % 2];
    rrect(g, x + 1, y + 1, 30, 14, 4); g.fill();
    g.fillStyle = 'rgba(255,255,255,.35)'; g.fillRect(x + 5, y + 3, 12, 2);
  }
});
TEX.weave = canvasTex(TS, TS, g => {
  g.fillStyle = '#8f3518'; g.fillRect(0, 0, TS, TS);
  for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) {
    const x = c * 16, y = r * 16, vert = (r + c) % 2;
    for (let s = 0; s < 3; s++) {
      g.fillStyle = ['#d4643a', '#c85a32', '#dc7045'][s];
      if (vert) g.fillRect(x + 1 + s * 5, y + 1, 4, 14); else g.fillRect(x + 1, y + 1 + s * 5, 14, 4);
    }
  }
});
TEX.wallpaper = canvasTex(TS, TS, g => {
  g.fillStyle = '#5fae74'; g.fillRect(0, 0, TS, TS);
  g.strokeStyle = 'rgba(40,110,60,.55)'; g.lineWidth = 1;
  for (let i = -64; i <= 128; i += 32) {
    g.beginPath(); g.moveTo(i, 0); g.lineTo(i + 64, 64); g.stroke();
    g.beginPath(); g.moveTo(i, 64); g.lineTo(i + 64, 0); g.stroke();
  }
  for (const [x, y] of [[16, 16], [48, 48]]) { flower(g, x, y, 9, '#eaf8e4'); oval(g, x, y, 2, 2, '#f5d742'); }
  for (const [x, y] of [[48, 16], [16, 48]]) flower(g, x, y, 5, '#a8dcf0');
});
TEX.books = canvasTex(TS, TS, g => {
  g.fillStyle = '#3e2412'; g.fillRect(0, 0, TS, TS);
  const cols = ['#b83a3a', '#3a6ab8', '#3a9a5a', '#c8a23a', '#7a3ab0', '#d86a2a', '#2a8a8a'];
  for (let s = 0; s < 3; s++) {
    const top = s * 21 + 2, bh = 17;
    let x = 3;
    while (x < 60) {
      const w = 3 + (rnd() * 4 | 0), h = bh - (rnd() * 6 | 0);
      if (x + w > 61) break;
      g.fillStyle = cols[rnd() * cols.length | 0]; g.fillRect(x, top + bh - h, w, h);
      g.fillStyle = 'rgba(255,255,255,.3)'; g.fillRect(x, top + bh - h + 2, w, 1);
      x += w + (rnd() < .15 ? 2 : 0);
    }
    g.fillStyle = '#6b4424'; g.fillRect(0, top + bh, TS, 2);
  }
  g.fillStyle = '#6b4424'; g.fillRect(0, 0, 3, TS); g.fillRect(61, 0, 3, TS);
});
TEX.stone = canvasTex(TS, TS, g => {
  g.fillStyle = '#5c666f'; g.fillRect(0, 0, TS, TS);
  for (let r = 0; r < 4; r++) {
    let x = r % 2 ? -14 : 0;
    while (x < 64) {
      const w = 18 + rnd() * 14;
      g.fillStyle = ['#8d98a2', '#9aa5ae', '#848f99'][rnd() * 3 | 0];
      rrect(g, x + 1, r * 16 + 1, w - 2, 14, 3); g.fill();
      x += w;
    }
  }
  dots(g, 30, ['#7a858f', '#a8b2ba'], .5, 1.2);
});
TEX.porthole = canvasTex(TS, TS, g => {
  g.drawImage(TEX.planksBlue.cv, 0, 0);
  oval(g, 32, 30, 23, 23, '#1d5070');
  oval(g, 32, 30, 21, 21, '#a9bcc8');
  g.fillStyle = '#5c7484';
  for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2; oval(g, 32 + Math.cos(a) * 18, 30 + Math.sin(a) * 18, 1.5, 1.5, '#5c7484'); }
  oval(g, 32, 30, 15, 15, '#2d6f8f');
  oval(g, 32, 30, 13.5, 13.5, '#8fe0ff');
  oval(g, 32, 34, 13, 8, '#6ccdf2');
  g.fillStyle = 'rgba(255,255,255,.75)'; g.beginPath(); g.ellipse(26, 24, 5, 2.5, -.7, 0, 7); g.fill();
});
TEX.frontDoor = canvasTex(TS, TS, g => {
  g.drawImage(TEX.planksBlue.cv, 0, 0);
  const arch = (inset) => { g.beginPath(); g.moveTo(11 + inset, 64); g.lineTo(11 + inset, 24); g.arc(32, 24, 21 - inset, Math.PI, 0); g.lineTo(53 - inset, 64); g.closePath(); };
  arch(0); g.fillStyle = '#4a2a10'; g.fill();
  arch(3); g.fillStyle = '#a8692f'; g.fill();
  g.save(); arch(3); g.clip();
  g.fillStyle = 'rgba(70,35,10,.6)'; for (let x = 20; x < 50; x += 6) g.fillRect(x, 0, 1, TS);
  g.restore();
  oval(g, 32, 24, 8, 8, '#d0a040'); oval(g, 32, 24, 6, 6, '#8fe0ff');
  g.fillStyle = 'rgba(255,255,255,.7)'; g.fillRect(29, 21, 3, 2);
  oval(g, 45, 44, 2.5, 2.5, '#f0c040', '#7a5a10');
});
Object.assign(WALLS, {
  L: TEX.planksBlue, T: TEX.tile, O: TEX.weave, G: TEX.wallpaper,
  B: TEX.books, C: TEX.stone, N: TEX.porthole, D: TEX.frontDoor,
});

// ---- floors & ceilings (a level picks them by name) -------------------------
TEX.floorWood = canvasTex(TS, TS, g => {
  const cols = ['#a0703c', '#94653a', '#a87842', '#8f6034'];
  for (let p = 0; p < 4; p++) {
    const y = p * 16;
    g.fillStyle = cols[p]; g.fillRect(0, y, TS, 16);
    g.strokeStyle = 'rgba(70,40,15,.35)'; g.lineWidth = 1;
    g.beginPath(); g.moveTo(0, y + 5 + rnd() * 6); g.bezierCurveTo(20, y + 4 + rnd() * 8, 44, y + 4 + rnd() * 8, 64, y + 8); g.stroke();
    g.fillStyle = '#5a3818'; g.fillRect(0, y + 15, TS, 1);
    g.fillRect(((p * 37) % 56) + 4, y, 1, 16);
  }
});
TEX.floorPink = canvasTex(TS, TS, g => {
  g.fillStyle = '#d98aa6'; g.fillRect(0, 0, TS, TS);
  for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) {
    g.fillStyle = (r + c) % 2 ? '#f6bfd2' : '#fbd8e4';
    g.fillRect(c * 16 + 1, r * 16 + 1, 14, 14);
  }
});
TEX.floorStone = canvasTex(TS, TS, g => {
  g.fillStyle = '#7d868e'; g.fillRect(0, 0, TS, TS);
  for (const [x, y, w, h] of [[0, 0, 30, 22], [30, 0, 34, 22], [0, 22, 20, 20], [20, 22, 26, 20], [46, 22, 18, 20], [0, 42, 36, 22], [36, 42, 28, 22]]) {
    g.fillStyle = ['#b2bac0', '#a6aeb5', '#bcc3c8'][rnd() * 3 | 0];
    rrect(g, x + 1, y + 1, w - 2, h - 2, 3); g.fill();
  }
  dots(g, 40, ['#98a1a8', '#c8cfd4'], .5, 1.2);
});
TEX.ceilNet = canvasTex(TS, TS, g => {
  g.fillStyle = '#3d2614'; g.fillRect(0, 0, TS, TS);
  g.lineWidth = 4;
  for (let i = -64; i <= 128; i += 16) {
    g.strokeStyle = '#8a5a34'; g.beginPath(); g.moveTo(i, 0); g.lineTo(i + 64, 64); g.stroke();
    g.strokeStyle = '#7a4c2a'; g.beginPath(); g.moveTo(i, 64); g.lineTo(i + 64, 0); g.stroke();
  }
});
TEX.ceilPlaster = canvasTex(TS, TS, g => {
  g.fillStyle = '#a9c0cf'; g.fillRect(0, 0, TS, TS);
  dots(g, 50, ['#9db4c3', '#b7cbd8', '#a2b9c8'], 1, 4);
});
TEX.sky.scroll = true;   // the open-water ceiling drifts; indoor ceilings stay put
const FLOORS = { sand: TEX.sand, wood: TEX.floorWood, pink: TEX.floorPink, stone: TEX.floorStone };
const CEILINGS = { sky: TEX.sky, net: TEX.ceilNet, plaster: TEX.ceilPlaster, wood: TEX.floorWood };

// ---- furniture --------------------------------------------------------------
// h = height in world units, r = how far from its centre it blocks, solid = can't walk through it
function prop(name, w, h, size, r, draw, solid = true) { return { name, tex: canvasTex(w, h, draw), h: size, r, solid }; }
const PROPS = {
  c: prop('Armchair', 64, 64, .7, .32, g => {
    oval(g, 32, 55, 27, 8, '#f2f2ea', '#9a9a90');
    g.save(); oval(g, 32, 55, 27, 8); g.clip();
    g.fillStyle = '#d9342b'; for (const x of [8, 28, 48]) g.fillRect(x, 44, 8, 20);
    g.restore();
    g.lineWidth = 2; g.strokeStyle = '#8a1610';
    rrect(g, 10, 6, 44, 40, 14); g.fillStyle = '#d9342b'; g.fill(); g.stroke();
    rrect(g, 16, 10, 32, 22, 10); g.fillStyle = '#e8524a'; g.fill();
    for (const x of [4, 46]) { rrect(g, x, 26, 14, 24, 7); g.fillStyle = '#c42c24'; g.fill(); g.stroke(); }
    rrect(g, 16, 36, 32, 13, 6); g.fillStyle = '#ec625a'; g.fill(); g.stroke();
  }),
  t: prop('TV', 48, 48, .55, .25, g => {
    g.strokeStyle = '#3a3d42'; g.lineWidth = 2;
    g.beginPath(); g.moveTo(14, 34); g.lineTo(9, 47); g.moveTo(34, 34); g.lineTo(39, 47); g.moveTo(24, 8); g.lineTo(13, 1); g.moveTo(24, 8); g.lineTo(35, 1); g.stroke();
    rrect(g, 4, 8, 40, 28, 5); g.fillStyle = '#8c8f96'; g.fill(); g.stroke();
    rrect(g, 8, 12, 25, 20, 4); g.fillStyle = '#7fd0ff'; g.fill();
    g.fillStyle = 'rgba(255,255,255,.6)'; g.fillRect(11, 15, 8, 2);
    oval(g, 39, 17, 2.5, 2.5, '#3a3d42'); oval(g, 39, 26, 2.5, 2.5, '#3a3d42');
  }),
  z: prop('Bed', 96, 48, .55, .45, g => {
    g.lineWidth = 2; g.strokeStyle = '#1d4f70';
    g.beginPath(); g.moveTo(3, 22); g.lineTo(93, 22); g.lineTo(84, 46); g.lineTo(12, 46); g.closePath();
    g.fillStyle = '#3f8fc4'; g.fill(); g.stroke();
    for (const x of [30, 48, 66]) oval(g, x, 34, 4, 4, '#bfe8ff', '#1d4f70');
    rrect(g, 7, 14, 82, 10, 4); g.fillStyle = '#f4f4ee'; g.fill();
    rrect(g, 36, 11, 52, 13, 5); g.fillStyle = '#b450a8'; g.fill();
    g.fillStyle = '#d27ac8'; g.fillRect(40, 15, 44, 3);
    rrect(g, 9, 7, 23, 11, 5); g.fillStyle = '#fff'; g.fill(); g.strokeStyle = '#9a9a90'; g.stroke();
  }),
  i: prop('Fridge', 48, 96, .95, .28, g => {
    g.lineWidth = 2;
    rrect(g, 4, 4, 40, 50, 7); g.fillStyle = '#f2f4f2'; g.fill(); g.strokeStyle = '#8a9096'; g.stroke();
    rrect(g, 4, 52, 40, 40, 7); g.fillStyle = '#d8402c'; g.fill(); g.strokeStyle = '#7a1a10'; g.stroke();
    g.fillStyle = '#b8c0c8'; g.fillRect(36, 20, 3, 18); g.fillRect(36, 58, 3, 14);
    oval(g, 14, 14, 4, 4, '#9fd8ff', '#8a9096');
    g.fillStyle = '#555'; g.fillRect(8, 91, 6, 5); g.fillRect(34, 91, 6, 5);
  }),
  x: prop('Treasure chest', 64, 48, .42, .3, g => {
    g.lineWidth = 2; g.strokeStyle = '#4a2a10';
    rrect(g, 4, 20, 56, 26, 3); g.fillStyle = '#8a5a2a'; g.fill(); g.stroke();
    g.beginPath(); g.moveTo(4, 22); g.quadraticCurveTo(32, 0, 60, 22); g.closePath(); g.fillStyle = '#9a6834'; g.fill(); g.stroke();
    g.fillStyle = '#e0b030'; g.fillRect(12, 12, 5, 34); g.fillRect(47, 12, 5, 34); g.fillRect(4, 20, 56, 3);
    rrect(g, 27, 23, 10, 12, 2); g.fill();
    g.fillStyle = '#222'; g.fillRect(31, 27, 2, 5);
  }),
  l: prop('Barrel', 48, 64, .6, .25, g => {
    g.lineWidth = 2; g.strokeStyle = '#4a2a10';
    g.beginPath(); g.moveTo(10, 5); g.quadraticCurveTo(1, 32, 10, 60); g.lineTo(38, 60); g.quadraticCurveTo(47, 32, 38, 5); g.closePath();
    g.fillStyle = '#a0662e'; g.fill(); g.stroke();
    g.strokeStyle = 'rgba(70,35,10,.6)'; g.lineWidth = 1;
    for (const x of [17, 24, 31]) { g.beginPath(); g.moveTo(x, 5); g.quadraticCurveTo(x + (x - 24) * .4, 32, x, 60); g.stroke(); }
    g.fillStyle = '#5a6168'; g.fillRect(5, 13, 38, 4); g.fillRect(5, 47, 38, 4);
    oval(g, 24, 5, 14, 3, '#7a4a20');
  }),
  w: prop('Bathtub', 96, 48, .5, .45, g => {
    oval(g, 16, 43, 4, 4, '#d0a040'); oval(g, 80, 43, 4, 4, '#d0a040');
    g.lineWidth = 2; g.strokeStyle = '#7aa0b4';
    g.beginPath(); g.moveTo(4, 14); g.lineTo(92, 14); g.quadraticCurveTo(90, 42, 70, 42); g.lineTo(26, 42); g.quadraticCurveTo(6, 42, 4, 14);
    g.fillStyle = '#e4f2f8'; g.fill(); g.stroke();
    for (let i = 0; i < 9; i++) oval(g, 14 + i * 8.5, 10 + (i % 2) * 2, 5, 4, i % 3 ? '#ffffff' : '#cdefff');
    rrect(g, 2, 12, 92, 5, 2); g.fillStyle = '#ffffff'; g.fill(); g.stroke();
    g.fillStyle = '#d0a040'; g.fillRect(86, 2, 3, 11); g.fillRect(80, 2, 9, 3);
  }),
  o: prop('Toilet', 48, 64, .6, .25, g => {
    g.lineWidth = 2; g.strokeStyle = '#7aa0b4';
    rrect(g, 8, 4, 32, 22, 4); g.fillStyle = '#eef6fa'; g.fill(); g.stroke();
    g.fillStyle = '#b8c0c8'; g.fillRect(30, 9, 7, 3);
    g.beginPath(); g.moveTo(15, 40); g.lineTo(33, 40); g.lineTo(30, 61); g.lineTo(18, 61); g.closePath(); g.fillStyle = '#eef6fa'; g.fill(); g.stroke();
    oval(g, 24, 36, 18, 9, '#ffffff', '#7aa0b4');
    oval(g, 24, 36, 12, 5, '#7fd0ff');
  }),
  e: prop('Table', 80, 48, .5, .4, g => {
    g.fillStyle = '#6b4424'; g.fillRect(12, 20, 6, 26); g.fillRect(62, 20, 6, 26); g.fillRect(14, 34, 52, 3);
    rrect(g, 2, 12, 76, 10, 3); g.fillStyle = '#a8723a'; g.fill(); g.strokeStyle = '#4a2a10'; g.lineWidth = 2; g.stroke();
    g.fillStyle = 'rgba(70,35,10,.5)'; for (const x of [20, 40, 60]) g.fillRect(x, 13, 1, 8);
  }),
  g: prop('Gary', 48, 40, .32, .2, g => {
    g.strokeStyle = '#8fd0dc'; g.lineWidth = 3; g.lineCap = 'round';
    g.beginPath(); g.moveTo(9, 32); g.lineTo(6, 11); g.moveTo(11, 32); g.lineTo(14, 10); g.stroke();
    g.lineWidth = 1.5;
    oval(g, 22, 34, 20, 5, '#8fd0dc', '#3a8090');
    oval(g, 27, 22, 13, 13, '#f08aa8', '#a03a5a');
    g.strokeStyle = '#a03a5a'; g.lineWidth = 2; g.beginPath();
    for (let a = 0; a < 4 * Math.PI; a += .2) { const r = 10 - a * .75; g.lineTo(27 + Math.cos(a) * r, 22 + Math.sin(a) * r); }
    g.stroke();
    for (const [x, y] of [[6, 9], [14, 8]]) { oval(g, x, y, 4, 4, '#f4ee9a', '#c04040'); oval(g, x, y, 1.3, 1.3, '#111'); }
  }, false),
};
PROPS.g.meow = true;
