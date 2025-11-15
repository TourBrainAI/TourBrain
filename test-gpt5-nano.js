import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateHaiku() {
  try {
    console.log("Testing gpt-5-nano model with Responses API...");

    const response = openai.responses.create({
      model: "gpt-5-nano",
      input: "write a haiku about ai",
      store: true,
    });

    const result = await response;
    const haiku = result.output_text || "No haiku generated";
    console.log("Generated Haiku:");
    console.log(haiku);
    return haiku;
  } catch (error) {
    console.error("Error generating haiku:", error);

    // Check if it's a model availability error
    if (error instanceof Error) {
      if (
        error.message.includes("model") ||
        error.message.includes("gpt-5-nano")
      ) {
        console.log(
          "gpt-5-nano may not be available yet. Trying gpt-4 instead..."
        );

        // Fallback to GPT-4
        try {
          const fallbackCompletion = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
              {
                role: "system",
                content:
                  "You are a haiku poet. Create beautiful, nature-inspired haikus.",
              },
              {
                role: "user",
                content:
                  "Generate a haiku about tour management and music venues.",
              },
            ],
            max_tokens: 50,
            temperature: 0.8,
          });

          const fallbackHaiku =
            fallbackCompletion.choices[0]?.message?.content ||
            "No haiku generated";
          console.log("Generated Haiku (GPT-4 fallback):");
          console.log(fallbackHaiku);
          return fallbackHaiku;
        } catch (fallbackError) {
          console.error("Fallback error:", fallbackError);
          throw fallbackError;
        }
      }
    }

    throw error;
  }
}

// Test function if running directly
if (require.main === module) {
  generateHaiku()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
