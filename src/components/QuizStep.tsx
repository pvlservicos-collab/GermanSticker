"use client";

import { useState, useRef, useEffect } from "react";

export interface QuizData {
  nome: string;
  dataNascimento: string;
  email: string;
  clube: string;
  jogadorFavorito: string;
  peso: string;
  altura: string;
  foto: File | null;
}

interface QuizStepProps {
  step: number;
  data: QuizData;
  updateData: (fields: Partial<QuizData>) => void;
  onNext: () => void;
  onBack: () => void;
  totalSteps: number;
}

const clubs = [
  // 1. Bundesliga
  "FC Bayern München", "Borussia Dortmund", "RB Leipzig", "Bayer 04 Leverkusen",
  "Eintracht Frankfurt", "VfB Stuttgart", "Borussia Mönchengladbach", "SC Freiburg",
  "TSG 1899 Hoffenheim", "FC Augsburg", "Werder Bremen", "1. FC Union Berlin",
  "VfL Wolfsburg", "1. FSV Mainz 05", "FC St. Pauli", "VfL Bochum",
  "1. FC Heidenheim", "Holstein Kiel",
  // 2. Bundesliga
  "Hamburger SV", "Hannover 96", "Fortuna Düsseldorf", "SpVgg Greuther Fürth",
  "FC Schalke 04", "Hertha BSC", "1. FC Kaiserslautern", "Karlsruher SC",
  // Nationalmannschaft und andere
  "Nationalmannschaft (Deutschland)", "Anderer",
];

export default function QuizStep({ step, data, updateData, onNext, onBack, totalSteps }: QuizStepProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const [clubeQuery, setClubeQuery] = useState(data.clube || "");
  const [showClubeList, setShowClubeList] = useState(false);
  const clubeRef = useRef<HTMLDivElement>(null);

  const [birthDay, setBirthDay] = useState("");
  const [birthMonth, setBirthMonth] = useState("");
  const [birthYear, setBirthYear] = useState("");

  const filteredClubs = clubeQuery.trim()
    ? clubs.filter((c) => c.toLowerCase().includes(clubeQuery.toLowerCase()))
    : clubs;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (clubeRef.current && !clubeRef.current.contains(e.target as Node)) setShowClubeList(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const sanitize = (value: string) => value.replace(/<[^>]*>/g, "").replace(/[<>"'&]/g, "");

  const validateStep = (): boolean => {
    const newErrors: Record<string, string> = {};
    switch (step) {
      case 1:
        if (!data.nome || data.nome.trim().length < 2) newErrors.nome = "Der Name muss mindestens 2 Zeichen lang sein";
        if (data.nome.length > 50) newErrors.nome = "Name ist zu lang";
        if (!data.foto) newErrors.foto = "Bitte lade ein Foto hoch";
        break;
      case 2:
        if (!data.dataNascimento) newErrors.dataNascimento = "Bitte gib das Geburtsdatum an";
        else {
          const birth = new Date(data.dataNascimento);
          const now = new Date();
          const age = now.getFullYear() - birth.getFullYear();
          if (age < 0 || age > 120) newErrors.dataNascimento = "Ungültiges Datum";
        }
        { const emailVal = data.email.trim();
          if (!emailVal || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) newErrors.email = "Bitte gib eine gültige E-Mail-Adresse ein"; }
        break;
      case 3:
        if (!data.clube || data.clube.trim().length < 2) newErrors.clube = "Bitte gib einen Verein ein oder wähle einen aus";
        break;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) onNext();
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { setErrors({ foto: "Bitte lade nur Bilder hoch" }); return; }
    if (file.size > 10 * 1024 * 1024) { setErrors({ foto: "Bild zu groß (max. 10 MB)" }); return; }
    updateData({ foto: file });
    const reader = new FileReader();
    reader.onload = (ev) => setPhotoPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
    setErrors((prev) => { const next = { ...prev }; delete next.foto; return next; });
  };

  const progressPercent = (step / totalSteps) * 100;

  return (
    <section className="flex flex-col items-center min-h-[100dvh] w-full px-4 py-8 md:py-16" style={{ background: "#FABD00" }}>
      {/* Fortschrittsbalken */}
      <div className="w-full max-w-md mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-bold text-[#1a1a1a]" style={{ fontFamily: "var(--font-papernotes)" }}>
            Schritt {step} von {totalSteps}
          </span>
          <span className="text-sm text-[#1a1a1a]" style={{ fontFamily: "var(--font-papernotes)" }}>
            {Math.round(progressPercent)}%
          </span>
        </div>
        <div className="w-full h-3 bg-copa-white rounded-full overflow-hidden shadow-inner">
          <div className="h-full bg-copa-blue rounded-full transition-all duration-500 ease-out" style={{ width: `${progressPercent}%` }} />
        </div>
      </div>

      {/* Card */}
      <div className="w-full max-w-md bg-copa-white rounded-3xl shadow-2xl p-6 md:p-8 animate-slide-up">

        {/* Schritt 1: Name + Foto */}
        {step === 1 && (
          <div className="flex flex-col gap-5">
            <div className="text-center">
              <span className="text-4xl mb-2 block">✍️</span>
              <h2 className="text-2xl md:text-3xl font-black text-copa-blue" style={{ fontFamily: "var(--font-titulo)" }}>
                WIE HEISST DER STAR?
              </h2>
              <p className="text-base mt-1 opacity-70" style={{ fontFamily: "var(--font-papernotes)" }}>
                Der Name, der auf der Sammelkarte erscheint
              </p>
            </div>
            <div>
              <input
                type="text"
                value={data.nome}
                onChange={(e) => updateData({ nome: sanitize(e.target.value) })}
                placeholder="Vor- und Nachname"
                maxLength={50}
                autoComplete="name"
                className="w-full px-4 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-copa-blue focus:outline-none transition-colors placeholder:text-gray-400"
                style={{ fontFamily: "var(--font-papernotes)" }}
              />
              {errors.nome && <p className="text-red-500 text-sm mt-1">{errors.nome}</p>}
            </div>

            <div>
              <label className="block text-lg font-bold mb-2 text-copa-blue" style={{ fontFamily: "var(--font-titulo)", letterSpacing: "0.15em" }}>
                FOTO DES STARS
              </label>
              {photoPreview ? (
                <div onClick={() => fileInputRef.current?.click()} className="border-2 border-copa-blue rounded-xl p-4 text-center cursor-pointer hover:opacity-90 transition-opacity">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={photoPreview} alt="Vorschau" className="w-28 h-28 rounded-full mx-auto object-cover border-4 border-copa-blue" />
                  <p className="text-xs mt-2 text-copa-blue font-bold" style={{ fontFamily: "var(--font-papernotes)" }}>Tippe, um das Foto zu ändern</p>
                </div>
              ) : (
                <div className="flex gap-3">
                  <button type="button" onClick={() => fileInputRef.current?.click()} className="flex-1 border-2 border-dashed border-gray-300 rounded-xl p-5 text-center cursor-pointer hover:border-copa-blue transition-colors">
                    <span className="text-3xl block mb-1">🖼️</span>
                    <p className="text-sm font-bold" style={{ fontFamily: "var(--font-titulo)", letterSpacing: "0.15em" }}>Galerie</p>
                  </button>
                  <button type="button" onClick={() => cameraInputRef.current?.click()} className="flex-1 border-2 border-dashed border-gray-300 rounded-xl p-5 text-center cursor-pointer hover:border-copa-blue transition-colors">
                    <span className="text-3xl block mb-1">📸</span>
                    <p className="text-sm font-bold" style={{ fontFamily: "var(--font-titulo)", letterSpacing: "0.15em" }}>Kamera</p>
                  </button>
                </div>
              )}
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
              <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" onChange={handlePhotoChange} className="hidden" />
              {errors.foto && <p className="text-red-500 text-sm mt-1">{errors.foto}</p>}
            </div>
          </div>
        )}

        {/* Schritt 2: Geburtsdatum */}
        {step === 2 && (
          <div className="flex flex-col gap-5">
            <div className="text-center">
              <span className="text-4xl mb-2 block">🎂</span>
              <h2 className="text-2xl md:text-3xl font-black text-copa-blue" style={{ fontFamily: "var(--font-titulo)" }}>
                GEBURTSDATUM
              </h2>
              <p className="text-base mt-1 opacity-70" style={{ fontFamily: "var(--font-papernotes)" }}>
                Für die Altersangabe auf der Sammelkarte
              </p>
            </div>
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block text-base font-bold mb-1 text-copa-blue" style={{ fontFamily: "Arial, sans-serif" }}>TAG</label>
                <select
                  value={birthDay}
                  onChange={(e) => {
                    setBirthDay(e.target.value);
                    if (e.target.value && birthMonth && birthYear) {
                      updateData({ dataNascimento: `${birthYear}-${birthMonth}-${e.target.value}` });
                    }
                  }}
                  className="w-full px-3 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-copa-blue focus:outline-none transition-colors bg-white cursor-pointer"
                  style={{ fontFamily: "var(--font-papernotes)" }}
                >
                  <option value="">--</option>
                  {Array.from({ length: 31 }, (_, i) => (
                    <option key={i + 1} value={String(i + 1).padStart(2, "0")}>{i + 1}</option>
                  ))}
                </select>
              </div>
              <div className="flex-[1.3]">
                <label className="block text-base font-bold mb-1 text-copa-blue" style={{ fontFamily: "Arial, sans-serif" }}>MONAT</label>
                <select
                  value={birthMonth}
                  onChange={(e) => {
                    setBirthMonth(e.target.value);
                    if (birthDay && e.target.value && birthYear) {
                      updateData({ dataNascimento: `${birthYear}-${e.target.value}-${birthDay}` });
                    }
                  }}
                  className="w-full px-3 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-copa-blue focus:outline-none transition-colors bg-white cursor-pointer"
                  style={{ fontFamily: "var(--font-papernotes)" }}
                >
                  <option value="">--</option>
                  {["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"].map((m, i) => (
                    <option key={i} value={String(i + 1).padStart(2, "0")}>{m}</option>
                  ))}
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-base font-bold mb-1 text-copa-blue" style={{ fontFamily: "Arial, sans-serif" }}>JAHR</label>
                <select
                  value={birthYear}
                  onChange={(e) => {
                    setBirthYear(e.target.value);
                    if (birthDay && birthMonth && e.target.value) {
                      updateData({ dataNascimento: `${e.target.value}-${birthMonth}-${birthDay}` });
                    }
                  }}
                  className="w-full px-3 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-copa-blue focus:outline-none transition-colors bg-white cursor-pointer"
                  style={{ fontFamily: "var(--font-papernotes)" }}
                >
                  <option value="">--</option>
                  {Array.from({ length: new Date().getFullYear() - 1920 + 1 }, (_, i) => new Date().getFullYear() - i).map((y) => (
                    <option key={y} value={String(y)}>{y}</option>
                  ))}
                </select>
              </div>
            </div>
            {errors.dataNascimento && <p className="text-red-500 text-sm mt-1">{errors.dataNascimento}</p>}

            {/* E-Mail */}
            <div>
              <p className="text-copa-blue/70 mb-1" style={{ fontFamily: "var(--font-papernotes)", fontSize: "1.8vh" }}>
                E-Mail-Adresse zum Speichern deiner Sammelkarte
              </p>
              <input
                type="email"
                value={data.email}
                onChange={(e) => updateData({ email: e.target.value.trim() })}
                placeholder="deine@email.de"
                maxLength={100}
                autoComplete="email"
                inputMode="email"
                className="w-full px-4 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-copa-blue focus:outline-none transition-colors placeholder:text-gray-400"
                style={{ fontFamily: "var(--font-papernotes)" }}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>
          </div>
        )}

        {/* Schritt 3: Verein */}
        {step === 3 && (
          <div className="flex flex-col gap-5">
            <div className="text-center">
              <span className="text-4xl mb-2 block">⭐</span>
              <h2 className="text-2xl md:text-3xl font-black text-copa-blue" style={{ fontFamily: "var(--font-titulo)" }}>
                VEREIN UND DATEN
              </h2>
              <p className="text-base mt-1 opacity-70" style={{ fontFamily: "var(--font-papernotes)" }}>
                Dein Lieblingsverein und die Daten für die Karte
              </p>
            </div>

            {/* Gewicht und Größe */}
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block text-lg font-bold mb-1 text-copa-blue" style={{ fontFamily: "var(--font-titulo)" }}>
                  GEWICHT (kg)
                </label>
                <input
                  type="number"
                  value={data.peso}
                  onChange={(e) => updateData({ peso: e.target.value })}
                  placeholder="z.B. 70"
                  min={1} max={300}
                  className="w-full px-4 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-copa-blue focus:outline-none transition-colors placeholder:text-gray-400"
                  style={{ fontFamily: "var(--font-papernotes)" }}
                />
              </div>
              <div className="flex-1">
                <label className="block text-lg font-bold mb-1 text-copa-blue" style={{ fontFamily: "var(--font-titulo)" }}>
                  GRÖSSE (cm)
                </label>
                <input
                  type="number"
                  value={data.altura}
                  onChange={(e) => updateData({ altura: e.target.value })}
                  placeholder="z.B. 175"
                  min={1} max={300}
                  className="w-full px-4 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-copa-blue focus:outline-none transition-colors placeholder:text-gray-400"
                  style={{ fontFamily: "var(--font-papernotes)" }}
                />
              </div>
            </div>

            {/* Verein */}
            <div ref={clubeRef} className="relative">
              <label className="block text-lg font-bold mb-1 text-copa-blue" style={{ fontFamily: "var(--font-titulo)" }}>
                LIEBLINGSVEREIN
              </label>
              <input
                type="text"
                value={clubeQuery}
                onChange={(e) => { const v = sanitize(e.target.value); setClubeQuery(v); updateData({ clube: v }); setShowClubeList(true); }}
                onFocus={() => setShowClubeList(true)}
                placeholder="Verein eingeben oder auswählen..."
                maxLength={50}
                className="w-full px-4 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-copa-blue focus:outline-none transition-colors placeholder:text-gray-400"
                style={{ fontFamily: "var(--font-papernotes)" }}
              />
              {showClubeList && (
                <div className="absolute z-50 w-full mt-1 bg-white border-2 border-gray-200 rounded-xl shadow-lg max-h-40 overflow-y-auto">
                  {filteredClubs.length > 0 ? filteredClubs.slice(0, 8).map((c) => (
                    <button key={c} type="button"
                      onClick={() => { setClubeQuery(c); updateData({ clube: c }); setShowClubeList(false); }}
                      className={`w-full text-left px-4 py-3 hover:bg-copa-yellow/30 transition-colors cursor-pointer ${data.clube === c ? "bg-copa-blue/10 font-bold text-copa-blue" : "text-gray-700"} first:rounded-t-xl last:rounded-b-xl`}
                      style={{ fontFamily: "var(--font-papernotes)" }}
                    >{c}</button>
                  )) : (
                    <div className="px-4 py-3 text-center" style={{ fontFamily: "var(--font-papernotes)" }}>
                      <p className="font-bold text-copa-blue">Eigener Verein</p>
                      <p className="text-sm text-gray-500">Wir verwenden &ldquo;{clubeQuery}&rdquo;</p>
                    </div>
                  )}
                </div>
              )}
              {errors.clube && <p className="text-red-500 text-sm mt-1">{errors.clube}</p>}
            </div>
          </div>
        )}

        {/* Datenschutzhinweis — nur im Schritt 1 */}
        {step === 1 && (
          <p className="text-center text-xs text-gray-400 mt-6" style={{ fontFamily: "var(--font-papernotes)" }}>
            Mit dem Absenden akzeptierst du unsere{" "}
            <span className="underline hover:text-gray-600 transition-colors cursor-default">
              Datenschutzerklärung
            </span>
          </p>
        )}

        {/* Navigationsbuttons */}
        <div className="flex gap-3 mt-4">
          {step > 1 && (
            <button onClick={onBack}
              className="flex-1 px-6 py-4 rounded-xl border-2 border-copa-blue text-copa-blue font-bold hover:bg-copa-blue hover:text-copa-white transition-all duration-200 cursor-pointer tracking-[0.15em]"
              style={{ fontFamily: "var(--font-titulo)" }}
            >ZURÜCK</button>
          )}
          <button onClick={handleNext}
            className="flex-1 text-copa-white font-bold text-lg px-6 py-4 rounded-xl shadow-lg active:scale-95 transition-all duration-200 cursor-pointer tracking-[0.15em]"
            style={{
              fontFamily: "var(--font-titulo)",
              background: "linear-gradient(135deg, #1a1a1a 0%, #000000 100%)",
              boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
            }}
          >
            {step === totalSteps ? "KARTE ERSTELLEN ⚽" : "WEITER →"}
          </button>
        </div>
      </div>

      {/* Schrittanzeige */}
      <div className="flex gap-2 mt-6">
        {Array.from({ length: totalSteps }, (_, i) => (
          <div key={i} className={`w-3 h-3 rounded-full transition-all duration-300 ${i + 1 <= step ? "bg-copa-blue scale-110" : "bg-copa-white opacity-50"}`} />
        ))}
      </div>
    </section>
  );
}
