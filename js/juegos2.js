/* Math Arena - juegos 4 a 6: Escape room, Ruleta para el aula e Impostor matemático */
(function () {
  'use strict';
  const MA = window.MA, MB = window.MathBank;
  const esc = MA.esc, fmt = MA.fmt, shuffle = MA.shuffle, rnd = MA.rnd;

  function chips(c) {
    const t = c.topics.length ? c.topics.length + ' tema' + (c.topics.length > 1 ? 's' : '') : 'todos los temas';
    return `<ul class="chips"><li>${MA.gradeName(c.grade)}</li><li>Dificultad: ${MA.levelLabel(c.level)}</li><li>Temas: ${t}</li></ul>
      <p class="fine">Puedes cambiar el grado, la dificultad y los temas en el menú.</p>`;
  }
  const mmss = (s) => { s = Math.max(0, Math.ceil(s)); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); };

  /* ====================== 4) ESCAPE ROOM ====================== */
  const ROOMS = ['La biblioteca', 'El laboratorio', 'El observatorio', 'La sala de mapas', 'El taller', 'La bóveda'];
  const CODE = 'TREBOL';
  const E_TIME = 420, E_WRONG = 20, E_HINT = 30;
  let E = null;
  MA.views.escape = function () {
    const c = MA.cfg();
    MA.layout(`<section class="intro">
      <div class="intro-ico" aria-hidden="true">🔐</div>
      <h1>Escape room matemático</h1>
      <p class="story">Quedaste encerrado en el Museo de los Números. La salida está cerrada con 6 puertas, y cada una se abre con un acertijo. Cada puerta que abras revela una letra del código secreto.</p>
      <ul class="how">
        <li>Tienes ${E_TIME / 60} minutos para abrir las 6 puertas.</li>
        <li>Una respuesta incorrecta resta ${E_WRONG} segundos.</li>
        <li>La pista quita dos opciones incorrectas y resta ${E_HINT} segundos (una por puerta).</li>
      </ul>
      ${chips(c)}
      <button class="btn primary big" data-act="escStart">Entrar al museo</button></section>`, { title: 'Escape room' });
  };
  MA.actions.escStart = function () {
    const c = MA.cfg();
    let qs;
    try { qs = MB.makeSet(c.grade, c.level, 6, { topics: c.topics }); } catch (e) { return MA.fail('No hay preguntas con esos temas. Elige otros temas en el menú.'); }
    E = { qs: qs, i: 0, hints: 0, wrongs: 0, over: false, endAt: performance.now() + E_TIME * 1000, hintUsed: false, c: c, solved: false };
    escShow();
    E.timer = MA.every(() => {
      const left = (E.endAt - performance.now()) / 1000;
      const t = document.getElementById('etime');
      if (t) { t.textContent = mmss(left); t.classList.toggle('low', left < 60); }
      if (left <= 0) escEnd(false);
    }, 250);
  };
  function codeStrip() {
    return CODE.split('').map((ch, j) => `<span class="${j < E.i ? 'got' : j === E.i ? 'next' : ''}">${j < E.i ? ch : '?'}</span>`).join('');
  }
  function escShow() {
    const q = E.qs[E.i];
    E.hintUsed = false; E.solved = false;
    MA.layout(`<div class="ehead"><div class="etime" id="etime" role="timer" aria-label="Tiempo restante">${mmss((E.endAt - performance.now()) / 1000)}</div>
        <div class="ecode" aria-label="Código secreto: ${E.i} de 6 letras descubiertas">${codeStrip()}</div></div>
      <section class="room"><p class="topic">Puerta ${E.i + 1} de 6: ${ROOMS[E.i]}</p>
        <div class="qtext">${fmt(q.q)}</div></section>
      <div class="opts" id="opts">${q.options.map((o, i) => `<button class="opt" data-act="escPick" data-i="${i}"><span class="opt-l">${'ABCD'[i]}</span><span class="opt-t">${fmt(o)}</span></button>`).join('')}</div>
      <div class="row"><button class="btn" id="hintBtn" data-act="escHint">Pista: quitar dos opciones (−${E_HINT} s)</button></div>
      <div class="fb" id="efb" aria-live="polite"></div>`, { title: 'Escape room', back: false });
  }
  MA.actions.escHint = function () {
    if (!E || E.over || E.solved || E.hintUsed) return;
    E.hintUsed = true; E.hints++;
    E.endAt -= E_HINT * 1000;
    const q = E.qs[E.i];
    const wrong = [0, 1, 2, 3].filter((i) => i !== q.correct && !document.querySelectorAll('#opts .opt')[i].disabled);
    shuffle(wrong).slice(0, 2).forEach((i) => { const b = document.querySelectorAll('#opts .opt')[i]; b.disabled = true; b.classList.add('dim'); });
    const hb = document.getElementById('hintBtn'); hb.disabled = true;
    document.getElementById('efb').innerHTML = `<p class="bad">Quitaste dos opciones. −${E_HINT} s</p>`;
  };
  MA.actions.escPick = function (el) {
    if (!E || E.over || E.solved) return;
    const i = Number(el.getAttribute('data-i'));
    const q = E.qs[E.i];
    const btns = document.querySelectorAll('#opts .opt');
    if (i !== q.correct) {
      E.wrongs++;
      E.endAt -= E_WRONG * 1000;
      el.disabled = true; el.classList.add('wrong');
      document.getElementById('efb').innerHTML = `<p class="bad">Esa respuesta no abre la puerta. −${E_WRONG} s</p>`;
      return;
    }
    E.solved = true;
    btns.forEach((b, k) => { b.disabled = true; b.classList.add(k === q.correct ? 'right' : 'dim'); });
    document.getElementById('hintBtn').disabled = true;
    const last = E.i === 5;
    E.i++;
    document.querySelector('.ecode').innerHTML = codeStrip();
    document.getElementById('efb').innerHTML = `<p class="fb-title ok">¡La puerta se abre! Descubriste la letra <strong class="letter">${CODE[E.i - 1]}</strong></p>
      ${q.explain ? `<p class="why">${fmt(q.explain)}</p>` : ''}
      <button class="btn primary big" id="nextBtn" data-act="escNext">${last ? 'Salir del museo' : 'Pasar a la siguiente puerta'}</button>`;
    const nb = document.getElementById('nextBtn');
    nb.scrollIntoView({ block: 'nearest', behavior: MA.reduceMotion() ? 'auto' : 'smooth' });
    nb.focus({ preventScroll: true });
  };
  MA.actions.escNext = function () {
    if (!E || E.over) return;
    if (E.i >= 6) return escEnd(true);
    escShow();
  };
  function escEnd(win) {
    if (!E || E.over) return;
    E.over = true;
    MA.stop(E.timer);
    const left = Math.max(0, (E.endAt - performance.now()) / 1000);
    const score = win ? 600 + Math.round(left) : E.i * 50;
    const st = win ? (left > 180 ? 3 : left > 60 ? 2 : 1) : 0;
    const best = MA.record('escape', score, win ? `escapó con ${mmss(left)} de sobra` : `abrió ${E.i} de 6 puertas`);
    MA.layout(`<section class="result">
      ${MA.stars(st)}
      <h1>${win ? '¡Lograron escapar!' : 'Se acabó el tiempo'}</h1>
      <div class="ecode big" aria-label="Código secreto">${CODE.split('').map((ch, j) => `<span class="${j < E.i ? 'got' : ''}">${j < E.i ? ch : '?'}</span>`).join('')}</div>
      <p>${win ? `El código secreto era <strong>TRÉBOL</strong>. Te sobraron ${mmss(left)}.` : `Abriste ${E.i} de 6 puertas. Inténtalo otra vez, ¡ya conoces el camino!`}</p>
      <p class="big-num">${score}<small> puntos</small></p>
      ${best ? '<p class="record">Nuevo récord personal</p>' : ''}
      <p class="fine">Respuestas incorrectas: ${E.wrongs}. Pistas usadas: ${E.hints}.</p>
      <div class="row"><button class="btn primary" data-act="escStart">Jugar otra vez</button><button class="btn" data-act="home">Volver al menú</button></div>
    </section>`, { title: 'Escape room' });
  }

  /* ====================== 5) RULETA ====================== */
  const PAL = [['#1b8a5a', '#ffffff'], ['#ffd23f', '#0d3b2e'], ['#2756c5', '#ffffff'], ['#6fdc9f', '#0d3b2e'], ['#e4572e', '#ffffff'], ['#0f6b45', '#ffffff'], ['#f3a712', '#0d3b2e'], ['#8fb8ff', '#0d3b2e']];
  let R = { mode: 'names', rot: 0, spinning: false, used: [], result: null, noRep: true, q: null, showAns: false };
  const TAU = Math.PI * 2;
  function rItems() {
    const p = MA.me();
    if (R.mode === 'names') {
      const all = Array.from(new Set(p.custom.names.split('\n').map((s) => s.trim()).filter(Boolean)));
      return (R.noRep ? all.filter((x) => R.used.indexOf(x) < 0) : all).map((x) => ({ label: x }));
    }
    if (R.mode === 'topics') {
      const c = MA.cfg();
      const all = MB.topics(p.grade);
      return (c.topics.length ? all.filter((t) => c.topics.indexOf(t.id) >= 0) : all).map((t) => ({ label: t.name, id: t.id }));
    }
    const N = Math.max(2, Math.min(60, Number(p.custom.rouletteN) || 30));
    const out = [];
    for (let i = 1; i <= N; i++) if (!R.noRep || R.used.indexOf(String(i)) < 0) out.push({ label: String(i) });
    return out;
  }
  MA.views.ruleta = function () {
    const p = MA.me();
    R.result = null; R.q = null; R.showAns = false; R.spinning = false;
    const tabs = [['names', 'Nombres'], ['topics', 'Temas'], ['numbers', 'Números']].map((t) => `<button role="tab" class="seg ${R.mode === t[0] ? 'on' : ''}" aria-selected="${R.mode === t[0]}" data-act="rMode" data-v="${t[0]}">${t[1]}</button>`).join('');
    let cfg = '';
    if (R.mode === 'names') {
      cfg = `<label class="field"><span>Escribe un nombre por línea (por ejemplo, la lista de tu curso)</span>
        <textarea rows="6" data-change="rNames" placeholder="Ana&#10;Luis&#10;María">${esc(p.custom.names)}</textarea></label>`;
    } else if (R.mode === 'numbers') {
      cfg = `<label class="field"><span>Números del 1 al</span><input type="number" min="2" max="60" value="${Number(p.custom.rouletteN) || 30}" data-change="rN"></label>`;
    } else {
      cfg = '<p class="fine">Sale un tema de ' + MA.gradeName(p.grade) + ' y una pregunta de ese tema. Puedes limitar los temas en el menú.</p>';
    }
    const rep = R.mode === 'topics' ? '' : `<label class="check"><input type="checkbox" data-change="rNoRep" ${R.noRep ? 'checked' : ''}> No repetir: quitar de la ruleta al que sale</label>`;
    MA.layout(`<h1>Ruleta para el aula</h1>
      <div class="tabs" role="tablist" aria-label="Qué girar">${tabs}</div>
      <div id="wheelArea"></div>
      <div id="rres" class="rres" aria-live="polite"></div>
      <section class="card form">${cfg}${rep}<div id="usedBox"></div></section>`, { title: 'Ruleta' });
    rRefresh();
  };
  function rRefresh() {
    const area = document.getElementById('wheelArea');
    if (!area) return;
    const items = rItems();
    const cv0 = document.getElementById('wheel');
    if (items.length >= 2 && cv0 && document.getElementById('spinBtn')) {
      // no reemplazar el botón: así el primer toque en "Girar" no se pierde al salir del cuadro de texto
      cv0.setAttribute('aria-label', 'Ruleta con ' + items.length + ' opciones');
      drawWheel(items);
      const ub0 = document.getElementById('usedBox');
      if (ub0) ub0.innerHTML = R.used.length && R.mode !== 'topics' ? `<p class="fine">Ya salieron: ${R.used.map(esc).join(', ')}</p><button class="btn small" data-act="rReset">Volver a incluir a todos</button>` : '';
      return;
    }
    if (items.length < 2) {
      area.innerHTML = `<div class="card center"><p class="empty">${R.mode === 'names' ? (R.used.length ? 'Ya salieron todos. Pulsa "Volver a incluir a todos".' : 'Escribe al menos 2 nombres abajo para armar la ruleta.') : 'Ya salieron todos los números. Pulsa "Volver a incluir a todos".'}</p></div>`;
    } else {
      area.innerHTML = `<div class="wheel-wrap"><canvas id="wheel" aria-label="Ruleta con ${items.length} opciones"></canvas><div class="pointer" aria-hidden="true"></div></div>
        <div class="row"><button class="btn primary big" id="spinBtn" data-act="rSpin">Girar</button></div>`;
      drawWheel(items);
    }
    const ub = document.getElementById('usedBox');
    if (ub) ub.innerHTML = R.used.length && R.mode !== 'topics' ? `<p class="fine">Ya salieron: ${R.used.map(esc).join(', ')}</p><button class="btn small" data-act="rReset">Volver a incluir a todos</button>` : '';
  }
  function drawWheel(items) {
    const cv = document.getElementById('wheel');
    if (!cv) return;
    const size = Math.min(460, Math.max(240, Math.min(window.innerWidth - 40, window.innerHeight * 0.6)));
    const dpr = window.devicePixelRatio || 1;
    cv.style.width = size + 'px'; cv.style.height = size + 'px';
    cv.width = Math.round(size * dpr); cv.height = Math.round(size * dpr);
    const ctx = cv.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, size, size);
    const r = size / 2 - 6, cx = size / 2, cy = size / 2, N = items.length, seg = TAU / N;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(R.rot);
    const fs = Math.round((N <= 8 ? 20 : N <= 14 ? 16 : N <= 24 ? 13 : 10.5) * (size / 460) * 1.15);
    for (let i = 0; i < N; i++) {
      let k = i % PAL.length;
      if (i === N - 1 && N > 1 && k === 0) k = 1;
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, r, i * seg, (i + 1) * seg); ctx.closePath();
      ctx.fillStyle = PAL[k][0]; ctx.fill();
      ctx.lineWidth = 2; ctx.strokeStyle = '#0d3b2e'; ctx.stroke();
      ctx.save();
      ctx.rotate(i * seg + seg / 2);
      ctx.fillStyle = PAL[k][1];
      ctx.font = `700 ${fs}px system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`;
      ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
      let t = items[i].label;
      const maxW = r * 0.74;
      while (t.length > 1 && ctx.measureText(t).width > maxW) t = t.slice(0, -2) + '…';
      ctx.fillText(t, r - 14, 0);
      ctx.restore();
    }
    ctx.restore();
    ctx.beginPath(); ctx.arc(cx, cy, 18, 0, TAU); ctx.fillStyle = '#ffd23f'; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = '#0d3b2e'; ctx.stroke();
  }
  const mod = (a, m) => ((a % m) + m) % m;
  MA.actions.rMode = (el) => { R.mode = el.getAttribute('data-v'); R.used = []; MA.views.ruleta(); const t = document.querySelector('.tabs .seg.on'); if (t) t.focus(); };
  MA.actions.rNames = (el) => { MA.me().custom.names = el.value; MA.save(); R.used = []; rRefresh(); };
  MA.actions.rN = (el) => { const v = Math.max(2, Math.min(60, Number(el.value) || 30)); MA.me().custom.rouletteN = v; el.value = v; MA.save(); R.used = []; rRefresh(); };
  MA.actions.rNoRep = (el) => { R.noRep = el.checked; if (!R.noRep) R.used = []; rRefresh(); };
  MA.actions.rReset = () => { R.used = []; rRefresh(); };
  MA.actions.rSpin = function () {
    if (R.spinning) return;
    // el que salió antes se quita ahora (así la ruleta no "salta" al mostrar el resultado)
    if (R.result && R.noRep && R.mode !== 'topics' && R.used.indexOf(R.result.label) < 0) R.used.push(R.result.label);
    let items = rItems();
    if (items.length < 2) { rRefresh(); return; }
    R.result = null; R.q = null; R.showAns = false;
    document.getElementById('rres').innerHTML = '';
    const ub = document.getElementById('usedBox');
    if (ub) ub.innerHTML = R.used.length && R.mode !== 'topics' ? `<p class="fine">Ya salieron: ${R.used.map(esc).join(', ')}</p><button class="btn small" data-act="rReset">Volver a incluir a todos</button>` : '';
    items = rItems();
    drawWheel(items);
    const N = items.length, seg = TAU / N, t = rnd(0, N - 1), u = 0.15 + Math.random() * 0.7;
    const want = mod(-Math.PI / 2 - (t + u) * seg, TAU);
    const delta = mod(want - mod(R.rot, TAU), TAU);
    const spins = rnd(5, 7);
    const total = delta + spins * TAU, start = R.rot;
    const dur = MA.reduceMotion() ? 500 : 4300;
    const t0 = performance.now();
    R.spinning = true;
    const btn = document.getElementById('spinBtn'); if (btn) btn.disabled = true;
    const step = (now) => {
      const k = Math.min(1, (now - t0) / dur);
      const e = 1 - Math.pow(1 - k, 3);
      R.rot = start + total * e;
      drawWheel(items);
      if (k < 1) MA.raf(step);
      else {
        R.spinning = false;
        R.rot = start + total;
        const idx = Math.floor(mod(-Math.PI / 2 - R.rot, TAU) / seg) % N;
        rShowResult(items[idx]);
        const b2 = document.getElementById('spinBtn'); if (b2) { b2.disabled = false; b2.textContent = 'Girar otra vez'; }
      }
    };
    MA.raf(step);
  };
  function rQuestion(topicId) {
    const c = MA.cfg();
    const lvl = c.level === 'prog' ? rnd(1, 3) : Number(c.level);
    try { return MB.makeQuestion(c.grade, lvl, { topics: topicId ? [topicId] : c.topics }); } catch (e) { return null; }
  }
  function rShowResult(item) {
    R.result = item;
    if (R.mode === 'topics') R.q = rQuestion(item.id);
    renderResult();
    const box = document.getElementById('rres');
    if (box) box.scrollIntoView({ block: 'nearest', behavior: MA.reduceMotion() ? 'auto' : 'smooth' });
  }
  function renderResult() {
    const box = document.getElementById('rres');
    if (!box || !R.result) return;
    const label = R.mode === 'numbers' ? 'Salió el número' : R.mode === 'topics' ? 'Salió el tema' : 'Le toca a';
    let html = `<div class="card pick-res"><p class="lead">${label}</p><p class="winner">${esc(R.result.label)}</p>`;
    if (R.mode !== 'topics' && !R.q) html += '<button class="btn" data-act="rAsk">Hacer una pregunta</button>';
    if (R.q) {
      html += `<div class="rq"><div class="qtext">${fmt(R.q.q)}</div>
        ${R.showAns ? `<div class="rans"><p>Respuesta: <strong>${fmt(R.q.ans)}</strong></p>${R.q.explain ? `<p class="why">${fmt(R.q.explain)}</p>` : ''}</div>` : '<button class="btn" data-act="rShowAns">Mostrar la respuesta</button>'}
        <button class="btn link" data-act="rAsk">Otra pregunta</button></div>`;
    }
    html += '</div>';
    box.innerHTML = html;
  }
  MA.actions.rAsk = () => { R.q = rQuestion(R.mode === 'topics' && R.result ? R.result.id : null); R.showAns = false; renderResult(); };
  MA.actions.rShowAns = () => { R.showAns = true; renderResult(); };
  let rzTimer = 0;
  window.addEventListener('resize', () => {
    if (MA.view !== 'ruleta' || R.spinning) return;
    clearTimeout(rzTimer);
    rzTimer = setTimeout(() => { const it = rItems(); if (it.length >= 2) drawWheel(it); }, 150);
  });
  MA.recordRuleta = () => MA.record('ruleta', 0, 'usó la ruleta');

  /* ====================== 6) IMPOSTOR ====================== */
  let I = { n: 5, names: [], imp: 1, showCat: true, mins: 3, last: '' };
  let IG = null; // partida en curso
  function readNames() {
    const els = document.querySelectorAll('.impnames input');
    if (els.length) I.names = Array.from(els).map((e) => e.value);
  }
  function defNames() {
    const p = MA.me();
    const saved = (p.custom.impNames || []);
    I.names = Array.from({ length: I.n }, (_, i) => (saved[i] !== undefined && saved[i] !== '' ? saved[i] : (I.names[i] || '')));
  }
  MA.views.impostor = function () {
    const c = MA.cfg();
    if (!I.names.length) defNames();
    I.names = Array.from({ length: I.n }, (_, i) => I.names[i] || '');
    const fields = I.names.map((nm, i) => `<label class="field inline"><span>Jugador ${i + 1}</span><input type="text" maxlength="20" value="${esc(nm)}" placeholder="Jugador ${i + 1}"></label>`).join('');
    MA.layout(`<section class="intro">
      <div class="intro-ico" aria-hidden="true">🕵️</div>
      <h1>Impostor matemático</h1>
      <ul class="how">
        <li>Es un juego en grupo con un solo celular, que se va pasando.</li>
        <li>Todos reciben la misma palabra de matemática, menos el impostor, que solo ve la categoría.</li>
        <li>Cada persona dice una pista corta sin nombrar la palabra. Al final votan quién es el impostor.</li>
      </ul>
      ${chips(c)}</section>
      <form class="card form" data-submit="impStart" autocomplete="off">
        <div class="stepper"><span id="impLbl">Jugadores</span>
          <button type="button" class="btn small" data-act="impMinus" aria-label="Menos jugadores">−</button>
          <output class="stepnum" aria-labelledby="impLbl">${I.n}</output>
          <button type="button" class="btn small" data-act="impPlus" aria-label="Más jugadores">+</button></div>
        <div class="impnames">${fields}</div>
        <fieldset class="field"><legend>Impostores</legend>
          <label class="radio"><input type="radio" name="imp" value="1" ${I.imp === 1 || I.n < 6 ? 'checked' : ''}> 1</label>
          <label class="radio"><input type="radio" name="imp" value="2" ${I.imp === 2 && I.n >= 6 ? 'checked' : ''} ${I.n < 6 ? 'disabled' : ''}> 2 ${I.n < 6 ? '(desde 6 jugadores)' : ''}</label>
        </fieldset>
        <label class="check"><input type="checkbox" name="cat" ${I.showCat ? 'checked' : ''}> Mostrar la categoría a todos (también al impostor)</label>
        <label class="field"><span>Tiempo para dar pistas</span>
          <select name="mins">${[2, 3, 5].map((m) => `<option value="${m}" ${I.mins === m ? 'selected' : ''}>${m} minutos</option>`).join('')}</select></label>
        <button class="btn primary big" type="submit">Empezar</button>
      </form>`, { title: 'Impostor' });
  };
  MA.actions.impMinus = () => { readNames(); if (I.n > 3) { I.n--; } MA.views.impostor(); };
  MA.actions.impPlus = () => { readNames(); if (I.n < 12) { I.n++; } MA.views.impostor(); };
  MA.actions.impStart = function (f) {
    readNames();
    const names = I.names.map((s, i) => s.trim().replace(/\s+/g, ' ') || 'Jugador ' + (i + 1));
    const seen = new Set();
    names.forEach((s, i) => { let k = s, c = 2; while (seen.has(k.toLowerCase())) k = s + ' ' + c++; seen.add(k.toLowerCase()); names[i] = k; });
    I.imp = I.n >= 6 ? Number(f.elements.imp.value) : 1;
    I.showCat = f.elements.cat.checked;
    I.mins = Number(f.elements.mins.value);
    const p = MA.me();
    p.custom.impNames = I.names.map((s) => s.trim());
    MA.save();
    const g = MA.me().grade;
    let pool = MB.IMPOSTOR[g] || [];
    const c = MA.cfg();
    if (c.topics.length) { /* los temas del menú no aplican a las palabras; se usan todas las del grado */ }
    pool = pool.filter((w) => w[0] !== I.last);
    const w = pool[rnd(0, pool.length - 1)];
    I.last = w[0];
    const roles = Array.from({ length: names.length }, (_, i) => i < I.imp);
    IG = { names: names, roles: shuffle(roles), word: w[0], cat: w[1], cur: 0, phase: 'pass', starter: rnd(0, names.length - 1), vote: -1 };
    impPass();
  };
  function impPass() {
    MA.layout(`<section class="pass">
      <p class="lead">Jugador ${IG.cur + 1} de ${IG.names.length}. Pasa el celular a</p>
      <p class="who">${esc(IG.names[IG.cur])}</p>
      <p class="fine">Que nadie más mire la pantalla.</p>
      <button class="btn primary big" data-act="impShow">Ver mi papel</button></section>`, { title: 'Impostor', back: false });
  }
  MA.actions.impShow = function () {
    const isImp = IG.roles[IG.cur];
    const last = IG.cur + 1 >= IG.names.length;
    MA.layout(`<section class="pass secret ${isImp ? 'imp' : ''}">
      <p class="who small">${esc(IG.names[IG.cur])}</p>
      ${isImp
        ? `<p class="role">Eres el impostor</p><p>No conoces la palabra. Escucha las pistas de los demás y disimula.</p>${I.showCat ? `<p class="catline">Categoría: <strong>${esc(IG.cat)}</strong></p>` : ''}`
        : `<p class="lead">La palabra secreta es</p><p class="word">${esc(IG.word)}</p>${I.showCat ? `<p class="catline">Categoría: <strong>${esc(IG.cat)}</strong></p>` : ''}`}
      <button class="btn primary big" data-act="impHide">${last ? 'Ocultar y empezar a jugar' : 'Ocultar y pasar el celular'}</button></section>`, { title: 'Impostor', back: false });
  };
  MA.actions.impHide = function () {
    IG.cur++;
    if (IG.cur >= IG.names.length) return impTalk();
    impPass();
  };
  function impTalk() {
    IG.phase = 'talk';
    IG.endAt = performance.now() + I.mins * 60 * 1000;
    MA.layout(`<section class="pass">
      <h1>¡A dar pistas!</h1>
      <p>Empieza <strong>${esc(IG.names[IG.starter])}</strong> y siguen en orden. Cada persona dice una pista corta sin nombrar la palabra.</p>
      <div class="etime big" id="itime" role="timer" aria-label="Tiempo restante">${mmss(I.mins * 60)}</div>
      <button class="btn primary big" data-act="impVote">Pasar a votar</button></section>`, { title: 'Impostor', back: false });
    IG.timer = MA.every(() => {
      const left = (IG.endAt - performance.now()) / 1000;
      const t = document.getElementById('itime');
      if (t) { t.textContent = mmss(left); t.classList.toggle('low', left < 30); }
      if (left <= 0) { MA.stop(IG.timer); impVote(); }
    }, 500);
  }
  function impVote() {
    if (IG.timer) MA.stop(IG.timer);
    IG.phase = 'vote';
    MA.layout(`<form class="card form" data-submit="impReveal">
      <h2>¿Quién es el impostor?</h2>
      <p class="fine">Pónganse de acuerdo y elijan a una persona.</p>
      <div class="votes">${IG.names.map((nm, i) => `<label class="radio vote"><input type="radio" name="v" value="${i}" ${i === 0 ? 'checked' : ''}> ${esc(nm)}</label>`).join('')}</div>
      <button class="btn primary big" type="submit">Revelar</button></form>`, { title: 'Impostor', back: false });
  }
  MA.actions.impVote = impVote;
  MA.actions.impReveal = function (f) {
    const v = Number(f.elements.v.value);
    const imps = IG.names.filter((_, i) => IG.roles[i]);
    const caught = IG.roles[v];
    MA.record('impostor', 0, caught ? 'atraparon al impostor' : 'el impostor se salvó');
    MA.layout(`<section class="result">
      <h1>${caught ? '¡Atraparon al impostor!' : 'El impostor se salvó'}</h1>
      <p>${imps.length > 1 ? 'Los impostores eran' : 'El impostor era'} <strong>${imps.map(esc).join(' y ')}</strong>.</p>
      <p>La palabra secreta era <strong class="word-inline">${esc(IG.word)}</strong> <span class="fine">(${esc(IG.cat)})</span>.</p>
      ${caught ? '' : `<p class="fine">Votaron por ${esc(IG.names[v])}.</p>`}
      <div class="row"><button class="btn primary" data-act="impAgain">Jugar otra vez</button><button class="btn" data-act="home">Volver al menú</button></div>
    </section>`, { title: 'Impostor', back: false });
  };
  MA.actions.impAgain = () => { MA.go('impostor'); MA.views.impostor(); };

  // la ruleta cuenta como partida cuando se gira por primera vez en la visita
  const spin0 = MA.actions.rSpin;
  let spunThisVisit = false;
  MA.actions.rSpin = function () {
    if (!spunThisVisit && !R.spinning) { spunThisVisit = true; MA.recordRuleta(); }
    spin0();
  };
  window.addEventListener('hashchange', () => { spunThisVisit = false; });
})();
