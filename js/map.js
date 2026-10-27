'use strict';
// ---------------------------------------------------------------------------
// Map
// ---------------------------------------------------------------------------
// Level layouts live in levels.js; loadLevel swaps the active one in
// MAP is a copy so opened doors can be cleared out of it without touching the level itself.
// doorO = how far each door cell has slid open (0..1)
// propGrid = which solid piece of furniture (index into props, +1) stands in each cell
let MAP, MW, MH, flow, doorO, propGrid, currentLevel;
function loadLevel(key) {
  currentLevel = key;
  MAP = LEVELS[key].map.slice();
  MW = MAP[0].length; MH = MAP.length;
  flow = new Int16Array(MW * MH);
  doorO = new Float32Array(MW * MH);
  propGrid = new Int16Array(MW * MH);
}
loadLevel(MENU_LEVEL);
const cell = (x, y) => (x < 0 || y < 0 || x >= MW || y >= MH) ? '#' : MAP[y][x];
const solid = (x, y) => !!WALLS[cell(Math.floor(x), Math.floor(y))];
// a cell nothing can path through: wall, closed door or furniture
const walkable = (x, y) => !WALLS[cell(x, y)] && !propGrid[y * MW + x];
// is (x, y) within r of a solid piece of furniture? (r = 0 tests a single point, e.g. a patty)
function propBlocked(x, y, r) {
  const cx = Math.floor(x), cy = Math.floor(y);
  for (let j = cy - 1; j <= cy + 1; j++) for (let i = cx - 1; i <= cx + 1; i++) {
    if (i < 0 || j < 0 || i >= MW || j >= MH) continue;
    const p = props[propGrid[j * MW + i] - 1];
    if (p && Math.abs(x - p.x) < r + p.r && Math.abs(y - p.y) < r + p.r) return true;
  }
  return false;
}
const blocked = (x, y, r) => solid(x - r, y - r) || solid(x + r, y - r) || solid(x - r, y + r) || solid(x + r, y + r) || propBlocked(x, y, r);
function moveEnt(e, dx, dy, r) {
  if (!blocked(e.x + dx, e.y, r)) e.x += dx;
  if (!blocked(e.x, e.y + dy, r)) e.y += dy;
}
// fish can't see through walls or furniture (so they path around it instead of pushing into it)
function los(a, b) {
  const dx = b.x - a.x, dy = b.y - a.y, n = Math.ceil(Math.hypot(dx, dy) / .2);
  for (let i = 1; i < n; i++) {
    const x = a.x + dx * i / n, y = a.y + dy * i / n;
    if (solid(x, y) || propBlocked(x, y, .1)) return false;
  }
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
      if (!walkable(nx, ny)) continue;
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
    if (walkable(cx + ox, cy + oy) && v >= 0 && (best < 0 || v < best)) { best = v; bx = cx + ox; by = cy + oy; }
  }
  return { x: bx + .5, y: by + .5 };
}
