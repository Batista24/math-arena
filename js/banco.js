/* Math Arena - banco de preguntas: núcleo (utilidades y construcción de preguntas)
   Los temas de cada grado están en grados-1-3.js y grados-4-6.js */
(function (root) {
  'use strict';
  const MB = (root.MathBank = root.MathBank || {});
  MB.G = {};

  MB.GRADES = [
    { id: 1, name: '1ro de Secundaria', short: '1ro' },
    { id: 2, name: '2do de Secundaria', short: '2do' },
    { id: 3, name: '3ro de Secundaria', short: '3ro' },
    { id: 4, name: '4to de Secundaria', short: '4to' },
    { id: 5, name: '5to de Secundaria', short: '5to' },
    { id: 6, name: '6to de Secundaria', short: '6to' }
  ];
  MB.LEVEL_NAMES = { 1: 'Fácil', 2: 'Medio', 3: 'Difícil', prog: 'Progresivo' };

  /* ---------- utilidades ---------- */
  const rnd = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
  const pick = (arr) => arr[rnd(0, arr.length - 1)];
  const shuffle = (arr) => {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = rnd(0, i);
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };
  const gcd = (a, b) => {
    a = Math.abs(a); b = Math.abs(b);
    while (b) { [a, b] = [b, a % b]; }
    return a;
  };
  const round = (x, d = 6) => Math.round(x * Math.pow(10, d)) / Math.pow(10, d);
  // número -> texto (signo menos tipográfico, sin ceros sobrantes)
  const n = (x) => {
    if (typeof x !== 'number') return String(x);
    x = round(x);
    return (x < 0 ? '−' : '') + String(Math.abs(x));
  };
  const par = (x) => (x < 0 ? '(−' + Math.abs(x) + ')' : String(x)); // paréntesis si es negativo
  const sg = (x) => (x < 0 ? '−' : '+');
  // fracción apilada: {a|b}
  const fr = (a, b) => '{' + a + '|' + b + '}';
  // fracción simplificada (entero si el denominador es 1)
  const frR = (a, b) => {
    if (b < 0) { a = -a; b = -b; }
    const g = gcd(a, b) || 1;
    a /= g; b /= g;
    if (b === 1) return n(a);
    return (a < 0 ? '−' : '') + fr(Math.abs(a), b);
  };
  // términos [[coef, 'variable'], ...] -> "3x − 2y + 5"
  const termsStr = (terms) => {
    let out = '';
    for (const [c, v] of terms) {
      if (c === 0) continue;
      const abs = Math.abs(c);
      const body = v === '' ? n(abs) : (abs === 1 ? '' : n(abs)) + v;
      if (out === '') out = (c < 0 ? '−' : '') + body;
      else out += (c < 0 ? ' − ' : ' + ') + body;
    }
    return out || '0';
  };
  const vx = (d, v = 'x') => (d === 0 ? '' : d === 1 ? v : v + '^(' + d + ')');
  // coeficientes de mayor a menor grado -> "3x^(2) − x + 4"
  const polyStr = (coefs, v = 'x') => {
    const deg = coefs.length - 1;
    return termsStr(coefs.map((c, i) => [c, vx(deg - i, v)]));
  };
  const mono = (c, d, v = 'x') => termsStr([[c, vx(d, v)]]);
  const lineStr = (m, b) => 'y = ' + termsStr([[m, 'x'], [b, '']]);

  MB.u = { rnd, pick, shuffle, gcd, round, n, par, sg, fr, frR, termsStr, vx, polyStr, mono, lineStr };

  /* ---------- formato para mostrar (HTML seguro) ---------- */
  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  // ^(2) -> potencia, _(2) -> subíndice, {a|b} -> fracción, \n -> salto de línea
  MB.fmt = function (s) {
    let t = esc(s);
    t = t.replace(/\^\(([^)]*)\)/g, '<sup>$1</sup>').replace(/_\(([^)]*)\)/g, '<sub>$1</sub>');
    t = t.replace(/\{([^{}|]+)\|([^{}|]+)\}/g, '<span class="fr"><span class="nu">$1</span><span class="de">$2</span></span>');
    t = t.replace(/\n/g, '<br>');
    return t;
  };
  // texto plano legible (para lectores de pantalla / resultados de texto)
  MB.plain = function (s) {
    return String(s)
      .replace(/\^\(([^)]*)\)/g, '^$1').replace(/_\(([^)]*)\)/g, '_$1')
      .replace(/\{([^{}|]+)\|([^{}|]+)\}/g, '($1)/($2)');
  };

  /* ---------- respuesta escrita ---------- */
  MB.parseNum = function (s) {
    s = String(s).trim().replace(/\s+/g, '').replace(/−/g, '-').replace(/,/g, '.');
    if (/^-?\d+(\.\d+)?$/.test(s)) return parseFloat(s);
    const m = s.match(/^(-?\d+)\/(\d+)$/);
    if (m && Number(m[2]) !== 0) return Number(m[1]) / Number(m[2]);
    return NaN;
  };
  MB.checkTyped = function (q, input) {
    if (typeof q.num !== 'number') return false;
    const v = MB.parseNum(input);
    return !isNaN(v) && Math.abs(v - q.num) < 1e-6 + Math.abs(q.num) * 1e-9;
  };

  /* ---------- construcción de la pregunta final ---------- */
  // o = { q, num | ans, wrongs[], explain, unit?, step? }
  function finalize(o, meta) {
    const u = o.unit || '';
    const f = (v) => (typeof v === 'number' ? n(v) + u : String(v));
    const fw = (v) => (typeof v === 'number' ? f(round(v, 3)) : String(v)); // distractores: máx. 3 decimales
    const ans = o.ans !== undefined ? String(o.ans) : f(o.num);
    const seen = new Set([ans]);
    // valor numérico de un texto simple (entero, decimal o fracción {a|b}); null si no se puede leer
    const valOf = (t) => {
      t = String(t).replace(/\s*(cm²|cm³|cm|m²|m³|m|L|°|g)$/, '');
      const m = t.match(/^(−?)(?:(\d+(?:\.\d+)?)|\{(\d+)\|(\d+)\})$/);
      if (!m) return null;
      const v = m[2] !== undefined ? parseFloat(m[2]) : Number(m[3]) / Number(m[4]);
      return m[1] ? -v : v;
    };
    const av = valOf(ans);
    // una opción incorrecta nunca debe valer lo mismo que la correcta (p. ej. 3/36 y 1/12)
    const sameVal = (s) => av !== null && valOf(s) !== null && Math.abs(valOf(s) - av) < 1e-9;
    let wr = [];
    for (const w of shuffle(o.wrongs || [])) {
      const s = fw(w);
      if (!seen.has(s) && !sameVal(s)) { seen.add(s); wr.push(s); }
    }
    wr = wr.slice(0, 3);
    // distractores de reserva (menos típicos) si faltan
    if (wr.length < 3) {
      for (const w of shuffle(o.extras || [])) {
        if (wr.length >= 3) break;
        const s = fw(w);
        if (!seen.has(s) && !sameVal(s)) { seen.add(s); wr.push(s); }
      }
    }
    if (wr.length < 3 && typeof o.num === 'number' && o.ans === undefined) {
      const step = o.step || 1;
      const spread = Math.max(3, Math.round((Math.abs(o.num) * 0.25) / step));
      let guard = 0;
      while (wr.length < 3 && guard++ < 400) {
        const d = rnd(1, spread) * step * (Math.random() < 0.5 ? -1 : 1);
        const s = f(round(o.num + d));
        if (!seen.has(s)) { seen.add(s); wr.push(s); }
      }
    }
    for (const s of ['Ninguna de las anteriores', 'No se puede determinar', 'Otro resultado']) {
      if (wr.length >= 3) break;
      if (!seen.has(s)) { seen.add(s); wr.push(s); }
    }
    const options = shuffle([ans].concat(wr));
    const minus = (t) => String(t).replace(/(^|[\s(])-(?=\d)/g, '$1−');
    return Object.assign({
      q: minus(o.q),
      options: options,
      correct: options.indexOf(ans),
      ans: ans,
      num: typeof o.num === 'number' ? o.num : null,
      explain: minus(o.explain || '')
    }, meta);
  }
  MB.finalize = finalize;

  /* ---------- generación ---------- */
  MB.topics = (grade) => (MB.G[grade] || []).map((t) => ({ id: t.id, name: t.name }));

  // nivel para la pregunta i de total (modo progresivo = fácil -> medio -> difícil)
  MB.levelFor = function (mode, i, total) {
    if (mode === 1 || mode === 2 || mode === 3) return mode;
    const r = (i + 0.5) / Math.max(1, total);
    return r < 0.4 ? 1 : r < 0.75 ? 2 : 3;
  };

  MB.makeQuestion = function (grade, level, opts) {
    opts = opts || {};
    const all = MB.G[grade] || [];
    const topics = opts.topics && opts.topics.length ? all.filter((t) => opts.topics.indexOf(t.id) >= 0) : all;
    if (!topics.length) throw new Error('Sin temas para el grado ' + grade);
    for (let tries = 0; tries < 80; tries++) {
      const t = pick(topics);
      let o;
      try { o = t.gen(level); } catch (e) { continue; }
      if (!o || !o.q) continue;
      if (opts.numericOnly && typeof o.num !== 'number') continue;
      return finalize(o, { topic: t.id, topicName: t.name, grade: grade, level: level });
    }
    throw new Error('No se pudo generar la pregunta');
  };

  // conjunto de preguntas distintas
  MB.makeSet = function (grade, levelMode, count, opts) {
    opts = opts || {};
    const out = [];
    const seen = new Set();
    let guard = 0;
    while (out.length < count && guard++ < count * 40) {
      const lvl = MB.levelFor(levelMode, out.length, count);
      const q = MB.makeQuestion(grade, lvl, opts);
      if (seen.has(q.q)) continue;
      seen.add(q.q);
      out.push(q);
    }
    return out;
  };
})(typeof window !== 'undefined' ? window : globalThis);
