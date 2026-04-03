import { z } from "zod";

export const ErrorFindingSchema = z.object({
  span: z.string(),
  category: z.enum([
    "morphosyntax",
    "syntax",
    "semantics",
    "pragmatics",
    "lexicon",
    "transfer",
    "aspect",
    "case",
    "agreement",
  ]),
  subtype: z.string(),
  explanation: z.string(),
  severity: z.enum(["low", "medium", "high"]),
  confidence: z.number().min(0).max(1),
  suggestedFix: z.string().optional(),
});

export const ErrorAnalystOutputSchema = z.object({
  findings: z.array(ErrorFindingSchema),
  primaryIssue: z.string(),
  correctedTextCandidate: z.string(),
});

export const SyntaxIssueSchema = z.object({
  span: z.string(),
  subtype: z.enum([
    "aspect",
    "case",
    "agreement",
    "mood",
    "article",
    "word-order",
    "verb-pattern",
    "voice",
    "inflection",
  ]),
  explanation: z.string(),
  correction: z.string().optional(),
  confidence: z.number().min(0).max(1),
});

export const SyntaxOutputSchema = z.object({
  sentenceType: z.enum(["simple", "compound", "complex", "fragment", "unclear"]),
  issues: z.array(SyntaxIssueSchema),
  overallComment: z.string(),
});

export const ContrastiveOutputSchema = z.object({
  likelyTransfer: z.boolean(),
  sourceLanguage: z.enum(["spanish", "english"]).optional(),
  pattern: z.string().optional(),
  explanation: z.string().optional(),
  examplePair: z
    .object({
      foreignLikeForm: z.string(),
      naturalGreekForm: z.string(),
    })
    .optional(),
  confidence: z.number().min(0).max(1),
});

export const TutorOutputSchema = z.object({
  focusPoint: z.string(),
  feedback: z.string(),
  correctedVersion: z.string(),
  linguisticInsight: z.string(),
  nextStep: z.string(),
});

export const ExerciseItemSchema = z.object({
  type: z.enum(["correction", "transformation", "choice", "production"]),
  prompt: z.string(),
  answer: z.string().optional(),
  teachingPoint: z.string(),
});

export const ExerciseOutputSchema = z.object({
  exercises: z.array(ExerciseItemSchema).min(2).max(3),
});

export type ErrorFinding = z.infer<typeof ErrorFindingSchema>;
export type ErrorAnalystOutput = z.infer<typeof ErrorAnalystOutputSchema>;
export type SyntaxOutput = z.infer<typeof SyntaxOutputSchema>;
export type ContrastiveOutput = z.infer<typeof ContrastiveOutputSchema>;
export type TutorOutput = z.infer<typeof TutorOutputSchema>;
export type ExerciseItem = z.infer<typeof ExerciseItemSchema>;
export type ExerciseOutput = z.infer<typeof ExerciseOutputSchema>;
