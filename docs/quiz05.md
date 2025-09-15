### Quiz: Component Design

1. ¿Qué significa el principio _“lift state as high as needed, but no higher”_?

<details>
<summary>Mostrar respuesta</summary>

Que debemos colocar el estado en el componente **más alto que lo necesite**, pero no más arriba.  
Así se evita duplicar estado en varios lugares y, al mismo tiempo, se mantiene el estado lo más local posible.
</details>

---

2. En la app Lucky Seven, ¿dónde vive el estado de los dados y por qué?

<details>
<summary>Mostrar respuesta</summary>

El estado (`dice`) vive en **LuckyN**, porque lo necesitan tanto para renderizar los `Die` como para comprobar la condición de victoria.  
Si estuviera más abajo, `LuckyN` no podría acceder a él; más arriba sería innecesario.
</details>

---

3. ¿Qué diferencia hay entre `LuckyN` y `Dice` en cuanto a responsabilidades?

<details>
<summary>Mostrar respuesta</summary>

- **LuckyN** es el contenedor lógico: guarda el estado y define la función `roll`.  
- **Dice** es presentacional: solo muestra los valores que recibe como props, sin manejar estado de negocio.
</details>

---

4. ¿Cómo se pasa la función `roll` desde `LuckyN` hasta el botón de la interfaz?

<details>
<summary>Mostrar respuesta</summary>

`LuckyN` define `roll` y se la pasa como prop `clickFunc` al componente **Button**.  
`Button` simplemente la ejecuta al hacer clic, sin conocer su lógica interna.
</details>

---

5. ¿Qué es el _prop drilling_ y cuándo puede ser aceptable?

<details>
<summary>Mostrar respuesta</summary>

Es el paso de props a través de varios niveles de componentes que no las usan directamente.  
Es aceptable cuando la jerarquía es corta y el dato se necesita en pocos lugares.  
Si el dato se usa en muchos niveles o ramas, conviene usar **Context**.
</details>

---

6. ¿Qué ventajas tiene separar “lógica” y “presentación” en los componentes?

<details>
<summary>Mostrar respuesta</summary>

- La lógica queda concentrada en unos pocos componentes → más fácil de mantener.  
- Los componentes presentacionales son reutilizables en otros contextos.  
- El código es más claro y modular: cada parte cumple una única responsabilidad.
</details>
