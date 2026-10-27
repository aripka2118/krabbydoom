# Krabby Doom level guide

Levels live in `js/worlds/world1.js`. Each level looks like this:

```js
{
  name: 'Living Room',
  facing: 'east',          // which way you look at the start: east / west / north / south
  floor: 'wood',           // optional, default sand
  ceiling: 'net',          // optional, default sky
  intro: 'Gary, I am home!',
  map: [
    'LLLLNLLLLL',
    'L.c..t..gL',
    'D..S.....L',
    'L....n...L',
    'LLLLLLLLLL',
  ],
},
```

Every row must be the same length. Mistakes show up in red on the level select.
Extras → **House Test** shows every wall and piece of furniture below.

## Walls (uppercase)

| Letter | Wall |
|---|---|
| `#` | Coral |
| `P` | Pineapple |
| `W` | Wood |
| `K` | Rock |
| `L` | Blue planks (living room) |
| `T` | Blue stone tiles (kitchen) |
| `O` | Orange weave (bedroom) |
| `G` | Green flower wallpaper (bathroom) |
| `B` | Bookshelf (library) |
| `C` | Grey stone |
| `N` | Porthole window (on blue planks) |
| `D` | Front door (decoration, doesn't open) |

## Locked doors and keys

| Key | Door | Colour |
|---|---|---|
| `r` | `R` | Red |
| `y` | `Y` | Yellow |
| `u` | `U` | Blue |

## Fish

| Letter | Fish |
|---|---|
| `n` | Anchovy |
| `b` | Bubble Bass |
| `d` | Fred |

## Furniture (solid: you, fish and patties can't go through it)

| Letter | Object |
|---|---|
| `c` | Red armchair |
| `t` | TV |
| `z` | Bed |
| `i` | Fridge |
| `e` | Table |
| `l` | Barrel |
| `x` | Treasure chest |
| `w` | Bathtub |
| `o` | Toilet |
| `g` | Gary (not solid; walk up to him and he meows) |

## Everything else

| Letter | What |
|---|---|
| `S` | Start (exactly one) |
| `.` | Open floor |
| `a` | Patty crate (+10) |
| `h` | Sea water (+25 moisture) |
| `k` | Kelp (decoration) |

## Floors and ceilings

| `floor:` | Looks like |
|---|---|
| `sand` | Sea floor sand (default) |
| `wood` | Wooden floorboards |
| `pink` | Pink bathroom tiles |
| `stone` | Grey flagstones |

| `ceiling:` | Looks like |
|---|---|
| `sky` | Open water with sea flowers (default) |
| `net` | Brown woven pineapple ceiling |
| `plaster` | Plain blue-grey |
| `wood` | Wooden boards |
