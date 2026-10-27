'use strict';
// ---------------------------------------------------------------------------
// Audio (synthesized)
// ---------------------------------------------------------------------------
let AC = null;
function initAudio() {
  if (!AC) { try { AC = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {} }
  if (AC && AC.state === 'suspended') AC.resume();
}
function tone(type, f0, f1, dur, vol, delay = 0) {
  if (!AC) return;
  const t = AC.currentTime + delay, o = AC.createOscillator(), g = AC.createGain();
  o.type = type; o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(f1, t + dur);
  g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(.001, t + dur);
  o.connect(g); g.connect(AC.destination); o.start(t); o.stop(t + dur + .02);
}
const SFX = {
  throw: () => tone('triangle', 700, 200, .12, .12),
  chomp: () => { tone('square', 320, 90, .08, .1); tone('square', 280, 80, .08, .1, .09); },
  fed: () => [523, 659, 784, 1047].forEach((f, i) => tone('sine', f, f * 1.01, .14, .14, i * .07)),
  hurt: () => tone('sawtooth', 180, 60, .22, .14),
  pickup: () => { tone('square', 440, 880, .1, .08); tone('square', 660, 1320, .1, .08, .08); },
  splat: () => tone('sawtooth', 140, 40, .09, .08),
  spit: () => tone('sine', 300, 1000, .22, .12),
  empty: () => tone('square', 120, 100, .06, .06),
  win: () => [523, 659, 784, 659, 784, 1047].forEach((f, i) => tone('triangle', f, f, .18, .15, i * .13)),
  die: () => [400, 330, 260, 180].forEach((f, i) => tone('triangle', f, f * .95, .25, .14, i * .2)),
};
