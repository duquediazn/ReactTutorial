import "./ColorBox.css";
import { useState } from "react";

const getRand = (list) => {
  const randIndex = Math.floor(Math.random() * list.length);
  return list[randIndex];
};

function ColorBox({ colorList }) {
  // Inicialización perezosa: se ejecuta SOLO una vez al montar
  const [color, setColor] = useState(() => getRand(colorList));

  const changeColor = () => {
    setColor(getRand(colorList));
  };

  return (
    <div
      onClick={changeColor}
      className="ColorBox"
      style={{ backgroundColor: color }}
    ></div>
  );
}

export default ColorBox;

/*
─────────────────────────────────────────────── 
INICIALIZACIÓN DE ESTADO EN REACT

- `useState(valor)` → React usa `valor` como estado inicial.
  Importante: este valor solo se tiene en cuenta en el
  **primer render**. En re-renders posteriores, React ignora
  ese argumento porque el estado ya está establecido.
  Si `valor` viene de `funcionQueDevuelveAlgo()`, la función
  se ejecutará en CADA render (aunque React solo use el
  resultado la primera vez). Esto puede ser costoso.

- `useState(funcion)` → si pasamos la función sin paréntesis,
  React la llamará automáticamente SOLO la primera vez que se
  monte el componente (inicialización perezosa). Esto solo sirve
  si la función no necesita argumentos.

- `useState(() => funcion(param))` → si la función necesita
  parámetros (como `getRand(colorList)`), debemos envolverla en
  una arrow function. React llamará a esa arrow function solo
  en el primer render, y dentro de ella ya podemos pasarle los
  argumentos necesarios.

  ---------------------------------------------------------------
  Nota adicional: si la lista `colorList` cambia después de que
  el componente se haya montado, el estado `color` NO se volverá
  a recalcular automáticamente, porque React no reejecuta la
  inicialización en componentes ya montados.

  Si queremos que el color se resetee al cambiar la lista y
  mantener el mismo componente, podemos usar un efecto:

    useEffect(() => {
      setColor(getRand(colorList));
    }, [colorList]);

  Alternativamente, si en el componente padre (`ColorBoxGrid`)
  hacemos que la `key` de cada <ColorBox /> dependa también de
  `colorList`, React desmontará y montará de nuevo cada caja
  cuando la lista cambie. En ese caso, la inicialización con
  useState(() => getRand(colorList)) sí se volverá a ejecutar
  porque se trata de un nuevo montaje, así es como está planteado 
  ahora con useMemo.

  ---------------------------------------------------------------
  Nota sobre modo desarrollo: 
  Ten en cuenta que en modo desarrollo con React.StrictMode 
  parece que la función se ejecuta dos veces, pero es solo para 
  detectar efectos secundarios. En producción se ejecuta una 
  única vez. 
───────────────────────────────────────────────
*/