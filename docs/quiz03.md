1. Tienes 2 opciones de lo que puedes pasar a la función que actualiza el estado (por ejemplo `setCount`). ¿Cuáles son?
<details>
<summary>Mostrar respuesta</summary>

1. Pasar el **nuevo valor de estado** que queremos usar como reemplazo del anterior.  
2. Pasar una **función callback**. Esta recibe el valor anterior de estado como parámetro y nos permite calcular el nuevo valor a partir de él.  
</details>

---

2. ¿Cuándo conviene usar la primera opción (pasar directamente el nuevo valor)?
<details>
<summary>Mostrar respuesta</summary>
Cuando no nos importa el valor anterior, simplemente queremos establecer un nuevo valor fijo.  
</details>

---

3. ¿Cuándo conviene usar la segunda opción (callback con el valor previo)?
<details>
<summary>Mostrar respuesta</summary>
Cuando necesitamos conocer el valor anterior del estado para calcular el nuevo.  
</details>

---

4. ¿Qué es el "renderizado condicional"?
<details>
<summary>Mostrar respuesta</summary>
Cuando queremos que algo se muestre en la página solo bajo cierta condición.  
</details>

---

5. ¿Cuándo usarías `&&`?
<details>
<summary>Mostrar respuesta</summary>
Cuando queremos mostrar **algo o nada** dependiendo de una condición.  
</details>

---

6. ¿Cuándo usarías un operador ternario?
<details>
<summary>Mostrar respuesta</summary>
Cuando necesitamos elegir entre **2 opciones distintas** para mostrar.  
</details>

---

7. ¿Y si tenemos que decidir entre más de 2 opciones?
<details>
<summary>Mostrar respuesta</summary>
Podemos usar una cadena de **if...else if...else** o una sentencia **switch**.  
</details>
