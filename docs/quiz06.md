### Quiz: Side Effects

1. ¿En qué sentido se dice que los componentes de React son “funciones puras”?

<details>
<summary>Mostrar respuesta</summary>

- Dadas las mismas props o estados, el componente siempre devuelve el mismo contenido o UI.  
- Renderizar o re-renderizar un componente no debe tener ningún efecto secundario sobre sistemas externos.
</details>

---

2. ¿Qué es un “side effect” en React? ¿Cuáles son algunos ejemplos?

<details>
<summary>Mostrar respuesta</summary>

- Cualquier código que afecte o interactúe con un sistema externo.  
- Ejemplos: localStorage, llamadas a APIs, websockets, manipulación del DOM.
</details>

---

3. ¿Qué **no** es un “side effect” en React? ¿Ejemplos?

<details>
<summary>Mostrar respuesta</summary>

- Todo aquello de lo que React se encarga internamente.  
- Ejemplos: mantener el estado, mantener la UI sincronizada con los datos, renderizar elementos en el DOM.
</details>

---

4. ¿Cuándo ejecuta React la función que pasamos a `useEffect`? ¿Cuándo **no** la ejecuta?

<details>
<summary>Mostrar respuesta</summary>

- La ejecuta al renderizar el componente por primera vez.  
- La ejecuta en cada re-render del componente (si no se pasa array de dependencias).  
- **No** la ejecuta si los valores del array de dependencias permanecen iguales entre renders.
</details>

---

5. ¿Cómo explicarías qué es el “array de dependencias”?

<details>
<summary>Mostrar respuesta</summary>

- Es el segundo parámetro de la función `useEffect`.  
- Es la forma en que React sabe si debe volver a ejecutar el efecto o no.  
</details>
