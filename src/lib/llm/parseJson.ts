import { ZodSchema, ZodError } from "zod";
import { JsonParseAppError } from "@/lib/utils/errors";

function extractJson(raw: string): string {
  const trimmed = raw.trim();

  if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
    return trimmed;
  }

  const fenced = trimmed.match(/```json\s*([\s\S]*?)```/i);
  if (fenced?.[1]) return fenced[1].trim();

  const generic = trimmed.match(/```\s*([\s\S]*?)```/i);
  if (generic?.[1]) return generic[1].trim();

  const firstBrace = trimmed.indexOf("{");
  const lastBrace = trimmed.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    return trimmed.slice(firstBrace, lastBrace + 1);
  }

  throw new JsonParseAppError("Could not extract JSON from model output.", {
    preview: trimmed.slice(0, 300),
  });
}

export function parseJsonWithSchema<T>(raw: string, schema: ZodSchema<T>): T {
  try {
    const jsonText = extractJson(raw);
    const parsed = JSON.parse(jsonText);
    return schema.parse(parsed);
  } catch (error) {
    if (error instanceof ZodError) {
      throw new JsonParseAppError("Model output failed schema validation.", {
        issues: error.issues,
      });
    }
    if (error instanceof Error) {
      throw new JsonParseAppError(error.message);
    }
    throw error;
  }
}
