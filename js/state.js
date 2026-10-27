'use strict';
// ---------------------------------------------------------------------------
// Game state
// ---------------------------------------------------------------------------
const P = { x: 1.5, y: 1.5, a: 0, hp: 100, ammo: 20, cool: 0, throwT: 0, bob: 0, hurt: 0, grin: 0, glow: 0 };
let fish = [], items = [], decor = [], shots = [], fx = [];
let fedCount = 0, state = 'title', time = 0, showMap = false, start = { x: 1.5, y: 1.5 };
let message = '', msgT = 0, flowT = 0, emptyT = 0;
const FED_LINES = ['Mmm, Krabby Patty!', 'Order up!', 'One happy fish!', 'Tastes like freedom!', 'Barnacles, that hit the spot!'];
function say(s, t = 2.2) { message = s; msgT = t; }

function reset() {
  fish = []; items = []; decor = []; shots = []; fx = []; fedCount = 0;
  for (let y = 0; y < MH; y++) for (let x = 0; x < MW; x++) {
    const ch = MAP[y][x], cx = x + .5, cy = y + .5;
    if (ch === 'S') { P.x = cx; P.y = cy; start = { x: cx, y: cy }; }
    else if ('fsgnb'.includes(ch)) {
      const t = FISH[{ f: 'guppy', s: 'puffer', g: 'grouper', n: 'anchovy', b: 'bass' }[ch]];
      fish.push({ t, x: cx, y: cy, r: t.radius || Math.min(.3, t.size * .35), hunger: t.hunger, fed: false, alert: false,
        atk: 1 + Math.random(), flash: 0, anim: Math.random() * 2, ph: Math.random() * 6, vx: 0, vy: 0, flip: false, wt: 0, wa: 0, sd: 1,
        tex: t.randomColor ? anchovySet() : t.tex });
    }
    else if (ch === 'a') items.push({ kind: 'ammo', x: cx, y: cy });
    else if (ch === 'h') items.push({ kind: 'water', x: cx, y: cy });
    else if (ch === 'k') decor.push({ x: cx, y: cy });
  }
  Object.assign(P, { a: Math.PI / 2, hp: 100, ammo: 20, cool: 0, throwT: 0, bob: 0, hurt: 0, grin: 0, glow: 0 });
  message = ''; msgT = 0;
  buildFlow();
}
