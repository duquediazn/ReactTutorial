# React State Intermediate

## Índice de contenidos
- [Inicialización de estado en React](#inicialización-de-estado-en-react)
- [Trabajar con objetos y arrays en el estado](#trabajar-con-objetos-y-arrays-en-el-estado)
- [Ejemplos completos](#ejemplos-completos)
- [Quiz de la sección](#quiz-de-la-sección)

## Inicialización de estado en React

### App de ejemplo: “Color Box” (visión general)

#### ¿Qué hace?
Pinta una rejilla de cajas. Cada caja muestra un color de fondo tomado al azar de una lista (colorList). Al hacer clic sobre una caja, cambia a otro color aleatorio de esa misma lista. 

Puedes ver el ejemplo completo aquí: [**ColorBox**](../04_ReactStateIntermediate/color-box/).

#### Arquitectura (componentes):
- App.jsx: Define colorList (array de strings hex) y renderiza <ColorBoxGrid colorList={colorList} />.
- ColorBoxGrid.jsx: Crea una cuadrícula de, p. ej., 25 <ColorBox />. A cada caja se le pasa colorList y una key única.
- ColorBox.jsx: Cada caja mantiene su propio estado interno color y lo usa para pintar el fondo. Al clic, actualiza ese estado con un nuevo color aleatorio tomado de colorList.

```jsx
// App.jsx (esqueleto)
function App() {
  const colorList = ["#ffadad", "#ffd6a5", "#fdffb6", "#caffbf", "#9bf6ff", "#a0c4ff", "#bdb2ff", "#ffc6ff"];
  return <ColorBoxGrid colorList={colorList} />;
}
```

```jsx
// ColorBoxGrid.jsx (esqueleto)
import { useMemo } from "react";
import { v4 as uuidv4 } from "uuid";

function ColorBoxGrid({ colorList }) {
  const boxNum = 25;

  // ids únicos → usados como key para forzar montajes limpios cuando cambie colorList
  const ids = useMemo(
    () => Array.from({ length: boxNum }, () => uuidv4()),
    [colorList] // si cambia la lista, se regeneran ids → React remonta las cajas
  );

  return (
    <div className="ColorBoxGrid">
      {ids.map(id => <ColorBox key={id} colorList={colorList} />)}
    </div>
  );
}

```

```jsx
// ColorBox.jsx (esqueleto)
import { useState } from "react";

const getRand = (list) => list[Math.floor(Math.random() * list.length)];

function ColorBox({ colorList }) {
  const [color, setColor] = useState(() => getRand(colorList)); // ver sección de abajo

  return (
    <div
      onClick={() => setColor(getRand(colorList))}
      className="ColorBox"
      style={{ backgroundColor: color }}
    />
  );
}
```

### Inicialización de estado en React
> Idea clave: el argumento de useState solo se usa en el primer render. En renders posteriores, React ignora ese argumento porque el estado ya existe.
Ya vimos esta idea en la sección anterior pero ahora queremos profundizar en algunas cuestiones, como por ejemplo, ¿qué pasa cuando nuestra inicialización de estado es el retorno de una función?

#### 1. useState(valor) — inicialización directa
Por ejemplo, en nuestra app de ejemplo podríamos haber hecho:
```jsx
const [color, setColor] = useState(getRand(colorList));
```
¿Qué ocurre?, getRand(colorList) se ejecuta en cada render (aunque React solo use el resultado inicial la primera vez). Esto puede ser un probelma si ese cálculo es costoso (por ejemplo, filtrar/ordenar datos grandes, leer de localStorage, etc.).

#### 2. useState(función) — inicialización perezosa (sin parámetros)
Para solucionar el problema de la invocación innecesaria, podríamos llamar a la función sin paréntesis:
```jsx
const [value, setValue] = useState(getRand);
```
Si pasamos una función sin paréntesis, React la ejecuta solo al montar para obtener el valor inicial. Sin embargo, para este ejemplo concreto no nos vale, porque nuestra función necesita un parámetro (la lista de colores)

Úsalo si… puedes calcular el inicial sin depender de argumentos (o quieres encapsular lógica sin parámetros).

#### 3. useState(() => función(param)) — inicialización perezosa con parámetros
```jsx
const [color, setColor] = useState(() => getRand(colorList));
```
Este es el patrón recomendado cuando el cálculo sí necesita props o variables:
- Pasamos una arrow function que, al ejecutarse (solo en el primer render), llama a tu función con los parámetros necesarios (colorList en este caso).
- Más eficiente: solo se evalúa al montar el componente.

Úsalo si… el valor inicial depende de props o cálculos no triviales.

### Resumen rápido

- useState(valor) → reevaluará valor en cada render (aunque no se use de nuevo).
- useState(función) → React ejecuta esa función una única vez al montar (sin parámetros).
- useState(() => función(param)) → patrón perezoso con parámetros: se ejecuta solo al montar.

> Nota sobre StrictMode (desarrollo): ten en cuenta que en modo dev, React puede invocar dos veces la función de inicialización para detectar efectos secundarios; en producción se ejecuta una única vez.

### “Si colorList cambia… ¿se recalcula el estado inicial?”
No. La inicialización no se repite en componentes ya montados. Si colorList cambia después, el color permanece como esté hasta que tú lo actualices.

Tienes dos estrategias (válidas para esta app y en general):

#### 1. “Resetear” el estado con un efecto cuando cambie colorList
Para eso usaríamos React Effects, aunque aún no lo hemos visto, formará parte de la [lección 6](./06_SideEffects.md).

```jsx
import { useEffect, useState } from "react";

function ColorBox({ colorList }) {
  const [color, setColor] = useState(() => getRand(colorList));

  useEffect(() => {
    setColor(getRand(colorList)); // recalcula el color al cambiar la lista
  }, [colorList]);

  // ...
}
```

**Pros:** el componente no se desmonta, solo actualizas el estado.
**Contras:** debes acordarte de implementar este efecto.

#### 2. Forzar remontaje via key (desde el padre)
Ya lo estamos haciendo en ColorBoxGrid: regeneramos las key cuando cambia colorList usando useMemo([...], [colorList]). Así, para React, cada caja es “nueva” y se monta de cero, volviendo a ejecutar la inicialización perezosa:

```jsx
const ids = useMemo(
  () => Array.from({ length: boxNum }, () => uuidv4()),
  [colorList] // cambia ⇒ ids nuevos ⇒ <ColorBox key={id} /> se desmonta y se vuelve a montar
);

```

**Pros:** no necesitas efectos por caja; todo se resetea “limpio”.
**Contras:** desmontas y montas todos los ColorBox (pierdes cualquier otro estado interno que tuviesen).

> Regla práctica:
> - Si quieres conservar el resto de estado interno del componente → usa efecto (A).
> - Si quieres reiniciar por completo cada ítem cuando cambie la fuente de datos → usa key (B).

## Trabajar con objetos y arrays en el estado
Hasta ahora hemos usado `useState` con valores simples (números, strings). Pero en aplicaciones reales muchas veces necesitamos manejar estructuras más complejas, como objetos o arrays.

### Objetos como estado

Un ejemplo clásico: un marcador de puntuaciones para dos jugadores.

```jsx
import { useState } from "react";

function ScoreKeeper() {
  const [scores, setScores] = useState({ p1Score: 0, p2Score: 0 });

  function increaseP1Score() {
    setScores((oldScores) => {
      return { ...oldScores, p1Score: oldScores.p1Score + 1 };
    });
  }

  function increaseP2Score() {
    setScores((oldScores) => {
      return { ...oldScores, p2Score: oldScores.p2Score + 1 };
    });
  }

  return (
    <div>
      <p>Player 1: {scores.p1Score}</p>
      <p>Player 2: {scores.p2Score}</p>
      <button onClick={increaseP1Score}>+1 Player 1</button>
      <button onClick={increaseP2Score}>+1 Player 2</button>
    </div>
  );
}

```
Puntos clave: 
- Nunca mutamos directamente el objeto del estado (scores.p1Score++).
- Siempre usamos el patrón setState(prev => ...) y el spread operator ({ ...prev }) para crear un nuevo objeto.
- Esto es necesario porque React necesita detectar que el objeto cambió → si mutamos el mismo objeto, React no vería diferencia.ç

### Arrays como estado

Con arrays ocurre lo mismo: nunca modificamos el array original. Veamos una app que gestiona emojis:

```jsx
import { v4 as uuid } from "uuid";
import { useState } from "react";

function randomEmoji() {
  const choices = ["😬", "😘", "😭", "🙄", "🤪", "🤢"];
  return choices[Math.floor(Math.random() * choices.length)];
}

export default function EmojiClicker() {
  const [emojis, setEmojis] = useState([{ id: uuid(), emoji: randomEmoji() }]);

  const addEmoji = () => {
    setEmojis((oldEmojis) => [
      ...oldEmojis,
      { id: uuid(), emoji: randomEmoji() },
    ]);
  };

  const deleteEmoji = (id) => {
    setEmojis((prevEmojis) => prevEmojis.filter((e) => e.id !== id));
  };

  const makeEverythingAHeart = () => {
    setEmojis((prevEmojis) =>
      prevEmojis.map((e) => {
        return { ...e, emoji: "❤️" };
      })
    );
  };

  return (
    <div>
      {emojis.map((e) => (
        <span
          onClick={() => deleteEmoji(e.id)}
          key={e.id}
          style={{ fontSize: "4rem" }}
        >
          {e.emoji}
        </span>
      ))}
      <button onClick={addEmoji}>Add Emoji</button>
      <button onClick={makeEverythingAHeart}>Make them all hearts</button>
    </div>
  );
}
```

### Patrón general (cheat sheet)

Cuando trabajamos con arrays en React, los patrones más comunes son:

```jsx
const shoppingCart = [
  { id: 1, product: "HDMI Cable", price: 4 },
  { id: 2, product: "Easy Bake Oven", price: 28 },
  { id: 3, product: "Peach Pie", price: 6.5 },
];

// 1. Añadir
[...shoppingCart, { id: 4, product: "Coffee Mug", price: 7.99 }];

// 2. Eliminar
shoppingCart.filter((item) => item.id !== 2);

// 3. Modificar todos
shoppingCart.map((item) => {
  return { ...item, product: item.product.toLowerCase() };
});

// 4. Modificar uno en particular
shoppingCart.map((item) => {
  if (item.id === 3) {
    return { ...item, price: 10.99 };
  } else {
    return item;
  }
});

```

### Resumen

- Con objetos: usamos { ...prev, propiedad: nuevoValor }.
- Con arrays: usamos .map() (modificar) , .filter() (eliminar), y spread [...] para generar nuevos arrays.
- Nunca mutamos directamente: React detecta los cambios comparando referencias (shallow comparison).

Este patrón es esencial para mantener el estado inmutable y las actualizaciones de la UI funcionando de forma predecible.

## Ejemplos completos

Observa y prueba las apps de esta sección: 
- [Color Box](../04_ReactStateIntermediate/color-box/).
- [Score Keeper](../04_ReactStateIntermediate/score-keeper/). 

---

## Quiz de la sección
Para terminar, [aquí](./quiz04.md) tienes algunas preguntas para comprobar si has interiorizado bien los conceptos vistos en esta sección. Si no has dado una con las respuestas, quizá sea buena idea volver a darle un repasito a la lección.  

---

[Volver al inicio](../README.md) - [<- Lección anterior](./03_ReactState.md) | [Siguiente lección ->](./05_ComponentDesign.md)