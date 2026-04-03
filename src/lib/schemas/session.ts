import { z } from "zod";
import {
  ContrastiveOutputSchema,
  ErrorFindingSchema,
  ExerciseItemSchema,
  TutorOutputSchema,
} from "@/lib/schemas/agents";

export const SessionInputSchema = z.object({
  userId: z.string().optional(),
  text: z.string().min(3),
  level: z.enum(["A2", "B1", "B2", "C1"]),
  goal: z.enum(["diagnose", "difference", "pattern-fix", "aspect-mastery", "case-accuracy"]).optional(),
  nativeLanguage: z.enum(["spanish", "english"]).optional().default("spanish"),
  context: z.enum(["general", "academic", "professional", "casual", "philosophical"]).optional(),
});

export const SessionResponseSchema = z.object({
  input: z.object({
    text: z.string(),
    level: z.string(),
    goal: z.string().optional(),
    context: z.string().optional(),
  }),
  diagnosis: z.object({
    primaryIssue: z.string(),
    findings: z.array(ErrorFindingSchema),
    contrastive: ContrastiveOutputSchema.optional(),
    syntaxSummary: z.string(),
  }),
  tutor: TutorOutputSchema,
  practice: z.array(ExerciseItemSchema),
  memory: z.object({
    profileUpdated: z.boolean(),
    recurringPatterns: z.array(z.string()),
  }),
  metadata: z.object({
    generatedAt: z.string(),
    sessionId: z.string().optional(),
  }),
});

export type SessionInput = z.infer<typeof SessionInputSchema>;
export type SessionResponse = z.infer<typeof SessionResponseSchema>;
