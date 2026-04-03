import { getOpenAIClient } from "@/lib/llm/client";
import { withRetry } from "@/lib/llm/withRetry";
import { ProviderAppError } from "@/lib/utils/errors";

type CallModelParams = {
  systemPrompt: string;
  userPrompt: string;
  temperature?: number;
  operationName?: string;
};

// ─── Mock fallback (no API key) ────────────────────────────────────────────
function getMock(op: string): string {
  switch (op) {
    case "error-analyst":
      return JSON.stringify({
        findings: [
          { span: "go", category: "morphology", subtype: "tense", explanation: "Base form used where past simple is required.", severity: "high", confidence: 0.96, suggestedFix: "went" },
          { span: "see", category: "morphology", subtype: "tense", explanation: "Base form used where past simple is required.", severity: "high", confidence: 0.95, suggestedFix: "saw" },
        ],
        primaryIssue: "Past tense consistency in narration",
        correctedTextCandidate: "Yesterday I went to the university and saw my professor.",
      });
    case "syntax-agent":
      return JSON.stringify({
        sentenceType: "compound",
        issues: [
          { span: "go", subtype: "tense", explanation: "Base form used instead of past simple.", correction: "went", confidence: 0.9 },
          { span: "see", subtype: "tense", explanation: "Base form used instead of past simple.", correction: "saw", confidence: 0.9 },
        ],
        overallComment: "The sentence is structurally clear, but the past-time frame is not morphologically maintained.",
      });
    case "contrastive-agent":
      return JSON.stringify({
        likelyTransfer: true,
        sourceLanguage: "spanish",
        pattern: "Infinitive/base-form leakage in past narration",
        explanation: "Spanish speakers may under-mark past morphology in English when a time adverb like 'yesterday' already signals the tense.",
        examplePair: { spanishLikeForm: "Yesterday I go", naturalEnglishForm: "Yesterday I went" },
        confidence: 0.82,
      });
    case "tutor-agent":
      return JSON.stringify({
        focusPoint: "Keep past-tense verbs consistent in past narration.",
        feedback: "Your sentence is clear, but both verbs need past forms because you're describing completed events.",
        correctedVersion: "Yesterday I went to the university and saw my professor.",
        linguisticInsight: "In English, past time reference and verb morphology must agree — a time adverb alone doesn't substitute for verb inflection.",
        nextStep: "Practice writing two-verb past sentences using simple daily routines.",
      });
    case "exercise-generator":
      return JSON.stringify({
        exercises: [
          { type: "correction", prompt: "Fix: She say she was tired.", answer: "She said she was tired.", teachingPoint: "Past narrative verbs need past simple forms." },
          { type: "transformation", prompt: "Rewrite in past simple: I meet him yesterday and he give me the notes.", answer: "I met him yesterday and he gave me the notes.", teachingPoint: "Maintain tense consistency across coordinated past events." },
          { type: "production", prompt: "Write one sentence about last weekend using two past simple verbs.", teachingPoint: "Produce a short past narrative." },
        ],
      });
    default:
      return "{}";
  }
}

// ─── Main callModel ─────────────────────────────────────────────────────────
export async function callModel({
  systemPrompt,
  userPrompt,
  temperature = 0.2,
  operationName = "unknown",
}: CallModelParams): Promise<string> {
  // Fall back to mock when no API key is configured
  if (!process.env.OPENAI_API_KEY) {
    console.warn(`[mock] No OPENAI_API_KEY — using mock for: ${operationName}`);
    return getMock(operationName);
  }

  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

  return withRetry(async () => {
    try {
      const openai = getOpenAIClient();
      const response = await openai.chat.completions.create({
        model,
        temperature,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      });

      const text = response.choices[0]?.message?.content?.trim();
      if (!text) throw new ProviderAppError("Empty model response.");
      return text;
    } catch (error) {
      if (error instanceof ProviderAppError) throw error;
      throw new ProviderAppError("Failed to call LLM provider.", {
        originalError: error instanceof Error ? error.message : String(error),
      });
    }
  });
}
