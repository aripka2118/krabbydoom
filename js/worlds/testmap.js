'use strict';
// ---------------------------------------------------------------------------
// Map Test: Main menu > MAP TEST loads this map
// ---------------------------------------------------------------------------
// A scratch pad for trying out a layout. Same letters and options as a level in world1.js
// (see LEVEL_GUIDE.md). Fish are optional: with no fish the level never ends, so you can
// walk around as long as you like. Save this file, then refresh the game page to see it.
// Esc > RESTART puts you back at the start.

addTestMap({
  facing: 'north',
  floor: 'sand',
  ceiling: 'net',
  map: [
    "###################",
    "####uw.on##########",
    "####.....##########",
    "####.....##########",
    "####dl...##########",
    "#######+###########",
    "#bUR.....+...l.nl##",
    "####.....#........#",
    "####t...c#i.....er#",
    "####h...s#...n....#",
    "####a...g#........#",
    "####..S..#..l.dl..#",
    "###################",
  ]
});
