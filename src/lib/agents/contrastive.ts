import { callModel } from "@/lib/llm/callModel";
import { parseJsonWithSchema } from "@/lib/llm/parseJson";
import { ContrastiveOutputSchema } from "@/lib/schemas/agents";
import {
  contrastiveSystemPrompt,
  buildContrastiveUserPrompt,
} from "@/lib/prompts/contrastivePrompt";

export async function runContrastive(input: {
  text: string;
  level: string;
  nativeLanguage?: string;
}) {
  const raw = await callModel({
    systemPrompt: contrastiveSystemPrompt,
    userPrompt: buildContrastiveUserPrompt(input),
    operationName: "contrastive-agent",
    temperature: 0.2,
  });

  return parseJsonWithSchema(raw, ContrastiveOutputSchema);
}
