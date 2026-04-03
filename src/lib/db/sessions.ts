import { prisma } from "@/lib/db/prisma";
import { SessionResponse } from "@/lib/schemas/session";

export async function saveSession(input: {
  userId?: string;
  text: string;
  level: string;
  goal?: string;
  nativeLanguage?: string;
  context?: string;
  result: SessionResponse;
}) {
  return prisma.analysisSession.create({
    data: {
      userId: input.userId,
      inputText: input.text,
      level: input.level,
      goal: input.goal,
      nativeLanguage: input.nativeLanguage ?? "spanish",
      context: input.context,
      primaryIssue: input.result.diagnosis.primaryIssue,
      correctedVersion: input.result.tutor.correctedVersion,
      tutorFeedback: input.result.tutor.feedback,
      linguisticInsight: input.result.tutor.linguisticInsight,
      practiceJson: JSON.stringify(input.result.practice),
      findingsJson: JSON.stringify(input.result.diagnosis.findings),
      contrastiveJson: input.result.diagnosis.contrastive ? JSON.stringify(input.result.diagnosis.contrastive) : null,
    },
  });
}

export async function listRecentSessions(limit = 10) {
  return prisma.analysisSession.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
    select: {
      id: true,
      inputText: true,
      level: true,
      primaryIssue: true,
      createdAt: true,
    },
  });
}
