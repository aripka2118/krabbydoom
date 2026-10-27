'use strict';
// ---------------------------------------------------------------------------
// Procedural textures & sprites
// ---------------------------------------------------------------------------
function canvasTex(w, h, draw) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  const g = c.getContext('2d');
  draw(g, w, h);
  const d = g.getImageData(0, 0, w, h);
  return { w, h, px: new Uint32Array(d.data.buffer), cv: c };
}
function dots(g, n, cols, rmin, rmax, w = TS, h = TS) {
  for (let i = 0; i < n; i++) {
    g.fillStyle = cols[(rnd() * cols.length) | 0];
    g.beginPath(); g.arc(rnd() * w, rnd() * h, rmin + rnd() * (rmax - rmin), 0, 7); g.fill();
  }
}
function heart(g, x, y, s, c) {
  g.fillStyle = c; g.beginPath();
  g.moveTo(x, y + s * .9);
  g.bezierCurveTo(x - s * 1.4, y, x - s * .6, y - s * .9, x, y - s * .2);
  g.bezierCurveTo(x + s * .6, y - s * .9, x + s * 1.4, y, x, y + s * .9);
  g.fill();
}
function flower(g, x, y, r, col) {
  g.fillStyle = col;
  for (let i = 0; i < 5; i++) {
    const a = i / 5 * Math.PI * 2;
    g.beginPath(); g.arc(x + Math.cos(a) * r * .6, y + Math.sin(a) * r * .6, r * .5, 0, 7); g.fill();
  }
  g.fillStyle = 'rgba(255,255,255,.6)';
  g.beginPath(); g.arc(x, y, r * .3, 0, 7); g.fill();
}

const TEX = {};
TEX.coral = canvasTex(TS, TS, g => {
  g.fillStyle = '#b8577f'; g.fillRect(0, 0, TS, TS);
  dots(g, 60, ['#d9739b', '#a04070', '#e48fb0', '#c9628c'], 2, 7);
  dots(g, 25, ['#5e1f3e', '#73284c'], 1, 2.5);
});
TEX.pine = canvasTex(TS, TS, g => {
  g.fillStyle = '#e9921f'; g.fillRect(0, 0, TS, TS);
  g.strokeStyle = '#9c5410'; g.lineWidth = 2;
  for (let i = -64; i <= 128; i += 16) {
    g.beginPath(); g.moveTo(i, 0); g.lineTo(i + 64, 64); g.stroke();
    g.beginPath(); g.moveTo(i, 64); g.lineTo(i + 64, 0); g.stroke();
  }
  g.fillStyle = '#ffc45a';
  for (let y = 0; y <= 64; y += 16) for (let x = 0; x <= 64; x += 16) {
    g.beginPath(); g.arc(x + 8, y, 2.2, 0, 7); g.fill();
    g.beginPath(); g.arc(x, y + 8, 2.2, 0, 7); g.fill();
  }
});
TEX.wood = canvasTex(TS, TS, g => {
  const cols = ['#94622f', '#7f5025', '#9a6833', '#86562a'];
  for (let p = 0; p < 4; p++) {
    const y = p * 16;
    g.fillStyle = cols[p]; g.fillRect(0, y, TS, 16);
    g.strokeStyle = 'rgba(60,30,10,.5)'; g.lineWidth = 1;
    for (let k = 0; k < 4; k++) {
      const yy = y + 2 + rnd() * 11;
      g.beginPath(); g.moveTo(0, yy);
      g.bezierCurveTo(20, yy + rnd() * 4 - 2, 40, yy + rnd() * 4 - 2, 64, yy); g.stroke();
    }
    g.fillStyle = '#4a2a10'; g.fillRect(0, y + 15, TS, 1);
    g.fillStyle = '#2b2b2b'; g.fillRect(4, y + 6, 2, 2); g.fillRect(58, y + 6, 2, 2);
  }
});
TEX.rock = canvasTex(TS, TS, g => {
  g.fillStyle = '#5d7186'; g.fillRect(0, 0, TS, TS);
  dots(g, 45, ['#6f8499', '#4e6074', '#7c93a8', '#566a7f'], 3, 9);
  g.strokeStyle = '#33414f'; g.lineWidth = 1;
  for (let i = 0; i < 6; i++) {
    let x = rnd() * TS, y = rnd() * TS;
    g.beginPath(); g.moveTo(x, y);
    for (let j = 0; j < 3; j++) { x += rnd() * 12 - 6; y += rnd() * 12 - 6; g.lineTo(x, y); }
    g.stroke();
  }
});
TEX.sand = canvasTex(TS, TS, g => {
  g.fillStyle = '#d9c58e'; g.fillRect(0, 0, TS, TS);
  dots(g, 220, ['#cbb57c', '#e8d8a8', '#bfa66b', '#d0bb83'], .5, 1.5);
  dots(g, 4, ['#a8916a', '#efe3c4'], 1.5, 2.5);
});
TEX.sky = canvasTex(TS, TS, g => {
  g.fillStyle = '#2f8fc4'; g.fillRect(0, 0, TS, TS);
  g.strokeStyle = 'rgba(150,225,255,.35)'; g.lineWidth = 2;
  for (let i = 0; i < 5; i++) {
    const y = i * 13 + 4;
    g.beginPath(); g.moveTo(0, y); g.bezierCurveTo(20, y - 6, 44, y + 6, 64, y); g.stroke();
  }
  flower(g, 16, 18, 9, '#8fe3ff');
  flower(g, 45, 44, 11, '#c6f5b0');
  flower(g, 48, 13, 6, '#f3c8ff');
  flower(g, 14, 50, 6, '#fff0a0');
});
const WALLS = { '#': TEX.coral, 'P': TEX.pine, 'W': TEX.wood, 'K': TEX.rock };

function fishTex(t, mood, frame) {
  return canvasTex(64, 64, g => {
    const wig = frame ? 4 : -4;
    g.fillStyle = t.fin;
    g.beginPath(); g.moveTo(46, 35); g.lineTo(62, 22 + wig); g.lineTo(57, 35); g.lineTo(62, 48 + wig); g.closePath(); g.fill();
    g.beginPath(); g.moveTo(20, 24); g.quadraticCurveTo(32, 8, 44, 25); g.closePath(); g.fill();
    g.fillStyle = t.body; g.beginPath(); g.ellipse(30, 35, 21, t.round ? 18 : 14, 0, 0, 7); g.fill();
    g.fillStyle = t.belly; g.beginPath(); g.ellipse(29, t.round ? 44 : 41, 15, 6, 0, 0, 7); g.fill();
    if (t.spots) {
      g.fillStyle = t.spots;
      for (const [x, y, r] of [[35, 27, 3], [41, 35, 2.5], [28, 26, 2], [44, 28, 1.8]]) { g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); }
    }
    g.fillStyle = t.fin; g.beginPath(); g.ellipse(33, 40, 6, 3, frame ? .6 : .2, 0, 7); g.fill();
    g.strokeStyle = 'rgba(0,0,0,.6)'; g.lineWidth = 1.5;
    g.beginPath(); g.ellipse(30, 35, 21, t.round ? 18 : 14, 0, 0, 7); g.stroke();
    g.fillStyle = '#fff'; g.beginPath(); g.arc(19, 30, 5.5, 0, 7); g.fill(); g.stroke();
    g.fillStyle = '#111'; g.beginPath(); g.arc(17.5, 30.5, 2.5, 0, 7); g.fill();
    if (mood === 'hungry') {
      g.strokeStyle = '#111'; g.lineWidth = 2;
      g.beginPath(); g.moveTo(13, 22); g.lineTo(25, 26); g.stroke();
      g.fillStyle = '#5a0f1a'; g.beginPath(); g.ellipse(11, 40, 5, frame ? 6 : 4.5, 0, 0, 7); g.fill();
      g.fillStyle = '#fff'; g.beginPath();
      g.moveTo(7, 36); g.lineTo(9, 39); g.lineTo(11, 35.5); g.lineTo(13, 39); g.lineTo(15, 36.5); g.closePath(); g.fill();
      g.fillStyle = '#9fe8ff'; g.beginPath(); g.arc(10, 48 + frame * 2, 1.8, 0, 7); g.fill();
    } else {
      g.strokeStyle = '#111'; g.lineWidth = 1.5;
      g.beginPath(); g.arc(14, 36, 4.5, .4, 2.6); g.stroke();
      g.fillStyle = 'rgba(255,120,150,.9)'; g.beginPath(); g.arc(23, 39, 3, 0, 7); g.fill();
      heart(g, 30, 9 - frame, 6, '#ff4d7a');
    }
  });
}

const FISH = {
  guppy:   { name: 'Guppy',   body: '#ff8c3a', belly: '#ffd27a', fin: '#e0552a', size: .55, speed: 2.4, hunger: 1, dmg: 6 },
  puffer:  { name: 'Puffer',  body: '#9b6ad6', belly: '#e4d0ff', fin: '#6c3fb0', spots: '#5b2f99', round: true, size: .7, speed: 1.4, hunger: 2, dmg: 8, ranged: true },
  grouper: { name: 'Grouper', body: '#3f78d6', belly: '#bcd6ff', fin: '#244f9e', spots: '#2a5bb0', size: .95, speed: 1.15, hunger: 3, dmg: 14 },
  // Anchovies walk on the floor and get their own random colour per fish (textures built in reset)
  anchovy: { name: 'Anchovy', size: .9, speed: 2.9, hunger: 1, dmg: 5, ground: true, randomColor: true,
             radius: .2, hitR: .3, reach: .75, stride: 10 },
  // Bubble Bass: slow waddling tank that needs a lot of patties and hits hard
  bass: { name: 'Bubble Bass', size: 1, speed: 1.05, hunger: 5, dmg: 15, ground: true, draw: bubbleBassTex,
          radius: .32, hitR: .45, reach: .95, stride: 4, atkRate: 1.3 },
  // Fred: keeps his distance and throws his own leg like a boomerang (see throwLeg)
  fred: { name: 'Fred', size: 1, speed: 1.6, hunger: 3, dmg: 12, ground: true, thrower: true, draw: fredTex,
          radius: .25, hitR: .34, stride: 6 },
};
for (const t of Object.values(FISH)) {
  if (t.randomColor) continue;
  const draw = t.draw || fishTex;
  t.tex = { hungry: [draw(t, 'hungry', 0), draw(t, 'hungry', 1)], fed: [draw(t, 'fed', 0), draw(t, 'fed', 1)] };
  if (t.thrower) t.tex.noleg = [draw(t, 'noleg', 0), draw(t, 'noleg', 1)];
}

// Fred, drawn facing left: tall khaki body, big eyes, stubbly chin, belt and brown slacks.
// mood 'noleg' = yelling and hopping on one leg while the other one is out being thrown.
function fredTex(t, mood, frame) {
  return canvasTex(48, 112, g => {
    const skin = '#a39a5c', fin = '#e8dfb0', finLine = '#9a8d55', pants = '#7a4a24', foot = '#e2d7a6', line = '#1c1c14';
    const noleg = mood === 'noleg';
    g.lineJoin = 'round'; g.lineCap = 'round'; g.lineWidth = 1.5; g.strokeStyle = line;
    if (noleg && frame) g.translate(0, -3);
    const leg = x => {
      g.fillStyle = pants; g.fillRect(x - 4, 80, 8, 23); g.strokeRect(x - 4, 80, 8, 23);
      g.fillStyle = foot; g.beginPath(); g.ellipse(x - 4, 105, 8, 3, 0, 0, 7); g.fill(); g.stroke();
    };
    leg(noleg ? 30 : frame ? 32 : 28);
    if (!noleg) leg(frame ? 16 : 20);
    // hips
    g.fillStyle = pants; g.beginPath(); g.moveTo(12, 72); g.lineTo(38, 72); g.lineTo(37, 86); g.lineTo(12, 86); g.closePath(); g.fill(); g.stroke();
    g.beginPath(); g.moveTo(25, 76); g.lineTo(25, 86); g.stroke();
    const stripes = (path, x0, x1, y0, y1, n) => {
      g.save(); g.clip(path); g.strokeStyle = finLine; g.lineWidth = 1;
      for (let i = 1; i < n; i++) { const y = y0 + (y1 - y0) * i / n; g.beginPath(); g.moveTo(x0, y); g.lineTo(x1, y + 2); g.stroke(); }
      g.restore(); g.strokeStyle = line; g.lineWidth = 1.5; g.stroke(path);
    };
    // dorsal fin on his back
    const dp = new Path2D(); dp.moveTo(34, 12); dp.quadraticCurveTo(49, 36, 41, 66); dp.lineTo(34, 66); dp.closePath();
    g.fillStyle = fin; g.fill(dp); stripes(dp, 30, 48, 12, 66, 9);
    // body
    const bp = new Path2D();
    bp.moveTo(22, 3); bp.quadraticCurveTo(37, 3, 38, 22); bp.lineTo(38, 72); bp.lineTo(13, 72);
    bp.quadraticCurveTo(9, 58, 10, 46); bp.quadraticCurveTo(6, 38, 8, 30); bp.quadraticCurveTo(8, 6, 22, 3);
    g.fillStyle = skin; g.fill(bp); g.stroke(bp);
    // stubbly chin
    g.lineWidth = 1;
    for (let i = 0; i < 4; i++) { g.beginPath(); g.moveTo(13 + i * 5, 47 + i); g.quadraticCurveTo(11 + i * 5, 56, 14 + i * 5, 66); g.stroke(); }
    g.lineWidth = 1.5;
    // belt
    g.fillStyle = '#141414'; g.fillRect(12, 69, 27, 5);
    g.fillStyle = '#f0c020'; g.fillRect(15, 69.5, 7, 4); g.strokeRect(15, 69.5, 7, 4);
    // pectoral fin hanging down his side
    const fp = new Path2D(); fp.moveTo(28, 46); fp.quadraticCurveTo(37, 70, 31, 93); fp.quadraticCurveTo(23, 72, 28, 46);
    g.fillStyle = fin; g.fill(fp); stripes(fp, 20, 40, 46, 93, 8);
    // nostrils + mouth
    g.fillStyle = line;
    g.beginPath(); g.arc(8, 34, .9, 0, 7); g.fill(); g.beginPath(); g.arc(12, 34, .9, 0, 7); g.fill();
    if (noleg) {
      g.fillStyle = '#4a1414'; g.beginPath(); g.ellipse(12, 42, 5.5, frame ? 4 : 3, 0, 0, 7); g.fill(); g.stroke();
    } else if (mood === 'hungry') {
      g.lineWidth = 2;
      g.beginPath(); g.moveTo(5, 42); g.quadraticCurveTo(12, 37, 20, 41); g.stroke();
      g.lineWidth = 1; g.beginPath(); g.moveTo(7, 44); g.quadraticCurveTo(12, 41, 18, 44); g.stroke();
    } else {
      g.lineWidth = 2; g.beginPath(); g.moveTo(5, 40); g.quadraticCurveTo(12, 46, 20, 40); g.stroke();
      heart(g, 40, 8 - frame, 5, '#ff4d7a');
    }
    // big eyes looking down at you
    g.lineWidth = 1.5;
    for (const [ex, ey] of [[21, 21], [10, 23]]) {
      g.fillStyle = '#fff'; g.beginPath(); g.ellipse(ex, ey, 7, 7.5, 0, 0, 7); g.fill(); g.stroke();
      g.fillStyle = '#111';
      if (mood === 'fed') { g.beginPath(); g.arc(ex, ey + 2, 3.5, Math.PI * 1.1, Math.PI * 1.9); g.stroke(); }
      else { g.beginPath(); g.arc(ex - 3, ey + 3, noleg ? 2 : 2.7, 0, 7); g.fill(); }
    }
    if (mood === 'hungry') {
      g.lineWidth = 2; g.beginPath(); g.moveTo(3, 13); g.lineTo(13, 17); g.moveTo(15, 11); g.lineTo(26, 14); g.stroke();
    }
  });
}

// Fred's thrown leg, pre-rotated in 8 steps so it spins in flight
TEX.leg = [];
for (let i = 0; i < 8; i++) TEX.leg.push(canvasTex(32, 32, g => {
  g.translate(16, 16); g.rotate(i * Math.PI / 4);
  g.lineWidth = 1.5; g.strokeStyle = '#1c1c14';
  g.fillStyle = '#7a4a24'; g.fillRect(-4, -12, 8, 18); g.strokeRect(-4, -12, 8, 18);
  g.fillStyle = '#e2d7a6'; g.beginPath(); g.ellipse(-4, 8, 8, 3, 0, 0, 7); g.fill(); g.stroke();
}));

// Bubble Bass, front on: round olive body, glasses, orange tank top, red shorts, stubby feet.
// frame 0/1 shifts the feet and body for a waddle.
function bubbleBassTex(t, mood, frame) {
  return canvasTex(80, 96, g => {
    const skin = '#8f9a58', pale = '#b9bd80', shade = '#6c7640', line = '#24261a';
    const sway = frame ? 1.5 : -1.5;
    g.lineJoin = 'round'; g.lineCap = 'round'; g.lineWidth = 1.5; g.strokeStyle = line;
    // legs and feet (one foot lifted per frame)
    [[30, frame ? 2 : 0], [50, frame ? 0 : 2]].forEach(([x, lift]) => {
      g.fillStyle = skin; g.fillRect(x - 4, 78, 8, 12 - lift); g.strokeRect(x - 4, 78, 8, 12 - lift);
      g.beginPath(); g.ellipse(x + (x < 40 ? -2 : 2), 91 - lift, 9, 4, 0, 0, 7); g.fill(); g.stroke();
    });
    g.save(); g.translate(sway, 0);
    // shorts
    g.fillStyle = '#b8462c'; g.beginPath();
    g.moveTo(13, 64); g.lineTo(67, 64); g.lineTo(66, 82); g.lineTo(43, 82); g.lineTo(40, 76);
    g.lineTo(37, 82); g.lineTo(14, 82); g.closePath(); g.fill(); g.stroke();
    g.strokeStyle = '#7d2a18'; g.beginPath(); g.moveTo(20, 70); g.quadraticCurveTo(26, 74, 30, 70); g.moveTo(52, 72); g.lineTo(58, 70); g.stroke();
    g.strokeStyle = line;
    // body / head
    const bp = new Path2D();
    bp.moveTo(24, 10);
    bp.quadraticCurveTo(40, 2, 57, 9);
    bp.quadraticCurveTo(72, 28, 71, 54);
    bp.quadraticCurveTo(71, 64, 64, 66);
    bp.lineTo(16, 66);
    bp.quadraticCurveTo(9, 64, 9, 54);
    bp.quadraticCurveTo(8, 28, 24, 10);
    g.fillStyle = skin; g.fill(bp);
    g.save(); g.clip(bp);
    // orange tank top with a scoop neck
    g.fillStyle = '#ef8a3c'; g.fillRect(0, 34, 80, 24);
    g.fillStyle = skin; g.beginPath(); g.ellipse(40, 33, 15, 8, 0, 0, 7); g.fill();
    g.strokeStyle = '#b8601f'; g.beginPath(); g.ellipse(40, 33, 15, 8, 0, 0, Math.PI); g.stroke();
    g.restore();
    g.strokeStyle = line; g.stroke(bp);
    // belly hanging out under the shirt
    g.fillStyle = pale; g.beginPath(); g.ellipse(41, 61, 25, 9, 0, 0, Math.PI * 2); g.fill();
    g.beginPath(); g.moveTo(16, 60); g.quadraticCurveTo(41, 49, 66, 60); g.stroke();
    g.beginPath(); g.ellipse(41, 61, 25, 9, 0, .1, Math.PI - .1); g.stroke();
    g.fillStyle = shade; g.beginPath(); g.arc(41, 63, 1.2, 0, 7); g.fill();
    g.strokeStyle = '#4a5a2a'; g.lineWidth = 1;
    for (const [x, y] of [[55, 63], [57, 61], [53, 61]]) { g.beginPath(); g.arc(x, y, 1.6, 0, 7); g.stroke(); }
    g.lineWidth = 1.5; g.strokeStyle = line;
    // side fins (arms)
    for (const [x, r] of [[11, .25], [69, -.25]]) {
      g.fillStyle = shade; g.beginPath(); g.ellipse(x, 47, 5, 13, r, 0, 7); g.fill(); g.stroke();
      g.beginPath(); g.moveTo(x, 38); g.lineTo(x + r * 8, 56); g.stroke();
    }
    // chins
    g.beginPath(); g.moveTo(28, 37); g.quadraticCurveTo(40, 42, 52, 37); g.stroke();
    // mouth
    if (mood === 'hungry') {
      g.fillStyle = '#3a1414'; g.beginPath(); g.ellipse(40, 29, 12, frame ? 4.5 : 3.5, 0, 0, 7); g.fill();
      g.fillStyle = pale; g.beginPath(); g.ellipse(40, 25.5, 14, 2.5, 0, 0, 7); g.fill(); g.stroke();
      g.beginPath(); g.ellipse(40, 33, 12, 2, 0, 0, 7); g.fill(); g.stroke();
    } else {
      g.fillStyle = pale; g.beginPath(); g.ellipse(40, 27, 14, 3, 0, 0, 7); g.fill();
      g.beginPath(); g.moveTo(27, 27); g.quadraticCurveTo(40, 33, 53, 26); g.stroke();
      heart(g, 68, 10 - frame, 6, '#ff4d7a');
    }
    // glasses
    for (const x of [30, 50]) {
      g.fillStyle = '#f2df8a'; g.beginPath(); g.arc(x, 15, 7.5, 0, 7); g.fill();
      g.fillStyle = '#111';
      if (mood === 'hungry') { g.beginPath(); g.arc(x + 2, 17, 2.4, 0, 7); g.fill(); }
      else { g.beginPath(); g.arc(x, 16, 4, Math.PI * 1.1, Math.PI * 1.9); g.lineWidth = 1.5; g.stroke(); }
      g.lineWidth = 3; g.beginPath(); g.arc(x, 15, 7.5, 0, 7); g.stroke();
    }
    g.beginPath(); g.moveTo(37, 14); g.lineTo(43, 14); g.moveTo(22.5, 14); g.lineTo(14, 12); g.moveTo(57.5, 14); g.lineTo(66, 12); g.stroke();
    if (mood === 'hungry') {
      g.lineWidth = 2.5; g.beginPath();
      g.moveTo(23, 4); g.lineTo(36, 7); g.moveTo(57, 4); g.lineTo(44, 7); g.stroke();
    }
    g.restore();
  });
}

// Anchovy: tall skinny body on two legs, googly eyes on top, mouth gaping open.
// Drawn facing left like the other fish so the same flip logic applies.
function anchovyTex(hue, sat, lit, mood, frame) {
  return canvasTex(48, 112, g => {
    const body = `hsl(${hue},${sat}%,${lit}%)`, dark = `hsl(${hue},${sat}%,${lit * .65}%)`, line = '#161616';
    g.lineJoin = 'round'; g.lineCap = 'round';
    // legs: [hip x, foot x], swapped between frames for a running stride
    const legs = frame ? [[29, 34], [22, 12]] : [[29, 16], [22, 30]];
    legs.forEach(([hx, fx], i) => {
      for (const [w, c] of [[5, line], [3, i ? body : dark]]) {
        g.strokeStyle = c; g.lineWidth = w;
        g.beginPath(); g.moveTo(hx, 80); g.quadraticCurveTo((hx + fx) / 2 + 2, 95, fx, 104); g.lineTo(fx - 8, 107); g.stroke();
      }
    });
    // body
    const bp = new Path2D();
    bp.moveTo(19, 13);
    bp.quadraticCurveTo(31, 9, 33, 22);
    bp.lineTo(34, 62);
    bp.quadraticCurveTo(35, 80, 29, 86);
    bp.lineTo(20, 86);
    bp.quadraticCurveTo(15, 74, 15, 58);
    bp.lineTo(14, 44);
    bp.quadraticCurveTo(9, 30, 12, 20);
    bp.quadraticCurveTo(14, 14, 19, 13);
    g.fillStyle = body; g.fill(bp);
    g.save(); g.clip(bp);
    g.fillStyle = '#e6cdb2'; g.fillRect(0, 50, 48, 12);
    g.fillStyle = line; g.fillRect(0, 49.5, 48, 1); g.fillRect(0, 61.5, 48, 1);
    g.restore();
    g.strokeStyle = line; g.lineWidth = 1.5; g.stroke(bp);
    g.beginPath(); g.moveTo(26, 79); g.quadraticCurveTo(29, 81, 31, 78); g.lineWidth = 1; g.stroke();
    // striped side fin
    const fp = new Path2D();
    fp.moveTo(29, 54); fp.quadraticCurveTo(42, 58, 37, 77); fp.quadraticCurveTo(27, 70, 29, 54);
    g.fillStyle = dark; g.fill(fp);
    g.save(); g.clip(fp); g.strokeStyle = body; g.lineWidth = 1;
    for (let i = 0; i < 4; i++) { g.beginPath(); g.moveTo(29 + i * 3, 54); g.lineTo(31 + i * 3, 78); g.stroke(); }
    g.restore();
    g.strokeStyle = line; g.lineWidth = 1.5; g.stroke(fp);
    if (mood === 'hungry') {
      // gaping mouth, tongue, upper lip and pointy lower jaw
      g.fillStyle = '#7d1c1c'; g.beginPath();
      g.moveTo(12, 17); g.quadraticCurveTo(26, 18, 26, 33); g.quadraticCurveTo(25, 45, 13, 46);
      g.lineTo(6, 44); g.quadraticCurveTo(6, 28, 12, 17); g.closePath(); g.fill(); g.stroke();
      g.fillStyle = '#ff6f6f'; g.beginPath(); g.ellipse(19, 33, 4.5, 5.5, 0, 0, 7); g.fill();
      g.fillStyle = '#ffb3b3'; g.beginPath(); g.ellipse(18, 31, 2, 2, 0, 0, 7); g.fill();
      g.fillStyle = body; g.beginPath();
      g.moveTo(11, 15); g.quadraticCurveTo(5, 26, 8, 37); g.lineTo(11, 36); g.quadraticCurveTo(10, 26, 15, 17); g.closePath(); g.fill(); g.stroke();
      const jy = frame ? 43 : 40;
      g.beginPath(); g.moveTo(16, 39); g.quadraticCurveTo(10, 42, 2, jy); g.quadraticCurveTo(9, 50, 16, 52); g.closePath(); g.fill(); g.stroke();
    } else {
      g.strokeStyle = line; g.lineWidth = 1.5;
      g.beginPath(); g.moveTo(12, 26); g.quadraticCurveTo(15, 37, 23, 32); g.stroke();
      g.fillStyle = 'rgba(255,120,150,.9)'; g.beginPath(); g.arc(24, 28, 3, 0, 7); g.fill();
      heart(g, 40, 18 - frame, 5, '#ff4d7a');
    }
    // googly eyes on top of the head
    for (const [ex, ey] of [[26, 8], [16, 9]]) {
      g.fillStyle = '#fff'; g.beginPath(); g.ellipse(ex, ey, 5.5, 6, 0, 0, 7); g.fill();
      g.strokeStyle = line; g.lineWidth = 1.5; g.stroke();
      g.fillStyle = '#111'; g.beginPath(); g.arc(ex - 2, ey + (mood === 'hungry' ? 0 : 1), mood === 'hungry' ? 2.2 : 2.7, 0, 7); g.fill();
    }
  });
}
// [hue, saturation, lightness] ranges; each anchovy picks one colour and jitters within it
const ANCHOVY_COLORS = [
  { name: 'brown',       h: [24, 32],   s: [42, 55], l: [36, 44] },
  { name: 'dark yellow', h: [44, 50],   s: [68, 80], l: [40, 48] },
  { name: 'dark red',    h: [-6, 4],    s: [58, 70], l: [32, 40] },
  { name: 'light blue',  h: [192, 210], s: [60, 75], l: [70, 80] },
  { name: 'dark green',  h: [118, 140], s: [42, 55], l: [27, 34] },
];
function anchovySet() {
  const c = ANCHOVY_COLORS[(Math.random() * ANCHOVY_COLORS.length) | 0];
  const pick = ([a, b]) => a + Math.random() * (b - a);
  const h = pick(c.h), s = pick(c.s), l = pick(c.l);
  return {
    hungry: [anchovyTex(h, s, l, 'hungry', 0), anchovyTex(h, s, l, 'hungry', 1)],
    fed: [anchovyTex(h, s, l, 'fed', 0), anchovyTex(h, s, l, 'fed', 1)],
  };
}

TEX.patty = canvasTex(32, 32, g => {
  g.fillStyle = '#d08a38'; g.beginPath(); g.ellipse(16, 23, 13, 3.5, 0, 0, 7); g.fill();
  g.fillStyle = '#6b3b1c'; g.beginPath(); g.ellipse(16, 19, 14, 3.2, 0, 0, 7); g.fill();
  g.fillStyle = '#ffd23a'; g.beginPath(); g.moveTo(3, 16); g.lineTo(29, 16); g.lineTo(24, 19); g.lineTo(8, 19); g.fill();
  g.fillStyle = '#4fc04a';
  g.beginPath(); g.moveTo(2, 15);
  for (let x = 2; x <= 30; x += 4) g.quadraticCurveTo(x + 2, 18, x + 4, 15);
  g.lineTo(30, 13); g.lineTo(2, 13); g.fill();
  g.fillStyle = '#e8a24c'; g.beginPath(); g.ellipse(16, 14, 14, 9, 0, Math.PI, 0); g.fill();
  g.fillStyle = '#f6c070'; g.beginPath(); g.ellipse(11, 9, 4, 2, -.4, 0, 7); g.fill();
  g.fillStyle = '#fff6d8';
  for (const [x, y] of [[9, 11], [15, 7], [20, 10], [24, 12], [13, 12], [18, 13]]) g.fillRect(x, y, 2, 1);
});
TEX.crate = canvasTex(64, 64, g => {
  g.fillStyle = '#8b5a2b'; g.fillRect(8, 28, 48, 34);
  g.fillStyle = '#a56d36'; for (let y = 30; y < 62; y += 8) g.fillRect(10, y, 44, 6);
  g.strokeStyle = '#4a2a10'; g.lineWidth = 3; g.strokeRect(9.5, 29.5, 45, 31);
  g.beginPath(); g.moveTo(10, 30); g.lineTo(54, 60); g.stroke();
  g.drawImage(TEX.patty.cv, 4, 2, 32, 32);
  g.drawImage(TEX.patty.cv, 26, 4, 32, 32);
  g.drawImage(TEX.patty.cv, 15, -6, 32, 32);
});
TEX.water = canvasTex(64, 64, g => {
  g.fillStyle = '#e8fbff'; g.beginPath(); g.arc(32, 32, 28, 0, 7); g.fill();
  g.fillStyle = '#5cc6f2'; g.beginPath(); g.arc(32, 32, 25, 0, 7); g.fill();
  g.fillStyle = '#9fe0ff'; g.beginPath(); g.arc(30, 30, 19, 0, 7); g.fill();
  g.fillStyle = '#fff'; g.beginPath(); g.ellipse(22, 20, 7, 4, -.6, 0, 7); g.fill();
  g.fillStyle = '#2d7fb8'; g.font = 'bold 22px sans-serif'; g.textAlign = 'center'; g.fillText('+', 33, 42);
});
TEX.bubble = canvasTex(16, 16, g => {
  g.fillStyle = '#e8fbff'; g.beginPath(); g.arc(8, 8, 7, 0, 7); g.fill();
  g.fillStyle = '#7fd4f5'; g.beginPath(); g.arc(8, 8, 5.5, 0, 7); g.fill();
  g.fillStyle = '#fff'; g.fillRect(4, 4, 3, 2);
});
TEX.kelp = canvasTex(48, 96, g => {
  const blades = [[12, '#2f8a3a', 3], [24, '#3fae48', -4], [36, '#2a7a34', 5]];
  for (const [x, c, s] of blades) {
    g.strokeStyle = c; g.lineWidth = 6; g.lineCap = 'round';
    g.beginPath(); g.moveTo(x, 96);
    g.bezierCurveTo(x + s * 3, 70, x - s * 3, 40, x + s, 6); g.stroke();
  }
  g.fillStyle = '#6fd06a'; for (let i = 0; i < 8; i++) { g.beginPath(); g.ellipse(8 + rnd() * 32, 10 + rnd() * 76, 4, 2, rnd() * 3, 0, 7); g.fill(); }
});
TEX.splat = canvasTex(32, 32, g => {
  dots(g, 26, ['#6b3b1c', '#e8a24c', '#4fc04a', '#ffd23a', '#d08a38'], 1, 3, 32, 32);
});
TEX.heart = canvasTex(16, 16, g => heart(g, 8, 8, 6, '#ff4d7a'));
