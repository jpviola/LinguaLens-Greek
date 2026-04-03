import { prisma } from "@/lib/db/prisma";

export type DashboardStats = {
  totalSessions: number;
  topPatterns: { pattern: string; count: number }[];
  levelBreakdown: { level: string; count: number }[];
  recentSessions: {
    id: string;
    inputText: string;
    level: string;
    primaryIssue: string;
    correctedVersion: string;
    tutorFeedback: string;
    linguisticInsight: string;
    practiceJson: string;
    findingsJson: string;
    contrastiveJson: string | null;
    createdAt: Date;
  }[];
};

export async function getDashboardStats(): Promise<DashboardStats> {
  const sessions = await prisma.analysisSession.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  const totalSessions = await prisma.analysisSession.count();

  // Tally recurring patterns from primaryIssue field
  const patternMap = new Map<string, number>();
  for (const s of sessions) {
    const key = s.primaryIssue;
    patternMap.set(key, (patternMap.get(key) ?? 0) + 1);
  }
  const topPatterns = Array.from(patternMap.entries())
    .map(([pattern, count]) => ({ pattern, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  // Level breakdown
  const levelMap = new Map<string, number>();
  for (const s of sessions) {
    levelMap.set(s.level, (levelMap.get(s.level) ?? 0) + 1);
  }
  const levelBreakdown = Array.from(levelMap.entries())
    .map(([level, count]) => ({ level, count }))
    .sort((a, b) => ["A2","B1","B2","C1"].indexOf(a.level) - ["A2","B1","B2","C1"].indexOf(b.level));

  return {
    totalSessions,
    topPatterns,
    levelBreakdown,
    recentSessions: sessions.slice(0, 10),
  };
}
