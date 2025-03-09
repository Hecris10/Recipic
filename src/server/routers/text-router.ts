import Cerebras from "@cerebras/cerebras_cloud_sdk";
import { z } from "zod";
import { CEREBRAS_API_KEY } from "../cerbras";
import { j, publicProcedure } from "../jstack";

export const textRouter = j.router({
  genereateReciveText: publicProcedure
    .input(
      z.object({
        text: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, c, input }) => {
      const { text } = input;

      const client = new Cerebras({
        apiKey: CEREBRAS_API_KEY, // This is the default and can be omitted
      });

      const chatCompletion = await client.chat.completions.create({
        messages: [
          {
            role: "user",
            content:
              "Generate a recipe for a user based on the following text: " +
              text,
          },
        ],
        model: "llama3.1-8b",
      });

      return c.superjson(chatCompletion);
    }),
});
