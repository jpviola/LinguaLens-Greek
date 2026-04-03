"use client";

import { useEffect, useRef } from "react";
import Keyboard from "simple-keyboard";
import "simple-keyboard/build/css/index.css";

const DICT = {
  es: {
    backspace: "retroceso",
    shift: "mayús",
    space: "espacio",
    acute: "agudo ( ́)",
    grave: "grave ( ̀)",
    circumflex: "circumflejo ( ͂)",
    rough: "dasia ( ῾)",
    smooth: "psile ( ᾿)",
    iota: "iota suscrita ( ͅ)",
    legend: {
      acute: "Agudo",
      grave: "Grave",
      circum: "Circumflejo",
      rough: "Espíritu Áspero",
      smooth: "Espíritu Suave",
      iota: "Iota Suscrita"
    }
  },
  en: {
    backspace: "backspace",
    shift: "shift",
    space: "space",
    acute: "acute ( ́)",
    grave: "grave ( ̀)",
    circumflex: "circumflex ( ͂)",
    rough: "rough ( ῾)",
    smooth: "smooth ( ᾿)",
    iota: "iota subscript ( ͅ)",
    legend: {
      acute: "Acute",
      grave: "Grave",
      circum: "Circumflex",
      rough: "Rough (῾)",
      smooth: "Smooth (᾿)",
      iota: "Iota Subscript"
    }
  }
};

type Props = {
  onChange: (input: string) => void;
  input: string;
  visible: boolean;
  lang: "es" | "en";
};

export default function VirtualKeyboard({ onChange, input, visible, lang }: Props) {
  const keyboard = useRef<Keyboard | null>(null);
  const t = DICT[lang];

  useEffect(() => {
    if (!visible) {
      if (keyboard.current) {
        keyboard.current.destroy();
        keyboard.current = null;
      }
      return;
    }

    if (!keyboard.current) {
      keyboard.current = new Keyboard({
        onChange: (input: string) => onChange(input),
        // POLYTONIC GREEK LAYOUT (Classical Mapping)
        layout: {
          default: [
            "1 2 3 4 5 6 7 8 9 0 - {bksp}",
            "; ς ε ρ τ υ θ ι ο π [ ]",
            "α σ δ φ γ η ξ κ λ : '",
            "ζ χ ψ ω β ν μ , . / {shift}",
            "{space} | < > = \\ ` ~"
          ],
          shift: [
            "! @ # $ % ^ & * ( ) _ + {bksp}",
            ": Σ Ε Ρ Τ Υ Θ Ι Ο Π { }",
            "Α Σ Δ Φ Γ Η Ξ Κ Λ : \"",
            "Ζ Χ Ψ Ω Β Ν Μ < > ? {shift}",
            "{space} | { } [ ]"
          ]
        },
        display: {
          '{bksp}': t.backspace,
          '{shift}': t.shift,
          '{space}': t.space,
          '|': t.iota,
          '<': t.rough,
          '>': t.smooth,
          '=': t.circumflex,
          '\\': t.grave,
          '/': t.acute,
          '`': 'grave',
          '~': 'circumflejo'
        },
        theme: "hg-theme-default polytonic-kb",
      });
    }

    return () => {
      if (keyboard.current) {
        keyboard.current.destroy();
        keyboard.current = null;
      }
    };
  }, [visible, lang, t]); // Re-init on language change

  useEffect(() => {
    if (keyboard.current && input !== keyboard.current.getInput()) {
      keyboard.current.setInput(input);
    }
  }, [input]);

  if (!visible) return null;

  return (
    <div className="virtual-keyboard-container fade-in" style={{ marginTop: 24, marginBottom: 24 }}>
      <div className="polytonic-legend">
        <span className="legend-item"><kbd>/</kbd> {t.legend.acute}</span>
        <span className="legend-item"><kbd>\</kbd> {t.legend.grave}</span>
        <span className="legend-item"><kbd>=</kbd> {t.legend.circum}</span>
        <span className="legend-item"><kbd>&lt;</kbd> {t.legend.rough}</span>
        <span className="legend-item"><kbd>&gt;</kbd> {t.legend.smooth}</span>
        <span className="legend-item"><kbd>|</kbd> {t.legend.iota}</span>
      </div>
      <div className="simple-keyboard"></div>
      <style jsx global>{`
        .polytonic-legend {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-bottom: 12px;
          font-family: 'Inter', sans-serif;
          font-size: 0.72rem;
          color: var(--text-muted);
          background: var(--bg-surface);
          padding: 8px 12px;
          border-left: 2px solid var(--accent);
          text-transform: uppercase;
        }
        .legend-item kbd {
          background: var(--bg-base);
          padding: 2px 4px;
          border: 1px solid var(--border-muted);
          border-radius: 3px;
          color: var(--accent);
          font-weight: 800;
        }
        .polytonic-kb .hg-button {
          font-family: 'JetBrains Mono', monospace !important;
          text-transform: none !important;
        }
        .simple-keyboard {
           border-radius: 4px !important;
           max-width: 1000px;
           margin: 0 auto;
        }
      `}</style>
    </div>
  );
}
