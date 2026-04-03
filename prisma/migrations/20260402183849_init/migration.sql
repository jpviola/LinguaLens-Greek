-- CreateTable
CREATE TABLE "AnalysisSession" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT,
    "inputText" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "goal" TEXT,
    "nativeLanguage" TEXT NOT NULL,
    "context" TEXT,
    "primaryIssue" TEXT NOT NULL,
    "correctedVersion" TEXT NOT NULL,
    "tutorFeedback" TEXT NOT NULL,
    "linguisticInsight" TEXT NOT NULL,
    "practiceJson" TEXT NOT NULL,
    "findingsJson" TEXT NOT NULL,
    "contrastiveJson" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
