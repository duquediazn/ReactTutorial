1. ¿Qué nos permiten lograr las props?

<details>
<summary>Mostrar respuesta</summary>
Hacer que un componente sea más **reutilizable**.
</details>

---

2. ¿Cómo pasas una prop a un componente?

<details>
<summary>Mostrar respuesta</summary>

```jsx
<MyAwesomeHeader title="taca" />
```
</details>

3. ¿Puedo pasar una prop personalizada (ej. blahblahblah={true}) a un elemento nativo del DOM?
(por ejemplo <div blahblahblah={true}>) ¿Por qué sí o por qué no?

<details> 
<summary>Mostrar respuesta</summary> 
No. El JSX que usamos para describir elementos nativos del DOM se convierte en elementos reales del DOM. Y los elementos reales solo aceptan los atributos especificados en la especificación de HTML. (Lo cual no incluye propiedades inventadas como `blahblahblah`). </details>

4. ¿Cómo recibo props en un componente?

<details> 
<summary>Mostrar respuesta</summary>
```
function Navbar(props) {
  console.log(props.blahblahblah)
  return (
    <header>
      ...
    </header>
  )
}
```

O usando destructuring:
```
function Navbar({ blahblahblah }) {
  console.log(blahblahblah)
  return (
    <header>
      ...
    </header>
  )
}
```
</details>

5. ¿De qué tipo de dato es props cuando el componente lo recibe?

<details> 
<summary>Mostrar respuesta</summary> 
¡Un objeto! 
</details>

6. ¿Qué hace el método de arrays .map()?

<details> 
<summary>Mostrar respuesta</summary> 
Devuelve un **nuevo array**. Lo que se retorne en la función callback se coloca en la misma posición del nuevo array. Normalmente tomamos los elementos del array original y los transformamos de alguna manera. 
</details>

7. ¿Para qué usamos normalmente .map() en React?

<details> 
<summary>Mostrar respuesta</summary> 
Para convertir un array de datos en bruto en un array de **elementos JSX** que se pueden renderizar en la página. 
</details>

8. Pregunta crítica: ¿por qué usar .map() es mejor que crear los componentes manualmente escribiéndolos uno por uno?

<details> 
<summary>Mostrar respuesta</summary> 
Porque permite generar dinámicamente componentes a partir de los datos. Esto evita escribir código repetitivo y facilita escalar la aplicación cuando la lista crece o cambia. </details>

9. Muchas veces no tenemos los datos por adelantado al construir la app, así que simplemente no podemos escribirlos a mano.

<details> <summary>Mostrar respuesta</summary> 
Verdadero: si los datos provienen de una API o una base de datos, necesitamos generar la UI dinámicamente. Con `.map()` podemos renderizar los elementos en cuanto llegan los datos. 
</details>

10. Hace que nuestro código sea "autosuficiente": no requiere cambios adicionales cuando cambian los datos.

<details> 
<summary>Mostrar respuesta</summary> 
Al usar `.map()`, si los datos cambian (se agregan, eliminan o modifican elementos), la UI se actualiza automáticamente. No necesitamos tocar el código manualmente cada vez que hay un cambio en la lista. 
</details> 