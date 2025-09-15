import { useState, useEffect } from "react"

export default function Main() {

    const [meme, setMeme] = useState({
        "topText": "One does not simply",
        "bottomText": "walks into Mordor",
        "imgUrl": "http://i.imgflip.com/1bij.jpg"
    })

    const [allMemes, setAllMemes] = useState([])

    useEffect(() => {
        fetch("https://api.imgflip.com/get_memes")
            .then(res => res.json())
            .then(data => setAllMemes(data.data.memes))
    }, []) //Our dependencies will be an empty array so we don't end up in an infinite loop! UseEffect will only run once. 

    function handleChange(event) {
        const { value, name } = event.currentTarget
        setMeme(prevMeme => ({
            ...prevMeme,
            [name]: value //This way will evaluate the variable called name, instead of creating a new property called "name"
        }))
    }

    function getMemeImage() {
        const randomNumber = Math.floor(Math.random() * allMemes.length)
        const newMemeUrl = allMemes[randomNumber].url
        setMeme(prevMeme => ({
            ...prevMeme,
            imgUrl: newMemeUrl
        }))
    }

    return (
        <main>
            <div className="form">
                <label>Top Text
                    <input
                        onChange={handleChange}
                        type="text"
                        placeholder="One does not simply"
                        name="topText"
                        value={meme.topText}
                    />
                </label>

                <label>Bottom Text
                    <input
                        onChange={handleChange}
                        type="text"
                        placeholder="walks into Mordor"
                        name="bottomText"
                        value={meme.bottomText}
                    />
                </label>
                <button onClick={getMemeImage}>Get a new meme image 🖼</button>
            </div>
            <div className="meme">
                <img src={meme.imgUrl} alt="" />
                <span className="top">{meme.topText}</span>
                <span className="bottom">{meme.bottomText}</span>
            </div>
        </main>
    )
}