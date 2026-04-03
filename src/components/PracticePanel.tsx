type ExerciseItem = {
  type: "correction" | "transformation" | "choice" | "production";
  prompt: string;
  answer?: string;
  teachingPoint: string;
};

type Props = { 
  result: any;
  lang: "es" | "en";
};

const DICT = {
  es: {
    title: "Práctica",
    exercise: "Ejercicio",
    types: {
      correction: "Corrección",
      transformation: "Transformación",
      choice: "Elección",
      production: "Producción"
    }
  },
  en: {
    title: "Practice",
    exercise: "Exercise",
    types: {
      correction: "Correction",
      transformation: "Transformation",
      choice: "Choice",
      production: "Production"
    }
  }
};

const TYPE_CONFIG: Record<string, { color: string; icon: string }> = {
  correction:     { color: "badge-high",   icon: "✎" },
  transformation: { color: "badge-blue",   icon: "⇄" },
  choice:         { color: "badge-cyan",   icon: "◉" },
  production:     { color: "badge-purple", icon: "✍" },
};

export default function PracticePanel({ result, lang }: Props) {
  if (!result) return null;

  const t = DICT[lang];
  const exercises: ExerciseItem[] = result.practice ?? [];

  return (
    <div className="card fade-in">
      <p className="card-title">{t.title}</p>

      <div className="exercise-list">
        {exercises.map((item, i) => {
          const config = TYPE_CONFIG[item.type] ?? { color: "badge-blue", icon: "◆" };
          const label = (t.types as any)[item.type] || item.type;
          
          return (
            <div key={i} className="exercise-item">
              <div className="exercise-header">
                <span className="exercise-num">{t.exercise} {i + 1}</span>
                <span className={`badge ${config.color}`}>{config.icon} {label}</span>
              </div>
              <div className="exercise-body">
                <p className="exercise-prompt">{item.prompt}</p>
                {item.answer && (
                  <div className="exercise-answer">✓ {item.answer}</div>
                )}
                <div className="exercise-point">💡 {item.teachingPoint}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
