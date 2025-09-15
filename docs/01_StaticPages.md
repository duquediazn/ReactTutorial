
# Páginas estáticas

## Índice de contenidos
- [Hello, React!](#hello-react)
- [Primer componente](#primer-componente)
- [Composición de componenetes](#composición-de-componentes)
- [Fragmentos (fragments)](#fragmentos-fragments)
- [Separar componenetes en archivos](#separar-componentes-en-archivos)
- [Primera app de ejemplo](#primera-app-de-ejemplo)
- [La carpeta `public` en Vite](#la-carpeta-public-en-vite)
- [Resumen rápido](#resumen-rápido)
- [Quiz](#quiz-de-la-sección)

## Hello, React!
Antes de empezar a crear componentes más complejos, vamos a ver el **flujo básico de una aplicación React**.

1. En nuestro `index.html` tenemos un contenedor vacío:
```html
<div id="root"></div>
```
React necesita este “root” para montar toda la interfaz dentro de él.

2. Desde main.jsx:

- Importamos createRoot de React DOM.
- Creamos una raíz a partir del #root.

```jsx
import { createRoot } from "react-dom/client"

const root = createRoot(document.getElementById("root"))
root.render(<h1>Hello, React!</h1>)
```

3. A partir de ahí, React controla todo lo que ocurre dentro de #root.

### ¿Qué hace realmente React?
Si quisiéramos hacerlo sin React, tendríamos que manipular directamente el DOM:

```js
const h1 = document.createElement("h1")
h1.textContent = "Hello, React!"
document.getElementById("root").append(h1)
```

Con React basta con escribir JSX:
```jsx
root.render(<h1>Hello, React!</h1>)
```
- JSX ≠ HTML: aunque se parezca, JSX es azúcar sintáctica sobre llamadas a `React.createElement`.  
- Lo que escribimos en JSX se transforma en un objeto de JavaScript que describe cómo debería ser el nodo. Esa transformación la hacen herramientas como **Babel** o, en el caso de Vite, **esbuild** (que viene por defecto).  
- Luego React compara ese objeto con el Virtual DOM y decide qué actualizar en el DOM real.

### La forma “old way” con createElement

React permite crear elementos también de forma explícita, sin usar JSX:
```js
import { createRoot } from "react-dom/client"
import { createElement } from "react"

const root = createRoot(document.querySelector("#root"))

const reactElement = createElement("h1", null, "Hello from createElement") // createElement(type, props, ...children)
console.log(reactElement) // objeto plano de js
// {
//   $$typeof: Symbol(react.element),
//   type: "h1",
//   key: null,
//   props: { children: "Hello from createElement" },
//   _owner: null,
//   ...
// }

root.render(reactElement)
```
Esto muestra que JSX es simplemente una forma más cómoda y legible de escribir lo mismo.
Normalmente no usaremos createElement directamente, pero entenderlo ayuda a recordar que JSX no es HTML, sino JavaScript.

## Primer componente

Hasta ahora hemos renderizado un simple `<h1>`, pero React se basa en la idea de **componentes**.

> Un **componente** en React es simplemente una función de JavaScript que devuelve JSX.

Por ejemplo:

```jsx
function MainContent() {
  return <h1>React is great!</h1>
}

const root = createRoot(document.querySelector("#root"))
root.render(<MainContent />)
```

## Composición de componentes

La gran ventaja de React es que podemos **componer componentes**, es decir, juntar varios en una misma interfaz.  

Por ejemplo, imaginemos que tenemos un componente de **navbar** y nuestro `MainContent`:
```jsx
function MyAwesomeNavbar() {
  return (
    <nav className="navbar navbar-dark bg-dark">
      <a className="navbar-brand" href="#">MyAwesomeNavbar</a>
    </nav>
  )
}

function MainContent() {
  return <h1>React is great!</h1>
}

const root = createRoot(document.querySelector("#root"))
root.render(
  <div>
    <MyAwesomeNavbar />
    <MainContent />
  </div>
)
```
Fíjate en varias cosas importantes:

- Los **nombres de los componentes** deben empezar en **mayúscula** (`MainContent`, `MyAwesomeNavbar`).  
- Un componente no es más que una **función que devuelve JSX**.  
- Podemos usarlos como etiquetas JSX (`<MainContent />`), igual que usaríamos un `<h1>` o `<div>`, en lugar de simplemente invocar a la función/componente `MainContent()`.  
- Los componentes se pueden **anidar y reutilizar**, lo que hace que la interfaz sea más modular y mantenible.
- **Si queremos devolver más de un elemento al mismo nivel, deben estar envueltos en un elemento padre** (por ejemplo, un `<div>` o un `<main>`).  

> Nota: en JSX usamos ``className` en lugar de `class`, porque lo que estamos escribiendo no es HTML sino JavaScript.
> React sigue la convención de las propiedades del DOM nativo (`className`, `htmlFor`, etc.).

### Tabla de atributos HTML vs JSX

| HTML       | JSX        | Motivo                               |
|------------|------------|--------------------------------------|
| `class`    | `className`| `class` es palabra reservada en JS.  |
| `for`      | `htmlFor`  | Coincide con la propiedad DOM de `<label>`. |
| `tabindex` | `tabIndex` | JSX sigue la convención *camelCase*. |
| `maxlength`| `maxLength`| Igual: atributos compuestos → *camelCase*. |
| `onclick`  | `onClick`  | Los manejadores de eventos en JSX usan *camelCase*. |

## Fragmentos (Fragments)

En React, cada componente debe devolver un **único elemento padre**.  
Hasta ahora lo hemos solucionado usando un `<div>` o un `<main>` como contenedor.  

Pero ¿qué pasa si no queremos añadir un nodo extra al DOM?  
Para eso existen los **Fragmentos**.

> Un **Fragment** (<></>) nos permite agrupar múltiples elementos sin añadir un elemento adicional en el DOM.

Por ejemplo, sin fragmentos tendríamos que escribir:

```jsx
function Page() {
  return (
    <div>
      <header>Header aquí</header>
      <main>Contenido principal</main>
      <footer>Footer aquí</footer>
    </div>
  )
}
```
Esto funciona, pero ese `<div>` extra no aporta nada útil al DOM.  
Con un fragmento podemos simplificarlo:
```jsx
function Page() {
  return (
    <>
      <header>Header aquí</header>
      <main>Contenido principal</main>
      <footer>Footer aquí</footer>
    </>
  )
}
```
Puntos clave sobre los fragmentos:

- `<></>` es la forma más común y no requiere ninguna importación extra.  
- También podemos usar `<Fragment></Fragment>` importándolo desde React (`import { Fragment } from "react"`).  
- El resultado en el DOM es más limpio porque **no añade nodos innecesarios**.  

Ejemplo con la convención típica de un componente `Page`:
```jsx
function Page() {
  return (
    <>
      <Header />
      <MainContent />
      <Footer />
    </>
  )
}

root.render(<Page />)
```

## Separar componentes en archivos
Hasta ahora hemos definido todos los componentes en un mismo archivo.  
> En un proyecto real, lo recomendable es **mover cada componente a su propio archivo** para mantener el código más organizado y fácil de mantener.

Por ejemplo, en lugar de tener `Header`, `MainContent` y `Footer` todos juntos en `main.jsx`, podemos crear:

- `components/Header.jsx`  
- `components/MainContent.jsx`  
- `components/Footer.jsx`  

Cada uno exporta su componente:
```jsx
// Header.jsx
export default function Header() {
  return (
    <header>
      <img src="react-logo.png" width="50px" alt="React Logo" />
      <nav>/* enlaces aquí */</nav>
    </header>
  )
}

// MainContent.jsx
export default function MainContent() {
  return (
    <main>
      <h1>Reasons I'm excited to learn React</h1>
      <ol>
        <li>I'm not really that excited</li>
        <li>to be honest, I'm a little bit annoyed</li>
      </ol>
    </main>
  )
}

// Footer.jsx
export default function Footer() {
  return (
    <footer>© 2025 duquediazn development. All rights reserved.</footer>
  )
}
```
Cada componente se guarda en su propio archivo y se **exporta**. Aquí usamos `export default`, que indica que este es el “valor principal” que exporta el archivo. Gracias a eso, cuando lo importamos no necesitamos usar llaves `{ }`: Luego, en `main.jsx` importamos los componentes y los usamos dentro de `Page`:

```jsx
import { createRoot } from "react-dom/client"
import Header from "./components/Header"
import MainContent from "./components/MainContent"
import Footer from "./components/Footer"

const root = createRoot(document.getElementById("root"))

function Page() {
  return (
    <>
      <Header />
      <MainContent />
      <Footer />
    </>
  )
}

root.render(<Page />)
```

Si quisiéramos exportar varias cosas desde un mismo archivo, usaríamos exports con nombre (export function ...) y al importarlos habría que ponerlos entre llaves (import { Header } from "./components/Header").

**Ventajas de separar componentes en archivos:**
- Código más limpio y fácil de navegar.  
- Reutilización: un mismo componente se puede importar en distintas partes de la app.  
- Facilita el mantenimiento: cada archivo es más corto y más sencillo de leer.  


## Primera app de ejemplo
Ahora que ya hemos visto qué son los componentes y cómo organizarlos, podemos construir nuestra **primera aplicación completa**.

Observa y prueba el código en la carpeta [01_StaticPages](../01_StaticPages/). En este caso seguimos la convención de usar `App.jsx` como **componente principal**, que sirve como punto de partida para organizar el resto de la interfaz.

App.jsx:
```jsx
export default function App() {
  return (
    <>
      <Navbar />
      <Main />
    </>
  )
}
```
- Usamos `export default` para poder importarlo desde otros archivos (en este caso, `main.jsx`).  
- La función `App` devuelve JSX, que React traduce y renderiza en el DOM.  
- Dentro de `App` ya componemos la aplicación con otros componentes (`Navbar`, `Main`).  

El archivo `main.jsx` importa `App` y arranca la aplicación:

```jsx
import { createRoot } from "react-dom/client"
import App from "./App"
import './components/index.css'

const root = createRoot(document.getElementById("root"))
root.render(<App />)
```

Estructura de la app "React Facts":

- /public
  - react-logo-half.png
  - react-logo.png
- /src
  - /components
    - Main.jsx
    - Navbar.jsx
    - index.css
  - App.jsx
  - main.jsx
  - index.css
- index.html
- package.json

## La carpeta `public` en Vite

En los proyectos creados con Vite, los archivos estáticos como imágenes o fuentes deben colocarse dentro de la carpeta **`public/`**.

- Todo lo que pongas en `public/` se copia tal cual en la carpeta de distribución final (`dist/`) cuando haces el build.  
- Estos archivos están disponibles desde la raíz de la aplicación en tiempo de ejecución.  

Por ejemplo, si guardas un logo en `public/react-logo.png`, puedes acceder a él en tu JSX así:

```html
<img src="/react-logo.png" alt="React Logo" />
```

⚠️ Si pusieras esa imagen dentro de `src/`, Vite intentaría procesarla como parte del código (lo cual solo tiene sentido para imports con `import img from "./ruta"`, no para recursos estáticos).  

En resumen:  
- **`src/`** → código fuente de la app (componentes, lógica, estilos).  
- **`public/`** → archivos estáticos que deben servirse directamente.  

Este ejemplo es importante porque muestra:

- Cómo React abstrae la creación de nodos.  
- Por qué trabajar con JSX es mucho más legible.  
- Dónde empieza el flujo de renderizado: **index.html → main.jsx → App.jsx → componentes**. 
- Cómo usar correctamente la carpeta `public/` para imágenes y otros recursos estáticos.  

## Resumen rápido

- React necesita un `#root` en el HTML.  
- Todo arranca en `main.jsx`.  
- `App.jsx` es el componente principal que organiza el resto.  
- JSX se parece a HTML, pero en realidad es JavaScript que se compila a `React.createElement`.  
- React se encarga de traducir esos objetos a DOM real de manera eficiente usando el Virtual DOM.  
- Los recursos estáticos deben ir en `public/` para que Vite los sirva correctamente.

## Quiz de la sección
Para terminar, [aquí](./quiz01.md) tienes algunas preguntas para comprobar si has interiorizado bien los conceptos vistos en esta sección. Si no has dado una con las respuestas, quizá sea buena idea volver a darle un repasito a la lección.  

---

[<- Volver al inicio](../README.md) | [Siguiente lección ->](./02_DataDrivenReact.md)
