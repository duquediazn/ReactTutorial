# Side Effects

## ¿Qué es un “efecto” en React?

Un **side effect** es cualquier trabajo que ocurre **fuera del render** o que sincroniza tu componente con algo **externo**: llamadas a APIs, suscripciones, timers, manipulación del DOM, etc. Para eso usamos el hook **useEffect**.

En la app de ejemplo ([Meme Generator](../06_SideEffects/)), el efecto se usa para **traer los memes** desde la API de Imgflip cuando el componente `Main` se monta.

Main.jsx (extracto):
```jsx
import { useState, useEffect } from "react"

export default function Main() {
  const [meme, setMeme] = useState({
    topText: "One does not simply",
    bottomText: "walks into Mordor",
    imgUrl: "http://i.imgflip.com/1bij.jpg"
  })

  const [allMemes, setAllMemes] = useState([])

  useEffect(() => {
    fetch("https://api.imgflip.com/get_memes")
      .then(res => res.json())
      .then(data => setAllMemes(data.data.memes))
  }, []) // deps vacías → solo corre una vez al montar

  // ...
}
```

### Por qué aquí usamos useEffect

- **Cargar datos** desde una API es un efecto secundario (no forma parte del cálculo puro del JSX).
- Con deps vacías `[]`, el efecto corre **una sola vez** tras el primer render (evitamos bucles infinitos).
- Llamar a `setAllMemes(...)` actualiza el estado y provoca un **re-render** con los datos ya cargados.

> Regla mental: **render primero, efecto después**. El render debe ser “puro”; el efecto se encarga de lo externo.

### ¿Por qué `[]` y no otra cosa?

- `[]` → ejecutar solo al montar (patrón típico para “fetch-on-mount”).
- `[algo]` → se ejecuta cada vez que cambie `algo`.
- Sin deps → el efecto corre después de **cada render**, lo que aquí causaría una tormenta de peticiones.

### Cómo encaja con el resto de la app

- `allMemes` se llena con la lista de memes.
- Al pulsar el botón **“Get a new meme image 🖼”**, se elige una URL aleatoria del array y se actualiza `meme.imgUrl`:

```jsx
function getMemeImage() {
  const randomNumber = Math.floor(Math.random() * allMemes.length)
  const newMemeUrl = allMemes[randomNumber].url
  setMeme(prev => ({ ...prev, imgUrl: newMemeUrl }))
}
```

- Los inputs `topText` y `bottomText` son **controlados**: `handleChange` actualiza el estado y el texto aparece sobre la imagen.

### Buenas prácticas para este patrón

- Puedes usar `async/await` dentro del efecto envolviendo la función:

```jsx
useEffect(() => {
  async function loadMemes() {
    const res = await fetch("https://api.imgflip.com/get_memes")
    const data = await res.json()
    setAllMemes(data.data.memes)
  }
  loadMemes()
}, [])
```

- Añade manejo de **errores** y **estado de carga** si lo necesitas.
- No hace falta **cleanup** (`return () => { ... }`) en este caso, porque no hay suscripciones ni listeners, solo una petición puntual.

---

## Dependencias del efecto

El segundo argumento de `useEffect` es el **array de dependencias**.  
Le indica a React **cuándo debe volver a ejecutar el efecto**.

### Casos principales

1. **Array vacío `[]`**  
   - El efecto se ejecuta **solo una vez**, al montar el componente.  
   - Útil para operaciones de inicialización: fetch de datos, configurar algo puntual, etc.  
   - Ejemplo en nuestra app (traer los memes al iniciar):
```jsx
   useEffect(() => {
     fetch("https://api.imgflip.com/get_memes")
       .then(res => res.json())
       .then(data => setAllMemes(data.data.memes))
   }, []) // ← solo una vez
```

2. **Dependencias específicas `[algo]`**  
   - El efecto se ejecuta cada vez que cambia `algo`.  
   - Ejemplo: imaginemos que queremos mostrar un mensaje en consola cada vez que cambie el meme actual:

```jsx
   useEffect(() => {
     console.log("Meme actualizado:", meme.imgUrl)
   }, [meme.imgUrl])
```
   - Aquí el efecto no corre al cambiar cualquier cosa, **solo cuando cambia la URL de la imagen**.


3. **Sin array de dependencias**  
   - El efecto se ejecuta **después de cada render**.  
   - Esto es raro que lo queramos: puede provocar bucles infinitos si el efecto actualiza el estado dentro.  
   - Ejemplo peligroso:

```jsx
   useEffect(() => {
     setAllMemes([])
   }) // sin deps → cada render limpia → provoca renders infinitos
```

### Cómo pensar las dependencias

- Pregunta: **¿de qué valores externos depende este efecto para funcionar bien?**  
- Esos valores deben estar en el array de deps.  
- Si el efecto no depende de nada → usa `[]`.  
- Si depende de props o estado → inclúyelos explícitamente.


### Trampas típicas

- **Olvidar una dependencia** → el efecto no se actualizará cuando debería.  
- **Poner de más** → puede causar ejecuciones innecesarias.  
- **Funciones inline** → cuidado: si defines una función dentro del componente, técnicamente cambia en cada render.  
  - Soluciones:  
    - Mover la función fuera del componente.  
    - O envolverla con `useCallback` si de verdad debe ir en las deps.


> Resumen: el array de dependencias es la forma de **sincronizar tu componente con el mundo externo** de forma precisa, evitando tanto ejecuciones de más como datos desactualizados.

---

## Cleanup en efectos

Un efecto en React puede devolver una función.  
Esa función se ejecuta cuando el componente se desmonta o justo antes de que el efecto se vuelva a ejecutar.  
A esto se le llama **cleanup**.

### Ejemplo 1: temporizador con setInterval

Supongamos un contador que aumenta cada segundo:
```jsx
import { useState, useEffect } from "react"

function Timer() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setCount(prev => prev + 1)
    }, 1000)

    // cleanup → limpiar el intervalo
    return () => {
      clearInterval(id)
    }
  }, [])

  return <p>Segundos: {count}</p>
}
```
- Sin el cleanup, el intervalo seguiría ejecutándose incluso después de desmontar el componente → fuga de memoria.  
- Con `clearInterval`, React lo limpia al desmontar.

---

### Ejemplo 2: listener del navegador

Podemos escuchar el evento `resize` de la ventana:
```jsx
import { useEffect, useState } from "react"

function WindowSize() {
  const [width, setWidth] = useState(window.innerWidth)

  useEffect(() => {
    function handleResize() {
      setWidth(window.innerWidth)
    }

    window.addEventListener("resize", handleResize)

    // cleanup → eliminar el listener
    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return <p>Width: {width}px</p>
}
```
- Sin el cleanup, si el componente se desmonta, el listener queda “huérfano” y puede intentar actualizar un componente que ya no existe.  

### Regla general

> **Siempre que un efecto cree algo que persiste fuera del render (intervalos, listeners, suscripciones, etc.), debe devolver un cleanup para limpiarlo.**

### Nuestro Meme Generator

En la app del Meme Generator no necesitamos cleanup porque:  
- El efecto solo hace un `fetch` una vez.  
- No deja listeners ni intervalos activos.  

Por eso devolvimos `undefined` y no una función.

---

## Sincronización con props/estado

Los efectos no solo sirven para “traer datos”. También se usan para **sincronizar el componente con el exterior** cuando **cambia** algún valor de props o de estado.

En el Meme Generator podemos ilustrarlo con dos casos:

### 1. Actualizar el título de la pestaña cuando cambie el meme

Queremos que `document.title` muestre un resumen del meme actual (por ejemplo, el `topText`):

```jsx
import { useEffect } from "react"

useEffect(() => {
  document.title = `Meme: ${meme.topText || "Meme generator"}`
}, [meme.topText])

```
- Dependemos de `meme.topText`: solo cambiamos el título cuando ese valor cambie.
- No necesitamos cleanup porque solo asignamos un string a `document.title`.

### 2. Guardar el último meme en localStorage

Cada vez que el usuario cambia la imagen o los textos, persistimos el estado para recuperarlo al volver:

```jsx
import { useEffect } from "react"

useEffect(() => {
  // se ejecuta cada vez que cambie cualquiera de estas propiedades
  localStorage.setItem("lastMeme", JSON.stringify(meme))
}, [meme.topText, meme.bottomText, meme.imgUrl])

```
Y al **montar** el componente (una sola vez), intentamos cargarlo si existe:

```jsx
useEffect(() => {
  const saved = localStorage.getItem("lastMeme")
  if (saved) {
    try {
      setMeme(JSON.parse(saved))
    } catch {}
  }
}, [])
```

Notas:
- En el efecto “guardar”, elegimos deps explícitas (`topText`, `bottomText`, `imgUrl`) para evitar re-ejecuciones por cambios de referencia innecesarios.
- En el efecto “cargar”, usamos `[]` porque solo queremos leer localStorage **al montar**.

### Patrones útiles

- “Derivar” el ámbito del efecto de sus **dependencias**:
  - Si depende de `meme.imgUrl` → pon `meme.imgUrl` en el array de deps.
  - Si depende de varias propiedades → enuméralas o usa una versión memorizada del objeto.
- Mantén los efectos **enfocados a una sola responsabilidad**:
  - Un efecto para título.
  - Otro distinto para persistencia en `localStorage`.
  - Evita “mega-efectos” que mezclan varias cosas.

### Cuándo NO usar un efecto

- Si algo puede **calcularse durante el render** (por ejemplo, `isWinner = sum === goal`), no lo metas en un efecto.
- `useEffect` es para sincronizar con **sistemas externos** o ejecutar **lógica después del render**; no para computar valores puros que dependen solo de props/estado.

---

## Render vs efectos: ¿qué va en cada sitio?

Un error común al empezar con React es mezclar código de **render** con código de **efectos**.

### Render = debe ser puro
- La función de un componente React se ejecuta cada vez que se renderiza.  
- Su trabajo es **calcular JSX** en función de props y estado.  
- No debe tener efectos secundarios (llamadas a APIs, `setInterval`, manipulación del DOM).  
- Debe ser **determinista**: si le das las mismas props/estado, debe devolver el mismo resultado en JSX.

### Efectos = sincronizar con el exterior
- Con `useEffect` decimos: “después de pintar la UI, haz también este trabajo externo”.  
- Ahí sí podemos poner código que interactúe con APIs, el DOM, localStorage, etc.

### Por qué no hacer fetch en el render
Si pusieras el `fetch` directamente en el cuerpo del componente:

```jsx
function Main() {
  fetch("https://api.imgflip.com/get_memes") // cada render vuelve a pedir los datos
  // ...
}
```
- Provocarías una petición en **cada render**, creando un bucle infinito (porque el fetch actualiza el estado y dispara otro render).  
- Además, el render deja de ser puro: su resultado depende de un efecto colateral.

### Resumen:  
- **Render** = calcular JSX de forma pura a partir de props/estado.  
- **Efectos** = ejecutar lógica externa después de renderizar (fetch, subscripciones, timers, manipulación de DOM, etc.).  
- Separar ambas cosas evita bucles, fugas de memoria y código impredecible.

---

## Buenas prácticas con efectos

Trabajar con `useEffect` parece sencillo, pero hay varios detalles que marcan la diferencia entre un código limpio y uno difícil de mantener.

### 1. Manejo de estados de carga y error
Al hacer fetch conviene reflejar si los datos están cargando o si falló la petición.

```jsx
const [allMemes, setAllMemes] = useState([])
const [loading, setLoading] = useState(true)
const [error, setError] = useState(null)

useEffect(() => {
  async function loadMemes() {
    try {
      setLoading(true)
      const res = await fetch("https://api.imgflip.com/get_memes")
      if (!res.ok) throw new Error("Network error")
      const data = await res.json()
      setAllMemes(data.data.memes)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }
  loadMemes()
}, [])

return (
  <main>
    {loading && <p>Cargando...</p>}
    {error && <p style={{color: "red"}}>{error}</p>}
    {!loading && !error && <MemeList memes={allMemes} />}
  </main>
)
```

### 2. Dividir efectos grandes en varios pequeños
En lugar de un mega `useEffect` que hace de todo, crea efectos separados con dependencias claras.

- Uno para cargar datos.
- Otro para sincronizar con localStorage.
- Otro para actualizar el título de la pestaña.

Así cada efecto tiene una sola responsabilidad.

### 3. Evitar dependencias innecesarias
Incluye en el array de deps **solo** lo que realmente cambie el resultado del efecto.
- ✅ Correcto: `[meme.imgUrl]`
- ❌ Incorrecto: `[meme]` (cambia la referencia en cada render → provoca ejecuciones de más).

### 4. Cleanup siempre que corresponda
Si creas intervalos, listeners o suscripciones → limpia en el return.
Si el efecto es un fetch único → no necesitas cleanup.

### 5. Colocar efectos en el nivel correcto
- No metas `useEffect` dentro de bucles, condicionales o funciones.
- Deben estar siempre al **nivel superior del componente**, igual que los hooks de estado.

### 6. Pensar en el ciclo de vida
React “simula” las fases de montar, actualizar y desmontar mediante:
- `[]` → solo al montar.
- `[deps]` → al montar y cuando cambien esas deps.
- `return () => {}` → al desmontar o antes de re-ejecutar el efecto.

### Resumen:  
- Maneja loading/error.  
- Divide efectos por responsabilidad.  
- Incluye dependencias precisas.  
- Limpia recursos cuando sea necesario.  
- Usa siempre hooks en el nivel superior.  
- Piensa en montar/actualizar/desmontar para decidir tu array de deps.

---

## Resumen

- Un **efecto** es cualquier trabajo que ocurre fuera del render: fetch de datos, suscripciones, timers, manipulación del DOM, etc.  
- `useEffect` se ejecuta **después del render** y sirve para sincronizar el componente con el mundo exterior.  
- El array de **dependencias** controla cuándo se ejecuta el efecto:  
  - `[]` → solo al montar.  
  - `[algo]` → al montar y cada vez que cambie `algo`.  
  - Sin array → después de **cada render** (poco común y peligroso).  
- Los efectos pueden devolver una función de **cleanup**, que se ejecuta al desmontar o antes de re-ejecutar el efecto.  
- Usa cleanup siempre que crees recursos persistentes (intervalos, listeners, suscripciones).  
- No mezcles lógica externa en el render: el render debe ser **puro** (solo calcular JSX a partir de props/estado).  
- Buenas prácticas:  
  - Manejar `loading` y `error` al hacer fetch.  
  - Dividir efectos grandes en varios pequeños con una sola responsabilidad.  
  - Incluir dependencias precisas, ni de más ni de menos.  
  - Mantener los hooks siempre en el nivel superior del componente.  
- Regla mental: **Render primero, efectos después**.  

## Ejemplo completo

Observa y prueba la app de esta sección: 
- [Meme Generator](../06_SideEffects/).

---

## Quiz de la sección
Para terminar, [aquí](./quiz06.md) tienes algunas preguntas para comprobar si has interiorizado bien los conceptos vistos en esta sección. Si no has dado una con las respuestas, quizá sea buena idea volver a darle un repasito a la lección.  

---

[Volver al inicio](../README.md) - [<- Lección anterior](./05_ComponentDesign.md) | [Siguiente lección ->](./07_BuildYDespliegue.md)