import React from "react"
//import { useState } from "react"
import ClaudeRecipe from "./ClaudeRecipe"
import IngredientsList from "./IngredientsList"
import { getRecipeFromMistral } from "../../ai"

export default function Main() {
    const [ingredients, setIngredients] = React.useState([])
    const [recipe, setRecipe] = React.useState("")
    const recipeSection = React.useRef(null) //ref: {current:null}

    React.useEffect(()=>{
        if (recipe !== "" && recipeSection.current !== null) {
            //recipeSection.current.scrollIntoView() //A little bit abrupt
            recipeSection.current.scrollIntoView({behaviour:"smooth"}) //won't work with iframes
        }
    }, [recipe]) //We want to launch this function everytime a recipe changes

    //getRecipeFromMistral function is async, so it returns a Promise!
    async function getRecipe() {
        const recipeMarkdown = await getRecipeFromMistral(ingredients)
        setRecipe(recipeMarkdown)
    }

    function addIngredient(formData) {
        const newIngredient = formData.get("ingredient")
        setIngredients(prevIngredients => [...prevIngredients, newIngredient])

    }

    return (
        <main>
            <form action={addIngredient} className="add-ingredient-form">
                <input
                    type="text"
                    placeholder="e.g. oregano"
                    aria-label="Add ingredient"
                    name="ingredient"
                />
                <button>Add ingrediente</button>
            </form> 
            { ingredients.length > 0 && 
                <IngredientsList 
                    ingredients={ingredients} 
                    getRecipe={getRecipe}
                    ref={recipeSection} //ref
                />}
            {recipe && <ClaudeRecipe recipe={recipe}/>

            }
        </main>
    )

}
