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
  else { time += dt; P.a += dt * .15; }
  render();
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
