type ProgressUpdateInput = {
  userId?: string;
  primaryIssue: string;
  findings: Array<{
    category: string;
    subtype: string;
  }>;
};

export async function updateProgressProfile(input: ProgressUpdateInput) {
  const recurringPatterns = Array.from(
    new Set([
      input.primaryIssue,
      ...input.findings.map((f) => `${f.category}:${f.subtype}`),
    ])
  );

  return {
    recurringPatterns,
  };
}
