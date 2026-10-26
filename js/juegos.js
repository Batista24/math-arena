/* Math Arena - juegos 1 a 3: Trivia, Carrera de operaciones y Bingo */
(function () {
  'use strict';
  const MA = window.MA, MB = window.MathBank;
  const esc = MA.esc, fmt = MA.fmt, shuffle = MA.shuffle, rnd = MA.rnd;
  const n = MB.u.n;

  /* ---------- piezas comunes ---------- */
  function chips(c) {
    const t = c.topics.length ? c.topics.length + ' tema' + (c.topics.length > 1 ? 's' : '') : 'todos los temas';
    return `<ul class="chips"><li>${MA.gradeName(c.grade)}</li><li>Dificultad: ${MA.levelLabel(c.level)}</li><li>Temas: ${t}</li></ul>
      <p class="fine">Puedes cambiar el grado, la dificultad y los temas en el menú.</p>`;
  }
  function intro(icon, title, lines, c, action, extra) {
    return `<section class="intro">
      <div class="intro-ico" aria-hidden="true">${icon}</div>
      <h1>${title}</h1>
      <ul class="how">${lines.map((l) => `<li>${l}</li>`).join('')}</ul>
      ${chips(c)}
      ${extra || ''}
      <button class="btn primary big" data-act="${action}">Empezar</button>
    </section>`;
  }
  function reviewList(items) {
    if (!items.length) return '';
    return `<h2>Para repasar</h2><ul class="review">${items.map((it) => `<li class="card">
      <div class="qtext">${fmt(it.q)}</div>
      ${it.yours !== undefined && it.yours !== '' ? `<p class="yours">Tu respuesta: <span>${fmt(it.yours)}</span></p>` : ''}
      <p class="right-ans">Respuesta correcta: <strong>${fmt(it.ans)}</strong></p>
      ${it.explain ? `<p class="why">${fmt(it.explain)}</p>` : ''}</li>`).join('')}</ul>`;
  }
  function numericQ(c, lvl, avoid) {
    const order = [lvl, 1, 2, 3].filter((x, i, a) => a.indexOf(x) === i);
    for (let k = 0; k < 4; k++) {
      for (const l of order) {
        try {
          const q = MB.makeQuestion(c.grade, l, { topics: c.topics, numericOnly: true });
          if (!avoid || !avoid.has(q.q)) return q;
        } catch (e) { /* probar otro nivel */ }
      }
    }
    return null;
  }

  /* ====================== 1) TRIVIA ====================== */
  const DUR = 25;
  let T = null;
  MA.views.trivia = function () {
    const c = MA.cfg();
    const cust = MA.customFor(c.grade).length;
    MA.layout(intro('🧠', 'Trivia matemática', [
      'Son 10 preguntas de opción múltiple.',
      'Tienes 25 segundos por pregunta: responder rápido da más puntos.',
      'Si aciertas varias seguidas, ganas puntos extra.'
    ], c, 'triviaStart', cust ? `<p class="notice">Tus ${cust} pregunta${cust > 1 ? 's' : ''} guardada${cust > 1 ? 's' : ''} para este grado se mezclan en la partida.</p>` : ''), { title: 'Trivia' });
  };
  MA.actions.triviaStart = function () {
    const c = MA.cfg();
    let qs;
    try { qs = MB.makeSet(c.grade, c.level, 10, { topics: c.topics }); } catch (e) { return MA.fail('No hay preguntas con esos temas. Elige otros temas en el menú.'); }
    const cust = shuffle(MA.customFor(c.grade)).slice(0, 4);
    const slots = shuffle(qs.map((_, i) => i));
    cust.forEach((cq, k) => {
      const opts = shuffle(cq.options.map((o, i) => ({ o: o, i: i })));
      qs[slots[k]] = { q: cq.q, options: opts.map((x) => x.o), correct: opts.findIndex((x) => x.i === cq.correct), ans: cq.options[cq.correct], num: null, explain: cq.explain || '', topicName: 'Mis preguntas' };
    });
    T = { qs: qs, i: 0, score: 0, correct: 0, streak: 0, best: 0, log: [], locked: false, c: c };
    triviaShow();
  };
  function triviaShow() {
    const q = T.qs[T.i];
    MA.layout(`<div class="qhead"><span class="qcount">Pregunta ${T.i + 1} de ${T.qs.length}</span><span class="qscore" id="tscore">${T.score} pts</span></div>
      <div class="timer" role="timer" aria-label="Tiempo restante"><div class="bar"><i id="tbar"></i></div><span id="tnum">${DUR}</span></div>
      <section class="qcard"><p class="topic">${esc(q.topicName)}</p><div class="qtext">${fmt(q.q)}</div></section>
      <div class="opts" id="opts">${q.options.map((o, i) => `<button class="opt" data-act="triviaPick" data-i="${i}"><span class="opt-l">${'ABCD'[i]}</span><span class="opt-t">${fmt(o)}</span></button>`).join('')}</div>
      <div id="fb" class="fb" aria-live="polite"></div>`, { title: 'Trivia' });
    T.locked = false;
    T.start = performance.now();
    T.timer = MA.every(() => {
      const left = DUR - (performance.now() - T.start) / 1000;
      const bar = document.getElementById('tbar'), num = document.getElementById('tnum');
      if (bar) { bar.style.width = Math.max(0, (left / DUR) * 100) + '%'; bar.classList.toggle('low', left < 8); }
      if (num) num.textContent = Math.max(0, Math.ceil(left));
      if (left <= 0) triviaResolve(-1);
    }, 100);
  }
  MA.actions.triviaPick = (el) => triviaResolve(Number(el.getAttribute('data-i')));
  function triviaResolve(idx) {
    if (!T || T.locked) return;
    T.locked = true;
    MA.stop(T.timer);
    const q = T.qs[T.i];
    const left = Math.max(0, DUR - (performance.now() - T.start) / 1000);
    const ok = idx === q.correct;
    let pts = 0;
    if (ok) {
      T.streak++; T.best = Math.max(T.best, T.streak);
      pts = 100 + Math.round((left / DUR) * 100) + Math.min(50, (T.streak - 1) * 10);
      T.score += pts; T.correct++;
    } else T.streak = 0;
    T.log.push({ q: q.q, ans: q.ans, explain: q.explain, yours: idx >= 0 ? q.options[idx] : '', ok: ok });
    document.querySelectorAll('#opts .opt').forEach((b, i) => {
      b.disabled = true;
      b.classList.add(i === q.correct ? 'right' : i === idx ? 'wrong' : 'dim');
    });
    const last = T.i + 1 >= T.qs.length;
    document.getElementById('tscore').textContent = T.score + ' pts';
    document.getElementById('fb').innerHTML = `<p class="fb-title ${ok ? 'ok' : 'bad'}">${ok ? '¡Correcto! +' + pts : idx < 0 ? 'Se acabó el tiempo.' : 'No es esa.'}</p>
      ${ok ? '' : `<p>La respuesta correcta es <strong>${fmt(q.ans)}</strong>.</p>`}
      ${q.explain ? `<p class="why">${fmt(q.explain)}</p>` : ''}
      <button class="btn primary big" id="nextBtn" data-act="triviaNext">${last ? 'Ver resultado' : 'Siguiente pregunta'}</button>`;
    const nb = document.getElementById('nextBtn');
    nb.scrollIntoView({ block: 'nearest', behavior: MA.reduceMotion() ? 'auto' : 'smooth' });
    nb.focus({ preventScroll: true });
  }
  MA.actions.triviaNext = function () {
    if (!T) return;
    T.i++;
    if (T.i >= T.qs.length) return triviaEnd();
    triviaShow();
  };
  function triviaEnd() {
    const total = T.qs.length, acc = T.correct / total;
    const st = acc >= 0.9 ? 3 : acc >= 0.7 ? 2 : acc >= 0.4 ? 1 : 0;
    const best = MA.record('trivia', T.score, `${T.correct} de ${total}, ${T.score} pts`);
    const wrong = T.log.filter((l) => !l.ok);
    MA.layout(`<section class="result">
      ${MA.stars(st)}
      <h1>${acc >= 0.9 ? '¡Excelente!' : acc >= 0.7 ? '¡Muy bien!' : acc >= 0.4 ? '¡Buen intento!' : 'Sigue practicando'}</h1>
      <p class="big-num">${T.score}<small> puntos</small></p>
      ${best ? '<p class="record">Nuevo récord personal</p>' : ''}
      <p>${T.correct} de ${total} correctas. Mejor racha: ${T.best}.</p>
      <div class="row"><button class="btn primary" data-act="triviaStart">Jugar otra vez</button><button class="btn" data-act="home">Volver al menú</button></div>
    </section>${reviewList(wrong)}`, { title: 'Trivia' });
  }

  /* ====================== 2) CARRERA DE OPERACIONES ====================== */
  const RACE = 60;
  let C = null;
  MA.views.carrera = function () {
    const c = MA.cfg();
    MA.layout(intro('⏱️', 'Carrera de operaciones', [
      `Tienes ${RACE} segundos para resolver todas las que puedas.`,
      'Escribe el resultado con el teclado de la pantalla (o el de tu computadora) y pulsa Enviar.',
      'Con dificultad progresiva, las operaciones se van poniendo más difíciles.'
    ], c, 'carreraStart'), { title: 'Carrera' });
  };
  function cLevel() {
    const lv = C.c.level;
    if (lv === 'prog') return C.correct < 5 ? 1 : C.correct < 12 ? 2 : 3;
    return Number(lv);
  }
  MA.actions.carreraStart = function () {
    const c = MA.cfg();
    C = { c: c, correct: 0, wrong: 0, streak: 0, best: 0, input: '', lock: false, over: false, seen: new Set(), wrongs: [], q: null };
    const first = numericQ(c, cLevel(), C.seen);
    if (!first) return MA.fail('Con los temas elegidos no hay operaciones con respuesta numérica. Elige más temas o prueba otro juego.');
    C.q = first;
    MA.layout(`<div class="rhead"><div class="rtime" id="ctime" role="timer" aria-label="Segundos restantes">${RACE}</div><div class="rscore"><b id="ccor">0</b> correctas</div></div>
      <div class="rbar"><i id="cbar"></i></div>
      <section class="qcard big"><p class="topic" id="ctopic"></p><div class="qtext" id="cq"></div></section>
      <div class="answer" id="cans"><span id="ctext" aria-live="polite"></span><i class="caret" aria-hidden="true"></i></div>
      <div class="cfeed" id="cfeed" aria-live="polite"></div>
      <div class="keypad" aria-label="Teclado numérico">
        ${['7', '8', '9', '4', '5', '6', '1', '2', '3', '−', '0', '.'].map((k) => `<button class="key" data-act="cKey" data-k="${k}">${k}</button>`).join('')}
        <button class="key wide" data-act="cBack" aria-label="Borrar">⌫</button>
        <button class="key wide ghost" data-act="cSkip">Pasar</button>
        <button class="key wide send" data-act="cSend">Enviar</button>
      </div>`, { title: 'Carrera', back: false });
    cShow();
    C.endAt = performance.now() + RACE * 1000;
    C.timer = MA.every(() => {
      const left = (C.endAt - performance.now()) / 1000;
      const t = document.getElementById('ctime'), b = document.getElementById('cbar');
      if (t) { t.textContent = Math.max(0, Math.ceil(left)); t.classList.toggle('low', left < 10); }
      if (b) b.style.width = Math.max(0, (left / RACE) * 100) + '%';
      if (left <= 0) carreraEnd();
    }, 100);
    MA.keyHandler = (ev) => {
      if (!C || C.over || ev.ctrlKey || ev.metaKey || ev.altKey) return;
      const k = ev.key;
      if (/^[0-9]$/.test(k)) cType(k);
      else if (k === '-' || k === '−') cType('−');
      else if (k === '.' || k === ',') cType('.');
      else if (k === 'Backspace') cBack();
      else if (k === 'Enter') { if (document.activeElement && document.activeElement.tagName === 'BUTTON') return; cSend(); }
      else return;
      ev.preventDefault();
    };
  };
  function cShow() {
    C.input = ''; C.lock = false;
    document.getElementById('cq').innerHTML = fmt(C.q.q);
    document.getElementById('ctopic').textContent = C.q.topicName;
    document.getElementById('ctext').textContent = '';
    document.getElementById('cfeed').innerHTML = '';
    const a = document.getElementById('cans'); a.className = 'answer';
  }
  function cType(k) {
    if (C.lock || C.over) return;
    if (C.input.length >= 10) return;
    if (k === '−' && C.input.length) return;
    if (k === '.' && (C.input.indexOf('.') >= 0 || C.input === '' || C.input === '−')) return;
    C.input += k;
    document.getElementById('ctext').textContent = C.input;
  }
  function cBack() {
    if (C.lock || C.over) return;
    C.input = C.input.slice(0, -1);
    document.getElementById('ctext').textContent = C.input;
  }
  function cSend() {
    if (!C || C.lock || C.over || !C.input) return;
    C.lock = true;
    const ok = MB.checkTyped(C.q, C.input.replace('−', '-'));
    const a = document.getElementById('cans'), f = document.getElementById('cfeed');
    if (ok) {
      C.correct++; C.streak++; C.best = Math.max(C.best, C.streak);
      document.getElementById('ccor').textContent = C.correct;
      a.className = 'answer ok';
      f.innerHTML = `<span class="ok">¡Bien!${C.streak >= 3 ? ' Racha de ' + C.streak : ''}</span>`;
      C.seen.add(C.q.q);
      MA.later(cNext, 380);
    } else {
      C.wrong++; C.streak = 0;
      C.wrongs.push({ q: C.q.q, ans: C.q.ans, explain: C.q.explain, yours: C.input });
      a.className = 'answer bad';
      f.innerHTML = `<span class="bad">Era <strong>${fmt(C.q.ans)}</strong></span>`;
      C.seen.add(C.q.q);
      MA.later(cNext, 1300);
    }
  }
  function cNext() {
    if (C.over) return;
    const q = numericQ(C.c, cLevel(), C.seen);
    if (!q) { C.seen.clear(); C.q = numericQ(C.c, cLevel()); } else C.q = q;
    cShow();
  }
  MA.actions.cKey = (el) => cType(el.getAttribute('data-k'));
  MA.actions.cBack = cBack;
  MA.actions.cSend = cSend;
  MA.actions.cSkip = function () {
    if (!C || C.lock || C.over) return;
    C.streak = 0;
    C.wrongs.push({ q: C.q.q, ans: C.q.ans, explain: C.q.explain, yours: '' });
    C.seen.add(C.q.q);
    cNext();
  };
  function carreraEnd() {
    if (!C || C.over) return;
    C.over = true;
    MA.stop(C.timer);
    MA.keyHandler = null;
    const pts = C.correct * 10;
    const st = C.correct >= 15 ? 3 : C.correct >= 10 ? 2 : C.correct >= 5 ? 1 : 0;
    const best = MA.record('carrera', pts, `${C.correct} correctas`);
    MA.layout(`<section class="result">
      ${MA.stars(st)}
      <h1>${C.correct >= 15 ? '¡Velocidad increíble!' : C.correct >= 10 ? '¡Muy rápido!' : C.correct >= 5 ? '¡Buen ritmo!' : 'Tiempo terminado'}</h1>
      <p class="big-num">${C.correct}<small> correctas</small></p>
      ${best ? '<p class="record">Nuevo récord personal</p>' : ''}
      <p>${C.wrong} por repasar. Mejor racha: ${C.best}.</p>
      <div class="row"><button class="btn primary" data-act="carreraStart">Jugar otra vez</button><button class="btn" data-act="home">Volver al menú</button></div>
    </section>${reviewList(C.wrongs.slice(0, 12))}`, { title: 'Carrera' });
  }

  /* ====================== 3) BINGO ====================== */
  let B = null;
  function bingoDeck(c) {
    const out = [], seenN = new Set(), seenQ = new Set();
    let guard = 0;
    while (out.length < 16 && guard++ < 1500) {
      const q = numericQ(c, MB.levelFor(c.level, out.length, 16));
      if (!q) break;
      const key = n(q.num);
      if (seenN.has(key) || seenQ.has(q.q)) continue;
      seenN.add(key); seenQ.add(q.q); out.push(q);
    }
    if (out.length >= 16) return { size: 4, qs: out.slice(0, 16) };
    if (out.length >= 9) return { size: 3, qs: out.slice(0, 9) };
    return null;
  }
  function lines(size) {
    const L = [];
    for (let r = 0; r < size; r++) L.push(Array.from({ length: size }, (_, c) => r * size + c));
    for (let c = 0; c < size; c++) L.push(Array.from({ length: size }, (_, r) => r * size + c));
    L.push(Array.from({ length: size }, (_, i) => i * size + i));
    L.push(Array.from({ length: size }, (_, i) => i * size + (size - 1 - i)));
    return L;
  }
  MA.views.bingo = function () {
    const c = MA.cfg();
    MA.layout(intro('🎯', 'Bingo matemático', [
      'Verás una operación arriba y un cartón con resultados.',
      'Resuelve la operación y toca su resultado en el cartón.',
      'Gana al completar una fila, una columna o una diagonal. Cada error resta puntos.'
    ], c, 'bingoStart'), { title: 'Bingo' });
  };
  MA.actions.bingoStart = function () {
    const c = MA.cfg();
    const deck = bingoDeck(c);
    if (!deck) return MA.fail('Con los temas elegidos no hay suficientes operaciones con respuesta numérica para armar un cartón. Elige más temas o prueba otro juego.');
    const cells = shuffle(deck.qs).map((q) => ({ q: q, txt: n(q.num), marked: false }));
    B = { size: deck.size, cells: cells, order: shuffle(cells.map((_, i) => i)), pos: 0, mistakes: 0, over: false, lines: lines(deck.size), tip: '' };
    bingoShow();
  };
  function bingoShow() {
    const cur = B.cells[B.order[B.pos]];
    MA.layout(`<div class="qhead"><span class="qcount">Operación ${B.pos + 1} de ${B.cells.length}</span><span class="qscore" id="bmis">Errores: ${B.mistakes}</span></div>
      <section class="qcard"><p class="topic">Resuelve y marca el resultado</p><div class="qtext" id="bcall">${fmt(cur.q.q)}</div></section>
      <div class="bgrid s${B.size}" id="bgrid" role="group" aria-label="Cartón de bingo">
        ${B.cells.map((cell, i) => `<button class="bcell ${cell.marked ? 'marked' : ''}" data-act="bingoTap" data-i="${i}" ${cell.marked ? 'disabled' : ''}>${cell.marked ? MA.clover(30, 'stamp') : ''}<span>${esc(cell.txt)}</span></button>`).join('')}
      </div>
      <div class="bfb" id="bfb" aria-live="polite">${B.tip}</div>
      <div class="row"><button class="btn" data-act="bingoSkip">Pasar esta operación (cuenta como error)</button></div>`, { title: 'Bingo' });
  }
  function bingoCheck() {
    return B.lines.find((l) => l.every((i) => B.cells[i].marked)) || null;
  }
  MA.actions.bingoTap = function (el) {
    if (!B || B.over) return;
    const i = Number(el.getAttribute('data-i'));
    const target = B.order[B.pos];
    if (i !== target) {
      B.mistakes++;
      el.classList.remove('shake'); void el.offsetWidth; el.classList.add('shake');
      document.getElementById('bmis').textContent = 'Errores: ' + B.mistakes;
      document.getElementById('bfb').innerHTML = '<span class="bad">Ese no es el resultado. Revisa la operación e inténtalo otra vez.</span>';
      return;
    }
    bingoAdvance(target, false);
  };
  MA.actions.bingoSkip = function () {
    if (!B || B.over) return;
    B.mistakes++;
    bingoAdvance(B.order[B.pos], true);
  };
  function bingoAdvance(target, skipped) {
    const cell = B.cells[target];
    cell.marked = true;
    B.pos++;
    const line = bingoCheck();
    if (line || B.pos >= B.order.length) return bingoEnd(line);
    B.tip = `<span class="${skipped ? 'bad' : 'ok'}">${skipped ? 'Era' : 'Correcto:'} ${fmt(cell.q.q)} = <strong>${esc(cell.txt)}</strong></span>`;
    bingoShow();
  }
  function bingoEnd(line) {
    B.over = true;
    const calls = B.pos;
    const score = Math.max(10, 200 - B.mistakes * 20 - calls * 5);
    const st = B.mistakes <= 1 ? 3 : B.mistakes <= 3 ? 2 : 1;
    const best = MA.record('bingo', score, `${B.mistakes} error${B.mistakes === 1 ? '' : 'es'}, ${calls} operaciones`);
    const grid = B.cells.map((cell, i) => `<div class="bcell mini ${line && line.indexOf(i) >= 0 ? 'win' : cell.marked ? 'marked' : ''}"><span>${esc(cell.txt)}</span></div>`).join('');
    MA.layout(`<section class="result">
      ${MA.stars(st)}
      <h1>¡BINGO!</h1>
      <div class="bgrid s${B.size} static" aria-label="Cartón final">${grid}</div>
      <p class="big-num">${score}<small> puntos</small></p>
      ${best ? '<p class="record">Nuevo récord personal</p>' : ''}
      <p>Lo lograste con ${calls} operaciones y ${B.mistakes} error${B.mistakes === 1 ? '' : 'es'}.</p>
      <div class="row"><button class="btn primary" data-act="bingoStart">Jugar otra vez</button><button class="btn" data-act="home">Volver al menú</button></div>
    </section>`, { title: 'Bingo' });
  }
})();
