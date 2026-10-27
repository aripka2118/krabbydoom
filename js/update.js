'use strict';
// ---------------------------------------------------------------------------
// Update
// ---------------------------------------------------------------------------
function throwPatty() {
  const dx = Math.cos(P.a), dy = Math.sin(P.a);
  P.ammo--; P.cool = .38; P.throwT = 1;
  shots.push({ kind: 'patty', x: P.x + dx * .3, y: P.y + dy * .3, dx: dx * 11, dy: dy * 11, z: .42, life: 3 });
  SFX.throw();
}

// Fred pulls off his leg and throws it. It follows a loop out through where the player was
// standing and back to Fred: p(s) = Fred + u*L*sin(pi*s) + v*W*sin(2*pi*s), s = 0..1.
function throwLeg(f, d) {
  const ux = (P.x - f.x) / d, uy = (P.y - f.y) / d, side = Math.random() < .5 ? 1 : -1;
  const L = Math.min(9, d);   // the loop's far tip lands right where the player is standing
  // pick the widest loop (either side) that doesn't clip a wall, so it still fits down hallways
  const clear = (sd, W) => {
    for (let k = 1; k < 24; k++) {
      const a = Math.PI * k / 24, out = L * Math.sin(a), lat = W * Math.sin(2 * a) * sd;
      if (solid(f.x + ux * out - uy * lat, f.y + uy * out + ux * lat)) return false;
    }
    return true;
  };
  const wMax = Math.min(1.8, .2 * L + .4);
  let sd = side, W = 0;
  search: for (const w of [1, .7, .45, .25]) for (const s of [side, -side]) if (clear(s, wMax * w)) { sd = s; W = wMax * w; break search; }
  f.legOut = true;
  shots.push({ kind: 'leg', owner: f, x: f.x, y: f.y, z: .45, ux, uy, vx: -uy * sd, vy: ux * sd,
    L, W, dur: .7 + L / 6, s: 0, back: false, hit: false, spin: 0, life: 8 });
  SFX.leg();
  say('Fred: "MY LEG!"', 1.2);
}
function updateLeg(s, dt) {
  const f = s.owner;
  s.spin += dt * 16; s.life -= dt;
  let caught = s.life <= 0;
  if (!s.back) {
    s.s = Math.min(1, s.s + dt / s.dur);
    const a = Math.PI * s.s, out = s.L * Math.sin(a), lat = s.W * Math.sin(2 * a);
    const nx = f.x + s.ux * out + s.vx * lat, ny = f.y + s.uy * out + s.vy * lat;
    if (solid(nx, ny)) s.back = true;   // bonked a wall: fly straight home instead
    else { s.x = nx; s.y = ny; }
    if (s.s >= 1) caught = true;
  } else {
    const dx = f.x - s.x, dy = f.y - s.y, d = Math.hypot(dx, dy);
    if (d < .35) caught = true;
    else { s.x += dx / d * 7 * dt; s.y += dy / d * 7 * dt; }
  }
  if (!s.hit && !f.fed && Math.hypot(s.x - P.x, s.y - P.y) < .45) {
    s.hit = true; P.hp -= f.t.dmg; P.hurt = .6; SFX.hurt();
    say("Ow! Fred's leg got you!", 1.2);
  }
  if (caught) {
    s.life = 0; f.legOut = false; f.atk = 1.2 + Math.random() * 1.2;
    SFX.catch();
  }
}

function update(dt) {
  time += dt;
  // look
  let rot = 0;
  if (keys.ArrowLeft || keys.KeyQ) rot--;
  if (keys.ArrowRight || keys.KeyE) rot++;
  P.a += rot * 2.6 * dt + mouseDX * .0025;
  mouseDX = 0;
  const dX = Math.cos(P.a), dY = Math.sin(P.a);

  // move
  let fw = 0, st = 0;
  if (keys.KeyW || keys.ArrowUp) fw++;
  if (keys.KeyS || keys.ArrowDown) fw--;
  if (keys.KeyD) st++;
  if (keys.KeyA) st--;
  let mx = dX * fw - dY * st, my = dY * fw + dX * st;
  const ml = Math.hypot(mx, my);
  if (ml > 0) {
    const sp = (keys.ShiftLeft || keys.ShiftRight ? 5.2 : 3.3) * dt / ml;
    moveEnt(P, mx * sp, my * sp, .25);
    P.bob += dt * (keys.ShiftLeft || keys.ShiftRight ? 13 : 9);
  }

  // throw
  P.cool -= dt; P.throwT = Math.max(0, P.throwT - dt / .32);
  emptyT -= dt;
  if ((mouseDown || keys.Space) && P.cool <= 0) {
    if (P.ammo > 0) throwPatty();
    else if (emptyT <= 0) { SFX.empty(); say('Out of patties! Find a crate.'); emptyT = 1; }
  }
  P.hurt = Math.max(0, P.hurt - dt * 1.5);
  P.glow = Math.max(0, P.glow - dt * 2);
  P.grin -= dt; msgT -= dt;

  // pickups
  for (const it of items) {
    if (it.taken || Math.hypot(it.x - P.x, it.y - P.y) > .55) continue;
    if (it.kind === 'key') { it.taken = true; P.keys[it.key] = true; say('Got the ' + KEYS[it.key].name + ' key!'); SFX.key(); P.glow = .5; }
    else if (it.kind === 'ammo') { it.taken = true; P.ammo += 10; say('+10 Krabby Patties'); SFX.pickup(); P.glow = .5; }
    else if (P.hp < 100) { it.taken = true; P.hp = Math.min(100, P.hp + 25); say('Ahh, refreshing sea water! +25 moisture'); SFX.pickup(); P.glow = .5; }
  }
  // locked doors: walk up to one holding its key and it slides open
  lockedT -= dt;
  const pcx = Math.floor(P.x), pcy = Math.floor(P.y);
  for (let y = pcy - 1; y <= pcy + 1; y++) for (let x = pcx - 1; x <= pcx + 1; x++) {
    const ch = cell(x, y), k = ch.toLowerCase();
    if (!KEYS[k] || ch === k || doorO[y * MW + x] > 0) continue;
    const nx = Math.max(x, Math.min(x + 1, P.x)), ny = Math.max(y, Math.min(y + 1, P.y));
    if (Math.hypot(P.x - nx, P.y - ny) > .45) continue;
    if (P.keys[k]) { doorO[y * MW + x] = .01; opening.push({ x, y }); SFX.door(); say('Opened the ' + KEYS[k].name + ' door!'); }
    else if (lockedT <= 0) { SFX.empty(); say('Locked! You need the ' + KEYS[k].name + ' key.', 1.5); lockedT = 1.5; }
  }
  for (const d of opening) {
    const i = d.y * MW + d.x;
    doorO[i] = Math.min(1, doorO[i] + dt * 1.6);
    if (doorO[i] >= 1) { MAP[d.y] = MAP[d.y].slice(0, d.x) + '.' + MAP[d.y].slice(d.x + 1); d.done = true; flowT = 0; }
  }
  opening = opening.filter(d => !d.done);

  meowT -= dt;
  for (const p of props) if (p.t.meow && meowT <= 0 && Math.hypot(p.x - P.x, p.y - P.y) < .8) { say('Gary: "Meow."', 1.5); SFX.meow(); meowT = 4; }

  // never leave the player stranded without patties
  if (P.ammo === 0 && !shots.some(s => s.kind === 'patty') && !items.some(i => i.kind === 'ammo' && !i.taken) && fedCount < fish.length) {
    items.push({ kind: 'ammo', x: start.x, y: start.y });
    say('A fresh crate of patties arrived at the start!', 3);
  }

  // flow field
  flowT -= dt;
  if (flowT <= 0) { buildFlow(); flowT = .25; }

  // fish
  for (const f of fish) {
    f.anim += dt * (f.t.stride || 7) * (f.fed ? .45 : 1);
    f.flash -= dt; f.atk -= dt;
    const ox = f.x, oy = f.y;
    const spd = f.t.speed;
    if (f.fed) {
      f.wt -= dt;
      if (f.wt <= 0) { f.wa = Math.random() * Math.PI * 2; f.wt = 1 + Math.random() * 2; }
      const bx = f.x;
      moveEnt(f, Math.cos(f.wa) * .8 * dt, Math.sin(f.wa) * .8 * dt, f.r);
      if (f.x === bx) f.wt = 0;
    } else {
      const dx = P.x - f.x, dy = P.y - f.y, d = Math.hypot(dx, dy);
      const see = d < 14 && los(f, P);
      if (!f.alert && (see || d < 2.5)) f.alert = true;
      if (f.alert) {
        let tx, ty, go = true;
        if (see) { tx = P.x; ty = P.y; } else { const t = flowTarget(f); tx = t.x; ty = t.y; }
        if (f.legOut) {
          go = false;   // can't chase you on one leg
        } else if (f.t.thrower && see && d < 8) {
          if (d < 2.5) { tx = f.x - dx; ty = f.y - dy; }
          else go = d > 6;
          if (f.atk <= 0) throwLeg(f, d);
        } else if (f.t.ranged && see && d < 7) {
          if (d < 3) { tx = f.x - dx; ty = f.y - dy; }
          else if (d < 5.5) {
            if (Math.random() < dt * .4) f.sd = -f.sd;
            tx = f.x - dy / d * f.sd; ty = f.y + dx / d * f.sd;
          }
          if (f.atk <= 0) {
            f.atk = 1.8 + Math.random() * 1.2;
            shots.push({ kind: 'bubble', x: f.x + dx / d * .4, y: f.y + dy / d * .4, dx: dx / d * 5, dy: dy / d * 5, z: .5, life: 4 });
            SFX.spit();
          }
        } else if (see && d < (f.t.reach ? f.t.reach - .15 : .45 + f.t.size * .3)) {
          go = false;
        }
        if (!f.t.ranged && !f.t.thrower && d < (f.t.reach || .55 + f.t.size * .35) && f.atk <= 0) {
          f.atk = f.t.atkRate || .9; P.hp -= f.t.dmg; P.hurt = .6; SFX.hurt();
          say(['Ow! That fish nibbled you!', 'Hey, I am not food!', 'Ouch! Feed it a patty!'][(Math.random() * 3) | 0], 1.2);
        }
        if (go) {
          const tdx = tx - f.x, tdy = ty - f.y, tl = Math.hypot(tdx, tdy) || 1;
          moveEnt(f, tdx / tl * spd * dt, tdy / tl * spd * dt, f.r);
        }
      }
    }
    // separation
    for (const o of fish) {
      if (o === f) continue;
      const sx = f.x - o.x, sy = f.y - o.y, sd = Math.hypot(sx, sy), min = f.r + o.r + .1;
      if (sd > 0 && sd < min) moveEnt(f, sx / sd * (min - sd) * .5, sy / sd * (min - sd) * .5, f.r);
    }
    f.vx = (f.x - ox) / dt; f.vy = (f.y - oy) / dt;
  }

  // projectiles
  for (const s of shots) {
    if (s.kind === 'leg') { updateLeg(s, dt); continue; }
    s.life -= dt;
    const nx = s.x + s.dx * dt, ny = s.y + s.dy * dt;
    if (solid(nx, ny) || propBlocked(nx, ny, 0)) {
      s.life = 0;
      fx.push({ tex: s.kind === 'patty' ? TEX.splat : TEX.bubble, x: s.x, y: s.y, z: s.z, h: s.kind === 'patty' ? .25 : .3, vz: 0, life: .3 });
      if (s.kind === 'patty') SFX.splat();
      continue;
    }
    s.x = nx; s.y = ny;
    if (s.kind === 'patty') {
      for (const f of fish) {
        if (f.fed) continue;
        const hr = f.t.hitR || .2 + f.t.size * .4;
        if ((f.x - s.x) ** 2 + (f.y - s.y) ** 2 > hr * hr) continue;
        s.life = 0; f.alert = true; f.flash = .15; f.hunger--;
        moveEnt(f, s.dx * .02, s.dy * .02, f.r);
        SFX.chomp();
        if (f.hunger <= 0) {
          f.fed = true; fedCount++; P.grin = 1.5;
          for (let i = 0; i < 3; i++) fx.push({ tex: TEX.heart, x: f.x + (Math.random() - .5) * .4, y: f.y + (Math.random() - .5) * .4, z: .55, h: .18, vz: .5 + Math.random() * .3, life: 1.3 });
          SFX.fed();
          say(fedCount === fish.length ? 'Every fish is fed!' : FED_LINES[(Math.random() * FED_LINES.length) | 0]);
        } else {
          say(f.t.name + ' wants ' + f.hunger + ' more!', 1.2);
        }
        break;
      }
    } else if (Math.hypot(s.x - P.x, s.y - P.y) < .35) {
      s.life = 0; P.hp -= 9; P.hurt = .6; SFX.hurt(); say('Bubble blast! You are drying out!', 1.2);
      fx.push({ tex: TEX.bubble, x: s.x, y: s.y, z: s.z, h: .3, vz: 0, life: .15 });
    }
  }
  shots = shots.filter(s => s.life > 0);
  for (const e of fx) { e.life -= dt; e.z += e.vz * dt; }
  fx = fx.filter(e => e.life > 0);

  if (P.hp <= 0) { P.hp = 0; setScreen('dead'); SFX.die(); document.exitPointerLock && document.exitPointerLock(); }
  else if (fedCount === fish.length) { setScreen('win'); SFX.win(); document.exitPointerLock && document.exitPointerLock(); }
}
