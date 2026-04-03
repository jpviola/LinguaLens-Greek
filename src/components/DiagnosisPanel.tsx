type Finding = {
  span: string;
  category: string;
  subtype: string;
  explanation: string;
  severity: "low" | "medium" | "high";
  confidence: number;
  suggestedFix?: string;
};

type Contrastive = {
  likelyTransfer: boolean;
  sourceLanguage?: "spanish" | "english";
  pattern?: string;
  explanation?: string;
  examplePair?: { foreignLikeForm: string; naturalGreekForm: string };
};

type Props = {
  result: any;
  lang: "es" | "en";
};

const DICT = {
  es: {
    diagnosisTitle: "Diagnóstico",
    primaryIssue: "Problema principal",
    feedback: "Resumen",
    corrected: "Versión corregida",
    insight: "Clave lingüística",
    nextStep: "Próximo paso",
    transferDetected: "Transferencia detectada",
    breakdown: "Desglose de errores",
    pattern: "Patrón",
    severity: { high: "Alta", medium: "Media", low: "Baja" }
  },
  en: {
    diagnosisTitle: "Diagnosis",
    primaryIssue: "Primary issue",
    feedback: "Feedback",
    corrected: "Corrected version",
    insight: "Linguistic insight",
    nextStep: "Next step",
    transferDetected: "Transfer detected",
    breakdown: "Error breakdown",
    pattern: "Pattern",
    severity: { high: "High", medium: "Medium", low: "Low" }
  }
};

function SeverityBadge({ severity, lang }: { severity: string, lang: "es" | "en" }) {
  const t = DICT[lang].severity as any;
  return (
    <span className={`badge badge-${severity}`}>
      {severity === "high" ? "⬆" : severity === "medium" ? "◆" : "⬇"} {t[severity] || severity}
    </span>
  );
}

function CategoryBadge({ category }: { category: string }) {
  const map: Record<string, string> = {
    morphosyntax: "badge-blue",
    syntax: "badge-cyan",
    transfer: "badge-purple",
    semantics: "badge-medium",
    lexicon: "badge-low",
    pragmatics: "badge-medium",
    aspect: "badge-blue",
    case: "badge-cyan",
  };
  return <span className={`badge ${map[category] ?? "badge-blue"}`}>{category}</span>;
}

export default function DiagnosisPanel({ result, lang }: Props) {
  if (!result) return null;

  const t = DICT[lang];
  const findings: Finding[] = result.diagnosis.findings ?? [];
  const contrastive: Contrastive | undefined = result.diagnosis.contrastive;

  return (
    <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: 20 }}>

      {/* Primary issue + tutor response */}
      <div className="card">
        <p className="card-title">{t.diagnosisTitle}</p>

        <div className="primary-issue">
          <div className="primary-issue-label">{t.primaryIssue}</div>
          <div className="primary-issue-text">{result.diagnosis.primaryIssue}</div>
        </div>

        <div className="tutor-grid">
          <div className="tutor-field">
            <div className="tutor-field-label">{t.feedback}</div>
            <div className="tutor-field-value">{result.tutor.feedback}</div>
          </div>

          <div className="tutor-field">
            <div className="tutor-field-label">{t.corrected}</div>
            <div className="corrected-text">{result.tutor.correctedVersion}</div>
          </div>

          <div className="tutor-field">
            <div className="tutor-field-label">{t.insight}</div>
            <div className="tutor-field-value">{result.tutor.linguisticInsight}</div>
          </div>

          <div className="tutor-field">
            <div className="tutor-field-label">{t.nextStep}</div>
            <div className="tutor-field-value">→ {result.tutor.nextStep}</div>
          </div>
        </div>

        {/* ES/EN transfer */}
        {contrastive?.likelyTransfer && (
          <div className="transfer-card">
            <div className="transfer-card-title">
              {contrastive.sourceLanguage === "spanish" ? (lang === 'es' ? '🇪🇸 Transferencia de Español' : '🇪🇸 Spanish transfer') : (lang === 'es' ? '🇬🇧 Transferencia de Inglés' : '🇬🇧 English transfer')} {lang === 'es' ? 'detectada' : 'detected'}
            </div>
            {contrastive.pattern && (
              <div style={{ fontSize: "0.82rem", color: "var(--text-secondary)", marginBottom: 6 }}>
                <strong style={{ color: "var(--text-primary)" }}>{t.pattern}:</strong> {contrastive.pattern}
              </div>
            )}
            <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>{contrastive.explanation}</div>
            {contrastive.examplePair && (
              <div className="transfer-example">
                <div className="transfer-form bad">✗ {contrastive.examplePair.foreignLikeForm}</div>
                <div className="transfer-arrow">→</div>
                <div className="transfer-form good">✓ {contrastive.examplePair.naturalGreekForm}</div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Findings breakdown */}
      {findings.length > 0 && (
        <div className="card">
          <p className="card-title">{t.breakdown}</p>
          <div className="findings-list">
            {findings.map((f, i) => (
              <div key={i} className="finding-item">
                <span className="finding-span">"{f.span}"</span>
                <div className="finding-body">
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 6 }}>
                    <SeverityBadge severity={f.severity} lang={lang} />
                    <CategoryBadge category={f.category} />
                    <span className="badge" style={{ background: "var(--bg-base)", color: "var(--text-muted)" }}>{f.subtype}</span>
                  </div>
                  <div className="finding-explanation">{f.explanation}</div>
                  {f.suggestedFix && (
                    <div className="finding-fix">→ {f.suggestedFix}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
