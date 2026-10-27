'use strict';
// ---------------------------------------------------------------------------
// Levels
// ---------------------------------------------------------------------------
// # coral  P pineapple  W wood  K rock | S start  n anchovy  b Bubble Bass  d Fred
// (f guppy  s puffer  g grouper: shelved)
// a patty crate  h sea water (moisture)  k kelp
// angle = starting view direction (0 = east, PI/2 = south, -PI/2 = north)

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

const LEVELS = {
  // Pineapple start house, kelp field, Krusty Krab, rocky canyon, coral maze, dunes, rock garden
  main: {
    name: 'Bikini Bottom', angle: 0, intro: 'Feed every hungry fish in Bikini Bottom!',
    map: [
      '################################',
      '#S...P...k.........W...........#',
      '#.a........n.n.....W......b....#',
      '#....P..K......n...W..h........#',
      '#....P.....n...k...............#',
      '#PP.PP..........n..W..b......a.#',
      '#.......K..........W...........#',
      '#.h.........k......W...........#',
      '#..................W...........#',
      '#..a...............WWWWWW.WWWWW#',
      '###.##########.##########.######',
      '#...d......k........a..........#',
      '#......................d....h..#',
      '#KKKKK.KKKKKKKKK.KKKKKKKKKK.KKK#',
      '#.....n......#.......K..n......#',
      '#.##.....##..#..b....K.....K...#',
      '#.#..n....#..#..........K..n...#',
      '#.#..a.....k.#...k...K.....d...#',
      '#...n.....#..........K.K.......#',
      '#.###...###..#....a..K...n..K..#',
      '#.....h......#..............a..#',
      '#..n.....n...#...b...K.k.....h.#',
      '#............#.......K.........#',
      '################################',
    ],
  },
  anchovy: { name: 'Anchovy Arena', angle: -Math.PI / 2, intro: 'Test arena: one anchovy', map: arena('#', 'K', 'n') },
  bass: { name: 'Bubble Bass Arena', angle: -Math.PI / 2, intro: 'Test arena: Bubble Bass', map: arena('W', 'P', 'b') },
  fred: { name: 'Fred Arena', angle: -Math.PI / 2, intro: 'Test arena: Fred', map: arena('K', '#', 'd') },
};
