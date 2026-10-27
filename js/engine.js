'use strict';
// ---------------------------------------------------------------------------
// Setup
// ---------------------------------------------------------------------------
const W = 480, H = 270, HZ = H >> 1, TS = 64;
const PL = W / (2 * H);            // camera plane length -> square pixels
const cv = document.getElementById('c');
cv.width = W; cv.height = H;
const ctx = cv.getContext('2d');
ctx.imageSmoothingEnabled = false;
const img = ctx.createImageData(W, H);
const px = new Uint32Array(img.data.buffer);
const zbuf = new Float32Array(W);

let seed = 1337;
function rnd() {
  seed = seed + 0x6D2B79F5 | 0;
  let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
  t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
  return ((t ^ t >>> 14) >>> 0) / 4294967296;
}

// Underwater fog colour
const FR = 18, FG = 78, FB = 110;
function fogc(c, k, dk = 1) {
  const r = (c & 255) * dk, g = (c >> 8 & 255) * dk, b = (c >> 16 & 255) * dk;
  return 0xff000000 | ((b + (FB - b) * k) << 16) | ((g + (FG - g) * k) << 8) | (r + (FR - r) * k);
}
function flashc(c) {
  const r = c & 255, g = c >> 8 & 255, b = c >> 16 & 255;
  return 0xff000000 | ((b + (255 - b) * .6) << 16) | ((g + (255 - g) * .6) << 8) | (r + (255 - r) * .6);
}
const fogK = d => 1 - Math.exp(-d * 0.12);
