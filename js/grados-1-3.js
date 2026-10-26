/* Math Arena - temas y generadores de preguntas: 1ro, 2do y 3ro de Secundaria */
(function (root) {
  'use strict';
  const MB = root.MathBank;
  const { rnd, pick, shuffle, gcd, round, n, par, sg, fr, frR, termsStr, polyStr, mono } = MB.u;
  const nz = (a, b) => { let x; do { x = rnd(a, b); } while (x === 0); return x; };
  const comb = (N, K) => { let r = 1; for (let i = 1; i <= K; i++) r = (r * (N - K + i)) / i; return Math.round(r); };
  const TRIP = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25]];
  const pickTrip = () => {
    const t = pick(TRIP);
    const k = t[2] <= 13 ? rnd(1, 3) : 1;
    return [t[0] * k, t[1] * k, t[2] * k];
  };

  /* ===================== 1ro de Secundaria ===================== */
  MB.G[1] = [
    {
      id: 'enteros', name: 'Números enteros',
      gen(L) {
        if (L === 1) {
          const a = nz(-9, 9), b = nz(-9, 9), ans = a + b;
          return {
            q: `¿Cuánto es ${par(a)} + ${par(b)}?`, num: ans,
            wrongs: [-ans, Math.abs(a) + Math.abs(b), a - b],
            explain: `${par(a)} + ${par(b)} = ${n(ans)}. Con signos iguales se suman y se deja el signo; con signos distintos se restan y se deja el signo del número de mayor valor absoluto.`
          };
        }
        if (L === 2) {
          const a = nz(-12, 12), b = nz(-12, 12);
          if (Math.random() < 0.5) {
            const ans = a * b;
            return {
              q: `¿Cuánto es ${par(a)} × ${par(b)}?`, num: ans,
              wrongs: [-ans, a + b, ans + a],
              explain: `${par(a)} × ${par(b)} = ${n(ans)}. Signos iguales dan positivo; signos distintos dan negativo.`
            };
          }
          const t = b, d = nz(-12, 12), dividend = d * t;
          return {
            q: `¿Cuánto es ${n(dividend)} ÷ ${par(d)}?`, num: t,
            wrongs: [-t, t + d, dividend - d],
            explain: `${n(dividend)} ÷ ${par(d)} = ${n(t)}. Signos iguales dan positivo; signos distintos dan negativo.`
          };
        }
        const a = rnd(-9, 9), b = rnd(2, 9), c = pick([-5, -4, -3, -2, 2, 3, 4, 5]), d = rnd(1, 9), e = rnd(2, 5);
        const ans = a + b * c - d;
        return {
          q: `Calcula: ${n(a)} + ${b} × ${par(c)} − ${d * e} ÷ ${e}`, num: ans,
          wrongs: [(a + b) * c - d, a + b * c + d, a + b * c - d * e],
          explain: `Primero × y ÷: ${b} × ${par(c)} = ${n(b * c)} y ${d * e} ÷ ${e} = ${d}. Luego: ${n(a)} + ${par(b * c)} − ${d} = ${n(ans)}.`
        };
      }
    },
    {
      id: 'fracciones', name: 'Fracciones',
      gen(L) {
        if (L === 1) {
          let a, b;
          do { b = rnd(3, 12); a = rnd(1, b - 1); } while (gcd(a, b) !== 1);
          const k = rnd(2, 6);
          return {
            q: `Simplifica la fracción ${fr(a * k, b * k)}`, ans: fr(a, b),
            wrongs: [fr(b, a), fr(a + 1, b), fr(a * k, b), fr(a, b * k), fr(a + k, b + k)],
            explain: `Dividimos numerador y denominador entre ${k}: ${fr(a * k, b * k)} = ${fr(a, b)}.`
          };
        }
        if (L === 2) {
          const b = pick([2, 3, 4, 5, 6, 8, 10]), a = rnd(1, b - 1), N = b * rnd(2, 12), ans = (N / b) * a;
          return {
            q: `¿Cuánto es ${fr(a, b)} de ${N}?`, num: ans,
            wrongs: [N / b, N * a, N - a],
            explain: `Dividimos ${N} entre ${b} (${N / b}) y multiplicamos por ${a}: ${n(ans)}.`
          };
        }
        let b, d;
        do { b = pick([2, 3, 4, 5, 6]); d = pick([2, 3, 4, 5, 6]); } while (b === d);
        const a = rnd(1, b - 1), c = rnd(1, d - 1), num = a * d + c * b, den = b * d, ans = frR(num, den);
        const wr = [fr(a + c, b + d), fr(a + c, b * d), frR(Math.abs(a * d - c * b) || 1, den), frR(den, num)];
        if (fr(num, den) !== ans) wr.push(fr(num, den));
        return {
          q: `Calcula ${fr(a, b)} + ${fr(c, d)} (resultado simplificado)`, ans, wrongs: wr,
          explain: `Denominador común ${den}: ${fr(a * d, den)} + ${fr(c * b, den)} = ${fr(num, den)}${fr(num, den) !== ans ? ' = ' + ans : ''}.`
        };
      }
    },
    {
      id: 'decimales', name: 'Decimales y porcentajes',
      gen(L) {
        if (L === 1) {
          let a = rnd(11, 99) / 10, b = rnd(11, 99) / 10;
          if (Math.random() < 0.5) {
            const ans = round(a + b, 1);
            return { q: `Calcula ${n(a)} + ${n(b)}`, num: ans, step: 0.1, wrongs: [round(ans + 1, 1), round(ans - 1, 1), round(ans + 0.1, 1)], explain: `Alineamos las comas y sumamos: ${n(a)} + ${n(b)} = ${n(ans)}.` };
          }
          if (a === b) b = round(b + 0.1, 1);
          const hi = Math.max(a, b), lo = Math.min(a, b), ans = round(hi - lo, 1);
          return { q: `Calcula ${n(hi)} − ${n(lo)}`, num: ans, step: 0.1, wrongs: [round(ans + 1, 1), round(ans - 1, 1), round(hi + lo, 1)], explain: `Alineamos las comas y restamos: ${n(hi)} − ${n(lo)} = ${n(ans)}.` };
        }
        if (L === 2) {
          if (Math.random() < 0.5) {
            const x = rnd(2, 9), y = rnd(2, 9), ans = (x * y) / 100;
            return {
              q: `¿Cuánto es ${n(x / 10)} × ${n(y / 10)}?`, num: ans,
              wrongs: [(x * y) / 10, x * y, (x * y) / 1000],
              explain: `${x} × ${y} = ${x * y}. Cada factor tiene un decimal, así que el resultado lleva dos: ${n(ans)}.`
            };
          }
          const a = rnd(2, 9), b = rnd(11, 59) / 10, ans = round(a * b, 1);
          return {
            q: `¿Cuánto es ${a} × ${n(b)}?`, num: ans, step: 0.1,
            wrongs: [round(ans * 10, 1), round(ans / 10, 2), round(ans + a, 1)],
            explain: `${a} × ${n(b)} = ${n(ans)}.`
          };
        }
        const pct = pick([5, 10, 15, 20, 25, 30, 40, 50, 60, 75]), N = 20 * rnd(2, 25), ans = (N * pct) / 100;
        return {
          q: `¿Cuánto es el ${pct}% de ${N}?`, num: ans,
          wrongs: [(N * pct) / 10, N - ans, N / pct],
          explain: `${pct}% de ${N} = ${N} × ${pct} ÷ 100 = ${n(ans)}.`
        };
      }
    },
    {
      id: 'geometria', name: 'Perímetro y área',
      gen(L) {
        if (L === 1) {
          let b, h;
          do { b = rnd(3, 15); h = rnd(2, 12); } while (b === h);
          if (Math.random() < 0.5) {
            return { q: `Un rectángulo mide ${b} cm de largo y ${h} cm de ancho. ¿Cuál es su área?`, num: b * h, unit: ' cm²', wrongs: [2 * (b + h), b + h, 2 * b + h], explain: `Área = largo × ancho = ${b} × ${h} = ${b * h} cm².` };
          }
          return { q: `Un rectángulo mide ${b} cm de largo y ${h} cm de ancho. ¿Cuál es su perímetro?`, num: 2 * (b + h), unit: ' cm', wrongs: [b * h, b + h, 2 * b + h], explain: `Perímetro = 2 × (${b} + ${h}) = ${2 * (b + h)} cm.` };
        }
        if (L === 2) {
          if (Math.random() < 0.5) {
            const b = 2 * rnd(2, 9), h = rnd(3, 12);
            return { q: `Un triángulo tiene ${b} cm de base y ${h} cm de altura. ¿Cuál es su área?`, num: (b * h) / 2, unit: ' cm²', wrongs: [b * h, b + h, (b + h) / 2], explain: `Área = base × altura ÷ 2 = ${b} × ${h} ÷ 2 = ${(b * h) / 2} cm².` };
          }
          const s = rnd(3, 12);
          return { q: `Un cuadrado tiene un área de ${s * s} cm². ¿Cuál es su perímetro?`, num: 4 * s, unit: ' cm', wrongs: [2 * s, s, 8 * s], explain: `El lado mide √${s * s} = ${s} cm, así que el perímetro es 4 × ${s} = ${4 * s} cm.` };
        }
        const t = rnd(0, 2);
        if (t === 0) {
          const r = rnd(2, 10), ans = round(3.14 * r * r, 2);
          return { q: `Un círculo tiene radio de ${r} cm. ¿Cuál es su área? (usa π = 3.14)`, num: ans, unit: ' cm²', wrongs: [round(6.28 * r, 2), round(12.56 * r * r, 2), round(3.14 * r, 2)], explain: `Área = π × r² = 3.14 × ${r}² = ${n(ans)} cm².` };
        }
        if (t === 1) {
          const r = rnd(2, 10), ans = round(6.28 * r, 2);
          return { q: `Un círculo tiene radio de ${r} cm. ¿Cuál es su circunferencia? (usa π = 3.14)`, num: ans, unit: ' cm', wrongs: [round(3.14 * r * r, 2), round(3.14 * r, 2), round(6.28 * r * r, 2)], explain: `Circunferencia = 2 × π × r = 2 × 3.14 × ${r} = ${n(ans)} cm.` };
        }
        const b = rnd(8, 14), h = rnd(6, 10), s = rnd(2, 4), ans = b * h - s * s;
        return { q: `Un terreno rectangular de ${b} m × ${h} m tiene una zona cuadrada de ${s} m de lado donde no se puede sembrar. ¿Cuántos m² se pueden sembrar?`, num: ans, unit: ' m²', wrongs: [b * h, b * h + s * s, b * h - 4 * s], explain: `Área total ${b} × ${h} = ${b * h}. Zona sin sembrar ${s} × ${s} = ${s * s}. Se siembran ${b * h} − ${s * s} = ${ans} m².` };
      }
    },
    {
      id: 'ecuaciones', name: 'Ecuaciones simples',
      gen(L) {
        if (L === 1) {
          const x = rnd(1, 20), a = rnd(1, 15);
          if (Math.random() < 0.5) {
            return { q: `Resuelve: x + ${a} = ${x + a}`, num: x, wrongs: [x + 2 * a, x - a, x + 1, x - 1], explain: `Restamos ${a} a ambos lados: x = ${x + a} − ${a} = ${x}.` };
          }
          return { q: `Resuelve: x − ${a} = ${x - a}`, num: x, wrongs: [x - 2 * a, x + a, x + 1, x - 1], explain: `Sumamos ${a} a ambos lados: x = ${n(x - a)} + ${a} = ${x}.` };
        }
        if (L === 2) {
          if (Math.random() < 0.5) {
            const x = rnd(2, 12), a = rnd(2, 9), b = a * x;
            return { q: `Resuelve: ${a}x = ${b}`, num: x, wrongs: [b - a, b * a, x + a], explain: `x = ${b} ÷ ${a} = ${x}.` };
          }
          const a = rnd(2, 9), b = rnd(2, 9), x = a * b;
          return { q: `Resuelve: ${fr('x', a)} = ${b}`, num: x, wrongs: [b - a, b / a, a + b], explain: `x = ${b} × ${a} = ${x}.` };
        }
        const x = nz(-6, 10), a = rnd(2, 6), b = nz(-12, 12), c = a * x + b;
        return {
          q: `Resuelve: ${termsStr([[a, 'x'], [b, '']])} = ${n(c)}`, num: x,
          wrongs: [c - b, round((c + b) / a, 2), -x],
          explain: `${a}x = ${n(c)} ${b < 0 ? '+' : '−'} ${Math.abs(b)} = ${n(c - b)}, entonces x = ${n(c - b)} ÷ ${a} = ${n(x)}.`
        };
      }
    }
  ];

  /* ===================== 2do de Secundaria ===================== */
  const ITEMS = ['cuadernos', 'lápices', 'botellas de agua', 'panes', 'mangos', 'libros'];
  MB.G[2] = [
    {
      id: 'potencias', name: 'Potencias y raíces',
      gen(L) {
        if (L === 1) {
          if (Math.random() < 0.5) {
            const a = rnd(2, 15);
            return { q: `¿Cuánto es ${a}^(2)?`, num: a * a, wrongs: [a * 2, a * a + a, (a + 1) * (a + 1)], explain: `${a}^(2) = ${a} × ${a} = ${a * a}.` };
          }
          const r = rnd(2, 15);
          return { q: `¿Cuánto es √${r * r}?`, num: r, wrongs: [r * 2, (r * r) / 2, r + 1], explain: `√${r * r} = ${r} porque ${r} × ${r} = ${r * r}.` };
        }
        if (L === 2) {
          const t = rnd(0, 2);
          if (t === 0) {
            const b = pick([2, 3, 5]), cap = b === 2 ? 7 : b === 3 ? 5 : 4, e1 = rnd(1, cap - 1), e2 = rnd(1, cap - e1), ans = Math.pow(b, e1 + e2);
            return { q: `Calcula: ${b}^(${e1}) × ${b}^(${e2})`, num: ans, wrongs: [Math.pow(b, e1 * e2), b * (e1 + e2), Math.pow(b, e1) + Math.pow(b, e2)], explain: `Con igual base se suman los exponentes: ${b}^(${e1 + e2}) = ${ans}.` };
          }
          if (t === 1) {
            const a = rnd(2, 9);
            if (Math.random() < 0.5) return { q: `¿Cuánto es (−${a})^(2)?`, num: a * a, wrongs: [-a * a, 2 * a, -2 * a], explain: `El paréntesis eleva al cuadrado el −${a}: (−${a}) × (−${a}) = ${a * a}.` };
            return { q: `¿Cuánto es −${a}^(2)?`, num: -a * a, wrongs: [a * a, 2 * a, -2 * a], explain: `Aquí solo el ${a} está al cuadrado: ${a * a}, y luego se le pone el signo menos: −${a * a}.` };
          }
          const b = pick([2, 3]), e1 = rnd(2, b === 2 ? 3 : 2), e2 = rnd(2, b === 2 ? 3 : 2), ans = Math.pow(b, e1 * e2);
          return { q: `Calcula: (${b}^(${e1}))^(${e2})`, num: ans, wrongs: [Math.pow(b, e1 + e2), Math.pow(b, e1) * e2, b * e1 * e2], explain: `Potencia de potencia: se multiplican los exponentes, ${b}^(${e1 * e2}) = ${ans}.` };
        }
        const p = rnd(2, 12), q = rnd(2, 9), r = rnd(2, 5), ans = p + q * q - r * r * r;
        return { q: `Calcula: √${p * p} + ${q}^(2) − ${r}^(3)`, num: ans, wrongs: [p + q * 2 - r * 3, p - q * q + r * r * r, p + q * q + r * r * r], explain: `√${p * p} = ${p}, ${q}^(2) = ${q * q}, ${r}^(3) = ${r * r * r}. Entonces ${p} + ${q * q} − ${r * r * r} = ${n(ans)}.` };
      }
    },
    {
      id: 'razones', name: 'Razones, proporciones y porcentajes',
      gen(L) {
        if (L === 1) {
          const u = pick([10, 15, 20, 25, 30, 40, 50, 60]), a = rnd(2, 6), b = a + rnd(1, 6), item = pick(ITEMS);
          return { q: `Si ${a} ${item} cuestan RD$ ${a * u}, ¿cuánto cuestan ${b} ${item}?`, num: b * u, wrongs: [a * u + (b - a), b * u - a, (b + 1) * u], explain: `Cada uno cuesta ${a * u} ÷ ${a} = ${u}. Entonces ${b} cuestan ${b} × ${u} = RD$ ${b * u}.` };
        }
        if (L === 2) {
          const p = rnd(2, 9), q = rnd(2, 9), k = rnd(2, 9), ans = p * k;
          return { q: `Calcula el valor de x en la proporción ${fr(p, q)} = ${fr('x', q * k)}`, num: ans, wrongs: [p + k, q * k - p, p * q], explain: `${q * k} es ${q} × ${k}, así que el numerador también se multiplica por ${k}: x = ${p} × ${k} = ${ans}.` };
        }
        const t = rnd(0, 2);
        if (t === 0) {
          const P = 100 * rnd(2, 20), d = pick([10, 15, 20, 25, 30, 40, 50]), ans = P - (P * d) / 100;
          return { q: `Un artículo cuesta RD$ ${P} y tiene un ${d}% de descuento. ¿Cuál es el precio final?`, num: ans, wrongs: [(P * d) / 100, P + (P * d) / 100, P - d], explain: `Descuento: ${P} × ${d} ÷ 100 = ${(P * d) / 100}. Precio final: ${P} − ${(P * d) / 100} = RD$ ${ans}.` };
        }
        if (t === 1) {
          const P = 50 * rnd(2, 20), ans = P + (P * 18) / 100;
          return { q: `Un producto cuesta RD$ ${P} sin ITBIS. Si el ITBIS es 18%, ¿cuál es el precio con ITBIS?`, num: ans, wrongs: [(P * 18) / 100, P + 18, P - (P * 18) / 100], explain: `ITBIS: ${P} × 18 ÷ 100 = ${(P * 18) / 100}. Total: ${P} + ${(P * 18) / 100} = RD$ ${ans}.` };
        }
        const b = pick([3, 4, 6, 8, 9, 12]), x = rnd(2, 10), T = b * x;
        const divs = []; for (let i = 2; i <= 24; i++) if (T % i === 0 && i !== b) divs.push(i);
        const a = pick(divs), d = T / a;
        return { q: `${a} obreros terminan una obra en ${d} días. ¿En cuántos días la terminarían ${b} obreros trabajando al mismo ritmo?`, num: x, wrongs: [(d * b) / a, d + b - a, d - b + a], explain: `A más obreros, menos días (proporción inversa). Trabajo total: ${a} × ${d} = ${T}. Con ${b} obreros: ${T} ÷ ${b} = ${x} días.` };
      }
    },
    {
      id: 'ecuaciones1', name: 'Ecuaciones de primer grado',
      gen(L) {
        if (L === 1) {
          const a = rnd(2, 6), t = nz(-5, 9), b = nz(-9, 9), c = t + b;
          return { q: `Resuelve: ${fr('x', a)} ${sg(b)} ${Math.abs(b)} = ${n(c)}`, num: a * t, wrongs: [c - b, a * c - b, a * (c + b)], explain: `${fr('x', a)} = ${n(c)} ${b < 0 ? '+' : '−'} ${Math.abs(b)} = ${n(t)}. Entonces x = ${n(t)} × ${a} = ${n(a * t)}.` };
        }
        if (L === 2) {
          const x = rnd(-6, 10), a = rnd(3, 9), c = rnd(1, a - 1), b = rnd(-10, 10), d = (a - c) * x + b;
          return { q: `Resuelve: ${termsStr([[a, 'x'], [b, '']])} = ${termsStr([[c, 'x'], [d, '']])}`, num: x, wrongs: [round((d - b) / (a + c), 2), -x, round((d + b) / (a - c), 2)], explain: `Pasamos las x a un lado y los números al otro: ${a - c}x = ${n(d)} ${b < 0 ? '+' : '−'} ${Math.abs(b)} = ${n(d - b)}. Entonces x = ${n(x)}.` };
        }
        const x = rnd(-6, 9), a = rnd(2, 6), b = nz(-6, 6), c = a * (x + b);
        return { q: `Resuelve: ${a}(x ${sg(b)} ${Math.abs(b)}) = ${n(c)}`, num: x, wrongs: [c / a + b, c - b, round((c - b) / a, 2)], explain: `Dividimos entre ${a}: x ${sg(b)} ${Math.abs(b)} = ${n(c / a)}. Entonces x = ${n(c / a)} ${b < 0 ? '+' : '−'} ${Math.abs(b)} = ${n(x)}.` };
      }
    },
    {
      id: 'angulos', name: 'Ángulos y triángulos',
      gen(L) {
        if (L === 1) {
          if (Math.random() < 0.5) {
            const a = rnd(10, 80);
            return { q: `¿Cuánto mide el ángulo complementario de ${a}°?`, num: 90 - a, unit: '°', wrongs: [180 - a, a, 360 - a], explain: `Los complementarios suman 90°: 90° − ${a}° = ${90 - a}°.` };
          }
          let a; do { a = rnd(20, 160); } while (a === 90);
          return { q: `¿Cuánto mide el ángulo suplementario de ${a}°?`, num: 180 - a, unit: '°', wrongs: [90 - a < 0 ? a - 90 : 90 - a, a, 360 - a], explain: `Los suplementarios suman 180°: 180° − ${a}° = ${180 - a}°.` };
        }
        if (L === 2) {
          const a = rnd(30, 90), b = rnd(20, 150 - a), c = 180 - a - b;
          return { q: `En un triángulo, dos ángulos miden ${a}° y ${b}°. ¿Cuánto mide el tercero?`, num: c, unit: '°', wrongs: [360 - a - b, a + b, Math.abs(90 - a - b)], explain: `Los ángulos de un triángulo suman 180°: 180° − ${a}° − ${b}° = ${c}°.` };
        }
        if (Math.random() < 0.5) {
          const v = 2 * rnd(10, 45), ans = (180 - v) / 2;
          return { q: `En un triángulo isósceles, el ángulo desigual mide ${v}°. ¿Cuánto mide cada uno de los ángulos iguales?`, num: ans, unit: '°', wrongs: [180 - v, v / 2, 90 - v < 0 ? v - 90 : 90 - v], explain: `Los tres ángulos suman 180°. Los dos iguales suman 180° − ${v}° = ${180 - v}°, así que cada uno mide ${ans}°.` };
        }
        const sets = [[1, 2, 3], [2, 3, 4], [1, 1, 2], [1, 2, 6], [2, 3, 5], [1, 3, 5]];
        const s = pick(sets), tot = s[0] + s[1] + s[2], per = 180 / tot, big = Math.max(...s) * per;
        return { q: `Los ángulos de un triángulo están en la razón ${s[0]} : ${s[1]} : ${s[2]}. ¿Cuánto mide el ángulo mayor?`, num: big, unit: '°', wrongs: [per, 180 - big, big / 2, 90], explain: `Las partes suman ${tot}. Cada parte vale 180° ÷ ${tot} = ${n(per)}°. El mayor: ${Math.max(...s)} × ${n(per)}° = ${n(big)}°.` };
      }
    },
    {
      id: 'volumenes', name: 'Áreas y volúmenes',
      gen(L) {
        if (L === 1) {
          if (Math.random() < 0.5) {
            const a = rnd(2, 9);
            return { q: `¿Cuál es el volumen de un cubo de ${a} cm de arista?`, num: a * a * a, unit: ' cm³', wrongs: [a * a, 3 * a, 6 * a * a], explain: `Volumen = arista³ = ${a} × ${a} × ${a} = ${a * a * a} cm³.` };
          }
          const b = rnd(4, 15), h = rnd(3, 12);
          return { q: `Un paralelogramo tiene ${b} cm de base y ${h} cm de altura. ¿Cuál es su área?`, num: b * h, unit: ' cm²', wrongs: [(b * h) / 2, 2 * (b + h), b + h], explain: `Área = base × altura = ${b} × ${h} = ${b * h} cm².` };
        }
        if (L === 2) {
          if (Math.random() < 0.5) {
            const l = rnd(3, 12), w = rnd(2, 9), h = rnd(2, 9);
            return { q: `¿Cuál es el volumen de un prisma rectangular de ${l} cm × ${w} cm × ${h} cm?`, num: l * w * h, unit: ' cm³', wrongs: [l + w + h, 2 * (l * w + l * h + w * h), l * w], explain: `Volumen = largo × ancho × alto = ${l} × ${w} × ${h} = ${l * w * h} cm³.` };
          }
          const B = rnd(6, 16), b = rnd(2, B - 2), h = rnd(2, 10);
          const ok = (B + b) % 2 === 0 || h % 2 === 0;
          const hh = ok ? h : h + 1;
          return { q: `Un trapecio tiene bases de ${B} cm y ${b} cm, y altura de ${hh} cm. ¿Cuál es su área?`, num: ((B + b) * hh) / 2, unit: ' cm²', wrongs: [(B + b) * hh, B * b * hh / 2, ((B - b) * hh) / 2], explain: `Área = (B + b) × h ÷ 2 = (${B} + ${b}) × ${hh} ÷ 2 = ${((B + b) * hh) / 2} cm².` };
        }
        if (Math.random() < 0.5) {
          const r = rnd(1, 6), h = rnd(2, 10), ans = round(3.14 * r * r * h, 2);
          return { q: `¿Cuál es el volumen de un cilindro de radio ${r} cm y altura ${h} cm? (usa π = 3.14)`, num: ans, unit: ' cm³', wrongs: [round(3.14 * r * h, 2), round(3.14 * 2 * r * h, 2), round(3.14 * r * r, 2)], explain: `Volumen = π × r² × h = 3.14 × ${r}² × ${h} = ${n(ans)} cm³.` };
        }
        const l = 10 * rnd(3, 8), w = 10 * rnd(2, 6), h = 10 * rnd(2, 5), ans = (l * w * h) / 1000;
        return { q: `Una caja mide ${l} cm × ${w} cm × ${h} cm. ¿Cuántos litros de agua caben? (1 litro = 1 000 cm³)`, num: ans, unit: ' L', wrongs: [l * w * h, ans * 10, ans / 10], explain: `Volumen = ${l} × ${w} × ${h} = ${l * w * h} cm³. Como 1 L = 1 000 cm³: ${l * w * h} ÷ 1 000 = ${ans} L.` };
      }
    }
  ];

  /* ===================== 3ro de Secundaria ===================== */
  MB.G[3] = [
    {
      id: 'algebra', name: 'Expresiones algebraicas',
      gen(L) {
        if (L === 1) {
          if (Math.random() < 0.6) {
            const a = nz(-9, 9), b = nz(-9, 9), k = nz(-5, 6), ans = a * k + b;
            return { q: `Evalúa ${termsStr([[a, 'x'], [b, '']])} cuando x = ${n(k)}`, num: ans, wrongs: [a * k - b, a + k + b, -a * k + b], explain: `Sustituimos x = ${n(k)}: ${a} × ${par(k)} ${b < 0 ? '−' : '+'} ${Math.abs(b)} = ${n(ans)}.` };
          }
          const a = nz(-6, 6), b = nz(-6, 6), p = nz(-5, 6), q = nz(-5, 6), ans = a * p + b * q;
          return { q: `Evalúa ${termsStr([[a, 'p'], [b, 'q']])} cuando p = ${n(p)} y q = ${n(q)}`, num: ans, wrongs: [a * p - b * q, a + p + b + q, -a * p + b * q], explain: `${a} × ${par(p)} ${b < 0 ? '−' : '+'} ${Math.abs(b)} × ${par(q)} = ${n(ans)}.` };
        }
        if (L === 2) {
          if (Math.random() < 0.5) {
            let c1, c2, c3, S;
            do { c1 = nz(-9, 9); c2 = nz(-9, 9); c3 = nz(-9, 9); S = c1 + c2 + c3; } while (S === 0);
            return { q: `Reduce términos semejantes: ${termsStr([[c1, 'x'], [c2, 'x'], [c3, 'x']])}`, ans: mono(S, 1), wrongs: [mono(S, 2), mono(-S, 1), mono(c1 + c2 - c3, 1), mono(S + 1, 1)], explain: `Sumamos los coeficientes: ${c1} + ${par(c2)} + ${par(c3)} = ${n(S)}, así que queda ${mono(S, 1)}.` };
          }
          let p, q, r, s;
          do { p = nz(-9, 9); q = nz(-9, 9); r = nz(-9, 9); s = nz(-9, 9); } while (p + r === 0 || q + s === 0);
          return { q: `Reduce términos semejantes: ${termsStr([[p, 'a'], [q, 'b'], [r, 'a'], [s, 'b']])}`, ans: termsStr([[p + r, 'a'], [q + s, 'b']]), wrongs: [termsStr([[p + r, 'a'], [q - s, 'b']]), termsStr([[p - r, 'a'], [q + s, 'b']]), termsStr([[p + q + r + s, 'ab']]), termsStr([[p + r, 'a'], [-(q + s), 'b']])], explain: `Se suman por separado los términos con a (${p} + ${par(r)} = ${n(p + r)}) y los términos con b (${q} + ${par(s)} = ${n(q + s)}).` };
        }
        let a, b, c, d, op, A;
        let B, sign;
        do { a = rnd(1, 5); c = rnd(1, 5); b = nz(-8, 8); d = nz(-8, 8); op = pick(['+', '−']); A = a + (op === '+' ? c : -c); sign = op === '+' ? 1 : -1; B = a * b + sign * c * d; } while (A === 0 || B === 0);
        const cs = (k) => (k === 1 ? '' : String(k));
        return { q: `Simplifica: ${cs(a)}(x ${sg(b)} ${Math.abs(b)}) ${op} ${cs(c)}(x ${sg(d)} ${Math.abs(d)})`, ans: polyStr([A, B]), wrongs: [polyStr([A, a * b - sign * c * d]), polyStr([A, b + sign * d]), polyStr([a - sign * c, B]), polyStr([A, -B])], extras: [polyStr([A + 1, B]), polyStr([A, B + 1]), polyStr([A - 1, B])], explain: `Distribuimos cada paréntesis: (${polyStr([a, a * b])}) ${op} (${polyStr([c, c * d])}). Al reducir queda ${polyStr([A, B])}.` };
      }
    },
    {
      id: 'polinomios', name: 'Polinomios y productos notables',
      gen(L) {
        if (L === 1) {
          const deg = rnd(2, 5), coefs = [];
          for (let i = 0; i <= deg; i++) coefs.push(i === 0 ? nz(-9, 9) : rnd(-9, 9));
          if (coefs.filter((c) => c !== 0).length < 3) coefs[deg] = nz(-9, 9);
          const P = `P(x) = ${polyStr(coefs)}`, terms = coefs.filter((c) => c !== 0).length;
          const t = rnd(0, 2);
          if (t === 0) return { q: `Dado ${P}, ¿cuál es su grado?`, num: deg, wrongs: [terms, coefs[0], deg + 1, deg - 1], explain: `El grado es el mayor exponente de x: ${deg}.` };
          if (t === 1) return { q: `Dado ${P}, ¿cuál es su coeficiente principal?`, num: coefs[0], wrongs: [deg, coefs[deg], -coefs[0], terms], explain: `El coeficiente principal es el del término de mayor grado: ${n(coefs[0])}.` };
          return { q: `Dado ${P}, ¿cuál es su término independiente?`, num: coefs[deg], wrongs: [coefs[0], deg, -coefs[deg], coefs[deg - 1]], explain: `El término independiente es el que no tiene x: ${n(coefs[deg])}.` };
        }
        if (L === 2) {
          let P, Q, R, isSum;
          do {
            P = [nz(-9, 9), nz(-9, 9), nz(-9, 9)]; Q = [nz(-9, 9), nz(-9, 9), nz(-9, 9)];
            isSum = Math.random() < 0.5;
            R = P.map((v, i) => (isSum ? v + Q[i] : v - Q[i]));
          } while (R[0] === 0);
          const PQ = P.map((v, i) => v + Q[i]), PmQ = P.map((v, i) => v - Q[i]), QmP = P.map((v, i) => Q[i] - v);
          const wrongs = isSum
            ? [polyStr(PmQ), polyStr(QmP), polyStr([PQ[0], PQ[1] + 1, PQ[2]]), polyStr([PQ[0], PQ[1], P[2] - Q[2]])]
            : [polyStr(PQ), polyStr(QmP), polyStr([PmQ[0], P[1] + Q[1], PmQ[2]]), polyStr([PmQ[0], PmQ[1], P[2] + Q[2]])];
          return { q: `Si P(x) = ${polyStr(P)} y Q(x) = ${polyStr(Q)}, calcula P(x) ${isSum ? '+' : '−'} Q(x).`, ans: polyStr(R), wrongs, explain: `Operamos término a término: ${polyStr(R)}.${isSum ? '' : ' Al restar, se cambia el signo de todos los términos de Q(x).'}` };
        }
        const t = rnd(0, 2);
        if (t === 0) {
          const a = nz(-9, 9);
          return { q: `Desarrolla: (x ${sg(a)} ${Math.abs(a)})^(2)`, ans: polyStr([1, 2 * a, a * a]), wrongs: [polyStr([1, 0, a * a]), polyStr([1, a, a * a]), polyStr([1, 2 * a, a]), polyStr([1, -2 * a, a * a])], extras: [polyStr([1, 2 * a, a * a + 1]), polyStr([1, 2 * a + 1, a * a])], explain: `(a + b)² = a² + 2ab + b². Aquí: x² + 2(${n(a)})x + (${n(a)})² = ${polyStr([1, 2 * a, a * a])}.` };
        }
        if (t === 1) {
          const a = rnd(2, 9);
          return { q: `Desarrolla: (x + ${a})(x − ${a})`, ans: polyStr([1, 0, -a * a]), wrongs: [polyStr([1, 0, a * a]), polyStr([1, 2 * a, -a * a]), polyStr([1, -2 * a, a * a]), polyStr([1, a, -a])], extras: [polyStr([1, 0, -a]), polyStr([1, 0, -2 * a])], explain: `Suma por diferencia: (a + b)(a − b) = a² − b². Aquí: x² − ${a * a}.` };
        }
        const a = nz(-6, 6), b = nz(-6, 6);
        return { q: `Desarrolla: (x ${sg(a)} ${Math.abs(a)})(x ${sg(b)} ${Math.abs(b)})`, ans: polyStr([1, a + b, a * b]), wrongs: [polyStr([1, a * b, a + b]), polyStr([1, a + b, a + b]), polyStr([1, a + b, -a * b]), polyStr([1, a * b, a * b])], extras: [polyStr([1, a + b + 1, a * b]), polyStr([1, a + b, a * b + 1]), polyStr([1, a + b - 1, a * b])], explain: `(x + a)(x + b) = x² + (a + b)x + ab. Aquí: a + b = ${n(a + b)} y ab = ${n(a * b)}.` };
      }
    },
    {
      id: 'sistemas', name: 'Sistemas de ecuaciones',
      gen(L) {
        if (L === 1) {
          const x = rnd(3, 12), y = rnd(1, x - 1), S = x + y, D = x - y, askX = Math.random() < 0.5;
          return { q: `Resuelve el sistema:\nx + y = ${S}\nx − y = ${D}\n¿Cuánto vale ${askX ? 'x' : 'y'}?`, num: askX ? x : y, wrongs: [askX ? y : x, S - D, S + D], explain: `Sumando las dos ecuaciones: 2x = ${S + D}, entonces x = ${x}. Luego y = ${S} − ${x} = ${y}.` };
        }
        if (L === 2) {
          const x = rnd(-4, 6), y = rnd(-4, 6), a1 = rnd(1, 3), b1 = rnd(1, 3), a2 = rnd(1, 3), b2 = -rnd(1, 3);
          const c1 = a1 * x + b1 * y, c2 = a2 * x + b2 * y, askX = Math.random() < 0.5;
          return { q: `Resuelve el sistema:\n${termsStr([[a1, 'x'], [b1, 'y']])} = ${n(c1)}\n${termsStr([[a2, 'x'], [b2, 'y']])} = ${n(c2)}\n¿Cuánto vale ${askX ? 'x' : 'y'}?`, num: askX ? x : y, wrongs: [askX ? y : x, x + y, x - y], explain: `Se resuelve por sustitución o eliminación. La solución es x = ${n(x)} y y = ${n(y)}. Comprobación en la primera ecuación: ${a1} × ${par(x)} + ${b1} × ${par(y)} = ${n(c1)}.` };
        }
        if (Math.random() < 0.6) {
          const p = 5 * rnd(2, 8), q = 5 * rnd(3, 12), s = p + q, t = 3 * p + 2 * q;
          const askQ = Math.random() < 0.5;
          if (askQ) return { q: `Compré 3 lápices y 2 cuadernos por RD$ ${t}. Un lápiz y un cuaderno juntos cuestan RD$ ${s}. ¿Cuánto cuesta un cuaderno?`, num: q, wrongs: [p, s, t - s], explain: `Con l = lápiz y c = cuaderno: 3l + 2c = ${t} y l + c = ${s}. Multiplicando la segunda por 3: 3l + 3c = ${3 * s}. Restando: c = ${3 * s} − ${t} = ${q}.` };
          return { q: `Compré 3 lápices y 2 cuadernos por RD$ ${t}. Un lápiz y un cuaderno juntos cuestan RD$ ${s}. ¿Cuánto cuesta un lápiz?`, num: p, wrongs: [q, s, t - s], explain: `Con l = lápiz y c = cuaderno: 3l + 2c = ${t} y l + c = ${s}. Multiplicando la segunda por 2: 2l + 2c = ${2 * s}. Restando: l = ${t} − ${2 * s} = ${p}.` };
        }
        const big = rnd(10, 30), small = rnd(3, big - 2), S = big + small, D = big - small;
        return { q: `La suma de dos números es ${S} y su diferencia es ${D}. ¿Cuál es el número mayor?`, num: big, wrongs: [small, S, D], explain: `Con x + y = ${S} y x − y = ${D}: 2x = ${S + D}, entonces x = ${big}.` };
      }
    },
    {
      id: 'pitagoras', name: 'Teorema de Pitágoras',
      gen(L) {
        const [a, b, c] = pickTrip();
        if (L === 1) {
          return { q: `Un triángulo rectángulo tiene catetos de ${a} cm y ${b} cm. ¿Cuánto mide su hipotenusa?`, num: c, unit: ' cm', wrongs: [a + b, c * c, Math.abs(b - a)], explain: `c² = ${a}² + ${b}² = ${a * a} + ${b * b} = ${c * c}, entonces c = √${c * c} = ${c} cm.` };
        }
        if (L === 2) {
          return { q: `Un triángulo rectángulo tiene hipotenusa de ${c} cm y un cateto de ${a} cm. ¿Cuánto mide el otro cateto?`, num: b, unit: ' cm', wrongs: [c - a, c + a, c * c - a * a], explain: `b² = ${c}² − ${a}² = ${c * c} − ${a * a} = ${b * b}, entonces b = √${b * b} = ${b} cm.` };
        }
        const t = rnd(0, 2);
        if (t === 0) return { q: `Una escalera de ${c} m se apoya en una pared y su base queda a ${a} m de la pared. ¿A qué altura de la pared llega?`, num: b, unit: ' m', wrongs: [c - a, c + a, c * c - a * a], explain: `h² = ${c}² − ${a}² = ${b * b}, entonces h = ${b} m.` };
        if (t === 1) return { q: `Una cancha rectangular mide ${a} m de ancho por ${b} m de largo. ¿Cuánto mide su diagonal?`, num: c, unit: ' m', wrongs: [a + b, c * c, Math.abs(b - a)], explain: `d² = ${a}² + ${b}² = ${c * c}, entonces d = ${c} m.` };
        const isP = (x, y, z) => { const s = [x, y, z].sort((u, v) => u - v); return s[0] * s[0] + s[1] * s[1] === s[2] * s[2]; };
        const cands = [[a, b, c + 1], [a + 1, b, c], [a, b + 1, c + 1], [a + 1, b + 1, c + 2], [a, b, c - 1]].filter((x) => !isP(x[0], x[1], x[2]));
        const show = (x) => `${x[0]}, ${x[1]} y ${x[2]}`;
        return { q: '¿Cuál de estos grupos de medidas (en cm) forma un triángulo rectángulo?', ans: show([a, b, c]), wrongs: shuffle(cands).slice(0, 3).map(show), explain: `Se cumple a² + b² = c² solo en ${a}² + ${b}² = ${a * a} + ${b * b} = ${c * c} = ${c}².` };
      }
    },
    {
      id: 'probabilidad', name: 'Probabilidad',
      gen(L) {
        if (L === 1) {
          if (Math.random() < 0.5) {
            const r = rnd(1, 6), b = rnd(1, 6), ans = frR(r, r + b);
            return { q: `En una bolsa hay ${r} bolas rojas y ${b} azules. Si se saca una al azar, ¿cuál es la probabilidad de que sea roja?`, ans, wrongs: [frR(r, b), frR(b, r + b), frR(1, r + b), frR(r + b, r)], extras: [frR(r, r + b + 1), frR(r + 1, r + b + 1), frR(r + 1, r + b + 2)], explain: `Casos favorables: ${r}. Casos posibles: ${r + b}. Probabilidad = ${fr(r, r + b)}${ans !== fr(r, r + b) ? ' = ' + ans : ''}.` };
          }
          const defs = [['un número par', (x) => x % 2 === 0], ['un número mayor que 4', (x) => x > 4], ['un múltiplo de 3', (x) => x % 3 === 0], ['un número primo', (x) => [2, 3, 5].indexOf(x) >= 0], ['un número menor que 3', (x) => x < 3], ['el número 6', (x) => x === 6]];
          const [txt, f] = pick(defs);
          let cnt = 0; for (let i = 1; i <= 6; i++) if (f(i)) cnt++;
          return { q: `Se lanza un dado. ¿Cuál es la probabilidad de obtener ${txt}?`, ans: frR(cnt, 6), wrongs: [frR(6 - cnt, 6), frR(cnt, 5), frR(1, cnt), frR(cnt + 1, 6), frR(cnt, 3)], extras: [frR(cnt, 7), frR(cnt + 2, 6), frR(cnt, 4)], explain: `Hay ${cnt} resultados favorables de 6 posibles: ${fr(cnt, 6)}${frR(cnt, 6) !== fr(cnt, 6) ? ' = ' + frR(cnt, 6) : ''}.` };
        }
        if (L === 2) {
          if (Math.random() < 0.7) {
            const kind = pick(['eq', 'eq', 'ge', 'le']);
            let s, cnt = 0, txt;
            if (kind === 'eq') { s = rnd(3, 11); txt = `sea ${s}`; } else if (kind === 'ge') { s = rnd(8, 11); txt = `sea mayor o igual que ${s}`; } else { s = rnd(3, 5); txt = `sea menor o igual que ${s}`; }
            for (let i = 1; i <= 6; i++) for (let j = 1; j <= 6; j++) { const t = i + j; if (kind === 'eq' ? t === s : kind === 'ge' ? t >= s : t <= s) cnt++; }
            return { q: `Se lanzan dos dados. ¿Cuál es la probabilidad de que la suma ${txt}?`, ans: frR(cnt, 36), wrongs: [frR(cnt, 12), frR(cnt + 1, 36), frR(cnt, 11), fr(cnt, 36), frR(1, cnt)], extras: [frR(cnt, 6), frR(cnt + 2, 36), frR(cnt, 35)], explain: `De los 36 resultados posibles, ${cnt} cumplen la condición: ${fr(cnt, 36)}${frR(cnt, 36) !== fr(cnt, 36) ? ' = ' + frR(cnt, 36) : ''}.` };
          }
          const N = pick([2, 3]), K = rnd(0, N), cnt = comb(N, K), tot = Math.pow(2, N);
          return { q: `Se lanzan ${N} monedas. ¿Cuál es la probabilidad de obtener exactamente ${K} cara${K === 1 ? '' : 's'}?`, ans: frR(cnt, tot), wrongs: [frR(1, tot), frR(K || 1, N), frR(cnt + 1, tot), frR(cnt, 2 * N), frR(cnt, tot + 2)], extras: [frR(cnt, tot - 1), frR(cnt + 2, tot), frR(cnt, N + 1), frR(cnt + 1, tot + 1)], explain: `Hay ${tot} resultados posibles y ${cnt} con exactamente ${K} cara${K === 1 ? '' : 's'}: ${fr(cnt, tot)}${frR(cnt, tot) !== fr(cnt, tot) ? ' = ' + frR(cnt, tot) : ''}.` };
        }
        const r = rnd(2, 6), b = rnd(2, 6), T = r + b;
        if (Math.random() < 0.5) {
          return { q: `En una bolsa hay ${r} bolas rojas y ${b} azules. Se sacan 2 bolas una tras otra, sin devolverlas. ¿Cuál es la probabilidad de que ambas sean rojas?`, ans: frR(r * (r - 1), T * (T - 1)), wrongs: [frR(r * r, T * T), frR(r * (r - 1), T * T), frR(r, T), frR(2 * r * b, T * (T - 1))], extras: [frR(r * (r - 1) + 1, T * (T - 1)), frR(r * (r - 1), T * (T + 1))], explain: `Primera roja: ${fr(r, T)}. Segunda roja (quedan ${T - 1} bolas, ${r - 1} rojas): ${fr(r - 1, T - 1)}. Producto: ${fr(r * (r - 1), T * (T - 1))}${frR(r * (r - 1), T * (T - 1)) !== fr(r * (r - 1), T * (T - 1)) ? ' = ' + frR(r * (r - 1), T * (T - 1)) : ''}.` };
        }
        return { q: `En una bolsa hay ${r} bolas rojas y ${b} azules. Se sacan 2 bolas una tras otra, sin devolverlas. ¿Cuál es la probabilidad de que salga una roja y una azul (en cualquier orden)?`, ans: frR(2 * r * b, T * (T - 1)), wrongs: [frR(r * b, T * (T - 1)), frR(2 * r * b, T * T), frR(r * b, T * T), frR(r * (r - 1), T * (T - 1))], explain: `Roja y luego azul: ${fr(r, T)} × ${fr(b, T - 1)}. Azul y luego roja es igual. Sumando ambos casos: ${fr(2 * r * b, T * (T - 1))}${frR(2 * r * b, T * (T - 1)) !== fr(2 * r * b, T * (T - 1)) ? ' = ' + frR(2 * r * b, T * (T - 1)) : ''}.` };
      }
    }
  ];
})(typeof window !== 'undefined' ? window : globalThis);
