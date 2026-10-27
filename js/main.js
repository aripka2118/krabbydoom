'use strict';
// ---------------------------------------------------------------------------
// Loop
// ---------------------------------------------------------------------------
reset();
let last = performance.now();
function frame(now) {
  const dt = Math.min(.05, (now - last) / 1000);
  last = now;
  if (state === 'play') update(dt);
  else if (MENU_SCREENS.includes(state)) { time += dt; P.a += dt * .15; }   // slow pan behind the menus
  render();
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
