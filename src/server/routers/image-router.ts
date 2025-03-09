import Cerebras from "@cerebras/cerebras_cloud_sdk";
import { z } from "zod";
import { CEREBRAS_API_KEY } from "../cerbras";
import { j, publicProcedure } from "../jstack";
import OpenAI from "openai";
import * as fs from "fs";

export const imageRouter = j.router({
  getImageAnalysis: publicProcedure
    .input(
      z.object({
        text: z.string(),
        imagePath: z.string(), // Expect an image path as input
      })
    )
    .mutation(async ({ ctx, c, input }) => {

      const { text, imagePath } = input;
      console

      // Initialize OpenAI client
      const client = new OpenAI({
        apiKey: CEREBRAS_API_KEY, // Ensure this key is correctly set
        baseURL: "https://api.cerebras.ai/v1",
      });

    

      // Get url 
    

      try {
        const response = await client.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text,
                },
                {
                  type: "image_url",
                  image_url: { url: imagePath },
                },
              ],
            },
          ],
        });

        return c.superjson({
          success: true,
          message: response.choices[0], // Return the AI response
        });
      } catch (error) {
        return c.superjson({
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }),
});
