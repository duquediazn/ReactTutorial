# Diseño de componentes

En esta sección no introduciremos nuevos hooks, sino que nos centraremos en cómo diseñar aplicaciones en React: decidir dónde colocar el estado, cómo aplicar el principio “lift state as high as needed, but no higher”, y cómo pasar datos y funciones entre componentes.

Para ilustrarlo usaremos una pequeña aplicación de ejemplo llamada Lucky Seven, que iremos analizando de abajo hacia arriba en su jerarquía de componentes.

## Índice de contenidos
- [Lucky Seven](#lucky-seven)
- [Prop drilling](#prop-drilling)
- [Separar lógica y presentación](#separar-lógica-y-presentación)
- [Ejemplo completo](#ejemplos-completos)
- [Quiz de la sección](#quiz-de-la-sección)


## Lucky Seven

### Mapa de componentes

```scss
App
└─ LuckyN   (lógica / estado)
   └─ Dice  (presentación)
      ├─ Die
      └─ Die

```

- **Die:** elemento atómico, muestra un dado (presentacional, sin estado de negocio).
- **Dice:** renderiza varios Die y delega acciones a su padre (presentacional).
- **LuckyN:** contiene la lógica del juego (estado, comprobaciones, handlers).
- **App:** configura la app (props iniciales, layout general).

> Regla guía: componentes “de abajo” (Die/Dice) tienden a ser presentacionales; el estado vive arriba donde se necesita para decidir la UI.

### Dónde colocar el estado

Principio: _Lift state as high as needed, but no higher_
(“Eleva el estado todo lo que haga falta… pero no más”).

3 Preguntas:
- ¿Quién lo lee? (qué componentes necesitan ese dato para renderizar)
- ¿Quién lo escribe? (qué componentes disparan cambios)
- ¿Puede derivarse? (si se calcula a partir de otros estados/props, quizá no deba ser un estado propio)

Si varios componentes hermanos necesitan el mismo dato, súbelo a su ancestro común más cercano. Si solo lo necesita un componente, déjalo local.

### Aplicándolo a Lucky Seven

Imaginemos que el juego necesita:

- diceValues: array con los valores de cada dado
- goal: número objetivo para ganar (p. ej., “lucky seven”)
- isWinner: boolean derivado de diceValues y goal

Dónde viven:

- diceValues → lo lee Dice (para pintar) y lo usa LuckyN (para decidir si hay victoria). Como afecta a varios, vive en LuckyN.
- goal → configuración del juego. Puede venir como prop desde App o vivir en LuckyN si cambia durante la partida.
- isWinner → derivado (no lo guardes si se puede calcular con sum(diceValues) === goal).

### Pasar estado como props (de LuckyN → Dice/Die)

En **LuckyN.jsx** se concentra la **lógica**:  
- El estado de los dados se guarda en `dice`.  
- La función `roll` actualiza ese estado.  
- La prop `winCheck` (recibida desde `App.jsx`) determina si se gana la partida.  

```jsx
// LuckyN.jsx
import { useState } from "react";
import { getRolls } from "./utils";
import Button from "./Button";
import Dice from "./Dice";

function LuckyN({ title = "Dice Game", numDice = 2, winCheck }) {
  const [dice, setDice] = useState(getRolls(numDice));
  const isWinner = winCheck(dice);
  const roll = () => setDice(getRolls(numDice));

  return (
    <main className="LuckyN">
      <h1>
        {title} {isWinner && "You Win!"}
      </h1>
      <Dice dice={dice} />
      <Button clickFunc={roll} label="Re-Roll" />
    </main>
  );
}

export default LuckyN;
```

En **Dice.jsx**, el componente recibe el array de valores y los usa para renderizar cada `Die`.  

```jsx
// Dice.jsx
import Die from "./Die";
import "./Dice.css";

function Dice({ dice, color }) {
  return (
    <section className="Dice">
      {dice.map((v, i) => (
        <Die key={i} val={v} color={color} />
      ))}
    </section>
  );
}

export default Dice;
```


Por último, cada **Die.jsx** muestra un dado individual:  
```jsx
// Die.jsx
import "./Die.css";

function Die({ val, color = "slateblue" }) {
  return (
    <div className="Die" style={{ backgroundColor: color }}>
      {val}
    </div>
  );
}

export default Die;
```

### Claves

- **LuckyN** mantiene el estado y decide cuándo actualizarlo.  
- **Dice** y **Die** son presentacionales: se limitan a representar los datos que reciben como props.  
- **Button** (otro presentacional) recibe la función `roll` como prop y la ejecuta al hacer clic.  

> Así se cumple el patrón de *“separar lógica y presentación”*: la lógica se queda arriba, los componentes de UI solo muestran props.

### Pasar funciones como props (handlers)

En React es habitual pasar funciones desde un componente padre hacia un hijo para que este último pueda **disparar acciones**.  
En **Lucky Seven** lo vemos así:

```jsx
// LuckyN.jsx
function LuckyN({ title = "Dice Game", numDice = 2, winCheck }) {
  const [dice, setDice] = useState(getRolls(numDice));
  const isWinner = winCheck(dice);

  // función que actualiza el estado
  const roll = () => setDice(getRolls(numDice));

  return (
    <main className="LuckyN">
      <h1>
        {title} {isWinner && "You Win!"}
      </h1>
      <Dice dice={dice} />
      <Button clickFunc={roll} label="Re-Roll" />
    </main>
  );
}
```

```jsx
// Button.jsx
function Button({ clickFunc, label = "Click Me" }) {
  return (
    <button onClick={clickFunc} className="Button">
      {label}
    </button>
  );
}
```

Claves:
- **LuckyN** define la función `roll`, que actualiza el estado (`setDice`).  
- Esa función se pasa a **Button** mediante la prop `clickFunc`.  
- **Button** es completamente presentacional: no sabe cómo funciona `roll`, solo lo ejecuta cuando se hace clic.  

> Este patrón mantiene la lógica en el padre y la UI en el hijo.  

### Checklist rápida

_“Lift state… but no higher”_

- **Bien elevado**: `dice` vive en `LuckyN`, porque lo usan varios componentes y determina la lógica de victoria.  
- **No más alto**: si un `Die` necesitara un estado local (ej. animación de hover), ese estado debe quedarse en `Die`, no en `LuckyN`.  
- ¿El dato lo usan varios hermanos? → Súbelo al ancestro común (ej. `LuckyN` para todos los `Die`).  
- ¿Se puede calcular a partir de otros? → No lo guardes como estado, calcúlalo (ej. `isWinner` a partir de `dice`).  
- ¿El hijo solo “avisa” de algo? → Pásale un **handler** desde el padre (ej. `Button` recibe `clickFunc`).  
- ¿El hijo necesita aportar información al actualizar? → El handler debe aceptar parámetros (ej. `onClick={( ) => handler(i)}`).  
- **Separar lógica y presentación**: `LuckyN` es el “listo” (estado + reglas), `Dice` y `Die` son “tontos” (solo muestran props).  


## Prop drilling

Cuando un dato se necesita en un componente muy profundo de la jerarquía, pero nace en un nivel superior, a menudo tenemos que “pasarlo” como prop a través de varios componentes intermedios que no lo usan directamente.
A esto se le llama prop drilling.

Ejemplo:

Imagina que en Lucky Seven queremos mostrar el `goal` (número objetivo para ganar) dentro de cada Die.

Estructura:
```
App → LuckyN → Dice → Die
```

El `goal` vive en `App`, pero `Die` lo necesita.
La forma directa sería:

```jsx
// App
<LuckyN goal={7} />

// LuckyN
<Dice dice={dice} goal={goal} />

// Dice
{dice.map((v, i) => (
  <Die key={i} val={v} goal={goal} />
))}

// Die
function Die({ val, goal }) {
  return <div>{val === goal ? "⭐" : val}</div>
}

```
En este ejemplo, `goal` pasa por `LuckyN` y `Dice` aunque ellos no lo usen, solo para que llegue a `Die`.

### ¿Cuándo es aceptable?

- Cuando la profundidad es pequeña (1–2 niveles).
- Cuando el dato es específico y solo se necesita en unos pocos lugares.
- Cuando mantiene la lógica clara y explícita: ves quién pasa qué.

De hecho, en aplicaciones pequeñas prop drilling no es un problema; puede ser la solución más simple y comprensible.

### ¿Cuándo conviene otra solución?

Si el mismo dato debe estar disponible en **muchos niveles** o en **múltiples ramas de la jerarquía**, el `prop drilling` se vuelve molesto y difícil de mantener.

En estos casos usamos **Context**.

### Context como alternativa

Context nos permite crear un “proveedor” de datos en lo alto de la jerarquía, y consumir esos datos en cualquier componente descendiente sin tener que pasarlos explícitamente en cada nivel intermedio.

#### Mini ejemplo con React Context:
```jsx
import { createContext, useContext } from "react";

// 1. Crear el contexto
const GoalContext = createContext();

// 2. Proveer el contexto en lo alto de la app
function App() {
  return (
    <GoalContext.Provider value={7}>
      <LuckyN />
    </GoalContext.Provider>
  );
}

// 3. Consumirlo en el componente que lo necesite
function Die({ val }) {
  const goal = useContext(GoalContext);
  return <div>{val === goal ? "⭐" : val}</div>;
}

```

Aquí `Die` accede al `goal` directamente con `useContext`, sin que `LuckyN` ni `Dic`e tengan que pasarlo.

### Resumen rápido

- **Prop drilling** → está bien cuando la jerarquía es corta y el dato está localizado.
- **Context** → útil cuando un mismo dato se necesita en muchos lugares de la app o a través de varios niveles.
- Usa Context con cuidado: si lo aplicas en exceso, puede hacer más difícil entender de dónde vienen los datos.

## Separar lógica y presentación

En React conviene distinguir entre:

- **Componentes de lógica (containers)** → gestionan el estado y la lógica de negocio.
- **Componentes de presentación (presentational)** → reciben props y solo muestran la UI.

Lucky Seven como ejemplo

- **LuckyN** → es el container: guarda el estado de los dados, define la función roll y decide si hay victoria.
- **Dice, Die y Button** → son presentacionales: reciben datos o funciones y los renderizan sin saber nada de la lógica del juego.

> Este patrón hace que el código sea más modular, fácil de probar y que los componentes visuales puedan reutilizarse en otros proyectos.


## Ejemplo completo

Observa y prueba la app de esta sección: 
- [Lucky Seven](../05_ComponentDesign/lucky-seven/).

## Quiz de la sección
Para terminar, [aquí](./quiz05.md) tienes algunas preguntas para comprobar si has interiorizado bien los conceptos vistos en esta sección. Si no has dado una con las respuestas, quizá sea buena idea volver a darle un repasito a la lección.  

---

[Volver al inicio](../README.md) - [<- Lección anterior](./04_ReactStateIntermediate.md) | [Siguiente lección ->](./06_SideEffects.md)