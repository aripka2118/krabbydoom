'use strict';
// ---------------------------------------------------------------------------
// Levels
// ---------------------------------------------------------------------------
// # coral  P pineapple  W wood  K rock | S start  n anchovy  b Bubble Bass  d Fred
// (f guppy  s puffer: shelved)
// a patty crate  h sea water (moisture)  k kelp
// keys r red  y yellow  u blue | locked doors R red  Y yellow  U blue
// house walls L blue planks  T kitchen tile  O bedroom weave  G bathroom wallpaper
//             B bookshelf  C grey stone  N porthole window  D front door (just decoration)
// furniture c armchair  t TV  z bed  i fridge  e table  l barrel  x treasure chest
//           w bathtub  o toilet  g Gary (you can walk past Gary; everything else is solid)
// floor: sand wood pink stone | ceiling: sky net plaster wood
// angle = starting view direction (0 = east, PI/2 = south, -PI/2 = north)
//
// World levels live in js/worlds/ (one file per world) and register themselves with addWorld().

// Single-fish test arena: open room with four pillars, one crate, one water
function arena(wall, pillar, fishCh) {
  const w = wall, p = pillar;
  return [
    w.repeat(13),
    w + '...........' + w,
    w + '.....' + fishCh + '.....' + w,
    w + '...........' + w,
    w + '..' + p + '.....' + p + '..' + w,
    w + '...........' + w,
    w + '.h.......a.' + w,
    w + '...........' + w,
    w + '..' + p + '.....' + p + '..' + w,
    w + '...........' + w,
    w + '.....S.....' + w,
    w.repeat(13),
  ];
}

// Extras test arenas. World levels get added to this table as '1-1', '1-2', ...
const LEVELS = {
  house: {
    name: 'House Test', angle: 0, intro: 'Every wall and piece of furniture in the house kit',
    floor: 'wood', ceiling: 'net',
    map: [
      'LLLLNLLLLLTTTTTTTTTTTTT',
      'L.c..t..g.T..i....i...T',
      'L.........T.....e.....T',
      'D..S..........l....n..T',
      'L....n....T...........T',
      'L.a.......T.....h.....T',
      'OOOO.OOOOOGGGGGG.GGGGGG',
      'B....x....G.....w.....G',
      'B.z.......G...........G',
      'O....n.............n..G',
      'O.........G.o.........G',
      'BBBBBCCCCCGGGGGGGGGGGGG',
    ],
  },
  anchovy: { name: 'Anchovy Arena', angle: -Math.PI / 2, intro: 'Test arena: one anchovy', map: arena('#', 'K', 'n') },
  bass: { name: 'Bubble Bass Arena', angle: -Math.PI / 2, intro: 'Test arena: Bubble Bass', map: arena('W', 'P', 'b') },
  fred: { name: 'Fred Arena', angle: -Math.PI / 2, intro: 'Test arena: Fred', map: arena('K', '#', 'd') },
  // red key opens the red door, which leads to the yellow key, and so on
  doors: {
    name: 'Door & Key Test', angle: 0, intro: 'Grab the red key, then walk into the red door',
    map: [
      '###############',
      '#.....#...#...#',
      '#..r..#.y.#.u.#',
      '#S....R.n.Y.b.#',
      '#..a..#...#...#',
      '#.....#...#.h.#',
      '###########U###',
      '#.............#',
      '#....d........#',
      '#.......a.....#',
      '###############',
    ],
  },
};
const MENU_LEVEL = '1-3';   // level shown panning behind the menus

const WORLDS = [];
const FACING = { east: 0, south: Math.PI / 2, west: Math.PI, north: -Math.PI / 2 };
function addWorld(def) {
  const n = WORLDS.length + 1, world = { name: def.name, keys: [] };
  def.levels.forEach((lvl, i) => {
    const key = n + '-' + (i + 1), title = 'Level ' + key + ': ' + lvl.name;
    const problems = checkLevel(lvl.map);
    if (lvl.floor && !FLOORS[lvl.floor]) problems.push("unknown floor '" + lvl.floor + "' (use " + Object.keys(FLOORS).join(', ') + ')');
    if (lvl.ceiling && !CEILINGS[lvl.ceiling]) problems.push("unknown ceiling '" + lvl.ceiling + "' (use " + Object.keys(CEILINGS).join(', ') + ')');
    for (const p of problems) console.warn(title + ' - ' + p);
    LEVELS[key] = { name: lvl.name, title, intro: lvl.intro || title, angle: FACING[lvl.facing] || 0,
      floor: lvl.floor, ceiling: lvl.ceiling, map: lvl.map, world: n - 1, index: i, problems };
    world.keys.push(key);
  });
  WORLDS.push(world);
}

// Catch map mistakes up front so a bad level shows a message instead of breaking the game
const FISH_CH = 'fsnbd';
function checkLevel(m) {
  if (!Array.isArray(m) || !m.length) return ['map is empty'];
  const out = [], w = m[0].length;
  m.forEach((row, y) => { if (row.length !== w) out.push('row ' + (y + 1) + ' is ' + row.length + ' long, should be ' + w); });
  let starts = 0, sx = 0, sy = 0;
  const fishAt = [], keysOnMap = new Set(), doorsOnMap = new Set();
  m.forEach((row, y) => [...row].forEach((ch, x) => {
    if (ch === 'S') { starts++; sx = x; sy = y; }
    else if (FISH_CH.includes(ch)) fishAt.push([x, y]);
    else if (KEYS[ch]) keysOnMap.add(ch);
    else if (KEYS[ch.toLowerCase()]) doorsOnMap.add(ch.toLowerCase());
    else if (!WALLS[ch] && !PROPS[ch] && !'.ahk'.includes(ch)) out.push("unknown letter '" + ch + "' at row " + (y + 1) + ', column ' + (x + 1));
  }));
  if (starts !== 1) out.push('needs exactly one S (found ' + starts + ')');
  if (!fishAt.length) out.push('has no fish to feed');
  for (const k of doorsOnMap) if (!keysOnMap.has(k)) out.push('has a ' + KEYS[k].name + ' door but no ' + KEYS[k].name + ' key');
  if (out.length) return out;
  // every fish has to be reachable from the start, or the level can't be won.
  // Walk out from S; each key reached unlocks its doors, so walk again until no new keys turn up.
  const have = new Set();
  let seen, grew = true;
  while (grew) {
    grew = false; seen = new Set([sx + ',' + sy]);
    const q = [[sx, sy]];
    for (let i = 0; i < q.length; i++) {
      const [x, y] = q[i];
      if (KEYS[m[y][x]] && !have.has(m[y][x])) { have.add(m[y][x]); grew = true; }
      for (const [nx, ny] of [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]]) {
        const ch = (m[ny] || '')[nx];
        if (ch === undefined || seen.has(nx + ',' + ny) || (PROPS[ch] && PROPS[ch].solid)) continue;
        if (WALLS[ch] && !(ch !== ch.toLowerCase() && have.has(ch.toLowerCase()))) continue;
        seen.add(nx + ',' + ny); q.push([nx, ny]);
      }
    }
  }
  for (const [x, y] of fishAt) if (!seen.has(x + ',' + y)) out.push('fish at row ' + (y + 1) + ', column ' + (x + 1) + ' is walled off');
  return out;
}
const nextLevel = key => { const l = LEVELS[key]; return l.world == null ? null : WORLDS[l.world].keys[l.index + 1] || null; };
