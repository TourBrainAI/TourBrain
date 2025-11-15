import OpenAI from "openai";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY is not set");
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  organization: process.env.OPENAI_ORG_ID, // optional
});

// Usage logging helper
export function logAIUsage(
  endpoint: string,
  resourceId: string,
  model: string,
  success: boolean,
  error?: string
) {
  console.log({
    timestamp: new Date().toISOString(),
    endpoint,
    resourceId,
    model,
    success,
    error,
  });

  // TODO: Add to database or external monitoring service
  // This helps track usage patterns and costs
}
