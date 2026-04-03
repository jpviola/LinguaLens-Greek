import { callModel } from "@/lib/llm/callModel";
import { parseJsonWithSchema } from "@/lib/llm/parseJson";
import { ErrorAnalystOutputSchema } from "@/lib/schemas/agents";
import {
  errorAnalystSystemPrompt,
  buildErrorAnalystUserPrompt,
} from "@/lib/prompts/errorAnalystPrompt";

export async function runErrorAnalyst(input: {
  text: string;
  level: string;
  goal?: string;
  context?: string;
}) {
  const raw = await callModel({
    systemPrompt: errorAnalystSystemPrompt,
    userPrompt: buildErrorAnalystUserPrompt(input),
    operationName: "error-analyst",
    temperature: 0.2,
  });

  return parseJsonWithSchema(raw, ErrorAnalystOutputSchema);
}
