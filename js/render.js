'use strict';
// ---------------------------------------------------------------------------
// Render
// ---------------------------------------------------------------------------
// One wall column. o = how far a door has slid up into the ceiling (0 = closed)
function wallCol(x, pd, side, tex, rdx, rdy, o) {
  let wx = side === 0 ? P.y + pd * rdy : P.x + pd * rdx;
  wx -= Math.floor(wx);
  let tx = (wx * TS) | 0;
  if ((side === 0 && rdx > 0) || (side === 1 && rdy < 0)) tx = TS - tx - 1;
  const lh = H / pd, top = HZ - lh / 2;
  const y0 = Math.max(0, Math.floor(top)), y1 = Math.min(H, Math.floor(HZ + lh / 2 - o * lh));
  const step = TS / lh;
  let tp = (y0 - top) * step + o * TS;
  const k = fogK(pd), dk = side ? .72 : 1, tpx = tex.px;
  for (let y = y0; y < y1; y++) {
    px[y * W + x] = fogc(tpx[((tp | 0) & 63) * 64 + tx], k, dk);
    tp += step;
  }
}

function renderWorld() {
  const dX = Math.cos(P.a), dY = Math.sin(P.a), pX = -dY * PL, pY = dX * PL;
  const lvl = LEVELS[currentLevel], ceil = CEILINGS[lvl.ceiling] || TEX.sky;
  const sand = (FLOORS[lvl.floor] || TEX.sand).px, sky = ceil.px;

  // floor + ceiling
  const rx0 = dX - pX, ry0 = dY - pY, rx1 = dX + pX, ry1 = dY + pY;
  const cOff = ceil.scroll ? time * 6 : 0;
  for (let y = HZ; y < H; y++) {
    const rowD = HZ / (y - HZ + .5);
    const sx = rowD * (rx1 - rx0) / W, sy = rowD * (ry1 - ry0) / W;
    let fx_ = P.x + rowD * rx0, fy_ = P.y + rowD * ry0;
    const k = fogK(rowD), fr = y * W, cr = (H - 1 - y) * W;
    for (let x = 0; x < W; x++) {
      const tx = (fx_ * TS) & 63, ty = (fy_ * TS) & 63;
      px[fr + x] = fogc(sand[ty * 64 + tx], k);
      const cx = (fx_ * TS + cOff) & 63, cy = (fy_ * TS + cOff * .5) & 63;
      px[cr + x] = fogc(sky[cy * 64 + cx], k);
      fx_ += sx; fy_ += sy;
    }
  }

  // walls (a door that is sliding open lets the ray carry on to whatever is behind it)
  for (let x = 0; x < W; x++) {
    const cam = 2 * x / W - 1;
    const rdx = dX + pX * cam || 1e-9, rdy = dY + pY * cam || 1e-9;
    let mx = Math.floor(P.x), my = Math.floor(P.y);
    const ddx = Math.abs(1 / rdx), ddy = Math.abs(1 / rdy);
    let stx, sty, sdx, sdy;
    if (rdx < 0) { stx = -1; sdx = (P.x - mx) * ddx; } else { stx = 1; sdx = (mx + 1 - P.x) * ddx; }
    if (rdy < 0) { sty = -1; sdy = (P.y - my) * ddy; } else { sty = 1; sdy = (my + 1 - P.y) * ddy; }
    let side = 0, tex = null, door = null;
    for (let i = 0; i < 64; i++) {
      if (sdx < sdy) { sdx += ddx; mx += stx; side = 0; } else { sdy += ddy; my += sty; side = 1; }
      tex = WALLS[cell(mx, my)];
      if (!tex) continue;
      if (tex.door) {
        const o = doorO[my * MW + mx];
        if (o >= 1) { tex = null; continue; }   // wide open
        if (o > 0 && !door) { door = { pd: side === 0 ? sdx - ddx : sdy - ddy, side, tex, o }; tex = null; continue; }
      }
      break;
    }
    const pd = side === 0 ? sdx - ddx : sdy - ddy;
    zbuf[x] = door && door.o < .5 ? door.pd : pd;
    if (tex) wallCol(x, pd, side, tex, rdx, rdy, 0);
    if (door) wallCol(x, door.pd, door.side, door.tex, rdx, rdy, door.o);
  }

  // sprites
  const list = [];
  for (const f of fish) {
    const r = f.vx * pX + f.vy * pY;
    if (Math.abs(r) > .05) f.flip = r > 0;
    const frames = f.legOut ? f.tex.noleg : f.fed ? f.tex.fed : f.tex.hungry;
    const z = f.t.ground
      ? f.t.size / 2 + (Math.hypot(f.vx, f.vy) > .1 ? Math.abs(Math.sin(f.anim * Math.PI)) * .03 : 0)
      : .5 + Math.sin(time * 2 + f.ph) * .05;
    list.push({ x: f.x, y: f.y, z, h: f.t.size, tex: frames[Math.floor(f.anim) % 2], flip: f.flip, flash: f.flash > 0 });
  }
  for (const it of items) {
    if (it.taken) continue;
    if (it.kind === 'ammo') list.push({ x: it.x, y: it.y, z: .2, h: .4, tex: TEX.crate });
    else if (it.kind === 'key') list.push({ x: it.x, y: it.y, z: .3 + Math.sin(time * 3 + it.x) * .05, h: .28, tex: KEYS[it.key].tex });
    else list.push({ x: it.x, y: it.y, z: .28 + Math.sin(time * 3) * .04, h: .32, tex: TEX.water });
  }
  for (const d of decor) list.push({ x: d.x, y: d.y, z: .45, h: .9, tex: TEX.kelp });
  for (const p of props) list.push({ x: p.x, y: p.y, z: p.t.h / 2, h: p.t.h, tex: p.t.tex });
  for (const s of shots) {
    if (s.kind === 'patty') list.push({ x: s.x, y: s.y, z: s.z + Math.sin(s.life * 20) * .02, h: .18, tex: TEX.patty });
    else if (s.kind === 'leg') list.push({ x: s.x, y: s.y, z: s.z, h: .42, tex: TEX.leg[Math.floor(s.spin) & 7] });
    else list.push({ x: s.x, y: s.y, z: s.z, h: .16, tex: TEX.bubble });
  }
  for (const e of fx) list.push({ x: e.x, y: e.y, z: e.z, h: e.h, tex: e.tex });

  const invDet = 1 / (pX * dY - dX * pY);
  for (const s of list) {
    const sx = s.x - P.x, sy = s.y - P.y;
    s.tX = invDet * (dY * sx - dX * sy);
    s.tY = invDet * (-pY * sx + pX * sy);
  }
  list.sort((a, b) => b.tY - a.tY);
  for (const s of list) {
    if (s.tY < .15) continue;
    const tex = s.tex, sh = s.h * H / s.tY, sw = sh * tex.w / tex.h;
    const scx = (W / 2) * (1 + s.tX / s.tY), scy = HZ + (.5 - s.z) * H / s.tY;
    const left = scx - sw / 2, top = scy - sh / 2;
    const xa = Math.max(0, Math.ceil(left)), xb = Math.min(W, Math.ceil(left + sw));
    const ya = Math.max(0, Math.ceil(top)), yb = Math.min(H, Math.ceil(top + sh));
    const k = fogK(s.tY), tw = tex.w, th = tex.h, tpx = tex.px;
    for (let x = xa; x < xb; x++) {
      if (s.tY >= zbuf[x]) continue;
      let tx = ((x - left) * tw / sw) | 0;
      if (s.flip) tx = tw - 1 - tx;
      for (let y = ya; y < yb; y++) {
        const c = tpx[(((y - top) * th / sh) | 0) * tw + tx];
        if ((c >>> 24) < 128) continue;
        px[y * W + x] = s.flash ? flashc(c) : fogc(c, k);
      }
    }
  }
  ctx.putImageData(img, 0, 0);
}
