1. ¿Por qué no debemos hacer esto en React?

```jsx
scores.p1Score++;
setScores(scores);
```
<details>
<summary>Mostrar respuesta</summary>

Porque **estamos mutando directamente** el objeto del estado.  
React no detectará el cambio ya que la referencia de `scores` sigue siendo la misma.  
Siempre debemos crear un nuevo objeto o array.
</details>

---

2. ¿Qué produce este código?

```jsx
setScores(prev => {
  return { ...prev, p1Score: prev.p1Score + 1 }
})
```
<details>
<summary>Mostrar respuesta</summary>

Un **nuevo objeto** con todas las propiedades de `prev`, pero con `p1Score` incrementado en 1.  
El operador spread (`...`) copia las propiedades y luego sobrescribimos la que queremos actualizar.
</details>

---

3. Si tengo este estado:

```jsx
const [emojis, setEmojis] = useState([{ id: 1, emoji: "😬" }]);
```

¿Qué hace este código?

```jsx
setEmojis(prev => [...prev, { id: 2, emoji: "🤪" }]);
```
<details>
<summary>Mostrar respuesta</summary>

Crea un **nuevo array** copiando todos los elementos anteriores y añadiendo un nuevo objeto `{ id: 2, emoji: "🤪" }` al final.  
Nunca modifica el array original.
</details>

---

4. ¿Qué devuelve este patrón común?

```jsx
setEmojis(prev => prev.filter(e => e.id !== id));
```
<details>
<summary>Mostrar respuesta</summary>

Un nuevo array con **todos los elementos excepto** aquel cuyo `id` coincide con el valor recibido.  
Es el patrón estándar para **eliminar** elementos de un array en React.
</details>

---

5. ¿Cómo convertiría todos los emojis en corazones con `map()`?

<details>
<summary>Mostrar respuesta</summary>

```jsx
setEmojis(prev =>
  prev.map(e => {
    return { ...e, emoji: "❤️" }
  })
)
```
Recorremos el array y devolvemos **nuevos objetos** para cada elemento, sobrescribiendo la propiedad `emoji`.
</details>
