# Tratas datos en React (props + keys)

## Índice de contenidos
- [Datos locales: importar un “mock” de base de datos](#datos-locales-importar-un-mock-de-base-de-datos)
- [Renderizar listas con `.map()` y usar `key`](#renderizar-listas-con-map-y-usar-key)
- [Pasar datos a los componentes: `props`](#pasar-datos-a-los-componentes-props)
- [Resumen rápido](#resumen-rápido)
- [Ejemplo completo](#ejemplo-completo)
- [Convenciones para aplicar estilos en React](#convenciones-para-aplicar-estilos-en-react)
- [Quiz de la sección](#quiz-de-la-sección)

---

## Datos locales: importar un “mock” de base de datos

Usaremos un módulo `data.js` que **exporta por defecto** (`export default`) un array de objetos; esto nos permite simular los datos que nos daría una API/BD e importarlos con un nombre libre en `App.jsx`. La exportación por defecto indica que el archivo tiene “un valor principal” y, al **importarlo**, no necesitamos llaves.

data.js (resumen):
```js
export default [
  { id: 1, img: { src: "...", alt: "Mount Fuji" }, title: "Mount Fuji", country: "Japan", googleMapsLink: "...", dates: "12 Jan, 2021 - 24 Jan, 2021", text: "..." },
  { id: 2, img: { src: "...", alt: "Sydney Opera House" }, title: "Sydney Opera House", country: "Australia", googleMapsLink: "...", dates: "27 May, 2021 - 8 Jun, 2021", text: "..." },
  { id: 3, img: { src: "...", alt: "Geirangerfjord" }, title: "Geirangerfjord", country: "Norway", googleMapsLink: "...", dates: "01 Oct, 2021 - 18 Nov, 2021", text: "..." }
]
```

App.jsx (import):
```jsx
import data from "./data"
```
💡 Ventajas de este enfoque:
- Es **determinista** y rápido para desarrollar sin depender de una API real.
- El **shape** (estructura) de cada objeto queda claro (por ejemplo, `img` es un objeto con `src` y `alt`), lo cual ayuda a tipar/validar más adelante si decides usar TypeScript o PropTypes.

---

---

## Renderizar listas con `.map()` y usar `key`
En JSX podemos evaluar **expresiones de JavaScript** envolviéndolas entre llaves `{ }`.  

Por ejemplo:
```jsx
<h1>{2 + 2}</h1> // renderiza "4"
<p>{new Date().getFullYear()}</p> // renderiza el año actual
```

Esto es lo que nos permite insertar en el JSX el resultado de data.map(...) para renderizar múltiples componentes dinámicamente.

En App.jsx recorremos el array de datos con .map() para generar un componente Entry por cada objeto.
Cada elemento necesita una propiedad especial key que identifique de forma única a cada entrada:

En `App.jsx` recorremos el array de datos con `.map()` para generar un componente `Entry` por cada objeto.  
Cada elemento necesita una **propiedad especial `key`** que identifique de forma única a cada entrada:

```jsx
import Header from "./components/Header"
import Entry from "./components/Entry"
import data from "./data"

export default function App() {
  const entryElements = data.map((entry) => {
    return (
      <Entry
        key={entry.id}
        {...entry} // pasamos todas las propiedades de entry como props
      />
    )
  })

  return (
    <>
      <Header />
      <main className="container">
        {entryElements}
      </main>
    </>
  )
}
```
### ¿Por qué es importante la key?
- Ayuda a React a saber qué elementos cambiaron, se añadieron o se eliminaron.
- Evita renders innecesarios y posibles errores visuales al actualizar listas.
- Nunca uses el índice del array (key={index}) salvo que estés seguro de que la lista no va a cambiar.

---

## Pasar datos a los componentes: `props`

En React, los componentes reciben datos a través de **props** (properties).  Como sabemos, un componente no es más que una **función de JavaScript que devuelve JSX**, podemos entonces entender los `props` como los **argumentos** que se le pasan a dicha función.    
En nuestro ejemplo, `App.jsx` envía la información de cada entrada al componente `Entry`.

Hay varias formas de hacerlo:

### 1. Pasando props uno a uno
```jsx
<Entry
  key={entry.id}
  img={entry.img}
  title={entry.title}
  country={entry.country}
  googleMapsLink={entry.googleMapsLink}
  dates={entry.dates}
  text={entry.text}
/>
```

En Entry.jsx las recibimos como propiedades del objeto props:
```jsx
<img src={props.img.src} alt={props.img.alt} />
<h2>{props.title}</h2>
```

### 2. Pasar el objeto completo
También podríamos pasar el objeto entero:
```jsx
<Entry key={entry.id} entry={entry} />
```

En Entry.jsx accederíamos como:
```jsx
<img src={props.entry.img.src} alt={props.entry.img.alt} />
<h2>{props.entry.title}</h2>
```

### 3. Usar el operador spread
Otra forma es “expandir” el objeto con el operador ... como hicimos en la sección anterior:
```jsx
<Entry key={entry.id} {...entry} />
```

Esto equivale a pasar todas las propiedades del objeto como props individuales.
De esta manera, en Entry.jsx volvemos a acceder como en el primer caso:
```jsx
<img src={props.img.src} alt={props.img.alt} />
<h2>{props.title}</h2>
```

### Resumen:
- Fíjate en que las distintas propiedades que se pasan al componente Entry no se separan por `,`, solo con espacio.
- Si el componente solo necesita algunas propiedades → props uno a uno.
- Si queremos flexibilidad → pasar el objeto completo.
- Si queremos brevedad y el componente usará casi todas las propiedades → operador ...spread.

---

## Resumen rápido

- Para renderizar listas en React usamos `.map()`, generando un componente por cada elemento.  
- Es obligatorio usar una **propiedad `key` única** al renderizar listas → evita renders innecesarios y errores de UI.  
- Los datos llegan a los componentes mediante **props**:
  - Props uno a uno → mayor control.  
  - Objeto completo (`entry={entry}`) → agrupar datos.  
  - Spread (`{...entry}`) → sintaxis breve y clara cuando usamos casi todas las propiedades.  

---

## Ejemplo completo
Ahora que ya hemos visto qué son los props, como se pasan a los componentes, etc., podemos echarle un vistazo a la app de ejemplo para esta sección. 

Observa y prueba el código en la carpeta [02_DataDrivenReact](../02_DataDrivenReact/). 

---

## Convenciones para aplicar estilos en React

Aunque se puede enlazar un `index.css` global desde `index.html`, en React lo habitual es **separar los estilos por componente**.  
La convención más común es:

- Crear un archivo CSS con el mismo nombre que el componente (`Header.jsx` → `Header.css`).  
- Importar ese archivo directamente dentro del componente:  

```jsx
import "./Header.css"

export default function Header() {
  return (
    <header className="header">
      <h1>My travel journal</h1>
    </header>
  )
}
```

### Ventajas de este enfoque:
- Los estilos de cada componente quedan aislados y organizados.
- Es más fácil localizar y mantener el CSS correspondiente.
- Evitamos depender de un único archivo CSS gigante con todas las reglas mezcladas.

> Nota: esta es la convención más sencilla y común en proyectos de iniciación.
> Más adelante, en proyectos grandes, se suelen usar alternativas como CSS Modules, styled-components o librerías de UI (Tailwind, Material UI, etc.).

---

## Quiz de la sección
Para terminar, [aquí](./quiz02.md) tienes algunas preguntas para comprobar si has interiorizado bien los conceptos vistos en esta sección. Si no has dado una con las respuestas, quizá sea buena idea volver a darle un repasito a la lección.  

---

[Volver al inicio](../README.md) - [<- Lección anterior](./01_StaticPages.md) | [Siguiente lección ->](./03_ReactState.md)
