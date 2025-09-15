import Header from "./components/Header"
import Entry from "./components/Entry"
import data from "./data"


export default function App() {

  const entryElements = data.map((entry) => {
    return (
      <Entry //Props:
        key={entry.id} //Everything inside {} will be interpreted as JS code.
        {...entry}
      />
    )
  })

  return (
    <>
      <Header />
      <main className="container">
        {entryElements}
      </main>
    </>
  )
}


