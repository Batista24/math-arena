/* Math Arena - núcleo de la aplicación: datos del usuario, navegación y pantallas generales */
(function () {
  'use strict';
  const MB = window.MathBank;
  const MA = (window.MA = { views: {}, actions: {}, G: {} });

  MA.APP_NAME = 'Math Arena';
  MA.DEDICATORIA = 'Con amor, para la maestra que hace aprender jugando';
  MA.LEVELS = [['prog', 'Progresivo'], [1, 'Fácil'], [2, 'Medio'], [3, 'Difícil']];
  MA.fmt = MB.fmt;
  const esc = (MA.esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])));
  const { shuffle, rnd } = MB.u;
  MA.shuffle = shuffle;
  MA.rnd = rnd;
  MA.reduceMotion = () => window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- trébol (mismo dibujo del ícono) ---------- */
  const HEART = 'M0 0 C-14 -10 -30 -24 -18 -40 C-10 -50 0 -44 0 -34 C0 -44 10 -50 18 -40 C30 -24 14 -10 0 0 Z';
  MA.clover = (size, cls) =>
    `<svg class="${cls || 'clover'}" width="${size}" height="${size}" viewBox="-60 -60 120 130" aria-hidden="true" focusable="false">
      <path d="M0 0 C-3 30 3 48 16 64" fill="none" stroke="#d6336c" stroke-width="6" stroke-linecap="round"/>
      <g stroke="#4a1233" stroke-width="2.4" stroke-linejoin="round" fill="#ffb3d1">
        <path d="${HEART}" transform="rotate(45)"/><path d="${HEART}" transform="rotate(135)"/>
        <path d="${HEART}" transform="rotate(225)"/><path d="${HEART}" transform="rotate(315)"/>
      </g>
      <circle r="6" fill="#ffd23f" stroke="#4a1233" stroke-width="2.4"/>
    </svg>`;

  /* ---------- almacenamiento (en este dispositivo) ---------- */
  const KEY = 'matharena.v1';
  let storageOK = true;
  function load() {
    try {
      const t = localStorage.getItem(KEY);
      if (t) {
        const d = JSON.parse(t);
        if (d && Array.isArray(d.profiles)) return d;
      }
    } catch (e) { storageOK = false; }
    return { profiles: [], activeId: null };
  }
  MA.DB = load();
  MA.save = function () {
    try { localStorage.setItem(KEY, JSON.stringify(MA.DB)); storageOK = true; } catch (e) { storageOK = false; }
  };
  MA.storageOK = () => storageOK;
  MA.me = () => MA.DB.profiles.find((p) => p.id === MA.DB.activeId) || null;
  const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

  MA.newProfile = function (name, role, grade) {
    return { id: uid(), name: name, role: role, grade: grade, level: 'prog', created: Date.now(), stats: {}, history: [], custom: { questions: [], names: '', rouletteN: 30 } };
  };
  MA.ensure = function (p) {
    p.stats = p.stats || {}; p.history = p.history || [];
    p.custom = p.custom || {}; p.custom.questions = p.custom.questions || [];
    if (typeof p.custom.names !== 'string') p.custom.names = '';
    if (!p.custom.rouletteN) p.custom.rouletteN = 30;
    if (!p.level) p.level = 'prog';
    if (!p.grade) p.grade = 1;
    return p;
  };
  MA.DB.profiles.forEach(MA.ensure);

  /* ---------- temporizadores (se limpian al cambiar de pantalla) ---------- */
  const timers = new Set();
  let rafId = 0;
  MA.later = (fn, ms) => { const id = setTimeout(() => { timers.delete(id); fn(); }, ms); timers.add(id); return id; };
  MA.every = (fn, ms) => { const id = setInterval(fn, ms); timers.add(id); return id; };
  MA.stop = (id) => { clearTimeout(id); clearInterval(id); timers.delete(id); };
  MA.raf = (fn) => { rafId = requestAnimationFrame(fn); return rafId; };
  MA.clearTimers = () => { timers.forEach((id) => { clearTimeout(id); clearInterval(id); }); timers.clear(); cancelAnimationFrame(rafId); };

  /* ---------- navegación ---------- */
  const app = () => document.getElementById('app');
  MA.view = 'home';
  MA.go = function (v) {
    const target = '#/' + v;
    if (location.hash === target) MA.route(); else location.hash = target;
  };
  MA.route = function () {
    MA.clearTimers();
    MA.keyHandler = null;
    let v = (location.hash || '').replace(/^#\/?/, '') || 'home';
    if (!MA.me() && v !== 'login') v = 'login';
    if (!MA.views[v]) v = 'home';
    MA.view = v;
    MA.views[v]();
    window.scrollTo(0, 0);
    const h1 = document.querySelector('main h1, main h2');
    if (h1) { h1.setAttribute('tabindex', '-1'); }
  };
  window.addEventListener('hashchange', () => MA.route());

  /* ---------- estructura general de pantalla ---------- */
  MA.layout = function (inner, opt) {
    opt = opt || {};
    const p = MA.me();
    const back = opt.back !== false && MA.view !== 'home' && MA.view !== 'login';
    const html = `<div class="shell ${opt.cls || ''}">
      <header class="top">
        ${back ? '<button class="icon-btn" data-act="home" aria-label="Volver al menú">←</button>' : `<span class="logo">${MA.clover(34)}</span>`}
        <div class="top-title">${esc(opt.title || MA.APP_NAME)}</div>
        ${p && MA.view !== 'login' ? `<button class="chip" data-act="goto" data-to="perfil" aria-label="Mi perfil: ${esc(p.name)}">${esc(p.name)}</button>` : '<span></span>'}
      </header>
      <main class="main" id="main">${inner}</main>
    </div>`;
    app().innerHTML = html;
  };
  MA.stars = (n, max) => {
    max = max || 3;
    let s = '';
    for (let i = 0; i < max; i++) s += `<span class="${i < n ? 'on' : ''}">★</span>`;
    return `<span class="stars" role="img" aria-label="${n} de ${max} estrellas">${s}</span>`;
  };

  /* ---------- configuración compartida de los juegos ---------- */
  MA.topicsSel = []; // temas elegidos (vacío = todos)
  MA.cfg = function () {
    const p = MA.me();
    const valid = MB.topics(p.grade).map((t) => t.id);
    const topics = MA.topicsSel.filter((t) => valid.indexOf(t) >= 0);
    return { grade: p.grade, level: p.level, topics: topics };
  };
  MA.levelLabel = (l) => (MA.LEVELS.find((x) => String(x[0]) === String(l)) || [0, 'Progresivo'])[1];
  MA.gradeName = (g) => (MB.GRADES.find((x) => x.id === g) || {}).name || '';

  /* ---------- resultados ---------- */
  const GAME_NAMES = { trivia: 'Trivia matemática', carrera: 'Carrera de operaciones', bingo: 'Bingo matemático', escape: 'Escape room', ruleta: 'Ruleta para el aula', impostor: 'Impostor matemático' };
  MA.GAME_NAMES = GAME_NAMES;
  MA.record = function (game, score, label) {
    const p = MA.me();
    if (!p) return false;
    const st = (p.stats[game] = p.stats[game] || { plays: 0, best: 0 });
    st.plays++;
    const isBest = typeof score === 'number' && score > st.best;
    if (isBest) st.best = score;
    st.last = Date.now();
    p.history.unshift({ game: game, date: Date.now(), grade: p.grade, level: p.level, score: score, label: label || '' });
    p.history = p.history.slice(0, 60);
    MA.save();
    return isBest;
  };

  /* ---------- eventos ---------- */
  document.addEventListener('click', (ev) => {
    const el = ev.target.closest('[data-act]');
    if (!el || !app().contains(el)) return;
    const fn = MA.actions[el.getAttribute('data-act')];
    if (fn) { ev.preventDefault(); fn(el, ev); }
  });
  document.addEventListener('change', (ev) => {
    const el = ev.target.closest('[data-change]');
    if (!el) return;
    const fn = MA.actions[el.getAttribute('data-change')];
    if (fn) fn(el, ev);
  });
  document.addEventListener('submit', (ev) => {
    const f = ev.target.closest('form[data-submit]');
    if (!f) return;
    ev.preventDefault();
    const fn = MA.actions[f.getAttribute('data-submit')];
    if (fn) fn(f, ev);
  });
  document.addEventListener('keydown', (ev) => {
    if (MA.keyHandler) MA.keyHandler(ev);
  });

  MA.actions.home = () => MA.go('home');
  MA.actions.goto = (el) => MA.go(el.getAttribute('data-to'));

  /* ====================== PANTALLA: ENTRAR ====================== */
  let loginMode = 'auto';
  MA.views.login = function () {
    const ps = MA.DB.profiles;
    const showForm = loginMode === 'new' || ps.length === 0;
    const gradeOpts = MB.GRADES.map((g) => `<option value="${g.id}">${g.name}</option>`).join('');
    const form = `<form class="card form" data-submit="createUser" autocomplete="off">
        <h2>${ps.length ? 'Nuevo usuario' : 'Crea tu usuario'}</h2>
        <label class="field"><span>¿Cómo te llamas?</span>
          <input name="name" type="text" maxlength="30" required placeholder="Tu nombre" autocomplete="off"></label>
        <fieldset class="field"><legend>Soy</legend>
          <label class="radio"><input type="radio" name="role" value="student" checked> estudiante</label>
          <label class="radio"><input type="radio" name="role" value="teacher"> maestro o maestra</label>
        </fieldset>
        <label class="field"><span>Mi grado</span><select name="grade">${gradeOpts}</select></label>
        <p class="error" id="loginErr" role="alert"></p>
        <button class="btn primary big" type="submit">Entrar</button>
        ${ps.length ? '<button class="btn link" type="button" data-act="loginList">Volver a la lista</button>' : ''}
      </form>`;
    const list = `<div class="card form">
        <h2>¿Quién va a jugar?</h2>
        <ul class="plist">
          ${ps.map((p) => `<li><button class="pick" data-act="loginAs" data-id="${p.id}">
              <span class="pick-name">${esc(p.name)}</span>
              <span class="pick-sub">${p.role === 'teacher' ? 'Maestro o maestra' : 'Estudiante'}, ${MB.GRADES.find((g) => g.id === p.grade).short} de secundaria</span></button></li>`).join('')}
        </ul>
        <button class="btn" data-act="loginNew">+ Nuevo usuario</button>
      </div>`;
    MA.layout(`<section class="welcome">
        <div class="welcome-mark">${MA.clover(120, 'clover big')}</div>
        <h1 class="brand">${MA.APP_NAME}</h1>
        <p class="dedic">${esc(MA.DEDICATORIA)}</p>
        ${showForm ? form : list}
        ${MA.storageOK() ? '' : '<p class="notice">Este navegador no permite guardar datos. Podrás jugar, pero los puntajes no se guardarán.</p>'}
        <p class="fine">Los usuarios y puntajes se guardan solo en este dispositivo.</p>
      </section>`, { back: false, cls: 'welcome-shell' });
  };
  MA.actions.loginNew = () => { loginMode = 'new'; MA.views.login(); };
  MA.actions.loginList = () => { loginMode = 'auto'; MA.views.login(); };
  MA.actions.loginAs = (el) => { MA.DB.activeId = el.getAttribute('data-id'); MA.save(); loginMode = 'auto'; MA.topicsSel = []; MA.go('home'); };
  MA.actions.createUser = (f) => {
    const name = f.elements.name.value.trim().replace(/\s+/g, ' ');
    const err = document.getElementById('loginErr');
    if (!name) { err.textContent = 'Escribe tu nombre para continuar.'; return; }
    if (MA.DB.profiles.some((p) => p.name.toLowerCase() === name.toLowerCase())) { err.textContent = 'Ya existe un usuario con ese nombre. Escribe otro, por ejemplo con tu apellido.'; return; }
    const p = MA.newProfile(name, f.elements.role.value, Number(f.elements.grade.value));
    MA.DB.profiles.push(p);
    MA.DB.activeId = p.id;
    MA.save();
    loginMode = 'auto';
    MA.topicsSel = [];
    MA.go('home');
  };

  /* ====================== PANTALLA: MENÚ ====================== */
  const GAMES = [
    ['trivia', '🧠', 'Trivia', '10 preguntas con tiempo. Gana puntos por rapidez y por rachas.', 'c1'],
    ['carrera', '⏱️', 'Carrera de operaciones', '60 segundos para resolver todas las que puedas.', 'c2'],
    ['bingo', '🎯', 'Bingo matemático', 'Resuelve la operación y marca su resultado en el cartón.', 'c3'],
    ['escape', '🔐', 'Escape room', 'Abre 6 puertas resolviendo acertijos antes de que se acabe el tiempo.', 'c4'],
    ['ruleta', '🎡', 'Ruleta para el aula', 'Elige estudiantes, temas o números al azar. Ideal para proyectar.', 'c5'],
    ['impostor', '🕵️', 'Impostor matemático', 'Todos conocen la palabra secreta menos el impostor. Se juega en grupo.', 'c6']
  ];
  MA.GAMES = GAMES;
  MA.views.home = function () {
    const p = MA.me();
    const c = MA.cfg();
    const topics = MB.topics(p.grade);
    const nSel = c.topics.length;
    const gradeBtns = MB.GRADES.map((g) => `<button class="seg ${g.id === p.grade ? 'on' : ''}" data-act="setGrade" data-v="${g.id}" aria-pressed="${g.id === p.grade}">${g.short}</button>`).join('');
    const levelBtns = MA.LEVELS.map((l) => `<button class="seg ${String(l[0]) === String(p.level) ? 'on' : ''}" data-act="setLevel" data-v="${l[0]}" aria-pressed="${String(l[0]) === String(p.level)}">${l[1]}</button>`).join('');
    const topicList = topics.map((t) => `<label class="check"><input type="checkbox" data-change="toggleTopic" value="${t.id}" ${c.topics.indexOf(t.id) >= 0 ? 'checked' : ''}> ${esc(t.name)}</label>`).join('');
    const cards = GAMES.map((g) => `<button class="game ${g[4]}" data-act="goto" data-to="${g[0]}">
        <span class="game-ico" aria-hidden="true">${g[1]}</span>
        <span class="game-name">${g[2]}</span>
        <span class="game-desc">${g[3]}</span></button>`).join('');
    MA.layout(`<section class="hello">
        <h1>Hola, ${esc(p.name)}</h1>
        <p class="lead">Elige el grado y la dificultad; después escoge un juego.</p>
      </section>
      <section class="card cfg" aria-label="Configuración">
        <div class="cfg-row"><span class="cfg-label" id="lg">Grado</span><div class="segs" role="group" aria-labelledby="lg">${gradeBtns}</div></div>
        <div class="cfg-row"><span class="cfg-label" id="ll">Dificultad</span><div class="segs wrap" role="group" aria-labelledby="ll">${levelBtns}</div></div>
        <details class="topics" ${nSel ? 'open' : ''}>
          <summary>Temas: ${nSel ? nSel + ' elegido' + (nSel > 1 ? 's' : '') : 'todos'}</summary>
          <div class="checks">${topicList}</div>
          ${nSel ? '<button class="btn small" data-act="allTopics">Usar todos los temas</button>' : '<p class="fine">Si marcas uno o más, los juegos solo usarán esos temas.</p>'}
        </details>
      </section>
      <section class="games" aria-label="Juegos">${cards}</section>
      <nav class="links">
        <button class="btn link" data-act="goto" data-to="puntajes">Mis puntajes</button>
        ${p.role === 'teacher' ? '<button class="btn link" data-act="goto" data-to="preguntas">Mis preguntas</button>' : ''}
        <button class="btn link" data-act="goto" data-to="perfil">Mi perfil</button>
      </nav>
      <footer class="foot"><span>${MA.clover(20)}</span><span>${esc(MA.DEDICATORIA)}</span></footer>`);
  };
  MA.actions.setGrade = (el) => {
    const p = MA.me();
    p.grade = Number(el.getAttribute('data-v'));
    MA.topicsSel = [];
    MA.save();
    MA.views.home();
  };
  MA.actions.setLevel = (el) => {
    const p = MA.me();
    const v = el.getAttribute('data-v');
    p.level = v === 'prog' ? 'prog' : Number(v);
    MA.save();
    MA.views.home();
    const b = document.querySelector('.segs.wrap .seg.on'); if (b) b.focus();
  };
  MA.actions.toggleTopic = (el) => {
    const id = el.value;
    const i = MA.topicsSel.indexOf(id);
    if (el.checked && i < 0) MA.topicsSel.push(id);
    if (!el.checked && i >= 0) MA.topicsSel.splice(i, 1);
    const sum = document.querySelector('.topics summary');
    const n = MA.cfg().topics.length;
    if (sum) sum.textContent = 'Temas: ' + (n ? n + ' elegido' + (n > 1 ? 's' : '') : 'todos');
  };
  MA.actions.allTopics = () => { MA.topicsSel = []; MA.views.home(); };

  /* ====================== PANTALLA: PUNTAJES ====================== */
  MA.views.puntajes = function () {
    const p = MA.me();
    const rows = GAMES.map((g) => {
      const st = p.stats[g[0]];
      const unit = g[0] === 'ruleta' || g[0] === 'impostor' ? '' : ' pts';
      return `<tr><th scope="row"><span aria-hidden="true">${g[1]}</span> ${g[2]}</th>
        <td>${st ? st.plays : 0}</td><td>${st && st.best ? st.best + unit : '—'}</td></tr>`;
    }).join('');
    const hist = p.history.slice(0, 15).map((h) => {
      const d = new Date(h.date);
      return `<li><span class="h-game">${MA.GAME_NAMES[h.game] || h.game}</span>
        <span class="h-meta">${MB.GRADES.find((g) => g.id === h.grade).short}, ${MA.levelLabel(h.level)}</span>
        <span class="h-res">${esc(h.label || '')}</span>
        <span class="h-date">${d.toLocaleDateString('es-DO', { day: 'numeric', month: 'short' })}</span></li>`;
    }).join('');
    MA.layout(`<h1>Mis puntajes</h1>
      <p class="lead">Estos datos son de ${esc(p.name)} y se guardan en este dispositivo.</p>
      <div class="card"><table class="tbl"><thead><tr><th>Juego</th><th>Partidas</th><th>Mejor</th></tr></thead><tbody>${rows}</tbody></table></div>
      <h2>Últimas partidas</h2>
      ${hist ? `<ul class="hist card">${hist}</ul>` : '<p class="empty">Todavía no has jugado. Elige un juego en el menú para empezar.</p>'}`, { title: 'Mis puntajes' });
  };

  /* ====================== PANTALLA: PERFIL ====================== */
  MA.views.perfil = function () {
    const p = MA.me();
    const gradeOpts = MB.GRADES.map((g) => `<option value="${g.id}" ${g.id === p.grade ? 'selected' : ''}>${g.name}</option>`).join('');
    MA.layout(`<h1>Mi perfil</h1>
      <div class="card form">
        <p><strong>${esc(p.name)}</strong><br><span class="fine">${p.role === 'teacher' ? 'Maestro o maestra' : 'Estudiante'}</span></p>
        <label class="field"><span>Mi grado</span><select data-change="profGrade">${gradeOpts}</select></label>
        <button class="btn" data-act="switchUser">Cambiar de usuario</button>
      </div>
      <h2>Copia de seguridad</h2>
      <div class="card form">
        <p class="fine">Todo se guarda en este dispositivo. Descarga una copia para no perder tus usuarios, puntajes y preguntas, o para pasarlos a otro dispositivo.</p>
        <button class="btn" data-act="exportData">Descargar copia</button>
        <label class="btn file">Cargar copia<input type="file" accept="application/json,.json" data-change="importData" hidden></label>
        <p class="notice" id="bkMsg" role="status"></p>
      </div>
      <h2>Zona de cuidado</h2>
      <div class="card form">
        <button class="btn danger" data-act="deleteUser">Borrar este usuario</button>
      </div>`, { title: 'Mi perfil' });
  };
  MA.actions.profGrade = (el) => { MA.me().grade = Number(el.value); MA.topicsSel = []; MA.save(); };
  MA.actions.switchUser = () => { MA.DB.activeId = null; MA.save(); MA.go('login'); };
  MA.actions.deleteUser = () => {
    const p = MA.me();
    if (!confirm('¿Borrar el usuario "' + p.name + '" con todos sus puntajes y preguntas? Esto no se puede deshacer.')) return;
    MA.DB.profiles = MA.DB.profiles.filter((x) => x.id !== p.id);
    MA.DB.activeId = null;
    MA.save();
    MA.go('login');
  };
  MA.actions.exportData = () => {
    const msg = document.getElementById('bkMsg');
    try {
      const blob = new Blob([JSON.stringify({ app: 'math-arena', version: 1, data: MA.DB }, null, 1)], { type: 'application/json' });
      const a = document.createElement('a');
      const d = new Date();
      a.href = URL.createObjectURL(blob);
      a.download = 'math-arena-copia-' + d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0') + '.json';
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 2000);
      msg.textContent = 'Copia descargada. Guárdala en un lugar seguro.';
    } catch (e) { msg.textContent = 'No se pudo crear la copia en este navegador.'; }
  };
  MA.actions.importData = (el) => {
    const msg = document.getElementById('bkMsg');
    const f = el.files && el.files[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = () => {
      try {
        const d = JSON.parse(r.result);
        const data = d && d.app === 'math-arena' ? d.data : null;
        if (!data || !Array.isArray(data.profiles)) throw new Error('formato');
        if (!confirm('Esto reemplazará los datos actuales de este dispositivo por los de la copia. ¿Continuar?')) return;
        MA.DB = data;
        MA.DB.profiles.forEach(MA.ensure);
        if (!MA.DB.profiles.some((p) => p.id === MA.DB.activeId)) MA.DB.activeId = MA.DB.profiles[0] ? MA.DB.profiles[0].id : null;
        MA.save();
        MA.go('home');
      } catch (e) { msg.textContent = 'Ese archivo no es una copia válida de Math Arena.'; }
    };
    r.readAsText(f);
  };

  /* ====================== PANTALLA: MIS PREGUNTAS (maestros) ====================== */
  let myqGrade = null;
  MA.views.preguntas = function () {
    const p = MA.me();
    if (myqGrade === null) myqGrade = p.grade;
    const list = p.custom.questions.filter((q) => q.grade === myqGrade);
    const gradeOpts = MB.GRADES.map((g) => `<option value="${g.id}" ${g.id === myqGrade ? 'selected' : ''}>${g.name}</option>`).join('');
    const items = list.map((q) => `<li class="qitem">
        <div class="qtext">${MA.fmt(q.q)}</div>
        <ol class="qopts" type="A">${q.options.map((o, i) => `<li class="${i === q.correct ? 'ok' : ''}">${MA.fmt(o)}</li>`).join('')}</ol>
        <button class="btn small danger" data-act="delQ" data-id="${q.id}">Borrar</button></li>`).join('');
    MA.layout(`<h1>Mis preguntas</h1>
      <p class="lead">Escribe tus propias preguntas. En la Trivia se mezclan con las del juego (hasta 4 por partida) para el grado en que las guardes.</p>
      <form class="card form" data-submit="addQ" autocomplete="off">
        <label class="field"><span>Grado</span><select name="grade" data-change="myqGrade">${gradeOpts}</select></label>
        <label class="field"><span>Pregunta</span><textarea name="q" rows="3" maxlength="300" required></textarea></label>
        <fieldset class="field"><legend>Opciones (marca la correcta)</legend>
          ${['A', 'B', 'C', 'D'].map((l, i) => `<div class="opt-edit"><input type="radio" name="correct" value="${i}" ${i === 0 ? 'checked' : ''} aria-label="Opción ${l} es la correcta"><input type="text" name="o${i}" maxlength="80" placeholder="Opción ${l}" required></div>`).join('')}
        </fieldset>
        <label class="field"><span>Explicación (opcional)</span><input type="text" name="explain" maxlength="200"></label>
        <details class="fine"><summary>¿Cómo escribo potencias y fracciones?</summary>
          <p>Potencia: <code>x^(2)</code> se ve así: x<sup>2</sup>.<br>Fracción: <code>{3|4}</code> se ve como una fracción apilada.<br>Raíz: copia el símbolo √.</p></details>
        <p class="error" id="qErr" role="alert"></p>
        <button class="btn primary" type="submit">Guardar pregunta</button>
      </form>
      <h2>Guardadas para ${MA.gradeName(myqGrade)} (${list.length})</h2>
      ${list.length ? `<ul class="qlist">${items}</ul>` : '<p class="empty">Aún no tienes preguntas para este grado.</p>'}`, { title: 'Mis preguntas' });
  };
  MA.actions.myqGrade = (el) => { myqGrade = Number(el.value); MA.views.preguntas(); };
  MA.actions.addQ = (f) => {
    const p = MA.me();
    const err = document.getElementById('qErr');
    const options = [0, 1, 2, 3].map((i) => f.elements['o' + i].value.trim());
    const q = f.elements.q.value.trim();
    if (!q || options.some((o) => !o)) { err.textContent = 'Completa la pregunta y las cuatro opciones.'; return; }
    if (new Set(options).size < 4) { err.textContent = 'Las cuatro opciones deben ser distintas.'; return; }
    if (p.custom.questions.length >= 300) { err.textContent = 'Llegaste al máximo de 300 preguntas. Borra algunas para agregar más.'; return; }
    p.custom.questions.push({ id: Date.now().toString(36) + Math.random().toString(36).slice(2, 5), grade: Number(f.elements.grade.value), q: q, options: options, correct: Number(f.elements.correct.value), explain: f.elements.explain.value.trim() });
    myqGrade = Number(f.elements.grade.value);
    MA.save();
    MA.views.preguntas();
  };
  MA.actions.delQ = (el) => {
    const p = MA.me();
    p.custom.questions = p.custom.questions.filter((q) => q.id !== el.getAttribute('data-id'));
    MA.save();
    MA.views.preguntas();
  };
  MA.customFor = (grade) => (MA.me().custom.questions || []).filter((q) => q.grade === grade);

  /* ---------- pregunta con manejo de errores amigable ---------- */
  MA.fail = function (msg) {
    MA.layout(`<div class="card center"><h2>No se pudo preparar el juego</h2><p>${esc(msg)}</p>
      <button class="btn primary" data-act="home">Volver al menú</button></div>`);
  };

  /* ---------- arranque ---------- */
  MA.start = function () {
    MA.route();
    if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) {
      navigator.serviceWorker.register('sw.js').catch(() => {});
    }
  };
})();
