'use strict';
// ---------------------------------------------------------------------------
// Map
// ---------------------------------------------------------------------------
// Level layouts live in levels.js; loadLevel swaps the active one in
let MAP, MW, MH, flow, currentLevel;
function loadLevel(key) {
  currentLevel = key;
  MAP = LEVELS[key].map;
  MW = MAP[0].length; MH = MAP.length;
  flow = new Int16Array(MW * MH);
}
loadLevel('main');
const cell = (x, y) => (x < 0 || y < 0 || x >= MW || y >= MH) ? '#' : MAP[y][x];
const solid = (x, y) => !!WALLS[cell(Math.floor(x), Math.floor(y))];
const blocked = (x, y, r) => solid(x - r, y - r) || solid(x + r, y - r) || solid(x - r, y + r) || solid(x + r, y + r);
function moveEnt(e, dx, dy, r) {
  if (!blocked(e.x + dx, e.y, r)) e.x += dx;
  if (!blocked(e.x, e.y + dy, r)) e.y += dy;
}
function los(a, b) {
  const dx = b.x - a.x, dy = b.y - a.y, n = Math.ceil(Math.hypot(dx, dy) / .2);
  for (let i = 1; i < n; i++) if (solid(a.x + dx * i / n, a.y + dy * i / n)) return false;
  return true;
}

// Flow field toward the player so fish can path around walls
function buildFlow() {
  flow.fill(-1);
  const s = Math.floor(P.y) * MW + Math.floor(P.x), q = [s];
  flow[s] = 0;
  for (let i = 0; i < q.length; i++) {
    const c = q[i], cx = c % MW, cy = (c / MW) | 0;
    for (const [ox, oy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nx = cx + ox, ny = cy + oy;
      if (WALLS[cell(nx, ny)]) continue;
      const n = ny * MW + nx;
      if (flow[n] < 0) { flow[n] = flow[c] + 1; q.push(n); }
    }
  }
}
function flowTarget(f) {
  const cx = Math.floor(f.x), cy = Math.floor(f.y);
  let best = flow[cy * MW + cx], bx = cx, by = cy;
  for (const [ox, oy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
    const v = flow[(cy + oy) * MW + cx + ox];
    if (!WALLS[cell(cx + ox, cy + oy)] && v >= 0 && (best < 0 || v < best)) { best = v; bx = cx + ox; by = cy + oy; }
  }
  return { x: bx + .5, y: by + .5 };
}
