import { SessionInputSchema, SessionResponseSchema } from "@/lib/schemas/session";
import { runErrorAnalyst } from "@/lib/agents/errorAnalyst";
import { runSyntax } from "@/lib/agents/syntax";
import { runContrastive } from "@/lib/agents/contrastive";
import { runTutor } from "@/lib/agents/tutor";
import { runExerciseGenerator } from "@/lib/agents/exerciseGenerator";
import { updateProgressProfile } from "@/lib/memory/progressMapper";

export async function runSession(rawInput: unknown) {
  const input = SessionInputSchema.parse(rawInput);

  const [errorAnalysis, syntaxAnalysis, contrastiveAnalysis] = await Promise.all([
    runErrorAnalyst({
      text: input.text,
      level: input.level,
      goal: input.goal,
      context: input.context,
    }),
    runSyntax({
      text: input.text,
      level: input.level,
    }),
    runContrastive({
      text: input.text,
      level: input.level,
      nativeLanguage: input.nativeLanguage,
    }),
  ]);

  const findingsSummary = errorAnalysis.findings
    .map((f: any) => `${f.category}/${f.subtype}: ${f.explanation}`)
    .join(" | ");

  const contrastiveSummary = contrastiveAnalysis.likelyTransfer
    ? `${contrastiveAnalysis.pattern}: ${contrastiveAnalysis.explanation}`
    : "No clear ES/EN transfer.";

  const tutor = await runTutor({
    originalText: input.text,
    primaryIssue: errorAnalysis.primaryIssue,
    correctedTextCandidate: errorAnalysis.correctedTextCandidate,
    findingsSummary,
    syntaxSummary: syntaxAnalysis.overallComment,
    contrastiveSummary,
    level: input.level,
  });

  const exercisePack = await runExerciseGenerator({
    originalText: input.text,
    primaryIssue: errorAnalysis.primaryIssue,
    correctedVersion: tutor.correctedVersion,
    linguisticInsight: tutor.linguisticInsight,
    level: input.level,
  });

  const memory = await updateProgressProfile({
    userId: input.userId,
    primaryIssue: errorAnalysis.primaryIssue,
    findings: errorAnalysis.findings.map((f: any) => ({
      category: f.category,
      subtype: f.subtype,
    })),
  });

  return SessionResponseSchema.parse({
    input: {
      text: input.text,
      level: input.level,
      goal: input.goal,
      context: input.context,
    },
    diagnosis: {
      primaryIssue: errorAnalysis.primaryIssue,
      findings: errorAnalysis.findings,
      contrastive: contrastiveAnalysis,
      syntaxSummary: syntaxAnalysis.overallComment,
    },
    tutor,
    practice: exercisePack.exercises,
    memory: {
      profileUpdated: true,
      recurringPatterns: memory.recurringPatterns,
    },
    metadata: {
      generatedAt: new Date().toISOString(),
    },
  });
}
