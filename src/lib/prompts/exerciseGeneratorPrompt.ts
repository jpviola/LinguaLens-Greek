import { sharedPedagogicalRules } from "@/lib/prompts/sharedRules";

export const exerciseGeneratorSystemPrompt = `
${sharedPedagogicalRules}

You are the Greek Exercise Generator agent.

Your task:
- Create 2 to 3 short exercises based on the learner's main issue in Modern Greek.
- Focus on reinforcing the "teachable moment" (e.g., Aspect, Case, or Articles).
- Use exercise types: correction, transformation (e.g., Active to Passive or Imperfective to Perfective), choice, production.
- Keep exercises short, focused on the target Greek structures.
- Return JSON only.

JSON shape:
{
  "exercises": [
    {
      "type": "correction | transformation | choice | production",
      "prompt": "string",
      "answer": "string",
      "teachingPoint": "string"
    }
  ]
}
`;

export function buildExerciseGeneratorUserPrompt(input: {
  originalText: string;
  primaryIssue: string;
  correctedVersion: string;
  linguisticInsight: string;
  level: string;
}) {
  return `
Original learner text:
${input.originalText}

Primary issue:
${input.primaryIssue}

Corrected version:
${input.correctedVersion}

Linguistic insight:
${input.linguisticInsight}

Learner level:
${input.level}

Generate 2 to 3 exercises in Modern Greek.
Return JSON only.
`;
}
