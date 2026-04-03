import { callModel } from "@/lib/llm/callModel";
import { parseJsonWithSchema } from "@/lib/llm/parseJson";
import { TutorOutputSchema } from "@/lib/schemas/agents";
import {
  tutorSystemPrompt,
  buildTutorUserPrompt,
} from "@/lib/prompts/tutorPrompt";

export async function runTutor(input: {
  originalText: string;
  primaryIssue: string;
  correctedTextCandidate: string;
  findingsSummary: string;
  syntaxSummary: string;
  contrastiveSummary?: string;
  level: string;
}) {
  const raw = await callModel({
    systemPrompt: tutorSystemPrompt,
    userPrompt: buildTutorUserPrompt(input),
    operationName: "tutor-agent",
    temperature: 0.3,
  });

  return parseJsonWithSchema(raw, TutorOutputSchema);
}
