'use strict';
// ---------------------------------------------------------------------------
// World 1: Bikini Bottom
// ---------------------------------------------------------------------------
// HOW TO MAKE A LEVEL
//   Draw the map as rows of letters. Every row must be the same length.
//
//   UPPER and lower case are different things: N is a porthole but n is an anchovy!
//
//   Walls:  #  coral          P  pineapple        W  wood            K  rock
//   House:  L  blue planks    T  kitchen tiles    O  bedroom weave   G  bathroom wallpaper
//           B  bookshelf      C  grey stone       N  porthole window D  front door (decoration)
//   Doors:  +  opens by itself when anyone walks up, closes again after
//           R  red            Y  yellow           U  blue            (opened by their key)
//   Keys:   r  red            y  yellow           u  blue
//   Fish:   n  anchovy        b  Bubble Bass      d  Fred
//   Furniture (solid, blocks you, fish and patties):
//           c  armchair       s  couch            t  TV              z  bed
//           i  fridge         e  table            l  barrel          x  treasure chest
//           w  bathtub        o  toilet           g  Gary (not solid, meows when you walk up)
//   Stuff:  S  start (exactly one)    a  patty crate    h  sea water    k  kelp
//           .  open floor
//
//   facing:  which way SpongeBob looks at the start: 'east', 'west', 'north' or 'south'
//   floor:   'sand' (outside), 'wood', 'pink' (bathroom tiles) or 'stone'
//   ceiling: 'sky' (outside), 'net' (pineapple ceiling), 'plaster' or 'wood'
//   intro:   the line shown when the level starts (optional)
//
//   Mistakes (uneven rows, no S, a fish walled off...) show up in red on the level select.
//   Extras > House Test shows every house wall and piece of furniture.
//   The full list is also in LEVEL_GUIDE.md.
//   To try out a layout with no fish, use js/worlds/testmap.js (Main menu > MAP TEST).

addWorld({
  name: 'Conch St',
  levels: [
    // ---------------------------------------------------------------- Level 1
    {
      name: '124 Conch St',
      facing: 'east',
      floor: 'sand',
      ceiling: 'sky',
      intro: 'Lets head home after a long day of work!',
      map: [
        "#########################",
        "###########n##nn#########",
        "###########k##kk#########",
        '#n...k..............n...#',
        '#################.......#',
        '......#.......#.#.....k.#',
        '......#.....n.#.#.k.....#',
        '......#..k....#.#.......P',
        '#######.......###.......P',
        '#aS.......K..nr.R...h.d.P',
        '#######.......###....k..P',
        '......#.......#.#.......P',
        '......#..k..n.#.#.......#',
        '......#.......#.#..k....#',
        '#################.......#',
        '#n........k.........n...#',
        "#######kk########k#######",
        "########h########a#######",
        "#########################"
      ],
    },
    // ---------------------------------------------------------------- Level 2
    {
      name: 'Home Sweet Home',
      facing: 'north',
      floor: 'sand',
      ceiling: 'net',
      map: [
        "###GGGGGGG##########",
        "###Guw.onG##########",
        "###G.....G##########",
        "###G.....G##########",
        "###Gdl...G##########",
        "###LLLL+LLTTTTTTTTTT",
        "#bUR.....+...l.nl..T",
        "###L.....LC........T",
        "###Lt...cLCi..b..erT",
        "###Lh...sLC...n.d..T",
        "###La...gLC........T",
        "###La.S..LC..l.dl..T",
        "###LLLDLLLCTTTTTTTTT",
      ],
    },
    // ---------------------------------------------------------------- Level 3
    // Pineapple start house, kelp field, Krusty Krab, rocky canyon, coral maze, dunes, rock garden
    {
      name: 'Bikini Bottom',
      facing: 'east',
      floor: 'sand',
      ceiling: 'sky',
      intro: 'Feed every hungry fish in Bikini Bottom!',
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
    // ---------------------------------------------------------------- Level 4
    {
      name: 'Rock Bottom',
      facing: 'east',
      floor: 'sand',
      ceiling: 'sky',
      intro: 'Watch out for flying legs!',
      map: [
        'KKKKKKKKKKKKKKKKKKKK',
        'KS.......K.........K',
        'K....a...K....d....K',
        'K........K.........K',
        'KKKK.KKKKK...KK....K',
        'K.........n..KK..h.K',
        'K..d...............K',
        'K.....KKK....n.....K',
        'K..h..KKK.......d..K',
        'K...........a......K',
        'KKKKKKKKKKKKKKKKKKKK',
      ],
    },
    // ---------------------------------------------------------------- Level 5
    {
      name: 'The Krusty Krab',
      facing: 'east',
      floor: 'sand',
      ceiling: 'sky',
      intro: 'Dinner rush! Everyone is hungry!',
      map: [
        '####################',
        '#S....W.......W....#',
        '#.....W...b...W..a.#',
        '#.a...W.......W....#',
        '#.....WWW.WWWWW....#',
        '#..n...............#',
        '#.......d....n.....#',
        '#..h.........h.....#',
        '#.....WWWWW.WWW....#',
        '#.n...W.......W.d..#',
        '#.....W...b...W....#',
        '#.....W.......W..n.#',
        '####################',
      ],
    },
  ],
});
