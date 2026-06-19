"use client";

import type { QuizData } from "./QuizStep";

interface ConfirmScreenProps {
  data: QuizData;
  fotoPreviewUrl: string | null;
  onConfirm: () => void;
  onBack: () => void;
}

export default function ConfirmScreen({ data, fotoPreviewUrl, onConfirm, onBack }: ConfirmScreenProps) {
  const formatDate = (iso: string) => {
    if (!iso) return "—";
    const [y, m, d] = iso.split("-");
    return `${d}.${m}.${y}`;
  };

  const rows = [
    { label: "NAME",      value: data.nome || "—" },
    { label: "WHATSAPP",  value: data.telefone || "—" },
    { label: "VEREIN",    value: data.clube || "—" },
    { label: "DATUM",     value: formatDate(data.dataNascimento) },
    ...(data.peso   ? [{ label: "GEWICHT", value: `${data.peso} kg` }]   : []),
    ...(data.altura ? [{ label: "GRÖSSE",  value: `${data.altura} cm` }] : []),
  ];

  return (
    <section
      className="flex flex-col items-center min-h-[100dvh] w-full px-4 py-6 justify-start"
      style={{ background: "#FABD00" }}
    >
      {/* Card */}
      <div className="bg-white rounded-2xl w-full max-w-md shadow-lg overflow-hidden animate-slide-up">

        {/* Fortschrittsbalken */}
        <div className="px-5 pt-5 pb-2">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold text-gray-500" style={{ fontFamily: "var(--font-papernotes)" }}>
              Schritt 4 von 4
            </span>
            <span className="text-xs font-bold text-copa-blue" style={{ fontFamily: "var(--font-papernotes)" }}>
              100%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-copa-blue h-2 rounded-full w-full" />
          </div>
        </div>

        {/* Inhalt */}
        <div className="px-5 pb-6 pt-4 flex flex-col items-center">

          {/* Titel */}
          <h2
            className="text-2xl font-bold text-copa-blue text-center mb-3 tracking-wide"
            style={{ fontFamily: "var(--font-titulo)" }}
          >
            ÜBERPRÜFE DEINE DATEN
          </h2>

          {/* Untertitel */}
          <p className="text-sm text-gray-600 text-center mb-1" style={{ fontFamily: "var(--font-papernotes)" }}>
            Deine Karte wird in Kürze erstellt. Überprüfe die Daten sorgfältig.
          </p>
          <p className="text-sm font-bold text-gray-800 text-center mb-5" style={{ fontFamily: "var(--font-papernotes)" }}>
            Nach Bestätigung und Zahlung sind keine Änderungen mehr möglich.
          </p>

          {/* Foto */}
          <div className="flex flex-col items-center mb-5">
            {fotoPreviewUrl ? (
              <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-copa-blue shadow-md mb-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={fotoPreviewUrl} alt="Dein Foto" className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="w-20 h-20 rounded-full bg-gray-200 border-4 border-copa-blue flex items-center justify-center mb-2">
                <span className="text-3xl">📷</span>
              </div>
            )}
            <p className="text-xs font-bold text-copa-blue text-center" style={{ fontFamily: "var(--font-papernotes)" }}>
              STELLE SICHER, DASS DAS GESICHT GUT ZU SEHEN IST
            </p>
          </div>

          {/* Datentabelle */}
          <div className="w-full rounded-xl overflow-hidden border border-gray-100 mb-6">
            {rows.map((row, i) => (
              <div
                key={row.label}
                className={`flex justify-between items-center px-4 py-3 ${i < rows.length - 1 ? "border-b border-gray-100" : ""}`}
                style={{ background: i % 2 === 0 ? "#F8FAFC" : "#fff" }}
              >
                <span className="text-xs font-bold text-gray-400 tracking-widest" style={{ fontFamily: "var(--font-titulo)" }}>
                  {row.label}
                </span>
                <span className="text-sm font-bold text-gray-700 text-right max-w-[70%]" style={{ fontFamily: "var(--font-papernotes)" }}>
                  {row.value}
                </span>
              </div>
            ))}
          </div>

          {/* Bestätigen-Button */}
          <button
            onClick={onConfirm}
            className="w-full text-copa-white font-bold text-lg py-4 rounded-2xl
              shadow-lg active:scale-95 transition-all duration-200 cursor-pointer tracking-[0.1em] mb-3"
            style={{
              fontFamily: "var(--font-titulo)",
              background: "linear-gradient(135deg, #1a1a1a 0%, #000000 100%)",
              boxShadow: "0 6px 24px rgba(0,0,0,0.45)",
            }}
          >
            VERSTANDEN, KARTE ERSTELLEN ⚽
          </button>

          {/* Zurück-Button */}
          <button
            onClick={onBack}
            className="w-full bg-white text-copa-blue font-bold text-base py-4 rounded-2xl
              border-2 border-copa-blue hover:bg-gray-50 active:scale-95 transition-all duration-200 cursor-pointer tracking-[0.1em]"
            style={{ fontFamily: "var(--font-titulo)" }}
          >
            DATEN KORRIGIEREN
          </button>
        </div>
      </div>

      {/* Punkte */}
      <div className="flex gap-2 mt-5">
        {[0, 1, 2, 3].map(i => (
          <div key={i} className="w-3 h-3 rounded-full bg-copa-blue" />
        ))}
      </div>
    </section>
  );
}
