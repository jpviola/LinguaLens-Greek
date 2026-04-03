"use client";

import { useEffect, useState } from "react";
import VirtualKeyboard from "./VirtualKeyboard";

const DICT = {
  es: {
    cardTitle: "TEXTO GRIEGO CLÁSICO",
    placeholder: "Πάντες ἄνθρωποι τοῦ εἰδέναι ὀρέγονται φύσει...",
    level: "NIVEL",
    nativeLang: "LENGUA NATIVA",
    goal: "OBJETIVO",
    context: "CONTEXTO",
    keyboard: "Teclado Politónico",
    diagnose: "ANALIZAR PASAJE",
    analyzing: "FILOLOGÍA...",
    levels: { A2: "Principiante", B1: "Intermedio", B2: "Avanzado", C1: "Experto" },
    goals: { diagnose: "Análisis General", "aspect-mastery": "Dominio del Aspecto", "case-accuracy": "Precisión de Casos Clásicos", difference: "Diferencia de Autor", "pattern-fix": "Corregir Morfología" },
    contexts: { general: "Koiné / Bíblico", academic: "Filosófico (Aristóteles/Platón)", philosophical: "Clásico (Sófocles/Tragedia)", professional: "Prosa Ática", casual: "General" }
  },
  en: {
    cardTitle: "CLASSICAL GREEK TEXT",
    placeholder: "Explore the Classic Greek language...",
    level: "LEVEL",
    nativeLang: "NATIVE LANGUAGE",
    goal: "GOAL",
    context: "CONTEXT",
    keyboard: "Polytonic Keyboard",
    diagnose: "ANALYZE PASSAGE",
    analyzing: "PHILOLOGY...",
    levels: { A2: "Elementary", B1: "Intermediate", B2: "Advanced", C1: "Expert" },
    goals: { diagnose: "General Analysis", "aspect-mastery": "Aspect Mastery", "case-accuracy": "Classical Case Accuracy", difference: "Author Difference", "pattern-fix": "Morphology Fix" },
    contexts: { general: "Koine / Biblical", academic: "Philosophical (Aristotle/Platoon)", philosophical: "Classic (Sophocles/Tragedy)", professional: "Attic Prose", casual: "General" }
  }
};

type Props = {
  lang: "es" | "en";
  onAnalyze: (payload: {
    text: string;
    level: "A2" | "B1" | "B2" | "C1";
    goal: "diagnose" | "difference" | "pattern-fix" | "aspect-mastery" | "case-accuracy";
    nativeLanguage: "spanish" | "english";
    context: "general" | "academic" | "professional" | "casual" | "philosophical";
  }) => Promise<void>;
  loading: boolean;
};

export default function InputPanel({ lang, onAnalyze, loading }: Props) {
  const [mounted, setMounted] = useState(false);
  const [text, setText] = useState("Πάντες ἄνθρωποι τοῦ εἰδέναι ὀρέγονται φύσει.");
  const [level, setLevel] = useState<"A2" | "B1" | "B2" | "C1">("B1");
  const [goal, setGoal] = useState<"diagnose" | "difference" | "pattern-fix" | "aspect-mastery" | "case-accuracy">("diagnose");
  const [nativeLanguage, setNativeLanguage] = useState<"spanish" | "english">("spanish");
  const [context, setContext] = useState<"general" | "academic" | "professional" | "casual" | "philosophical">("philosophical");
  const [kbVisible, setKbVisible] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const t = DICT[lang];

  if (!mounted) {
    return <div className="card" style={{ minHeight: 400 }}></div>;
  }

  return (
    <form onSubmit={(e) => { e.preventDefault(); onAnalyze({ text, level, goal, nativeLanguage, context }); }} className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-muted)', paddingBottom: 12, marginBottom: 20 }}>
        <p className="card-title" style={{ margin: 0, fontSize: '0.8rem', letterSpacing: '0.2em' }}>{t.cardTitle}</p>
        <button 
          type="button" 
          onClick={() => setKbVisible(!kbVisible)}
          className={`btn btn-sm ${kbVisible ? 'btn-primary' : 'btn-ghost'}`}
          style={{ fontSize: '0.7rem', borderRadius: '4px' }}
        >
          ⌨ {t.keyboard}
        </button>
      </div>

      <textarea
        id="input-text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={t.placeholder}
        disabled={loading}
      />

      <div style={{ height: kbVisible ? 'auto' : 0, overflow: 'hidden', transition: 'all 0.3s' }}>
        <VirtualKeyboard 
          visible={kbVisible} 
          input={text} 
          onChange={(val) => setText(val)} 
          lang={lang}
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20, marginTop: 32 }}>
        <div>
          <label htmlFor="level-select">{t.level}</label>
          <select id="level-select" value={level} onChange={(e) => setLevel(e.target.value as typeof level)} disabled={loading}>
            <option value="A2">{t.levels.A2}</option>
            <option value="B1">{t.levels.B1}</option>
            <option value="B2">{t.levels.B2}</option>
            <option value="C1">{t.levels.C1}</option>
          </select>
        </div>

        <div>
           <label htmlFor="native-language-select">{t.nativeLang}</label>
           <select id="native-language-select" value={nativeLanguage} onChange={(e) => setNativeLanguage(e.target.value as typeof nativeLanguage)} disabled={loading}>
             <option value="spanish">{lang === 'es' ? 'Español' : 'Spanish'}</option>
             <option value="english">{lang === 'es' ? 'Inglés' : 'English'}</option>
           </select>
        </div>

        <div>
          <label htmlFor="goal-select">{t.goal}</label>
          <select id="goal-select" value={goal} onChange={(e) => setGoal(e.target.value as typeof goal)} disabled={loading}>
            <option value="diagnose">{t.goals.diagnose}</option>
            <option value="aspect-mastery">{t.goals["aspect-mastery"]}</option>
            <option value="case-accuracy">{t.goals["case-accuracy"]}</option>
            <option value="difference">{t.goals.difference}</option>
            <option value="pattern-fix">{t.goals["pattern-fix"]}</option>
          </select>
        </div>

        <div>
          <label htmlFor="context-select">{t.context}</label>
          <select id="context-select" value={context} onChange={(e) => setContext(e.target.value as typeof context)} disabled={loading}>
            <option value="general">{t.contexts.general}</option>
            <option value="academic">{t.contexts.academic}</option>
            <option value="philosophical">{t.contexts.philosophical}</option>
            <option value="professional">{t.contexts.professional}</option>
            <option value="casual">{t.contexts.casual}</option>
          </select>
        </div>
      </div>

      <button
        type="submit"
        className="btn btn-primary"
        style={{ width: "100%", marginTop: 32, padding: '20px', fontSize: '1.1rem' }}
        disabled={loading || !text.trim()}
      >
        {loading ? t.analyzing : t.diagnose}
      </button>
      
      <style jsx>{`
        label {
          font-family: 'Inter', sans-serif;
          font-weight: 700;
          font-size: 0.65rem;
          letter-spacing: 0.1em;
          color: var(--text-muted);
          margin-bottom: 8px;
          display: block;
        }
        select {
          border: 1px solid var(--border-muted);
          background: transparent;
          font-size: 0.85rem;
          padding: 10px;
        }
      `}</style>
    </form>
  );
}
