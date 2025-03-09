import Cerebras from "@cerebras/cerebras_cloud_sdk";
import { z } from "zod";
import { CEREBRAS_API_KEY } from "../cerbras";
import { j, publicProcedure } from "../jstack";

export const textRouter = j.router({
  genereateReciPeText: publicProcedure
    .input(
      z.object({
        text: z.string().min(1),
        mealType: z.enum(["breakfast", "lunch", "dinner"]),
      })
    )
    .mutation(async ({ ctx, c, input }) => {
      const { text, mealType } = input;

      const client = new Cerebras({
        apiKey: CEREBRAS_API_KEY, // This is the default and can be omitted
      });

      const prompt = `You are an expert chef. Given a text description of available ingredients and a specified meal type, generate multiple recipes formatted in valid HTML.

### Input:
- Ingredients: "${text}"
- Meal Type: "${mealType}" (One of: "breakfast", "lunch", or "dinner")

### Rules:
1. The output must be strict HTML.
2. Use <h2> for the title, <ul> for ingredients, and <ol> for instructions.
3. The final dish description should be inside a <p> tag.

### Output Format:
<h2>A Creative and Appetizing Name for the Dish</h2>
<ul>
  <li>List of structured ingredients extracted from the input text</li>
</ul>
<ol>
  <li>Step-by-step cooking instructions that are clear and easy to follow</li>
</ol>
<p>A vivid description of what the dish looks like.</p>
`;

      const chatCompletion = await client.chat.completions.create({
        messages: [
          {
            role: "system",
            content: prompt,
          },
          {
            role: "user",
            content: text,
          },
        ],
        model: "llama3.1-8b",
      });

      return c.superjson(chatCompletion);
    }),
});
