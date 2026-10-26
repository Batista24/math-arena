/* Math Arena - temas y generadores de preguntas: 4to, 5to y 6to de Secundaria */
(function (root) {
  'use strict';
  const MB = root.MathBank;
  const { rnd, pick, shuffle, gcd, round, n, par, sg, fr, frR, termsStr, polyStr, mono, lineStr } = MB.u;
  const nz = (a, b) => { let x; do { x = rnd(a, b); } while (x === 0); return x; };
  const comb = (N, K) => { let r = 1; for (let i = 1; i <= K; i++) r = (r * (N - K + i)) / i; return Math.round(r); };
  const perm = (N, K) => { let r = 1; for (let i = 0; i < K; i++) r *= N - i; return r; };
  const fact = (N) => { let r = 1; for (let i = 2; i <= N; i++) r *= i; return r; };
  const TRIP = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25]];
  const xy = (a, b) => `(${n(a)}, ${n(b)})`;
  const rootsText = (a, b) => { // a, b: {v, s}
    const [lo, hi] = a.v <= b.v ? [a, b] : [b, a];
    return `x = ${lo.s} y x = ${hi.s}`;
  };
  const R = (v, s) => ({ v, s: s !== undefined ? s : n(v) });

  /* ===================== 4to de Secundaria ===================== */
  MB.G[4] = [
    {
      id: 'lineales', name: 'Funciones lineales',
      gen(L) {
        if (L === 1) {
          const m = nz(-5, 6), b = nz(-9, 9), k = nz(-4, 6), ans = m * k + b;
          return { q: `Si f(x) = ${termsStr([[m, 'x'], [b, '']])}, ¿cuánto vale f(${n(k)})?`, num: ans, wrongs: [m * k - b, -m * k + b, m + k + b], explain: `f(${n(k)}) = ${m} × ${par(k)} ${b < 0 ? '−' : '+'} ${Math.abs(b)} = ${n(ans)}.` };
        }
        if (L === 2) {
          const m = pick([-4, -3, -2, 2, 3, 4, 5, -5]), x1 = rnd(-5, 5), dx = rnd(1, 5), y1 = rnd(-6, 6), x2 = x1 + dx, y2 = y1 + m * dx;
          return { q: `¿Cuál es la pendiente de la recta que pasa por ${xy(x1, y1)} y ${xy(x2, y2)}?`, num: m, wrongs: [-m, frR(1, m), m + 1, m - 1], explain: `m = (y₂ − y₁) ÷ (x₂ − x₁) = (${n(y2)} − ${par(y1)}) ÷ (${n(x2)} − ${par(x1)}) = ${n(y2 - y1)} ÷ ${dx} = ${n(m)}.` };
        }
        const m = nz(-4, 5), x0 = rnd(-4, 4), y0 = rnd(-6, 6), b = y0 - m * x0;
        if (Math.random() < 0.5) {
          return { q: `¿Cuál es la ecuación de la recta de pendiente ${n(m)} que pasa por el punto ${xy(x0, y0)}?`, ans: lineStr(m, b), wrongs: [lineStr(m, y0 + m * x0), lineStr(-m, b), lineStr(m, -b), lineStr(b, m)], extras: [lineStr(m, b + 1), lineStr(m, b - 1), lineStr(m + 1, b), lineStr(m - 1, b)], explain: `y = mx + b. Sustituyendo el punto: ${n(y0)} = ${n(m)} × ${par(x0)} + b, entonces b = ${n(b)}. La ecuación es ${lineStr(m, b)}.` };
        }
        const dx = rnd(1, 4), x1 = x0, y1 = y0, x2 = x0 + dx, y2 = y0 + m * dx;
        return { q: `¿Cuál es la ecuación de la recta que pasa por ${xy(x1, y1)} y ${xy(x2, y2)}?`, ans: lineStr(m, b), wrongs: [lineStr(m, y0 + m * x0), lineStr(-m, b), lineStr(m, -b), lineStr(b, m)], extras: [lineStr(m, b + 1), lineStr(m, b - 1), lineStr(m + 1, b), lineStr(m - 1, b)], explain: `Pendiente: ${n(y2 - y1)} ÷ ${dx} = ${n(m)}. Con el punto ${xy(x1, y1)}: b = ${n(y1)} − ${par(m)} × ${par(x1)} = ${n(b)}. Ecuación: ${lineStr(m, b)}.` };
      }
    },
    {
      id: 'cuadraticas', name: 'Ecuaciones cuadráticas',
      gen(L) {
        if (L === 1) {
          let r1, r2;
          do { r1 = nz(-6, 6); r2 = nz(-6, 6); } while (r1 === r2);
          const eq = polyStr([1, -(r1 + r2), r1 * r2]) + ' = 0';
          return { q: `Resuelve: ${eq}`, ans: rootsText(R(r1), R(r2)), wrongs: [rootsText(R(-r1), R(-r2)), rootsText(R(r1 + 1), R(r2 - 1)), rootsText(R(r1 + r2), R(r1 * r2)), rootsText(R(-r1), R(r2))], explain: `Buscamos dos números que sumen ${n(r1 + r2)} y multipliquen ${n(r1 * r2)}: ${n(r1)} y ${n(r2)}. Entonces (x ${sg(-r1)} ${Math.abs(r1)})(x ${sg(-r2)} ${Math.abs(r2)}) = 0.` };
        }
        if (L === 2) {
          const b = nz(-10, 10), c = nz(-12, 12), eq = polyStr([1, b, c]) + ' = 0', t = rnd(0, 2);
          if (t === 0) return { q: `En la ecuación ${eq}, ¿cuál es la suma de sus raíces?`, num: -b, wrongs: [b, c, -c], explain: `En ax² + bx + c = 0, la suma de las raíces es −b/a = ${n(-b)}.` };
          if (t === 1) return { q: `En la ecuación ${eq}, ¿cuál es el producto de sus raíces?`, num: c, wrongs: [-c, b, -b], explain: `En ax² + bx + c = 0, el producto de las raíces es c/a = ${n(c)}.` };
          return { q: `¿Cuánto vale el discriminante de ${eq}?`, num: b * b - 4 * c, wrongs: [b * b + 4 * c, b * b - 2 * c, 4 * c - b * b], explain: `Δ = b² − 4ac = ${par(b)}² − 4 × 1 × ${par(c)} = ${n(b * b - 4 * c)}.` };
        }
        const q = pick([2, 3]), p = pick(q === 2 ? [-5, -3, -1, 1, 3, 5] : [-5, -1, 1, 5]), r = nz(-5, 5);
        const eq = polyStr([q, -(q * r + p), p * r]) + ' = 0';
        return { q: `Resuelve: ${eq}`, ans: rootsText(R(p / q, frR(p, q)), R(r)), wrongs: [rootsText(R(-p / q, frR(-p, q)), R(-r)), rootsText(R(p), R(r)), rootsText(R(p / q, frR(p, q)), R(-r)), rootsText(R(q / p, frR(q, p)), R(r))], explain: `Se factoriza como (${termsStr([[q, 'x'], [-p, '']])})(x ${sg(-r)} ${Math.abs(r)}) = 0. Las raíces son x = ${frR(p, q)} y x = ${n(r)}.` };
      }
    },
    {
      id: 'trigonometria', name: 'Trigonometría básica',
      gen(L) {
        if (L === 1) {
          const t = pick(TRIP), swap = Math.random() < 0.5, o = swap ? t[1] : t[0], d = swap ? t[0] : t[1], h = t[2];
          const fn = pick(['sen', 'cos', 'tan']);
          const vals = { sen: fr(o, h), cos: fr(d, h), tan: fr(o, d) };
          const all = [fr(o, h), fr(d, h), fr(o, d), fr(d, o), fr(h, o), fr(h, d)];
          const ans = vals[fn];
          return { q: `En un triángulo rectángulo, respecto al ángulo θ, el cateto opuesto mide ${o}, el adyacente mide ${d} y la hipotenusa mide ${h}. ¿Cuánto vale ${fn} θ?`, ans, wrongs: all.filter((x) => x !== ans), explain: `sen θ = opuesto/hipotenusa, cos θ = adyacente/hipotenusa, tan θ = opuesto/adyacente. Aquí ${fn} θ = ${ans}.` };
        }
        if (L === 2) {
          const T = { sen: { 30: fr(1, 2), 45: fr('√2', 2), 60: fr('√3', 2) }, cos: { 30: fr('√3', 2), 45: fr('√2', 2), 60: fr(1, 2) }, tan: { 30: fr('√3', 3), 45: '1', 60: '√3' } };
          const fn = pick(['sen', 'cos', 'tan']), ang = pick([30, 45, 60]), ans = T[fn][ang];
          const pool = [fr(1, 2), fr('√2', 2), fr('√3', 2), '1', '√3', fr('√3', 3)].filter((x) => x !== ans);
          return { q: `¿Cuánto vale ${fn} ${ang}°?`, ans, wrongs: pool, explain: `Son valores notables: ${fn} ${ang}° = ${ans}.` };
        }
        const t = rnd(0, 3);
        if (t === 0) { const h = 2 * rnd(2, 12); return { q: `Un triángulo rectángulo tiene hipotenusa de ${h} cm y un ángulo de 30°. ¿Cuánto mide el cateto opuesto a ese ángulo?`, num: h / 2, unit: ' cm', wrongs: [h, 2 * h, round(h * 0.866, 1)], explain: `sen 30° = ${fr(1, 2)}, entonces cateto opuesto = ${h} × ${fr(1, 2)} = ${h / 2} cm.` }; }
        if (t === 1) { const h = 2 * rnd(2, 12); return { q: `Un triángulo rectángulo tiene hipotenusa de ${h} cm y un ángulo de 60°. ¿Cuánto mide el cateto adyacente a ese ángulo?`, num: h / 2, unit: ' cm', wrongs: [h, 2 * h, round(h * 0.866, 1)], explain: `cos 60° = ${fr(1, 2)}, entonces cateto adyacente = ${h} × ${fr(1, 2)} = ${h / 2} cm.` }; }
        if (t === 2) { const s = rnd(5, 40); return { q: `Una torre proyecta una sombra de ${s} m cuando el sol forma un ángulo de 45° con el suelo. ¿Cuál es la altura de la torre?`, num: s, unit: ' m', wrongs: [2 * s, s / 2, round(s * 1.414, 1)], explain: `tan 45° = 1, entonces altura = sombra × tan 45° = ${s} × 1 = ${s} m.` }; }
        const o = rnd(3, 20); return { q: `En un triángulo rectángulo con un ángulo de 30°, el cateto opuesto mide ${o} cm. ¿Cuánto mide la hipotenusa?`, num: 2 * o, unit: ' cm', wrongs: [o, o / 2, round(o * 1.732, 1)], explain: `sen 30° = ${fr(1, 2)} = opuesto ÷ hipotenusa, entonces hipotenusa = ${o} ÷ ${fr(1, 2)} = ${2 * o} cm.` };
      }
    },
    {
      id: 'estadistica', name: 'Estadística',
      gen(L) {
        const sortNum = (a) => a.slice().sort((x, y) => x - y);
        if (L === 1) {
          const N = rnd(4, 6); let arr, tries = 0;
          do { arr = Array.from({ length: N }, () => rnd(2, 20)); tries++; } while (arr.reduce((s, v) => s + v, 0) % N !== 0 && tries < 400);
          if (arr.reduce((s, v) => s + v, 0) % N !== 0) arr[N - 1] += N - (arr.reduce((s, v) => s + v, 0) % N);
          const S = arr.reduce((s, v) => s + v, 0), mean = S / N, med = sortNum(arr)[Math.floor(N / 2)];
          return { q: `Calcula la media de estos datos: ${arr.join(', ')}`, num: mean, wrongs: [S, med, Math.max(...arr) - Math.min(...arr), mean + 1], explain: `Suma = ${arr.join(' + ')} = ${S}. Media = ${S} ÷ ${N} = ${mean}.` };
        }
        if (L === 2) {
          const t = rnd(0, 2);
          if (t === 0) {
            let arr; do { arr = shuffle(Array.from(new Set(Array.from({ length: 12 }, () => rnd(1, 30))))).slice(0, 7); } while (arr.length < 7);
            const s = sortNum(arr), med = s[3], mean = round(arr.reduce((a, v) => a + v, 0) / 7, 1);
            return { q: `Calcula la mediana de estos datos: ${arr.join(', ')}`, num: med, wrongs: [arr[3], mean, s[2], s[4]], explain: `Ordenados: ${s.join(', ')}. Como son 7 datos, la mediana es el del medio: ${med}.` };
          }
          if (t === 1) {
            const pool = shuffle(Array.from({ length: 20 }, (_, i) => i + 1)).slice(0, 5), mode = pool[0];
            const arr = shuffle([mode, mode, mode, pool[1], pool[2], pool[3], pool[4], pool[1]]);
            return { q: `¿Cuál es la moda de estos datos? ${arr.join(', ')}`, num: mode, wrongs: [pool[1], pool[2], round(arr.reduce((a, v) => a + v, 0) / arr.length, 1), Math.max(...arr)], explain: `La moda es el dato que más se repite. El ${mode} aparece 3 veces.` };
          }
          const arr = Array.from({ length: 6 }, () => rnd(3, 40)), mx = Math.max(...arr), mn = Math.min(...arr);
          return { q: `¿Cuál es el rango de estos datos? ${arr.join(', ')}`, num: mx - mn, wrongs: [mx, mn, mx + mn, round(arr.reduce((a, v) => a + v, 0) / 6, 1)], explain: `Rango = mayor − menor = ${mx} − ${mn} = ${mx - mn}.` };
        }
        if (Math.random() < 0.5) {
          let a, b, c, d, S;
          do { a = rnd(5, 20); b = rnd(5, 20); c = rnd(5, 20); d = rnd(5, 20); S = a + b + c + d; } while (S % 4 !== 0);
          const m = S / 4;
          return { q: `La media de 4 números es ${m}. Tres de ellos son ${a}, ${b} y ${c}. ¿Cuál es el cuarto número?`, num: d, wrongs: [m, a + b + c, 4 * m], explain: `La suma total debe ser ${m} × 4 = ${S}. El cuarto es ${S} − (${a} + ${b} + ${c}) = ${d}.` };
        }
        const tot = pick([4, 5, 10, 20]);
        const vals = [rnd(1, 4), rnd(5, 8), rnd(9, 12)];
        const f1 = rnd(1, tot - 2), f2 = rnd(1, tot - f1 - 1), f3 = tot - f1 - f2;
        const S = vals[0] * f1 + vals[1] * f2 + vals[2] * f3, mean = round(S / tot, 4);
        return { q: `Calcula la media de esta tabla de frecuencias:\nValor: ${vals.join(' | ')}\nFrecuencia: ${f1} | ${f2} | ${f3}`, num: mean, step: 0.1, wrongs: [round((vals[0] + vals[1] + vals[2]) / 3, 2), round(S / 3, 2), S], explain: `Multiplicamos cada valor por su frecuencia y sumamos: ${vals[0]}×${f1} + ${vals[1]}×${f2} + ${vals[2]}×${f3} = ${S}. Dividimos entre ${tot}: ${n(mean)}.` };
      }
    },
    {
      id: 'parabolas', name: 'Funciones cuadráticas',
      gen(L) {
        if (L === 1) {
          const b = rnd(-6, 6), c = nz(-8, 8), k = nz(-3, 5), ans = k * k + b * k + c;
          return { q: `Si f(x) = ${polyStr([1, b, c])}, ¿cuánto vale f(${n(k)})?`, num: ans, wrongs: [2 * k + b * k + c, k * k - b * k + c, k * k + b * k - c], explain: `f(${n(k)}) = ${par(k)}² + ${par(b)} × ${par(k)} + ${par(c)} = ${n(ans)}.` };
        }
        if (L === 2) {
          const h = nz(-6, 6), k = nz(-8, 8);
          return { q: `¿Cuál es el vértice de f(x) = (x ${sg(-h)} ${Math.abs(h)})^(2) ${sg(k)} ${Math.abs(k)}?`, ans: xy(h, k), wrongs: [xy(-h, k), xy(h, -k), xy(-h, -k), xy(k, h)], explain: `La forma f(x) = (x − h)² + k tiene vértice (h, k). Aquí h = ${n(h)} y k = ${n(k)}.` };
        }
        const a = pick([1, 2, -1, -2]), h = rnd(-4, 5), c = rnd(-8, 8), b = -2 * a * h, val = c - a * h * h;
        const kind = a > 0 ? 'mínimo' : 'máximo';
        return { q: `¿Cuál es el valor ${kind} de f(x) = ${polyStr([a, b, c])}?`, num: val, wrongs: [h, c, -val, a * h * h + c], explain: `El vértice está en x = −b ÷ (2a) = ${n(-b)} ÷ ${par(2 * a)} = ${n(h)}. Entonces f(${n(h)}) = ${n(val)}, que es el ${kind}.` };
      }
    }
  ];

  /* ===================== 5to de Secundaria ===================== */
  const DEG = [[30, fr('π', 6)], [45, fr('π', 4)], [60, fr('π', 3)], [90, fr('π', 2)], [120, fr('2π', 3)], [135, fr('3π', 4)], [150, fr('5π', 6)], [180, 'π'], [270, fr('3π', 2)], [360, '2π']];
  MB.G[5] = [
    {
      id: 'exponenciales', name: 'Funciones exponenciales',
      gen(L) {
        if (L === 1) {
          const b = pick([2, 3, 4, 5, 10]), e = rnd(0, b === 10 ? 4 : b === 2 ? 8 : b === 3 ? 5 : 4);
          return { q: `Si f(x) = ${b}^(x), ¿cuánto vale f(${e})?`, num: Math.pow(b, e), wrongs: [b * e, Math.pow(b, e + 1), Math.pow(b, Math.max(e - 1, 0)), e * e], explain: `f(${e}) = ${b}^(${e}) = ${Math.pow(b, e)}.` };
        }
        if (L === 2) {
          if (Math.random() < 0.65) {
            const P = pick([100, 200, 500, 1000]), f = pick([2, 3]), t = rnd(2, 5), ans = P * Math.pow(f, t);
            const what = f === 2 ? 'se duplica' : 'se triplica', unit = pick(['hora', 'día']);
            return { q: `Una población de ${P} bacterias ${what} cada ${unit}. ¿Cuántas habrá después de ${t} ${unit === 'hora' ? 'horas' : 'días'}?`, num: ans, wrongs: [P * f * t, P * Math.pow(f, t - 1), P + f * t, P * Math.pow(f, t + 1)], explain: `Cada ${unit} se multiplica por ${f}: ${P} × ${f}^(${t}) = ${P} × ${Math.pow(f, t)} = ${ans}.` };
          }
          const m = pick([5, 10, 25, 50]), t = rnd(2, 5), P = m * Math.pow(2, t);
          return { q: `Una sustancia de ${P} g se reduce a la mitad cada año. ¿Cuántos gramos quedan después de ${t} años?`, num: m, wrongs: [P / t, P - t * 2, P / 2, m * 2], explain: `Cada año se divide entre 2: ${P} ÷ 2^(${t}) = ${P} ÷ ${Math.pow(2, t)} = ${m} g.` };
        }
        const b = pick([2, 3, 5]), x = rnd(2, b === 2 ? 6 : 4), t = rnd(0, 2);
        if (t === 0) return { q: `Resuelve: ${b}^(x) = ${Math.pow(b, x)}`, num: x, wrongs: [Math.pow(b, x) / b, b, x + 1, x - 1], explain: `${Math.pow(b, x)} = ${b}^(${x}), así que x = ${x}.` };
        if (t === 1) { const k = rnd(1, 3); return { q: `Resuelve: ${b}^(x + ${k}) = ${Math.pow(b, x + k)}`, num: x, wrongs: [x + k, x + 2 * k, Math.pow(b, x + k) / b, x - 1], explain: `${Math.pow(b, x + k)} = ${b}^(${x + k}), entonces x + ${k} = ${x + k} y x = ${x}.` }; }
        return { q: `Resuelve: ${b}^(2x) = ${Math.pow(b, 2 * x)}`, num: x, wrongs: [2 * x, x + 1, Math.pow(b, 2 * x) / b, x - 1], explain: `${Math.pow(b, 2 * x)} = ${b}^(${2 * x}), entonces 2x = ${2 * x} y x = ${x}.` };
      }
    },
    {
      id: 'logaritmos', name: 'Logaritmos',
      gen(L) {
        if (L === 1) {
          const b = pick([2, 3, 5, 10]), e = rnd(1, b === 10 ? 4 : b === 2 ? 6 : 3), v = Math.pow(b, e);
          return { q: `Calcula: log_(${b})(${v})`, num: e, wrongs: [b * e, v / b, e + 1, e - 1], explain: `log_(${b})(${v}) = ${e} porque ${b}^(${e}) = ${v}.` };
        }
        if (L === 2) {
          if (Math.random() < 0.55) {
            const b = pick([2, 3, 5]), p = rnd(1, 3); let q; do { q = rnd(1, 3); } while (q === p); const op = pick(['+', '−']), ans = op === '+' ? p + q : p - q;
            return { q: `Calcula: log_(${b})(${Math.pow(b, p)}) ${op} log_(${b})(${Math.pow(b, q)})`, num: ans, wrongs: [op === '+' ? p * q : p + q, Math.pow(b, p) + Math.pow(b, q), ans + 1, Math.abs(ans) + 2], explain: `log_(${b})(${Math.pow(b, p)}) = ${p} y log_(${b})(${Math.pow(b, q)}) = ${q}. Entonces ${p} ${op} ${q} = ${ans}.` };
          }
          const sp = pick([
            ['log_(10)(2) + log_(10)(5)', 1, 'log(2 × 5) = log 10 = 1'],
            ['log_(6)(2) + log_(6)(3)', 1, 'log_(6)(2 × 3) = log_(6)(6) = 1'],
            ['log_(3)(18) − log_(3)(2)', 2, 'log_(3)(18 ÷ 2) = log_(3)(9) = 2'],
            ['log_(2)(48) − log_(2)(3)', 4, 'log_(2)(48 ÷ 3) = log_(2)(16) = 4'],
            ['log_(10)(4) + log_(10)(25)', 2, 'log(4 × 25) = log 100 = 2'],
            ['log_(12)(4) + log_(12)(36)', 2, 'log_(12)(4 × 36) = log_(12)(144) = 2']
          ]);
          return { q: `Calcula: ${sp[0]}`, num: sp[1], wrongs: [sp[1] + 1, sp[1] + 2, sp[1] * 2 + 1, 0], explain: `Usamos las propiedades del logaritmo: ${sp[2]}.` };
        }
        const b = pick([2, 3, 5]), e = rnd(2, b === 2 ? 5 : 3), t = rnd(0, 2);
        if (t === 0) return { q: `Resuelve: log_(${b})(x) = ${e}`, num: Math.pow(b, e), wrongs: [b * e, Math.pow(e, b), e, Math.pow(b, e) + b], explain: `log_(${b})(x) = ${e} significa x = ${b}^(${e}) = ${Math.pow(b, e)}.` };
        if (t === 1) { const k = rnd(1, 5); return { q: `Resuelve: log_(${b})(x + ${k}) = ${e}`, num: Math.pow(b, e) - k, wrongs: [Math.pow(b, e) + k, Math.pow(b, e), b * e - k, e - k], explain: `x + ${k} = ${b}^(${e}) = ${Math.pow(b, e)}, entonces x = ${Math.pow(b, e)} − ${k} = ${Math.pow(b, e) - k}.` }; }
        return { q: `Resuelve: log_(x)(${Math.pow(b, e)}) = ${e}`, num: b, wrongs: [e, Math.pow(b, e), b * e, b + 1], explain: `log_(x)(${Math.pow(b, e)}) = ${e} significa x^(${e}) = ${Math.pow(b, e)}, entonces x = ${b}.` };
      }
    },
    {
      id: 'trigonometria2', name: 'Trigonometría',
      gen(L) {
        if (L === 1) {
          const [deg, rad] = pick(DEG);
          if (Math.random() < 0.5) {
            return { q: `¿A cuántos radianes equivalen ${deg}°?`, ans: rad, wrongs: DEG.map((d) => d[1]).filter((x) => x !== rad), explain: `${deg}° = ${deg} × π ÷ 180 = ${rad} rad.` };
          }
          return { q: `¿A cuántos grados equivalen ${rad} radianes?`, ans: deg + '°', wrongs: DEG.map((d) => d[0] + '°').filter((x) => x !== deg + '°'), explain: `${rad} rad = ${rad} × 180° ÷ π = ${deg}°.` };
        }
        if (L === 2) {
          const t = pick(TRIP), [a, b, c] = Math.random() < 0.5 ? t : [t[1], t[0], t[2]];
          const kind = pick(['sen', 'cos', 'tan']);
          const all = [fr(a, c), fr(b, c), fr(a, b), fr(b, a), fr(c, a), fr(c, b)];
          if (kind === 'sen') return { q: `Si sen θ = ${fr(a, c)} y θ está en el primer cuadrante, ¿cuánto vale cos θ?`, ans: fr(b, c), wrongs: all.filter((x) => x !== fr(b, c)), explain: `sen²θ + cos²θ = 1, entonces cos θ = √(1 − ${a * a}/${c * c}) = √(${b * b}/${c * c}) = ${fr(b, c)}.` };
          if (kind === 'cos') return { q: `Si cos θ = ${fr(b, c)} y θ está en el primer cuadrante, ¿cuánto vale sen θ?`, ans: fr(a, c), wrongs: all.filter((x) => x !== fr(a, c)), explain: `sen²θ + cos²θ = 1, entonces sen θ = √(1 − ${b * b}/${c * c}) = √(${a * a}/${c * c}) = ${fr(a, c)}.` };
          return { q: `Si tan θ = ${fr(a, b)} y θ está en el primer cuadrante, ¿cuánto vale sen θ?`, ans: fr(a, c), wrongs: all.filter((x) => x !== fr(a, c)), explain: `tan θ = ${fr(a, b)} indica un triángulo con catetos ${a} y ${b}; su hipotenusa es ${c}. Entonces sen θ = ${fr(a, c)}.` };
        }
        const S60 = [[3, 8, 7], [5, 8, 7], [7, 15, 13], [8, 15, 13], [5, 21, 19]], S120 = [[3, 5, 7], [7, 8, 13], [5, 16, 19]];
        if (Math.random() < 0.5) {
          const [a, b, c] = pick(S60);
          return { q: `En un triángulo, dos lados miden ${a} cm y ${b} cm, y el ángulo entre ellos mide 60°. ¿Cuánto mide el tercer lado?`, num: c, unit: ' cm', wrongs: [c * c, a + b, round(Math.sqrt(a * a + b * b), 1)], explain: `Ley de cosenos: c² = ${a}² + ${b}² − 2 × ${a} × ${b} × cos 60° = ${a * a} + ${b * b} − ${a * b} = ${c * c}. Entonces c = ${c} cm.` };
        }
        const [a, b, c] = pick(S120);
        return { q: `En un triángulo, dos lados miden ${a} cm y ${b} cm, y el ángulo entre ellos mide 120°. ¿Cuánto mide el tercer lado?`, num: c, unit: ' cm', wrongs: [c * c, a + b, round(Math.sqrt(a * a + b * b - a * b), 1)], explain: `Ley de cosenos: c² = ${a}² + ${b}² − 2 × ${a} × ${b} × cos 120° = ${a * a} + ${b * b} + ${a * b} = ${c * c}. Entonces c = ${c} cm.` };
      }
    },
    {
      id: 'analitica', name: 'Geometría analítica',
      gen(L) {
        if (L === 1) {
          const t = pick(TRIP), k = t[2] <= 13 ? rnd(1, 2) : 1, dx = t[0] * k, dy = t[1] * k, d = t[2] * k;
          const sx = Math.random() < 0.5 ? 1 : -1, sy = Math.random() < 0.5 ? 1 : -1;
          const x1 = rnd(-5, 5), y1 = rnd(-5, 5), x2 = x1 + sx * dx, y2 = y1 + sy * dy;
          return { q: `¿Cuál es la distancia entre los puntos ${xy(x1, y1)} y ${xy(x2, y2)}?`, num: d, wrongs: [dx + dy, d * d, Math.abs(dx - dy)], explain: `d = √[(x₂ − x₁)² + (y₂ − y₁)²] = √[${dx}² + ${dy}²] = √${d * d} = ${d}.` };
        }
        if (L === 2) {
          const x1 = rnd(-8, 8), y1 = rnd(-8, 8); let x2, y2;
          do { x2 = rnd(-8, 8); } while ((x1 + x2) % 2 !== 0 || x2 === x1);
          do { y2 = rnd(-8, 8); } while ((y1 + y2) % 2 !== 0 || y2 === y1);
          const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
          return { q: `¿Cuál es el punto medio entre ${xy(x1, y1)} y ${xy(x2, y2)}?`, ans: xy(mx, my), wrongs: [xy(x1 + x2, y1 + y2), xy((x2 - x1) / 2, (y2 - y1) / 2), xy(my, mx), xy(mx + 1, my)], extras: [xy(mx, my + 1), xy(mx - 1, my), xy(mx + 2, my - 1), xy(mx - 2, my + 1)], explain: `Se promedian las coordenadas: ((${n(x1)} + ${par(x2)}) ÷ 2, (${n(y1)} + ${par(y2)}) ÷ 2) = ${xy(mx, my)}.` };
        }
        if (Math.random() < 0.5) {
          const m = pick([-4, -3, -2, 2, 3, 4, 5]), b = nz(-8, 8);
          const ans = frR(-1, m);
          return { q: `¿Cuál es la pendiente de una recta perpendicular a ${lineStr(m, b)}?`, ans, wrongs: [n(m), n(-m), frR(1, m), frR(m, 1) === n(m) ? frR(1, m + 1) : frR(m, 1)], explain: `Dos rectas perpendiculares cumplen m₁ × m₂ = −1. Entonces m₂ = −1 ÷ ${par(m)} = ${ans}.` };
        }
        const m = nz(-4, 5), x1 = rnd(-4, 4), y1 = rnd(-6, 6), dx = rnd(1, 4), x2 = x1 + dx, y2 = y1 + m * dx, b = y1 - m * x1;
        return { q: `¿Cuál es la ecuación de la recta que pasa por ${xy(x1, y1)} y ${xy(x2, y2)}?`, ans: lineStr(m, b), wrongs: [lineStr(m, y1 + m * x1), lineStr(-m, b), lineStr(m, -b), lineStr(b, m)], extras: [lineStr(m, b + 1), lineStr(m, b - 1), lineStr(m + 1, b), lineStr(m - 1, b)], explain: `m = ${n(y2 - y1)} ÷ ${dx} = ${n(m)}. Luego b = ${n(y1)} − ${par(m)} × ${par(x1)} = ${n(b)}. La recta es ${lineStr(m, b)}.` };
      }
    },
    {
      id: 'sucesiones', name: 'Sucesiones y series',
      gen(L) {
        if (L === 1) {
          if (Math.random() < 0.6) {
            const a = rnd(-5, 10), d = nz(-4, 7), t = [0, 1, 2, 3].map((i) => a + i * d), nx = a + 4 * d;
            return { q: `¿Cuál es el siguiente término de la sucesión ${t.map(n).join(', ')}, …?`, num: nx, wrongs: [nx + 1, nx - 1, nx + d, t[3] * 2 - t[2] + 1], explain: `Es una sucesión aritmética de diferencia ${n(d)}. El siguiente es ${n(t[3])} ${d < 0 ? '−' : '+'} ${Math.abs(d)} = ${n(nx)}.` };
          }
          const a = rnd(1, 5), r = pick([2, 3]), t = [0, 1, 2, 3].map((i) => a * Math.pow(r, i)), nx = a * Math.pow(r, 4);
          return { q: `¿Cuál es el siguiente término de la sucesión ${t.join(', ')}, …?`, num: nx, wrongs: [t[3] + r, t[3] + (t[3] - t[2]), t[3] * (r + 1), nx - 1], explain: `Es una sucesión geométrica de razón ${r}. El siguiente es ${t[3]} × ${r} = ${nx}.` };
        }
        if (L === 2) {
          if (Math.random() < 0.65) {
            const a = rnd(-5, 10), d = nz(-4, 7), N = rnd(10, 30), ans = a + (N - 1) * d;
            return { q: `En la sucesión ${n(a)}, ${n(a + d)}, ${n(a + 2 * d)}, …, ¿cuánto vale el término número ${N}?`, num: ans, wrongs: [a + N * d, a + (N + 1) * d, N * d, a + (N - 2) * d], explain: `aₙ = a₁ + (n − 1)d = ${n(a)} + ${N - 1} × ${par(d)} = ${n(ans)}.` };
          }
          const a = rnd(1, 3), N = rnd(5, 8), ans = a * Math.pow(2, N - 1);
          return { q: `En la sucesión ${a}, ${2 * a}, ${4 * a}, …, ¿cuánto vale el término número ${N}?`, num: ans, wrongs: [a * Math.pow(2, N), a * 2 * N, a * Math.pow(2, N - 2), a + (N - 1) * a], explain: `aₙ = a₁ × r^(n−1) = ${a} × 2^(${N - 1}) = ${ans}.` };
        }
        if (Math.random() < 0.6) {
          const a = rnd(1, 8), d = rnd(1, 6), N = rnd(8, 20), an = a + (N - 1) * d, S = (N * (a + an)) / 2;
          return { q: `Calcula la suma de los primeros ${N} términos de la sucesión ${a}, ${a + d}, ${a + 2 * d}, …`, num: S, wrongs: [an, N * an, S + N, (N * (a + an)) / 2 - an], explain: `aₙ = ${a} + ${N - 1} × ${d} = ${an}. Sₙ = n(a₁ + aₙ) ÷ 2 = ${N} × ${a + an} ÷ 2 = ${S}.` };
        }
        const a = rnd(1, 3), N = rnd(4, 8), S = a * (Math.pow(2, N) - 1);
        return { q: `Calcula la suma de los primeros ${N} términos de la sucesión ${a}, ${2 * a}, ${4 * a}, …`, num: S, wrongs: [a * Math.pow(2, N), a * Math.pow(2, N - 1), a * N * 2, S + a], explain: `Es geométrica de razón 2: Sₙ = a₁ × (rⁿ − 1) ÷ (r − 1) = ${a} × (2^(${N}) − 1) ÷ 1 = ${S}.` };
      }
    }
  ];

  /* ===================== 6to de Secundaria ===================== */
  MB.G[6] = [
    {
      id: 'conicas', name: 'Circunferencia y parábola',
      gen(L) {
        if (L === 1) {
          if (Math.random() < 0.5) {
            const r = rnd(2, 12);
            return { q: `¿Cuál es el radio de la circunferencia x^(2) + y^(2) = ${r * r}?`, num: r, wrongs: [r * r, r / 2, 2 * r, r + 1], explain: `x² + y² = r², entonces r = √${r * r} = ${r}.` };
          }
          const h = nz(-6, 6), k = nz(-6, 6), r = rnd(2, 9);
          return { q: `¿Cuál es el radio de la circunferencia (x ${sg(-h)} ${Math.abs(h)})^(2) + (y ${sg(-k)} ${Math.abs(k)})^(2) = ${r * r}?`, num: r, wrongs: [r * r, r / 2, Math.abs(h) + Math.abs(k), 2 * r], explain: `(x − h)² + (y − k)² = r², entonces r = √${r * r} = ${r}.` };
        }
        if (L === 2) {
          if (Math.random() < 0.6) {
            const h = nz(-6, 6), k = nz(-6, 6), r = rnd(2, 9);
            return { q: `¿Cuál es el centro de la circunferencia (x ${sg(-h)} ${Math.abs(h)})^(2) + (y ${sg(-k)} ${Math.abs(k)})^(2) = ${r * r}?`, ans: xy(h, k), wrongs: [xy(-h, -k), xy(-h, k), xy(h, -k), xy(k, h)], explain: `En (x − h)² + (y − k)² = r², el centro es (h, k). Cuidado con los signos: (x + 3) equivale a h = −3.` };
          }
          const p = rnd(1, 5);
          return { q: `¿Cuál es el foco de la parábola y^(2) = ${4 * p}x?`, ans: xy(p, 0), wrongs: [xy(4 * p, 0), xy(0, p), xy(-p, 0), xy(2 * p, 0)], explain: `y² = 4px tiene foco en (p, 0). Aquí 4p = ${4 * p}, entonces p = ${p} y el foco es ${xy(p, 0)}.` };
        }
        const h = nz(-5, 5), k = nz(-5, 5), r = rnd(2, 8), D = -2 * h, E = -2 * k, F = h * h + k * k - r * r;
        const eq = termsStr([[1, 'x^(2)'], [1, 'y^(2)'], [D, 'x'], [E, 'y'], [F, '']]) + ' = 0';
        if (Math.random() < 0.5) {
          return { q: `¿Cuál es el radio de la circunferencia ${eq}?`, num: r, wrongs: [r * r, Math.abs(F), h * h + k * k, r + 1], explain: `Completando cuadrados queda (x ${sg(-h)} ${Math.abs(h)})² + (y ${sg(-k)} ${Math.abs(k)})² = ${r * r}. Entonces r = √${r * r} = ${r}.` };
        }
        return { q: `¿Cuál es el centro de la circunferencia ${eq}?`, ans: xy(h, k), wrongs: [xy(-h, -k), xy(D, E), xy(h, -k), xy(-h, k)], explain: `El centro es (−D/2, −E/2) = (${n(-D / 2)}, ${n(-E / 2)}).` };
      }
    },
    {
      id: 'limites', name: 'Límites',
      gen(L) {
        if (L === 1) {
          const c2 = nz(-3, 4), c1 = nz(-6, 6), c0 = nz(-9, 9), a = nz(-4, 5), ans = c2 * a * a + c1 * a + c0;
          return { q: `Calcula: lim_(x→${n(a)}) (${polyStr([c2, c1, c0])})`, num: ans, wrongs: [c2 * a * a - c1 * a + c0, c2 * a * a + c1 * a - c0, 2 * c2 * a + c1], explain: `Como la función es un polinomio, se sustituye x = ${n(a)}: ${c2} × ${par(a)}² + ${par(c1)} × ${par(a)} + ${par(c0)} = ${n(ans)}.` };
        }
        if (L === 2) {
          if (Math.random() < 0.5) {
            const a = nz(-6, 7);
            return { q: `Calcula: lim_(x→${n(a)}) ${fr(`x^(2) − ${a * a}`, `x ${sg(-a)} ${Math.abs(a)}`)}`, num: 2 * a, wrongs: [a, a * a, 0, 'No existe'], explain: `Factorizamos x² − ${a * a} = (x − ${par(a)})(x + ${par(a)}) y simplificamos: el límite es ${n(a)} + ${par(a)} = ${n(2 * a)}.` };
          }
          let a, b; do { a = nz(-6, 6); b = nz(-6, 6); } while (a === b);
          return { q: `Calcula: lim_(x→${n(a)}) ${fr(polyStr([1, -(a + b), a * b]), `x ${sg(-a)} ${Math.abs(a)}`)}`, num: a - b, wrongs: [b - a, a + b, 0, 'No existe'], explain: `El numerador se factoriza como (x − ${par(a)})(x − ${par(b)}). Al simplificar queda x − ${par(b)}, que en x = ${n(a)} vale ${n(a - b)}.` };
        }
        const dn = rnd(1, 2), dd = rnd(1, 2), cn = Array.from({ length: dn + 1 }, (_, i) => (i === 0 ? rnd(1, 7) : rnd(-5, 5))), cd = Array.from({ length: dd + 1 }, (_, i) => (i === 0 ? rnd(1, 7) : rnd(-5, 5)));
        const a = cn[0], c = cd[0];
        const ans = dn === dd ? frR(a, c) : dn < dd ? '0' : '∞';
        const pool = ['0', '∞', '1', frR(c, a), frR(a, c), 'No existe'];
        return { q: `Calcula: lim_(x→∞) ${fr(polyStr(cn), polyStr(cd))}`, ans, wrongs: pool.filter((x) => x !== ans), explain: dn === dd ? `Los grados son iguales: el límite es el cociente de los coeficientes principales, ${fr(a, c)}${ans !== fr(a, c) ? ' = ' + ans : ''}.` : dn < dd ? 'El grado del denominador es mayor, por eso el cociente tiende a 0.' : 'El grado del numerador es mayor, por eso el cociente crece sin límite (∞).' };
      }
    },
    {
      id: 'derivadas', name: 'Derivadas',
      gen(L) {
        if (L === 1) {
          const c = rnd(2, 9), d = rnd(2, 5);
          return { q: `Deriva: f(x) = ${mono(c, d)}`, ans: mono(c * d, d - 1), wrongs: [mono(c, d - 1), mono(c * d, d), mono(d, d - 1), mono(c * (d - 1), d - 1)], extras: [mono(c * d, d - 2), mono(c * d + c, d - 1), mono(c * d - 1, d - 1), mono(c + d, d - 1)], explain: `Regla de la potencia: (c·xⁿ)′ = c·n·xⁿ⁻¹. Aquí: ${c} × ${d} = ${c * d} y el exponente baja a ${d - 1}. Resultado: ${mono(c * d, d - 1)}.` };
        }
        const mk = () => {
          const deg = rnd(3, 4), co = [nz(-6, 6)]; for (let i = 1; i <= deg; i++) co.push(rnd(-7, 7));
          co[deg] = nz(-9, 9);
          return co;
        };
        const deriv = (co) => { const deg = co.length - 1; return co.slice(0, deg).map((c, i) => c * (deg - i)); };
        if (L === 2) {
          const co = mk(), D = deriv(co), deg = co.length - 1;
          const W1 = D.slice(); W1[W1.length - 1] += co[deg];
          const W2 = D.slice(); W2[0] = co[0] * (deg - 1);
          const W3 = D.slice(); W3[1] = W3[1] === 0 ? 1 : -W3[1];
          const W4 = D.map((c) => c + 1);
          return { q: `Deriva: f(x) = ${polyStr(co)}`, ans: polyStr(D), wrongs: [polyStr(W1), polyStr(W2), polyStr(W3), polyStr(W4)], explain: `Derivamos término a término con la regla de la potencia. La derivada de una constante es 0. Resultado: ${polyStr(D)}.` };
        }
        if (Math.random() < 0.75) {
          const co = mk(), D = deriv(co), a = rnd(-2, 3);
          const ev = (cs, x) => cs.reduce((s, c) => s * x + c, 0);
          const ans = ev(D, a);
          return { q: `Si f(x) = ${polyStr(co)}, ¿cuánto vale f′(${n(a)})?`, num: ans, wrongs: [ev(co, a), ev(D, -a), ev(D.slice(0, -1).concat([0]), a)], explain: `f′(x) = ${polyStr(D)}. Sustituimos x = ${n(a)}: f′(${n(a)}) = ${n(ans)}.` };
        }
        const a = nz(-5, 6);
        return { q: `¿Cuál es la pendiente de la recta tangente a f(x) = x^(2) en el punto donde x = ${n(a)}?`, num: 2 * a, wrongs: [a * a, a, -2 * a, 2], explain: `f′(x) = 2x. La pendiente en x = ${n(a)} es 2 × ${par(a)} = ${n(2 * a)}.` };
      }
    },
    {
      id: 'combinatoria', name: 'Combinatoria y probabilidad',
      gen(L) {
        if (L === 1) {
          if (Math.random() < 0.5) {
            const m = rnd(3, 7);
            return { q: `¿Cuánto es ${m}!?`, num: fact(m), wrongs: [m * m, m * (m - 1), fact(m + 1), fact(m - 1)], explain: `${m}! = ${Array.from({ length: m }, (_, i) => m - i).join(' × ')} = ${fact(m)}.` };
          }
          const m = rnd(5, 9), k = m - rnd(2, 3), ans = fact(m) / fact(k);
          return { q: `¿Cuánto es ${m}! ÷ ${k}!?`, num: ans, wrongs: [m - k, fact(m - k), ans + m, m * k], explain: `${m}! ÷ ${k}! = ${Array.from({ length: m - k }, (_, i) => m - i).join(' × ')} = ${ans}.` };
        }
        if (L === 2) {
          const t = rnd(0, 2);
          if (t === 0) { const N = rnd(5, 9), K = rnd(2, 3); return { q: `En un grupo de ${N} estudiantes se debe elegir un comité de ${K} personas (sin importar el orden). ¿De cuántas formas se puede hacer?`, num: comb(N, K), wrongs: [perm(N, K), N * K, Math.pow(N, K), comb(N, K) + N], explain: `Como el orden no importa, usamos combinaciones: C(${N}, ${K}) = ${comb(N, K)}.` }; }
          if (t === 1) { const N = rnd(5, 8), K = rnd(2, 3); return { q: `¿De cuántas maneras se pueden ordenar ${K} libros, escogidos entre ${N} distintos, en un estante?`, num: perm(N, K), wrongs: [comb(N, K), N * K, Math.pow(N, K), perm(N, K) - N], explain: `Como el orden sí importa, usamos permutaciones: P(${N}, ${K}) = ${perm(N, K)}.` }; }
          const N = rnd(3, 6); return { q: `¿De cuántas maneras pueden sentarse ${N} personas en una fila de ${N} sillas?`, num: fact(N), wrongs: [N * N, 2 * N, fact(N - 1), fact(N + 1)], explain: `${N}! = ${fact(N)} maneras.` };
        }
        if (Math.random() < 0.5) {
          const N = rnd(3, 5), K = rnd(1, N - 1), cnt = comb(N, K), tot = Math.pow(2, N);
          return { q: `Se lanza una moneda ${N} veces. ¿Cuál es la probabilidad de obtener exactamente ${K} cara${K === 1 ? '' : 's'}?`, ans: frR(cnt, tot), wrongs: [frR(1, tot), frR(K, N), frR(cnt, 2 * N), frR(cnt + 1, tot), frR(cnt, tot / 2)], explain: `Hay C(${N}, ${K}) = ${cnt} formas favorables entre ${tot} posibles: ${fr(cnt, tot)}${frR(cnt, tot) !== fr(cnt, tot) ? ' = ' + frR(cnt, tot) : ''}.` };
        }
        let A, B, both, T;
        do { T = 10 * rnd(2, 6); A = rnd(8, T - 4); B = rnd(8, T - 4); both = rnd(2, Math.min(A, B) - 1); } while (A + B - both > T || both >= B || both >= A);
        const ans = frR(both, B);
        return { q: `En un grupo de ${T} estudiantes, ${A} estudian inglés, ${B} estudian francés y ${both} estudian ambos idiomas. Si se elige un estudiante de francés, ¿cuál es la probabilidad de que también estudie inglés?`, ans, wrongs: [frR(both, T), frR(both, A), frR(A, T), frR(B, T)], extras: [frR(both, B + 1), frR(both + 1, B), frR(B - both, B), frR(both, T + 1)], explain: `Es probabilidad condicional: P(inglés | francés) = ${fr(both, B)}${ans !== fr(both, B) ? ' = ' + ans : ''} (de los ${B} de francés, ${both} también estudian inglés).` };
      }
    },
    {
      id: 'estadistica2', name: 'Estadística avanzada',
      gen(L) {
        if (L === 1) {
          const mu = 5 * rnd(10, 20), sd = pick([2, 4, 5, 10]), z = nz(-3, 3), x = mu + z * sd;
          return { q: `En un examen la media es ${mu} y la desviación estándar es ${sd}. Una estudiante obtuvo ${x}. ¿Cuál es su puntaje z?`, num: z, wrongs: [-z, x - mu, round(sd / (x - mu || 1), 2), z + 1], explain: `z = (x − μ) ÷ σ = (${x} − ${mu}) ÷ ${sd} = ${n(z)}.` };
        }
        const k = rnd(2, 4), m = rnd(8, 40), s = rnd(1, 5);
        const data = shuffle([].concat(Array(k).fill(m - s), Array(k).fill(m + s))), N = 2 * k;
        if (L === 2) {
          return { q: `Calcula la varianza poblacional de los datos: ${data.join(', ')}`, num: s * s, wrongs: [s, 2 * s * s, round((N * s * s) / (N - 1), 2), m], explain: `Media = ${m}. Cada dato se aparta ${s} de la media, así que cada (xᵢ − μ)² = ${s * s}. Varianza = ${N * s * s} ÷ ${N} = ${s * s}.` };
        }
        return { q: `Calcula la desviación estándar poblacional de los datos: ${data.join(', ')}`, num: s, wrongs: [s * s, round(Math.sqrt((N * s * s) / (N - 1)), 2), m, 2 * s], explain: `Media = ${m}. Cada dato se aparta ${s} de la media; varianza = ${s * s}. La desviación estándar es √${s * s} = ${s}.` };
      }
    }
  ];
})(typeof window !== 'undefined' ? window : globalThis);
