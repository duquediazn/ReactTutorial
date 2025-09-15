# React State

## Índice de contenidos
- [Introducción a `state`](#introducción-a-state)
- [`useState`: sintaxis y valor inicial](#usestate-sintaxis-y-valor-inicial)
- [Actualizar el estado con el valor previo](#actualizar-el-estado-con-el-valor-previo)
- [Renderizado condicional con `&&`](#renderizado-condicional-con-)
- [Referencias con `useRef`](#referencias-con-useref)
- [Formularios en React](#formularios-en-react)
- [Manejo de eventos en React](#manejo-de-eventos-en-react)
- [Ejemplo completo](#ejemplo-completo)
- [Resumen rápido](#resumen-rápido)
- [Quiz de la sección](#quiz-de-la-sección)

---
## Introducción a `state`

En la sección anterior aprendimos que los componentes reciben datos mediante **props**, que funcionan como los **argumentos de una función**: vienen “de fuera” y el componente no debe modificarlos.  

Sin embargo, muchas veces necesitamos valores que cambian **dentro del propio componente**:  
- Contadores que suben o bajan.  
- Inputs de formularios que se actualizan al escribir.  
- Elementos que aparecen o desaparecen al hacer clic.  

Para estos casos usamos el **estado** o `state`.  

Podemos pensar así:  
- **Props** → datos que llegan **desde arriba** (inmutables).  
- **State** → datos que un componente maneja y cambia por sí mismo (mutables).  

React nos ofrece el **hook `useState`** para crear y actualizar estado dentro de un componente funcional:

```jsx
import React from "react"

export default function Counter() {
  const [count, setCount] = React.useState(0)

  return (
    <div>
      <p>Has hecho clic {count} veces</p>
      <button onClick={() => setCount(count + 1)}>Incrementar</button>
    </div>
  )
}
```

### Puntos clave
- useState devuelve un par: [valor, setValor].
- Nunca modificamos el valor directamente (count = count + 1), **siempre** usamos la función setCount.
- Cuando llamamos a setCount, React re-renderiza el componente mostrando el nuevo valor.

> Recuerda: React vuelve a ejecutar la función del componente cuando cambian sus props o su estado. La UI siempre es una función del estado:
```
Vista = función(estado)
```

---

## `useState`: sintaxis y valor inicial

Hasta ahora hemos visto el uso de `React.useState`, pero lo habitual es **importar el hook directamente** para no tener que escribir siempre `React.`:

```jsx
import { useState } from "react"

export default function Counter() {
  const [count, setCount] = useState(0)
  //          ↑       ↑
  //     valor   función que actualiza el valor
}
```

### ¿Qué significa el 0?

El argumento que pasamos a useState es el valor inicial del estado.

- useState(0) → empieza con el número 0.
- useState("") → empieza con un string vacío.
- useState([]) → empieza con un array vacío.
- useState(null) → empieza “sin valor” hasta que lo asignemos.

Ejemplo con un input controlado:
```jsx
const [name, setName] = useState("")

<input 
  type="text"
  value={name}
  onChange={(e) => setName(e.target.value)}
/>
```
> El valor inicial define el tipo de dato que manejará el estado durante toda la vida del componente.

---

## Actualizar el estado con el valor previo

Muchas veces necesitamos calcular el **nuevo valor del estado** a partir del valor anterior.  
En estos casos no conviene hacer directamente:

```jsx
setCount(count + 1) // puede dar problemas si React agrupa varias actualizaciones
```

Lo recomendable es pasarle a la función setState un callback que recibe el valor previo:

```jsx
setCount(prevCount => prevCount + 1) // seguro y predecible
```

Esto garantiza que, aunque React ejecute varias actualizaciones de estado en paralelo, siempre tendremos la versión más reciente del valor.

Ejemplo con un contador:
```jsx
import { useState } from "react"

export default function Counter() {
  const [count, setCount] = useState(0)

  function increment() {
    setCount(prev => prev + 1)
  }

  return (
    <>
      <p>Clicks: {count}</p>
      <button onClick={increment}>+1</button>
    </>
  )
}
```

Esta misma idea la aplicamos en la [aplicación de ejemplo](../03_ReactState/src/components/Main.jsx) de esta sección:
```jsx
setIngredients(prevIngredients => [...prevIngredients, newIngredient])
```
Aquí tomamos el array previo de ingredientes y le añadimos el nuevo, generando un array actualizado que React puede renderizar.

---

## Renderizado condicional con `&&`

En JSX no podemos usar sentencias como `if` directamente dentro del `return`, pero sí podemos usar **expresiones**.  
Una de las formas más comunes en React es aprovechar el operador lógico `&&`.

### Ejemplo simple
```jsx
{isLoggedIn && <p>Bienvenido de nuevo</p>}
```

- Si isLoggedIn es true, React renderiza el párrafo.
- Si isLoggedIn es false, React no renderiza nada.

### Ejemplo en nuestra app de recetas

```jsx
{ingredients.length > 0 && 
  <IngredientsList 
    ingredients={ingredients} 
    getRecipe={getRecipe}
    ref={recipeSection}
  />
}
```
Aquí la lista de ingredientes solo se muestra si el array no está vacío. Del mismo modo, mostramos la receta solo si existe un texto en el estado:

```jsx
{recipe && <ClaudeRecipe recipe={recipe} />}
```

> Resumen: el operador && es muy útil en React para mostrar u ocultar elementos de forma declarativa sin tener que escribir un if completo.

---

## Referencias con `useRef`

Además de props y state, en React también podemos usar **refs** para guardar información entre renderizados sin provocar un re-render.  

Un caso muy común es cuando necesitamos **acceder a un elemento del DOM** directamente, sin tener que asignarle un `id`.

### Ejemplo simple
```jsx
import { useRef } from "react"

export default function TextInput() {
  const inputRef = useRef(null)

  function focusInput() {
    inputRef.current.focus()
  }

  return (
    <>
      <input ref={inputRef} type="text" />
      <button onClick={focusInput}>Focus</button>
    </>
  )
}
```
- useRef(null) crea una referencia con { current: null }.
- React asigna la referencia al nodo DOM al renderizar (inputRef.current → <input>).
- Cambiar inputRef.current no provoca un re-render.

### Ejemplo en la app de recetas

En nuestro ejemplo, usamos una ref para desplazarnos automáticamente hasta la sección de la receta cuando se genera un nuevo texto:
```jsx
const recipeSection = useRef(null)

useEffect(() => {
  if (recipe !== "" && recipeSection.current !== null) {
    recipeSection.current.scrollIntoView({ behavior: "smooth" })
  }
}, [recipe])
```

- Creamos la ref con useRef(null).
- La pasamos al JSX:
```jsx
<IngredientsList ref={recipeSection} ... />
```

Cada vez que el estado recipe cambia, el efecto la usa para hacer scroll hasta esa sección.

### Resumen:

- Usa refs cuando necesites guardar un valor mutable que no dispara un re-render (ej. acceso a nodos DOM).
- A diferencia del state, cambiar ref.current no actualiza la UI automáticamente.

Nota que en este ejemplo usamos `useEffect()`, que aún no hemos introducido. En la [siguiente sección](./06_SideEffects.md) explicamos en detalle qué son los React Effects y cuando usarlos.

---

## Formularios en React

Trabajar con formularios en React es diferente a hacerlo con **HTML + JavaScript vanilla**.  
En React no dejamos que el DOM sea la fuente de verdad, sino que usamos el **estado de React** como “single source of truth”.

### Diferencias HTML vs React

En formularios clásicos con HTML:
- Los valores viven en el DOM y los leemos con `input.value`.
- Atributos como `for`, `class`, `checked` o `value` se usan directamente.

En React:
- Cambian algunos nombres para alinearse con las propiedades del DOM en JavaScript:
  - `for` → `htmlFor`
  - `class` → `className`
  - `maxlength` → `maxLength`
  - `checked` → `defaultChecked` (para el valor inicial de checkboxes/radios)
  - `value` → `defaultValue` (para el valor inicial de inputs o selects)

Ejemplo mínimo:

```jsx
<label htmlFor="username">Nombre de usuario</label>
<input id="username" name="username" defaultValue="" />
```

### Controlled components

En React solemos trabajar con **controlled components**:
- React controla **qué se muestra** (el `value` del input proviene del estado).
- Cuando el usuario escribe, el evento `onChange` actualiza ese estado.
- Así, el input siempre refleja el estado actual.

Ejemplo:
```jsx
const [name, setName] = useState("")

<input 
  type="text" 
  value={name} 
  onChange={e => setName(e.target.value)} 
/>
```
> De este modo el **estado** es la única fuente de verdad.  
> Lo contrario sería un **uncontrolled component**, donde el valor vive en el DOM (ej. usando `defaultValue` o consultando el DOM directamente (`document.querySelector`, `input.value`, etc.)).

### Múltiples inputs controlados

Cuando un formulario tiene varios campos, podemos manejar todo en un único estado de objeto.  
Cada input actualiza la propiedad correspondiente con `onChange`.

Ejemplo:
```jsx
const [formData, setFormData] = useState({
  username: "",
  email: "",
  age: ""
})

function handleChange(e) {
  const { name, value } = e.target
  setFormData(prev => ({
    ...prev,
    [name]: value // computed property name
  }))
}

function handleSubmit(e) {
  e.preventDefault()
  console.log("Datos enviados:", formData)
  // aquí podrías llamar a una API, resetear el formulario, etc.
}

<form onSubmit={handleSubmit}>
  <input 
    type="text" 
    name="username" 
    value={formData.username} 
    onChange={handleChange} 
    placeholder="Nombre de usuario" 
  />
  <input 
    type="email" 
    name="email" 
    value={formData.email} 
    onChange={handleChange} 
    placeholder="Correo electrónico" 
  />
  <input 
    type="number" 
    name="age" 
    value={formData.age} 
    onChange={handleChange} 
    placeholder="Edad" 
  />
  <button type="submit">Enviar</button>
</form>
```

#### Computed property names
En un objeto literal, cuando ponemos [name]: value, no estamos creando una propiedad que literalmente se llama "name", sino que usamos el valor de la variable name como nombre de la propiedad.

En este patrón:
- El estado `formData` es la **única fuente de verdad**.  
- Cada input está vinculado a una propiedad del objeto.  
- `handleChange` es una función genérica que sirve para cualquier input que tenga `name`.  
- `handleSubmit` permite procesar el objeto completo `formData` en el momento del envío.  

### Captura de datos con FormData

A veces no necesitamos controlar cada input individualmente y podemos usar **FormData** en el `onSubmit`:
```jsx
function handleSubmit(e) {
  e.preventDefault()
  const formData = new FormData(e.target)
  const data = Object.fromEntries(formData) 
  console.log(data)
}
```
- `formData.get("campo")` → obtiene un único valor.
- `formData.getAll("campo")` → útil para inputs con **múltiples valores** (ej. checkboxes).
- `Object.fromEntries(formData)` convierte los pares clave-valor en un objeto de JavaScript.

Ejemplo con valores múltiples:
```jsx
const data = {
  ...Object.fromEntries(formData),
  intereses: formData.getAll("intereses")
}
```

### Cuándo usar cada técnica

- **Controlled components** → cuando quieras validación en vivo, sincronizar UI y estado, mostrar errores, etc.  
- **FormData (uncontrolled)** → cuando no necesitas manipular cada valor en tiempo real y basta con leerlos al enviar.  

### Resumen

- En HTML vanilla → el DOM es la fuente de verdad (`input.value`).  
- En React → el **estado** es la fuente de verdad (controlled components).  
- Algunos atributos cambian de nombre (`for` → `htmlFor`, `class` → `className`, etc.).  
- Para capturar datos completos del formulario puedes usar `FormData`.  
- Usa `getAll` para inputs con múltiples valores.  
- Elige entre controlled o uncontrolled según las necesidades de tu app.

Estos conceptos de formularios están muy ligados al estado (useState) y a los efectos (useEffect), que podemos ver en más detalle en su [sección correspondiente](./06_SideEffects.md). 

---

## Manejo de eventos en React

En React los eventos funcionan de forma similar a los del navegador, pero con algunas diferencias:

- Se escriben en **camelCase**: `onclick` → `onClick`, `onchange` → `onChange`.  
- En lugar de cadenas, pasamos directamente **funciones**.  
- React usa un **SyntheticEvent**, pero se comporta casi igual que los eventos del DOM (`e.preventDefault()`, `e.target.value`, etc.).

### Convención: funciones manejadoras
Aunque a veces usamos funciones inline, lo recomendable es separar la lógica en funciones con nombres claros (ej. `handleClick`, `handleSubmit`):

```jsx
function Counter() {
  const [count, setCount] = useState(0)

  function handleClick() {
    setCount(prev => prev + 1)
  }

  return (
    <>
      <p>Clicks: {count}</p>
      <button onClick={handleClick}>+1</button>
    </>
  )
}
```

### Eventos en formularios

En formularios usamos onSubmit y onChange:
```jsx
function FormExample() {
  const [name, setName] = useState("")

  function handleSubmit(e) {
    e.preventDefault()
    console.log("Enviado:", name)
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="name">Nombre</label>
      <input 
        id="name"
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <button>Enviar</button>
    </form>
  )
}

```
### Resumen:
- Los eventos en React siguen las convenciones del DOM pero en camelCase.
- Se recomienda extraer la lógica a funciones manejadoras con nombres claros.
- Formularios: onSubmit en el <form> y onChange en los inputs.

---

## Resumen rápido

- **Props vs State**:  
  - *Props* → datos que vienen “de fuera”, inmutables.  
  - *State* → datos internos de un componente, mutables mediante `useState`.  

- **useState**:  
  - `[valor, setValor] = useState(inicial)` → define estado y su función de actualización.  
  - El valor inicial define el tipo de dato (`0`, `""`, `[]`, `null`…).  
  - Para calcular un nuevo estado a partir del anterior usamos un callback:  
    `setState(prev => nuevoValor)`.

- **Renderizado condicional**:  
  - Se suele usar `&&` en JSX para mostrar/ocultar elementos:  
    `{condición && <Componente />}`.  

- **Refs (`useRef`)**:  
  - Guardan valores mutables que **no provocan re-render**.  
  - Útiles para acceder a nodos del DOM (`ref.current`).  

- **Formularios**:  
  - `class` → `className`, `for` → `htmlFor`, `checked` → `defaultChecked`.  
  - `FormData` permite extraer valores: `.get()`, `.getAll()`, `Object.fromEntries()`.  
  - En React solemos trabajar con inputs **controlados** mediante `state`. 
   
- **Eventos en React**:  
  - Sintaxis en **camelCase**: `onClick`, `onChange`, `onSubmit`.  
  - Se pasan **funciones** como manejadores, no cadenas de texto.  
  - Convención: extraer la lógica a funciones con nombres claros (`handleClick`, `handleSubmit`).  
  - En formularios:  
    - `onSubmit` en el `<form>` junto con `e.preventDefault()` si queremos manejarlo manualmente.  
    - `onChange` en los inputs para mantenerlos sincronizados con el `state`.  

> 💡 React re-renderiza un componente **cuando cambian sus props o su estado**. La UI siempre se entiende como:  
```
Vista = función(estado)
```

### Enlaces de interés 
Puedes ampliar lo aprendido en esta sección y ver en más detalle cómo trabajar con formularios y eventos en React en los siguientes enlaces:
 * https://es.react.dev/learn/responding-to-events
 * https://es.react.dev/reference/react-dom/components/common#mouseevent-handler
 * https://es.react.dev/reference/react-dom/components/form

---

## Ejemplo completo
Ahora que ya hemos visto qué son los props, como se pasan a los componentes, etc., podemos echarle un vistazo a la app de ejemplo para esta sección. 

Observa y prueba el código en la carpeta [03_ReactState](../03_ReactState/). 

---

## Quiz de la sección
Para terminar, [aquí](./quiz03.md) tienes algunas preguntas para comprobar si has interiorizado bien los conceptos vistos en esta sección. Si no has dado una con las respuestas, quizá sea buena idea volver a darle un repasito a la lección.  

---

[Volver al inicio](../README.md) - [<- Lección anterior](./02_DataDrivenReact.md) | [Siguiente lección ->](./04_ReactStateIntermediate.md)