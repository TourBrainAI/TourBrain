import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function GET() {
  try {
    console.log("Testing gpt-5-nano model with Responses API...");

    const response = openai.responses.create({
      model: "gpt-5-nano",
      input: "write a haiku about ai",
      store: true,
    });

    const result = await response;
    const haiku = result.output_text || "No haiku generated";

    return NextResponse.json({
      success: true,
      model: "gpt-5-nano",
      haiku: haiku,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error with gpt-5-nano:", error);

    // Check if it's a model availability error and try fallback
    if (
      error instanceof Error &&
      (error.message.includes("model") ||
        error.message.includes("gpt-5-nano") ||
        error.message.includes("does not exist") ||
        error.message.includes("responses"))
    ) {
      console.log(
        "gpt-5-nano Responses API not available, trying chat completions..."
      );

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
              content: "write a haiku about ai",
            },
          ],
          max_tokens: 50,
          temperature: 0.8,
        });

        const fallbackHaiku =
          fallbackCompletion.choices[0]?.message?.content ||
          "No haiku generated";

        return NextResponse.json({
          success: true,
          model: "gpt-4 (fallback)",
          haiku: fallbackHaiku,
          note: "gpt-5-nano Responses API not available, used chat completions instead",
          timestamp: new Date().toISOString(),
        });
      } catch (fallbackError) {
        console.error("Fallback error:", fallbackError);
        return NextResponse.json(
          {
            success: false,
            error: "Both gpt-5-nano and gpt-4 failed",
            details:
              fallbackError instanceof Error
                ? fallbackError.message
                : "Unknown error",
          },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed to generate haiku",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
