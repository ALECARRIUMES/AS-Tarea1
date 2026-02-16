import { useMemo, useState } from "react";
import "./App.css";

type StatKey = "STR" | "AGI" | "PER" | "VIT" | "INT";

const RANKS = ["E", "D", "C", "B", "A", "S"] as const;

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function rankFromTotal(total: number) {
  // total aprox 0..250
  if (total < 40) return "E";
  if (total < 70) return "D";
  if (total < 105) return "C";
  if (total < 145) return "B";
  if (total < 190) return "A";
  return "S";
}

export default function App() {
  const [name, setName] = useState("Sung Jin-Woo (fan page)");
  const [title, setTitle] = useState("Shadow Monarch // Hunter System UI");
  const [notes, setNotes] = useState(
    "Interfaz inspirada en un “sistema” de cazadores. Sin arte oficial."
  );

  const [stats, setStats] = useState<Record<StatKey, number>>({
    STR: 45,
    AGI: 62,
    PER: 58,
    VIT: 50,
    INT: 39,
  });

  const total = useMemo(
    () => Object.values(stats).reduce((a, b) => a + b, 0),
    [stats]
  );

  const rank = useMemo(() => rankFromTotal(total), [total]);

  const progress = useMemo(() => {
    // Normalizamos 0..250
    return clamp(Math.round((total / 250) * 100), 0, 100);
  }, [total]);

  const dailyQuests = [
    { label: "100 flexiones", done: true },
    { label: "100 sentadillas", done: false },
    { label: "10 km carrera", done: false },
    { label: "Hidratación + descanso", done: true },
  ];

  const missions = [
    {
      tag: "RAID",
      title: "Mazmorra: Puerta Roja",
      desc: "Explora, prioriza supervivencia. Evita combate innecesario.",
      level: "Peligro alto",
    },
    {
      tag: "SKILL",
      title: "Sombras: coordinación",
      desc: "Optimiza formaciones y rotaciones para reducir daño recibido.",
      level: "Entrenamiento",
    },
    {
      tag: "LOOT",
      title: "Inventario: gestión",
      desc: "Clasifica drops por rareza y utilidad. Mantén espacio libre.",
      level: "Rutina",
    },
  ];

  function setStat(key: StatKey, value: number) {
    setStats((s) => ({ ...s, [key]: clamp(value, 0, 100) }));
  }

  return (
    <div className="sl-bg">
      <div className="sl-grid" aria-hidden="true" />
      <div className="sl-glow sl-glow--a" aria-hidden="true" />
      <div className="sl-glow sl-glow--b" aria-hidden="true" />

      <header className="sl-header">
        <div className="sl-badge">
          <span className="dot" />
          CDN Ready
        </div>

        <div className="sl-hero">
          <h1 className="sl-title">
            <span className="sl-title__accent">Solo</span> Leveling
            <span className="sl-title__sub"> — Hunter Dashboard</span>
          </h1>
          <p className="sl-subtitle">
            Página estática (Vite + React + TS) desplegada en S3 + CloudFront.
            Estilo “System UI”.
          </p>

          <div className="sl-actions">
            <a className="btn btn-primary" href="#panel">
              Abrir panel
            </a>
            <a className="btn btn-ghost" href="#misiones">
              Ver misiones
            </a>
          </div>

          <div className="sl-warn">
            <strong>Nota:</strong> Diseño inspirado. No usa imágenes oficiales ni
            contenido con copyright.
          </div>
        </div>
      </header>

      <main className="sl-main">
        <section id="panel" className="card card--wide">
          <div className="card-head">
            <div>
              <h2>Perfil del Cazador</h2>
              <p>Configura nombre y estado. Todo es UI estática.</p>
            </div>
            <div className="rank">
              <span className="rank-label">Rango</span>
              <span className={`rank-chip rank-chip--${rank}`}>{rank}</span>
            </div>
          </div>

          <div className="grid-2">
            <div className="panel">
              <label className="field">
                <span>Nombre</span>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nombre del cazador"
                />
              </label>

              <label className="field">
                <span>Título</span>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Título / Clase"
                />
              </label>

              <label className="field">
                <span>Notas</span>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  placeholder="Notas del sistema…"
                />
              </label>

              <div className="mini">
                <div className="mini-item">
                  <span className="k">Total</span>
                  <span className="v">{total}</span>
                </div>
                <div className="mini-item">
                  <span className="k">Progreso</span>
                  <span className="v">{progress}%</span>
                </div>
                <div className="mini-item">
                  <span className="k">Estado</span>
                  <span className="v ok">Operativo</span>
                </div>
              </div>
            </div>

            <div className="panel panel--preview">
              <div className="preview-top">
                <div className="avatar" aria-hidden="true">
                  <span>SL</span>
                </div>
                <div className="who">
                  <div className="who-name">{name}</div>
                  <div className="who-title">{title}</div>
                </div>
              </div>

              <div className="divider" />

              <div className="meter">
                <div className="meter-top">
                  <span>Sincronización del sistema</span>
                  <span className="meter-val">{progress}%</span>
                </div>
                <div className="bar">
                  <div className="bar-fill" style={{ width: `${progress}%` }} />
                </div>
              </div>

              <div className="divider" />

              <div className="notes">
                <div className="notes-label">Mensaje del sistema</div>
                <div className="notes-text">{notes}</div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid-3">
          <div className="card">
            <div className="card-head small">
              <div>
                <h3>Estadísticas</h3>
                <p>Arrastra para ajustar (0–100).</p>
              </div>
              <span className="pill">SYSTEM</span>
            </div>

            <div className="stats">
              {(
                [
                  ["STR", "Fuerza"],
                  ["AGI", "Agilidad"],
                  ["PER", "Percepción"],
                  ["VIT", "Vitalidad"],
                  ["INT", "Inteligencia"],
                ] as Array<[StatKey, string]>
              ).map(([k, label]) => (
                <div className="stat" key={k}>
                  <div className="stat-top">
                    <span className="stat-k">{k}</span>
                    <span className="stat-label">{label}</span>
                    <span className="stat-v">{stats[k]}</span>
                  </div>
                  <input
                    className="range"
                    type="range"
                    min={0}
                    max={100}
                    value={stats[k]}
                    onChange={(e) => setStat(k, Number(e.target.value))}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="card-head small">
              <div>
                <h3>Misiones diarias</h3>
                <p>Checklist (UI).</p>
              </div>
              <span className="pill">DAILY</span>
            </div>

            <ul className="checklist">
              {dailyQuests.map((q) => (
                <li key={q.label} className={q.done ? "done" : ""}>
                  <span className="box" aria-hidden="true" />
                  <span className="txt">{q.label}</span>
                  <span className="tag">{q.done ? "OK" : "PEND"}</span>
                </li>
              ))}
            </ul>

            <div className="hint">
              Tip: si haces cambios y haces push, el pipeline actualiza S3 y
              limpia cache de CloudFront.
            </div>
          </div>

          <div className="card" id="misiones">
            <div className="card-head small">
              <div>
                <h3>Registro de misiones</h3>
                <p>Tarjetas estilo “raid log”.</p>
              </div>
              <span className="pill">LOG</span>
            </div>

            <div className="missions">
              {missions.map((m) => (
                <article key={m.title} className="mission">
                  <div className="mission-top">
                    <span className="mission-tag">{m.tag}</span>
                    <span className="mission-level">{m.level}</span>
                  </div>
                  <div className="mission-title">{m.title}</div>
                  <div className="mission-desc">{m.desc}</div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <footer className="sl-footer">
          <div className="footer-inner">
            <span>Vite + React + TS</span>
            <span className="sep" />
            <span>S3 + CloudFront</span>
            <span className="sep" />
            <span>Doppler → GitHub Secrets</span>
          </div>
        </footer>
      </main>
    </div>
  );
}
