import ColorBox from "./ColorBox";
import "./ColorBoxGrid.css";
import { useMemo } from "react";
import { v4 as uuidv4 } from "uuid";


function ColorBoxGrid({ colorList }) {
  const boxNum = 25;

  // Se generan solo la primera vez que se monta este componente
  const ids = useMemo(() => Array.from({ length: boxNum }, () => uuidv4()), [colorList]);

  // useMemo es un hook de React que sirve para memorizar un valor calculado 
  // y no volverlo a recalcular en cada render, a menos que cambien sus dependencias.
  // const valorMemorizado = useMemo(() => funcionQueCalculaAlgo(), [dependencias]);
  // Array.from crea un array de boxNum posiciones y en cada una mete un id único 
  // generado por uuidv4().

  const boxes = [];
  for (let i = 0; i < boxNum; i++) {
    boxes.push(<ColorBox colorList={colorList} key={ids[i]} />);
  }

  return <div className="ColorBoxGrid">{boxes}</div>;
}

export default ColorBoxGrid;