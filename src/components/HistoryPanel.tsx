type HistoryItem = {
  id: string;
  inputText: string;
  level: string;
  primaryIssue: string;
  createdAt: string;
};

type Props = { 
  items: HistoryItem[];
  lang: "es" | "en";
};

const DICT = {
  es: { title: "Sesiones recientes", noSessions: "Aún no hay sesiones. Analiza un texto para comenzar." },
  en: { title: "Recent sessions", noSessions: "No sessions yet. Analyze a text to get started." }
};

const LEVEL_COLORS: Record<string, string> = {
  A2: "badge-low",
  B1: "badge-blue",
  B2: "badge-cyan",
  C1: "badge-purple",
};

export default function HistoryPanel({ items, lang }: Props) {
  const t = DICT[lang];
  return (
    <div className="card">
      <p className="card-title">{t.title}</p>

      {items.length === 0 ? (
        <div style={{ textAlign: "center", padding: "24px 0", color: "var(--text-muted)", fontSize: "0.85rem" }}>
          {t.noSessions}
        </div>
      ) : (
        <div className="history-list">
          {items.map((item) => (
            <div key={item.id} className="history-item">
              <div className="history-issue">{item.primaryIssue}</div>
              <div className="history-input">{item.inputText}</div>
              <div className="history-meta">
                <span className={`badge ${LEVEL_COLORS[item.level] ?? "badge-blue"}`}>{item.level}</span>
                <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                  {new Date(item.createdAt).toLocaleString(lang === 'es' ? 'es-ES' : 'en-US', { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
