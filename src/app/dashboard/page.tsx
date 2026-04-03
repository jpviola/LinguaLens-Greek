"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Stats = {
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
    createdAt: string;
  }[];
};

function BarChart({ data, maxValue }: { data: { label: string; value: number }[]; maxValue: number }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {data.map(({ label, value }) => {
        const pct = maxValue > 0 ? (value / maxValue) * 100 : 0;
        return (
          <div key={label} style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 12, alignItems: "center" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <span style={{ fontSize: "0.78rem", color: "var(--text-secondary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{label}</span>
              <div style={{ height: 6, borderRadius: 99, background: "var(--bg-elevated)", overflow: "hidden" }}>
                <div style={{
                  height: "100%",
                  width: `${pct}%`,
                  borderRadius: 99,
                  background: "linear-gradient(90deg, var(--blue), var(--purple))",
                  transition: "width 0.6s ease",
                }} />
              </div>
            </div>
            <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-primary)", minWidth: 24, textAlign: "right" }}>{value}</span>
          </div>
        );
      })}
    </div>
  );
}

function LevelPills({ data }: { data: { level: string; count: number }[] }) {
  const total = data.reduce((s, d) => s + d.count, 0);
  const colors: Record<string, string> = { A2: "var(--green)", B1: "var(--blue)", B2: "var(--cyan)", C1: "var(--purple)" };
  return (
    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
      {data.map(({ level, count }) => (
        <div key={level} style={{
          flex: 1, minWidth: 70,
          background: "var(--bg-elevated)",
          border: `1px solid var(--border-subtle)`,
          borderRadius: "var(--radius-md)",
          padding: "14px 12px",
          textAlign: "center",
        }}>
          <div style={{ fontSize: "1.4rem", fontWeight: 800, color: colors[level] ?? "var(--blue)" }}>{count}</div>
          <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: 2 }}>{level}</div>
          <div style={{ fontSize: "0.65rem", color: "var(--text-muted)" }}>{total > 0 ? Math.round((count / total) * 100) : 0}%</div>
        </div>
      ))}
    </div>
  );
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((r) => r.json())
      .then((d) => setStats(d))
      .catch(() => setError("Failed to load dashboard."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-header-brand">
          <div className="app-logo">📊</div>
          <div>
            <div className="app-title">Progress Dashboard</div>
            <div className="app-tagline">Your recurring patterns & learning history</div>
          </div>
        </div>
        <Link href="/" className="btn btn-ghost btn-sm">← Back to Diagnose</Link>
      </header>

      {loading && (
        <div className="empty-state">
          <div className="empty-state-icon">⏳</div>
          <div className="empty-state-title">Loading stats…</div>
        </div>
      )}

      {error && <div className="error-banner"><span>⚠</span> {error}</div>}

      {stats && (
        <div style={{ display: "grid", gap: 24 }}>

          {/* Stat cards row */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 16 }}>
            {[
              { label: "Total sessions", value: stats.totalSessions, icon: "🔍" },
              { label: "Unique patterns", value: stats.topPatterns.length, icon: "🧩" },
              { label: "Levels practiced", value: stats.levelBreakdown.length, icon: "📈" },
            ].map(({ label, value, icon }) => (
              <div key={label} className="card" style={{ textAlign: "center", padding: "20px 16px" }}>
                <div style={{ fontSize: "1.8rem", marginBottom: 8 }}>{icon}</div>
                <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--text-primary)" }}>{value}</div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: 4 }}>{label}</div>
              </div>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            {/* Error pattern chart */}
            <div className="card">
              <p className="card-title">Top recurring patterns</p>
              {stats.topPatterns.length === 0 ? (
                <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>No patterns yet.</p>
              ) : (
                <BarChart
                  data={stats.topPatterns.map((p) => ({ label: p.pattern, value: p.count }))}
                  maxValue={stats.topPatterns[0]?.count ?? 1}
                />
              )}
            </div>

            {/* Level breakdown */}
            <div className="card">
              <p className="card-title">Sessions by level</p>
              {stats.levelBreakdown.length === 0 ? (
                <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>No data yet.</p>
              ) : (
                <LevelPills data={stats.levelBreakdown} />
              )}
            </div>
          </div>

          {/* Recent sessions table */}
          <div className="card">
            <p className="card-title">Recent sessions</p>
            {stats.recentSessions.length === 0 ? (
              <div className="empty-state" style={{ border: "none", padding: "24px 0" }}>
                <div className="empty-state-icon">📭</div>
                <div className="empty-state-title">No sessions yet</div>
                <div className="empty-state-desc">
                  <Link href="/" style={{ color: "var(--blue-light)" }}>Start diagnosing</Link> to see your history here.
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {stats.recentSessions.map((s) => (
                  <div key={s.id} style={{
                    display: "grid",
                    gridTemplateColumns: "1fr auto",
                    gap: 16,
                    alignItems: "center",
                    padding: "16px",
                    background: "var(--bg-elevated)",
                    border: "1px solid var(--border-subtle)",
                    borderRadius: "var(--radius-md)",
                  }}>
                    <div>
                      <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6 }}>
                        <span className="badge badge-blue">{s.level}</span>
                        <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                          {new Date(s.createdAt).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                      <div style={{ fontSize: "0.88rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: 4 }}>{s.primaryIssue}</div>
                      <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 480 }}>{s.inputText}</div>
                    </div>
                    <a
                      href={`/api/session/${s.id}/export`}
                      download
                      className="btn btn-ghost btn-sm"
                      title="Export as Markdown"
                    >
                      ⬇ .md
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
