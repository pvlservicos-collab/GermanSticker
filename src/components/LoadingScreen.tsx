"use client";

import { useState, useEffect, useRef } from "react";


interface LoadingScreenProps {
  title: string;
  gifUrl: string;
  longWait?: boolean;
  startTime?: number;
}

const curiosidades = [
  "Wusstest du? Die WM 2026 wird erstmals mit 48 Mannschaften in den USA, Mexiko und Kanada stattfinden!",
  "Wusstest du? Deutschland hat die Weltmeisterschaft 4 Mal gewonnen: 1954, 1974, 1990 und 2014.",
  "Wusstest du? Miroslav Klose ist mit 16 Toren der Rekordtorschütze bei Weltmeisterschaften.",
  "Wusstest du? Das 'Wunder von Bern' 1954 gilt als eines der größten Sportereignisse Deutschlands.",
  "Wusstest du? Deutschland besiegte Brasilien 2014 mit 7:1 – eines der spektakulärsten WM-Ergebnisse aller Zeiten.",
  "Wusstest du? Franz Beckenbauer ist der einzige Deutsche, der die WM als Spieler (1974) und Trainer (1990) gewann.",
  "Wusstest du? Oliver Kahn war einer der besten Torhüter der Welt und gewann 2002 den Goldenen Handschuh bei der WM.",
  "Wusstest du? Gerd Müller erzielte in seiner Karriere über 700 Tore und gilt als einer der besten Stürmer aller Zeiten.",
  "Wusstest du? Die Bundesliga ist eine der beliebtesten Ligen der Welt mit durchschnittlich über 40.000 Zuschauern pro Spiel.",
  "Wusstest du? Bayern München hat die Bundesliga mehr als 30 Mal gewonnen und ist damit Rekordmeister.",
  "Wusstest du? Bayer Leverkusen wurde 2023/24 zum ersten Mal Bundesligameister – und das ohne eine einzige Niederlage!",
  "Wusstest du? Borussia Dortmunds Signal Iduna Park fasst über 80.000 Zuschauer und gilt als eines der lautesten Stadien der Welt.",
  "Wusstest du? Thomas Müller ist für seine einzigartige Spielweise als 'Raumdeuter' bekannt.",
  "Wusstest du? Lothar Matthäus ist der Spieler mit den meisten WM-Einsätzen und spielte für Deutschland bei 5 Weltmeisterschaften.",
  "Wusstest du? Toni Kroos kehrte 2024 für die EM aus dem Ruhestand zurück und führte Deutschland ins Halbfinale.",
  "Wusstest du? Die Deutsche Nationalmannschaft trägt traditionell weiße Trikots und gilt als 'Die Mannschaft'.",
  "Wusstest du? Deutschland ist eines von nur drei Ländern, das sowohl bei Männern als auch bei Frauen Weltmeister wurde.",
  "Wusstest du? Der DFB (Deutscher Fußball-Bund) ist einer der größten nationalen Fußballverbände der Welt.",
  "Wusstest du? Jürgen Klinsmann erzielte bei der WM 1994 drei Tore und war einer der besten Stürmer seiner Generation.",
  "Wusstest du? Die Allianz Arena in München gehört zu den modernsten Fußballstadien der Welt.",
  "Wusstest du? Karl-Heinz Rummenigge gilt als einer der besten deutschen Fußballer der 1980er Jahre.",
  "Wusstest du? Deutschland war bei der WM 2014 in Brasilien über vier Wochen ungeschlagen und holte den Titel.",
  "Wusstest du? Der erste WM-Sieg Deutschlands war 1954 in der Schweiz gegen Ungarn mit 3:2 – das 'Wunder von Bern'.",
  "Wusstest du? Sepp Herberger ist als Trainer des Wunderteams von 1954 eine Legende des deutschen Fußballs.",
  "Wusstest du? Deutschland wurde bei der EM 1996 in England Europameister – mit einem Golden Goal von Oliver Bierhoff.",
];

export default function LoadingScreen({ title, gifUrl, longWait, startTime }: LoadingScreenProps) {
  const [percent, setPercent] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [curiosidadeIndex, setCuriosidadeIndex] = useState(0);
  const start = useRef(startTime || Date.now());


  useEffect(() => {
    start.current = startTime || Date.now();
    setPercent(0);
    setElapsed(0);
    setCuriosidadeIndex(Math.floor(Math.random() * curiosidades.length));
  }, [startTime]);

  useEffect(() => {
    if (!longWait) return;
    const interval = setInterval(() => {
      setCuriosidadeIndex((prev) => (prev + 1) % curiosidades.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [longWait]);

  useEffect(() => {
    if (!longWait) {
      const duration = 3000;
      const interval = setInterval(() => {
        const now = Date.now();
        const progress = Math.min(100, Math.round(((now - start.current) / duration) * 100));
        setPercent(progress);
        if (progress >= 100) clearInterval(interval);
      }, 50);
      return () => clearInterval(interval);
    }

    const interval = setInterval(() => {
      const now = Date.now();
      const elapsedMs = now - start.current;
      setElapsed(Math.floor(elapsedMs / 1000));

      let newPercent: number;
      if (elapsedMs < 60000) {
        newPercent = Math.round((elapsedMs / 60000) * 80);
      } else if (elapsedMs < 180000) {
        const extra = ((elapsedMs - 60000) / 120000) * 18;
        newPercent = Math.round(80 + extra);
      } else {
        newPercent = 99;
      }

      setPercent((prev) => Math.max(prev, newPercent));
    }, 200);

    return () => clearInterval(interval);
  }, [longWait]);

  return (
    <section className="flex flex-col items-center justify-center min-h-[100dvh] w-full px-4" style={{ background: "#FABD00" }}>
      <div className="w-full max-w-md bg-copa-white rounded-3xl shadow-2xl p-8 flex flex-col items-center gap-6 animate-slide-up">
        <h2
          className="text-3xl md:text-4xl font-bold text-copa-blue tracking-[0.1em] text-center"
          style={{ fontFamily: "var(--font-titulo)" }}
        >
          {title}
        </h2>

        {longWait && (
          <p className="text-sm font-bold text-copa-blue text-center -mt-4" style={{ fontFamily: "var(--font-papernotes)" }}>
            Bitte nicht schließen – dies kann bis zu 2 Minuten dauern, da wir in hoher Qualität generieren.
          </p>
        )}

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={gifUrl}
          alt="Fußballer"
          style={{ height: 260, width: "auto", borderRadius: 16, objectFit: "cover", display: "block" }}
        />

        {longWait && (
          <div className="text-center leading-snug">
            <p className="text-base font-bold text-copa-blue" style={{ fontFamily: "var(--font-papernotes)" }}>
              Hol dir deine Karte HEUTE und nimm an der Verlosung eines WM-Tickets teil!
            </p>
            <p className="text-2xl md:text-4xl font-black text-copa-green my-1" style={{ fontFamily: "var(--font-titulo)" }}>
              Weltmeisterschaft 2026
            </p>
            <p className="text-sm text-copa-blue mt-2" style={{ fontFamily: "var(--font-papernotes)" }}>
              Ziehung am 11.07.2026, WM-Beginn.
            </p>
          </div>
        )}

        <p
          className="text-base text-center min-h-[3rem] transition-opacity duration-500"
          style={{ fontFamily: "var(--font-papernotes)" }}
        >
          {longWait ? (
            <span className="text-copa-blue font-bold">{curiosidades[curiosidadeIndex]}</span>
          ) : (
            "Das ist ein echter Star!"
          )}
        </p>

        <div className="w-full">
          <div className="flex justify-between items-center mb-1">
            <div className="flex flex-col leading-tight">
              <span className="text-xs font-bold text-copa-blue" style={{ fontFamily: "var(--font-papernotes)" }}>
                {"Laden..."}
              </span>
              {longWait && (
                <span className="text-[10px] text-copa-blue/60" style={{ fontFamily: "var(--font-papernotes)" }}>
                  {elapsed}s
                </span>
              )}
            </div>
            <span className="text-sm font-bold text-copa-blue" style={{ fontFamily: "var(--font-papernotes)" }}>
              {percent}%
            </span>
          </div>
          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-copa-blue rounded-full transition-all duration-300 ease-out"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
