import { HfInference } from "@huggingface/inference";
const HF_TOKEN = import.meta.env.VITE_HF_ACCESS_TOKEN;

const SYSTEM_PROMPT = `
You are an assistant that receives a list of ingredients that a user has and suggests a recipe 
they could make with some or all of those ingredients. You don't need to use every ingredient 
they mention in your recipe. You SHOULD NOT start your response with something like 
"Sure, I'd be happy to help!" You can start with something like "Based on the ingredients provided...". 
The recipe can include additional ingredients they didn't mention, but try not to include too many 
extra ingredients. Format your response in markdown to make it easier to render to a web page.
`;

// Make sure you set an environment variable for VITE_HF_ACCESS_TOKEN
/**
 * All environment variable names in Vite must start with VITE_
 * to be exposed to your frontend code. Otherwise, Vite will ignore them
 * for security reasons.
 * */
const hf = new HfInference(HF_TOKEN);

export async function getRecipeFromMistral(ingredientsArr) {
  //Notice this function is asynchronous!
  const ingredientsString = ingredientsArr.join(", ");
  try {
    const response = await hf.chatCompletion({
      model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: `I have ${ingredientsString}. Please give me a recipe you'd recommend I make!`,
        },
      ],
      max_tokens: 1024,
    });
    return response.choices[0].message.content;
  } catch (err) {
    console.error(err?.message || err);
    return "There was a problem generating the recipe.";
  }
}
