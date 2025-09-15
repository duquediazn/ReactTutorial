1. ¿Dónde coloca React todos los elementos que creo en JSX cuando llamo a `root.render()`?

<details>
<summary>Mostrar respuesta</summary>

Todos los elementos que renderizo se colocan dentro del `div` con el id `"root"`  
(o en cualquier otro elemento que seleccione al llamar a `createRoot`).
</details>

---

2. ¿Qué aparecería en mi consola si ejecuto este código?

```
console.log(<h1>Hello world!</h1>)
```


<details>
<summary>Mostrar respuesta</summary>

¡Un objeto!  
`{$$typeof: Symbol(react.transitional.element), type: 'h1', key: null, props: {…}, _owner: null, …}`  

A diferencia de crear un elemento HTML con JavaScript “vanilla”, lo que se crea a partir de JSX en React es un **objeto de JavaScript** que React usará para representar y renderizar en la vista.
</details>

---

3. ¿Qué está mal en este código?

```
root.render(
    <h1>Hi there</h1>
    <p>This is my website!</p>
)
```


<details>
<summary>Mostrar respuesta</summary>

Solo se puede renderizar **un único elemento padre a la vez**.  
Ese elemento padre puede contener todos los hijos que queramos.
</details>

---

4. ¿Qué significa que algo sea "declarativo" en vez de "imperativo"?

<details>
<summary>Mostrar respuesta</summary>

- **Imperativo** → dar instrucciones paso a paso de cómo realizar la tarea.  
- **Declarativo** → describir *qué* debe aparecer en la página, y dejar que React se encargue de *cómo* hacerlo.
</details>

---

5. ¿Qué significa que algo sea "composable" (componible)?

<details>
<summary>Mostrar respuesta</summary>

Que tenemos piezas pequeñas que podemos combinar para crear algo más grande o más complejo que la suma de sus partes.
</details>

---

6. ¿Qué es un componente de React?

<details>
<summary>Mostrar respuesta</summary>

Una función que devuelve elementos de React (UI).
</details>

---

7. ¿Qué está mal en este código?

```
function myComponent() {
    return (
        <small>I'm tiny text!</small>
    )
}
```


<details>
<summary>Mostrar respuesta</summary>

Los nombres de los componentes deben escribirse en **PascalCase**:

```
function MyComponent() {
    return (
        <small>I'm tiny text!</small>
    )
}
```
</details>

---

8. ¿Qué está mal en este código?

```
function Header() {
    return (
        <header>
            <img src="./react-logo.png" width="40px" alt="React logo" />
        </header>
    )
}

root.render(Header())
```
<details>
<summary>Mostrar respuesta</summary>

No hay nada “mal”, pero la mejor práctica es llamar al componente usando la sintaxis de JSX:

```
root.render(<Header />)
```
</details>
