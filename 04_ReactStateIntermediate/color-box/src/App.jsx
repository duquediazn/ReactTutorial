import "./App.css";
import ColorBoxGrid from "./ColorBoxGrid";

function App() {
  const colorList = [
    "#ffadad",
    "#ffd6a5",
    "#fdffb6",
    "#caffbf",
    "#9bf6ff",
    "#a0c4ff",
    "#bdb2ff",
    "#ffc6ff"
  ];

  return (
    <>
      <ColorBoxGrid colorList={colorList} />
    </>
  );
}

export default App;