"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import InputPanel from "@/components/InputPanel";
import DiagnosisPanel from "@/components/DiagnosisPanel";
import PracticePanel from "@/components/PracticePanel";
import HistoryPanel from "@/components/HistoryPanel";

const DICT = {
  es: {
    title: "LinguaLens Clásico",
    tagline: "Aristóteles, Sófocles y el Griego del Nuevo Testamento.",
    mvp: "CLASSIC",
    dashboard: "Lexicón",
    readyTitle: "Análisis Filológico",
    readyDesc: "Escribe o pega tu pasaje en Griego Antiguo y pulsa Analizar. La IA detectará morfología, sintaxis y acentuación politónica.",
    running: "Analizando morfología...",
    error: "Error en el análisis filológico",
  },
  en: {
    title: "LinguaLens Classic",
    tagline: "Aristotle, Sophocles, and New Testament Greek.",
    mvp: "CLASSIC",
    dashboard: "Lexicon",
    readyTitle: "Philological Analysis",
    readyDesc: "Write or paste your Ancient Greek passage and click Analyze. The AI will detect morphology, syntax, and polytonic accentuation.",
    running: "Running morphological analysis...",
    error: "Philological analysis failed",
  }
};

export default function HomePage() {
  const [lang, setLang] = useState<"es" | "en">("es");
  const [result, setResult] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const t = DICT[lang];

  async function loadHistory() {
    setHistoryLoading(true);
    try {
      const res = await fetch("/api/history");
      const data = await res.json();
      if (res.ok) setHistory(data.items ?? []);
    } finally {
      setHistoryLoading(false);
    }
  }

  async function handleAnalyze(payload: {
    text: string;
    level: "A2" | "B1" | "B2" | "C1";
    goal: "diagnose" | "difference" | "pattern-fix" | "aspect-mastery" | "case-accuracy";
    nativeLanguage: "spanish" | "english";
    context: "general" | "academic" | "professional" | "casual" | "philosophical";
  }) {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/session/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Analysis failed");
      setResult(data);
      await loadHistory();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadHistory(); }, []);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-base)" }}>
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-brand">
          <div className="navbar-logo">🔍</div>
          <div>
            <span className="navbar-title">{t.title}</span>
            <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginLeft: 8 }}>{t.tagline}</span>
          </div>
        </div>
        
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <button 
            onClick={() => setLang(lang === "es" ? "en" : "es")}
            className="btn btn-ghost btn-sm"
            style={{ fontWeight: 800, minWidth: 40, border: "1px solid var(--border-muted)" }}
          >
            {lang === "es" ? "EN" : "ES"}
          </button>
          
          <div style={{ height: 20, width: 1, background: "var(--border-muted)" }} />
          
          <Link href="/dashboard" className="btn btn-primary btn-sm" style={{ padding: '8px 16px' }}>{t.dashboard}</Link>
        </div>
      </nav>

      <div className="app-shell">
        <div className="app-stack">
          {/* Main Content Areas Stacked */}
          
          <section className="full-width-panel">
            <InputPanel onAnalyze={handleAnalyze} loading={loading} lang={lang} />
          </section>

          <section className="full-width-panel">
            {error && (
              <div className="error-banner">
                <span>⚠</span> {error}
              </div>
            )}

            {!result && !loading && !error && (
              <div className="empty-state">
                <div className="empty-state-icon">🧠</div>
                <div className="empty-state-title">{t.readyTitle}</div>
                <div className="empty-state-desc">{t.readyDesc}</div>
              </div>
            )}

            {loading && (
              <div className="empty-state">
                <div className="empty-state-icon">⚙️</div>
                <div className="empty-state-title">{t.running}</div>
                <div className="empty-state-desc">
                  Analista de Errores · Morfosintaxis · Transferencia · Tutoría · Generador de Ejercicios
                </div>
              </div>
            )}

            {result && (
              <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
                <DiagnosisPanel result={result} lang={lang} />
                <PracticePanel result={result} lang={lang} />
              </div>
            )}
          </section>

          <section className="full-width-panel">
             {!historyLoading && <HistoryPanel items={history} lang={lang} />}
          </section>
        </div>
      </div>
    </div>
  );
}
