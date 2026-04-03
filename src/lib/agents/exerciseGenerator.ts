import { callModel } from "@/lib/llm/callModel";
import { parseJsonWithSchema } from "@/lib/llm/parseJson";
import { ExerciseOutputSchema } from "@/lib/schemas/agents";
import {
  exerciseGeneratorSystemPrompt,
  buildExerciseGeneratorUserPrompt,
} from "@/lib/prompts/exerciseGeneratorPrompt";

export async function runExerciseGenerator(input: {
  originalText: string;
  primaryIssue: string;
  correctedVersion: string;
  linguisticInsight: string;
  level: string;
}) {
  const raw = await callModel({
    systemPrompt: exerciseGeneratorSystemPrompt,
    userPrompt: buildExerciseGeneratorUserPrompt(input),
    operationName: "exercise-generator",
    temperature: 0.4,
  });

  return parseJsonWithSchema(raw, ExerciseOutputSchema);
}
