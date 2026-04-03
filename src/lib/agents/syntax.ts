import { callModel } from "@/lib/llm/callModel";
import { parseJsonWithSchema } from "@/lib/llm/parseJson";
import { SyntaxOutputSchema } from "@/lib/schemas/agents";
import {
  syntaxSystemPrompt,
  buildSyntaxUserPrompt,
} from "@/lib/prompts/syntaxPrompt";

export async function runSyntax(input: {
  text: string;
  level: string;
}) {
  const raw = await callModel({
    systemPrompt: syntaxSystemPrompt,
    userPrompt: buildSyntaxUserPrompt(input),
    operationName: "syntax-agent",
    temperature: 0.2,
  });

  return parseJsonWithSchema(raw, SyntaxOutputSchema);
}
