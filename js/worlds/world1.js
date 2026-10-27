'use strict';
// ---------------------------------------------------------------------------
// World 1: Bikini Bottom
// ---------------------------------------------------------------------------
// HOW TO MAKE A LEVEL
//   Draw the map as rows of letters. Every row must be the same length.
//
//   Walls:  #  coral      P  pineapple      W  wood      K  rock
//   Fish:   n  anchovy    b  Bubble Bass    d  Fred
//   Stuff:  S  start (exactly one)    a  patty crate    h  sea water    k  kelp
//           .  open floor
//
//   facing: which way SpongeBob looks at the start: 'east', 'west', 'north' or 'south'
//   intro:  the line shown when the level starts (optional)
//
//   Mistakes (uneven rows, no S, a fish walled off...) show up in red on the level select.
//   Levels 1, 2, 4 and 5 are placeholders: replace them with your own.

addWorld({
  name: 'Conch St',
  levels: [
    // ---------------------------------------------------------------- Level 1
    {
      name: '124 Conch St',
      facing: 'east',
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
      name: 'Goo Lagoon',
      facing: 'east',
      intro: 'Bubble Bass is here. He needs 5 patties!',
      map: [
        '####################',
        '#S.......W.........#',
        '#........W...n.....#',
        '#..a.....W.........#',
        '#........W....b....#',
        '#..n.....W.........#',
        '#..................#',
        '#WWWW.WWWW...h..n..#',
        '#..........k.......#',
        '#..n....b......a...#',
        '#..................#',
        '####################',
      ],
    },
    // ---------------------------------------------------------------- Level 3
    // Pineapple start house, kelp field, Krusty Krab, rocky canyon, coral maze, dunes, rock garden
    {
      name: 'Bikini Bottom',
      facing: 'east',
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
