/* Math Arena - palabras secretas para "Impostor matemático" (por grado) */
(function (root) {
  'use strict';
  const MB = root.MathBank;
  // [palabra, categoría]
  const W = {
    1: [
      ['numerador', 'Fracciones'], ['denominador', 'Fracciones'], ['fracción equivalente', 'Fracciones'], ['número mixto', 'Fracciones'], ['fracción propia', 'Fracciones'],
      ['número negativo', 'Enteros'], ['valor absoluto', 'Enteros'], ['recta numérica', 'Enteros'], ['opuesto de un número', 'Enteros'], ['el cero', 'Enteros'],
      ['punto decimal', 'Decimales'], ['redondeo', 'Decimales'], ['porcentaje', 'Decimales'], ['décima', 'Decimales'], ['centésima', 'Decimales'],
      ['perímetro', 'Geometría'], ['área', 'Geometría'], ['rectángulo', 'Geometría'], ['triángulo', 'Geometría'], ['círculo', 'Geometría'], ['cuadrado', 'Geometría'],
      ['ecuación', 'Álgebra'], ['incógnita', 'Álgebra'], ['igualdad', 'Álgebra'],
      ['múltiplo', 'Aritmética'], ['divisor', 'Aritmética'], ['número primo', 'Aritmética'], ['mínimo común múltiplo', 'Aritmética'], ['máximo común divisor', 'Aritmética']
    ],
    2: [
      ['potencia', 'Potencias'], ['base', 'Potencias'], ['exponente', 'Potencias'], ['raíz cuadrada', 'Potencias'], ['cuadrado perfecto', 'Potencias'],
      ['razón', 'Proporciones'], ['proporción', 'Proporciones'], ['regla de tres', 'Proporciones'], ['porcentaje', 'Proporciones'], ['descuento', 'Proporciones'], ['ITBIS', 'Proporciones'],
      ['ángulo agudo', 'Ángulos'], ['ángulo obtuso', 'Ángulos'], ['ángulo complementario', 'Ángulos'], ['ángulo suplementario', 'Ángulos'], ['bisectriz', 'Ángulos'], ['triángulo isósceles', 'Triángulos'], ['triángulo equilátero', 'Triángulos'],
      ['volumen', 'Cuerpos geométricos'], ['prisma', 'Cuerpos geométricos'], ['cilindro', 'Cuerpos geométricos'], ['cubo', 'Cuerpos geométricos'], ['cono', 'Cuerpos geométricos'],
      ['despejar', 'Ecuaciones'], ['término independiente', 'Ecuaciones'], ['ecuación de primer grado', 'Ecuaciones']
    ],
    3: [
      ['monomio', 'Polinomios'], ['binomio', 'Polinomios'], ['polinomio', 'Polinomios'], ['grado', 'Polinomios'], ['coeficiente', 'Polinomios'], ['términos semejantes', 'Polinomios'], ['factorización', 'Polinomios'], ['producto notable', 'Polinomios'],
      ['sistema de ecuaciones', 'Sistemas'], ['sustitución', 'Sistemas'], ['eliminación', 'Sistemas'], ['solución única', 'Sistemas'],
      ['teorema de Pitágoras', 'Pitágoras'], ['hipotenusa', 'Pitágoras'], ['cateto', 'Pitágoras'], ['triángulo rectángulo', 'Pitágoras'],
      ['probabilidad', 'Probabilidad'], ['evento', 'Probabilidad'], ['espacio muestral', 'Probabilidad'], ['azar', 'Probabilidad'], ['dado', 'Probabilidad'], ['moneda', 'Probabilidad'],
      ['expresión algebraica', 'Álgebra'], ['variable', 'Álgebra'], ['propiedad distributiva', 'Álgebra']
    ],
    4: [
      ['función', 'Funciones'], ['dominio', 'Funciones'], ['rango', 'Funciones'], ['pendiente', 'Funciones'], ['intercepto', 'Funciones'], ['gráfica', 'Funciones'],
      ['parábola', 'Cuadráticas'], ['vértice', 'Cuadráticas'], ['discriminante', 'Cuadráticas'], ['raíz de una ecuación', 'Cuadráticas'], ['eje de simetría', 'Cuadráticas'], ['fórmula general', 'Cuadráticas'],
      ['seno', 'Trigonometría'], ['coseno', 'Trigonometría'], ['tangente', 'Trigonometría'], ['ángulo de elevación', 'Trigonometría'],
      ['media', 'Estadística'], ['mediana', 'Estadística'], ['moda', 'Estadística'], ['desviación', 'Estadística'], ['tabla de frecuencias', 'Estadística'], ['histograma', 'Estadística']
    ],
    5: [
      ['función exponencial', 'Exponenciales'], ['crecimiento exponencial', 'Exponenciales'], ['base de una potencia', 'Exponenciales'],
      ['logaritmo', 'Logaritmos'], ['logaritmo natural', 'Logaritmos'], ['propiedades de los logaritmos', 'Logaritmos'],
      ['radián', 'Trigonometría'], ['identidad trigonométrica', 'Trigonometría'], ['ley de senos', 'Trigonometría'], ['ley de cosenos', 'Trigonometría'], ['círculo unitario', 'Trigonometría'],
      ['distancia entre dos puntos', 'Geometría analítica'], ['punto medio', 'Geometría analítica'], ['recta perpendicular', 'Geometría analítica'], ['rectas paralelas', 'Geometría analítica'], ['plano cartesiano', 'Geometría analítica'],
      ['sucesión', 'Sucesiones'], ['progresión aritmética', 'Sucesiones'], ['progresión geométrica', 'Sucesiones'], ['razón común', 'Sucesiones'], ['término general', 'Sucesiones'], ['serie', 'Sucesiones']
    ],
    6: [
      ['circunferencia', 'Cónicas'], ['elipse', 'Cónicas'], ['hipérbola', 'Cónicas'], ['foco', 'Cónicas'], ['directriz', 'Cónicas'], ['parábola', 'Cónicas'],
      ['límite', 'Cálculo'], ['continuidad', 'Cálculo'], ['infinito', 'Cálculo'], ['derivada', 'Cálculo'], ['recta tangente', 'Cálculo'], ['razón de cambio', 'Cálculo'], ['integral', 'Cálculo'],
      ['permutación', 'Combinatoria'], ['combinación', 'Combinatoria'], ['factorial', 'Combinatoria'], ['probabilidad condicional', 'Probabilidad'], ['evento independiente', 'Probabilidad'],
      ['varianza', 'Estadística'], ['desviación estándar', 'Estadística'], ['distribución normal', 'Estadística'], ['correlación', 'Estadística'], ['puntaje z', 'Estadística']
    ]
  };
  MB.IMPOSTOR = W;
})(typeof window !== 'undefined' ? window : globalThis);
