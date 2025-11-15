import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function GET() {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        {
          status: "error",
          service: "openai",
          error: "OPENAI_API_KEY not configured",
          timestamp: new Date().toISOString(),
        },
        { status: 500 }
      );
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Test OpenAI connection with a minimal request
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: "Test" }],
      max_tokens: 1,
    });

    return NextResponse.json({
      status: "ok",
      service: "openai",
      model: response.model,
      timestamp: new Date().toISOString(),
      message: "OpenAI API connection successful",
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        service: "openai",
        error: error instanceof Error ? error.message : "Unknown OpenAI error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
